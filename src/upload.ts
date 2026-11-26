import type { UploadKind } from './host.ts';
import type { UploadHandler, UploadResult } from './types.ts';
import { emit, escapeMdUrl } from './utils.ts';

export interface UploadHost extends HTMLElement {
    upload: UploadHandler;
    uploadUrl: string | null;
    csrfToken: string | null;
}

/** Encodes the file as a Base64 `data:` URL. */
export const defaultUpload: UploadHandler = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ url: String(reader.result), name: file.name });
        reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });

/** POSTs the file as multipart field `file` to `url`; the response is a URL (text) or `{ url, name? }` (JSON). */
async function postUpload(url: string, token: string | null, file: File, kind: UploadKind): Promise<UploadResult> {
    const body = new FormData();
    body.append('file', file);
    body.append('kind', kind);
    const res = await fetch(url, {
        method: 'POST',
        body,
        credentials: 'same-origin',
        headers: { Accept: 'application/json', ...(token ? { 'X-CSRF-Token': token } : {}) },
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        let message = text.trim();
        try {
            const json = JSON.parse(text) as { error?: string; message?: string };
            message = json.error ?? json.message ?? message;
        } catch {}
        throw new Error(message || `Upload failed: ${res.status} ${res.statusText}`);
    }
    const type = res.headers.get('content-type') ?? '';
    return type.includes('json') ? ((await res.json()) as UploadResult) : (await res.text()).trim();
}

/** Uploads one file through `ma-upload` and the upload handler; returns null when cancelled or failed. */
export async function uploadOne(host: UploadHost, file: File, kind: UploadKind): Promise<{ url: string; name: string } | null> {
    const detail = { file, kind, result: undefined as Promise<UploadResult> | UploadResult | undefined };
    if (!emit(host, 'ma-upload', detail)) return null;
    try {
        const url = host.upload === defaultUpload ? host.uploadUrl : null;
        let csrf: string | null = null;
        if (url) {
            let sameOrigin = typeof location === 'undefined';
            if (!sameOrigin) {
                try {
                    sameOrigin = new URL(url, location.href).origin === location.origin;
                } catch {}
            }
            csrf = host.hasAttribute('csrf-token') || sameOrigin ? host.csrfToken : null;
        }
        const res = await (detail.result ?? (url ? postUpload(url, csrf, file, kind) : host.upload(file, kind)));
        const rawSrc = typeof res === 'string' ? res : res?.url;
        const src = rawSrc?.replace(/[\r\n]+/g, '').trim();
        if (!src) throw new Error('Upload returned no URL');
        const rawName = (typeof res === 'object' && res.name) || file.name || 'file';
        return { url: src, name: rawName.replace(/[\[\]\r\n]+/g, ' ').trim() || 'file' };
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        host.toggleAttribute('upload-error', true);
        if (emit(host, 'ma-upload-error', { file, kind, error })) {
            console.error(`mark-area: upload of "${file.name}" failed`, error);
        }
        return null;
    }
}

/** Runs `fn` with the `uploading` attribute set and `upload-error` cleared. */
const activeUploads = new WeakMap<HTMLElement, number>();

export async function whileUploading<T>(host: HTMLElement, fn: () => Promise<T>): Promise<T> {
    const count = (activeUploads.get(host) ?? 0) + 1;
    activeUploads.set(host, count);
    host.toggleAttribute('uploading', true);
    host.toggleAttribute('upload-error', false);
    try {
        return await fn();
    } finally {
        const left = (activeUploads.get(host) ?? 1) - 1;
        if (left <= 0) {
            activeUploads.delete(host);
            host.toggleAttribute('uploading', false);
        } else {
            activeUploads.set(host, left);
        }
    }
}

/** Uploads `files` in order and returns one Markdown snippet per success; failures never abort the batch. */
export async function uploadSnippets(host: UploadHost, files: File[], kind?: UploadKind): Promise<string[]> {
    const snippets: string[] = [];
    for (const file of files) {
        const fileKind: UploadKind = kind === 'image' || (kind !== 'file' && file.type.startsWith('image/')) ? 'image' : 'file';
        const res = await uploadOne(host, file, fileKind);
        if (res) {
            snippets.push(`${fileKind === 'image' ? '!' : ''}[${res.name}](${escapeMdUrl(res.url)})`);
        }
    }
    return snippets;
}
