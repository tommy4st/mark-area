import type { MarkPlugin } from './src/types.ts';
import { customBlockConfig, type BlockRenderer } from './src/blocks/core.ts';
import { blockStyles, customBlockWidgets } from './src/blocks/widget.ts';
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
export const customBlocksPlugin = ({ blocks = [vcardBlock, faqBlock], toolbar = true }: CustomBlocksOptions = {}): MarkPlugin => ({
  markdown: customBlockConfig,
  extension: customBlockWidgets(blocks),
  actions: toolbar ? blocks.flatMap((b) => (b.action ? [b.action] : [])) : [],
  styles: blockStyles + blocks.map((b) => b.styles ?? '').join(''),
});
