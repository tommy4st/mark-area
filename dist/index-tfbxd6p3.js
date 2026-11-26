import{b,r,n,o,l,t,s,i,u,z,B,j}from"./index-78w2jvwa.js";import{P,q,W}from"./index-j86q3xj2.js";var x=(e)=>new Promise((a,d)=>{let c=new FileReader;c.onload=()=>a({url:String(c.result),name:e.name}),c.onerror=()=>d(c.error??Error("Failed to read file")),c.readAsDataURL(e)});async function J(e,a,d,c){let m=new FormData;m.append("file",d),m.append("kind",c);let h=await fetch(e,{method:"POST",body:m,credentials:"same-origin",headers:{Accept:"application/json",...a?{"X-CSRF-Token":a}:{}}});if(!h.ok){let p=await h.text().catch(()=>""),g=p.trim();try{let y=JSON.parse(p);g=y.error??y.message??g}catch{}throw Error(g||`Upload failed: ${h.status} ${h.statusText}`)}return(h.headers.get("content-type")??"").includes("json")?await h.json():(await h.text()).trim()}async function E(e,a,d){let c={file:a,kind:d,result:void 0};if(!s(e,"ma-upload",c))return null;try{let m=e.upload===x?e.uploadUrl:null,h=null;if(m){let k=!1;try{k=new URL(m,location.href).origin===location.origin}catch{}h=e.hasAttribute("csrf-token")||k?e.csrfToken:null}let f=await(c.result??(m?J(m,h,a,d):e.upload(a,d))),g=(typeof f==="string"?f:f?.url)?.replace(/[\r\n]+/g,"").trim();if(!g)throw Error("Upload returned no URL");let y=typeof f==="object"&&f.name||a.name||"file";return{url:g,name:y.replace(/[\[\]\\\r\n]+/g," ").trim()||"file"}}catch(m){let h=m instanceof Error?m:Error(String(m));if(e.toggleAttribute("upload-error",!0),s(e,"ma-upload-error",{file:a,kind:d,error:h}))console.error(`mark-area: upload of "${a.name}" failed`,h);return null}}var S=new WeakMap;async function C(e,a){let d=(S.get(e)??0)+1;S.set(e,d),e.toggleAttribute("uploading",!0),e.toggleAttribute("upload-error",!1);try{return await a()}finally{let c=(S.get(e)??1)-1;if(c<=0)S.delete(e),e.toggleAttribute("uploading",!1);else S.set(e,c)}}async function R(e,a,d){let c=[];for(let m of a){let h=d==="image"||d!=="file"&&m.type.startsWith("image/")?"image":"file",f=await E(e,m,h);if(f)c.push(`${h==="image"?"!":""}[${f.name}](${u(f.url)})`)}return c}var H=`
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
:host([disabled]), :host(:disabled) { opacity: 0.6; pointer-events: none; }
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
`,A=null;function U(){if(!A&&typeof CSSStyleSheet<"u"&&"replaceSync"in CSSStyleSheet.prototype)A=new CSSStyleSheet,A.replaceSync(`
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
:host([disabled]), :host(:disabled) { opacity: 0.6; pointer-events: none; }
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
`);return A}import{Compartment as tt,EditorSelection as et,EditorState as K}from"@codemirror/state";import{EditorView as v,drawSelection as rt,keymap as I,placeholder as it}from"@codemirror/view";import{history as st,historyKeymap as ot,standardKeymap as at}from"@codemirror/commands";import{Language as nt}from"@codemirror/language";import{commonmarkLanguage as N,deleteMarkupBackward as lt,insertNewlineContinueMarkup as dt,pasteURLAsLink as ct}from"@codemirror/lang-markdown";import{Strikethrough as ut}from"@lezer/markdown";import{EditorSelection as G}from"@codemirror/state";import{EditorView as Q}from"@codemirror/view";import{syntaxTree as Z}from"@codemirror/language";var V=Q.domEventHandlers({click(e,a){if(!(e.ctrlKey||e.metaKey))return!1;let d=a.posAtCoords({x:e.clientX,y:e.clientY});if(d==null)return!1;for(let c=Z(a.state).resolveInner(d,1);c;c=c.parent){let m=(c.name==="Link"||c.name==="Image")&&c.getChild("URL");if(m){let{src:h,width:f}=P(a.state.sliceDoc(m.from,m.to)),p=/^!?\[([\s\S]*?)\]/.exec(a.state.sliceDoc(c.from,c.to))?.[1]||"",g=a.state.facet(r);if(g&&!s(g,"ma-link-click",{href:h,label:p,width:f,kind:c.name,originalEvent:e}))return!0;if(h.startsWith("data:"))t("a",{href:h,download:p||"download"}).click();else{let y=i(h);if(y)window.open(y,"_blank","noopener")}return!0}}return!1},drop:(e,a)=>D(a,e,e.dataTransfer?.files,a.posAtCoords({x:e.clientX,y:e.clientY})),paste:(e,a)=>{let d=e.clipboardData?.types??[];return!(d.includes("text/plain")&&d.includes("text/html"))&&D(a,e,e.clipboardData?.files)}});function D(e,a,d,c){let m=d?.length?e.state.facet(r):null;if(!m?.uploads||m.disabled||m.readOnly)return!1;if(a.preventDefault(),c!=null)e.dispatch({selection:G.cursor(c)});return m.uploadFiles(d),!0}var X=["history","strings","keys","plugins","marks","state","attrs"],_=new Map,mt=(e)=>["extension","actions","markdown","styles"].some((a)=>(a in e)),ht=(e)=>new nt(N.data,N.parser.configure(e),[],"markdown");class w extends HTMLElement{static formAssociated=!0;static observedAttributes=["value","placeholder","rows","disabled","readonly","required","required-message","marks","hide-marks","show-marks","toolbar","uploads"];#r;#e;#v;#u=Object.fromEntries(X.map((e)=>[e,new tt]));#t;#i;#d="";#m=!1;#x=x;#h=[];#l=[];#A=[];#p=new Set;#f=[];#a=[];#M;#g={};#b={};#y=new Set;#E=!1;#c="";constructor(){super();this.#e=this.attachShadow({mode:"open",delegatesFocus:!0});try{this.#r=this.attachInternals?.()}catch{}let e=U();if(e)this.#p.add(e),this.#e.adoptedStyleSheets=[e];else this.#e.append(t("style",{textContent:H}));let a=t("div",{role:"toolbar"},"toolbar"),d=t("slot",{name:"toolbar"});this.#v=d,a.append(d),a.onmousedown=(c)=>c.preventDefault(),a.onkeydown=(c)=>{let m=this.#a,h=m.indexOf(c.target),f=h<0?void 0:{ArrowRight:h+1,ArrowLeft:h-1,Home:0,End:-1}[c.key];if(f===void 0)return;c.preventDefault(),this.#U(m.at(f%m.length),!0)},a.onclick=(c)=>{let m=c.target?.closest("[data-action]")?.dataset.action;if(m)this.exec(m)},this.#e.addEventListener("input",(c)=>c.stopPropagation()),this.#e.append(a)}#P(e){let a=this.#g[e.id],d=a?.title??e.label??e.id,c=t("button",{type:"button",title:e.hint?`${d} (${e.hint})`:d,innerHTML:e.html,ariaLabel:a?.label??e.label??d},`button button-${e.id}`);if(c.dataset.action=e.id,e.id==="mode"){let m=B[this.marks];c.innerHTML=m.html,c.title=`${d}: ${this.strings[m.label]}`}return c}#k(){let e=new Map([...z,["mode",j]]);for(let a of this.#l.flatMap((d)=>d.actions??[]))e.set(a.id,a);return e}#S(e){return e.enabled?.(this)??!0}#C(e){switch(e){case"history":return st();case"strings":return o.of(this.#b);case"keys":return I.of([...this.#k().values()].filter((a)=>a.key&&this.#S(a)).map((a)=>({key:a.key,run:()=>this.exec(a.id),preventDefault:!0})));case"plugins":return[ht([ut,...this.#l.flatMap((a)=>a.markdown??[])]),this.#l.flatMap((a)=>a.extension??[])];case"marks":return n.of(this.marks);case"state":return[v.editable.of(!this.disabled&&!this.readOnly),K.readOnly.of(this.disabled||this.readOnly)];case"attrs":return[this.placeholder?it(this.placeholder):[],v.contentAttributes.of({part:"content","aria-multiline":"true","aria-required":String(this.required)})]}}#s(...e){this.#t?.dispatch({effects:e.map((a)=>this.#u[a].reconfigure(this.#C(a)))})}#H(e){let a=(d)=>this.#u[d].of(this.#C(d));return K.create({doc:e,extensions:[a("history"),rt(),v.lineWrapping,V,r.of(this),a("strings"),a("keys"),a("plugins"),a("marks"),q,a("state"),a("attrs"),W,I.of([{key:"Enter",run:dt},{key:"Backspace",run:lt},...at,...ot]),ct,v.updateListener.of((d)=>{if(d.docChanged){if(this.#L(d.changes),!this.#m){if(this.#o(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),!d.view.hasFocus)this.#T()}}if(d.focusChanged&&!d.view.hasFocus)this.classList.add("ma-touched"),this.#T()})]})}#F(){let e=this.querySelector(":scope > textarea");if(!(e instanceof HTMLTextAreaElement))return;for(let{name:a,value:d}of e.attributes)if(a!=="class"&&!this.hasAttribute(a))this.setAttribute(a,d);return e.remove(),e.value}connectedCallback(){if(!this.#t){let e=this.#i;if(!e){let a=this.#F(),d=Array.from(this.childNodes,(c)=>c.nodeType===Node.TEXT_NODE?c.textContent:"").join("").trim();this.#d=this.getAttribute("value")??a??d,this.#c=this.#d}if(this.#t=new v({parent:this.#e,state:e??this.#H(this.#d)}),this.#i=void 0,this.#t.dom.setAttribute("part","editor"),this.#t.scrollDOM.setAttribute("part","scroller"),this.#t.contentDOM.autofocus=!0,e)this.#s(...X)}this.style.setProperty("--ma-rows",String(this.rows)),this.#n(),this.#w(),this.#o()}disconnectedCallback(){queueMicrotask(()=>{if(this.isConnected||!this.#t)return;this.#i=this.#t.state,this.#t.destroy(),this.#t=void 0})}attributeChangedCallback(e,a,d){if(!this.#t&&!this.#i)return;switch(e){case"value":this.value=d??"";break;case"rows":this.style.setProperty("--ma-rows",String(this.rows));break;case"toolbar":this.#n();break;case"placeholder":case"required":case"required-message":this.#s("attrs"),this.#o();break;case"disabled":case"readonly":this.#s("state"),this.#o();break;case"uploads":this.#s("keys"),this.#n();break;default:this.#s("marks"),this.#n()}}formResetCallback(){this.classList.remove("ma-touched"),this.value=this.getAttribute("value")??this.#d}formDisabledCallback(e){this.#E=e,this.#s("state"),this.#o()}formStateRestoreCallback(e){this.value=e}get view(){return this.#t}get value(){return(this.#t?.state??this.#i)?.doc.toString()??this.getAttribute("value")??""}set value(e){let a=this.#t?.state??this.#i;if(!a){this.setAttribute("value",e);return}if(this.#c=e,e===a.doc.toString())return;let d=a.update({changes:{from:0,to:a.doc.length,insert:e},effects:this.#u.history.reconfigure([])});if(this.#t)this.#m=!0,this.#t.dispatch(d),this.#m=!1,this.#s("history");else this.#L(d.changes),this.#i=d.state;this.#o()}get name(){return this.getAttribute("name")??""}set name(e){this.setAttribute("name",e)}get placeholder(){return this.getAttribute("placeholder")??""}set placeholder(e){this.setAttribute("placeholder",e)}get rows(){return Number(this.getAttribute("rows"))||4}set rows(e){this.setAttribute("rows",String(e))}get disabled(){return this.hasAttribute("disabled")||this.#E}set disabled(e){this.toggleAttribute("disabled",e)}get readOnly(){return this.hasAttribute("readonly")}set readOnly(e){this.toggleAttribute("readonly",e)}get required(){return this.hasAttribute("required")}set required(e){this.toggleAttribute("required",e)}get marks(){let e=this.getAttribute("marks");if(e==="auto"||e==="hide"||e==="show")return e;return this.hasAttribute("show-marks")?"show":this.hasAttribute("hide-marks")?"hide":"auto"}set marks(e){this.setAttribute("marks",e)}get hideMarks(){return this.marks==="hide"}set hideMarks(e){this.toggleAttribute("hide-marks",e)}get showMarks(){return this.marks==="show"}set showMarks(e){this.toggleAttribute("show-marks",e)}get plugins(){return this.#h}set plugins(e){if(this.#h=e?[...e]:[],this.#l=this.#h.filter(Boolean).map((a)=>typeof a==="object"&&mt(a)?a:{extension:a}),!this.#t)return;this.#s("plugins","keys"),this.#n(),this.#w()}get form(){return this.#r?.form??this.closest("form")}get validity(){return this.#r?.validity}get validationMessage(){return this.#r?.validationMessage??""}checkValidity(){return this.#r?.checkValidity()??!0}reportValidity(){return this.classList.add("ma-touched"),this.#r?.reportValidity()??!0}focus(e){this.#t?.focus(),super.focus(e)}exec(e){let a=this.#t,d=this.#k().get(e);if(!d||!a||!this.#S(d))return!1;if(this.disabled||this.readOnly&&e!=="mode")return!1;if(!s(this,"ma-action",{action:e,view:a}))return!0;for(let c of a.state.facet(l))if(c(a,e))return!0;return a.focus(),d.run(a)}adoptStyles(...e){this.#A=e,this.#w()}#w(){if(!(("adoptedStyleSheets"in this.#e)&&typeof CSSStyleSheet<"u"&&("replaceSync"in CSSStyleSheet.prototype))){for(let p of this.#f)p.remove();this.#f=this.#l.filter((p)=>typeof p.styles==="string"&&!!p.styles).map((p)=>t("style",{textContent:p.styles})),this.#e.append(...this.#f);return}let a=U(),d=[];for(let p of this.#l){if(!p.styles)continue;if(typeof p.styles==="string"){let g=_.get(p.styles);if(!g)g=new CSSStyleSheet,g.replaceSync(p.styles),_.set(p.styles,g);d.push(g)}else d.push(p.styles)}let c=this.#e.adoptedStyleSheets,m=c.filter((p)=>!this.#p.has(p)),h=[...a?[a]:[],...d,...this.#A];this.#p=new Set(h);let f=[...m,...h];if(c.length!==f.length||c.some((p,g)=>p!==f[g]))this.#e.adoptedStyleSheets=f}get uploads(){let e=this.getAttribute("uploads");return e!==null&&e!=="off"}set uploads(e){this.toggleAttribute("uploads",e)}get toolbar(){return this.getAttribute("toolbar")?.split(/\s+/).filter(Boolean)??null}set toolbar(e){if(e)this.setAttribute("toolbar",e.join(" "));else this.removeAttribute("toolbar")}get labels(){return this.#g}set labels(e){if(this.#g=e??{},this.#t)this.#n()}get strings(){return{...b,...this.#b}}set strings(e){if(this.#b=e??{},!this.#t)return;this.#s("strings"),this.#n(),this.#o()}get upload(){return this.#x}set upload(e){this.#x=e??x}get uploadUrl(){return this.getAttribute("upload-url")}set uploadUrl(e){if(e==null)this.removeAttribute("upload-url");else this.setAttribute("upload-url",e)}get csrfToken(){return this.getAttribute("csrf-token")??document.querySelector('meta[name="csrf-token"]')?.content??null}set csrfToken(e){if(e==null)this.removeAttribute("csrf-token");else this.setAttribute("csrf-token",e)}pickFiles(e="file"){if(this.disabled||this.readOnly)return;let a=t("input",{type:"file",multiple:!0,accept:e==="image"?"image/*":this.getAttribute("accept")??"*/*"});a.onchange=()=>{if(a.files?.length)this.uploadFiles(a.files,e)},a.click()}async uploadImage(e){if(!this.uploads||this.disabled||this.readOnly)return null;return C(this,async()=>(await E(this,e,"image"))?.url??null)}async uploadFiles(e,a){if(!this.#t||!this.uploads||this.disabled||this.readOnly)return;let d=Array.from(e);if(!d.length)return;let{from:c,to:m}=this.#t.state.selection.main,h={from:c,to:m};this.#y.add(h);try{let f=await C(this,()=>R(this,d,a)),p=this.#t,g=p?.state??this.#i;if(!f.length||!g||this.disabled||this.readOnly)return;let y=g.doc.length,k=Math.min(h.from,y),L=Math.min(Math.max(k,h.to),y),T=f.join(`
`),F=g.selection.main,Y=F.from===k&&F.to===L,O={changes:{from:k,to:L,insert:T},selection:Y?et.cursor(k+T.length):void 0};if(p)p.dispatch(O),p.focus();else this.#i=g.update(O).state,this.#o();s(this,"ma-uploaded",{snippets:f,files:d,view:p})}finally{this.#y.delete(h)}}#n(){for(let d of this.#a)d.remove();let e=this.#k(),a=this.toolbar??[...e.keys()].filter((d)=>d!=="mode");this.#a=a.map((d)=>e.get(d)).filter((d)=>!!d&&this.#S(d)).map((d)=>this.#P(d)),this.#v.append(...this.#a),this.#U(this.#a.find((d)=>d.dataset.action===this.#M)??this.#a[0])}#U(e,a=!1){for(let d of this.#a)d.tabIndex=d===e?0:-1;if(this.#M=e?.dataset.action,a)e?.focus()}#L(e){for(let a of this.#y)a.from=e.mapPos(a.from,1),a.to=Math.max(a.from,e.mapPos(a.to,1))}#T(){let e=this.value;if(e===this.#c)return;this.#c=e,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}#o(){if(!this.#r)return;let e=this.value;this.#r.setFormValue(e),this.#r.setValidity(this.required&&!this.disabled&&!e.trim()?{valueMissing:!0}:{},this.getAttribute("required-message")||this.strings.required,this.#t?.contentDOM)}}function M(e="mark-area"){if(typeof customElements<"u"&&!customElements.get(e))customElements.define(e,w)}
export{x,H,w,M};
