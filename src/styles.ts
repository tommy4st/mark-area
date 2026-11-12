// ---- Stylesheet ----

export const styles = /* css */ `
:host {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border: var(--ma-border, 1px solid color-mix(in srgb, currentColor 20%, transparent));
    border-radius: var(--ma-radius, 0.375rem);
    background: var(--ma-bg, transparent);
    color: var(--ma-color, inherit);
    font-family: var(--ma-font, inherit);
    font-size: var(--ma-font-size, 0.875rem);
    line-height: var(--ma-line-height, 1.5);
}
:host([hidden]) { display: none; }
:host(:focus-within) {
    outline: var(--ma-focus-outline, 2px solid currentColor);
    outline-offset: var(--ma-focus-offset, 2px);
    border-color: var(--ma-focus-border-color, currentColor);
}
:host([disabled]) { opacity: 0.6; pointer-events: none; }
:host(:invalid.ma-touched), :host([invalid]) {
    border-color: var(--ma-error-color, #ef4444);
    outline-color: var(--ma-error-color, #ef4444);
}
:host([no-toolbar]) [part~="toolbar"] { display: none; }
[part~="toolbar"] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ma-toolbar-gap, 0.125rem);
    padding: var(--ma-toolbar-padding, 0.25rem);
    background: var(--ma-toolbar-bg, transparent);
    border-bottom: var(--ma-toolbar-border, 1px solid color-mix(in srgb, currentColor 12%, transparent));
    opacity: var(--ma-toolbar-opacity, 0.6);
    transition: opacity 150ms ease;
}
[part~="toolbar"]:hover, :host(:focus-within) [part~="toolbar"] { opacity: 1; }
[part~="button"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--ma-btn-size, 1.75rem);
    height: var(--ma-btn-size, 1.75rem);
    padding: 0;
    border: none;
    border-radius: var(--ma-btn-radius, 0.25rem);
    background: var(--ma-btn-bg, transparent);
    color: var(--ma-btn-color, inherit);
    font: inherit;
    font-size: 0.8125rem;
    cursor: pointer;
}
[part~="button"]:hover { background: var(--ma-btn-hover-bg, color-mix(in srgb, currentColor 10%, transparent)); }
[part~="button"] svg { width: var(--ma-icon-size, 1rem); height: var(--ma-icon-size, 1rem); }
.cm-editor, .cm-editor.cm-focused { outline: none !important; flex: 1; }
.cm-scroller { font-family: inherit; line-height: inherit; }
.cm-content {
    padding: var(--ma-padding, 0.5rem 0.75rem);
    min-height: calc(var(--ma-rows, 4) * 1.5em);
    caret-color: var(--ma-caret-color, currentColor);
    outline: none;
}
.cm-cursor, .cm-dropCursor { border-left: 1.5px solid var(--ma-caret-color, currentColor) !important; }
.cm-selectionBackground { background: var(--ma-selection-bg, color-mix(in srgb, currentColor 20%, transparent)) !important; }
.cm-line { padding: 0; }
.cm-placeholder { color: var(--ma-placeholder-color, color-mix(in srgb, currentColor 45%, transparent)); }
.cm-strong { font-weight: 700; }
.cm-em { font-style: italic; }
.cm-strike { text-decoration: line-through; }
.cm-code, .cm-codeblock {
    font-family: var(--ma-font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
    background: var(--ma-code-bg, color-mix(in srgb, currentColor 8%, transparent));
}
.cm-code { border-radius: 0.1875rem; padding: 0.05em 0.25em; }
.cm-codeblock { padding: 0 0.5rem !important; }
.cm-link { color: var(--ma-link-color, #2563eb); text-decoration: underline; }
.cm-mark { color: var(--ma-mark-color, color-mix(in srgb, currentColor 45%, transparent)); }
.cm-h1, .cm-h2, .cm-h3, .cm-h4, .cm-h5, .cm-h6 { font-weight: var(--ma-heading-weight, 600); }
.cm-h1 { font-size: var(--ma-h1-size, 1.5em); }
.cm-h2 { font-size: var(--ma-h2-size, 1.25em); }
.cm-h3 { font-size: var(--ma-h3-size, 1.125em); }
.cm-quote {
    border-left: 3px solid var(--ma-quote-border, color-mix(in srgb, currentColor 25%, transparent));
    padding-left: 0.75rem !important;
    color: var(--ma-quote-color, color-mix(in srgb, currentColor 75%, transparent));
}
.cm-bullet { color: var(--ma-bullet-color, var(--ma-link-color, currentColor)); padding: 0 0.125rem; }
.cm-image-wrap {
    position: relative;
    display: inline-block;
    max-width: 100%;
    vertical-align: middle;
    margin: 0.25rem 0;
    line-height: 0;
}
.cm-image {
    display: block;
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: var(--ma-image-max-height, none);
    border-radius: var(--ma-image-radius, 0.375rem);
}
.cm-image-presets {
    position: absolute;
    top: 0.375rem;
    right: 0.375rem;
    display: flex;
    gap: 0.125rem;
    padding: 0.125rem;
    border-radius: 0.25rem;
    background: var(--ma-image-presets-bg, rgba(0, 0, 0, 0.65));
    backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity 120ms ease;
    line-height: 1;
}
.cm-image-wrap:hover .cm-image-presets { opacity: 1; }
.cm-image-preset {
    border: none;
    border-radius: 0.1875rem;
    background: transparent;
    color: #fff;
    font: inherit;
    font-size: 0.6875rem;
    padding: 0.1875rem 0.3125rem;
    cursor: pointer;
    opacity: 0.8;
}
.cm-image-preset:hover, .cm-image-preset.active { opacity: 1; background: rgba(255, 255, 255, 0.2); }
.cm-image-handle {
    position: absolute;
    right: 0.25rem;
    bottom: 0.25rem;
    width: 0.75rem;
    height: 0.75rem;
    border-right: 2.5px solid var(--ma-image-handle-color, #fff);
    border-bottom: 2.5px solid var(--ma-image-handle-color, #fff);
    border-bottom-right-radius: 0.125rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.7));
    cursor: nwse-resize;
    opacity: 0;
    transition: opacity 120ms ease;
    touch-action: none;
}
.cm-image-wrap:hover .cm-image-handle, .cm-image-wrap.resizing .cm-image-handle { opacity: 1; }
.cm-image-wrap.resizing .cm-image { outline: 2px solid var(--ma-link-color, #2563eb); }
.cm-table-line {
    font-family: var(--ma-font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
    white-space: pre;
}
.cm-table-hidden-line {
    display: none !important;
}
.cm-line > .cm-table-widget ~ .cm-widgetBuffer, .cm-line > .cm-widgetBuffer:has(+ .cm-table-widget) { display: none; }
.cm-table-widget {
    display: block;
    margin: 0.375rem 0;
    overflow-x: auto;
    white-space: normal;
    font-family: var(--ma-font, inherit);
}
.cm-table {
    border-collapse: collapse;
    width: var(--ma-table-width, auto);
    min-width: 12rem;
    font-size: var(--ma-table-font-size, 0.875em);
    border: var(--ma-table-border, 1px solid color-mix(in srgb, currentColor 18%, transparent));
    border-radius: var(--ma-table-radius, 0.25rem);
}
.cm-table th, .cm-table td {
    border: var(--ma-table-border, 1px solid color-mix(in srgb, currentColor 18%, transparent));
    padding: var(--ma-table-cell-padding, 0.3125rem 0.625rem);
    min-width: 3.5rem;
    height: 1.5em;
    line-height: var(--ma-line-height, 1.5);
    text-align: left;
    vertical-align: top;
}
.cm-table th {
    font-weight: 600;
    background: var(--ma-table-header-bg, color-mix(in srgb, currentColor 6%, transparent));
}
.cm-table tr:nth-child(even) td {
    background: var(--ma-table-stripe-bg, color-mix(in srgb, currentColor 2.5%, transparent));
}
.cm-table-widget:not(.cm-table-wysiwyg) .cm-table th,
.cm-table-widget:not(.cm-table-wysiwyg) .cm-table td {
    cursor: text;
}
.cm-table-wysiwyg th[contenteditable="true"]:focus,
.cm-table-wysiwyg td[contenteditable="true"]:focus {
    outline: 2px solid var(--ma-link-color, #2563eb);
    outline-offset: -2px;
    background: color-mix(in srgb, var(--ma-link-color, #2563eb) 8%, transparent);
}
.cm-table-controls {
    display: none;
    gap: 0.25rem;
    margin-top: 0.25rem;
}
.cm-table-widget:focus-within .cm-table-controls,
.cm-editor.cm-focused .cm-table-controls-raw {
    display: flex;
}
.cm-table-btn {
    border: var(--ma-table-border, 1px solid color-mix(in srgb, currentColor 18%, transparent));
    border-radius: 0.25rem;
    background: var(--ma-btn-bg, transparent);
    color: inherit;
    font: inherit;
    font-size: 0.6875rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.375rem;
    cursor: pointer;
    opacity: 0.75;
}
.cm-table-btn:hover {
    opacity: 1;
    background: var(--ma-btn-hover-bg, color-mix(in srgb, currentColor 10%, transparent));
}
`;

let sharedSheet: CSSStyleSheet | null = null;
export function getSheet(): CSSStyleSheet | null {
    if (!sharedSheet && typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype) {
        sharedSheet = new CSSStyleSheet();
        sharedSheet.replaceSync(styles);
    }
    return sharedSheet;
}
