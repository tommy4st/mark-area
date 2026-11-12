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
`);return y}import{Compartment as P,EditorSelection as T,EditorState as z}from"@codemirror/state";import{EditorView as g,drawSelection as q,keymap as L,placeholder as O}from"@codemirror/view";import{defaultKeymap as R,history as U,historyKeymap as I}from"@codemirror/commands";import{markdown as B}from"@codemirror/lang-markdown";import{Strikethrough as j}from"@lezer/markdown";import{EditorSelection as F}from"@codemirror/state";import{EditorView as H}from"@codemirror/view";import{syntaxTree as V}from"@codemirror/language";var E=H.domEventHandlers({click(r,i){if(!(r.ctrlKey||r.metaKey))return!1;let o=i.posAtCoords({x:r.clientX,y:r.clientY});if(o==null)return!1;for(let a=V(i.state).resolveInner(o,1);a;a=a.parent){let s=(a.name==="Link"||a.name==="Image")&&a.getChild("URL");if(s){let{src:h,width:d}=x(i.state.sliceDoc(s.from,s.to)),m=/^!?\[([\s\S]*?)\]/.exec(i.state.sliceDoc(a.from,a.to))?.[1]||"",u=e.get(i);if(u&&!n(u,"ma-link-click",{href:h,label:m,width:d,kind:a.name,originalEvent:r}))return!0;if(h.startsWith("data:"))t("a",{href:h,download:m||"download"}).click();else window.open(h,"_blank","noopener");return!0}}return!1},drop:(r,i)=>M(i,r,r.dataTransfer?.files,i.posAtCoords({x:r.clientX,y:r.clientY})),paste:(r,i)=>M(i,r,r.clipboardData?.files)});function M(r,i,o,a){let s=o?.length?e.get(r):void 0;if(!s?.uploads||s.disabled||s.readOnly)return!1;if(i.preventDefault(),a!=null)r.dispatch({selection:F.cursor(a)});return s.uploadFiles(o),!0}class l extends HTMLElement{static formAssociated=!0;static observedAttributes=["value","placeholder","rows","disabled","readonly","required","hide-marks","toolbar","uploads"];#e;#r;#p;#g=new P;#t;#b="";#i=!1;#o=b;#a=[];#f=[];#n=new Set;#s=[];#l={};constructor(){super();this.#r=this.attachShadow({mode:"open",delegatesFocus:!0});try{this.#e=this.attachInternals?.()}catch{}let r=v();if(r)this.#n.add(r),this.#r.adoptedStyleSheets=[r];else this.#r.append(t("style",{textContent:w}));let i=t("div",{role:"toolbar"},"toolbar"),o=t("slot",{name:"toolbar"});this.#p=o,i.append(o),i.onmousedown=(a)=>a.preventDefault(),i.onclick=(a)=>{let s=a.target?.closest("[data-action]")?.dataset.action;if(s&&!this.disabled&&!this.readOnly)this.exec(s)},this.#r.append(i)}#w(r){let i=this.#l[r.id],o=i?.title??r.id,a=t("button",{type:"button",tabIndex:-1,title:r.hint?`${o} (${r.hint})`:o,innerHTML:r.html,ariaLabel:i?.label??o},`button button-${r.id}`);return a.dataset.action=r.id,a}#c(){let r=(i)=>["extension","actions","markdown","styles"].some((o)=>(o in i));return this.#a.filter(Boolean).map((i)=>typeof i==="object"&&r(i)?i:{extension:i})}#d(){let r=new Map(C);for(let i of this.#c().flatMap((o)=>o.actions??[]))r.set(i.id,i);return r}connectedCallback(){if(!this.#t){let r=this.getAttribute("value")??this.textContent?.trim()??"";this.#b=r,this.#t=new g({parent:this.#r,state:z.create({doc:r,extensions:[U(),q(),g.lineWrapping,E,this.#g.of(this.#v()),L.of([...R,...I]),g.updateListener.of((i)=>{if(i.docChanged&&!this.#i)this.#u(),n(this,"input",{value:this.value,view:i.view});if(i.focusChanged&&!i.view.hasFocus)this.classList.add("ma-touched"),n(this,"change",{value:this.value,view:i.view})})]})}),this.#t.dom.setAttribute("part","editor"),e.set(this.#t,this)}this.#h()}attributeChangedCallback(r,i,o){if(!this.#t)return;if(r==="value")this.value=o??"";else this.#h()}formResetCallback(){this.classList.remove("ma-touched"),this.value=this.getAttribute("value")??this.#b}formDisabledCallback(r){this.disabled=r}formStateRestoreCallback(r){this.value=r}get view(){return this.#t}get value(){return this.#t?this.#t.state.doc.toString():this.getAttribute("value")??""}set value(r){if(!this.#t){this.setAttribute("value",r);return}let i=this.#t.state.doc.toString();if(r!==i)this.#i=!0,this.#t.dispatch({changes:{from:0,to:i.length,insert:r}}),this.#i=!1,this.#u()}get name(){return this.getAttribute("name")??""}set name(r){this.setAttribute("name",r)}get placeholder(){return this.getAttribute("placeholder")??""}set placeholder(r){this.setAttribute("placeholder",r)}get rows(){return Number(this.getAttribute("rows"))||4}set rows(r){this.setAttribute("rows",String(r))}get disabled(){return this.hasAttribute("disabled")}set disabled(r){this.toggleAttribute("disabled",r)}get readOnly(){return this.hasAttribute("readonly")}set readOnly(r){this.toggleAttribute("readonly",r)}get required(){return this.hasAttribute("required")}set required(r){this.toggleAttribute("required",r)}get hideMarks(){return this.hasAttribute("hide-marks")}set hideMarks(r){this.toggleAttribute("hide-marks",r)}get plugins(){return this.#a}set plugins(r){if(this.#a=r?[...r]:[],this.#t)this.#h()}get form(){return this.#e?.form??this.closest("form")}get validity(){return this.#e?.validity}get validationMessage(){return this.#e?.validationMessage??""}checkValidity(){return this.#e?.checkValidity()??!0}reportValidity(){return this.classList.add("ma-touched"),this.#e?.reportValidity()??!0}focus(r){this.#t?.focus(),super.focus(r)}exec(r){let i=this.#d().get(r);if(!i||!this.#t||!this.#m(r))return!1;if(f.get(this.#t)?.(r))return!0;if(this.#t.focus(),!n(this,"ma-action",{action:r,view:this.#t}))return!0;return i.run(this.#t)}adoptStyles(...r){this.#f=r,this.#y()}#y(){if(!("adoptedStyleSheets"in this.#r))return;let r=v(),i=[];for(let d of this.#c()){if(!d.styles)continue;if(typeof d.styles==="string"){if(typeof CSSStyleSheet<"u"&&"replaceSync"in CSSStyleSheet.prototype){let m=new CSSStyleSheet;m.replaceSync(d.styles),i.push(m)}}else i.push(d.styles)}let o=this.#r.adoptedStyleSheets,a=o.filter((d)=>!this.#n.has(d)),s=[...r?[r]:[],...i,...this.#f];this.#n=new Set(s);let h=[...a,...s];if(o.length!==h.length||o.some((d,m)=>d!==h[m]))this.#r.adoptedStyleSheets=h}get uploads(){let r=this.getAttribute("uploads");return r!==null&&r!=="off"}set uploads(r){this.toggleAttribute("uploads",r)}get toolbar(){return this.getAttribute("toolbar")?.split(/\s+/).filter(Boolean)??null}set toolbar(r){if(r)this.setAttribute("toolbar",r.join(" "));else this.removeAttribute("toolbar")}get labels(){return this.#l}set labels(r){if(this.#l=r??{},this.#t)this.#S()}#m(r){return this.uploads||r!=="image"&&r!=="file"}get upload(){return this.#o}set upload(r){this.#o=r??b}pickFiles(r="file"){if(this.disabled||this.readOnly)return;let i=t("input",{type:"file",multiple:!0,accept:r==="image"?"image/*":this.getAttribute("accept")??"*/*"});i.onchange=()=>{if(i.files?.length)this.uploadFiles(i.files,r)},i.click()}async uploadFiles(r,i){if(!this.#t||this.disabled||this.readOnly)return;let o=Array.from(r);if(!o.length)return;this.toggleAttribute("uploading",!0);try{let a=[];for(let m of o){let u=i==="image"||i!=="file"&&m.type.startsWith("image/")?"image":"file",S={file:m,kind:u,result:void 0};if(!n(this,"ma-upload",S))continue;let p=await(S.result??this.#o(m,u)),k=typeof p==="string"?p:p.url,A=(typeof p==="object"&&p.name||m.name||"file").replace(/[\[\]]/g,"");a.push(u==="image"?`![${A}](${k})`:`[${A}](${k})`)}if(!a.length)return;let s=a.join(`
`),{from:h,to:d}=this.#t.state.selection.main;this.#t.dispatch({changes:{from:h,to:d,insert:s},selection:T.cursor(h+s.length)}),this.#t.focus(),n(this,"ma-uploaded",{snippets:a,files:o,view:this.#t})}finally{this.toggleAttribute("uploading",!1)}}#v(){let r=this.#c(),i=[j],o=[];for(let s of r){if(s.markdown)i.push(s.markdown);if(s.extension)o.push(s.extension)}let a=Array.from(this.#d().values());return[B({extensions:i}),L.of(a.filter((s)=>s.key&&this.#m(s.id)).map((s)=>({key:s.key,run:()=>this.exec(s.id),preventDefault:!0}))),...o,D(this.hideMarks),g.editable.of(!this.disabled&&!this.readOnly),z.readOnly.of(this.readOnly),this.placeholder?O(this.placeholder):[],g.contentAttributes.of({part:"content","aria-multiline":"true","aria-required":String(this.required)})]}#S(){for(let o of this.#s)o.remove();let r=this.#d(),i=this.toolbar??[...r.keys()];this.#s=i.map((o)=>r.get(o)).filter((o)=>!!o&&this.#m(o.id)).map((o)=>this.#w(o)),this.#p.append(...this.#s)}#h(){this.style.setProperty("--ma-rows",String(this.rows)),this.#S(),this.#y(),this.#t?.dispatch({effects:this.#g.reconfigure(this.#v())}),this.#u()}#u(){if(!this.#e)return;let r=this.value;this.#e.setFormValue(r),this.#e.setValidity(this.required&&!this.disabled&&!r.trim()?{valueMissing:!0}:{},this.getAttribute("required-message")||"Please fill out this field.",this.#t?.contentDOM)}}function c(r="mark-area"){if(typeof customElements<"u"&&!customElements.get(r))customElements.define(r,l)}
export{w,l,c};
