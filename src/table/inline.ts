import type { MarkPlugin } from '../types.ts';
import { tablePlugin, tableRawEditing } from './core.ts';
import { resolveToolbar, tableRawToolbar, type TableToolbarOptions } from './widget.ts';

/** GFM Table syntax + monospace raw editing + Tab/Shift-Tab cell navigation & auto-padding + toolbar (see `tableWysiwygPlugin` options) */
export const tableInlinePlugin = (options: TableToolbarOptions = {}): MarkPlugin =>
    tablePlugin(tableRawEditing, tableRawToolbar(resolveToolbar(options)));
