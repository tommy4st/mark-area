import { EditorSelection, type EditorState, type Extension } from '@codemirror/state';
import { Decoration, type DecorationSet, type EditorView, ViewPlugin, type ViewUpdate, keymap } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { Table } from '@lezer/markdown';
import type { EditorAction, MarkPlugin, SyntaxNode } from '../types.ts';
import { alt, findEnclosingNode, icon, insertParagraph, mod } from '../commands.ts';
import { mark } from '../preview.ts';

export type TableAlign = 'left' | 'center' | 'right' | null;

export interface TableData {
    headers: string[];
    aligns: TableAlign[];
    rows: string[][];
}

export interface ParsedTable extends TableData {
    from: number;
    to: number;
    /** Cell ranges per row; row 0 is the header. */
    cellRanges: Array<Array<{ from: number; to: number }>>;
}

/** Splits a table line into trimmed cells with their document ranges (escaped `\|` stays inside a cell). */
const splitRow = (text: string, offset: number) => {
    const start = /^\s*\|/.exec(text)?.[0].length ?? 0;
    const trail = /\|\s*$/.exec(text)?.[0].length ?? 0;
    const end = text.length - (trail && text.trim().length > 1 ? trail : 0);
    const cells: Array<{ text: string; from: number; to: number }> = [];
    for (let i = start, cur = start; i <= end; i++) {
        if (i < end) {
            if (text[i] !== '|') continue;
            let bs = 0;
            for (let j = i - 1; j >= cur && text[j] === '\\'; j--) bs++;
            if (bs % 2 === 1) continue;
        }
        const raw = text.slice(cur, i);
        const cell = raw.trim();
        const from = offset + cur + (cell ? raw.length - raw.trimStart().length : Math.min(1, raw.length));
        cells.push({ text: cell, from, to: cell ? offset + i - (raw.length - raw.trimEnd().length) : from });
        cur = i + 1;
    }
    return cells;
};

const parseAlign = (s: string): TableAlign => {
    const l = s.startsWith(':');
    const r = s.endsWith(':');
    return l && r ? 'center' : r ? 'right' : l ? 'left' : null;
};

const formatAlign = (a: TableAlign, w: number) => {
    const l = a === 'left' || a === 'center';
    const r = a === 'right' || a === 'center';
    return (l ? ':' : '') + '-'.repeat(w - +l - +r) + (r ? ':' : '');
};

export function parseMarkdownTable(state: EditorState, node: SyntaxNode): ParsedTable | null {
    const { doc } = state;
    const first = doc.lineAt(node.from);
    const last = doc.lineAt(node.to);
    if (last.number === first.number) return null;

    const lines = [first];
    for (let n = first.number + 2; n <= last.number && doc.line(n).text.trim(); n++) lines.push(doc.line(n));
    const split = lines.map((l) => splitRow(l.text, l.from));
    const delim = doc.line(first.number + 1);
    const d = splitRow(delim.text, delim.from);
    const fill = <T>(f: (c: number) => T) => Array.from({ length: Math.max(1, split[0]!.length, d.length) }, (_, c) => f(c));
    const cells = split.map((r, i) => fill((c) => r[c] ?? { text: '', from: lines[i]!.to, to: lines[i]!.to }));

    return {
        from: first.from,
        to: last.to,
        headers: cells[0]!.map((c) => c.text),
        aligns: fill((c) => parseAlign(d[c]?.text ?? '')),
        rows: cells.slice(1).map((r) => r.map((c) => c.text)),
        cellRanges: cells,
    };
}

export function formatMarkdownTable(t: TableData): string {
    const all = [t.headers, ...t.rows];
    const widths = Array.from({ length: Math.max(1, t.headers.length) }, (_, c) =>
        Math.max(3, ...all.map((r) => (r[c] ?? '').length))
    );
    const pad = (s: string, c: number) => {
        const d = widths[c]! - s.length;
        const l = t.aligns[c] === 'right' ? d : t.aligns[c] === 'center' ? d >> 1 : 0;
        return ' '.repeat(l) + s + ' '.repeat(d - l);
    };
    const line = (cells: string[]) => `| ${cells.join(' | ')} |`;
    const row = (r: string[]) => line(widths.map((_, c) => pad(r[c] ?? '', c)));
    return [row(t.headers), line(widths.map((w, c) => formatAlign(t.aligns[c] ?? null, w))), ...t.rows.map(row)].join('\n');
}

/** Parses the table enclosing `pos`, if any. */
export const tableAt = (state: EditorState, pos: number) => {
    const node = findEnclosingNode(state, pos, pos, 'Table');
    return node && parseMarkdownTable(state, node);
};

/** Moves `(r, c)` one cell in reading order; appends an empty row to `rows` when stepping past the end. */
export function nextCell(rows: string[][], cols: number, r: number, c: number, dir: 1 | -1) {
    c += dir;
    if (c >= cols) (c = 0), r++;
    else if (c < 0) (c = cols - 1), r--;
    if (r < 0) return { r: 0, c: 0 };
    if (r > rows.length) rows.push(Array<string>(cols).fill(''));
    return { r, c };
}

/** Replaces `t` with the formatted `data` and selects cell `(r, c)`. */
export const rewriteTable = (view: EditorView, t: ParsedTable, data: TableData, r: number, c: number) => {
    view.dispatch({ changes: { from: t.from, to: t.to, insert: formatMarkdownTable(data) } });
    const cell = tableAt(view.state, t.from)?.cellRanges[r]?.[c];
    if (cell) view.dispatch({ selection: EditorSelection.range(cell.from, cell.to), scrollIntoView: true });
    return true;
};

const insertTable = (view: EditorView) => {
    const { state } = view;
    const head = state.selection.main.head;
    const t = tableAt(state, head);
    if (t) return rewriteTable(view, t, { ...t, rows: [...t.rows, t.headers.map(() => '')] }, t.rows.length + 1, 0);

    const template = formatMarkdownTable({ headers: ['Col 1', 'Col 2'], aligns: [null, null], rows: [['', '']] });
    return insertParagraph(view, template, (from) => EditorSelection.range(from + 2, from + 7));
};

/** Row and column of the cell at `head` within `t`. */
export const cursorCell = (state: EditorState, t: ParsedTable, head: number, onDelimiter = 1) => {
    const off = state.doc.lineAt(head).number - state.doc.lineAt(t.from).number;
    const row = Math.min(t.cellRanges.length - 1, off === 0 ? 0 : off === 1 ? onDelimiter : off - 1);
    let col = 0;
    t.cellRanges[row]!.forEach((cell, i) => head >= cell.from - 1 && (col = i));
    return { row, col };
};

const moveCell = (dir: 1 | -1) => (view: EditorView) => {
    const { state } = view;
    const head = state.selection.main.head;
    const t = tableAt(state, head);
    if (!t) return false;
    const { row, col } = cursorCell(state, t, head, +(dir > 0));
    const rows = t.rows.map((r) => [...r]);
    const next = nextCell(rows, t.headers.length, row, col, dir);
    return rewriteTable(view, t, { ...t, rows }, next.r, next.c);
};

export const tableAction: EditorAction = {
    id: 'table',
    run: insertTable,
    key: 'Mod-Alt-t',
    hint: mod + alt + 'T',
    html: icon(
        'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5'
    ),
};

const buildInline = (view: EditorView) => {
    const out: ReturnType<Decoration['range']>[] = [];
    const { doc } = view.state;
    for (const { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from,
            to,
            enter({ name, from, to }) {
                if (name === 'Table') {
                    for (let n = doc.lineAt(from).number, end = doc.lineAt(to).number; n <= end; n++) {
                        out.push(Decoration.line({ class: 'cm-table-line' }).range(doc.line(n).from));
                    }
                } else if (name === 'TableHeader') out.push(mark('cm-strong').range(from, to));
                else if (name === 'TableDelimiter') out.push(mark('cm-mark').range(from, to));
            },
        });
    }
    return Decoration.set(out, true);
};

/** Monospace raw table lines, bold header, Tab/Shift-Tab cell navigation with auto-padding. */
export const tableRawEditing: Extension = [
    keymap.of([
        { key: 'Tab', run: moveCell(1) },
        { key: 'Shift-Tab', run: moveCell(-1) },
    ]),
    ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;
            constructor(view: EditorView) {
                this.decorations = buildInline(view);
            }
            update(u: ViewUpdate) {
                if (u.docChanged || u.viewportChanged || u.selectionSet || syntaxTree(u.state) !== syntaxTree(u.startState)) {
                    this.decorations = buildInline(u.view);
                }
            }
        },
        { decorations: (p) => p.decorations }
    ),
];

export const tableStyles = /* css */ `
.cm-table-line {
    font-family: var(--ma-font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
    white-space: pre;
}
.cm-table-hidden-line {
    display: none !important;
}
.cm-line > .cm-table-widget ~ .cm-widgetBuffer, .cm-line > .cm-widgetBuffer:has(+ .cm-table-widget) { display: none; }
.cm-table-widget {
    display: block;
    margin: 0.375rem 0;
    overflow-x: auto;
    white-space: normal;
    font-family: var(--ma-font, inherit);
}
.cm-table {
    border-collapse: collapse;
    width: var(--ma-table-width, auto);
    min-width: 12rem;
    font-size: var(--ma-table-font-size, 0.875em);
    border: var(--ma-table-border, 1px solid color-mix(in srgb, currentColor 18%, transparent));
    border-radius: var(--ma-table-radius, 0.25rem);
}
.cm-table th, .cm-table td {
    border: var(--ma-table-border, 1px solid color-mix(in srgb, currentColor 18%, transparent));
    padding: var(--ma-table-cell-padding, 0.3125rem 0.625rem);
    min-width: 3.5rem;
    height: 1.5em;
    line-height: var(--ma-line-height, 1.5);
    text-align: left;
    vertical-align: top;
}
.cm-table th {
    font-weight: 600;
    background: var(--ma-table-header-bg, color-mix(in srgb, currentColor 6%, transparent));
}
.cm-table tr:nth-child(even) td {
    background: var(--ma-table-stripe-bg, color-mix(in srgb, currentColor 2.5%, transparent));
}
.cm-table-widget:not(.cm-table-wysiwyg) .cm-table th,
.cm-table-widget:not(.cm-table-wysiwyg) .cm-table td {
    cursor: text;
}
.cm-table-wysiwyg th[contenteditable="true"]:focus,
.cm-table-wysiwyg td[contenteditable="true"]:focus {
    outline: 2px solid var(--ma-link-color, #2563eb);
    outline-offset: -2px;
    background: color-mix(in srgb, var(--ma-link-color, #2563eb) 8%, transparent);
}
.cm-table-controls {
    display: none;
    gap: 0.25rem;
    margin-top: 0.25rem;
}
.cm-table-widget:focus-within .cm-table-controls,
.cm-editor.cm-focused .cm-table-controls-raw {
    display: flex;
}
.cm-table-btn {
    border: var(--ma-table-border, 1px solid color-mix(in srgb, currentColor 18%, transparent));
    border-radius: 0.25rem;
    background: var(--ma-btn-bg, transparent);
    color: inherit;
    font: inherit;
    font-size: 0.6875rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.375rem;
    cursor: pointer;
    opacity: 0.75;
}
.cm-table-btn:hover {
    opacity: 1;
    background: var(--ma-btn-hover-bg, color-mix(in srgb, currentColor 10%, transparent));
}
`;

export const tablePlugin = (...extension: Extension[]): MarkPlugin => ({
    markdown: Table,
    actions: [tableAction],
    extension,
    styles: tableStyles,
});
