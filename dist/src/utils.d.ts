import type { EditorView } from '@codemirror/view';
import type { MarkArea } from './mark-area.ts';
export declare const el: <K extends keyof HTMLElementTagNameMap>(tag: K, props?: Partial<HTMLElementTagNameMap[K]>, part?: string) => HTMLElementTagNameMap[K];
export declare const emit: <T>(target: EventTarget, name: string, detail: T) => boolean;
/** Lets plugins (WYSIWYG tables) intercept toolbar actions; returns true when handled. */
export declare const cellActionFor: WeakMap<EditorView, (id: string) => boolean>;
export declare const hostFor: WeakMap<EditorView, MarkArea>;
