/** Building blocks for third-party plugins: host access, shared facets and the helpers the built-in plugins use. */
export type { ActionId, EditorAction, MarkPlugin, SyntaxNode } from './src/types.ts';
export type { MarkAreaHost, MarksMode, Strings, UploadKind } from './src/host.ts';
export { actionInterceptor, defaultStrings, markAreaHost, marksMode, strings } from './src/host.ts';
export { findEnclosingNode, icon, insertParagraph } from './src/commands.ts';
export { el, emit } from './src/utils.ts';
