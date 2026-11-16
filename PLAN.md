# PLAN: Custom Blocks (`:::name{attrs}` containers)

## Objective & Scope
Add an opt-in **custom block** plugin to `<mark-area>`. It parses fenced container directives:

```md
:::vcard{name="Ada Lovelace" email="ada@example.com" phone="+44 …" photo="url/somefile.jpg"}
Optional Markdown body (role, address, notes).
:::

:::faq{question="How do refunds work?" open}
Answer body in **Markdown**.
:::
```

While editing, a block renders as a card widget (like `tablePreviewPlugin`): raw source appears when the cursor enters it.
Scope includes:
- A generic `@lezer/markdown` block parser for `:::name{attrs}` … `:::`.
- A small registry so each block type supplies its own renderer (`vcard`, `faq` built in).
- A toolbar action to insert each block type.
- Styles via `--ma-*` properties and `::part()`.
- A written syntax spec, so a server CommonMark extension can render identical HTML.

Out of scope: implementing the server extension itself (separate repo/language), nested directives, inline (`:name[]`) and leaf (`::name`) directives.

Assumption: the syntax follows a subset of the CommonMark generic-directives proposal. This keeps server ports straightforward (e.g. `league/commonmark`, `markdown-it-container`, `remark-directive`).

## Affected Files
Added:
- `src/blocks/core.ts`: Lezer `MarkdownConfig` (`CustomBlock`, `CustomBlockMark`, `CustomBlockInfo` nodes), `parseAttrs()`, `blockAt()`, and the `BlockRenderer` registry type.
- `src/blocks/widget.ts`: `CustomBlockWidget` (`WidgetType`) plus the `customBlockWidgets` decoration provider (a `StateField`, because block replace decorations cannot come from a ViewPlugin).
- `src/blocks/vcard.ts`: vCard renderer, insert action, and styles.
- `src/blocks/faq.ts`: FAQ renderer using `<details>`/`<summary>`, insert action, and styles.
- `blocks.ts`: entry point exporting `customBlocksPlugin(options)`, `vcardBlock`, `faqBlock`, and the types.
- `docs/custom-blocks.md`: syntax spec, attribute grammar, canonical HTML output, and server porting notes.
- `tests/blocks.spec.ts`: Playwright tests.

Modified:
- `standalone.ts`: re-export `blocks.ts`.
- `package.json`: add `./blocks` export, and add `blocks.ts` to `build:lib`.
- `index.html`: demo with vCard and FAQ samples, with the plugin enabled.
- `README.md`: usage section.
- `AGENTS.md`: list the new module and its entry point.
- `src/preview.ts` (minor, only if needed): skip inline mark hiding inside `CustomBlockInfo` lines.

Deleted: none.

## Phase-by-Phase Milestones

### Phase 1: Syntax spec
- [ ] Write `docs/custom-blocks.md`. Define the opening fence as `^:{3,}[a-z][\w-]*` plus an optional `{…}`, and the closing fence as a matching-or-longer `:::` line.
- [ ] Define the attribute grammar: `key="value"`, `key='value'`, `key=bare`, a bare boolean `key`, `#id`, and `.class`. Specify escaping and unknown-key handling.
- [ ] Define the canonical HTML for each type:
  - vcard: `<div class="ma-block ma-vcard" data-block="vcard">` with an `h-card` microformat and `mailto:`/`tel:` links.
  - faq: `<details class="ma-block ma-faq"><summary>…</summary>…</details>`.
- [ ] Define the fallback for unknown types: `<div class="ma-block" data-block="name">` with the body rendered.

### Phase 2: Parser (`src/blocks/core.ts`)
- [ ] Implement a `BlockParser` that matches the opening fence and consumes lines until the closing fence or the end of the document. The body is parsed as child Markdown via `cx.startComposite`, or kept as raw lines if composite is too complex.
- [ ] Emit `CustomBlock`, `CustomBlockMark` (fences), and `CustomBlockInfo` (the name plus attrs) nodes.
- [ ] Implement `parseAttrs(info: string): Record<string, string | true>` as a pure function with no DOM use.
- [ ] Implement `blockAt(state, pos)` via `findEnclosingNode` (the same approach as `tableAt`).

### Phase 3: Widget and decorations (`src/blocks/widget.ts`)
- [ ] Define the `BlockRenderer` type: `{ name, render(attrs, body, ctx): HTMLElement, action?, styles? }`.
- [ ] Add a `StateField<DecorationSet>`. When the cursor is outside a block, apply `Decoration.replace({ widget, block: true })` over the whole block. When the cursor is inside, add only `cm-block-line` line decorations.
- [ ] Provide `EditorView.atomicRanges` for the replaced ranges.
- [ ] Render the body with the existing preview or a minimal safe inline renderer. Use `textContent` only and never `innerHTML` with user text.
- [ ] Clicking the card moves the selection to the block's info line, which reveals the raw source.
- [ ] Implement `eq()` on the widget (comparing raw text) to avoid DOM churn.

### Phase 4: Built-in blocks
- [ ] `vcard`: render name, email (`mailto:`), phone (`tel:`), url, org, and title, plus the body as notes. Add an insert action `block-vcard` that inserts a template at the cursor line.
- [ ] `faq`: render `<details>` with `<summary>` set to the `question` attr. The `open` attr sets the initial state. Toggling in the editor must not mutate the document.
- [ ] Add styles in each renderer's `styles` string. Use `--ma-card-bg`, `--ma-card-border`, `--ma-card-radius`, and `--ma-faq-marker`, with `color-mix` defaults. Expose `part="card"`.

### Phase 5: Plugin and entry points
- [ ] Add `customBlocksPlugin({ blocks = [vcardBlock, faqBlock], toolbar })` in `blocks.ts`, returning a `MarkPlugin` (`markdown`, `extension`, `actions`, `styles`).
- [ ] Add the `./blocks` export to `package.json` and `blocks.ts` to `build:lib`, and re-export from `standalone.ts`.
- [ ] Add samples and the plugin to the `index.html` demo.

### Phase 6: Tests and docs
- [ ] Add `tests/blocks.spec.ts`. Cover:
  - Card renders when the cursor is outside the block.
  - Raw source shows when the cursor is inside.
  - The FAQ toggle leaves `el.value` unchanged.
  - An unclosed fence does not break the editor.
  - Attribute escaping renders as text, not HTML.
  - Form value round-trips unchanged.
- [ ] Update `README.md` and `AGENTS.md`.

## Verification & Test Strategy
- After each phase, run `bun run check` (`tsc --noEmit` and the build). Phase 5 additionally confirms that `dist/blocks.js` and `dist/blocks.d.ts` exist (`ls dist/blocks.*`).
- Phases 3–5: run `bun run dev`, open `index.html`, and inspect cards in light and dark modes.
- Phase 6: run `bun run build && bun run test` (`bunx playwright test tests --reporter=line`). Run the single new suite with `bunx playwright test tests/blocks.spec.ts`.
- Regression check: `tests/show-marks.spec.ts` and `tests/styles.spec.ts` must still pass.
- Server parity: keep fixture pairs (`.md` → expected `.html`) in `docs/custom-blocks.md`, for the server extension to use as golden tests.

## Risks & Edge Cases
- **Server divergence**: the editor preview and the server HTML can drift apart. Mitigate with the spec and shared golden fixtures. Keep the syntax to the directive subset already supported by common libraries.
- **XSS**: attribute values and the body are user input. Build DOM via `textContent` and `setAttribute`. Allow only `http(s)`, `mailto`, and `tel` URL schemes. The server must escape the same way.
- **Block decorations**: replace decorations that span lines must come from a `StateField`, not a ViewPlugin, or CodeMirror throws an error. This is unlike the current table approach (first line replaced, other lines hidden). Pick one approach consistently.
- **Unclosed fence**: the block runs to the end of the document. Either render nothing until it is closed, or treat the whole remaining text as the block. Document the choice. The editor must stay usable either way.
- **Nesting and conflicts**: a `:::` inside code fences must not match (the parser handles this). Nested directives are unsupported; inner `:::` lines close the outer block. Use longer fences (`::::`) for future nesting.
- **Cursor and atomic ranges**: entering a replaced block by arrow keys must reveal the raw source and must not skip the block. Test with keyboard navigation.
- **Toolbar and interaction**: FAQ `<details>` toggling inside a widget must not steal focus or dispatch transactions. Override `ignoreEvent` accordingly.
- **Performance**: re-parsing attrs on every update is cheap, but use widget `eq()` to avoid rebuilding the DOM.
- **Plugin interplay**: inline preview marks inside the info string (`{…}`) could be misdecorated. Guard this in `src/preview.ts` if observed.
- **Bundle size**: the plugin is opt-in via `./blocks`, so it adds nothing to the core `index.js`.
