import type { EditorState } from '@codemirror/state';
import type { BlockContext, MarkdownConfig } from '@lezer/markdown';
import type { EditorAction, SyntaxNode } from '../types.ts';
import type { Strings } from '../host.ts';
import { findEnclosingNode, icon, insertParagraph } from '../commands.ts';
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

const OPEN = /^(:{3,})([a-z][\w-]*)(?:\{(.*)\})?\s*$/;
const CLOSE = /^(:{3,})\s*$/;
const ATTR = /(?:#([\w-]+))|(?:\.([\w-]+))|([^\s=#.{}"'][^\s=}"']*)(?:=(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^\s"'}]+)))?/g;

const unescape = (s: string) => s.replace(/\\(.)/g, '$1');

/** Parses the inside of `{…}`: `key="v"`, `key='v'`, `key=v`, bare `key`, `#id`, `.class`. */
export function parseAttrs(info: string): BlockAttrs {
    const out: BlockAttrs = {};
    for (const m of info.matchAll(ATTR)) {
        if (m[1]) out.id = m[1];
        else if (m[2]) out.class = out.class && out.class !== true ? `${out.class} ${m[2]}` : m[2];
        else if (m[3] && m[3] !== '__proto__' && m[3] !== 'constructor' && m[3] !== 'prototype') {
            const v = m[4] ?? m[5];
            out[m[3]] = v !== undefined ? unescape(v) : (m[6] ?? true);
        }
    }
    return out;
}

/** Serializes attributes back to `{…}` content (inverse of `parseAttrs`). */
export function formatAttrs(attrs: BlockAttrs): string {
    const q = (v: string) => `"${v.replace(/[\\"]/g, '\\$&')}"`;
    return Object.entries(attrs)
        .map(([k, v]) =>
            k === 'id' && typeof v === 'string' && /^[\w-]+$/.test(v) ? `#${v}`
            : k === 'class' && typeof v === 'string' && /^[\w-]+( [\w-]+)*$/.test(v) ? v.split(' ').map((c) => `.${c}`).join('')
            : v === true ? k
            : `${k}=${q(v)}`
        )
        .join(' ');
}


/** Lezer block parser for `:::name{attrs}` … `:::` (top-level, no nesting; body kept as raw lines). */
export const customBlockConfig: MarkdownConfig = {
    defineNodes: [{ name: 'CustomBlock', block: true }, 'CustomBlockMark', 'CustomBlockInfo'],
    parseBlock: [
        {
            name: 'CustomBlock',
            before: 'FencedCode',
            parse(cx: BlockContext, line) {
                const open = OPEN.exec(line.text.slice(line.pos));
                if (!open) return false;
                const start = cx.lineStart;
                const from = start + line.pos;
                const fenceLen = open[1]!.length;
                const markTo = start + line.pos + fenceLen;
                const children = [
                    cx.elt('CustomBlockMark', start + line.pos, markTo),
                    cx.elt('CustomBlockInfo', markTo, start + line.text.length),
                ];
                let end = start + line.text.length;
                while (cx.nextLine()) {
                    end = cx.lineStart + line.text.length;
                    const close = CLOSE.exec(line.text.slice(line.pos));
                    if (close && close[1]!.length >= fenceLen) {
                        children.push(cx.elt('CustomBlockMark', cx.lineStart + line.pos, end));
                        cx.nextLine();
                        break;
                    }
                }
                cx.addElement(cx.elt('CustomBlock', from, end, children));
                return true;
            },
        },
    ],
};

export function parseBlock(state: EditorState, node: SyntaxNode): ParsedBlock | null {
    const { doc } = state;
    const first = doc.lineAt(node.from);
    const last = doc.lineAt(node.to);
    const open = OPEN.exec(doc.sliceString(node.from, first.to));
    if (!open) return null;
    const lastChild = node.lastChild;
    const closed = lastChild?.name === 'CustomBlockMark' && lastChild.from > first.to;
    const bodyTo = closed ? last.from - 1 : node.to;
    const body = bodyTo > first.to ? doc.sliceString(first.to + 1, bodyTo) : '';
    return {
        from: node.from,
        to: node.to,
        name: open[2]!,
        attrs: parseAttrs(open[3] ?? ''),
        body,
        closed,
        infoFrom: first.from,
        nested: node.parent?.name !== 'Document',
    };
}

/** Parses the custom block enclosing `pos`, if any. */
export const blockAt = (state: EditorState, pos: number) => {
    const node = findEnclosingNode(state, pos, pos, 'CustomBlock');
    return node && parseBlock(state, node);
};

/** Builds an action inserting `template` as its own paragraph at the cursor line, leaving the cursor after it. */
export const insertBlockAction = (id: string, template: string, svgPath: string, label: string): EditorAction => ({
    id,
    label,
    html: icon(svgPath),
    run: (view) => insertParagraph(view, template),
});
