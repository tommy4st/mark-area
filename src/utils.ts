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

const CONTROL_RE = /[\u0000-\u001f\u007f]/;

/** Returns the trimmed URL when its scheme is in `allowed` (or relative, with no control chars); otherwise null. */
const checkUrl = (url: string, allowed: readonly string[]): string | null => {
    const u = url.trim();
    if (!u || CONTROL_RE.test(u)) return null;
    const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(u.replace(/\s+/g, ''))?.[1]?.toLowerCase();
    return !scheme || allowed.includes(scheme) ? u : null;
};

/** Returns the URL when its scheme is http(s), mailto or tel (or it is relative); otherwise null. */
export const safeUrl = (url: string): string | null => checkUrl(url, ['http', 'https', 'mailto', 'tel']);

/** Like `safeUrl` for `<img src>`: allows http(s), relative, `blob:` and `data:image/…` (no `mailto:`/`tel:`). */
export const safeImageUrl = (url: string): string | null => {
    const u = url.trim();
    if (!u || CONTROL_RE.test(u)) return null;
    if (/^(data:image\/|blob:)/i.test(u.replace(/\s+/g, ''))) return u;
    return checkUrl(u, ['http', 'https']);
};

/** Makes a URL safe inside a Markdown `[text](url)` destination (no newlines, spaces or unescaped `)`). */
export const escapeMdUrl = (url: string): string =>
    url.replace(/[\r\n]+/g, '').replace(/\)/g, '%29').replace(/\s/g, (c) => encodeURIComponent(c));
