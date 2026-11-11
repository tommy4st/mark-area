import type { Extension } from '@codemirror/state';
import type { syntaxTree } from '@codemirror/language';
import type { EditorView } from '@codemirror/view';
import type { MarkdownConfig } from '@lezer/markdown';

export type SyntaxNode = ReturnType<ReturnType<typeof syntaxTree>['resolveInner']>;
export type ActionId =
    | 'bold'
    | 'italic'
    | 'strike'
    | 'heading'
    | 'bullet'
    | 'ordered'
    | 'quote'
    | 'code'
    | 'link'
    | 'image'
    | 'file'
    | 'table'
    | (string & {});
export type UploadResult = string | { url: string; name?: string };
export type UploadHandler = (file: File, kind: 'image' | 'file') => Promise<UploadResult> | UploadResult;

export interface EditorAction {
    id: ActionId;
    run: (view: EditorView) => boolean;
    key?: string;
    hint?: string;
    html: string;
}

export interface MarkPlugin {
    markdown?: MarkdownConfig;
    extension?: Extension;
    actions?: EditorAction[];
    styles?: string | CSSStyleSheet;
}
