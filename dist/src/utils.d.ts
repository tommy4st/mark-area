export declare const el: <K extends keyof HTMLElementTagNameMap>(tag: K, props?: Partial<HTMLElementTagNameMap[K]>, part?: string) => HTMLElementTagNameMap[K];
export declare const emit: <T>(target: EventTarget, name: string, detail: T) => boolean;
/** Returns the URL when its scheme is http(s), mailto or tel (or it is relative); otherwise null. */
export declare const safeUrl: (url: string) => string | null;
/** Like `safeUrl` for `<img src>`: allows http(s), relative, `blob:` and `data:image/…` (no `mailto:`/`tel:`). */
export declare const safeImageUrl: (url: string) => string | null;
/** Makes a URL safe inside a Markdown `[text](url)` destination (no newlines, spaces or unescaped `)`). */
export declare const escapeMdUrl: (url: string) => string;
