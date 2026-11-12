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
export declare const tablePlugin: (...extension: Extension[]) => MarkPlugin;
