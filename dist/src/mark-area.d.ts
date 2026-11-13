import { type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import type { ActionId, MarkPlugin, UploadHandler } from './types.ts';
type ActionLabels = Record<string, {
    label?: string;
    title?: string;
}>;
export declare class MarkArea extends HTMLElement {
    #private;
    static formAssociated: boolean;
    static observedAttributes: string[];
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null): void;
    formResetCallback(): void;
    formDisabledCallback(disabled: boolean): void;
    formStateRestoreCallback(state: string): void;
    get view(): EditorView;
    get value(): string;
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
    get hideMarks(): boolean;
    set hideMarks(v: boolean);
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
    get upload(): UploadHandler;
    set upload(fn: UploadHandler | null | undefined);
    pickFiles(kind?: 'image' | 'file'): void;
    uploadFiles(files: Iterable<File> | ArrayLike<File>, kind?: 'image' | 'file'): Promise<void>;
}
export declare function defineMarkArea(tagName?: string): void;
declare global {
    interface HTMLElementTagNameMap {
        'mark-area': MarkArea;
    }
}
export {};
