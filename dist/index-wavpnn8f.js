import{h,r,n,o,l,t,s,i,R,K,O,z}from"./index-vpjssw8h.js";import{v,F,q}from"./index-fay2d9ap.js";var b=(e)=>new Promise((a,d)=>{let c=new FileReader;c.onload=()=>a({url:String(c.result),name:e.name}),c.onerror=()=>d(c.error??Error("Failed to read file")),c.readAsDataURL(e)});async function Y(e,a,d,c){let m=new FormData;m.append("file",d),m.append("kind",c);let p=await fetch(e,{method:"POST",body:m,credentials:"same-origin",headers:{Accept:"application/json",...a?{"X-CSRF-Token":a}:{}}});if(!p.ok){let u=await p.text().catch(()=>""),f=u.trim();try{let S=JSON.parse(u);f=S.error??S.message??f}catch{}throw Error(f||`Upload failed: ${p.status} ${p.statusText}`)}return(p.headers.get("content-type")??"").includes("json")?await p.json():(await p.text()).trim()}async function E(e,a,d){let c={file:a,kind:d,result:void 0};if(!s(e,"ma-upload",c))return null;try{let m=e.upload===b?e.uploadUrl:null,p=null;if(m){let w=typeof location>"u";if(!w)try{w=new URL(m,location.href).origin===location.origin}catch{}p=e.hasAttribute("csrf-token")||w?e.csrfToken:null}let g=await(c.result??(m?Y(m,p,a,d):e.upload(a,d))),f=(typeof g==="string"?g:g?.url)?.replace(/[\r\n]+/g,"").trim();if(!f)throw Error("Upload returned no URL");let S=typeof g==="object"&&g.name||a.name||"file";return{url:f,name:S.replace(/[\[\]\r\n]+/g," ").trim()||"file"}}catch(m){let p=m instanceof Error?m:Error(String(m));if(e.toggleAttribute("upload-error",!0),s(e,"ma-upload-error",{file:a,kind:d,error:p}))console.error(`mark-area: upload of "${a.name}" failed`,p);return null}}var x=new WeakMap;async function C(e,a){let d=(x.get(e)??0)+1;x.set(e,d),e.toggleAttribute("uploading",!0),e.toggleAttribute("upload-error",!1);try{return await a()}finally{let c=(x.get(e)??1)-1;if(c<=0)x.delete(e),e.toggleAttribute("uploading",!1);else x.set(e,c)}}async function T(e,a,d){let c=[];for(let m of a){let p=d==="image"||d!=="file"&&m.type.startsWith("image/")?"image":"file",g=await E(e,m,p);if(g)c.push(`${p==="image"?"!":""}[${g.name}](${R(g.url)})`)}return c}var H=`
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
`,M=null;function U(){if(!M&&typeof CSSStyleSheet<"u"&&"replaceSync"in CSSStyleSheet.prototype)M=new CSSStyleSheet,M.replaceSync(`
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
`);return M}import{Compartment as Q,EditorSelection as Z,EditorState as j}from"@codemirror/state";import{EditorView as A,drawSelection as tt,keymap as D,placeholder as et}from"@codemirror/view";import{history as rt,historyKeymap as it,standardKeymap as ot}from"@codemirror/commands";import{Language as st}from"@codemirror/language";import{commonmarkLanguage as B,deleteMarkupBackward as at,insertNewlineContinueMarkup as nt,pasteURLAsLink as lt}from"@codemirror/lang-markdown";import{Strikethrough as dt}from"@lezer/markdown";import{EditorSelection as _}from"@codemirror/state";import{EditorView as J}from"@codemirror/view";import{syntaxTree as G}from"@codemirror/language";var I=J.domEventHandlers({click(e,a){if(!(e.ctrlKey||e.metaKey))return!1;let d=a.posAtCoords({x:e.clientX,y:e.clientY});if(d==null)return!1;for(let c=G(a.state).resolveInner(d,1);c;c=c.parent){let m=(c.name==="Link"||c.name==="Image")&&c.getChild("URL");if(m){let{src:p,width:g}=v(a.state.sliceDoc(m.from,m.to)),u=/^!?\[([\s\S]*?)\]/.exec(a.state.sliceDoc(c.from,c.to))?.[1]||"",f=a.state.facet(r);if(f&&!s(f,"ma-link-click",{href:p,label:u,width:g,kind:c.name,originalEvent:e}))return!0;if(p.startsWith("data:"))t("a",{href:p,download:u||"download"}).click();else{let S=i(p);if(S)window.open(S,"_blank","noopener")}return!0}}return!1},drop:(e,a)=>V(a,e,e.dataTransfer?.files,a.posAtCoords({x:e.clientX,y:e.clientY})),paste:(e,a)=>V(a,e,e.clipboardData?.files)});function V(e,a,d,c){let m=d?.length?e.state.facet(r):null;if(!m?.uploads||m.disabled||m.readOnly)return!1;if(a.preventDefault(),c!=null)e.dispatch({selection:_.cursor(c)});return m.uploadFiles(d),!0}var N=["history","strings","keys","plugins","marks","state","attrs"],W=new Map,ct=(e)=>["extension","actions","markdown","styles"].some((a)=>(a in e)),mt=(e)=>new st(B.data,B.parser.configure(e),[],"markdown");class y extends HTMLElement{static formAssociated=!0;static observedAttributes=["value","placeholder","rows","disabled","readonly","required","required-message","marks","hide-marks","show-marks","toolbar","uploads"];#r;#e;#w;#d=Object.fromEntries(N.map((e)=>[e,new Q]));#t;#o;#c="";#m=!1;#v=b;#u=[];#a=[];#x=[];#h=new Set;#p=[];#g=[];#f={};#b={};#l=new Set;constructor(){super();this.#e=this.attachShadow({mode:"open",delegatesFocus:!0});try{this.#r=this.attachInternals?.()}catch{}let e=U();if(e)this.#h.add(e),this.#e.adoptedStyleSheets=[e];else this.#e.append(t("style",{textContent:H}));let a=t("div",{role:"toolbar"},"toolbar"),d=t("slot",{name:"toolbar"});this.#w=d,a.append(d),a.onmousedown=(c)=>c.preventDefault(),a.onclick=(c)=>{let m=c.target?.closest("[data-action]")?.dataset.action;if(m)this.exec(m)},this.#e.addEventListener("input",(c)=>c.stopPropagation()),this.#e.append(a)}#M(e){let a=this.#f[e.id],d=a?.title??e.label??e.id,c=t("button",{type:"button",tabIndex:-1,title:e.hint?`${d} (${e.hint})`:d,innerHTML:e.html,ariaLabel:a?.label??e.label??d},`button button-${e.id}`);if(c.dataset.action=e.id,e.id==="mode"){let m=O[this.marks];c.innerHTML=m.html,c.title=`${d}: ${this.strings[m.label]}`}return c}#y(){let e=new Map([...K,["mode",z]]);for(let a of this.#a.flatMap((d)=>d.actions??[]))e.set(a.id,a);return e}#k(e){return e.enabled?.(this)??!0}#A(e){switch(e){case"history":return rt();case"strings":return o.of(this.#b);case"keys":return D.of([...this.#y().values()].filter((a)=>a.key&&this.#k(a)).map((a)=>({key:a.key,run:()=>this.exec(a.id),preventDefault:!0})));case"plugins":return[mt([dt,...this.#a.flatMap((a)=>a.markdown??[])]),this.#a.flatMap((a)=>a.extension??[])];case"marks":return n.of(this.marks);case"state":return[A.editable.of(!this.disabled&&!this.readOnly),j.readOnly.of(this.disabled||this.readOnly)];case"attrs":return[this.placeholder?et(this.placeholder):[],A.contentAttributes.of({part:"content","aria-multiline":"true","aria-required":String(this.required)})]}}#i(...e){this.#t?.dispatch({effects:e.map((a)=>this.#d[a].reconfigure(this.#A(a)))})}#E(e){let a=(d)=>this.#d[d].of(this.#A(d));return j.create({doc:e,extensions:[a("history"),tt(),A.lineWrapping,I,r.of(this),a("strings"),a("keys"),a("plugins"),a("marks"),F,a("state"),a("attrs"),q,D.of([{key:"Enter",run:nt},{key:"Backspace",run:at},...ot,...it]),lt,A.updateListener.of((d)=>{if(d.docChanged){for(let c of this.#l)c.from=d.changes.mapPos(c.from,1),c.to=Math.max(c.from,d.changes.mapPos(c.to,1));if(!this.#m)this.#n(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))}if(d.focusChanged&&!d.view.hasFocus)this.classList.add("ma-touched"),this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))})]})}#C(){let e=this.querySelector(":scope > textarea");if(!(e instanceof HTMLTextAreaElement))return;for(let{name:a,value:d}of e.attributes)if(a!=="class"&&!this.hasAttribute(a))this.setAttribute(a,d);return e.remove(),e.value}connectedCallback(){if(!this.#t){let e=this.#o;if(!e){let a=this.#C();this.#c=this.getAttribute("value")??a??this.textContent?.trim()??""}if(this.#t=new A({parent:this.#e,state:e??this.#E(this.#c)}),this.#o=void 0,this.#t.dom.setAttribute("part","editor"),this.#t.scrollDOM.setAttribute("part","scroller"),e)this.#i(...N)}this.style.setProperty("--ma-rows",String(this.rows)),this.#s(),this.#S(),this.#n()}disconnectedCallback(){queueMicrotask(()=>{if(this.isConnected||!this.#t)return;this.#o=this.#t.state,this.#t.destroy(),this.#t=void 0})}attributeChangedCallback(e,a,d){if(!this.#t&&!this.#o)return;switch(e){case"value":this.value=d??"";break;case"rows":this.style.setProperty("--ma-rows",String(this.rows));break;case"toolbar":this.#s();break;case"placeholder":this.#i("attrs");break;case"required":case"required-message":this.#i("attrs"),this.#n();break;case"disabled":case"readonly":this.#i("state"),this.#n();break;case"uploads":this.#i("keys"),this.#s();break;default:this.#i("marks"),this.#s()}}formResetCallback(){this.classList.remove("ma-touched"),this.value=this.getAttribute("value")??this.#c}formDisabledCallback(e){this.disabled=e}formStateRestoreCallback(e){this.value=e}get view(){return this.#t}get value(){return(this.#t?.state??this.#o)?.doc.toString()??this.getAttribute("value")??""}set value(e){let a=this.#t?.state??this.#o;if(!a){this.setAttribute("value",e);return}if(e===a.doc.toString())return;let d=a.update({changes:{from:0,to:a.doc.length,insert:e},effects:this.#d.history.reconfigure([])});if(this.#t)this.#m=!0,this.#t.dispatch(d),this.#m=!1,this.#i("history");else{for(let c of this.#l)c.from=d.changes.mapPos(c.from,1),c.to=Math.max(c.from,d.changes.mapPos(c.to,1));this.#o=d.state}this.#n()}get name(){return this.getAttribute("name")??""}set name(e){this.setAttribute("name",e)}get placeholder(){return this.getAttribute("placeholder")??""}set placeholder(e){this.setAttribute("placeholder",e)}get rows(){return Number(this.getAttribute("rows"))||4}set rows(e){this.setAttribute("rows",String(e))}get disabled(){return this.hasAttribute("disabled")}set disabled(e){this.toggleAttribute("disabled",e)}get readOnly(){return this.hasAttribute("readonly")}set readOnly(e){this.toggleAttribute("readonly",e)}get required(){return this.hasAttribute("required")}set required(e){this.toggleAttribute("required",e)}get marks(){let e=this.getAttribute("marks");if(e==="auto"||e==="hide"||e==="show")return e;return this.hasAttribute("show-marks")?"show":this.hasAttribute("hide-marks")?"hide":"auto"}set marks(e){this.setAttribute("marks",e)}get hideMarks(){return this.marks==="hide"}set hideMarks(e){this.toggleAttribute("hide-marks",e)}get showMarks(){return this.marks==="show"}set showMarks(e){this.toggleAttribute("show-marks",e)}get plugins(){return this.#u}set plugins(e){if(this.#u=e?[...e]:[],this.#a=this.#u.filter(Boolean).map((a)=>typeof a==="object"&&ct(a)?a:{extension:a}),!this.#t)return;this.#i("plugins","keys"),this.#s(),this.#S()}get form(){return this.#r?.form??this.closest("form")}get validity(){return this.#r?.validity}get validationMessage(){return this.#r?.validationMessage??""}checkValidity(){return this.#r?.checkValidity()??!0}reportValidity(){return this.classList.add("ma-touched"),this.#r?.reportValidity()??!0}focus(e){this.#t?.focus(),super.focus(e)}exec(e){let a=this.#t,d=this.#y().get(e);if(!d||!a||!this.#k(d))return!1;if(this.disabled||this.readOnly&&e!=="mode")return!1;if(!s(this,"ma-action",{action:e,view:a}))return!0;for(let c of a.state.facet(l))if(c(a,e))return!0;return a.focus(),d.run(a)}adoptStyles(...e){this.#x=e,this.#S()}#S(){if(!(("adoptedStyleSheets"in this.#e)&&typeof CSSStyleSheet<"u"&&("replaceSync"in CSSStyleSheet.prototype))){for(let u of this.#p)u.remove();this.#p=this.#a.filter((u)=>typeof u.styles==="string"&&!!u.styles).map((u)=>t("style",{textContent:u.styles})),this.#e.append(...this.#p);return}let a=U(),d=[];for(let u of this.#a){if(!u.styles)continue;if(typeof u.styles==="string"){let f=W.get(u.styles);if(!f)f=new CSSStyleSheet,f.replaceSync(u.styles),W.set(u.styles,f);d.push(f)}else d.push(u.styles)}let c=this.#e.adoptedStyleSheets,m=c.filter((u)=>!this.#h.has(u)),p=[...a?[a]:[],...d,...this.#x];this.#h=new Set(p);let g=[...m,...p];if(c.length!==g.length||c.some((u,f)=>u!==g[f]))this.#e.adoptedStyleSheets=g}get uploads(){let e=this.getAttribute("uploads");return e!==null&&e!=="off"}set uploads(e){this.toggleAttribute("uploads",e)}get toolbar(){return this.getAttribute("toolbar")?.split(/\s+/).filter(Boolean)??null}set toolbar(e){if(e)this.setAttribute("toolbar",e.join(" "));else this.removeAttribute("toolbar")}get labels(){return this.#f}set labels(e){if(this.#f=e??{},this.#t)this.#s()}get strings(){return{...h,...this.#b}}set strings(e){if(this.#b=e??{},!this.#t)return;this.#i("strings"),this.#s(),this.#n()}get upload(){return this.#v}set upload(e){this.#v=e??b}get uploadUrl(){return this.getAttribute("upload-url")}set uploadUrl(e){if(e==null)this.removeAttribute("upload-url");else this.setAttribute("upload-url",e)}get csrfToken(){return this.getAttribute("csrf-token")??document.querySelector('meta[name="csrf-token"]')?.content??null}set csrfToken(e){if(e==null)this.removeAttribute("csrf-token");else this.setAttribute("csrf-token",e)}pickFiles(e="file"){if(this.disabled||this.readOnly)return;let a=t("input",{type:"file",multiple:!0,accept:e==="image"?"image/*":this.getAttribute("accept")??"*/*"});a.onchange=()=>{if(a.files?.length)this.uploadFiles(a.files,e)},a.click()}async uploadImage(e){if(!this.uploads||this.disabled||this.readOnly)return null;return C(this,async()=>(await E(this,e,"image"))?.url??null)}async uploadFiles(e,a){if(!this.#t||!this.uploads||this.disabled||this.readOnly)return;let d=Array.from(e);if(!d.length)return;let{from:c,to:m}=this.#t.state.selection.main,p={from:c,to:m};this.#l.add(p);try{let g=await C(this,()=>T(this,d,a)),u=this.#t;if(!g.length||!u||this.disabled||this.readOnly)return;let f=u.state.doc.length,S=Math.min(p.from,f),w=Math.min(Math.max(S,p.to),f),L=g.join(`
`),P=u.state.selection.main,X=P.from===S&&P.to===w;u.dispatch({changes:{from:S,to:w,insert:L},selection:X?Z.cursor(S+L.length):void 0}),u.focus(),s(this,"ma-uploaded",{snippets:g,files:d,view:u})}finally{this.#l.delete(p)}}#s(){for(let d of this.#g)d.remove();let e=this.#y(),a=this.toolbar??[...e.keys()].filter((d)=>d!=="mode");this.#g=a.map((d)=>e.get(d)).filter((d)=>!!d&&this.#k(d)).map((d)=>this.#M(d)),this.#w.append(...this.#g)}#n(){if(!this.#r)return;let e=this.value;this.#r.setFormValue(e),this.#r.setValidity(this.required&&!this.disabled&&!e.trim()?{valueMissing:!0}:{},this.getAttribute("required-message")||this.strings.required,this.#t?.contentDOM)}}function k(e="mark-area"){if(typeof customElements<"u"&&!customElements.get(e))customElements.define(e,y)}
export{b,H,y,k};
