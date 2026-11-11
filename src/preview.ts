import { EditorSelection, findClusterBreak } from '@codemirror/state';
import {
    Decoration,
    type DecorationSet,
    EditorView,
    ViewPlugin,
    type ViewUpdate,
    WidgetType,
} from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNode } from './types.ts';
import { el, emit, hostFor } from './utils.ts';

// ---- Live preview & widgets ----

export const hide = Decoration.replace({});
export const mark = (cls: string) => Decoration.mark({ class: cls });
const bulletWidget = Decoration.replace({
    widget: new (class extends WidgetType {
        toDOM() {
            return el('span', { className: 'cm-bullet', textContent: '•' });
        }
        override eq() {
            return true;
        }
    })(),
});

class SpacerWidget extends WidgetType {
    constructor(readonly n: number) {
        super();
    }
    toDOM() {
        const s = el('span', { textContent: ' '.repeat(this.n) });
        s.style.whiteSpace = 'pre';
        return s;
    }
    override eq(o: SpacerWidget) {
        return o.n === this.n;
    }
}

export const parseImageUrl = (raw: string) => {
    const [, src = raw, width = ''] = /^([\s\S]*?)(?:#w=(\d+%?))?$/.exec(raw) || [];
    return { src, width };
};

function commitImageWidth(view: EditorView, wrap: HTMLElement, width: string) {
    const pos = view.posAtDOM(wrap);
    for (let n: SyntaxNode | null = syntaxTree(view.state).resolveInner(pos, 1); n; n = n.parent) {
        const urlNode = n.name === 'Image' && n.getChild('URL');
        if (urlNode) {
            const { src } = parseImageUrl(view.state.sliceDoc(urlNode.from, urlNode.to));
            const host = hostFor.get(view);
            if (host && !emit(host, 'ma-image-resize', { src, width, view })) return;
            const insert = width ? `${src}#w=${width}` : src;
            view.dispatch({
                changes: { from: urlNode.from, to: urlNode.to, insert },
                selection: EditorSelection.cursor(n.to + insert.length - (urlNode.to - urlNode.from)),
            });
            view.focus();
            return;
        }
    }
}

class ImageWidget extends WidgetType {
    constructor(
        readonly rawUrl: string,
        readonly alt: string
    ) {
        super();
    }
    toDOM(view: EditorView) {
        const { src, width } = parseImageUrl(this.rawUrl);
        const wrap = el('span', { className: 'cm-image-wrap' }, 'image-wrap');
        if (width) {
            wrap.style.width = width === '100%' ? 'calc(100% - 4px)' : width.endsWith('%') ? width : `${width}px`;
        }

        const img = el('img', { className: 'cm-image', src, alt: this.alt, title: this.alt, draggable: false }, 'image');
        const presets = el('span', { className: 'cm-image-presets' }, 'image-presets');
        for (const p of ['25%', '50%', '75%', '100%']) {
            const btn = el(
                'button',
                {
                    type: 'button',
                    tabIndex: -1,
                    className: 'cm-image-preset' + (width === p ? ' active' : ''),
                    textContent: p,
                },
                'image-preset'
            );
            btn.onmousedown = (e) => (e.preventDefault(), e.stopPropagation());
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!view.state.readOnly) commitImageWidth(view, wrap, width === p ? '' : p);
            };
            presets.append(btn);
        }

        const handle = el(
            'span',
            { className: 'cm-image-handle', title: 'Drag to resize (double-click to reset)' },
            'image-handle'
        );
        handle.ondblclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!view.state.readOnly) commitImageWidth(view, wrap, '');
        };
        handle.onpointerdown = (e) => {
            if (view.state.readOnly) return;
            e.preventDefault();
            e.stopPropagation();
            handle.setPointerCapture(e.pointerId);
            const startX = e.clientX;
            const startW = wrap.getBoundingClientRect().width || img.getBoundingClientRect().width;
            const maxW = (view.contentDOM.clientWidth || 800) - 28;
            let px = Math.round(startW);
            wrap.classList.add('resizing');

            handle.onpointermove = (ev) => {
                px = Math.max(32, Math.min(maxW, Math.round(startW + ev.clientX - startX)));
                wrap.style.width = `${px}px`;
            };
            handle.onpointerup = handle.onpointercancel = (ev) => {
                handle.releasePointerCapture(ev.pointerId);
                handle.onpointermove = handle.onpointerup = handle.onpointercancel = null;
                wrap.classList.remove('resizing');
                if (Math.abs(ev.clientX - startX) > 2) commitImageWidth(view, wrap, String(px));
                else view.focus();
            };
        };

        wrap.append(img, presets, handle);
        return wrap;
    }
    override eq(other: ImageWidget) {
        return this.rawUrl === other.rawUrl && this.alt === other.alt;
    }
}

const inlineStyles: Record<string, string> = {
    StrongEmphasis: 'cm-strong',
    Emphasis: 'cm-em',
    Strikethrough: 'cm-strike',
    InlineCode: 'cm-code',
    Link: 'cm-link',
};
const blockStyles: Record<string, string> = {
    Blockquote: 'cm-quote',
    FencedCode: 'cm-codeblock',
    CodeBlock: 'cm-codeblock',
};
const hiddenMarks: Record<string, string | null> = {
    EmphasisMark: null,
    StrikethroughMark: null,
    CodeMark: 'InlineCode',
    LinkMark: 'Link',
    URL: 'Link',
    LinkTitle: 'Link',
};

interface PreviewState {
    decorations: DecorationSet;
    atomic: DecorationSet;
    hidden: Array<{ from: number; to: number }>;
}

function buildDecorations(view: EditorView, alwaysHide: boolean): PreviewState {
    const { state } = view;
    const { doc } = state;
    const touches = (from: number, to: number) =>
        !alwaysHide && view.hasFocus && state.selection.ranges.some((r) => r.from <= to && r.to >= from);
    const out: ReturnType<Decoration['range']>[] = [];
    const atomic: ReturnType<Decoration['range']>[] = [];
    const rawHidden: Array<{ from: number; to: number }> = [];

    const addWidget = (dec: Decoration, from: number, to: number) => {
        const r = dec.range(from, to);
        out.push(r);
        atomic.push(r);
    };
    const addHide = (from: number, to: number) => {
        if (from < to) rawHidden.push({ from, to });
    };
    const addLines = (from: number, to: number, cls: string) => {
        for (let n = doc.lineAt(from).number, end = doc.lineAt(to).number; n <= end; n++) {
            out.push(Decoration.line({ class: cls }).range(doc.line(n).from));
        }
    };

    for (const { from, to } of view.visibleRanges) {
        syntaxTree(state).iterate({
            from,
            to,
            enter({ name, from, to, node }) {
                const parent = node.parent;
                const pName = parent?.name;
                if (name === 'Image') {
                    const urlNode = node.getChild('URL');
                    const src = urlNode && !touches(from, to) ? state.sliceDoc(urlNode.from, urlNode.to) : '';
                    if (src) {
                        const alt = /^!\[([\s\S]*?)\]/.exec(state.sliceDoc(from, to))?.[1] ?? '';
                        addWidget(Decoration.replace({ widget: new ImageWidget(src, alt) }), from, to);
                        return false;
                    }
                    out.push(mark('cm-link').range(from, to));
                } else if (/^ATXHeading[1-6]$/.test(name)) {
                    addLines(from, to, 'cm-h' + name[10]);
                } else if (blockStyles[name]) {
                    addLines(from, to, blockStyles[name]);
                } else if (inlineStyles[name]) {
                    out.push(mark(inlineStyles[name]).range(from, to));
                } else if ((name === 'HeaderMark' && pName?.startsWith('ATXHeading')) || name === 'QuoteMark') {
                    const line = doc.lineAt(from);
                    if (!touches(line.from, line.to)) addHide(from, Math.min(to + 1, line.to));
                    else if (name === 'QuoteMark') out.push(mark('cm-mark').range(from, to));
                } else if (
                    name in hiddenMarks &&
                    (hiddenMarks[name] ? pName === hiddenMarks[name] : pName && pName in inlineStyles)
                ) {
                    if (parent && !touches(parent.from, parent.to)) addHide(from, to);
                } else if (name === 'ListMark') {
                    const line = doc.lineAt(from);
                    const isBullet = parent?.parent?.name === 'BulletList';
                    if (!isBullet || touches(line.from, line.to)) out.push(mark('cm-mark').range(from, to));
                    else addWidget(bulletWidget, from, to);
                }
            },
        });
    }

    // Merge contiguous/overlapping hidden ranges (e.g. `](` + `url` + `)` at the end of a link)
    rawHidden.sort((a, b) => a.from - b.from || a.to - b.to);
    const hidden: Array<{ from: number; to: number }> = [];
    for (const h of rawHidden) {
        const last = hidden[hidden.length - 1];
        if (last && h.from <= last.to) last.to = Math.max(last.to, h.to);
        else hidden.push({ ...h });
    }
    const cellPad = new Map<number, number>();
    for (const h of hidden) {
        addWidget(hide, h.from, h.to);
        // Keep table pipes aligned: pad the cell end by the hidden width
        for (let n: SyntaxNode | null = syntaxTree(state).resolveInner(h.from, 1); n; n = n.parent) {
            if (n.name === 'TableCell') {
                cellPad.set(n.to, (cellPad.get(n.to) ?? 0) + h.to - h.from);
                break;
            }
            if (n.name === 'Table') break;
        }
    }
    for (const [pos, n] of cellPad) out.push(Decoration.widget({ widget: new SpacerWidget(n), side: 1 }).range(pos));

    return {
        decorations: Decoration.set(out, true),
        atomic: Decoration.set(atomic, true),
        hidden,
    };
}

export const createPreview = (alwaysHide: boolean) =>
    ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;
            atomic: DecorationSet;
            hidden: Array<{ from: number; to: number }>;
            constructor(view: EditorView) {
                ({ decorations: this.decorations, atomic: this.atomic, hidden: this.hidden } = buildDecorations(view, alwaysHide));
            }
            update(u: ViewUpdate) {
                Object.assign(this, buildDecorations(u.view, alwaysHide));
                if (!alwaysHide || u.docChanged || !u.selectionSet) return;
                const oldSel = u.startState.selection.main;
                const newSel = u.state.selection.main;
                if (!oldSel.empty || !newSel.empty || oldSel.head === newSel.head) return;

                // If cursor just stepped over a zero-width hidden marker (0 visual movement), advance 1 visible char
                const forward = newSel.head > oldSel.head;
                const crossed = this.hidden.find((h) =>
                    forward ? oldSel.head === h.from && newSel.head === h.to : oldSel.head === h.to && newSel.head === h.from
                );
                if (!crossed) return;

                const docLen = u.state.doc.length;
                let pos = newSel.head;
                if (forward && pos < docLen) {
                    const line = u.state.doc.lineAt(pos);
                    pos = pos < line.to ? findClusterBreak(line.text, pos - line.from, true) + line.from : pos + 1;
                } else if (!forward && pos > 0) {
                    const line = u.state.doc.lineAt(pos);
                    pos = pos > line.from ? findClusterBreak(line.text, pos - line.from, false) + line.from : pos - 1;
                }
                for (const h of this.hidden) {
                    if (pos > h.from && pos < h.to) pos = forward ? h.to : h.from;
                }
                if (pos !== newSel.head) {
                    queueMicrotask(() => u.view.dispatch({ selection: EditorSelection.cursor(pos) }));
                }
            }
        },
        {
            decorations: (p) => p.decorations,
            provide: (plugin) =>
                EditorView.atomicRanges.of((view) => view.plugin(plugin)?.atomic ?? Decoration.none),
        }
    );
