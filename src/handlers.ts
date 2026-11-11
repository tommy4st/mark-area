import { EditorSelection } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import type { SyntaxNode } from './types.ts';
import { parseImageUrl } from './preview.ts';
import { el, emit, hostFor } from './utils.ts';

export const domHandlers = EditorView.domEventHandlers({
    click(event, view) {
        if (!(event.ctrlKey || event.metaKey)) return false;
        const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
        if (pos == null) return false;
        for (let n: SyntaxNode | null = syntaxTree(view.state).resolveInner(pos, 1); n; n = n.parent) {
            const urlNode = (n.name === 'Link' || n.name === 'Image') && n.getChild('URL');
            if (urlNode) {
                const { src: href, width } = parseImageUrl(view.state.sliceDoc(urlNode.from, urlNode.to));
                const label = /^!?\[([\s\S]*?)\]/.exec(view.state.sliceDoc(n.from, n.to))?.[1] || '';
                const host = hostFor.get(view);
                if (host && !emit(host, 'ma-link-click', { href, label, width, kind: n.name, originalEvent: event })) {
                    return true;
                }
                if (href.startsWith('data:')) {
                    el('a', { href, download: label || 'download' }).click();
                } else {
                    window.open(href, '_blank', 'noopener');
                }
                return true;
            }
        }
        return false;
    },
    drop: (event, view) => uploadFrom(view, event, event.dataTransfer?.files, view.posAtCoords({ x: event.clientX, y: event.clientY })),
    paste: (event, view) => uploadFrom(view, event, event.clipboardData?.files),
});

function uploadFrom(view: EditorView, event: Event, files?: FileList, pos?: number | null) {
    const host = files?.length ? hostFor.get(view) : undefined;
    if (!host || host.disabled || host.readOnly) return false;
    event.preventDefault();
    if (pos != null) view.dispatch({ selection: EditorSelection.cursor(pos) });
    void host.uploadFiles(files!);
    return true;
}
