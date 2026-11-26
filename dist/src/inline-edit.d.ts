/** `window.getSelection()` does not expose ranges inside shadow roots in Chromium; the root does. */
export declare const selectionOf: (node: Node) => Selection | null;
/** Character offset of `(node, offset)` within `root`'s text. */
export declare const textOffset: (root: Node, node: Node, offset: number) => number;
/** Safely renders inline Markdown (bold, italic, strike, code, safe links) into `into` using DOM nodes only. */
export declare const renderInlineMarkdown: (raw: string, into: HTMLElement, opts?: {
    linkClass?: string;
    codeClass?: string;
    unescapePipes?: boolean;
}) => void;
/** Serializes an inline DOM subtree back to Markdown (`br` controls `<br>` output). */
export declare const inlineToMarkdown: (node: Node, br?: string) => string;
/** Applies a toolbar action to a focused inline-editable container (table cell or block body). Returns false to pass through to CodeMirror. */
export declare const applyInlineAction: (root: HTMLElement, sel: Selection, id: string, rendered: boolean, linkPrompt: string, opts?: {
    linkClass?: string;
    codeClass?: string;
    promptRawLink?: boolean;
}) => boolean;
