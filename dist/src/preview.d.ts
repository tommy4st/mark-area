import { Decoration, type DecorationSet, ViewPlugin, type ViewUpdate } from '@codemirror/view';
export declare const hide: Decoration;
export declare const mark: (cls: string) => Decoration;
export declare const parseImageUrl: (raw: string) => {
    src: string;
    width: string;
};
export declare const createPreview: (alwaysHide: boolean) => ViewPlugin<{
    decorations: DecorationSet;
    atomic: DecorationSet;
    hidden: Array<{
        from: number;
        to: number;
    }>;
    update(u: ViewUpdate): void;
}, undefined>;
