# `mark-area` (`<mark-area>`)

A lean, customizable Markdown editor Web Component built on CodeMirror 6 with live preview, Shadow DOM styling hooks, native HTML form participation (`ElementInternals`), image/file uploads with interactive image resizing, and opt-in GFM table editing.

[![Live Demo](https://img.shields.io/badge/demo-live%20showcase-brightgreen)](https://tommy4st.github.io/mark-area/)

## Installation & Usage

You can use `mark-area` via any of the following three distribution channels:

### 1. Direct Git Dependency (Node / Bun / Vite / Webpack)

Install directly from GitHub without public npm:

```bash
bun add github:tommy4st/mark-area#v0.1.1
# or
npm install github:tommy4st/mark-area#v0.1.1
```

Import in your TypeScript/JavaScript application:

```ts
import { MarkArea, defineMarkArea } from '@tommy4st/mark-area';
```

Import only what you need. Importing the package does not register the element or pull in table code:

```ts
import '@tommy4st/mark-area/define';                                // registers <mark-area>
import { tableWysiwygPlugin } from '@tommy4st/mark-area/tables/wysiwyg'; // optional, one variant only

document.querySelector('mark-area').plugins = [tableWysiwygPlugin()];
```

Available subpaths: `.` (class, no side effects), `./define`, `./tables` (all variants), `./tables/inline`, `./tables/preview`, `./tables/wysiwyg`, `./standalone` (single file with everything, for CDN use).

### 2. CDN / Vanilla HTML (No Build Step)

Load the pre-bundled bundle directly via jsDelivr or raw GitHub release assets:

```html
<!-- Via jsDelivr CDN -->
<script type="module" src="https://cdn.jsdelivr.net/gh/tommy4st/mark-area@v0.1.1/dist/standalone.js"></script>

<!-- Or from GitHub Release assets -->
<script type="module" src="https://github.com/tommy4st/mark-area/releases/download/v0.1.1/standalone.js"></script>
```

### 3. GitHub Packages (`npm.pkg.github.com`)

Configure your `.npmrc` to route the `@tommy4st` scope to GitHub Packages:

```ini
@tommy4st:registry=https://npm.pkg.github.com
```

Install via your package manager:

```bash
bun add @tommy4st/mark-area
# or
npm install @tommy4st/mark-area
```

---

## Quick Start

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/tommy4st/mark-area@v0.1.1/dist/standalone.js"></script>

<form>
  <mark-area name="content" rows="6" required placeholder="Write Markdown...">
## Hello World
Write **bold**, *italic*, ~~strikethrough~~, `code`, or [links](https://example.com).
  </mark-area>
  <button type="submit">Save</button>
</form>
```

Or import the package in TypeScript/JavaScript:

```ts
import { MarkArea, defineMarkArea } from '@tommy4st/mark-area';
```

---

## Attributes & Properties

| Attribute | Property | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `value` | `value` | `string` | `""` | Current Markdown document content. Initial content can also be placed as text inside `<mark-area>...</mark-area>`. |
| `name` | `name` | `string` | `""` | Form field name for `FormData` submission. |
| `placeholder` | `placeholder` | `string` | `""` | Placeholder shown when the editor is empty. |
| `rows` | `rows` | `number` | `4` | Minimum editor height in lines (`calc(var(--ma-rows, 4) * 1.5em)`). |
| `required` | `required` | `boolean` | `false` | Marks the field as required in native form validation. |
| `required-message` | — | `string` | `"Please fill out this field."` | Custom validation message when `required` fails. |
| `disabled` | `disabled` | `boolean` | `false` | Disables editing and toolbar interaction. |
| `readonly` | `readOnly` | `boolean` | `false` | Makes the editor read-only. |
| `hide-marks` | `hideMarks` | `boolean` | `false` | Keeps Markdown syntax markers hidden at all times (even when the cursor is inside formatted text). |
| `no-toolbar` | — | `boolean` | `false` | Hides the toolbar completely. |
| `accept` | — | `string` | `"*/*"` | Accepted file types for the `file` upload picker. |
| — | `plugins` | `Array<MarkPlugin \| Extension>` | `[]` | Optional plugins (e.g. tables) or raw CodeMirror extensions. |
| — | `upload` | `UploadHandler` | `defaultUpload` | Custom upload function (used only when `uploads` is on). |
| `uploads` | `uploads` | `boolean` | `false` | Enables image/file actions, shortcuts, drop and paste. `uploads="off"` disables. |
| `toolbar` | `toolbar` | `string[]` | all actions | Space-separated action ids, in order, e.g. `toolbar="bold italic link"`. |
| — | `labels` | `Record<id, { label?, title? }>` | English ids | Translates button `aria-label` (`label`) and tooltip (`title`) by action id. |

Icon size: set `--ma-icon-size` (default `1rem`).

---

## Formatting & Keyboard Shortcuts

- **Inline formats** (`bold`, `italic`, `strike`, `code`, `link`):
  - When the cursor is on/near an unformatted word with no selection, selects the closest word on the line and applies the format.
  - When already inside the formatted element, selects the whole element and removes the formatting markers.
- **Block formats** (`heading`, `bullet`, `ordered`, `quote`):
  - Toggles the prefix on the current line (or replaces an existing block prefix on that line).

| Action ID | Description | Shortcut (Mac / Windows & Linux) |
| --- | --- | --- |
| `bold` | Bold (`**text**`) | `⌘B` / `Ctrl+B` |
| `italic` | Italic (`*text*`) | `⌘I` / `Ctrl+I` |
| `strike` | Strikethrough (`~~text~~`) | `⌘⇧X` / `Ctrl+Shift+X` |
| `heading` | Cycle heading (`##`, `###`, plain) | `⌘⌥H` / `Ctrl+Alt+H` |
| `bullet` | Bullet list (`- `) | `⌘⇧8` / `Ctrl+Shift+8` |
| `ordered` | Numbered list (`1. `) | `⌘⇧7` / `Ctrl+Shift+7` |
| `quote` | Blockquote (`> `) | `⌘⇧9` / `Ctrl+Shift+9` |
| `code` | Inline code (`` `code` ``) | `⌘E` / `Ctrl+E` |
| `link` | Link (`[text](https://)`) | `⌘K` / `Ctrl+K` |
| `image` | Embed image (`![name](url)`) | `⌘⇧I` / `Ctrl+Shift+I` |
| `file` | Upload file link (`[name](url)`) | `⌘⇧U` / `Ctrl+Shift+U` |
| `table` | Insert table (requires a table plugin) | `⌘⌥T` / `Ctrl+Alt+T` |

Trigger any action programmatically via `editor.exec('bold')`.

---

## Tables (opt-in)

Tables are not included by default. Enable exactly one variant via `editor.plugins`:

| Plugin | Behavior |
| --- | --- |
| `tableInlinePlugin()` | GFM syntax, monospace raw editing, `Tab`/`Shift+Tab` cell navigation and auto-padding. |
| `tablePreviewPlugin()` | Rendered table widget when the cursor is outside; raw Markdown when inside. |
| `tableWysiwygPlugin(options?)` | Always-rendered table with inline cell editing and row/column/align controls. `options.toolbar` reorders or extends `defaultTableToolbar`; `options.labels` translates labels by item id. |

```ts
import { tableWysiwygPlugin } from '@tommy4st/mark-area/tables/wysiwyg';
editor.plugins = [tableWysiwygPlugin()];
```

---

## Image & File Uploads

Files can be uploaded via the **toolbar buttons**, **keyboard shortcuts**, **drag-and-drop**, or **clipboard paste**.
- Images are embedded as `![filename](url)` and rendered inline in live preview.
- Other files are inserted as `[filename](url)` download links (`Ctrl/Cmd+Click` opens or downloads).

### Enabling Uploads
Uploads are off by default: no image/file buttons, shortcuts, drop, or paste handling. Add the `uploads` attribute (or set `editor.uploads = true`) to enable them. `uploads="off"` disables them.

### Default Behavior (Base64 Inline)
With uploads enabled and no custom `upload` set, `defaultUpload` encodes files as Base64 `data:` URLs and inlines them into the Markdown. Set `editor.upload` to avoid this.

### Custom Upload Function
Provide a custom `upload` function on the element to upload files to a server or object storage and return a URL:

```ts
const editor = document.querySelector('mark-area')!;

editor.upload = async (file: File) => {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: form });
  const data = await res.json();
  return { url: data.url, name: file.name }; // or return a plain URL string
};
```

While an upload is running, the `<mark-area uploading>` attribute is present for styling loading states.

### Image Resizing
Embedded images can be resized in live preview:
- **Hover preset buttons**: `25%`, `50%`, `75%`, `100%` in the top-right corner of the image (click active preset to reset).
- **Drag handle**: Drag the bottom-right corner handle to set a pixel width (double-click handle to reset).
- Stored in Markdown as a URL hash fragment: `![alt](url#w=320)` or `![alt](url#w=50%)`.

---

## Styling & Customization

### 1. CSS Custom Properties

```css
mark-area {
  /* Container & typography */
  --ma-bg: transparent;
  --ma-color: inherit;
  --ma-border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  --ma-radius: 0.375rem;
  --ma-font: inherit;
  --ma-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --ma-font-size: 0.875rem;
  --ma-line-height: 1.5;
  --ma-padding: 0.5rem 0.75rem;
  --ma-line-padding: 0;
  --ma-rows: 4;

  /* Focus, caret, selection & validation */
  --ma-focus-outline: 2px solid currentColor;
  --ma-focus-offset: 2px;
  --ma-focus-border-color: currentColor;
  --ma-caret-color: currentColor;
  --ma-selection-bg: color-mix(in srgb, currentColor 20%, transparent);
  --ma-placeholder-color: color-mix(in srgb, currentColor 45%, transparent);
  --ma-error-color: #ef4444;

  /* Toolbar & buttons */
  --ma-toolbar-bg: transparent;
  --ma-toolbar-border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  --ma-toolbar-padding: 0.25rem;
  --ma-toolbar-gap: 0.125rem;
  --ma-toolbar-opacity: 0.6;
  --ma-btn-size: 1.75rem;
  --ma-btn-radius: 0.25rem;
  --ma-btn-bg: transparent;
  --ma-btn-color: inherit;
  --ma-btn-hover-bg: color-mix(in srgb, currentColor 10%, transparent);

  /* Markdown elements */
  --ma-heading-weight: 600;
  --ma-h1-size: 1.5em;
  --ma-h2-size: 1.25em;
  --ma-h3-size: 1.125em;
  --ma-code-bg: color-mix(in srgb, currentColor 8%, transparent);
  --ma-link-color: #2563eb;
  --ma-mark-color: color-mix(in srgb, currentColor 45%, transparent);
  --ma-quote-border: color-mix(in srgb, currentColor 25%, transparent);
  --ma-quote-color: color-mix(in srgb, currentColor 75%, transparent);
  --ma-bullet-color: currentColor;

  /* Embedded images */
  --ma-image-max-height: none;
  --ma-image-radius: 0.375rem;
  --ma-image-presets-bg: rgba(0, 0, 0, 0.65);
  --ma-image-handle-color: #fff;

  /* Tables */
  --ma-table-width: auto;
  --ma-table-font-size: 0.875em;
  --ma-table-border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  --ma-table-radius: 0.25rem;
  --ma-table-cell-padding: 0.3125rem 0.625rem;
  --ma-table-header-bg: color-mix(in srgb, currentColor 6%, transparent);
  --ma-table-stripe-bg: color-mix(in srgb, currentColor 2.5%, transparent);
}
```

The `--ma-*` variables are the supported styling API.

### 2. Shadow `::part()` Selectors
- `mark-area::part(toolbar)` — The toolbar container.
- `mark-area::part(button)` — All default toolbar buttons.
- `mark-area::part(button-bold)` — Specific toolbar button (`button-<actionId>`).
- `mark-area::part(editor)` — The outer CodeMirror `.cm-editor` root.
- `mark-area::part(content)` — The editable `.cm-content` area.
- `mark-area::part(scroller)` — The scrolling `.cm-scroller` wrapper.
- `mark-area::part(line)` — Each `.cm-line` in the content.
- `mark-area::part(image-wrap)` — Wrapper around embedded preview images.
- `mark-area::part(image)` — The `<img>` element inside live preview.
- `mark-area::part(image-presets)` / `mark-area::part(image-preset)` — Preset size bar and buttons.
- `mark-area::part(image-handle)` — Corner drag-to-resize handle.

### 3. Custom Toolbar via `<slot name="toolbar">`
Children with `slot="toolbar"` replace the default buttons entirely. Any child element with `data-action="<actionId>"` triggers that command on click:

```html
<mark-area>
  <div slot="toolbar">
    <button type="button" data-action="bold">Bold</button>
    <button type="button" data-action="italic">Italic</button>
    <button type="button" data-action="image">Image</button>
  </div>
</mark-area>
```

### 4. Adopted Stylesheets
Use `adoptStyles` for extra rules only; prefer the `--ma-*` variables for supported styling. It injects a custom `CSSStyleSheet` into the shadow root:

```ts
const sheet = new CSSStyleSheet();
sheet.replaceSync('.cm-strong { color: tomato; }');
editor.adoptStyles(sheet);
```

---

## Events & Data Forwarding

All events bubble and are `composed: true` (cross Shadow DOM boundaries). Cancelable events allow calling `event.preventDefault()` to override built-in behavior:

| Event | Cancelable | `event.detail` | Description |
| --- | --- | --- | --- |
| `input` | No | `{ value: string, view: EditorView }` | Fired whenever the document text changes. |
| `change` | No | `{ value: string, view: EditorView }` | Fired when the editor loses focus. |
| `ma-action` | **Yes** | `{ action: ActionId, view: EditorView }` | Fired before running any toolbar/shortcut command (`bold`, `link`, `image`, etc.). Call `preventDefault()` to handle it yourself. |
| `ma-link-prompt` | **Yes** | `{ url: string, exists: boolean, apply: (url: string \| null) => void }` | Fired by the `link` action when `hide-marks` is set. Call `preventDefault()` to show your own UI, then call `apply(url)` (empty string removes an existing link, `null` cancels). Default is `window.prompt`. |
| `ma-upload` | **Yes** | `{ file: File, kind: 'image' \| 'file', result?: Promise<UploadResult> \| UploadResult }` | Fired per file before upload. Set `e.detail.result = uploadFn(file)` to supply a custom URL via event listener, or `preventDefault()` to skip the file. |
| `ma-uploaded` | No | `{ snippets: string[], files: File[], view: EditorView }` | Fired after uploaded Markdown snippets are inserted. |
| `ma-link-click` | **Yes** | `{ href: string, label: string, width: string, kind: 'Link' \| 'Image', originalEvent: MouseEvent }` | Fired on `Ctrl/Cmd+Click` of a link or image. Call `preventDefault()` to handle navigation/download yourself. |
| `ma-image-resize` | **Yes** | `{ src: string, width: string, view: EditorView }` | Fired before committing a new image width (`#w=...`). |

---

## Development

With [Devbox](https://www.jetify.com/devbox) or [Bun](https://bun.sh):

```bash
devbox run dev        # Watch-build dist/ and serve index.html demo page with hot reload
devbox run build      # Build split ESM library, dist/standalone.js, and .d.ts files
devbox run watch      # Watch and rebuild out/standalone.js (gitignored)
devbox run typecheck  # Run TypeScript type checker (tsc --noEmit)
devbox run check      # Run typecheck + build
devbox run clean      # Remove dist/
```

---

## License

[CC0 1.0 Universal](LICENSE) (Public Domain Dedication).
