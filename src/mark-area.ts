import { Compartment, EditorSelection, EditorState, type Extension } from '@codemirror/state';
import { Decoration, type DecorationSet, EditorView, ViewPlugin, drawSelection, keymap, placeholder } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { type MarkdownConfig, Strikethrough } from '@lezer/markdown';
import type { ActionId, EditorAction, MarkPlugin, UploadHandler, UploadResult } from './types.ts';
import { actionMap, defaultUpload } from './commands.ts';
import { createPreview } from './preview.ts';
import { domHandlers } from './handlers.ts';
import { getSheet, styles } from './styles.ts';
import { cellActionFor, el, emit, hostFor } from './utils.ts';

type ActionLabels = Record<string, { label?: string; title?: string }>;

const linePartDeco = Decoration.line({ attributes: { part: 'line' } });
const linePart = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet;
        constructor(view: EditorView) {
            this.decorations = this.build(view);
        }
        update(u: { view: EditorView; docChanged: boolean; viewportChanged: boolean }) {
            if (u.docChanged || u.viewportChanged) this.decorations = this.build(u.view);
        }
        build(view: EditorView): DecorationSet {
            const ranges = [];
            for (const { from, to } of view.visibleRanges) {
                for (let pos = from; pos <= to; ) {
                    const line = view.state.doc.lineAt(pos);
                    ranges.push(linePartDeco.range(line.from));
                    pos = line.to + 1;
                }
            }
            return Decoration.set(ranges, true);
        }
    },
    { decorations: (v) => v.decorations }
);

// ---- Web Component ----

export class MarkArea extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'value',
        'placeholder',
        'rows',
        'disabled',
        'readonly',
        'required',
        'hide-marks',
        'show-marks',
        'toolbar',
        'uploads',
    ];

    readonly #internals?: ElementInternals;
    readonly #root: ShadowRoot;
    readonly #slot: HTMLSlotElement;
    readonly #config = new Compartment();
    #view!: EditorView;
    #defaultValue = '';
    #syncing = false;
    #upload: UploadHandler = defaultUpload;
    #plugins: Array<MarkPlugin | Extension> = [];
    #userSheets: CSSStyleSheet[] = [];
    #managedSheets = new Set<CSSStyleSheet>();
    #buttons: HTMLButtonElement[] = [];
    #labels: ActionLabels = {};

    constructor() {
        super();
        this.#root = this.attachShadow({ mode: 'open', delegatesFocus: true });
        try {
            this.#internals = this.attachInternals?.();
        } catch {}

        const sheet = getSheet();
        if (sheet) {
            this.#managedSheets.add(sheet);
            this.#root.adoptedStyleSheets = [sheet];
        } else {
            this.#root.append(el('style', { textContent: styles }));
        }

        const bar = el('div', { role: 'toolbar' }, 'toolbar');
        const slot = el('slot', { name: 'toolbar' });
        this.#slot = slot;


        bar.append(slot);
        bar.onmousedown = (e) => e.preventDefault();
        bar.onclick = (e) => {
            const id = (e.target as Element | null)?.closest<HTMLElement>('[data-action]')?.dataset.action as
                | ActionId
                | undefined;
            if (id && !this.disabled && !this.readOnly) this.exec(id);
        };

        this.#root.append(bar);
    }

    #createToolbarButton(a: EditorAction): HTMLButtonElement {
        const l = this.#labels[a.id];
        const name = l?.title ?? a.id;
        const btn = el(
            'button',
            {
                type: 'button',
                tabIndex: -1,
                title: a.hint ? `${name} (${a.hint})` : name,
                innerHTML: a.html,
                ariaLabel: l?.label ?? name,
            },
            `button button-${a.id}`
        );
        btn.dataset.action = a.id;
        return btn;
    }

    #resolvedPlugins(): MarkPlugin[] {
        const isPlugin = (p: object): p is MarkPlugin => ['extension', 'actions', 'markdown', 'styles'].some((k) => k in p);
        return this.#plugins.filter(Boolean).map((p) => (typeof p === 'object' && isPlugin(p) ? p : { extension: p as Extension }));
    }

    #activeActions(): Map<ActionId, EditorAction> {
        const map = new Map(actionMap);
        for (const a of this.#resolvedPlugins().flatMap((p) => p.actions ?? [])) map.set(a.id, a);
        return map;
    }

    connectedCallback() {
        if (!this.#view) {
            const initial = this.getAttribute('value') ?? this.textContent?.trim() ?? '';
            this.#defaultValue = initial;

            this.#view = new EditorView({
                parent: this.#root,
                state: EditorState.create({
                    doc: initial,
                    extensions: [
                        history(),
                        drawSelection(),
                        EditorView.lineWrapping,
                        domHandlers,
                        this.#config.of(this.#dynamicExtensions()),
                        keymap.of([...defaultKeymap, ...historyKeymap]),
                        EditorView.updateListener.of((u) => {
                            if (u.docChanged && !this.#syncing) {
                                this.#updateFormValue();
                                emit(this, 'input', { value: this.value, view: u.view });
                            }
                            if (u.focusChanged && !u.view.hasFocus) {
                                this.classList.add('ma-touched');
                                emit(this, 'change', { value: this.value, view: u.view });
                            }
                        }),
                    ],
                }),
            });
            this.#view.dom.setAttribute('part', 'editor');
            this.#view.scrollDOM.setAttribute('part', 'scroller');
            hostFor.set(this.#view, this);
        }
        this.#syncConfig();
    }

    attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null) {
        if (!this.#view) return;
        if (name === 'value') this.value = newVal ?? '';
        else this.#syncConfig();
    }

    formResetCallback() {
        this.classList.remove('ma-touched');
        this.value = this.getAttribute('value') ?? this.#defaultValue;
    }

    formDisabledCallback(disabled: boolean) {
        this.disabled = disabled;
    }

    formStateRestoreCallback(state: string) {
        this.value = state;
    }

    get view(): EditorView {
        return this.#view;
    }

    get value(): string {
        return this.#view ? this.#view.state.doc.toString() : (this.getAttribute('value') ?? '');
    }
    set value(v: string) {
        if (!this.#view) {
            this.setAttribute('value', v);
            return;
        }
        const cur = this.#view.state.doc.toString();
        if (v !== cur) {
            this.#syncing = true;
            this.#view.dispatch({ changes: { from: 0, to: cur.length, insert: v } });
            this.#syncing = false;
            this.#updateFormValue();
        }
    }

    get name(): string {
        return this.getAttribute('name') ?? '';
    }
    set name(v: string) {
        this.setAttribute('name', v);
    }

    get placeholder(): string {
        return this.getAttribute('placeholder') ?? '';
    }
    set placeholder(v: string) {
        this.setAttribute('placeholder', v);
    }

    get rows(): number {
        return Number(this.getAttribute('rows')) || 4;
    }
    set rows(v: number) {
        this.setAttribute('rows', String(v));
    }

    get disabled(): boolean {
        return this.hasAttribute('disabled');
    }
    set disabled(v: boolean) {
        this.toggleAttribute('disabled', v);
    }

    get readOnly(): boolean {
        return this.hasAttribute('readonly');
    }
    set readOnly(v: boolean) {
        this.toggleAttribute('readonly', v);
    }

    get required(): boolean {
        return this.hasAttribute('required');
    }
    set required(v: boolean) {
        this.toggleAttribute('required', v);
    }

    get hideMarks(): boolean {
        return this.hasAttribute('hide-marks');
    }
    set hideMarks(v: boolean) {
        this.toggleAttribute('hide-marks', v);
    }

    get showMarks(): boolean {
        return this.hasAttribute('show-marks');
    }
    set showMarks(v: boolean) {
        this.toggleAttribute('show-marks', v);
    }


    get plugins(): Array<MarkPlugin | Extension> {
        return this.#plugins;
    }
    set plugins(list: Array<MarkPlugin | Extension> | null | undefined) {
        this.#plugins = list ? [...list] : [];
        if (this.#view) this.#syncConfig();
    }

    get form(): HTMLFormElement | null {
        return this.#internals?.form ?? this.closest('form');
    }

    get validity(): ValidityState | undefined {
        return this.#internals?.validity;
    }

    get validationMessage(): string {
        return this.#internals?.validationMessage ?? '';
    }

    checkValidity(): boolean {
        return this.#internals?.checkValidity() ?? true;
    }

    reportValidity(): boolean {
        this.classList.add('ma-touched');
        return this.#internals?.reportValidity() ?? true;
    }

    override focus(options?: FocusOptions) {
        this.#view?.focus();
        super.focus(options);
    }

    exec(actionId: ActionId): boolean {
        const action = this.#activeActions().get(actionId);
        if (!action || !this.#view || !this.#allowed(actionId)) return false;
        if (cellActionFor.get(this.#view)?.(actionId)) return true;
        this.#view.focus();
        if (!emit(this, 'ma-action', { action: actionId, view: this.#view })) return true;
        return action.run(this.#view);
    }

    adoptStyles(...sheets: CSSStyleSheet[]) {
        this.#userSheets = sheets;
        this.#syncStyles();
    }

    #syncStyles() {
        if (!('adoptedStyleSheets' in this.#root)) return;
        const base = getSheet();
        const pluginSheets: CSSStyleSheet[] = [];
        for (const p of this.#resolvedPlugins()) {
            if (!p.styles) continue;
            if (typeof p.styles === 'string') {
                if (typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype) {
                    const s = new CSSStyleSheet();
                    s.replaceSync(p.styles);
                    pluginSheets.push(s);
                }
            } else {
                pluginSheets.push(p.styles);
            }
        }
        const cur = this.#root.adoptedStyleSheets;
        const external = cur.filter((s) => !this.#managedSheets.has(s));
        const managed = [
            ...(base ? [base] : []),
            ...pluginSheets,
            ...this.#userSheets,
        ];
        this.#managedSheets = new Set(managed);
        const next = [...external, ...managed];
        if (cur.length !== next.length || cur.some((s, i) => s !== next[i])) {
            this.#root.adoptedStyleSheets = next;
        }
    }

    /** Upload actions, shortcuts, drop and paste. Opt-in: `uploads` attribute present and not "off". */
    get uploads(): boolean {
        const v = this.getAttribute('uploads');
        return v !== null && v !== 'off';
    }
    set uploads(v: boolean) {
        this.toggleAttribute('uploads', v);
    }

    /** Space-separated action ids shown in the toolbar, in order. Null shows all actions. */
    get toolbar(): string[] | null {
        return this.getAttribute('toolbar')?.split(/\s+/).filter(Boolean) ?? null;
    }
    set toolbar(v: string[] | null) {
        if (v) this.setAttribute('toolbar', v.join(' '));
        else this.removeAttribute('toolbar');
    }

    /** Per-action `title` and `label` (aria-label) overrides keyed by action id. */
    get labels(): ActionLabels {
        return this.#labels;
    }
    set labels(v: ActionLabels | null | undefined) {
        this.#labels = v ?? {};
        if (this.#view) this.#syncToolbar();
    }

    #allowed(id: string) {
        return this.uploads || (id !== 'image' && id !== 'file');
    }

    get upload(): UploadHandler {
        return this.#upload;
    }
    set upload(fn: UploadHandler | null | undefined) {
        this.#upload = fn ?? defaultUpload;
    }

    pickFiles(kind: 'image' | 'file' = 'file') {
        if (this.disabled || this.readOnly) return;
        const input = el('input', {
            type: 'file',
            multiple: true,
            accept: kind === 'image' ? 'image/*' : (this.getAttribute('accept') ?? '*/*'),
        });
        input.onchange = () => {
            if (input.files?.length) void this.uploadFiles(input.files, kind);
        };
        input.click();
    }

    async uploadFiles(files: Iterable<File> | ArrayLike<File>, kind?: 'image' | 'file'): Promise<void> {
        if (!this.#view || this.disabled || this.readOnly) return;
        const list = Array.from(files);
        if (!list.length) return;

        this.toggleAttribute('uploading', true);
        try {
            const snippets: string[] = [];
            for (const file of list) {
                const fileKind: 'image' | 'file' =
                    kind === 'image' || (kind !== 'file' && file.type.startsWith('image/')) ? 'image' : 'file';
                const detail = {
                    file,
                    kind: fileKind,
                    result: undefined as Promise<UploadResult> | UploadResult | undefined,
                };
                if (!emit(this, 'ma-upload', detail)) continue;
                const res = await (detail.result ?? this.#upload(file, fileKind));
                const url = typeof res === 'string' ? res : res.url;
                const name = ((typeof res === 'object' && res.name) || file.name || 'file').replace(/[\[\]]/g, '');
                snippets.push(fileKind === 'image' ? `![${name}](${url})` : `[${name}](${url})`);
            }
            if (!snippets.length) return;
            const insert = snippets.join('\n');
            const { from, to } = this.#view.state.selection.main;
            this.#view.dispatch({
                changes: { from, to, insert },
                selection: EditorSelection.cursor(from + insert.length),
            });
            this.#view.focus();
            emit(this, 'ma-uploaded', { snippets, files: list, view: this.#view });
        } finally {
            this.toggleAttribute('uploading', false);
        }
    }

    #dynamicExtensions() {
        const plugins = this.#resolvedPlugins();
        const mdConfigs: MarkdownConfig[] = [Strikethrough];
        const pluginExts: Extension[] = [];
        for (const p of plugins) {
            if (p.markdown) mdConfigs.push(p.markdown);
            if (p.extension) pluginExts.push(p.extension);
        }
        const activeActions = Array.from(this.#activeActions().values());
        return [
            markdown({ extensions: mdConfigs }),
            keymap.of(
                activeActions
                    .filter((a) => a.key && this.#allowed(a.id))
                    .map((a) => ({ key: a.key!, run: () => this.exec(a.id), preventDefault: true }))
            ),
            ...pluginExts,
            createPreview(this.showMarks ? 'show' : this.hideMarks ? 'hide' : 'auto'),
            EditorView.editable.of(!this.disabled && !this.readOnly),
            EditorState.readOnly.of(this.readOnly),
            this.placeholder ? placeholder(this.placeholder) : [],
            linePart,
            EditorView.contentAttributes.of({
                part: 'content',
                'aria-multiline': 'true',
                'aria-required': String(this.required),
            }),
        ];
    }

    #syncToolbar() {
        for (const b of this.#buttons) b.remove();
        const map = this.#activeActions();
        const ids = this.toolbar ?? [...map.keys()];
        this.#buttons = ids
            .map((id) => map.get(id as ActionId))
            .filter((a): a is EditorAction => !!a && this.#allowed(a.id))
            .map((a) => this.#createToolbarButton(a));
        this.#slot.append(...this.#buttons);
    }

    #syncConfig() {
        this.style.setProperty('--ma-rows', String(this.rows));
        this.#syncToolbar();
        this.#syncStyles();
        this.#view?.dispatch({ effects: this.#config.reconfigure(this.#dynamicExtensions()) });
        this.#updateFormValue();
    }

    #updateFormValue() {
        if (!this.#internals) return;
        const val = this.value;
        this.#internals.setFormValue(val);
        this.#internals.setValidity(
            this.required && !this.disabled && !val.trim() ? { valueMissing: true } : {},
            this.getAttribute('required-message') || 'Please fill out this field.',
            this.#view?.contentDOM
        );
    }
}

export function defineMarkArea(tagName = 'mark-area') {
    if (typeof customElements !== 'undefined' && !customElements.get(tagName)) {
        customElements.define(tagName, MarkArea);
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'mark-area': MarkArea;
    }
}
