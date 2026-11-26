import { Facet } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
export type MarksMode = 'auto' | 'hide' | 'show';
export type UploadKind = 'image' | 'file';
/** User-facing strings outside the toolbar; override per element with `editor.strings = { … }`. */
export declare const defaultStrings: {
    required: string;
    linkPrompt: string;
    linkPromptRemove: string;
    imageResize: string;
    modeShow: string;
    modeAuto: string;
    modeHide: string;
    blockSource: string;
    blockNotes: string;
    photoAdd: string;
    photoReplace: string;
    photoHint: string;
    linkOpenHint: string;
};
export type Strings = typeof defaultStrings & Record<string, string>;
/** The parts of `<mark-area>` that commands and plugins may rely on. */
export interface MarkAreaHost extends HTMLElement {
    marks: MarksMode;
    uploads: boolean;
    disabled: boolean;
    readOnly: boolean;
    pickFiles(kind?: UploadKind): void;
    uploadFiles(files: Iterable<File> | ArrayLike<File>, kind?: UploadKind): Promise<void>;
    uploadImage(file: File): Promise<string | null>;
}
/** The `<mark-area>` element owning the editor (null when a plugin runs in a bare CodeMirror view). */
export declare const markAreaHost: Facet<MarkAreaHost, MarkAreaHost | null>;
/** Current marks mode, e.g. custom blocks and tables stay raw in `show`. */
export declare const marksMode: Facet<MarksMode, MarksMode>;
/** Merged strings. Plugins may provide defaults for their own keys; the element's `strings` win. */
export declare const strings: Facet<Partial<Strings>, Strings>;
/** Lets plugins (WYSIWYG tables, block fields) take over toolbar actions; a handler returns true when handled. */
export declare const actionInterceptor: Facet<(view: EditorView, id: string) => boolean, readonly ((view: EditorView, id: string) => boolean)[]>;
/** Per-id `label` / `title` overrides (`editor.labels`), shared by the main toolbar and plugin toolbars such as tables. */
export type ActionLabels = Record<string, {
    label?: string;
    title?: string;
}>;
export declare const actionLabels: Facet<ActionLabels, ActionLabels>;
