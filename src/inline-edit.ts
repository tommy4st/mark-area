import { el, escapeMdUrl, safeUrl } from './utils.ts';

const isWord = (c: string | undefined) => !!c && /[\p{L}\p{N}_]/u.test(c);

/** `window.getSelection()` does not expose ranges inside shadow roots in Chromium; the root does. */
export const selectionOf = (node: Node): Selection | null =>
  (node.getRootNode() as unknown as { getSelection?: () => Selection | null }).getSelection?.() ??
  window.getSelection?.() ??
  null;

/** Character offset of `(node, offset)` within `root`'s text. */
export const textOffset = (root: Node, node: Node, offset: number): number => {
  const r = document.createRange();
  r.selectNodeContents(root);
  r.setEnd(node, offset);
  return r.toString().length;
};

/** Expands a collapsed range inside a text node to the surrounding word. */
const expandWord = (range: Range): void => {
  if (!range.collapsed || range.startContainer.nodeType !== Node.TEXT_NODE) return;
  const text = range.startContainer.textContent ?? '';
  let s = range.startOffset;
  let e = s;
  while (s > 0 && isWord(text[s - 1])) s--;
  while (e < text.length && isWord(text[e])) e++;
  range.setStart(range.startContainer, s);
  range.setEnd(range.startContainer, e);
};

const INLINE_TAGS: Record<string, string> = {
  STRONG: '**',
  B: '**',
  EM: '*',
  I: '*',
  S: '~~',
  STRIKE: '~~',
  DEL: '~~',
  CODE: '`',
};

const ACTION_MARKERS: Record<string, string> = {
  bold: '**',
  italic: '*',
  strike: '~~',
  code: '`',
};

const INLINE_RE = /\*\*(.+?)\*\*|\*(.+?)\*|~~(.+?)~~|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;

/** Safely renders inline Markdown (bold, italic, strike, code, safe links) into `into` using DOM nodes only. */
export const renderInlineMarkdown = (
  raw: string,
  into: HTMLElement,
  opts?: { linkClass?: string; codeClass?: string; unescapePipes?: boolean }
): void => {
  const text = opts?.unescapePipes ? raw.replace(/\\\|/g, '|') : raw;
  let last = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    into.append(text.slice(last, m.index));
    last = m.index + m[0].length;
    if (m[1] !== undefined) into.append(el('strong', { textContent: m[1] }));
    else if (m[2] !== undefined) into.append(el('em', { textContent: m[2] }));
    else if (m[3] !== undefined) into.append(el('s', { textContent: m[3] }));
    else if (m[4] !== undefined) into.append(el('code', { className: opts?.codeClass ?? '', textContent: m[4] }));
    else {
      const href = safeUrl(m[6]!);
      into.append(
        href
          ? el('a', { className: opts?.linkClass ?? '', href, rel: 'noopener noreferrer', textContent: m[5]! })
          : m[5]!
      );
    }
  }
  into.append(text.slice(last));
};

/** Serializes an inline DOM subtree back to Markdown (`br` controls `<br>` output). */
export const inlineToMarkdown = (node: Node, br = ' '): string => {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (!(node instanceof HTMLElement)) return '';
  if (node.tagName === 'BR') return br;
  const inner = Array.from(node.childNodes, (n) => inlineToMarkdown(n, br)).join('');
  if (!inner.trim()) return inner;
  const m = INLINE_TAGS[node.tagName];
  if (m) return m + inner + m;
  if (node.tagName === 'A') {
    const href = node.getAttribute('href');
    return href ? `[${inner}](${escapeMdUrl(href)})` : inner;
  }
  return inner;
};

/** Toggles an inline Markdown marker (or wraps a link) inside a plain-text editable container. */
const toggleRawMarker = (
  container: HTMLElement,
  sel: Selection,
  range: Range,
  id: string,
  getLinkUrl?: () => string | null
): void => {
  const text = container.textContent ?? '';
  let a = textOffset(container, range.startContainer, range.startOffset);
  let b = textOffset(container, range.endContainer, range.endOffset);
  if (a === b) {
    while (a > 0 && isWord(text[a - 1])) a--;
    while (b < text.length && isWord(text[b])) b++;
  }
  const marker = ACTION_MARKERS[id];
  const len = marker?.length ?? 0;
  const around =
    !!marker &&
    a >= len &&
    text.slice(a - len, a) === marker &&
    text.slice(b, b + len) === marker &&
    (marker !== '*' || (text[a - 2] !== '*' && text[b + 1] !== '*'));
  const inside =
    !!marker &&
    !around &&
    b - a >= len * 2 &&
    text.slice(a, a + len) === marker &&
    text.slice(b - len, b) === marker &&
    (marker !== '*' || (text[a + 1] !== '*' && text[b - 2] !== '*'));

  let out: string;
  let selFrom: number;
  let selTo: number;
  if (around || inside) {
    const from = around ? a - len : a;
    const to = around ? b + len : b;
    out = text.slice(0, from) + text.slice(from + len, to - len) + text.slice(to);
    selFrom = from;
    selTo = to - len * 2;
  } else if (marker) {
    out = text.slice(0, a) + marker + text.slice(a, b) + marker + text.slice(b);
    selFrom = a + len;
    selTo = b + len;
  } else {
    const url = getLinkUrl ? getLinkUrl() : 'https://';
    if (!url) return;
    out = `${text.slice(0, a)}[${text.slice(a, b)}](${escapeMdUrl(url)})${text.slice(b)}`;
    selFrom = a + 1;
    selTo = b + 1;
  }
  container.textContent = out;
  const target = container.firstChild ?? container;
  if (target.nodeType === Node.TEXT_NODE) {
    sel.setBaseAndExtent(target, selFrom, target, selTo);
  } else {
    sel.collapse(target, 0);
  }
};

/** Unwraps an enclosing inline tag or safely wraps `range` (works across partial element boundaries). */
const toggleInlineTag = (
  root: HTMLElement,
  sel: Selection,
  range: Range,
  tag: keyof HTMLElementTagNameMap,
  marker?: string,
  props?: Partial<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>
): boolean => {
  for (let n: Node | null = range.commonAncestorContainer; n && n !== root; n = n.parentNode) {
    if (n instanceof HTMLElement && (n.tagName.toLowerCase() === tag || (marker && INLINE_TAGS[n.tagName] === marker))) {
      const kids = Array.from(n.childNodes);
      n.replaceWith(...kids);
      if (kids.length) {
        const r = document.createRange();
        r.setStartBefore(kids[0]!);
        r.setEndAfter(kids[kids.length - 1]!);
        sel.removeAllRanges();
        sel.addRange(r);
      }
      return true;
    }
  }
  if (range.collapsed) return false;
  const wrapper = el(tag, props as never);
  wrapper.append(range.extractContents());
  range.insertNode(wrapper);
  sel.selectAllChildren(wrapper);
  return true;
};

const ACTION_TAGS: Record<string, keyof HTMLElementTagNameMap> = { bold: 'strong', italic: 'em', strike: 's', code: 'code' };
const PASSTHROUGH = new Set(['undo', 'redo', 'mode']);

/** Applies a toolbar action to a focused inline-editable container (table cell or block body). Returns false to pass through to CodeMirror. */
export const applyInlineAction = (
  root: HTMLElement,
  sel: Selection,
  id: string,
  rendered: boolean,
  linkPrompt: string,
  opts?: { linkClass?: string; codeClass?: string; promptRawLink?: boolean }
): boolean => {
  if (PASSTHROUGH.has(id)) return false;
  const marker = ACTION_MARKERS[id];
  if ((!marker && id !== 'link') || !sel.rangeCount) return true;

  const range = sel.getRangeAt(0);
  expandWord(range);

  if (!rendered) {
    toggleRawMarker(
      root,
      sel,
      range,
      id,
      opts?.promptRawLink ? () => safeUrl(prompt(linkPrompt, 'https://') ?? '') : undefined
    );
    return true;
  }

  const tag = marker ? ACTION_TAGS[id]! : 'a';
  if (tag === 'a') {
    for (let n: Node | null = range.commonAncestorContainer; n && n !== root; n = n.parentNode) {
      if (n instanceof HTMLElement && n.tagName === 'A') {
        toggleInlineTag(root, sel, range, 'a');
        return true;
      }
    }
    if (range.collapsed) return true;
    const url = safeUrl(prompt(linkPrompt, 'https://') ?? '');
    if (!url) return true;
    toggleInlineTag(root, sel, range, 'a', undefined, {
      href: url,
      className: opts?.linkClass ?? '',
      rel: 'noopener noreferrer',
    });
    return true;
  }
  toggleInlineTag(root, sel, range, tag, marker, tag === 'code' && opts?.codeClass ? { className: opts.codeClass } : undefined);
  return true;
};
