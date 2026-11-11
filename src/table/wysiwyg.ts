import type { MarkPlugin } from '../types.ts';
import { tablePlugin } from './core.ts';
import { defaultTableToolbar, resolveToolbar, tableWidgets, type TableToolbarItem, type TableToolbarOptions } from './widget.ts';

export { defaultTableToolbar, type TableToolbarItem };

/** Always-rendered interactive HTML table widget with inline cell editing & customizable controls (`toolbar` reorders, filters, or extends `defaultTableToolbar`; `labels` translates button text and tooltips by item id) */
export const tableWysiwygPlugin = (options: TableToolbarOptions = {}): MarkPlugin => tablePlugin(tableWidgets(true, resolveToolbar(options)));
