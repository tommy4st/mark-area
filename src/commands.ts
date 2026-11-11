import { EditorSelection, type EditorState } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { EditorAction, SyntaxNode, UploadHandler } from './types.ts';
import { emit, hostFor } from './utils.ts';

// ---- Formatting commands ----

const markerNode: Record<string, string> = {
    '**': 'StrongEmphasis',
    '*': 'Emphasis',
    '~~': 'Strikethrough',
    '`': 'InlineCode',
};

const blockPrefix = /^(?:#{1,6} |(?:[-*+]|\d+\.) |> ?)/;

export function findEnclosingNode(state: EditorState, from: number, to: number, nodeName: string): SyntaxNode | null {
    const tree = syntaxTree(state);
    for (const side of [0, 1, -1] as const) {
        for (let n: SyntaxNode | null = tree.resolveInner(from, side); n; n = n.parent) {
            if (n.name === nodeName && n.from <= from && n.to >= to) return n;
        }
    }
    return null;
}

function targetRange(state: EditorState, from: number, to: number): { from: number; to: number } {
    if (from < to) return { from, to };
    const direct = state.wordAt(from);
    if (direct) return direct;

    const line = state.doc.lineAt(from);
    const [prefix = ''] = line.text.match(/^(?:#{1,6} |(?:[-*+]|\d+\.) |> ?)+/) || [];
    const start = line.from + prefix.length;
    let best: { from: number; to: number; dist: number } | null = null;

    for (const m of line.text.slice(prefix.length).matchAll(/[\p{L}\p{N}_]+/gu)) {
        const wFrom = start + m.index!;
        const wTo = wFrom + m[0].length;
        const dist = from < wFrom ? wFrom - from : from > wTo ? from - wTo : 0;
        if (!best || dist < best.dist) best = { from: wFrom, to: wTo, dist };
    }
    return best ? { from: best.from, to: best.to } : { from, to };
}

const wrap = (marker: string) => (view: EditorView) => {
    const len = marker.length;
    const nodeName = markerNode[marker];
    const { state } = view;
    const hasMarker = (a: number, b: number) =>
        b - a >= len * 2 && state.sliceDoc(a, a + len) === marker && state.sliceDoc(b - len, b) === marker;

    view.dispatch(
        state.changeByRange(({ from, to }) => {
            const node = nodeName ? findEnclosingNode(state, from, to, nodeName) : null;
            const span =
                node && hasMarker(node.from, node.to)
                    ? node
                    : hasMarker(from - len, to + len)
                      ? { from: from - len, to: to + len }
                      : hasMarker(from, to)
                        ? { from, to }
                        : null;

            if (span) {
                return {
                    changes: [
                        { from: span.from, to: span.from + len },
                        { from: span.to - len, to: span.to },
                    ],
                    range: EditorSelection.range(span.from, span.to - len * 2),
                };
            }

            const target = targetRange(state, from, to);
            return {
                changes: [
                    { from: target.from, insert: marker },
                    { from: target.to, insert: marker },
                ],
                range: EditorSelection.range(target.from + len, target.to + len),
            };
        })
    );
    return true;
};

const replaceLinePrefix = (view: EditorView, matchLen: number, insert: string) => {
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    const set = view.state.changes({ from: line.from, to: line.from + matchLen, insert });
    view.dispatch({ changes: set, selection: view.state.selection.map(set, 1) });
    return true;
};

const linePrefix = (re: RegExp, add: string) => (view: EditorView) => {
    const { text } = view.state.doc.lineAt(view.state.selection.main.head);
    const remove = re.test(text);
    const [prefix = ''] = text.match(remove ? re : blockPrefix) || [];
    return replaceLinePrefix(view, prefix.length, remove ? '' : add);
};

const heading = (view: EditorView) => {
    const { text } = view.state.doc.lineAt(view.state.selection.main.head);
    const [, hashes = ''] = text.match(/^(#{1,6}) /) || [];
    const [prefix = ''] = text.match(blockPrefix) || [];
    return replaceLinePrefix(view, prefix.length, hashes.length < 2 ? '## ' : hashes.length === 2 ? '### ' : '');
};

/** Applies a link to the main selection. With `hide`, an empty `url` on a new link is a no-op and on an existing one removes it. */
const applyLink = (view: EditorView, url: string, hide: boolean) => {
    const { state } = view;
    const { from, to } = state.selection.main;
    const node = findEnclosingNode(state, from, to, 'Link');
    const urlNode = hide && url ? node?.getChild('URL') : null;
    if (urlNode) {
        view.dispatch({ changes: { from: urlNode.from, to: urlNode.to, insert: url } });
    } else if (node) {
        const raw = state.sliceDoc(node.from, node.to);
        const text = /^\[([\s\S]*?)\]\([\s\S]*\)$/.exec(raw)?.[1] ?? raw;
        view.dispatch({
            changes: { from: node.from, to: node.to, insert: text },
            selection: EditorSelection.range(node.from, node.from + text.length),
        });
    } else if (!hide || url) {
        const target = targetRange(state, from, to);
        const hasWord = target.to > target.from;
        const text = hasWord ? state.sliceDoc(target.from, target.to) : 'link';
        const urlStart = target.from + text.length + 3;
        view.dispatch({
            changes: { from: target.from, to: target.to, insert: `[${text}](${url})` },
            selection: hide
                ? EditorSelection.range(target.from + 1, target.from + 1 + text.length)
                : hasWord
                  ? EditorSelection.range(urlStart, urlStart + url.length)
                  : EditorSelection.range(target.from + 1, target.from + 5),
        });
    }
};

const link = (view: EditorView) => {
    const host = hostFor.get(view);
    if (!host?.hideMarks) {
        applyLink(view, 'https://', false);
        return true;
    }
    const { state } = view;
    const { from, to } = state.selection.main;
    const urlNode = findEnclosingNode(state, from, to, 'Link')?.getChild('URL');
    const current = urlNode ? state.sliceDoc(urlNode.from, urlNode.to) : 'https://';
    // `apply(null)` cancels; an empty string removes an existing link. Safe to call asynchronously.
    const apply = (input: string | null) => {
        if (input !== null) applyLink(view, input.trim(), true);
    };
    if (emit(host, 'ma-link-prompt', { url: current, exists: !!urlNode, apply })) {
        apply(prompt(urlNode ? 'Link URL (empty to remove link)' : 'Link URL', current));
    }
    return true;
};

export const defaultUpload: UploadHandler = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ url: String(reader.result), name: file.name });
        reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });

const pickUpload = (kind: 'image' | 'file') => (view: EditorView) => {
    hostFor.get(view)?.pickFiles(kind);
    return true;
};

export const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
export const mod = mac ? '⌘' : 'Ctrl+';
export const shift = mac ? '⇧' : 'Shift+';
export const alt = mac ? '⌥' : 'Alt+';

export const icon = (d: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`;

export const actions: EditorAction[] = [
    { id: 'bold', run: wrap('**'), key: 'Mod-b', hint: mod + 'B', html: '<b>B</b>' },
    { id: 'italic', run: wrap('*'), key: 'Mod-i', hint: mod + 'I', html: '<i>I</i>' },
    { id: 'strike', run: wrap('~~'), key: 'Mod-Shift-x', hint: mod + shift + 'X', html: '<s>S</s>' },
    { id: 'heading', run: heading, key: 'Mod-Alt-h', hint: mod + alt + 'H', html: 'H' },
    {
        id: 'bullet',
        run: linePrefix(/^[-*+] /, '- '),
        key: 'Mod-Shift-8',
        hint: mod + shift + '8',
        html: icon(
            'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
        ),
    },
    {
        id: 'ordered',
        run: linePrefix(/^\d+\. /, '1. '),
        key: 'Mod-Shift-7',
        hint: mod + shift + '7',
        html: icon(
            'M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99'
        ),
    },
    { id: 'quote', run: linePrefix(/^> ?/, '> '), key: 'Mod-Shift-9', hint: mod + shift + '9', html: '&rdquo;' },
    {
        id: 'code',
        run: wrap('`'),
        key: 'Mod-e',
        hint: mod + 'E',
        html: icon('M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5'),
    },
    {
        id: 'link',
        run: link,
        key: 'Mod-k',
        hint: mod + 'K',
        html: icon(
            'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244'
        ),
    },
    {
        id: 'image',
        run: pickUpload('image'),
        key: 'Mod-Shift-i',
        hint: mod + shift + 'I',
        html: icon(
            'm2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
        ),
    },
    {
        id: 'file',
        run: pickUpload('file'),
        key: 'Mod-Shift-u',
        hint: mod + shift + 'U',
        html: icon(
            'm18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13'
        ),
    },
];

export const actionMap = new Map(actions.map((a) => [a.id, a]));
