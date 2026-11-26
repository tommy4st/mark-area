import { Facet } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';

export type MarksMode = 'auto' | 'hide' | 'show';
export type UploadKind = 'image' | 'file';

/** User-facing strings outside the toolbar; override per element with `editor.strings = { … }`. */
export const defaultStrings = {
  required: 'Please fill out this field.',
  linkPrompt: 'Link URL',
  linkPromptRemove: 'Link URL (empty to remove link)',
  imageResize: 'Drag to resize (double-click to reset)',
  modeShow: 'Code only',
  modeAuto: 'Code on enter',
  modeHide: 'WYSIWYG only',
  blockSource: 'Show block source',
  blockNotes: 'Notes (Markdown)',
  photoAdd: 'Add photo',
  photoReplace: 'Replace photo',
  photoHint: 'Click or drop an image',
  linkOpenHint: 'Ctrl/Cmd+click to open',
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
export const markAreaHost = Facet.define<MarkAreaHost, MarkAreaHost | null>({ combine: (v) => v[0] ?? null });

/** Current marks mode, e.g. custom blocks and tables stay raw in `show`. */
export const marksMode = Facet.define<MarksMode, MarksMode>({ combine: (v) => v[0] ?? 'auto' });

/** Merged strings. Plugins may provide defaults for their own keys; the element's `strings` win. */
export const strings = Facet.define<Partial<Strings>, Strings>({
  combine: (v) => Object.assign({}, defaultStrings, ...[...v].reverse()),
});

/** Lets plugins (WYSIWYG tables, block fields) take over toolbar actions; a handler returns true when handled. */
export const actionInterceptor = Facet.define<(view: EditorView, id: string) => boolean>();
