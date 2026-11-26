import { type Extension, StateField } from '@codemirror/state';
import { type DecorationSet, EditorView } from '@codemirror/view';
import { type ParsedTable, type TableData } from './core.ts';
type Focus = {
    r: number;
    c: number;
    offset?: number;
};
export type TableEdit = TableData & {
    focus?: Focus;
};
/** Toolbar button for the WYSIWYG table. `col` and `row` refer to the last focused cell (row 0 is the header, -1 if none). */
export interface TableToolbarItem {
    id: string;
    title: string;
    /** Button text */
    label: string;
    run: (t: ParsedTable, col: number, row: number) => TableEdit;
}
export declare const defaultTableToolbar: TableToolbarItem[];
/** Toolbar above the raw Markdown table containing the cursor (inline and preview variants). */
export declare const tableRawToolbar: (items?: TableToolbarItem[]) => StateField<DecorationSet>;
/** Applies a toolbar action to the focused WYSIWYG table cell. Returns false when no cell is focused or action passes through. */
export declare function applyCellAction(view: EditorView, id: string): boolean;
/** Renders tables as widgets: read-only previews revealed under the cursor, or always-on editable tables (`interactive`). */
export declare const tableWidgets: (interactive: boolean, toolbar?: TableToolbarItem[]) => Extension;
export interface TableToolbarOptions {
    toolbar?: TableToolbarItem[];
    labels?: Record<string, {
        label?: string;
        title?: string;
    }>;
}
/** Applies `toolbar` (reorder/filter/extend) and `labels` (translate by item id) to the default toolbar. */
export declare const resolveToolbar: (o?: TableToolbarOptions) => {
    id: string;
    title: string;
    label: string;
    run: (t: ParsedTable, col: number, row: number) => TableEdit;
}[];
export {};
