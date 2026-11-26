import{n,o,l,t,c,k,a,O,e}from"./index-78w2jvwa.js";import{h,N,g}from"./index-j86q3xj2.js";import{d,D,v,f,L}from"./index-cterptww.js";import{EditorSelection as ce}from"@codemirror/state";import{Decoration as ae,ViewPlugin as ye,keymap as Te}from"@codemirror/view";import{syntaxTree as Y}from"@codemirror/language";import{Table as xe}from"@lezer/markdown";var se=(r,i)=>{let s=/^\s*\|/.exec(r)?.[0].length??0,b=/\|\s*$/.exec(r)?.[0].length??0,w=r.length-(b&&r.trim().length>1?b:0),y=[];for(let u=s,x=s;u<=w;u++){if(u<w){if(r[u]!=="|")continue;let j=0;for(let H=u-1;H>=x&&r[H]==="\\";H--)j++;if(j%2===1)continue}let V=r.slice(x,u),q=V.trim(),U=i+x+(q?V.length-V.trimStart().length:Math.min(1,V.length));y.push({text:q,from:U,to:q?i+u-(V.length-V.trimEnd().length):U}),x=u+1}return y},Ee=(r)=>{let i=r.startsWith(":"),s=r.endsWith(":");return i&&s?"center":s?"right":i?"left":null},Ce=(r,i)=>{let s=r==="left"||r==="center",b=r==="right"||r==="center";return(s?":":"")+"-".repeat(i-+s-+b)+(b?":":"")};function R(r,i){let{doc:s}=r,b=s.lineAt(i.from),w=s.lineAt(i.to);if(w.number===b.number)return null;let y=[b];for(let H=b.number+2;H<=w.number&&s.line(H).text.trim();H++)y.push(s.line(H));let u=y.map((H)=>se(H.text,H.from)),x=s.line(b.number+1),V=se(x.text,x.from),q=Math.max(1,V.length,...u.map((H)=>H.length)),U=(H)=>Array.from({length:q},(M,P)=>H(P)),j=u.map((H,M)=>U((P)=>H[P]??{text:"",from:y[M].to,to:y[M].to}));return{from:b.from,to:w.to,headers:j[0].map((H)=>H.text),aligns:U((H)=>Ee(V[H]?.text??"")),rows:j.slice(1).map((H)=>H.map((M)=>M.text)),cellRanges:j}}function S(r){let i=[r.headers,...r.rows],s=Array.from({length:Math.max(1,r.headers.length)},(u,x)=>Math.max(3,...i.map((V)=>(V[x]??"").length))),b=(u,x)=>{let V=s[x]-u.length,q=r.aligns[x]==="right"?V:r.aligns[x]==="center"?V>>1:0;return" ".repeat(q)+u+" ".repeat(V-q)},w=(u)=>`| ${u.join(" | ")} |`,y=(u)=>w(s.map((x,V)=>b(u[V]??"",V)));return[y(r.headers),w(s.map((u,x)=>Ce(r.aligns[x]??null,u))),...r.rows.map(y)].join(`
`)}var X=(r,i)=>{let s=c(r,i,i,"Table");return s&&R(r,s)};function Z(r,i,s,b,w){if(b+=w,b>=i)b=0,s++;else if(b<0)b=i-1,s--;if(s<0)return{r:0,c:0};if(s>r.length)r.push(Array(i).fill(""));return{r:s,c:b}}var ee=(r,i,s,b)=>{if(b!==r.state.sliceDoc(i,s))r.dispatch({changes:{from:i,to:s,insert:b}})},Q=(r,i,s,b,w)=>{ee(r,i.from,i.to,S(s));let y=X(r.state,i.from)?.cellRanges[b]?.[w];if(y)r.dispatch({selection:ce.range(y.from,y.to),scrollIntoView:!0});return!0},Me=(r)=>{let{state:i}=r,s=i.selection.main.head,b=X(i,s);if(b)return Q(r,b,{...b,rows:[...b.rows,b.headers.map(()=>"")]},b.rows.length+1,0);let w=S({headers:["Col 1","Col 2"],aligns:[null,null],rows:[["",""]]});return k(r,w,(y)=>ce.range(y+2,y+7))},te=(r,i,s,b=1)=>{let w=r.doc.lineAt(s).number-r.doc.lineAt(i.from).number,y=Math.min(i.cellRanges.length-1,w===0?0:w===1?b:w-1),u=0;return i.cellRanges[y].forEach((x,V)=>s>=x.from-1&&(u=V)),{row:y,col:u}},le=(r)=>(i)=>{let{state:s}=i,b=s.selection.main.head,w=X(s,b);if(!w)return!1;let{row:y,col:u}=te(s,w,b,+(r>0)),x=w.rows.map((q)=>[...q]),V=Z(x,w.headers.length,y,u,r);return Q(i,w,{...w,rows:x},V.r,V.c)},F={id:"table",run:Me,key:"Mod-Alt-t",hint:a+O+"T",html:e("M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5")},ie=(r)=>{let i=[],{doc:s}=r.state;for(let{from:b,to:w}of r.visibleRanges)Y(r.state).iterate({from:b,to:w,enter({name:y,from:u,to:x}){if(y==="Table")for(let V=s.lineAt(u).number,q=s.lineAt(x).number;V<=q;V++)i.push(ae.line({class:"cm-table-line"}).range(s.line(V).from));else if(y==="TableHeader")i.push(g("cm-strong").range(u,x));else if(y==="TableDelimiter")i.push(g("cm-mark").range(u,x))}});return ae.set(i,!0)},A=[Te.of([{key:"Tab",run:le(1)},{key:"Shift-Tab",run:le(-1)}]),ye.fromClass(class{decorations;constructor(r){this.decorations=ie(r)}update(r){if(r.docChanged||r.viewportChanged||r.selectionSet||Y(r.state)!==Y(r.startState))this.decorations=ie(r.view)}},{decorations:(r)=>r.decorations})],Ae=`
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
`,m=(...r)=>({markdown:xe,actions:[F],extension:r,styles:Ae});import{EditorSelection as ke,StateField as De}from"@codemirror/state";import{Decoration as B,EditorView as ue,ViewPlugin as ve,WidgetType as fe}from"@codemirror/view";import{syntaxTree as ne}from"@codemirror/language";var oe=[null,"left","center","right"],E=[{id:"row-add",title:"Add row",label:"+ Row",run:(r)=>({...r,rows:[...r.rows,r.headers.map(()=>"")],focus:{r:r.rows.length+1,c:0}})},{id:"row-remove",title:"Remove last row",label:"- Row",run:(r)=>({...r,rows:r.rows.length>1?r.rows.slice(0,-1):r.rows})},{id:"col-add",title:"Add column",label:"+ Col",run:(r)=>({headers:[...r.headers,`Col ${r.headers.length+1}`],aligns:[...r.aligns,null],rows:r.rows.map((i)=>[...i,""]),focus:{r:0,c:r.headers.length}})},{id:"col-remove",title:"Remove last column",label:"- Col",run:(r)=>r.headers.length>1?{headers:r.headers.slice(0,-1),aligns:r.aligns.slice(0,-1),rows:r.rows.map((i)=>i.slice(0,-1))}:r},{id:"align",title:"Cycle alignment of the selected column",label:"Align",run:(r,i,s)=>{let b=[...r.aligns];return b[i]=oe[(oe.indexOf(b[i]??null)+1)%oe.length],{...r,aligns:b,...s>=0&&{focus:{r:s,c:i}}}}}],pe=(r,i,s="")=>{let b=t("div",{className:"cm-table-controls "+s},"table-controls");for(let w of r){let y=t("button",{type:"button",tabIndex:-1,className:"cm-table-btn",textContent:w.label,title:w.title,ariaLabel:w.title},"table-button");y.dataset.tableAction=w.id,y.onmousedown=(u)=>(u.preventDefault(),u.stopPropagation()),y.onclick=(u)=>{u.preventDefault(),u.stopPropagation(),i(w)},b.append(y)}return b};class ge extends fe{items;constructor(r){super();this.items=r}eq(r){return r.items===this.items}toDOM(r){return pe(this.items,(i)=>{let s=r.state.selection.main.head,b=!r.state.readOnly&&X(r.state,s);if(!b)return;let{row:w,col:y}=te(r.state,b,s),u=i.run(b,y,w);Q(r,b,u,u.focus?.r??w,u.focus?.c??y),r.focus()},"cm-table-controls-raw")}}var T=(r=E)=>De.define({create:(i)=>me(i,r),update:(i,s)=>s.docChanged||s.selection||s.reconfigured?me(s.state,r):i,provide:(i)=>ue.decorations.from(i)}),me=(r,i)=>{let s=!r.readOnly&&X(r,r.selection.main.head);return s?B.set(B.widget({widget:new ge(i),block:!0,side:1}).range(s.to)):B.none},Se=(r)=>r.replace(/(\\*)(\|)/g,(i,s)=>s.length%2?`${s}|`:`${s}\\|`),de=(r,i)=>{r.textContent="",v(i,r,{linkClass:"cm-link",codeClass:"cm-code",unescapePipes:!0})},Re=(r)=>r.state.facet(n)==="show",he=(r)=>r.state.facet(n)==="hide";function Ve(r,i){let s=d(r.dom),b=s?.anchorNode,w=b&&r.dom.contains(b)?(b instanceof HTMLElement?b:b.parentElement)?.closest(".cm-table-wysiwyg [data-row]"):null;if(!s||!w)return!1;return L(w,s,i,he(r),r.state.facet(o).linkPrompt,{linkClass:"cm-link",codeClass:"cm-code"})}var be=(r,i,s,b)=>{let w=[...r.headers],y=r.rows.map((u)=>[...u]);if(i===0)w[s]=b;else if(y[i-1])y[i-1][s]=b;return{headers:w,aligns:r.aligns,rows:y}},Oe=(r,i,{r:s,c:b,offset:w})=>requestAnimationFrame(()=>{if(!r.dom.isConnected)return;let y=null;for(let q of r.dom.querySelectorAll(".cm-table-wysiwyg"))if(r.posAtDOM(q)===i){y=q;break}let u=y?.querySelector(`[data-row="${s}"][data-col="${b}"]`);if(!u)return;u.focus();let x=d(u);if(!x)return;x.selectAllChildren(u),x.collapseToEnd();let V=u.firstChild;if(w!==void 0&&V?.nodeType===Node.TEXT_NODE)x.collapse(V,Math.min(w,V.textContent.length))});class we extends fe{raw;t;interactive;toolbar;hide;show;readOnly;constructor(r,i,s,b,w,y,u){super();this.raw=r;this.t=i;this.interactive=s;this.toolbar=b;this.hide=w;this.show=y;this.readOnly=u}eq(r){return this.raw===r.raw&&this.interactive===r.interactive&&this.hide===r.hide&&this.show===r.show&&this.readOnly===r.readOnly}toDOM(r){let{headers:i,aligns:s,rows:b}=this.t,w=t("div",{className:"cm-table-widget"+(this.interactive?" cm-table-wysiwyg":"")},"table-wrap"),y=()=>X(r.state,r.posAtDOM(w)),u=(M)=>{let P=!r.state.readOnly&&y();if(!P)return;let I=M(P);if(ee(r,P.from,P.to,S(I)),I.focus)Oe(r,P.from,I.focus)},x=null,V=(M,P,I)=>{let _=d(M);if(_?.anchorNode&&M.contains(_.anchorNode))x={r:P,c:I,offset:D(M,_.anchorNode,_.anchorOffset)}},q=(M,P,I,_)=>{if(s[I])M.style.textAlign=s[I];if(M.dataset.row=String(P),M.dataset.col=String(I),this.show)M.textContent=_;else de(M,_);if(!this.interactive){M.onmousedown=(W)=>{if(r.state.readOnly)return;W.preventDefault();let z=y()?.cellRanges[P]?.[I];if(!z)return;r.dispatch({selection:ke.range(z.from,z.to)}),r.focus()};return}let K=()=>Se(this.hide?f(M," "):M.textContent??"").replace(/\n+/g," ").trim();M.contentEditable=String(!r.state.readOnly),M.spellcheck=!1,M.onfocus=()=>{if(x={r:P,c:I,offset:x?.r===P&&x.c===I?x.offset:_.length},!this.hide&&M.textContent!==_)M.textContent=_},M.onmousedown=(W)=>W.stopPropagation(),M.onkeyup=M.onmouseup=()=>V(M,P,I),M.onkeydown=(W)=>{if(W.stopPropagation(),W.key==="Escape")W.preventDefault(),M.blur(),r.focus();else if(W.key==="Tab"||W.key==="Enter")W.preventDefault(),u((z)=>{let G=be(z,P,I,K());if(W.key==="Tab")return{...G,focus:Z(G.rows,G.headers.length,P,I,W.shiftKey?-1:1)};if(P===G.rows.length)G.rows.push(G.headers.map(()=>""));return{...G,focus:{r:P+1,c:I}}})},M.onblur=()=>{V(M,P,I);let W=K();if(W!==_)u((z)=>be(z,P,I,W));else if(!this.show)de(M,W)}},U=t("table",{className:"cm-table"},"table"),j=t("thead"),H=t("tbody");if([i,...b].forEach((M,P)=>{let I=t("tr");M.forEach((_,K)=>{let W=t(P?"td":"th",{},P?"table-td":"table-th");q(W,P,K,_),I.append(W)}),(P?H:j).append(I)}),U.append(j,H),w.append(U),this.interactive&&!r.state.readOnly)w.append(pe(this.toolbar,(M)=>{let{c:P=0,r:I=-1,offset:_}=x??{};u((K)=>{let W=M.run(K,P,I);if(W.focus?.r===I&&W.focus.c===P)W.focus.offset=_;return W})}));return w}}var C=(r,i=E)=>[r?l.of(Ve):[],ve.fromClass(class{decorations=B.none;atomic=B.none;constructor(s){this.build(s)}update(s){if(s.docChanged||s.viewportChanged||s.selectionSet||s.focusChanged||s.transactions.some((b)=>b.reconfigured)||ne(s.state)!==ne(s.startState))this.build(s.view)}build(s){let b=[],w=[],{state:y}=s,{doc:u}=y,x=Re(s),V=(q,U)=>!r&&(x||h(y,s.hasFocus,q,U));for(let{from:q,to:U}of s.visibleRanges)ne(y).iterate({from:q,to:U,enter({name:j,from:H,to:M,node:P}){if(j!=="Table")return;let I=!V(H,M)&&R(y,P);if(!I)return!1;let _=u.lineAt(I.from),K=new we(y.sliceDoc(I.from,I.to),I,r,i,he(s),x,y.readOnly),W=B.replace({widget:K}).range(_.from,_.to);b.push(W),w.push(W);for(let z=_.number+1,G=u.lineAt(I.to).number;z<=G;z++){let J=u.line(z);if(b.push(B.line({class:"cm-table-hidden-line"}).range(J.from)),J.from<J.to){let re=N.range(J.from,J.to);b.push(re),w.push(re)}}return!1}});this.decorations=B.set(b,!0),this.atomic=B.set(w,!0)}},{decorations:(s)=>s.decorations,provide:(s)=>ue.atomicRanges.of((b)=>b.plugin(s)?.atomic??B.none)})],p=(r={})=>(r.toolbar??E).map((i)=>({...i,...r.labels?.[i.id]}));
export{R,S,F,A,m,E,T,C,p};
