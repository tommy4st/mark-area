import{n,o,l,u,t,c,x,a,B,e}from"./index-b3rd2vp2.js";import{g,O,b}from"./index-9zvpc96f.js";import{d,N,L,h,P}from"./index-g964cep7.js";import{EditorSelection as me}from"@codemirror/state";import{Decoration as se,ViewPlugin as Te,keymap as xe}from"@codemirror/view";import{syntaxTree as Z}from"@codemirror/language";import{Table as Ee}from"@lezer/markdown";var le=(r,i)=>{let s=/^\s*\|/.exec(r)?.[0].length??0,f=/\|\s*$/.exec(r)?.[0].length??0,w=r.length-(f&&r.trim().length>1?f:0),y=[];for(let A=s,M=s;A<=w;A++){if(A<w){if(r[A]!=="|")continue;let j=0;for(let H=A-1;H>=M&&r[H]==="\\";H--)j++;if(j%2===1)continue}let k=r.slice(M,A),F=k.trim(),U=i+M+(F?k.length-k.trimStart().length:Math.min(1,k.length));y.push({text:F,from:U,to:F?i+A-(k.length-k.trimEnd().length):U}),M=A+1}return y},Ce=(r)=>{let i=r.startsWith(":"),s=r.endsWith(":");return i&&s?"center":s?"right":i?"left":null},Ae=(r,i)=>{let s=r==="left"||r==="center",f=r==="right"||r==="center";return(s?":":"")+"-".repeat(i-+s-+f)+(f?":":"")};function D(r,i){let{doc:s}=r,f=s.lineAt(i.from),w=s.lineAt(i.to);if(w.number===f.number)return null;let y=[f];for(let H=f.number+2;H<=w.number&&s.line(H).text.trim();H++)y.push(s.line(H));let A=y.map((H)=>le(H.text,H.from)),M=s.line(f.number+1),k=le(M.text,M.from),F=Math.max(1,k.length,...A.map((H)=>H.length)),U=(H)=>Array.from({length:F},(R,V)=>H(V)),j=A.map((H,R)=>U((V)=>H[V]??{text:"",from:y[R].to,to:y[R].to}));return{from:f.from,to:w.to,headers:j[0].map((H)=>H.text),aligns:U((H)=>Ce(k[H]?.text??"")),rows:j.slice(1).map((H)=>H.map((R)=>R.text)),cellRanges:j}}function S(r){let i=[r.headers,...r.rows],s=Array.from({length:Math.max(1,r.headers.length)},(A,M)=>Math.max(3,...i.map((k)=>(k[M]??"").length))),f=(A,M)=>{let k=s[M]-A.length,F=r.aligns[M]==="right"?k:r.aligns[M]==="center"?k>>1:0;return" ".repeat(F)+A+" ".repeat(k-F)},w=(A)=>`| ${A.join(" | ")} |`,y=(A)=>w(s.map((M,k)=>f(A[k]??"",k)));return[y(r.headers),w(s.map((A,M)=>Ae(r.aligns[M]??null,A))),...r.rows.map(y)].join(`
`)}var J=(r,i)=>{let s=c(r,i,i,"Table");return s&&D(r,s)};function ee(r,i,s,f,w){if(f+=w,f>=i)f=0,s++;else if(f<0)f=i-1,s--;if(s<0)return{r:0,c:0};if(s>r.length)r.push(Array(i).fill(""));return{r:s,c:f}}var te=(r,i,s,f)=>{if(f!==r.state.sliceDoc(i,s))r.dispatch({changes:{from:i,to:s,insert:f}})},Y=(r,i,s,f,w)=>{te(r,i.from,i.to,S(s));let y=J(r.state,i.from)?.cellRanges[f]?.[w];if(y)r.dispatch({selection:me.range(y.from,y.to),scrollIntoView:!0});return!0},Me=(r)=>{let{state:i}=r,s=i.selection.main.head,f=J(i,s);if(f)return Y(r,f,{...f,rows:[...f.rows,f.headers.map(()=>"")]},f.rows.length+1,0);let w=S({headers:["Col 1","Col 2"],aligns:[null,null],rows:[["",""]]});return x(r,w,(y)=>me.range(y+2,y+7))},ne=(r,i,s,f=1)=>{let w=r.doc.lineAt(s).number-r.doc.lineAt(i.from).number,y=Math.min(i.cellRanges.length-1,w===0?0:w===1?f:w-1),A=0;return i.cellRanges[y].forEach((M,k)=>s>=M.from-1&&(A=k)),{row:y,col:A}},ie=(r)=>(i)=>{let{state:s}=i,f=s.selection.main.head,w=J(s,f);if(!w)return!1;let{row:y,col:A}=ne(s,w,f,+(r>0)),M=w.rows.map((F)=>[...F]),k=ee(M,w.headers.length,y,A,r);return Y(i,w,{...w,rows:M},k.r,k.c)},q={id:"table",run:Me,key:"Mod-Alt-t",hint:a+B+"T",html:e("M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5")},ce=(r)=>{let i=[],{doc:s}=r.state;for(let{from:f,to:w}of r.visibleRanges)Z(r.state).iterate({from:f,to:w,enter({name:y,from:A,to:M}){if(y==="Table")for(let k=s.lineAt(A).number,F=s.lineAt(M).number;k<=F;k++)i.push(se.line({class:"cm-table-line"}).range(s.line(k).from));else if(y==="TableHeader")i.push(b("cm-strong").range(A,M));else if(y==="TableDelimiter")i.push(b("cm-mark").range(A,M))}});return se.set(i,!0)},E=[xe.of([{key:"Tab",run:ie(1)},{key:"Shift-Tab",run:ie(-1)}]),Te.fromClass(class{decorations;constructor(r){this.decorations=ce(r)}update(r){if(r.docChanged||r.viewportChanged||r.selectionSet||Z(r.state)!==Z(r.startState))this.decorations=ce(r.view)}},{decorations:(r)=>r.decorations})],ke=`
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
`,m=(...r)=>({markdown:Ee,actions:[q],extension:r,styles:ke});import{EditorSelection as De,StateField as ve}from"@codemirror/state";import{Decoration as G,EditorView as fe,ViewPlugin as Se,WidgetType as pe}from"@codemirror/view";import{syntaxTree as oe}from"@codemirror/language";var re=[null,"left","center","right"],T=[{id:"row-add",title:"Add row",label:"+ Row",run:(r)=>({...r,rows:[...r.rows,r.headers.map(()=>"")],focus:{r:r.rows.length+1,c:0}})},{id:"row-remove",title:"Remove last row",label:"- Row",run:(r)=>({...r,rows:r.rows.length>1?r.rows.slice(0,-1):r.rows})},{id:"col-add",title:"Add column",label:"+ Col",run:(r)=>({headers:[...r.headers,`Col ${r.headers.length+1}`],aligns:[...r.aligns,null],rows:r.rows.map((i)=>[...i,""]),focus:{r:0,c:r.headers.length}})},{id:"col-remove",title:"Remove last column",label:"- Col",run:(r)=>r.headers.length>1?{headers:r.headers.slice(0,-1),aligns:r.aligns.slice(0,-1),rows:r.rows.map((i)=>i.slice(0,-1))}:r},{id:"align",title:"Cycle alignment of the selected column",label:"Align",run:(r,i,s)=>{let f=[...r.aligns];return f[i]=re[(re.indexOf(f[i]??null)+1)%re.length],{...r,aligns:f,...s>=0&&{focus:{r:s,c:i}}}}}],he=(r,i,s,f="")=>{let w=t("div",{className:"cm-table-controls "+f},"table-controls");for(let y of r){let{label:A,title:M}={...y,...i[y.id]},k=t("button",{type:"button",tabIndex:-1,className:"cm-table-btn",textContent:A,title:M,ariaLabel:M},"table-button");k.dataset.tableAction=y.id,k.onmousedown=(F)=>(F.preventDefault(),F.stopPropagation()),k.onclick=(F)=>{F.preventDefault(),F.stopPropagation(),s(y)},w.append(k)}return w};class ge extends pe{items;labels;constructor(r,i){super();this.items=r;this.labels=i}eq(r){return r.items===this.items&&r.labels===this.labels}toDOM(r){return he(this.items,this.labels,(i)=>{let s=r.state.selection.main.head,f=!r.state.readOnly&&J(r.state,s);if(!f)return;let{row:w,col:y}=ne(r.state,f,s),A=i.run(f,y,w);Y(r,f,A,A.focus?.r??w,A.focus?.c??y),r.focus()},"cm-table-controls-raw")}}var C=(r=T)=>ve.define({create:(i)=>de(i,r),update:(i,s)=>s.docChanged||s.selection||s.reconfigured?de(s.state,r):i,provide:(i)=>fe.decorations.from(i)}),de=(r,i)=>{let s=!r.readOnly&&J(r,r.selection.main.head),f=s&&new ge(i,r.facet(u));return f?G.set(G.widget({widget:f,block:!0,side:1}).range(s.to)):G.none},Re=(r)=>r.replace(/(\\*)(\|)/g,(i,s)=>s.length%2?`${s}|`:`${s}\\|`),be=(r,i)=>{r.textContent="",L(i,r,{linkClass:"cm-link",codeClass:"cm-code",unescapePipes:!0})},Ve=(r)=>r.state.facet(n)==="show",we=(r)=>r.state.facet(n)==="hide";function Oe(r,i){let s=d(r.dom),f=s?.anchorNode,w=f&&r.dom.contains(f)?(f instanceof HTMLElement?f:f.parentElement)?.closest(".cm-table-wysiwyg [data-row]"):null;if(!s||!w)return!1;return P(w,s,i,we(r),r.state.facet(o).linkPrompt,{linkClass:"cm-link",codeClass:"cm-code"})}var ue=(r,i,s,f)=>{let w=[...r.headers],y=r.rows.map((A)=>[...A]);if(i===0)w[s]=f;else if(y[i-1])y[i-1][s]=f;return{headers:w,aligns:r.aligns,rows:y}},Pe=(r,i,{r:s,c:f,offset:w})=>requestAnimationFrame(()=>{if(!r.dom.isConnected)return;let y=null;for(let F of r.dom.querySelectorAll(".cm-table-wysiwyg"))if(r.posAtDOM(F)===i){y=F;break}let A=y?.querySelector(`[data-row="${s}"][data-col="${f}"]`);if(!A)return;A.focus();let M=d(A);if(!M)return;M.selectAllChildren(A),M.collapseToEnd();let k=A.firstChild;if(w!==void 0&&k?.nodeType===Node.TEXT_NODE)M.collapse(k,Math.min(w,k.textContent.length))});class ye extends pe{raw;t;interactive;toolbar;hide;show;readOnly;labels;constructor(r,i,s,f,w,y,A,M){super();this.raw=r;this.t=i;this.interactive=s;this.toolbar=f;this.hide=w;this.show=y;this.readOnly=A;this.labels=M}eq(r){return this.raw===r.raw&&this.interactive===r.interactive&&this.hide===r.hide&&this.show===r.show&&this.readOnly===r.readOnly&&this.labels===r.labels}toDOM(r){let{headers:i,aligns:s,rows:f}=this.t,w=t("div",{className:"cm-table-widget"+(this.interactive?" cm-table-wysiwyg":"")},"table-wrap"),y=()=>J(r.state,r.posAtDOM(w)),A=(R)=>{let V=!r.state.readOnly&&y();if(!V)return;let I=R(V);if(te(r,V.from,V.to,S(I)),I.focus)Pe(r,V.from,I.focus)},M=null,k=(R,V,I)=>{let _=d(R);if(_?.anchorNode&&R.contains(_.anchorNode))M={r:V,c:I,offset:N(R,_.anchorNode,_.anchorOffset)}},F=(R,V,I,_)=>{if(s[I])R.style.textAlign=s[I];if(R.dataset.row=String(V),R.dataset.col=String(I),this.show)R.textContent=_;else be(R,_);if(!this.interactive){R.onmousedown=(W)=>{if(r.state.readOnly)return;W.preventDefault();let z=y()?.cellRanges[V]?.[I];if(!z)return;r.dispatch({selection:De.range(z.from,z.to)}),r.focus()};return}let X=()=>Re(this.hide?h(R," "):R.textContent??"").replace(/\n+/g," ").trim();R.contentEditable=String(!r.state.readOnly),R.spellcheck=!1,R.onfocus=()=>{if(M={r:V,c:I,offset:M?.r===V&&M.c===I?M.offset:_.length},!this.hide&&R.textContent!==_)R.textContent=_},R.onmousedown=(W)=>W.stopPropagation(),R.onkeyup=R.onmouseup=()=>k(R,V,I),R.onkeydown=(W)=>{if(W.stopPropagation(),W.key==="Escape")W.preventDefault(),R.blur(),r.focus();else if(W.key==="Tab"||W.key==="Enter")W.preventDefault(),A((z)=>{let K=ue(z,V,I,X());if(W.key==="Tab")return{...K,focus:ee(K.rows,K.headers.length,V,I,W.shiftKey?-1:1)};if(V===K.rows.length)K.rows.push(K.headers.map(()=>""));return{...K,focus:{r:V+1,c:I}}})},R.onblur=()=>{k(R,V,I);let W=X();if(W!==_)A((z)=>ue(z,V,I,W));else if(!this.show)be(R,W)}},U=t("table",{className:"cm-table"},"table"),j=t("thead"),H=t("tbody");if([i,...f].forEach((R,V)=>{let I=t("tr");R.forEach((_,X)=>{let W=t(V?"td":"th",{},V?"table-td":"table-th");F(W,V,X,_),I.append(W)}),(V?H:j).append(I)}),U.append(j,H),w.append(U),this.interactive&&!r.state.readOnly)w.append(he(this.toolbar,this.labels,(R)=>{let{c:V=0,r:I=-1,offset:_}=M??{};A((X)=>{let W=R.run(X,V,I);if(W.focus?.r===I&&W.focus.c===V)W.focus.offset=_;return W})}));return w}}var v=(r,i=T)=>[r?l.of(Oe):[],Se.fromClass(class{decorations=G.none;atomic=G.none;constructor(s){this.build(s)}update(s){if(s.docChanged||s.viewportChanged||s.selectionSet||s.focusChanged||s.transactions.some((f)=>f.reconfigured)||oe(s.state)!==oe(s.startState))this.build(s.view)}build(s){let f=[],w=[],{state:y}=s,{doc:A}=y,M=Ve(s),k=(F,U)=>!r&&(M||g(y,s.hasFocus,F,U));for(let{from:F,to:U}of s.visibleRanges)oe(y).iterate({from:F,to:U,enter({name:j,from:H,to:R,node:V}){if(j!=="Table")return;let I=!k(H,R)&&D(y,V);if(!I)return!1;let _=A.lineAt(I.from),X=new ye(y.sliceDoc(I.from,I.to),I,r,i,we(s),M,y.readOnly,y.facet(u)),W=G.replace({widget:X}).range(_.from,_.to);f.push(W),w.push(W);for(let z=_.number+1,K=A.lineAt(I.to).number;z<=K;z++){let Q=A.line(z);if(f.push(G.line({class:"cm-table-hidden-line"}).range(Q.from)),Q.from<Q.to){let ae=O.range(Q.from,Q.to);f.push(ae),w.push(ae)}}return!1}});this.decorations=G.set(f,!0),this.atomic=G.set(w,!0)}},{decorations:(s)=>s.decorations,provide:(s)=>fe.atomicRanges.of((f)=>f.plugin(s)?.atomic??G.none)})],p=(r={})=>(r.toolbar??T).map((i)=>({...i,...r.labels?.[i.id]}));
export{D,S,q,E,m,T,C,v,p};
