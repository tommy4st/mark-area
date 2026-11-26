import { type EditorState, type SelectionRange } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import type { EditorAction, SyntaxNode } from './types.ts';
import { type MarksMode } from './host.ts';
export declare function findEnclosingNode(state: EditorState, from: number, to: number, nodeName: string): SyntaxNode | null;
/** Inserts `text` as its own paragraph at the cursor line; `select` maps the text start to the new selection (default: cursor after it). */
export declare const insertParagraph: (view: EditorView, text: string, select?: (from: number) => SelectionRange) => boolean;
export declare const mod: string;
export declare const alt: string;
export declare const icon: (d: string) => string;
/** Built-in actions, shared by every element (frozen). */
export declare const actions: readonly EditorAction[];
export declare const actionMap: Map<import("./types.ts").ActionId, EditorAction>;
/** Marks display modes in cycle order: code only, code on enter, WYSIWYG only. */
export declare const markModes: Record<MarksMode, {
    label: 'modeShow' | 'modeAuto' | 'modeHide';
    html: string;
}>;
/** Cycles marks mode. Opt-in: add `mode` to the `toolbar` attribute. */
export declare const modeAction: EditorAction;
