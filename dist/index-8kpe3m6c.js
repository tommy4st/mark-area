import{t,n,f,e,b,C,x,D}from"./index-hhvkestt.js";var w=`
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
.cm-editor .cm-scroller { font-family: var(--ma-font, inherit); line-height: inherit; }
.cm-editor .cm-content {
    font-family: var(--ma-font, inherit);
    padding: var(--ma-padding, 0.5rem 0.75rem);
    min-height: calc(var(--ma-rows, 4) * 1.5em);
    caret-color: var(--ma-caret-color, currentColor);
    outline: none;
}
.cm-cursor, .cm-dropCursor { border-left: 1.5px solid var(--ma-caret-color, currentColor) !important; }
.cm-selectionBackground { background: var(--ma-selection-bg, color-mix(in srgb, currentColor 20%, transparent)) !important; }
.cm-editor .cm-line { padding: var(--ma-line-padding, 0); }
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
`,y=null;function v(){if(!y&&typeof CSSStyleSheet<"u"&&"replaceSync"in CSSStyleSheet.prototype)y=new CSSStyleSheet,y.replaceSync(`
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
.cm-editor .cm-scroller { font-family: var(--ma-font, inherit); line-height: inherit; }
.cm-editor .cm-content {
    font-family: var(--ma-font, inherit);
    padding: var(--ma-padding, 0.5rem 0.75rem);
    min-height: calc(var(--ma-rows, 4) * 1.5em);
    caret-color: var(--ma-caret-color, currentColor);
    outline: none;
}
.cm-cursor, .cm-dropCursor { border-left: 1.5px solid var(--ma-caret-color, currentColor) !important; }
.cm-selectionBackground { background: var(--ma-selection-bg, color-mix(in srgb, currentColor 20%, transparent)) !important; }
.cm-editor .cm-line { padding: var(--ma-line-padding, 0); }
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
`);return y}import{Compartment as T,EditorSelection as q,EditorState as z}from"@codemirror/state";import{Decoration as F,EditorView as g,ViewPlugin as O,drawSelection as R,keymap as L,placeholder as U}from"@codemirror/view";import{defaultKeymap as I,history as B,historyKeymap as j}from"@codemirror/commands";import{markdown as K}from"@codemirror/lang-markdown";import{Strikethrough as N}from"@lezer/markdown";import{EditorSelection as V}from"@codemirror/state";import{EditorView as P}from"@codemirror/view";import{syntaxTree as H}from"@codemirror/language";var M=P.domEventHandlers({click(r,i){if(!(r.ctrlKey||r.metaKey))return!1;let o=i.posAtCoords({x:r.clientX,y:r.clientY});if(o==null)return!1;for(let s=H(i.state).resolveInner(o,1);s;s=s.parent){let a=(s.name==="Link"||s.name==="Image")&&s.getChild("URL");if(a){let{src:d,width:m}=x(i.state.sliceDoc(a.from,a.to)),h=/^!?\[([\s\S]*?)\]/.exec(i.state.sliceDoc(s.from,s.to))?.[1]||"",u=e.get(i);if(u&&!n(u,"ma-link-click",{href:d,label:h,width:m,kind:s.name,originalEvent:r}))return!0;if(d.startsWith("data:"))t("a",{href:d,download:h||"download"}).click();else window.open(d,"_blank","noopener");return!0}}return!1},drop:(r,i)=>E(i,r,r.dataTransfer?.files,i.posAtCoords({x:r.clientX,y:r.clientY})),paste:(r,i)=>E(i,r,r.clipboardData?.files)});function E(r,i,o,s){let a=o?.length?e.get(r):void 0;if(!a?.uploads||a.disabled||a.readOnly)return!1;if(i.preventDefault(),s!=null)r.dispatch({selection:V.cursor(s)});return a.uploadFiles(o),!0}var W=F.line({attributes:{part:"line"}}),X=O.fromClass(class{decorations;constructor(r){this.decorations=this.build(r)}update(r){if(r.docChanged||r.viewportChanged)this.decorations=this.build(r.view)}build(r){let i=[];for(let{from:o,to:s}of r.visibleRanges)for(let a=o;a<=s;){let d=r.state.doc.lineAt(a);i.push(W.range(d.from)),a=d.to+1}return F.set(i,!0)}},{decorations:(r)=>r.decorations});class l extends HTMLElement{static formAssociated=!0;static observedAttributes=["value","placeholder","rows","disabled","readonly","required","hide-marks","toolbar","uploads"];#e;#r;#p;#g=new T;#t;#b="";#i=!1;#o=b;#a=[];#f=[];#n=new Set;#s=[];#l={};constructor(){super();this.#r=this.attachShadow({mode:"open",delegatesFocus:!0});try{this.#e=this.attachInternals?.()}catch{}let r=v();if(r)this.#n.add(r),this.#r.adoptedStyleSheets=[r];else this.#r.append(t("style",{textContent:w}));let i=t("div",{role:"toolbar"},"toolbar"),o=t("slot",{name:"toolbar"});this.#p=o,i.append(o),i.onmousedown=(s)=>s.preventDefault(),i.onclick=(s)=>{let a=s.target?.closest("[data-action]")?.dataset.action;if(a&&!this.disabled&&!this.readOnly)this.exec(a)},this.#r.append(i)}#S(r){let i=this.#l[r.id],o=i?.title??r.id,s=t("button",{type:"button",tabIndex:-1,title:r.hint?`${o} (${r.hint})`:o,innerHTML:r.html,ariaLabel:i?.label??o},`button button-${r.id}`);return s.dataset.action=r.id,s}#c(){let r=(i)=>["extension","actions","markdown","styles"].some((o)=>(o in i));return this.#a.filter(Boolean).map((i)=>typeof i==="object"&&r(i)?i:{extension:i})}#d(){let r=new Map(C);for(let i of this.#c().flatMap((o)=>o.actions??[]))r.set(i.id,i);return r}connectedCallback(){if(!this.#t){let r=this.getAttribute("value")??this.textContent?.trim()??"";this.#b=r,this.#t=new g({parent:this.#r,state:z.create({doc:r,extensions:[B(),R(),g.lineWrapping,M,this.#g.of(this.#v()),L.of([...I,...j]),g.updateListener.of((i)=>{if(i.docChanged&&!this.#i)this.#u(),n(this,"input",{value:this.value,view:i.view});if(i.focusChanged&&!i.view.hasFocus)this.classList.add("ma-touched"),n(this,"change",{value:this.value,view:i.view})})]})}),this.#t.dom.setAttribute("part","editor"),this.#t.scrollDOM.setAttribute("part","scroller"),e.set(this.#t,this)}this.#h()}attributeChangedCallback(r,i,o){if(!this.#t)return;if(r==="value")this.value=o??"";else this.#h()}formResetCallback(){this.classList.remove("ma-touched"),this.value=this.getAttribute("value")??this.#b}formDisabledCallback(r){this.disabled=r}formStateRestoreCallback(r){this.value=r}get view(){return this.#t}get value(){return this.#t?this.#t.state.doc.toString():this.getAttribute("value")??""}set value(r){if(!this.#t){this.setAttribute("value",r);return}let i=this.#t.state.doc.toString();if(r!==i)this.#i=!0,this.#t.dispatch({changes:{from:0,to:i.length,insert:r}}),this.#i=!1,this.#u()}get name(){return this.getAttribute("name")??""}set name(r){this.setAttribute("name",r)}get placeholder(){return this.getAttribute("placeholder")??""}set placeholder(r){this.setAttribute("placeholder",r)}get rows(){return Number(this.getAttribute("rows"))||4}set rows(r){this.setAttribute("rows",String(r))}get disabled(){return this.hasAttribute("disabled")}set disabled(r){this.toggleAttribute("disabled",r)}get readOnly(){return this.hasAttribute("readonly")}set readOnly(r){this.toggleAttribute("readonly",r)}get required(){return this.hasAttribute("required")}set required(r){this.toggleAttribute("required",r)}get hideMarks(){return this.hasAttribute("hide-marks")}set hideMarks(r){this.toggleAttribute("hide-marks",r)}get plugins(){return this.#a}set plugins(r){if(this.#a=r?[...r]:[],this.#t)this.#h()}get form(){return this.#e?.form??this.closest("form")}get validity(){return this.#e?.validity}get validationMessage(){return this.#e?.validationMessage??""}checkValidity(){return this.#e?.checkValidity()??!0}reportValidity(){return this.classList.add("ma-touched"),this.#e?.reportValidity()??!0}focus(r){this.#t?.focus(),super.focus(r)}exec(r){let i=this.#d().get(r);if(!i||!this.#t||!this.#m(r))return!1;if(f.get(this.#t)?.(r))return!0;if(this.#t.focus(),!n(this,"ma-action",{action:r,view:this.#t}))return!0;return i.run(this.#t)}adoptStyles(...r){this.#f=r,this.#y()}#y(){if(!("adoptedStyleSheets"in this.#r))return;let r=v(),i=[];for(let m of this.#c()){if(!m.styles)continue;if(typeof m.styles==="string"){if(typeof CSSStyleSheet<"u"&&"replaceSync"in CSSStyleSheet.prototype){let h=new CSSStyleSheet;h.replaceSync(m.styles),i.push(h)}}else i.push(m.styles)}let o=this.#r.adoptedStyleSheets,s=o.filter((m)=>!this.#n.has(m)),a=[...r?[r]:[],...i,...this.#f];this.#n=new Set(a);let d=[...s,...a];if(o.length!==d.length||o.some((m,h)=>m!==d[h]))this.#r.adoptedStyleSheets=d}get uploads(){let r=this.getAttribute("uploads");return r!==null&&r!=="off"}set uploads(r){this.toggleAttribute("uploads",r)}get toolbar(){return this.getAttribute("toolbar")?.split(/\s+/).filter(Boolean)??null}set toolbar(r){if(r)this.setAttribute("toolbar",r.join(" "));else this.removeAttribute("toolbar")}get labels(){return this.#l}set labels(r){if(this.#l=r??{},this.#t)this.#w()}#m(r){return this.uploads||r!=="image"&&r!=="file"}get upload(){return this.#o}set upload(r){this.#o=r??b}pickFiles(r="file"){if(this.disabled||this.readOnly)return;let i=t("input",{type:"file",multiple:!0,accept:r==="image"?"image/*":this.getAttribute("accept")??"*/*"});i.onchange=()=>{if(i.files?.length)this.uploadFiles(i.files,r)},i.click()}async uploadFiles(r,i){if(!this.#t||this.disabled||this.readOnly)return;let o=Array.from(r);if(!o.length)return;this.toggleAttribute("uploading",!0);try{let s=[];for(let h of o){let u=i==="image"||i!=="file"&&h.type.startsWith("image/")?"image":"file",S={file:h,kind:u,result:void 0};if(!n(this,"ma-upload",S))continue;let p=await(S.result??this.#o(h,u)),k=typeof p==="string"?p:p.url,A=(typeof p==="object"&&p.name||h.name||"file").replace(/[\[\]]/g,"");s.push(u==="image"?`![${A}](${k})`:`[${A}](${k})`)}if(!s.length)return;let a=s.join(`
`),{from:d,to:m}=this.#t.state.selection.main;this.#t.dispatch({changes:{from:d,to:m,insert:a},selection:q.cursor(d+a.length)}),this.#t.focus(),n(this,"ma-uploaded",{snippets:s,files:o,view:this.#t})}finally{this.toggleAttribute("uploading",!1)}}#v(){let r=this.#c(),i=[N],o=[];for(let a of r){if(a.markdown)i.push(a.markdown);if(a.extension)o.push(a.extension)}let s=Array.from(this.#d().values());return[K({extensions:i}),L.of(s.filter((a)=>a.key&&this.#m(a.id)).map((a)=>({key:a.key,run:()=>this.exec(a.id),preventDefault:!0}))),...o,D(this.hideMarks),g.editable.of(!this.disabled&&!this.readOnly),z.readOnly.of(this.readOnly),this.placeholder?U(this.placeholder):[],X,g.contentAttributes.of({part:"content","aria-multiline":"true","aria-required":String(this.required)})]}#w(){for(let o of this.#s)o.remove();let r=this.#d(),i=this.toolbar??[...r.keys()];this.#s=i.map((o)=>r.get(o)).filter((o)=>!!o&&this.#m(o.id)).map((o)=>this.#S(o)),this.#p.append(...this.#s)}#h(){this.style.setProperty("--ma-rows",String(this.rows)),this.#w(),this.#y(),this.#t?.dispatch({effects:this.#g.reconfigure(this.#v())}),this.#u()}#u(){if(!this.#e)return;let r=this.value;this.#e.setFormValue(r),this.#e.setValidity(this.required&&!this.disabled&&!r.trim()?{valueMissing:!0}:{},this.getAttribute("required-message")||"Please fill out this field.",this.#t?.contentDOM)}}function c(r="mark-area"){if(typeof customElements<"u"&&!customElements.get(r))customElements.define(r,l)}
export{w,l,c};
