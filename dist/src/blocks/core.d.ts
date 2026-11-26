import type { EditorState } from '@codemirror/state';
import type { MarkdownConfig } from '@lezer/markdown';
import type { EditorAction, SyntaxNode } from '../types.ts';
import type { Strings } from '../host.ts';
export { safeImageUrl, safeUrl } from '../utils.ts';
export type BlockAttrs = Record<string, string | true>;
export interface BlockContextApi {
    /** User-facing strings of the editor (see `defaultStrings`). */
    strings: Strings;
    /** Renders Markdown body text into a safe DOM fragment (no `innerHTML`). */
    renderBody(md: string): HTMLElement;
    /** Makes `node` editable in place; on commit the `key` attribute is rewritten in the block's opening line. */
    editable(node: HTMLElement, key: string): HTMLElement;
    /** Makes `node` upload an image on click or drop (when the host has `uploads`); the URL is written to the `key` attribute. */
    imageUpload(node: HTMLElement, key: string): HTMLElement;
}
export interface BlockRenderer {
    name: string;
    render(attrs: BlockAttrs, body: string, ctx: BlockContextApi): HTMLElement;
    action?: EditorAction;
    styles?: string;
}
export interface ParsedBlock {
    from: number;
    to: number;
    name: string;
    attrs: BlockAttrs;
    body: string;
    /** False when the closing fence is missing (the editor shows raw source). */
    closed: boolean;
    /** Start of the opening fence line. */
    infoFrom: number;
    /** True when the fence is nested in a container (blockquote, list); such blocks stay raw. */
    nested: boolean;
}
/** Parses the inside of `{…}`: `key="v"`, `key='v'`, `key=v`, bare `key`, `#id`, `.class`. */
export declare function parseAttrs(info: string): BlockAttrs;
/** Serializes attributes back to `{…}` content (inverse of `parseAttrs`). */
export declare function formatAttrs(attrs: BlockAttrs): string;
/** Lezer block parser for `:::name{attrs}` … `:::` (top-level, no nesting; body kept as raw lines). */
export declare const customBlockConfig: MarkdownConfig;
export declare function parseBlock(state: EditorState, node: SyntaxNode): ParsedBlock | null;
/** Parses the custom block enclosing `pos`, if any. */
export declare const blockAt: (state: EditorState, pos: number) => ParsedBlock | null;
/** Builds an action inserting `template` as its own paragraph at the cursor line, leaving the cursor after it. */
export declare const insertBlockAction: (id: string, template: string, svgPath: string, label: string) => EditorAction;
