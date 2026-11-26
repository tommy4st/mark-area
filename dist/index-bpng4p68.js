import{n,o,l,t,c,g,a,D,e}from"./index-vpjssw8h.js";import{N,u}from"./index-fay2d9ap.js";import{d,L,E,f,T}from"./index-y2gdknrv.js";import{EditorSelection as le}from"@codemirror/state";import{Decoration as ne,ViewPlugin as he,keymap as we}from"@codemirror/view";import{syntaxTree as Q}from"@codemirror/language";import{Table as ye}from"@lezer/markdown";var re=(r,i)=>{let s=/^\s*\|/.exec(r)?.[0].length??0,b=/\|\s*$/.exec(r)?.[0].length??0,y=r.length-(b&&r.trim().length>1?b:0),k=[];for(let h=s,v=s;h<=y;h++){if(h<y){if(r[h]!=="|")continue;let H=0;for(let _=h-1;_>=v&&r[_]==="\\";_--)H++;if(H%2===1)continue}let O=r.slice(v,h),W=O.trim(),U=i+v+(W?O.length-O.trimStart().length:Math.min(1,O.length));k.push({text:W,from:U,to:W?i+h-(O.length-O.trimEnd().length):U}),v=h+1}return k},Te=(r)=>{let i=r.startsWith(":"),s=r.endsWith(":");return i&&s?"center":s?"right":i?"left":null},xe=(r,i)=>{let s=r==="left"||r==="center",b=r==="right"||r==="center";return(s?":":"")+"-".repeat(i-+s-+b)+(b?":":"")};function C(r,i){let{doc:s}=r,b=s.lineAt(i.from),y=s.lineAt(i.to);if(y.number===b.number)return null;let k=[b];for(let H=b.number+2;H<=y.number&&s.line(H).text.trim();H++)k.push(s.line(H));let h=k.map((H)=>re(H.text,H.from)),v=s.line(b.number+1),O=re(v.text,v.from),W=(H)=>Array.from({length:Math.max(1,h[0].length,O.length)},(_,R)=>H(R)),U=h.map((H,_)=>W((R)=>H[R]??{text:"",from:k[_].to,to:k[_].to}));return{from:b.from,to:y.to,headers:U[0].map((H)=>H.text),aligns:W((H)=>Te(O[H]?.text??"")),rows:U.slice(1).map((H)=>H.map((_)=>_.text)),cellRanges:U}}function x(r){let i=[r.headers,...r.rows],s=Array.from({length:Math.max(1,r.headers.length)},(h,v)=>Math.max(3,...i.map((O)=>(O[v]??"").length))),b=(h,v)=>{let O=s[v]-h.length,W=r.aligns[v]==="right"?O:r.aligns[v]==="center"?O>>1:0;return" ".repeat(W)+h+" ".repeat(O-W)},y=(h)=>`| ${h.join(" | ")} |`,k=(h)=>y(s.map((v,O)=>b(h[O]??"",O)));return[k(r.headers),y(s.map((h,v)=>xe(r.aligns[v]??null,h))),...r.rows.map(k)].join(`
`)}var K=(r,i)=>{let s=c(r,i,i,"Table");return s&&C(r,s)};function Y(r,i,s,b,y){if(b+=y,b>=i)b=0,s++;else if(b<0)b=i-1,s--;if(s<0)return{r:0,c:0};if(s>r.length)r.push(Array(i).fill(""));return{r:s,c:b}}var J=(r,i,s,b,y)=>{r.dispatch({changes:{from:i.from,to:i.to,insert:x(s)}});let k=K(r.state,i.from)?.cellRanges[b]?.[y];if(k)r.dispatch({selection:le.range(k.from,k.to),scrollIntoView:!0});return!0},Ee=(r)=>{let{state:i}=r,s=i.selection.main.head,b=K(i,s);if(b)return J(r,b,{...b,rows:[...b.rows,b.headers.map(()=>"")]},b.rows.length+1,0);let y=x({headers:["Col 1","Col 2"],aligns:[null,null],rows:[["",""]]});return g(r,y,(k)=>le.range(k+2,k+7))},Z=(r,i,s,b=1)=>{let y=r.doc.lineAt(s).number-r.doc.lineAt(i.from).number,k=Math.min(i.cellRanges.length-1,y===0?0:y===1?b:y-1),h=0;return i.cellRanges[k].forEach((v,O)=>s>=v.from-1&&(h=O)),{row:k,col:h}},ae=(r)=>(i)=>{let{state:s}=i,b=s.selection.main.head,y=K(s,b);if(!y)return!1;let{row:k,col:h}=Z(s,y,b,+(r>0)),v=y.rows.map((W)=>[...W]),O=Y(v,y.headers.length,k,h,r);return J(i,y,{...y,rows:v},O.r,O.c)},V={id:"table",run:Ee,key:"Mod-Alt-t",hint:a+D+"T",html:e("M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5")},se=(r)=>{let i=[],{doc:s}=r.state;for(let{from:b,to:y}of r.visibleRanges)Q(r.state).iterate({from:b,to:y,enter({name:k,from:h,to:v}){if(k==="Table")for(let O=s.lineAt(h).number,W=s.lineAt(v).number;O<=W;O++)i.push(ne.line({class:"cm-table-line"}).range(s.line(O).from));else if(k==="TableHeader")i.push(u("cm-strong").range(h,v));else if(k==="TableDelimiter")i.push(u("cm-mark").range(h,v))}});return ne.set(i,!0)},w=[we.of([{key:"Tab",run:ae(1)},{key:"Shift-Tab",run:ae(-1)}]),he.fromClass(class{decorations;constructor(r){this.decorations=se(r)}update(r){if(r.docChanged||r.viewportChanged||r.selectionSet||Q(r.state)!==Q(r.startState))this.decorations=se(r.view)}},{decorations:(r)=>r.decorations})],Ce=`
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
`,m=(...r)=>({markdown:ye,actions:[V],extension:r,styles:Ce});import{EditorSelection as Me,StateField as Ae}from"@codemirror/state";import{Decoration as z,EditorView as de,ViewPlugin as ke,WidgetType as be}from"@codemirror/view";import{syntaxTree as ee}from"@codemirror/language";var te=[null,"left","center","right"],M=[{id:"row-add",title:"Add row",label:"+ Row",run:(r)=>({...r,rows:[...r.rows,r.headers.map(()=>"")],focus:{r:r.rows.length+1,c:0}})},{id:"row-remove",title:"Remove last row",label:"- Row",run:(r)=>({...r,rows:r.rows.length>1?r.rows.slice(0,-1):r.rows})},{id:"col-add",title:"Add column",label:"+ Col",run:(r)=>({headers:[...r.headers,`Col ${r.headers.length+1}`],aligns:[...r.aligns,null],rows:r.rows.map((i)=>[...i,""]),focus:{r:0,c:r.headers.length}})},{id:"col-remove",title:"Remove last column",label:"- Col",run:(r)=>r.headers.length>1?{headers:r.headers.slice(0,-1),aligns:r.aligns.slice(0,-1),rows:r.rows.map((i)=>i.slice(0,-1))}:r},{id:"align",title:"Cycle alignment of the selected column",label:"Align",run:(r,i,s)=>{let b=[...r.aligns];return b[i]=te[(te.indexOf(b[i]??null)+1)%te.length],{...r,aligns:b,...s>=0&&{focus:{r:s,c:i}}}}}],ue=(r,i,s="")=>{let b=t("div",{className:"cm-table-controls "+s},"table-controls");for(let y of r){let k=t("button",{type:"button",tabIndex:-1,className:"cm-table-btn",textContent:y.label,title:y.title,ariaLabel:y.title},"table-button");k.dataset.tableAction=y.id,k.onmousedown=(h)=>(h.preventDefault(),h.stopPropagation()),k.onclick=(h)=>{h.preventDefault(),h.stopPropagation(),i(y)},b.append(k)}return b};class fe extends be{items;constructor(r){super();this.items=r}eq(r){return r.items===this.items}toDOM(r){return ue(this.items,(i)=>{let s=r.state.selection.main.head,b=!r.state.readOnly&&K(r.state,s);if(!b)return;let{row:y,col:k}=Z(r.state,b,s),h=i.run(b,k,y);J(r,b,h,h.focus?.r??y,h.focus?.c??k),r.focus()},"cm-table-controls-raw")}}var S=(r=M)=>Ae.define({create:(i)=>ie(i,r),update:(i,s)=>s.docChanged||s.selection||s.reconfigured?ie(s.state,r):i,provide:(i)=>de.decorations.from(i)}),ie=(r,i)=>{let s=!r.readOnly&&K(r,r.selection.main.head);return s?z.set(z.widget({widget:new fe(i),block:!0,side:1}).range(s.to)):z.none},De=(r)=>r.replace(/(\\*)(\|)/g,(i,s)=>s.length%2?`${s}|`:`${s}\\|`),ce=(r,i)=>{r.textContent="",E(i,r,{linkClass:"cm-link",codeClass:"cm-code",unescapePipes:!0})},ve=(r)=>r.state.facet(n)==="show",pe=(r)=>r.state.facet(n)==="hide";function Se(r,i){let s=d(r.dom),b=s?.anchorNode,y=b&&r.dom.contains(b)?(b instanceof HTMLElement?b:b.parentElement)?.closest(".cm-table-wysiwyg [data-row]"):null;if(!s||!y)return!1;return T(y,s,i,pe(r),r.state.facet(o).linkPrompt,{linkClass:"cm-link",codeClass:"cm-code"})}var me=(r,i,s,b)=>{let y=[...r.headers],k=r.rows.map((h)=>[...h]);if(i===0)y[s]=b;else if(k[i-1])k[i-1][s]=b;return{headers:y,aligns:r.aligns,rows:k}},Re=(r,i,{r:s,c:b,offset:y})=>requestAnimationFrame(()=>{if(!r.dom.isConnected)return;let k=null;for(let W of r.dom.querySelectorAll(".cm-table-wysiwyg"))if(r.posAtDOM(W)===i){k=W;break}let h=k?.querySelector(`[data-row="${s}"][data-col="${b}"]`);if(!h)return;h.focus();let v=d(h);if(!v)return;v.selectAllChildren(h),v.collapseToEnd();let O=h.firstChild;if(y!==void 0&&O?.nodeType===Node.TEXT_NODE)v.collapse(O,Math.min(y,O.textContent.length))});class ge extends be{raw;t;interactive;toolbar;hide;show;readOnly;constructor(r,i,s,b,y,k,h){super();this.raw=r;this.t=i;this.interactive=s;this.toolbar=b;this.hide=y;this.show=k;this.readOnly=h}eq(r){return this.raw===r.raw&&this.interactive===r.interactive&&this.hide===r.hide&&this.show===r.show&&this.readOnly===r.readOnly}toDOM(r){let{headers:i,aligns:s,rows:b}=this.t,y=t("div",{className:"cm-table-widget"+(this.interactive?" cm-table-wysiwyg":"")},"table-wrap"),k=()=>K(r.state,r.posAtDOM(y)),h=(R)=>{let P=!r.state.readOnly&&k();if(!P)return;let I=R(P),q=x(I);if(q!==r.state.sliceDoc(P.from,P.to))r.dispatch({changes:{from:P.from,to:P.to,insert:q}});if(I.focus)Re(r,P.from,I.focus)},v=null,O=(R,P,I)=>{let q=d(R);if(q?.anchorNode&&R.contains(q.anchorNode))v={r:P,c:I,offset:L(R,q.anchorNode,q.anchorOffset)}},W=(R,P,I,q)=>{if(s[I])R.style.textAlign=s[I];if(R.dataset.row=String(P),R.dataset.col=String(I),this.show)R.textContent=q;else ce(R,q);if(!this.interactive){R.onmousedown=(F)=>{if(r.state.readOnly)return;F.preventDefault();let j=k()?.cellRanges[P]?.[I];if(!j)return;r.dispatch({selection:Me.range(j.from,j.to)}),r.focus()};return}let G=()=>De(this.hide?f(R," "):R.textContent??"").replace(/\n+/g," ").trim();R.contentEditable=String(!r.state.readOnly),R.spellcheck=!1,R.onfocus=()=>{if(v={r:P,c:I,offset:v?.r===P&&v.c===I?v.offset:q.length},!this.hide&&R.textContent!==q)R.textContent=q},R.onmousedown=(F)=>F.stopPropagation(),R.onkeyup=R.onmouseup=()=>O(R,P,I),R.onkeydown=(F)=>{if(F.stopPropagation(),F.key==="Escape")F.preventDefault(),R.blur(),r.focus();else if(F.key==="Tab"||F.key==="Enter")F.preventDefault(),h((j)=>{let B=me(j,P,I,G());if(F.key==="Tab")return{...B,focus:Y(B.rows,B.headers.length,P,I,F.shiftKey?-1:1)};if(P===B.rows.length)B.rows.push(B.headers.map(()=>""));return{...B,focus:{r:P+1,c:I}}})},R.onblur=()=>{O(R,P,I);let F=G();if(F!==q)h((j)=>me(j,P,I,F));else if(!this.show)ce(R,F)}},U=t("table",{className:"cm-table"},"table"),H=t("thead"),_=t("tbody");if([i,...b].forEach((R,P)=>{let I=t("tr");R.forEach((q,G)=>{let F=t(P?"td":"th",{},P?"table-td":"table-th");W(F,P,G,q),I.append(F)}),(P?_:H).append(I)}),U.append(H,_),y.append(U),this.interactive&&!r.state.readOnly)y.append(ue(this.toolbar,(R)=>{let{c:P=0,r:I=-1,offset:q}=v??{};h((G)=>{let F=R.run(G,P,I);if(F.focus?.r===I&&F.focus.c===P)F.focus.offset=q;return F})}));return y}}var A=(r,i=M)=>[r?l.of(Se):[],ke.fromClass(class{decorations=z.none;atomic=z.none;constructor(s){this.build(s)}update(s){if(s.docChanged||s.viewportChanged||s.selectionSet||s.focusChanged||s.transactions.some((b)=>b.reconfigured)||ee(s.state)!==ee(s.startState))this.build(s.view)}build(s){let b=[],y=[],{state:k}=s,{doc:h}=k,v=ve(s),O=(W,U)=>!r&&(v||s.hasFocus&&k.selection.ranges.some((H)=>H.from<=U&&H.to>=W));for(let{from:W,to:U}of s.visibleRanges)ee(k).iterate({from:W,to:U,enter({name:H,from:_,to:R,node:P}){if(H!=="Table")return;let I=!O(_,R)&&C(k,P);if(!I)return!1;let q=h.lineAt(I.from),G=new ge(k.sliceDoc(I.from,I.to),I,r,i,pe(s),v,k.readOnly),F=z.replace({widget:G}).range(q.from,q.to);b.push(F),y.push(F);for(let j=q.number+1,B=h.lineAt(I.to).number;j<=B;j++){let X=h.line(j);if(b.push(z.line({class:"cm-table-hidden-line"}).range(X.from)),X.from<X.to){let oe=N.range(X.from,X.to);b.push(oe),y.push(oe)}}return!1}});this.decorations=z.set(b,!0),this.atomic=z.set(y,!0)}},{decorations:(s)=>s.decorations,provide:(s)=>de.atomicRanges.of((b)=>b.plugin(s)?.atomic??z.none)})],p=(r={})=>(r.toolbar??M).map((i)=>({...i,...r.labels?.[i.id]}));
export{C,x,V,w,m,M,S,A,p};
