import type { Extension } from '@codemirror/state';
import type { syntaxTree } from '@codemirror/language';
import type { EditorView } from '@codemirror/view';
import type { MarkdownConfig } from '@lezer/markdown';
import type { MarkAreaHost, UploadKind } from './host.ts';

export type SyntaxNode = ReturnType<ReturnType<typeof syntaxTree>['resolveInner']>;
export type ActionId =
  | 'undo'
  | 'redo'
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
  | 'mode'
  | (string & {});
export type UploadResult = string | { url: string; name?: string };
export type UploadHandler = (file: File, kind: UploadKind) => Promise<UploadResult> | UploadResult;

export interface EditorAction {
  id: ActionId;
  run: (view: EditorView) => boolean;
  key?: string;
  hint?: string;
  /** Default accessible name and tooltip; `editor.labels` overrides it. */
  label?: string;
  html: string;
  /** Hides the action (toolbar, shortcut, `exec`) while it returns false, e.g. uploads being off. */
  enabled?: (host: MarkAreaHost) => boolean;
}

export interface MarkPlugin {
  markdown?: MarkdownConfig;
  extension?: Extension;
  actions?: EditorAction[];
  styles?: string | CSSStyleSheet;
}
