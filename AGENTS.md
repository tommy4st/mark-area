# AGENTS.md

## Overview
`<mark-area>` is a modular TypeScript Web Component (`src/mark-area.ts`) providing a CodeMirror 6 Markdown editor with live preview, Shadow DOM styling (`--ma-*` CSS custom properties, `::part()`, `adoptStyles()`), form association (`ElementInternals`), image/file uploads with interactive image resizing, and opt-in GFM table plugins.

## Project Structure
- `index.ts` / `define.ts` / `tables.ts` / `standalone.ts` — Entry points (class only, class + registration, all table variants, everything bundled).
- `src/` — Modules: `types`, `utils`, `preview`, `commands`, `handlers`, `styles`, `mark-area`, and `table/{core,widget,inline,preview,wysiwyg}`. Tables are opt-in via `editor.plugins`.
- `index.html` — Interactive demo/test page served by `bun index.html`.
- `dist/` — Split ESM library (`--packages external`), `dist/standalone.js` single-file bundle, and `.d.ts` files from `bun run build`.
- `package.json` / `devbox.json` — Scripts and dependencies.

## Commands
- `devbox run dev` (or `bun run dev`) — Start the dev server for `index.html` (it imports `define.ts` directly).
- `devbox run check` (or `bun run check`) — Run `tsc --noEmit` and build `dist/`. Always run this after modifying source files.
- `devbox run typecheck` (or `bun run typecheck`) — Type-check without emitting files.
- `devbox run build` (or `bun run build`) — Build the split library and the standalone bundle.

## Architecture & Conventions
- **Keep it lean**: Keep modules small and focused, without adding unnecessary dependencies or abstraction layers.
- **Shadow DOM & Styling**:
  - All component styles live in the exported `styles` template string in `src/styles.ts` and are shared via a single `CSSStyleSheet` (`getSheet()`).
  - Expose new visual values through `--ma-*` CSS custom properties with sensible defaults (`currentColor` / `color-mix`) so both light and dark modes work automatically.
  - Use `drawSelection()` in CodeMirror so `.cm-cursor` and `.cm-selectionBackground` render reliably across browsers and color schemes inside the Shadow root.
- **Plugins**: `editor.plugins` takes `MarkPlugin` objects (`markdown`, `extension`, `actions`, `styles`) or raw CodeMirror extensions. Table variants (`tableInlinePlugin`, `tablePreviewPlugin`, `tableWysiwygPlugin`) share `src/table/core.ts`; use one at a time.
- **Formatting Commands**:
  - Inline commands (`wrap`, `link`): When already inside the target syntax node, select the full node and strip markers; when collapsed outside, select the closest word on the current line (`targetRange`) and apply markers.
  - Block commands (`heading`, `bullet`, `ordered`, `quote`): Always operate on the current line at the cursor (`selection.main.head`), toggling or replacing competing block prefixes (`blockPrefix`).
- **Events & Uploads**:
  - Forward rich `detail` payloads via cancelable `CustomEvent`s (`emit()`): `input`, `change`, `ma-action`, `ma-upload`, `ma-uploaded`, `ma-link-click`, `ma-image-resize`.
  - Default upload (`defaultUpload`) encodes files as Base64 `data:` URLs; users can override `editor.upload = async (file, kind) => ...` or intercept `ma-upload`.
  - Image widths are stored in the URL hash fragment (`![alt](url#w=300)` or `![alt](url#w=50%)`) and parsed by `parseImageUrl()`.
