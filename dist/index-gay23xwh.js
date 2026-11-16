import{t,n,g,r,l,C,w,D}from"./index-srd01kjy.js";var x=`
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
`);return v}import{Compartment as P,EditorSelection as H,EditorState as L}from"@codemirror/state";import{Decoration as z,EditorView as y,ViewPlugin as R,drawSelection as O,keymap as F,placeholder as q}from"@codemirror/view";import{defaultKeymap as j,history as I,historyKeymap as B}from"@codemirror/commands";import{markdown as K}from"@codemirror/lang-markdown";import{Strikethrough as N}from"@lezer/markdown";import{EditorSelection as T}from"@codemirror/state";import{EditorView as U}from"@codemirror/view";import{syntaxTree as V}from"@codemirror/language";var M=U.domEventHandlers({click(e,o){if(!(e.ctrlKey||e.metaKey))return!1;let i=o.posAtCoords({x:e.clientX,y:e.clientY});if(i==null)return!1;for(let s=V(o.state).resolveInner(i,1);s;s=s.parent){let a=(s.name==="Link"||s.name==="Image")&&s.getChild("URL");if(a){let{src:h,width:u}=w(o.state.sliceDoc(a.from,a.to)),m=/^!?\[([\s\S]*?)\]/.exec(o.state.sliceDoc(s.from,s.to))?.[1]||"",p=r.get(o);if(p&&!n(p,"ma-link-click",{href:h,label:m,width:u,kind:s.name,originalEvent:e}))return!0;if(h.startsWith("data:"))t("a",{href:h,download:m||"download"}).click();else window.open(h,"_blank","noopener");return!0}}return!1},drop:(e,o)=>E(o,e,e.dataTransfer?.files,o.posAtCoords({x:e.clientX,y:e.clientY})),paste:(e,o)=>E(o,e,e.clipboardData?.files)});function E(e,o,i,s){let a=i?.length?r.get(e):void 0;if(!a?.uploads||a.disabled||a.readOnly)return!1;if(o.preventDefault(),s!=null)e.dispatch({selection:T.cursor(s)});return a.uploadFiles(i),!0}var W=z.line({attributes:{part:"line"}}),X=R.fromClass(class{decorations;constructor(e){this.decorations=this.build(e)}update(e){if(e.docChanged||e.viewportChanged)this.decorations=this.build(e.view)}build(e){let o=[];for(let{from:i,to:s}of e.visibleRanges)for(let a=i;a<=s;){let h=e.state.doc.lineAt(a);o.push(W.range(h.from)),a=h.to+1}return z.set(o,!0)}},{decorations:(e)=>e.decorations});class c extends HTMLElement{static formAssociated=!0;static observedAttributes=["value","placeholder","rows","disabled","readonly","required","hide-marks","show-marks","toolbar","uploads"];#e;#r;#p;#g=new P;#t;#b="";#i=!1;#o=l;#a=[];#f=[];#n=new Set;#s=[];#l={};constructor(){super();this.#r=this.attachShadow({mode:"open",delegatesFocus:!0});try{this.#e=this.attachInternals?.()}catch{}let e=S();if(e)this.#n.add(e),this.#r.adoptedStyleSheets=[e];else this.#r.append(t("style",{textContent:x}));let o=t("div",{role:"toolbar"},"toolbar"),i=t("slot",{name:"toolbar"});this.#p=i,o.append(i),o.onmousedown=(s)=>s.preventDefault(),o.onclick=(s)=>{let a=s.target?.closest("[data-action]")?.dataset.action;if(a&&!this.disabled&&!this.readOnly)this.exec(a)},this.#r.append(o)}#S(e){let o=this.#l[e.id],i=o?.title??e.id,s=t("button",{type:"button",tabIndex:-1,title:e.hint?`${i} (${e.hint})`:i,innerHTML:e.html,ariaLabel:o?.label??i},`button button-${e.id}`);return s.dataset.action=e.id,s}#c(){let e=(o)=>["extension","actions","markdown","styles"].some((i)=>(i in o));return this.#a.filter(Boolean).map((o)=>typeof o==="object"&&e(o)?o:{extension:o})}#d(){let e=new Map(C);for(let o of this.#c().flatMap((i)=>i.actions??[]))e.set(o.id,o);return e}connectedCallback(){if(!this.#t){let e=this.getAttribute("value")??this.textContent?.trim()??"";this.#b=e,this.#t=new y({parent:this.#r,state:L.create({doc:e,extensions:[I(),O(),y.lineWrapping,M,this.#g.of(this.#v()),F.of([...j,...B]),y.updateListener.of((o)=>{if(o.docChanged&&!this.#i)this.#u(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}));if(o.focusChanged&&!o.view.hasFocus)this.classList.add("ma-touched"),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))})]})}),this.#t.dom.setAttribute("part","editor"),this.#t.scrollDOM.setAttribute("part","scroller"),r.set(this.#t,this)}this.#h()}attributeChangedCallback(e,o,i){if(!this.#t)return;if(e==="value")this.value=i??"";else this.#h()}formResetCallback(){this.classList.remove("ma-touched"),this.value=this.getAttribute("value")??this.#b}formDisabledCallback(e){this.disabled=e}formStateRestoreCallback(e){this.value=e}get view(){return this.#t}get value(){return this.#t?this.#t.state.doc.toString():this.getAttribute("value")??""}set value(e){if(!this.#t){this.setAttribute("value",e);return}let o=this.#t.state.doc.toString();if(e!==o)this.#i=!0,this.#t.dispatch({changes:{from:0,to:o.length,insert:e}}),this.#i=!1,this.#u()}get name(){return this.getAttribute("name")??""}set name(e){this.setAttribute("name",e)}get placeholder(){return this.getAttribute("placeholder")??""}set placeholder(e){this.setAttribute("placeholder",e)}get rows(){return Number(this.getAttribute("rows"))||4}set rows(e){this.setAttribute("rows",String(e))}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get readOnly(){return this.hasAttribute("readonly")}set readOnly(e){this.toggleAttribute("readonly",e)}get required(){return this.hasAttribute("required")}set required(e){this.toggleAttribute("required",e)}get hideMarks(){return this.hasAttribute("hide-marks")}set hideMarks(e){this.toggleAttribute("hide-marks",e)}get showMarks(){return this.hasAttribute("show-marks")}set showMarks(e){this.toggleAttribute("show-marks",e)}get plugins(){return this.#a}set plugins(e){if(this.#a=e?[...e]:[],this.#t)this.#h()}get form(){return this.#e?.form??this.closest("form")}get validity(){return this.#e?.validity}get validationMessage(){return this.#e?.validationMessage??""}checkValidity(){return this.#e?.checkValidity()??!0}reportValidity(){return this.classList.add("ma-touched"),this.#e?.reportValidity()??!0}focus(e){this.#t?.focus(),super.focus(e)}exec(e){let o=this.#d().get(e);if(!o||!this.#t||!this.#m(e))return!1;if(g.get(this.#t)?.(e))return!0;if(this.#t.focus(),!n(this,"ma-action",{action:e,view:this.#t}))return!0;return o.run(this.#t)}adoptStyles(...e){this.#f=e,this.#y()}#y(){if(!("adoptedStyleSheets"in this.#r))return;let e=S(),o=[];for(let u of this.#c()){if(!u.styles)continue;if(typeof u.styles==="string"){if(typeof CSSStyleSheet<"u"&&"replaceSync"in CSSStyleSheet.prototype){let m=new CSSStyleSheet;m.replaceSync(u.styles),o.push(m)}}else o.push(u.styles)}let i=this.#r.adoptedStyleSheets,s=i.filter((u)=>!this.#n.has(u)),a=[...e?[e]:[],...o,...this.#f];this.#n=new Set(a);let h=[...s,...a];if(i.length!==h.length||i.some((u,m)=>u!==h[m]))this.#r.adoptedStyleSheets=h}get uploads(){let e=this.getAttribute("uploads");return e!==null&&e!=="off"}set uploads(e){this.toggleAttribute("uploads",e)}get toolbar(){return this.getAttribute("toolbar")?.split(/\s+/).filter(Boolean)??null}set toolbar(e){if(e)this.setAttribute("toolbar",e.join(" "));else this.removeAttribute("toolbar")}get labels(){return this.#l}set labels(e){if(this.#l=e??{},this.#t)this.#w()}#m(e){return this.uploads||e!=="image"&&e!=="file"}get upload(){return this.#o}set upload(e){this.#o=e??l}get uploadUrl(){return this.getAttribute("upload-url")}set uploadUrl(e){if(e==null)this.removeAttribute("upload-url");else this.setAttribute("upload-url",e)}get csrfToken(){return this.getAttribute("csrf-token")??document.querySelector('meta[name="csrf-token"]')?.content??null}set csrfToken(e){if(e==null)this.removeAttribute("csrf-token");else this.setAttribute("csrf-token",e)}async#k(e,o){let i=new FormData;i.append("file",e),i.append("kind",o);let s=this.csrfToken,a=await fetch(this.uploadUrl,{method:"POST",body:i,credentials:"same-origin",headers:{Accept:"application/json",...s?{"X-CSRF-Token":s}:{}}});if(!a.ok){let u=await a.text().catch(()=>""),m=u.trim();try{let p=JSON.parse(u);m=p.error??p.message??m}catch{}throw Error(m||`Upload failed: ${a.status} ${a.statusText}`)}return(a.headers.get("content-type")??"").includes("json")?await a.json():(await a.text()).trim()}pickFiles(e="file"){if(this.disabled||this.readOnly)return;let o=t("input",{type:"file",multiple:!0,accept:e==="image"?"image/*":this.getAttribute("accept")??"*/*"});o.onchange=()=>{if(o.files?.length)this.uploadFiles(o.files,e)},o.click()}async uploadFiles(e,o){if(!this.#t||this.disabled||this.readOnly)return;let i=Array.from(e);if(!i.length)return;this.toggleAttribute("uploading",!0),this.toggleAttribute("upload-error",!1);try{let s=[];for(let m of i){let p=o==="image"||o!=="file"&&m.type.startsWith("image/")?"image":"file",k={file:m,kind:p,result:void 0};if(!n(this,"ma-upload",k))continue;try{let b=await(k.result??(this.#o===l&&this.uploadUrl?this.#k(m,p):this.#o(m,p))),f=typeof b==="string"?b:b?.url;if(!f)throw Error("Upload returned no URL");let A=(typeof b==="object"&&b.name||m.name||"file").replace(/[\[\]]/g,"");s.push(p==="image"?`![${A}](${f})`:`[${A}](${f})`)}catch(b){let f=b instanceof Error?b:Error(String(b));if(this.toggleAttribute("upload-error",!0),n(this,"ma-upload-error",{file:m,kind:p,error:f}))console.error(`mark-area: upload of "${m.name}" failed`,f)}}if(!s.length)return;let a=s.join(`
`),{from:h,to:u}=this.#t.state.selection.main;this.#t.dispatch({changes:{from:h,to:u,insert:a},selection:H.cursor(h+a.length)}),this.#t.focus(),n(this,"ma-uploaded",{snippets:s,files:i,view:this.#t})}finally{this.toggleAttribute("uploading",!1)}}#v(){let e=this.#c(),o=[N],i=[];for(let a of e){if(a.markdown)o.push(a.markdown);if(a.extension)i.push(a.extension)}let s=Array.from(this.#d().values());return[K({extensions:o}),F.of(s.filter((a)=>a.key&&this.#m(a.id)).map((a)=>({key:a.key,run:()=>this.exec(a.id),preventDefault:!0}))),...i,D(this.showMarks?"show":this.hideMarks?"hide":"auto"),y.editable.of(!this.disabled&&!this.readOnly),L.readOnly.of(this.readOnly),this.placeholder?q(this.placeholder):[],X,y.contentAttributes.of({part:"content","aria-multiline":"true","aria-required":String(this.required)})]}#w(){for(let i of this.#s)i.remove();let e=this.#d(),o=this.toolbar??[...e.keys()];this.#s=o.map((i)=>e.get(i)).filter((i)=>!!i&&this.#m(i.id)).map((i)=>this.#S(i)),this.#p.append(...this.#s)}#h(){this.style.setProperty("--ma-rows",String(this.rows)),this.#w(),this.#y(),this.#t?.dispatch({effects:this.#g.reconfigure(this.#v())}),this.#u()}#u(){if(!this.#e)return;let e=this.value;this.#e.setFormValue(e),this.#e.setValidity(this.required&&!this.disabled&&!e.trim()?{valueMissing:!0}:{},this.getAttribute("required-message")||"Please fill out this field.",this.#t?.contentDOM)}}function d(e="mark-area"){if(typeof customElements<"u"&&!customElements.get(e))customElements.define(e,c)}
export{x,c,d};
