import { EditorSelection, type EditorState, type Extension, StateEffect, StateField } from '@codemirror/state';
import { Decoration, type DecorationSet, EditorView, WidgetType } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { selectionTouches } from '../preview.ts';
import { icon } from '../commands.ts';
import { el, safeUrl } from '../utils.ts';
import { actionInterceptor, markAreaHost, marksMode, strings, type Strings } from '../host.ts';
import { applyInlineAction, inlineToMarkdown, rangeIn, renderInlineMarkdown, selectionOf } from '../inline-edit.ts';
import { blockAt, formatAttrs, parseBlock, type BlockContextApi, type BlockRenderer, type ParsedBlock } from './core.ts';

const CODE_ICON = icon('M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5');

/** Minimal safe renderer: paragraphs with bold, italic, strike, code and links; text only, never `innerHTML`. */
const renderBody = (md: string) => {
  const box = el('div', { className: 'ma-block-body' });
  for (const para of md.split(/\n{2,}/)) {
    if (!para.trim()) continue;
    const p = el('p');
    renderInlineMarkdown(para.trim().replace(/\n/g, ' '), p);
    box.append(p);
  }
  return box;
};

/** Inverse of `renderBody`: serializes edited rich text back to Markdown. */
const toMarkdown = (box: HTMLElement) => {
  const paras: string[] = [];
  let loose = '';
  for (const n of box.childNodes) {
    if (n instanceof HTMLElement && (n.tagName === 'P' || n.tagName === 'DIV')) {
      if (loose.trim()) paras.push(loose.trim());
      loose = '';
      paras.push(inlineToMarkdown(n, '\n').trim());
    } else loose += inlineToMarkdown(n, '\n');
  }
  if (loose.trim()) paras.push(loose.trim());
  return paras.filter(Boolean).join('\n\n');
};

/** End of the widget's opening fence line; always inside the block, even when the fence is indented. */
const fencePos = (view: EditorView, wrap: HTMLElement) => view.state.doc.lineAt(view.posAtDOM(wrap)).to;

/** Rewrites one attribute in the opening fence of the block that contains `wrap`; an empty value removes it. */
const setAttr = (view: EditorView, wrap: HTMLElement, key: string, value: string) => {
  const b = blockAt(view.state, fencePos(view, wrap));
  const clean = value.replace(/[\r\n]+/g, ' ').trim();
  const cur = b && Object.hasOwn(b.attrs, key) ? b.attrs[key] : undefined;
  if (!b || cur === clean || (cur === undefined && !clean)) return;
  const attrs = { ...b.attrs };
  if (clean) attrs[key] = clean;
  else delete attrs[key];
  const to = view.state.doc.lineAt(b.from).to;
  const fence = /^:+/.exec(view.state.sliceDoc(b.from, to))![0];
  const info = formatAttrs(attrs);
  view.dispatch({ changes: { from: b.from, to, insert: `${fence}${b.name}${info ? `{${info}}` : ''}` } });
};

const trimLines = (s: string) => s.replace(/^\n+|\n+$/g, '');

/** Rewrites the body lines of the block that contains `wrap`, widening fences if the body contains a closing fence line. */
const setBody = (view: EditorView, wrap: HTMLElement, text: string) => {
  const b = blockAt(view.state, fencePos(view, wrap));
  if (!b?.closed || trimLines(b.body) === text) return;
  const { doc } = view.state;
  const openLine = doc.lineAt(b.from);
  const closeLine = doc.lineAt(b.to);
  const from = openLine.to;
  const to = closeLine.from - 1;
  const openFence = /^:+/.exec(doc.sliceString(b.from, openLine.to))![0];
  let maxInnerFence = 0;
  for (const line of text.split('\n')) {
    const m = /^\s*(:{3,})\s*$/.exec(line);
    if (m) maxInnerFence = Math.max(maxInnerFence, m[1]!.length);
  }
  const changes: Array<{ from: number; to: number; insert: string }> = [
    { from, to, insert: text ? `\n${text}` : '' },
  ];
  if (maxInnerFence >= openFence.length) {
    const wider = ':'.repeat(maxInnerFence + 1);
    const closeIndent = /^\s*/.exec(closeLine.text)![0].length;
    changes.unshift({ from: b.from, to: b.from + openFence.length, insert: wider });
    changes.push({ from: closeLine.from + closeIndent, to: closeLine.to, insert: wider });
  }
  view.dispatch({ changes });
};

let plainOnly: boolean | undefined;
/** `plaintext-only` is missing in Firefox < 136; fall back to `true` with plain-text paste. */
const supportsPlainOnly = () => {
  if (plainOnly === undefined) {
    try {
      const d = document.createElement('div');
      d.contentEditable = 'plaintext-only';
      plainOnly = d.contentEditable === 'plaintext-only';
    } catch {
      plainOnly = false;
    }
  }
  return plainOnly;
};

/** Shared setup for in-card text fields: editable, labelled, isolated from CodeMirror key handling. */
const makeField = (node: HTMLElement, label: string, multiline: boolean, rich = false) => {
  const plain = !rich && supportsPlainOnly();
  node.contentEditable = plain ? 'plaintext-only' : 'true';
  node.spellcheck = false;
  node.role = 'textbox';
  node.ariaLabel = label;
  if (multiline) node.ariaMultiLine = 'true';
  node.classList.add('ma-editable');
  if (!plain) {
    node.onpaste = (e) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain') ?? '';
      const sel = selectionOf(node);
      const range = sel && rangeIn(sel, node);
      if (!range) return;
      range.deleteContents();
      const t = document.createTextNode(text);
      range.insertNode(t);
      sel.collapse(t, t.length);
    };
  }
  node.onmousedown = (e) => e.stopPropagation();
  node.onkeyup = (e) => (e.stopPropagation(), e.key === ' ' && e.preventDefault());
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const makeCtx = (view: EditorView, wrap: HTMLElement, wysiwyg: boolean): BlockContextApi => ({
  strings: view.state.facet(strings),
  renderBody(md) {
    const box = renderBody(md);
    if (view.state.readOnly) return box;
    const label = view.state.facet(strings).blockNotes;
    // Rich editing only when the preview round-trips; otherwise edits would flatten lists and line breaks.
    const rich = wysiwyg && toMarkdown(box) === trimLines(md);
    makeField(box, label, true, rich);
    box.dataset.ph = label.charAt(0).toLowerCase() + label.slice(1);
    box.classList.add('ma-editable-body');
    box.onkeydown = (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') (e.preventDefault(), box.blur());
      else if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase();
        const id = e.shiftKey ? (k === 'x' ? 'strike' : '') : ({ b: 'bold', i: 'italic', e: 'code', k: 'link' } as Record<string, string>)[k];
        if (id) (e.preventDefault(), richAction(view, id));
      }
    };
    if (rich) {
      // Keep the rendered view; only write back when the Markdown actually changed.
      box.classList.add('ma-rich');
      box.onblur = () => {
        const next = toMarkdown(box);
        if (next !== trimLines(md)) setBody(view, wrap, next);
      };
      return box;
    }
    box.onfocus = () => {
      box.textContent = md;
      const sel = selectionOf(box);
      sel?.selectAllChildren(box);
      sel?.collapseToEnd();
    };
    box.onblur = () => {
      const next = trimLines(box.innerText ?? box.textContent ?? '');
      if (next !== trimLines(md)) setBody(view, wrap, next);
      else box.replaceChildren(...renderBody(md).childNodes);
    };
    return box;
  },
  imageUpload(node, key) {
    const host = view.state.facet(markAreaHost);
    if (view.state.readOnly || !host?.uploads) return node;
    const upload = async (file?: File) => {
      if (!file?.type.startsWith('image/')) return;
      const url = await host.uploadImage(file);
      if (url) setAttr(view, wrap, key, url);
    };
    node.classList.add('ma-upload-target');
    node.onmousedown = (e) => e.stopPropagation();
    node.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const input = el('input', { type: 'file', accept: 'image/*' });
      input.onchange = () => void upload(input.files?.[0]);
      input.click();
    };
    node.ondragover = (e) => (e.preventDefault(), e.stopPropagation(), node.classList.add('ma-drop'));
    node.ondragleave = () => node.classList.remove('ma-drop');
    node.ondrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      node.classList.remove('ma-drop');
      void upload(e.dataTransfer?.files[0]);
    };
    return node;
  },
  editable(node, key) {
    if (view.state.readOnly) return node;
    makeField(node, capitalize(key), false);
    node.dataset.ph = key;
    node.onkeydown = (e) => {
      e.stopPropagation();
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && node instanceof HTMLAnchorElement && node.href) {
        e.preventDefault();
        const safe = safeUrl(node.href);
        if (safe) window.open(safe, '_blank', 'noopener');
      } else if (e.key === 'Enter' || e.key === 'Escape') (e.preventDefault(), node.blur());
    };
    if (node instanceof HTMLAnchorElement) node.onclick = (e) => e.metaKey || e.ctrlKey || e.preventDefault();
    node.onblur = () => setAttr(view, wrap, key, (node.textContent ?? '').replace(/\s+/g, ' ').trim());
    return node;
  },
});

const fallback = (name: string, body: string): HTMLElement => {
  const box = el('div', { className: 'ma-block' }, 'card');
  box.dataset.block = name;
  box.append(renderBody(body));
  return box;
};

class CustomBlockWidget extends WidgetType {
  constructor(
    readonly block: ParsedBlock,
    readonly raw: string,
    readonly renderer: BlockRenderer | undefined,
    readonly wysiwyg: boolean,
    readonly readOnly: boolean,
    readonly uploads: boolean,
    readonly strings: Strings
  ) {
    super();
  }
  override eq(o: CustomBlockWidget) {
    return (
      o.raw === this.raw &&
      o.renderer === this.renderer &&
      o.wysiwyg === this.wysiwyg &&
      o.readOnly === this.readOnly &&
      o.uploads === this.uploads &&
      o.strings === this.strings
    );
  }
  override toDOM(view: EditorView) {
    const { name, attrs, body } = this.block;
    const wrap = el('div', { className: 'cm-block-widget' });
    wrap.append(this.renderer ? this.renderer.render(attrs, body, makeCtx(view, wrap, this.wysiwyg)) : fallback(name, body));
    // WYSIWYG mode never reveals source, so it gets no toggle.
    if (!this.wysiwyg) {
      const label = view.state.facet(strings).blockSource;
      const src = el('button', { type: 'button', title: label, ariaLabel: label, className: 'ma-block-source', innerHTML: CODE_ICON }, 'source-toggle button');
      src.onmousedown = (e) => (e.preventDefault(), e.stopPropagation());
      src.onclick = (e) => {
        e.stopPropagation();
        view.focus();
        view.dispatch({ selection: EditorSelection.cursor(fencePos(view, wrap)), scrollIntoView: true });
      };
      wrap.append(src);
    }
    // Clicking the card (but not interactive summary/links) reveals the raw source.
    wrap.addEventListener('click', (e) => {
      if ((e.target as Element).closest('summary, .ma-editable')) return;
      view.focus();
      view.dispatch({ selection: EditorSelection.cursor(fencePos(view, wrap)), scrollIntoView: true });
    });
    return wrap;
  }
  override ignoreEvent() {
    return true;
  }
}

/** Editor focus as state: like preview and tables, cards reveal source only while the editor is focused. */
const setFocus = StateEffect.define<boolean>();

interface BlockDecos {
  deco: DecorationSet;
  /** Ranges of all custom blocks, used to skip rebuilds on selection-only changes. */
  ranges: { from: number; to: number }[];
  /** Indexes of blocks touched by the selection when `deco` was built. */
  active: string;
  focused: boolean;
}

const activeKey = (state: EditorState, ranges: BlockDecos['ranges'], focused: boolean) =>
  ranges.flatMap((r, i) => (selectionTouches(state, focused, r.from, r.to) ? [i] : [])).join();

const build = (state: EditorState, renderers: Map<string, BlockRenderer>, focused: boolean): BlockDecos => {
  const out: ReturnType<Decoration['range']>[] = [];
  const ranges: BlockDecos['ranges'] = [];
  const { doc } = state;
  const mode = state.facet(marksMode);
  const raw = mode === 'show';
  const uploads = state.facet(markAreaHost)?.uploads ?? false;
  const curStrings = state.facet(strings);
  // WYSIWYG mode keeps cards even when the selection touches the block.
  const shown = (from: number, to: number) => mode === 'hide' || !selectionTouches(state, focused, from, to);
  syntaxTree(state).iterate({
    enter({ name, node }) {
      if (name !== 'CustomBlock') return;
      const b = parseBlock(state, node);
      if (!b) return false;
      ranges.push({ from: b.from, to: b.to });
      if (b.closed && !b.nested && !raw && shown(b.from, b.to)) {
        const widget = new CustomBlockWidget(
          b,
          state.sliceDoc(b.from, b.to),
          renderers.get(b.name),
          mode === 'hide',
          state.readOnly,
          uploads,
          curStrings
        );
        out.push(Decoration.replace({ widget, block: true }).range(b.infoFrom, b.to));
      } else if (!b.nested) {
        for (let n = doc.lineAt(b.from).number, end = doc.lineAt(b.to).number; n <= end; n++) {
          out.push(Decoration.line({ class: 'cm-block-line' }).range(doc.line(n).from));
        }
      }
      return false;
    },
  });
  return { deco: Decoration.set(out, true), ranges, active: activeKey(state, ranges, focused), focused };
};

/** Applies toolbar actions to a focused card field; swallows unsupported ones so the main document stays untouched. */
const richAction = (view: EditorView, id: string) => {
  const active = (view.root as Document | ShadowRoot).activeElement;
  if (!(active instanceof HTMLElement) || !active.classList.contains('ma-editable')) return false;
  if (id === 'mode') return false;
  if (!active.classList.contains('ma-editable-body')) return true;
  const sel = selectionOf(active);
  if (!sel) return true;
  return applyInlineAction(active, sel, id, active.classList.contains('ma-rich'), view.state.facet(strings).linkPrompt, {
    promptRawLink: true,
  });
};

/** Block replace decorations must come from a StateField, not a ViewPlugin. */
export const customBlockWidgets = (blocks: BlockRenderer[]): Extension => {
  const renderers = new Map(blocks.map((b) => [b.name, b]));
  const field = StateField.define<BlockDecos>({
    create: (state) => build(state, renderers, false),
    update(value, tr) {
      const focused = tr.effects.reduce((f, e) => (e.is(setFocus) ? e.value : f), value.focused);
      if (tr.docChanged || tr.reconfigured || syntaxTree(tr.state) !== syntaxTree(tr.startState)) {
        return build(tr.state, renderers, focused);
      }
      if ((tr.selection || focused !== value.focused) && activeKey(tr.state, value.ranges, focused) !== value.active) {
        return build(tr.state, renderers, focused);
      }
      return focused === value.focused ? value : { ...value, focused };
    },
    provide: (f) => [
      EditorView.decorations.from(f, (v) => v.deco),
      EditorView.atomicRanges.of((view) => view.state.field(f).deco),
    ],
  });
  return [field, EditorView.focusChangeEffect.of((_, focusing) => setFocus.of(focusing)), actionInterceptor.of(richAction)];
};

export const blockStyles = /* css */ `
.cm-block-line { font-family: var(--ma-font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace); background: color-mix(in srgb, currentColor 5%, transparent); }
.cm-block-widget { padding: 4px 0; position: relative; }
.ma-block-source { position: absolute; top: 8px; right: 8px; opacity: 0; transition: opacity 0.15s; }
.cm-block-widget:hover .ma-block-source, .ma-block-source:focus-visible { opacity: 0.7; }
.ma-block-source:hover { opacity: 1 !important; }
.ma-block { border: 1px solid var(--ma-card-border, color-mix(in srgb, currentColor 25%, transparent)); border-radius: var(--ma-card-radius, 8px); background: var(--ma-card-bg, color-mix(in srgb, currentColor 5%, transparent)); padding: 0.6em 0.9em; }
.ma-editable { outline: none; cursor: text; border-radius: 3px; transition: background 0.15s, box-shadow 0.15s; }
.ma-editable-body { min-height: 1.5em; }
.ma-editable-body:focus { white-space: pre-wrap; }
.ma-editable:hover:not(:focus) { background: var(--ma-edit-hover, color-mix(in srgb, currentColor 8%, transparent)); box-shadow: 0 0 0 3px var(--ma-edit-hover, color-mix(in srgb, currentColor 8%, transparent)); }
.ma-editable:empty::before { content: attr(data-ph); opacity: 0.4; }
.ma-editable:focus-visible { outline: 2px solid var(--ma-focus-color, currentColor); outline-offset: 2px; }
@media (hover: none) { .ma-block-source { opacity: 0.7; } }
@media (prefers-reduced-motion: reduce) { .ma-block-source, .ma-editable { transition: none; } }
.ma-block-body p { margin: 0.3em 0; }
.ma-upload-target { cursor: pointer; }
.ma-upload-target.ma-drop { outline: 2px dashed var(--ma-focus-color, currentColor); outline-offset: 2px; }
`;
