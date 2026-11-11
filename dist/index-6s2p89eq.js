import{t,r,f,e,b,y,T,w,D}from"./index-ja63m57k.js";var k=`
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
[part~="button"] svg { width: 1rem; height: 1rem; }
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
`,v=null;function S(){if(!v&&typeof CSSStyleSheet<"u"&&"replaceSync"in CSSStyleSheet.prototype)v=new CSSStyleSheet,v.replaceSync(`
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
[part~="button"] svg { width: 1rem; height: 1rem; }
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
`);return v}import{Compartment as P,EditorSelection as q,EditorState as z}from"@codemirror/state";import{EditorView as g,drawSelection as O,keymap as F,placeholder as U}from"@codemirror/view";import{defaultKeymap as I,history as R,historyKeymap as B}from"@codemirror/commands";import{markdown as j}from"@codemirror/lang-markdown";import{Strikethrough as K}from"@lezer/markdown";import{EditorSelection as L}from"@codemirror/state";import{EditorView as H}from"@codemirror/view";import{syntaxTree as V}from"@codemirror/language";var E=H.domEventHandlers({click(i,o){if(!(i.ctrlKey||i.metaKey))return!1;let s=o.posAtCoords({x:i.clientX,y:i.clientY});if(s==null)return!1;for(let a=V(o.state).resolveInner(s,1);a;a=a.parent){let n=(a.name==="Link"||a.name==="Image")&&a.getChild("URL");if(n){let{src:h,width:d}=w(o.state.sliceDoc(n.from,n.to)),m=/^!?\[([\s\S]*?)\]/.exec(o.state.sliceDoc(a.from,a.to))?.[1]||"",u=e.get(o);if(u&&!r(u,"ma-link-click",{href:h,label:m,width:d,kind:a.name,originalEvent:i}))return!0;if(h.startsWith("data:"))t("a",{href:h,download:m||"download"}).click();else window.open(h,"_blank","noopener");return!0}}return!1},drop:(i,o)=>M(o,i,i.dataTransfer?.files,o.posAtCoords({x:i.clientX,y:i.clientY})),paste:(i,o)=>M(o,i,i.clipboardData?.files)});function M(i,o,s,a){let n=s?.length?e.get(i):void 0;if(!n||n.disabled||n.readOnly)return!1;if(o.preventDefault(),a!=null)i.dispatch({selection:L.cursor(a)});return n.uploadFiles(s),!0}class l extends HTMLElement{static formAssociated=!0;static observedAttributes=["value","placeholder","rows","disabled","readonly","required","hide-marks"];#e;#r;#h;#u=new P;#t;#p="";#i=!1;#o=b;#a=[];#g=[];#n=new Set;#s=[];constructor(){super();this.#r=this.attachShadow({mode:"open",delegatesFocus:!0});try{this.#e=this.attachInternals?.()}catch{}let i=S();if(i)this.#n.add(i),this.#r.adoptedStyleSheets=[i];else this.#r.append(t("style",{textContent:k}));let o=t("div",{role:"toolbar"},"toolbar"),s=t("slot",{name:"toolbar"});this.#h=s;for(let a of y)s.append(this.#b(a));o.append(s),o.onmousedown=(a)=>a.preventDefault(),o.onclick=(a)=>{let n=a.target?.closest("[data-action]")?.dataset.action;if(n&&!this.disabled&&!this.readOnly)this.exec(n)},this.#r.append(o)}#b(i){let o=t("button",{type:"button",tabIndex:-1,title:i.hint?`${i.id} (${i.hint})`:i.id,innerHTML:i.html,ariaLabel:i.id},`button button-${i.id}`);return o.dataset.action=i.id,o}#l(){let i=(o)=>["extension","actions","markdown","styles"].some((s)=>(s in o));return this.#a.filter(Boolean).map((o)=>typeof o==="object"&&i(o)?o:{extension:o})}#c(){let i=new Map(T);for(let o of this.#l().flatMap((s)=>s.actions??[]))i.set(o.id,o);return i}connectedCallback(){if(!this.#t){let i=this.getAttribute("value")??this.textContent?.trim()??"";this.#p=i,this.#t=new g({parent:this.#r,state:z.create({doc:i,extensions:[R(),O(),g.lineWrapping,E,this.#u.of(this.#y()),F.of([...I,...B]),g.updateListener.of((o)=>{if(o.docChanged&&!this.#i)this.#m(),r(this,"input",{value:this.value,view:o.view});if(o.focusChanged&&!o.view.hasFocus)this.classList.add("ma-touched"),r(this,"change",{value:this.value,view:o.view})})]})}),this.#t.dom.setAttribute("part","editor"),e.set(this.#t,this)}this.#d()}attributeChangedCallback(i,o,s){if(!this.#t)return;if(i==="value")this.value=s??"";else this.#d()}formResetCallback(){this.classList.remove("ma-touched"),this.value=this.getAttribute("value")??this.#p}formDisabledCallback(i){this.disabled=i}formStateRestoreCallback(i){this.value=i}get view(){return this.#t}get value(){return this.#t?this.#t.state.doc.toString():this.getAttribute("value")??""}set value(i){if(!this.#t){this.setAttribute("value",i);return}let o=this.#t.state.doc.toString();if(i!==o)this.#i=!0,this.#t.dispatch({changes:{from:0,to:o.length,insert:i}}),this.#i=!1,this.#m()}get name(){return this.getAttribute("name")??""}set name(i){this.setAttribute("name",i)}get placeholder(){return this.getAttribute("placeholder")??""}set placeholder(i){this.setAttribute("placeholder",i)}get rows(){return Number(this.getAttribute("rows"))||4}set rows(i){this.setAttribute("rows",String(i))}get disabled(){return this.hasAttribute("disabled")}set disabled(i){this.toggleAttribute("disabled",i)}get readOnly(){return this.hasAttribute("readonly")}set readOnly(i){this.toggleAttribute("readonly",i)}get required(){return this.hasAttribute("required")}set required(i){this.toggleAttribute("required",i)}get hideMarks(){return this.hasAttribute("hide-marks")}set hideMarks(i){this.toggleAttribute("hide-marks",i)}get plugins(){return this.#a}set plugins(i){if(this.#a=i?[...i]:[],this.#t)this.#d()}get form(){return this.#e?.form??this.closest("form")}get validity(){return this.#e?.validity}get validationMessage(){return this.#e?.validationMessage??""}checkValidity(){return this.#e?.checkValidity()??!0}reportValidity(){return this.classList.add("ma-touched"),this.#e?.reportValidity()??!0}focus(i){this.#t?.focus(),super.focus(i)}exec(i){let o=this.#c().get(i);if(!o||!this.#t)return!1;if(f.get(this.#t)?.(i))return!0;if(this.#t.focus(),!r(this,"ma-action",{action:i,view:this.#t}))return!0;return o.run(this.#t)}adoptStyles(...i){this.#g=i,this.#f()}#f(){if(!("adoptedStyleSheets"in this.#r))return;let i=S(),o=[];for(let d of this.#l()){if(!d.styles)continue;if(typeof d.styles==="string"){if(typeof CSSStyleSheet<"u"&&"replaceSync"in CSSStyleSheet.prototype){let m=new CSSStyleSheet;m.replaceSync(d.styles),o.push(m)}}else o.push(d.styles)}let s=this.#r.adoptedStyleSheets,a=s.filter((d)=>!this.#n.has(d)),n=[...i?[i]:[],...o,...this.#g];this.#n=new Set(n);let h=[...a,...n];if(s.length!==h.length||s.some((d,m)=>d!==h[m]))this.#r.adoptedStyleSheets=h}get upload(){return this.#o}set upload(i){this.#o=i??b}pickFiles(i="file"){if(this.disabled||this.readOnly)return;let o=t("input",{type:"file",multiple:!0,accept:i==="image"?"image/*":this.getAttribute("accept")??"*/*"});o.onchange=()=>{if(o.files?.length)this.uploadFiles(o.files,i)},o.click()}async uploadFiles(i,o){if(!this.#t||this.disabled||this.readOnly)return;let s=Array.from(i);if(!s.length)return;this.toggleAttribute("uploading",!0);try{let a=[];for(let m of s){let u=o==="image"||o!=="file"&&m.type.startsWith("image/")?"image":"file",x={file:m,kind:u,result:void 0};if(!r(this,"ma-upload",x))continue;let p=await(x.result??this.#o(m,u)),C=typeof p==="string"?p:p.url,A=(typeof p==="object"&&p.name||m.name||"file").replace(/[\[\]]/g,"");a.push(u==="image"?`![${A}](${C})`:`[${A}](${C})`)}if(!a.length)return;let n=a.join(`
`),{from:h,to:d}=this.#t.state.selection.main;this.#t.dispatch({changes:{from:h,to:d,insert:n},selection:q.cursor(h+n.length)}),this.#t.focus(),r(this,"ma-uploaded",{snippets:a,files:s,view:this.#t})}finally{this.toggleAttribute("uploading",!1)}}#y(){let i=this.#l(),o=[K],s=[];for(let n of i){if(n.markdown)o.push(n.markdown);if(n.extension)s.push(n.extension)}let a=Array.from(this.#c().values());return[j({extensions:o}),F.of(a.filter((n)=>n.key).map((n)=>({key:n.key,run:()=>this.exec(n.id),preventDefault:!0}))),...s,D(this.hideMarks),g.editable.of(!this.disabled&&!this.readOnly),z.readOnly.of(this.readOnly),this.placeholder?U(this.placeholder):[],g.contentAttributes.of({part:"content","aria-multiline":"true","aria-required":String(this.required)})]}#v(){for(let i of this.#s)i.remove();this.#s=[...this.#c().values()].filter((i)=>!T.has(i.id)).map((i)=>this.#b(i)),this.#h.append(...this.#s)}#d(){this.style.setProperty("--ma-rows",String(this.rows)),this.#v(),this.#f(),this.#t?.dispatch({effects:this.#u.reconfigure(this.#y())}),this.#m()}#m(){if(!this.#e)return;let i=this.value;this.#e.setFormValue(i),this.#e.setValidity(this.required&&!this.disabled&&!i.trim()?{valueMissing:!0}:{},this.getAttribute("required-message")||"Please fill out this field.",this.#t?.contentDOM)}}function c(i="mark-area"){if(typeof customElements<"u"&&!customElements.get(i))customElements.define(i,l)}
export{k,l,c};
