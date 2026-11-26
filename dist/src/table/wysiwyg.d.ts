import type { MarkPlugin } from '../types.ts';
import { defaultTableToolbar, type TableToolbarItem, type TableToolbarOptions } from './widget.ts';
export { defaultTableToolbar, type TableToolbarItem };
/** Always-rendered interactive HTML table widget with inline cell editing & customizable controls (`toolbar` reorders, filters, or extends `defaultTableToolbar`; `labels` translates button text and tooltips by item id) */
export declare const tableWysiwygPlugin: (options?: TableToolbarOptions) => MarkPlugin;
