import { EditorSelection, type EditorState, StateField } from '@codemirror/state';
import { Decoration, type DecorationSet, EditorView, ViewPlugin, type ViewUpdate, WidgetType } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { hide } from '../preview.ts';
import { cellActionFor, el, hostFor } from '../utils.ts';
import { cursorCell, formatMarkdownTable, nextCell, parseMarkdownTable, rewriteTable, tableAt, type ParsedTable, type TableAlign, type TableData } from './core.ts';

type Focus = { r: number; c: number; offset?: number };
export type TableEdit = TableData & { focus?: Focus };

/** Toolbar button for the WYSIWYG table. `col` and `row` refer to the last focused cell (row 0 is the header, -1 if none). */
export interface TableToolbarItem {
    id: string;
    title: string;
    /** Button text */
    label: string;
    run: (t: ParsedTable, col: number, row: number) => TableEdit;
}

const ALIGN_ORDER: TableAlign[] = [null, 'left', 'center', 'right'];

export const defaultTableToolbar: TableToolbarItem[] = [
    {
        id: 'row-add',
        title: 'Add row',
        label: '+ Row',
        run: (t) => ({ ...t, rows: [...t.rows, t.headers.map(() => '')], focus: { r: t.rows.length + 1, c: 0 } }),
    },
    {
        id: 'row-remove',
        title: 'Remove last row',
        label: '- Row',
        run: (t) => ({ ...t, rows: t.rows.length > 1 ? t.rows.slice(0, -1) : t.rows }),
    },
    {
        id: 'col-add',
        title: 'Add column',
        label: '+ Col',
        run: (t) => ({
            headers: [...t.headers, `Col ${t.headers.length + 1}`],
            aligns: [...t.aligns, null],
            rows: t.rows.map((r) => [...r, '']),
            focus: { r: 0, c: t.headers.length },
        }),
    },
    {
        id: 'col-remove',
        title: 'Remove last column',
        label: '- Col',
        run: (t) =>
            t.headers.length > 1
                ? { headers: t.headers.slice(0, -1), aligns: t.aligns.slice(0, -1), rows: t.rows.map((r) => r.slice(0, -1)) }
                : t,
    },
    {
        id: 'align',
        title: 'Cycle alignment of the selected column',
        label: 'Align',
        run: (t, col, row) => {
            const aligns = [...t.aligns];
            aligns[col] = ALIGN_ORDER[(ALIGN_ORDER.indexOf(aligns[col] ?? null) + 1) % ALIGN_ORDER.length]!;
            return { ...t, aligns, ...(row >= 0 && { focus: { r: row, c: col } }) };
        },
    },
];

/** Button bar shared by the WYSIWYG widget and the raw-table toolbar. */
const toolbarEl = (items: TableToolbarItem[], run: (item: TableToolbarItem) => void, className = '') => {
    const bar = el('div', { className: 'cm-table-controls ' + className }, 'table-controls');
    for (const item of items) {
        const b = el(
            'button',
            { type: 'button', tabIndex: -1, className: 'cm-table-btn', textContent: item.label, title: item.title, ariaLabel: item.title },
            'table-button'
        );
        b.dataset.tableAction = item.id;
        b.onmousedown = (e) => (e.preventDefault(), e.stopPropagation());
        b.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            run(item);
        };
        bar.append(b);
    }
    return bar;
};

class RawToolbarWidget extends WidgetType {
    constructor(readonly items: TableToolbarItem[]) {
        super();
    }
    override eq(o: RawToolbarWidget) {
        return o.items === this.items;
    }
    toDOM(view: EditorView) {
        return toolbarEl(
            this.items,
            (item) => {
                const head = view.state.selection.main.head;
                const t = !view.state.readOnly && tableAt(view.state, head);
                if (!t) return;
                const { row, col } = cursorCell(view.state, t, head);
                const next = item.run(t, col, row);
                rewriteTable(view, t, next, next.focus?.r ?? row, next.focus?.c ?? col);
                view.focus();
            },
            'cm-table-controls-raw'
        );
    }
}

/** Toolbar above the raw Markdown table containing the cursor (inline and preview variants). */
export const tableRawToolbar = (items = defaultTableToolbar) =>
    StateField.define<DecorationSet>({
        create: (state) => rawToolbarDecos(state, items),
        update: (_, tr) => rawToolbarDecos(tr.state, items),
        provide: (f) => EditorView.decorations.from(f),
    });

const rawToolbarDecos = (state: EditorState, items: TableToolbarItem[]) => {
    const t = !state.readOnly && tableAt(state, state.selection.main.head);
    return t ? Decoration.set(Decoration.widget({ widget: new RawToolbarWidget(items), block: true, side: 1 }).range(t.to)) : Decoration.none;
};

const renderInlineCell = (cell: HTMLElement, raw: string) => {
    cell.textContent = '';
    let last = 0;
    for (const m of raw.matchAll(/\*\*([^*]+)\*\*|\*([^*]+)\*|~~([^~]+)~~|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g)) {
        cell.append(
            raw.slice(last, m.index),
            m[1] ? el('strong', { textContent: m[1] })
            : m[2] ? el('em', { textContent: m[2] })
            : m[3] ? el('s', { textContent: m[3] })
            : m[4] ? el('code', { className: 'cm-code', textContent: m[4] })
            : el('a', { className: 'cm-link', href: m[6]!, textContent: m[5]! })
        );
        last = m.index + m[0].length;
    }
    cell.append(raw.slice(last));
};

/** `window.getSelection()` does not expose ranges inside shadow roots in Chromium, the root does. */
const selectionOf = (node: Node): Selection | null =>
    (node.getRootNode() as unknown as { getSelection?: () => Selection | null }).getSelection?.() ?? window.getSelection?.() ?? null;

/** Character offset of `(node, offset)` within `cell`'s text. */
const textOffset = (cell: Node, node: Node, offset: number) => {
    const r = document.createRange();
    r.selectNodeContents(cell);
    r.setEnd(node, offset);
    return r.toString().length;
};

const hideMarksOf = (view: EditorView) => !!hostFor.get(view)?.hideMarks;

const inlineTags: Record<string, string> = { STRONG: '**', B: '**', EM: '*', I: '*', S: '~~', STRIKE: '~~', DEL: '~~', CODE: '`' };
const actionTags: Record<string, string> = { bold: 'strong', italic: 'em', strike: 's', code: 'code' };
const actionMarkers: Record<string, string> = { bold: '**', italic: '*', strike: '~~', code: '`' };

/** Serializes a rendered cell back to inline markdown. */
const cellToMarkdown = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
    if (!(node instanceof HTMLElement)) return '';
    if (node.tagName === 'BR') return ' ';
    const inner = Array.from(node.childNodes).map(cellToMarkdown).join('');
    const m = inlineTags[node.tagName];
    if (m) return inner ? m + inner + m : '';
    if (node.tagName === 'A') return `[${inner}](${node.getAttribute('href') ?? ''})`;
    return inner;
};

/** Applies a toolbar action to the focused WYSIWYG table cell. Returns false when no cell is focused. */
export function applyCellAction(view: EditorView, id: string): boolean {
    const sel = selectionOf(view.dom);
    const anchor = sel?.anchorNode;
    const cell =
        anchor && view.dom.contains(anchor)
            ? (anchor instanceof HTMLElement ? anchor : anchor.parentElement)?.closest<HTMLElement>('.cm-table-wysiwyg [data-row]')
            : null;
    if (!sel || !cell) return false;
    const marker = actionMarkers[id];
    if (!marker && id !== 'link') return true;

    // Expand a collapsed caret to the surrounding word
    const range = sel.getRangeAt(0);
    if (range.collapsed && range.startContainer.nodeType === Node.TEXT_NODE) {
        const text = range.startContainer.textContent ?? '';
        const isWord = (ch = '') => /[\p{L}\p{N}_]/u.test(ch);
        let s = range.startOffset;
        let e = s;
        while (s > 0 && isWord(text[s - 1])) s--;
        while (e < text.length && isWord(text[e])) e++;
        range.setStart(range.startContainer, s);
        range.setEnd(range.startContainer, e);
    }

    if (!hideMarksOf(view)) {
        // Raw mode: toggle markers in the cell text
        const a = textOffset(cell, range.startContainer, range.startOffset);
        const b = textOffset(cell, range.endContainer, range.endOffset);
        const text = cell.textContent ?? '';
        const len = marker?.length ?? 0;
        const around =
            marker && text.slice(a - len, a) === marker && text.slice(b, b + len) === marker && (marker !== '*' || (text[a - 2] !== '*' && text[b + 1] !== '*'));
        const inside = marker && !around && b - a >= len * 2 && text.slice(a, a + len) === marker && text.slice(b - len, b) === marker;
        if (around || inside) {
            const from = around ? a - len : a;
            const to = around ? b + len : b;
            cell.textContent = text.slice(0, from) + text.slice(from + len, to - len) + text.slice(to);
            if (cell.firstChild) sel.setBaseAndExtent(cell.firstChild, from, cell.firstChild, to - len * 2);
            return true;
        }
        const [open, close] = marker ? [marker, marker] : ['[', '](https://)'];
        cell.textContent = text.slice(0, a) + open + text.slice(a, b) + close + text.slice(b);
        if (cell.firstChild) sel.setBaseAndExtent(cell.firstChild, a + open.length, cell.firstChild, b + open.length);
        return true;
    }

    // Rendered mode: unwrap if inside the target element, otherwise wrap the selection
    const tag = marker ? actionTags[id]! : 'a';
    for (let n: Node | null = range.commonAncestorContainer; n && n !== cell; n = n.parentNode) {
        if (n instanceof HTMLElement && (n.tagName.toLowerCase() === tag || (marker && inlineTags[n.tagName] === marker))) {
            const kids = Array.from(n.childNodes);
            n.replaceWith(...kids);
            if (kids.length) {
                const r = document.createRange();
                r.setStartBefore(kids[0]!);
                r.setEndAfter(kids[kids.length - 1]!);
                sel.removeAllRanges();
                sel.addRange(r);
            }
            return true;
        }
    }
    if (range.collapsed) return true;
    const wrapper = el(tag as 'a');
    if (tag === 'a') Object.assign(wrapper, { href: 'https://', className: 'cm-link' });
    if (tag === 'code') wrapper.className = 'cm-code';
    wrapper.append(range.extractContents());
    range.insertNode(wrapper);
    sel.selectAllChildren(wrapper);
    return true;
}

/** Returns a copy of `t` with cell `(r, c)` set to `val` (row 0 is the header). */
const withCell = (t: TableData, r: number, c: number, val: string): TableData => {
    const headers = [...t.headers];
    const rows = t.rows.map((row) => [...row]);
    if (r === 0) headers[c] = val;
    else if (rows[r - 1]) rows[r - 1]![c] = val;
    return { headers, aligns: t.aligns, rows };
};

const focusCell = (root: Node, { r, c, offset }: Focus) =>
    requestAnimationFrame(() => {
        const target = (root as ParentNode).querySelector?.<HTMLElement>(`.cm-table-wysiwyg [data-row="${r}"][data-col="${c}"]`);
        if (!target) return;
        target.focus();
        const sel = selectionOf(target);
        if (!sel) return;
        sel.selectAllChildren(target);
        sel.collapseToEnd();
        const node = target.firstChild;
        if (offset !== undefined && node?.nodeType === Node.TEXT_NODE) sel.collapse(node, Math.min(offset, node.textContent!.length));
    });

class TableWidget extends WidgetType {
    constructor(
        readonly raw: string,
        readonly t: TableData,
        readonly interactive: boolean,
        readonly toolbar: TableToolbarItem[],
        readonly hide: boolean
    ) {
        super();
    }
    override eq(other: TableWidget) {
        return this.raw === other.raw && this.interactive === other.interactive && this.hide === other.hide;
    }
    toDOM(view: EditorView) {
        const { headers, aligns, rows } = this.t;
        const wrap = el('div', { className: 'cm-table-widget' + (this.interactive ? ' cm-table-wysiwyg' : '') }, 'table-wrap');
        const resolve = () => tableAt(view.state, view.posAtDOM(wrap));

        const commit = (edit: (t: ParsedTable) => TableEdit) => {
            const cur = !view.state.readOnly && resolve();
            if (!cur) return;
            const root = wrap.getRootNode();
            const next = edit(cur);
            const insert = formatMarkdownTable(next);
            if (insert !== view.state.sliceDoc(cur.from, cur.to)) view.dispatch({ changes: { from: cur.from, to: cur.to, insert } });
            if (next.focus) focusCell(root, next.focus);
        };

        let last: Required<Focus> | null = null;
        const saveCaret = (cell: HTMLElement, r: number, c: number) => {
            const sel = selectionOf(cell);
            if (sel?.anchorNode && cell.contains(sel.anchorNode)) last = { r, c, offset: textOffset(cell, sel.anchorNode, sel.anchorOffset) };
        };

        const bindCell = (cell: HTMLTableCellElement, r: number, c: number, text: string) => {
            if (aligns[c]) cell.style.textAlign = aligns[c];
            cell.dataset.row = String(r);
            cell.dataset.col = String(c);
            renderInlineCell(cell, text);

            if (!this.interactive) {
                cell.onmousedown = (e) => {
                    if (view.state.readOnly) return;
                    e.preventDefault();
                    const target = resolve()?.cellRanges[r]?.[c];
                    if (!target) return;
                    view.dispatch({ selection: EditorSelection.range(target.from, target.to) });
                    view.focus();
                };
                return;
            }

            const value = () => (this.hide ? cellToMarkdown(cell) : (cell.textContent ?? '')).replace(/\|/g, '\\|').replace(/\n+/g, ' ').trim();
            cell.contentEditable = String(!view.state.readOnly);
            cell.spellcheck = false;
            cell.onfocus = () => {
                last = { r, c, offset: last?.r === r && last.c === c ? last.offset : text.length };
                if (!this.hide && cell.textContent !== text) cell.textContent = text;
            };
            cell.onmousedown = (e) => e.stopPropagation();
            cell.onkeyup = cell.onmouseup = () => saveCaret(cell, r, c);
            cell.onkeydown = (e) => {
                e.stopPropagation();
                if (e.key === 'Escape') {
                    e.preventDefault();
                    cell.blur();
                    view.focus();
                } else if (e.key === 'Tab' || e.key === 'Enter') {
                    e.preventDefault();
                    commit((t) => {
                        const d = withCell(t, r, c, value());
                        if (e.key === 'Tab') return { ...d, focus: nextCell(d.rows, d.headers.length, r, c, e.shiftKey ? -1 : 1) };
                        if (r === d.rows.length) d.rows.push(d.headers.map(() => ''));
                        return { ...d, focus: { r: r + 1, c } };
                    });
                }
            };
            cell.onblur = () => {
                saveCaret(cell, r, c);
                const val = value();
                if (val !== text) commit((t) => withCell(t, r, c, val));
                else renderInlineCell(cell, val);
            };
        };

        const table = el('table', { className: 'cm-table' }, 'table');
        const thead = el('thead');
        const tbody = el('tbody');
        [headers, ...rows].forEach((row, r) => {
            const tr = el('tr');
            row.forEach((text, c) => {
                const cell = el(r ? 'td' : 'th', {}, r ? 'table-td' : 'table-th');
                bindCell(cell, r, c, text);
                tr.append(cell);
            });
            (r ? tbody : thead).append(tr);
        });
        table.append(thead, tbody);
        wrap.append(table);

        if (this.interactive && !view.state.readOnly) {
            wrap.append(
                toolbarEl(this.toolbar, (item) => {
                    const { c = 0, r = -1, offset } = last ?? {};
                    commit((t) => {
                        const edit = item.run(t, c, r);
                        if (edit.focus?.r === r && edit.focus.c === c) edit.focus.offset = offset;
                        return edit;
                    });
                })
            );
        }
        return wrap;
    }
}

/** Renders tables as widgets: read-only previews revealed under the cursor, or always-on editable tables (`interactive`). */
export const tableWidgets = (interactive: boolean, toolbar = defaultTableToolbar) =>
    ViewPlugin.fromClass(
        class {
            decorations = Decoration.none;
            atomic = Decoration.none;
            constructor(view: EditorView) {
                if (interactive) cellActionFor.set(view, (id) => applyCellAction(view, id));
                this.build(view);
            }
            update(u: ViewUpdate) {
                if (u.docChanged || u.viewportChanged || u.selectionSet || u.focusChanged) this.build(u.view);
            }
            build(view: EditorView) {
                const out: ReturnType<Decoration['range']>[] = [];
                const atomic: ReturnType<Decoration['range']>[] = [];
                const { state } = view;
                const { doc } = state;
                const touches = (from: number, to: number) =>
                    !interactive && view.hasFocus && state.selection.ranges.some((r) => r.from <= to && r.to >= from);
                for (const { from, to } of view.visibleRanges) {
                    syntaxTree(state).iterate({
                        from,
                        to,
                        enter({ name, from, to, node }) {
                            if (name !== 'Table') return;
                            const t = !touches(from, to) && parseMarkdownTable(state, node);
                            if (!t) return false;
                            const first = doc.lineAt(t.from);
                            const widget = new TableWidget(state.sliceDoc(t.from, t.to), t, interactive, toolbar, hideMarksOf(view));
                            const w = Decoration.replace({ widget }).range(first.from, first.to);
                            out.push(w);
                            atomic.push(w);
                            for (let n = first.number + 1, end = doc.lineAt(t.to).number; n <= end; n++) {
                                const l = doc.line(n);
                                out.push(Decoration.line({ class: 'cm-table-hidden-line' }).range(l.from));
                                if (l.from < l.to) {
                                    const h = hide.range(l.from, l.to);
                                    out.push(h);
                                    atomic.push(h);
                                }
                            }
                            return false;
                        },
                    });
                }
                this.decorations = Decoration.set(out, true);
                this.atomic = Decoration.set(atomic, true);
            }
        },
        {
            decorations: (p) => p.decorations,
            provide: (plugin) => EditorView.atomicRanges.of((view) => view.plugin(plugin)?.atomic ?? Decoration.none),
        }
    );

export interface TableToolbarOptions {
    toolbar?: TableToolbarItem[];
    labels?: Record<string, { label?: string; title?: string }>;
}

/** Applies `toolbar` (reorder/filter/extend) and `labels` (translate by item id) to the default toolbar. */
export const resolveToolbar = (o: TableToolbarOptions = {}) => (o.toolbar ?? defaultTableToolbar).map((i) => ({ ...i, ...o.labels?.[i.id] }));
