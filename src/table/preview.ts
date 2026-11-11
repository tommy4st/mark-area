import type { MarkPlugin } from '../types.ts';
import { tablePlugin, tableRawEditing } from './core.ts';
import { resolveToolbar, tableRawToolbar, tableWidgets, type TableToolbarOptions } from './widget.ts';

/** Hybrid live-preview widget when cursor is outside; raw Markdown + Tab navigation + toolbar when cursor is inside */
export const tablePreviewPlugin = (options: TableToolbarOptions = {}): MarkPlugin =>
    tablePlugin(tableRawEditing, tableRawToolbar(resolveToolbar(options)), tableWidgets(false));
