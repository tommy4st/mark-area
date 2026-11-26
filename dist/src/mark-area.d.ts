import { type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import type { ActionId, MarkPlugin, UploadHandler } from './types.ts';
import { type MarkAreaHost, type MarksMode, type Strings, type UploadKind } from './host.ts';
type ActionLabels = Record<string, {
    label?: string;
    title?: string;
}>;
export declare class MarkArea extends HTMLElement implements MarkAreaHost {
    #private;
    static formAssociated: boolean;
    static observedAttributes: string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null): void;
    formResetCallback(): void;
    /** Disabled state including a disabled `<fieldset>`; kept apart from the attribute so re-enabling restores it. */
    formDisabledCallback(disabled: boolean): void;
    formStateRestoreCallback(state: string): void;
    /** The CodeMirror view; undefined before the first connect and while disconnected. */
    get view(): EditorView | undefined;
    get value(): string;
    /** Replaces the document and, like a native `<textarea>`, clears the undo history. */
    set value(v: string);
    get name(): string;
    set name(v: string);
    get placeholder(): string;
    set placeholder(v: string);
    get rows(): number;
    set rows(v: number);
    get disabled(): boolean;
    set disabled(v: boolean);
    get readOnly(): boolean;
    set readOnly(v: boolean);
    get required(): boolean;
    set required(v: boolean);
    /** Markup display: `auto` (code on enter), `hide` (WYSIWYG only) or `show` (code only). */
    get marks(): MarksMode;
    set marks(v: MarksMode);
    /** @deprecated Use `marks = 'hide'`. Ignored while the `marks` attribute is set. */
    get hideMarks(): boolean;
    set hideMarks(v: boolean);
    /** @deprecated Use `marks = 'show'`. Ignored while the `marks` attribute is set. */
    get showMarks(): boolean;
    set showMarks(v: boolean);
    get plugins(): Array<MarkPlugin | Extension>;
    set plugins(list: Array<MarkPlugin | Extension> | null | undefined);
    get form(): HTMLFormElement | null;
    get validity(): ValidityState | undefined;
    get validationMessage(): string;
    checkValidity(): boolean;
    reportValidity(): boolean;
    focus(options?: FocusOptions): void;
    exec(actionId: ActionId): boolean;
    adoptStyles(...sheets: CSSStyleSheet[]): void;
    /** Upload actions, shortcuts, drop and paste. Opt-in: `uploads` attribute present and not "off". */
    get uploads(): boolean;
    set uploads(v: boolean);
    /** Space-separated action ids shown in the toolbar, in order. Null shows all actions. */
    get toolbar(): string[] | null;
    set toolbar(v: string[] | null);
    /** Per-action `title` and `label` (aria-label) overrides keyed by action id. */
    get labels(): ActionLabels;
    set labels(v: ActionLabels | null | undefined);
    /** All user-facing strings outside the toolbar; assign a partial map to override (see `defaultStrings`). */
    get strings(): Strings;
    set strings(v: Partial<Strings> | null | undefined);
    get upload(): UploadHandler;
    set upload(fn: UploadHandler | null | undefined);
    /** POST endpoint for uploads (multipart field `file`). Used when no custom `upload` is set. */
    get uploadUrl(): string | null;
    set uploadUrl(v: string | null);
    /** CSRF token sent as `X-CSRF-Token`. Falls back to `<meta name="csrf-token">`. */
    get csrfToken(): string | null;
    set csrfToken(v: string | null);
    pickFiles(kind?: UploadKind): void;
    /** Uploads a single image and returns its URL (null when uploads are off, cancelled or failed). Used by custom blocks. */
    uploadImage(file: File): Promise<string | null>;
    /** Uploads `files` and inserts their Markdown where the selection was when the upload started. */
    uploadFiles(files: Iterable<File> | ArrayLike<File>, kind?: UploadKind): Promise<void>;
}
export declare function defineMarkArea(tagName?: string): void;
declare global {
    interface HTMLElementTagNameMap {
        'mark-area': MarkArea;
    }
}
export {};
