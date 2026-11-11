import type { EditorView } from '@codemirror/view';
import type { MarkArea } from './mark-area.ts';

export const el = <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    props?: Partial<HTMLElementTagNameMap[K]>,
    part?: string
): HTMLElementTagNameMap[K] => {
    const node = Object.assign(document.createElement(tag), props);
    if (part) node.setAttribute('part', part);
    return node;
};

export const emit = <T>(target: EventTarget, name: string, detail: T) =>
    target.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, cancelable: true, detail }));

/** Lets plugins (WYSIWYG tables) intercept toolbar actions; returns true when handled. */
export const cellActionFor = new WeakMap<EditorView, (id: string) => boolean>();
export const hostFor = new WeakMap<EditorView, MarkArea>();
