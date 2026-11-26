import type { MarkPlugin } from './src/types.ts';
import { type BlockRenderer } from './src/blocks/core.ts';
import { vcardBlock } from './src/blocks/vcard.ts';
import { faqBlock } from './src/blocks/faq.ts';
export type { BlockAttrs, BlockContextApi, BlockRenderer, ParsedBlock } from './src/blocks/core.ts';
export { blockAt, parseAttrs, safeImageUrl, safeUrl } from './src/blocks/core.ts';
export { vcardBlock, faqBlock };
export interface CustomBlocksOptions {
    blocks?: BlockRenderer[];
    /** Adds an insert action per block type (default true). */
    toolbar?: boolean;
}
/** Opt-in `:::name{attrs}` … `:::` containers rendered as cards while the cursor is outside. */
export declare const customBlocksPlugin: ({ blocks, toolbar }?: CustomBlocksOptions) => MarkPlugin;
