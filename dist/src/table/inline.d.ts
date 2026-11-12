import type { MarkPlugin } from '../types.ts';
import { type TableToolbarOptions } from './widget.ts';
/** GFM Table syntax + monospace raw editing + Tab/Shift-Tab cell navigation & auto-padding + toolbar (see `tableWysiwygPlugin` options) */
export declare const tableInlinePlugin: (options?: TableToolbarOptions) => MarkPlugin;
