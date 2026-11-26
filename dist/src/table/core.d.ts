import { type EditorState, type Extension } from '@codemirror/state';
import { type EditorView } from '@codemirror/view';
import type { EditorAction, MarkPlugin, SyntaxNode } from '../types.ts';
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
    cellRanges: Array<Array<{
        from: number;
        to: number;
    }>>;
}
export declare function parseMarkdownTable(state: EditorState, node: SyntaxNode): ParsedTable | null;
export declare function formatMarkdownTable(t: TableData): string;
/** Parses the table enclosing `pos`, if any. */
export declare const tableAt: (state: EditorState, pos: number) => ParsedTable | null;
/** Moves `(r, c)` one cell in reading order; appends an empty row to `rows` when stepping past the end. */
export declare function nextCell(rows: string[][], cols: number, r: number, c: number, dir: 1 | -1): {
    r: number;
    c: number;
};
/** Replaces `t` with the formatted `data` and selects cell `(r, c)`. */
export declare const rewriteTable: (view: EditorView, t: ParsedTable, data: TableData, r: number, c: number) => boolean;
/** Row and column of the cell at `head` within `t`. */
export declare const cursorCell: (state: EditorState, t: ParsedTable, head: number, onDelimiter?: number) => {
    row: number;
    col: number;
};
export declare const tableAction: EditorAction;
/** Monospace raw table lines, bold header, Tab/Shift-Tab cell navigation with auto-padding. */
export declare const tableRawEditing: Extension;
export declare const tableStyles = "\n.cm-table-line {\n    font-family: var(--ma-font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);\n    white-space: pre;\n}\n.cm-table-hidden-line {\n    display: none !important;\n}\n.cm-line > .cm-table-widget ~ .cm-widgetBuffer, .cm-line > .cm-widgetBuffer:has(+ .cm-table-widget) { display: none; }\n.cm-table-widget {\n    display: block;\n    margin: 0.375rem 0;\n    overflow-x: auto;\n    white-space: normal;\n    font-family: var(--ma-font, inherit);\n}\n.cm-table {\n    border-collapse: collapse;\n    width: var(--ma-table-width, auto);\n    min-width: 12rem;\n    font-size: var(--ma-table-font-size, 0.875em);\n    border: var(--ma-table-border, 1px solid color-mix(in srgb, currentColor 18%, transparent));\n    border-radius: var(--ma-table-radius, 0.25rem);\n}\n.cm-table th, .cm-table td {\n    border: var(--ma-table-border, 1px solid color-mix(in srgb, currentColor 18%, transparent));\n    padding: var(--ma-table-cell-padding, 0.3125rem 0.625rem);\n    min-width: 3.5rem;\n    height: 1.5em;\n    line-height: var(--ma-line-height, 1.5);\n    text-align: left;\n    vertical-align: top;\n}\n.cm-table th {\n    font-weight: 600;\n    background: var(--ma-table-header-bg, color-mix(in srgb, currentColor 6%, transparent));\n}\n.cm-table tr:nth-child(even) td {\n    background: var(--ma-table-stripe-bg, color-mix(in srgb, currentColor 2.5%, transparent));\n}\n.cm-table-widget:not(.cm-table-wysiwyg) .cm-table th,\n.cm-table-widget:not(.cm-table-wysiwyg) .cm-table td {\n    cursor: text;\n}\n.cm-table-wysiwyg th[contenteditable=\"true\"]:focus,\n.cm-table-wysiwyg td[contenteditable=\"true\"]:focus {\n    outline: 2px solid var(--ma-link-color, #2563eb);\n    outline-offset: -2px;\n    background: color-mix(in srgb, var(--ma-link-color, #2563eb) 8%, transparent);\n}\n.cm-table-controls {\n    display: none;\n    gap: 0.25rem;\n    margin-top: 0.25rem;\n}\n.cm-table-widget:focus-within .cm-table-controls,\n.cm-editor.cm-focused .cm-table-controls-raw {\n    display: flex;\n}\n.cm-table-btn {\n    border: var(--ma-table-border, 1px solid color-mix(in srgb, currentColor 18%, transparent));\n    border-radius: 0.25rem;\n    background: var(--ma-btn-bg, transparent);\n    color: inherit;\n    font: inherit;\n    font-size: 0.6875rem;\n    display: inline-flex;\n    align-items: center;\n    gap: 0.25rem;\n    padding: 0.125rem 0.375rem;\n    cursor: pointer;\n    opacity: 0.75;\n}\n.cm-table-btn:hover {\n    opacity: 1;\n    background: var(--ma-btn-hover-bg, color-mix(in srgb, currentColor 10%, transparent));\n}\n";
export declare const tablePlugin: (...extension: Extension[]) => MarkPlugin;
