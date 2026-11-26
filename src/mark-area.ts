import { Compartment, EditorSelection, EditorState, type Extension } from '@codemirror/state';
import { EditorView, drawSelection, keymap, placeholder } from '@codemirror/view';
import { history, historyKeymap, standardKeymap } from '@codemirror/commands';
import { Language } from '@codemirror/language';
// Not `markdown()`: it bundles the HTML, CSS and JS grammars even when unused.
import {
    commonmarkLanguage,
    deleteMarkupBackward,
    insertNewlineContinueMarkup,
    pasteURLAsLink,
} from '@codemirror/lang-markdown';
import { type MarkdownExtension, type MarkdownParser, Strikethrough } from '@lezer/markdown';
import type { ActionId, EditorAction, MarkPlugin, UploadHandler } from './types.ts';
import {
    actionInterceptor,
    defaultStrings,
    markAreaHost,
    marksMode,
    strings,
    type MarkAreaHost,
    type MarksMode,
    type Strings,
    type UploadKind,
} from './host.ts';
import { actionMap, markModes, modeAction } from './commands.ts';
import { linePart, preview } from './preview.ts';
import { domHandlers } from './handlers.ts';
import { getSheet, styles } from './styles.ts';
import { defaultUpload, uploadOne, uploadSnippets, whileUploading } from './upload.ts';
import { el, emit } from './utils.ts';

type ActionLabels = Record<string, { label?: string; title?: string }>;

/** Reconfigurable parts of the editor; each lives in its own compartment. */
type Part = 'history' | 'strings' | 'keys' | 'plugins' | 'marks' | 'state' | 'attrs';
const PARTS: Part[] = ['history', 'strings', 'keys', 'plugins', 'marks', 'state', 'attrs'];
const pluginSheetCache = new Map<string, CSSStyleSheet>();
const isPlugin = (p: object): p is MarkPlugin => ['extension', 'actions', 'markdown', 'styles'].some((k) => k in p);

/**
 * What `markdown({ extensions })` builds, minus its HTML support. Keeps the language data of
 * `@codemirror/lang-markdown`, which its list commands and paste handler check for.
 */
const markdownLanguage = (extensions: MarkdownExtension[]) =>
    new Language(commonmarkLanguage.data, (commonmarkLanguage.parser as MarkdownParser).configure(extensions), [], 'markdown');

// ---- Web Component ----

export class MarkArea extends HTMLElement implements MarkAreaHost {
    static formAssociated = true;
    static observedAttributes = [
        'value',
        'placeholder',
        'rows',
        'disabled',
        'readonly',
        'required',
        'required-message',
        'marks',
        'hide-marks',
        'show-marks',
        'toolbar',
        'uploads',
    ];

    readonly #internals?: ElementInternals;
    readonly #root: ShadowRoot;
    readonly #slot: HTMLSlotElement;
    readonly #compartments = Object.fromEntries(PARTS.map((p) => [p, new Compartment()])) as Record<Part, Compartment>;
    #view?: EditorView;
    /** Editor state kept while the element is disconnected (the view is destroyed to release its listeners). */
    #state?: EditorState;
    #defaultValue = '';
    #syncing = false;
    #upload: UploadHandler = defaultUpload;
    #plugins: Array<MarkPlugin | Extension> = [];
    #resolved: MarkPlugin[] = [];
    #userSheets: CSSStyleSheet[] = [];
    #managedSheets = new Set<CSSStyleSheet>();
    #fallbackStyles: HTMLStyleElement[] = [];
    #buttons: HTMLButtonElement[] = [];
    #labels: ActionLabels = {};
    #strings: Partial<Strings> = {};
    /** Insertion ranges of running uploads, mapped through edits made meanwhile. */
    #pending = new Set<{ from: number; to: number }>();

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
            if (id) this.exec(id);
        };

        // Native `input` events of the editable DOM would reach listeners in addition to the element's own.
        this.#root.addEventListener('input', (e) => e.stopPropagation());
        this.#root.append(bar);
    }

    #createToolbarButton(a: EditorAction): HTMLButtonElement {
        const l = this.#labels[a.id];
        const name = l?.title ?? a.label ?? a.id;
        const btn = el(
            'button',
            {
                type: 'button',
                tabIndex: -1,
                title: a.hint ? `${name} (${a.hint})` : name,
                innerHTML: a.html,
                ariaLabel: l?.label ?? a.label ?? name,
            },
            `button button-${a.id}`
        );
        btn.dataset.action = a.id;
        if (a.id === 'mode') {
            const m = markModes[this.marks];
            btn.innerHTML = m.html;
            btn.title = `${name}: ${this.strings[m.label]}`;
        }
        return btn;
    }

    #activeActions(): Map<ActionId, EditorAction> {
        const map = new Map<ActionId, EditorAction>([...actionMap, ['mode', modeAction]]);
        for (const a of this.#resolved.flatMap((p) => p.actions ?? [])) map.set(a.id, a);
        return map;
    }

    #allowed(a: EditorAction) {
        return a.enabled?.(this) ?? true;
    }

    /** Builds the current extension of one part. */
    #extension(part: Part): Extension {
        switch (part) {
            case 'history':
                return history();
            case 'strings':
                return strings.of(this.#strings);
            case 'keys':
                return keymap.of(
                    [...this.#activeActions().values()]
                        .filter((a) => a.key && this.#allowed(a))
                        .map((a) => ({ key: a.key!, run: () => this.exec(a.id), preventDefault: true }))
                );
            case 'plugins':
                return [
                    markdownLanguage([Strikethrough, ...this.#resolved.flatMap((p) => p.markdown ?? [])]),
                    this.#resolved.flatMap((p) => p.extension ?? []),
                ];
            case 'marks':
                return marksMode.of(this.marks);
            case 'state':
                return [
                    EditorView.editable.of(!this.disabled && !this.readOnly),
                    EditorState.readOnly.of(this.disabled || this.readOnly),
                ];
            case 'attrs':
                return [
                    this.placeholder ? placeholder(this.placeholder) : [],
                    EditorView.contentAttributes.of({
                        part: 'content',
                        'aria-multiline': 'true',
                        'aria-required': String(this.required),
                    }),
                ];
        }
    }

    /** Reconfigures only the given parts. */
    #apply(...parts: Part[]) {
        this.#view?.dispatch({ effects: parts.map((p) => this.#compartments[p].reconfigure(this.#extension(p))) });
    }

    #createState(doc: string): EditorState {
        const part = (p: Part) => this.#compartments[p].of(this.#extension(p));
        return EditorState.create({
            doc,
            extensions: [
                part('history'),
                drawSelection(),
                EditorView.lineWrapping,
                domHandlers,
                markAreaHost.of(this),
                part('strings'),
                part('keys'),
                part('plugins'),
                part('marks'),
                preview,
                part('state'),
                part('attrs'),
                linePart,
                keymap.of([
                    { key: 'Enter', run: insertNewlineContinueMarkup },
                    { key: 'Backspace', run: deleteMarkupBackward },
                    ...standardKeymap,
                    ...historyKeymap,
                ]),
                pasteURLAsLink,
                EditorView.updateListener.of((u) => {
                    if (u.docChanged) {
                        for (const p of this.#pending) {
                            p.from = u.changes.mapPos(p.from, 1);
                            p.to = Math.max(p.from, u.changes.mapPos(p.to, 1));
                        }
                        if (!this.#syncing) {
                            this.#updateFormValue();
                            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                        }
                    }
                    if (u.focusChanged && !u.view.hasFocus) {
                        this.classList.add('ma-touched');
                        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
                    }
                }),
            ],
        });
    }

    /**
     * Takes over a child `<textarea>` (the no-JS fallback): copies its attributes the host lacks, except `class`,
     * removes it so it is not submitted twice, and returns its value.
     */
    #adoptTextarea(): string | undefined {
        const ta = this.querySelector(':scope > textarea');
        if (!(ta instanceof HTMLTextAreaElement)) return undefined;
        for (const { name, value } of ta.attributes) {
            if (name !== 'class' && !this.hasAttribute(name)) this.setAttribute(name, value);
        }
        ta.remove();
        return ta.value;
    }

    connectedCallback() {
        if (!this.#view) {
            const restored = this.#state;
            if (!restored) {
                const adopted = this.#adoptTextarea();
                this.#defaultValue = this.getAttribute('value') ?? adopted ?? this.textContent?.trim() ?? '';
            }
            this.#view = new EditorView({ parent: this.#root, state: restored ?? this.#createState(this.#defaultValue) });
            this.#state = undefined;
            this.#view.dom.setAttribute('part', 'editor');
            this.#view.scrollDOM.setAttribute('part', 'scroller');
            // Attributes and properties may have changed while disconnected.
            if (restored) this.#apply(...PARTS);
        }
        this.style.setProperty('--ma-rows', String(this.rows));
        this.#syncToolbar();
        this.#syncStyles();
        this.#updateFormValue();
    }

    disconnectedCallback() {
        // Deferred so a DOM move (remove + insert in the same task) keeps the live view.
        queueMicrotask(() => {
            if (this.isConnected || !this.#view) return;
            this.#state = this.#view.state;
            this.#view.destroy();
            this.#view = undefined;
        });
    }

    attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null) {
        if (!this.#view && !this.#state) return;
        switch (name) {
            case 'value':
                this.value = newVal ?? '';
                break;
            case 'rows':
                this.style.setProperty('--ma-rows', String(this.rows));
                break;
            case 'toolbar':
                this.#syncToolbar();
                break;
            case 'placeholder':
                this.#apply('attrs');
                break;
            case 'required':
            case 'required-message':
                this.#apply('attrs');
                this.#updateFormValue();
                break;
            case 'disabled':
            case 'readonly':
                this.#apply('state');
                this.#updateFormValue();
                break;
            case 'uploads':
                this.#apply('keys');
                this.#syncToolbar();
                break;
            default:
                // marks, hide-marks, show-marks
                this.#apply('marks');
                this.#syncToolbar();
        }
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

    /** The CodeMirror view; undefined before the first connect and while disconnected. */
    get view(): EditorView | undefined {
        return this.#view;
    }

    get value(): string {
        return (this.#view?.state ?? this.#state)?.doc.toString() ?? this.getAttribute('value') ?? '';
    }
    /** Replaces the document and, like a native `<textarea>`, clears the undo history. */
    set value(v: string) {
        const state = this.#view?.state ?? this.#state;
        if (!state) {
            this.setAttribute('value', v);
            return;
        }
        if (v === state.doc.toString()) return;
        const tr = state.update({
            changes: { from: 0, to: state.doc.length, insert: v },
            effects: this.#compartments.history.reconfigure([]),
        });
        if (this.#view) {
            this.#syncing = true;
            this.#view.dispatch(tr);
            this.#syncing = false;
            this.#apply('history');
        } else {
            for (const p of this.#pending) {
                p.from = tr.changes.mapPos(p.from, 1);
                p.to = Math.max(p.from, tr.changes.mapPos(p.to, 1));
            }
            this.#state = tr.state;
        }
        this.#updateFormValue();
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

    /** Markup display: `auto` (code on enter), `hide` (WYSIWYG only) or `show` (code only). */
    get marks(): MarksMode {
        const v = this.getAttribute('marks');
        if (v === 'auto' || v === 'hide' || v === 'show') return v;
        return this.hasAttribute('show-marks') ? 'show' : this.hasAttribute('hide-marks') ? 'hide' : 'auto';
    }
    set marks(v: MarksMode) {
        this.setAttribute('marks', v);
    }

    /** @deprecated Use `marks = 'hide'`. Ignored while the `marks` attribute is set. */
    get hideMarks(): boolean {
        return this.marks === 'hide';
    }
    set hideMarks(v: boolean) {
        this.toggleAttribute('hide-marks', v);
    }

    /** @deprecated Use `marks = 'show'`. Ignored while the `marks` attribute is set. */
    get showMarks(): boolean {
        return this.marks === 'show';
    }
    set showMarks(v: boolean) {
        this.toggleAttribute('show-marks', v);
    }

    get plugins(): Array<MarkPlugin | Extension> {
        return this.#plugins;
    }
    set plugins(list: Array<MarkPlugin | Extension> | null | undefined) {
        this.#plugins = list ? [...list] : [];
        this.#resolved = this.#plugins
            .filter(Boolean)
            .map((p) => (typeof p === 'object' && isPlugin(p) ? p : { extension: p as Extension }));
        if (!this.#view) return;
        this.#apply('plugins', 'keys');
        this.#syncToolbar();
        this.#syncStyles();
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
        const view = this.#view;
        const action = this.#activeActions().get(actionId);
        if (!action || !view || !this.#allowed(action)) return false;
        if (this.disabled || (this.readOnly && actionId !== 'mode')) return false;
        if (!emit(this, 'ma-action', { action: actionId, view })) return true;
        for (const fn of view.state.facet(actionInterceptor)) if (fn(view, actionId)) return true;
        view.focus();
        return action.run(view);
    }

    adoptStyles(...sheets: CSSStyleSheet[]) {
        this.#userSheets = sheets;
        this.#syncStyles();
    }

    #syncStyles() {
        const canAdopt =
            'adoptedStyleSheets' in this.#root && typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype;
        if (!canAdopt) {
            for (const s of this.#fallbackStyles) s.remove();
            this.#fallbackStyles = this.#resolved
                .filter((p): p is MarkPlugin & { styles: string } => typeof p.styles === 'string' && !!p.styles)
                .map((p) => el('style', { textContent: p.styles }));
            this.#root.append(...this.#fallbackStyles);
            return;
        }
        const base = getSheet();
        const pluginSheets: CSSStyleSheet[] = [];
        for (const p of this.#resolved) {
            if (!p.styles) continue;
            if (typeof p.styles === 'string') {
                let s = pluginSheetCache.get(p.styles);
                if (!s) {
                    s = new CSSStyleSheet();
                    s.replaceSync(p.styles);
                    pluginSheetCache.set(p.styles, s);
                }
                pluginSheets.push(s);
            } else {
                pluginSheets.push(p.styles);
            }
        }
        const cur = this.#root.adoptedStyleSheets;
        const external = cur.filter((s) => !this.#managedSheets.has(s));
        const managed = [...(base ? [base] : []), ...pluginSheets, ...this.#userSheets];
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

    /** All user-facing strings outside the toolbar; assign a partial map to override (see `defaultStrings`). */
    get strings(): Strings {
        return { ...defaultStrings, ...this.#strings };
    }
    set strings(v: Partial<Strings> | null | undefined) {
        this.#strings = v ?? {};
        if (!this.#view) return;
        this.#apply('strings');
        this.#syncToolbar();
        this.#updateFormValue();
    }

    get upload(): UploadHandler {
        return this.#upload;
    }
    set upload(fn: UploadHandler | null | undefined) {
        this.#upload = fn ?? defaultUpload;
    }

    /** POST endpoint for uploads (multipart field `file`). Used when no custom `upload` is set. */
    get uploadUrl(): string | null {
        return this.getAttribute('upload-url');
    }
    set uploadUrl(v: string | null) {
        if (v == null) this.removeAttribute('upload-url');
        else this.setAttribute('upload-url', v);
    }

    /** CSRF token sent as `X-CSRF-Token`. Falls back to `<meta name="csrf-token">`. */
    get csrfToken(): string | null {
        return (
            this.getAttribute('csrf-token') ??
            document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ??
            null
        );
    }
    set csrfToken(v: string | null) {
        if (v == null) this.removeAttribute('csrf-token');
        else this.setAttribute('csrf-token', v);
    }

    pickFiles(kind: UploadKind = 'file') {
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

    /** Uploads a single image and returns its URL (null when uploads are off, cancelled or failed). Used by custom blocks. */
    async uploadImage(file: File): Promise<string | null> {
        if (!this.uploads || this.disabled || this.readOnly) return null;
        return whileUploading(this, async () => (await uploadOne(this, file, 'image'))?.url ?? null);
    }

    /** Uploads `files` and inserts their Markdown where the selection was when the upload started. */
    async uploadFiles(files: Iterable<File> | ArrayLike<File>, kind?: UploadKind): Promise<void> {
        if (!this.#view || !this.uploads || this.disabled || this.readOnly) return;
        const list = Array.from(files);
        if (!list.length) return;

        const { from, to } = this.#view.state.selection.main;
        const at = { from, to };
        this.#pending.add(at);
        try {
            const snippets = await whileUploading(this, () => uploadSnippets(this, list, kind));
            const view = this.#view;
            if (!snippets.length || !view || this.disabled || this.readOnly) return;
            const len = view.state.doc.length;
            const insFrom = Math.min(at.from, len);
            const insTo = Math.min(Math.max(insFrom, at.to), len);
            const insert = snippets.join('\n');
            // Follow the insertion with the cursor unless the user moved on meanwhile.
            const sel = view.state.selection.main;
            const follow = sel.from === insFrom && sel.to === insTo;
            view.dispatch({
                changes: { from: insFrom, to: insTo, insert },
                selection: follow ? EditorSelection.cursor(insFrom + insert.length) : undefined,
            });
            view.focus();
            emit(this, 'ma-uploaded', { snippets, files: list, view });
        } finally {
            this.#pending.delete(at);
        }
    }

    #syncToolbar() {
        for (const b of this.#buttons) b.remove();
        const map = this.#activeActions();
        const ids = this.toolbar ?? [...map.keys()].filter((id) => id !== 'mode');
        this.#buttons = ids
            .map((id) => map.get(id as ActionId))
            .filter((a): a is EditorAction => !!a && this.#allowed(a))
            .map((a) => this.#createToolbarButton(a));
        this.#slot.append(...this.#buttons);
    }

    #updateFormValue() {
        if (!this.#internals) return;
        const val = this.value;
        this.#internals.setFormValue(val);
        this.#internals.setValidity(
            this.required && !this.disabled && !val.trim() ? { valueMissing: true } : {},
            this.getAttribute('required-message') || this.strings.required,
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
