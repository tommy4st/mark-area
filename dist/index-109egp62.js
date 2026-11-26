import{y,r,n,o,l,u,t,s,i,f,j,U,_}from"./index-b3rd2vp2.js";import{R,W,K}from"./index-9zvpc96f.js";var w=(e)=>new Promise((a,d)=>{let c=new FileReader;c.onload=()=>a({url:String(c.result),name:e.name}),c.onerror=()=>d(c.error??Error("Failed to read file")),c.readAsDataURL(e)});async function G(e,a,d,c){let m=new FormData;m.append("file",d),m.append("kind",c);let h=await fetch(e,{method:"POST",body:m,credentials:"same-origin",headers:{Accept:"application/json",...a?{"X-CSRF-Token":a}:{}}});if(!h.ok){let p=await h.text().catch(()=>""),b=p.trim();try{let k=JSON.parse(p);b=k.error??k.message??b}catch{}throw Error(b||`Upload failed: ${h.status} ${h.statusText}`)}return(h.headers.get("content-type")??"").includes("json")?await h.json():(await h.text()).trim()}async function C(e,a,d){let c={file:a,kind:d,result:void 0};if(!s(e,"ma-upload",c))return null;try{let m=e.upload===w?e.uploadUrl:null,h=null;if(m){let S=!1;try{S=new URL(m,location.href).origin===location.origin}catch{}h=e.hasAttribute("csrf-token")||S?e.csrfToken:null}let g=await(c.result??(m?G(m,h,a,d):e.upload(a,d))),b=(typeof g==="string"?g:g?.url)?.replace(/[\r\n]+/g,"").trim();if(!b)throw Error("Upload returned no URL");let k=typeof g==="object"&&g.name||a.name||"file";return{url:b,name:k.replace(/[\[\]\\\r\n]+/g," ").trim()||"file"}}catch(m){let h=m instanceof Error?m:Error(String(m));if(e.toggleAttribute("upload-error",!0),s(e,"ma-upload-error",{file:a,kind:d,error:h}))console.error(`mark-area: upload of "${a.name}" failed`,h);return null}}var v=new WeakMap;async function L(e,a){let d=(v.get(e)??0)+1;v.set(e,d),e.toggleAttribute("uploading",!0),e.toggleAttribute("upload-error",!1);try{return await a()}finally{let c=(v.get(e)??1)-1;if(c<=0)v.delete(e),e.toggleAttribute("uploading",!1);else v.set(e,c)}}async function z(e,a,d){let c=[];for(let m of a){let h=d==="image"||d!=="file"&&m.type.startsWith("image/")?"image":"file",g=await C(e,m,h);if(g)c.push(`${h==="image"?"!":""}[${g.name}](${f(g.url)})`)}return c}var H=`
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
`,E=null;function T(){if(!E&&typeof CSSStyleSheet<"u"&&"replaceSync"in CSSStyleSheet.prototype)E=new CSSStyleSheet,E.replaceSync(`
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
`);return E}import{Compartment as et,EditorSelection as rt,EditorState as I}from"@codemirror/state";import{EditorView as x,drawSelection as it,keymap as B,placeholder as st}from"@codemirror/view";import{history as ot,historyKeymap as at,standardKeymap as nt}from"@codemirror/commands";import{Language as lt}from"@codemirror/language";import{commonmarkLanguage as N,deleteMarkupBackward as dt,insertNewlineContinueMarkup as ct,pasteURLAsLink as ut}from"@codemirror/lang-markdown";import{Strikethrough as mt}from"@lezer/markdown";import{EditorSelection as Q}from"@codemirror/state";import{EditorView as Z}from"@codemirror/view";import{syntaxTree as tt}from"@codemirror/language";var V=Z.domEventHandlers({click(e,a){if(!(e.ctrlKey||e.metaKey))return!1;let d=a.posAtCoords({x:e.clientX,y:e.clientY});if(d==null)return!1;for(let c=tt(a.state).resolveInner(d,1);c;c=c.parent){let m=(c.name==="Link"||c.name==="Image")&&c.getChild("URL");if(m){let{src:h,width:g}=R(a.state.sliceDoc(m.from,m.to)),p=/^!?\[([\s\S]*?)\]/.exec(a.state.sliceDoc(c.from,c.to))?.[1]||"",b=a.state.facet(r);if(b&&!s(b,"ma-link-click",{href:h,label:p,width:g,kind:c.name,originalEvent:e}))return!0;if(h.startsWith("data:"))t("a",{href:h,download:p||"download"}).click();else{let k=i(h);if(k)window.open(k,"_blank","noopener")}return!0}}return!1},drop:(e,a)=>D(a,e,e.dataTransfer?.files,a.posAtCoords({x:e.clientX,y:e.clientY})),paste:(e,a)=>{let d=e.clipboardData?.types??[];return!(d.includes("text/plain")&&d.includes("text/html"))&&D(a,e,e.clipboardData?.files)}});function D(e,a,d,c){let m=d?.length?e.state.facet(r):null;if(!m?.uploads||m.disabled||m.readOnly)return!1;if(a.preventDefault(),c!=null)e.dispatch({selection:Q.cursor(c)});return m.uploadFiles(d),!0}var X=["history","strings","keys","plugins","marks","state","attrs"],Y=new Map,ht=(e)=>["extension","actions","markdown","styles"].some((a)=>(a in e)),pt=(e)=>new lt(N.data,N.parser.configure(e),[],"markdown");class M extends HTMLElement{static formAssociated=!0;static observedAttributes=["value","placeholder","rows","disabled","readonly","required","required-message","marks","hide-marks","show-marks","toolbar","uploads"];#i;#e;#v;#m=Object.fromEntries(X.map((e)=>[e,new et]));#t;#s;#d="";#h=!1;#x=w;#p=[];#l=[];#A=[];#f=new Set;#g=[];#a=[];#M;#c={};#b={};#y=new Set;#E=!1;#u="";constructor(){super();this.#e=this.attachShadow({mode:"open",delegatesFocus:!0});try{this.#i=this.attachInternals?.()}catch{}let e=T();if(e)this.#f.add(e),this.#e.adoptedStyleSheets=[e];else this.#e.append(t("style",{textContent:H}));let a=t("div",{role:"toolbar"},"toolbar"),d=t("slot",{name:"toolbar"});this.#v=d,a.append(d),a.onmousedown=(c)=>c.preventDefault(),a.onkeydown=(c)=>{let m=this.#a,h=m.indexOf(c.target),g=h<0?void 0:{ArrowRight:h+1,ArrowLeft:h-1,Home:0,End:-1}[c.key];if(g===void 0)return;c.preventDefault(),this.#U(m.at(g%m.length),!0)},a.onclick=(c)=>{let m=c.target?.closest("[data-action]")?.dataset.action;if(m)this.exec(m)},this.#e.addEventListener("input",(c)=>c.stopPropagation()),this.#e.append(a)}#P(e){let a=this.#c[e.id],d=a?.title??e.label??e.id,c=t("button",{type:"button",title:e.hint?`${d} (${e.hint})`:d,innerHTML:e.html,ariaLabel:a?.label??e.label??d},`button button-${e.id}`);if(c.dataset.action=e.id,e.id==="mode"){let m=U[this.marks];c.innerHTML=m.html,c.title=`${d}: ${this.strings[m.label]}`}return c}#k(){let e=new Map([...j,["mode",_]]);for(let a of this.#l.flatMap((d)=>d.actions??[]))e.set(a.id,a);return e}#S(e){return e.enabled?.(this)??!0}#C(e){switch(e){case"history":return ot();case"strings":return[o.of(this.#b),u.of(this.#c)];case"keys":return B.of([...this.#k().values()].filter((a)=>a.key&&this.#S(a)).map((a)=>({key:a.key,run:()=>this.exec(a.id),preventDefault:!0})));case"plugins":return[pt([mt,...this.#l.flatMap((a)=>a.markdown??[])]),this.#l.flatMap((a)=>a.extension??[])];case"marks":return n.of(this.marks);case"state":return[x.editable.of(!this.disabled&&!this.readOnly),I.readOnly.of(this.disabled||this.readOnly)];case"attrs":return[this.placeholder?st(this.placeholder):[],x.contentAttributes.of({part:"content","aria-multiline":"true","aria-required":String(this.required)})]}}#r(...e){this.#t?.dispatch({effects:e.map((a)=>this.#m[a].reconfigure(this.#C(a)))})}#H(e){let a=(d)=>this.#m[d].of(this.#C(d));return I.create({doc:e,extensions:[a("history"),it(),x.lineWrapping,V,r.of(this),a("strings"),a("keys"),a("plugins"),a("marks"),W,a("state"),a("attrs"),K,B.of([{key:"Enter",run:ct},{key:"Backspace",run:dt},...nt,...at]),ut,x.updateListener.of((d)=>{if(d.docChanged){if(this.#L(d.changes),!this.#h){if(this.#o(),this.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),!d.view.hasFocus)this.#T()}}if(d.focusChanged&&!d.view.hasFocus)this.classList.add("ma-touched"),this.#T()})]})}#F(){let e=this.querySelector(":scope > textarea");if(!(e instanceof HTMLTextAreaElement))return;for(let{name:a,value:d}of e.attributes)if(a!=="class"&&!this.hasAttribute(a))this.setAttribute(a,d);return e.remove(),e.value}connectedCallback(){if(!this.#t){let e=this.#s;if(!e){let a=this.#F(),d=Array.from(this.childNodes,(c)=>c.nodeType===Node.TEXT_NODE?c.textContent:"").join("").trim();this.#d=this.getAttribute("value")??a??d,this.#u=this.#d}if(this.#t=new x({parent:this.#e,state:e??this.#H(this.#d)}),this.#s=void 0,this.#t.dom.setAttribute("part","editor"),this.#t.scrollDOM.setAttribute("part","scroller"),this.#t.contentDOM.autofocus=!0,e)this.#r(...X)}this.style.setProperty("--ma-rows",String(this.rows)),this.#n(),this.#w(),this.#o()}disconnectedCallback(){queueMicrotask(()=>{if(this.isConnected||!this.#t)return;this.#s=this.#t.state,this.#t.destroy(),this.#t=void 0})}attributeChangedCallback(e,a,d){if(a===d)return;if(!this.#t&&!this.#s)return;switch(e){case"value":this.value=d??"";break;case"rows":this.style.setProperty("--ma-rows",String(this.rows));break;case"toolbar":this.#n();break;case"placeholder":case"required":case"required-message":this.#r("attrs"),this.#o();break;case"disabled":case"readonly":this.#r("state"),this.#o();break;case"uploads":this.#r("keys"),this.#n();break;default:this.#r("marks"),this.#n()}}formResetCallback(){this.classList.remove("ma-touched"),this.value=this.getAttribute("value")??this.#d}formDisabledCallback(e){this.#E=e,this.#r("state"),this.#o()}formStateRestoreCallback(e){this.value=e}get view(){return this.#t}get value(){return(this.#t?.state??this.#s)?.doc.toString()??this.getAttribute("value")??""}set value(e){let a=this.#t?.state??this.#s;if(!a){this.setAttribute("value",e);return}if(this.#u=e,e===a.doc.toString())return;let d=a.update({changes:{from:0,to:a.doc.length,insert:e},effects:this.#m.history.reconfigure([])});if(this.#t)this.#h=!0,this.#t.dispatch(d),this.#h=!1,this.#r("history");else this.#L(d.changes),this.#s=d.state;this.#o()}get name(){return this.getAttribute("name")??""}set name(e){this.setAttribute("name",e)}get placeholder(){return this.getAttribute("placeholder")??""}set placeholder(e){this.setAttribute("placeholder",e)}get rows(){return Number(this.getAttribute("rows"))||4}set rows(e){this.setAttribute("rows",String(e))}get disabled(){return this.hasAttribute("disabled")||this.#E}set disabled(e){this.toggleAttribute("disabled",e)}get readOnly(){return this.hasAttribute("readonly")}set readOnly(e){this.toggleAttribute("readonly",e)}get required(){return this.hasAttribute("required")}set required(e){this.toggleAttribute("required",e)}get marks(){let e=this.getAttribute("marks");if(e==="auto"||e==="hide"||e==="show")return e;return this.hasAttribute("show-marks")?"show":this.hasAttribute("hide-marks")?"hide":"auto"}set marks(e){this.setAttribute("marks",e)}get hideMarks(){return this.marks==="hide"}set hideMarks(e){this.toggleAttribute("hide-marks",e)}get showMarks(){return this.marks==="show"}set showMarks(e){this.toggleAttribute("show-marks",e)}get plugins(){return this.#p}set plugins(e){if(this.#p=e?[...e]:[],this.#l=this.#p.filter(Boolean).map((a)=>typeof a==="object"&&ht(a)?a:{extension:a}),!this.#t)return;this.#r("plugins","keys"),this.#n(),this.#w()}get form(){return this.#i?.form??this.closest("form")}get validity(){return this.#i?.validity}get validationMessage(){return this.#i?.validationMessage??""}checkValidity(){return this.#i?.checkValidity()??!0}reportValidity(){return this.classList.add("ma-touched"),this.#i?.reportValidity()??!0}focus(e){this.#t?.focus(),super.focus(e)}exec(e){let a=this.#t,d=this.#k().get(e);if(!d||!a||!this.#S(d))return!1;if(this.disabled||this.readOnly&&e!=="mode")return!1;if(!s(this,"ma-action",{action:e,view:a}))return!0;for(let c of a.state.facet(l))if(c(a,e))return!0;return a.focus(),d.run(a)}adoptStyles(...e){this.#A=e,this.#w()}#w(){if(!(("adoptedStyleSheets"in this.#e)&&typeof CSSStyleSheet<"u"&&("replaceSync"in CSSStyleSheet.prototype))){for(let p of this.#g)p.remove();this.#g=this.#l.filter((p)=>typeof p.styles==="string"&&!!p.styles).map((p)=>t("style",{textContent:p.styles})),this.#e.append(...this.#g);return}let a=T(),d=[];for(let p of this.#l){if(!p.styles)continue;if(typeof p.styles==="string"){let b=Y.get(p.styles);if(!b)b=new CSSStyleSheet,b.replaceSync(p.styles),Y.set(p.styles,b);d.push(b)}else d.push(p.styles)}let c=this.#e.adoptedStyleSheets,m=c.filter((p)=>!this.#f.has(p)),h=[...a?[a]:[],...d,...this.#A];this.#f=new Set(h);let g=[...m,...h];if(c.length!==g.length||c.some((p,b)=>p!==g[b]))this.#e.adoptedStyleSheets=g}get uploads(){let e=this.getAttribute("uploads");return e!==null&&e!=="off"}set uploads(e){this.toggleAttribute("uploads",e)}get toolbar(){return this.getAttribute("toolbar")?.split(/\s+/).filter(Boolean)??null}set toolbar(e){if(e)this.setAttribute("toolbar",e.join(" "));else this.removeAttribute("toolbar")}get labels(){return this.#c}set labels(e){if(this.#c=e??{},!this.#t)return;this.#r("strings"),this.#n()}get strings(){return{...y,...this.#b}}set strings(e){if(this.#b=e??{},!this.#t)return;this.#r("strings"),this.#n(),this.#o()}get upload(){return this.#x}set upload(e){this.#x=e??w}get uploadUrl(){return this.getAttribute("upload-url")}set uploadUrl(e){if(e==null)this.removeAttribute("upload-url");else this.setAttribute("upload-url",e)}get csrfToken(){return this.getAttribute("csrf-token")??document.querySelector('meta[name="csrf-token"]')?.content??null}set csrfToken(e){if(e==null)this.removeAttribute("csrf-token");else this.setAttribute("csrf-token",e)}pickFiles(e="file"){if(this.disabled||this.readOnly)return;let a=t("input",{type:"file",multiple:!0,accept:e==="image"?"image/*":this.getAttribute("accept")??"*/*"});a.onchange=()=>{if(a.files?.length)this.uploadFiles(a.files,e)},a.click()}async uploadImage(e){if(!this.uploads||this.disabled||this.readOnly)return null;return L(this,async()=>(await C(this,e,"image"))?.url??null)}async uploadFiles(e,a){if(!this.#t||!this.uploads||this.disabled||this.readOnly)return;let d=Array.from(e);if(!d.length)return;let{from:c,to:m}=this.#t.state.selection.main,h={from:c,to:m};this.#y.add(h);try{let g=await L(this,()=>z(this,d,a)),p=this.#t,b=p?.state??this.#s;if(!g.length||!b||this.disabled||this.readOnly)return;let k=b.doc.length,S=Math.min(h.from,k),P=Math.min(Math.max(S,h.to),k),F=g.join(`
`),O=b.selection.main,J=O.from===S&&O.to===P,q={changes:{from:S,to:P,insert:F},selection:J?rt.cursor(S+F.length):void 0};if(p)p.dispatch(q),p.focus();else this.#s=b.update(q).state,this.#o();s(this,"ma-uploaded",{snippets:g,files:d,view:p})}finally{this.#y.delete(h)}}#n(){for(let d of this.#a)d.remove();let e=this.#k(),a=this.toolbar??[...e.keys()].filter((d)=>d!=="mode");this.#a=a.map((d)=>e.get(d)).filter((d)=>!!d&&this.#S(d)).map((d)=>this.#P(d)),this.#v.append(...this.#a),this.#U(this.#a.find((d)=>d.dataset.action===this.#M)??this.#a[0])}#U(e,a=!1){for(let d of this.#a)d.tabIndex=d===e?0:-1;if(this.#M=e?.dataset.action,a)e?.focus()}#L(e){for(let a of this.#y)a.from=e.mapPos(a.from,1),a.to=Math.max(a.from,e.mapPos(a.to,1))}#T(){let e=this.value;if(e===this.#u)return;this.#u=e,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}#o(){if(!this.#i)return;let e=this.value;this.#i.setFormValue(e),this.#i.setValidity(this.required&&!this.disabled&&!e.trim()?{valueMissing:!0}:{},this.getAttribute("required-message")||this.strings.required,this.#t?.contentDOM)}}function A(e="mark-area"){if(typeof customElements<"u"&&!customElements.get(e))customElements.define(e,M)}
export{w,H,M,A};
