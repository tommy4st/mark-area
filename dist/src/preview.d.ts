import { Decoration, type DecorationSet, EditorView, ViewPlugin, type ViewUpdate } from '@codemirror/view';
export declare const hide: Decoration;
export declare const mark: (cls: string) => Decoration;
export declare const parseImageUrl: (raw: string) => {
    src: string;
    width: string;
};
/** Live preview: styles Markdown and hides its markers according to the `marksMode` facet. */
export declare const preview: ViewPlugin<{
    decorations: DecorationSet;
    atomic: DecorationSet;
    hidden: Array<{
        from: number;
        to: number;
    }>;
    update(u: ViewUpdate): void;
}, undefined>;
/** Exposes every visible line as `::part(line)`. */
export declare const linePart: ViewPlugin<{
    decorations: DecorationSet;
    update(u: ViewUpdate): void;
    build(view: EditorView): DecorationSet;
}, undefined>;
