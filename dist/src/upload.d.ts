import type { UploadKind } from './host.ts';
import type { UploadHandler } from './types.ts';
export interface UploadHost extends HTMLElement {
    upload: UploadHandler;
    uploadUrl: string | null;
    csrfToken: string | null;
}
/** Encodes the file as a Base64 `data:` URL. */
export declare const defaultUpload: UploadHandler;
/** Uploads one file through `ma-upload` and the upload handler; returns null when cancelled or failed. */
export declare function uploadOne(host: UploadHost, file: File, kind: UploadKind): Promise<{
    url: string;
    name: string;
} | null>;
export declare function whileUploading<T>(host: HTMLElement, fn: () => Promise<T>): Promise<T>;
/** Uploads `files` in order and returns one Markdown snippet per success; failures never abort the batch. */
export declare function uploadSnippets(host: UploadHost, files: File[], kind?: UploadKind): Promise<string[]>;
