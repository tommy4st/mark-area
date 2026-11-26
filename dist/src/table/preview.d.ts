import type { MarkPlugin } from '../types.ts';
import { type TableToolbarOptions } from './widget.ts';
/** Hybrid live-preview widget when cursor is outside; raw Markdown + Tab navigation + toolbar when cursor is inside */
export declare const tablePreviewPlugin: (options?: TableToolbarOptions) => MarkPlugin;
