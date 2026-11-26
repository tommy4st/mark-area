export declare const isWord: (c: string | undefined) => boolean;
/** `window.getSelection()` does not expose ranges inside shadow roots in Chromium; the root does. */
export declare const selectionOf: (node: Node) => Selection | null;
/** Character offset of `(node, offset)` within `root`'s text. */
export declare const textOffset: (root: Node, node: Node, offset: number) => number;
/** Expands a collapsed range inside a text node to the surrounding word. */
export declare const expandWord: (range: Range) => void;
export declare const INLINE_TAGS: Record<string, string>;
export declare const ACTION_MARKERS: Record<string, string>;
/** Safely renders inline Markdown (bold, italic, strike, code, safe links) into `into` using DOM nodes only. */
export declare const renderInlineMarkdown: (raw: string, into: HTMLElement, opts?: {
    linkClass?: string;
    codeClass?: string;
    unescapePipes?: boolean;
}) => void;
/** Serializes an inline DOM subtree back to Markdown (`br` controls `<br>` output). */
export declare const inlineToMarkdown: (node: Node, br?: string) => string;
/** Toggles an inline Markdown marker (or wraps a link) inside a plain-text editable container. */
export declare const toggleRawMarker: (container: HTMLElement, sel: Selection, range: Range, id: string, getLinkUrl?: () => string | null) => void;
/** Unwraps an enclosing inline tag or safely wraps `range` (works across partial element boundaries). */
export declare const toggleInlineTag: (root: HTMLElement, sel: Selection, range: Range, tag: keyof HTMLElementTagNameMap, marker?: string, props?: Partial<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>) => boolean;
/** Applies a toolbar action to a focused inline-editable container (table cell or block body). Returns false to pass through to CodeMirror. */
export declare const applyInlineAction: (root: HTMLElement, sel: Selection, id: string, rendered: boolean, linkPrompt: string, opts?: {
    linkClass?: string;
    codeClass?: string;
    promptRawLink?: boolean;
}) => boolean;
