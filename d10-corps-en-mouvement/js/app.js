"use strict";
const $=(s,root=document)=>root.querySelector(s);
const main=$("#contenu"), viewer=$("#viewer"), canvas=$("#viewer-canvas"), controls=$("#viewer-controls");
const all=[...illustrations,...documents], lookup=Object.fromEntries(all.map(x=>[x.id,x]));
const safe=(s)=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const link=(href,label,css="btn alt",attrs="")=>'<a class="'+css+'" href="'+safe(href)+'" '+attrs+'>'+safe(label)+'</a>';
const btn=(label,action,css="btn alt",extra="")=>'<button type="button" class="'+css+'" data-action="'+action+'" '+extra+'>'+safe(label)+'</button>';
const openLink=(id,label,css)=>link("#document/"+id,label,css,'data-open="'+id+'"');
const displayType=(item)=>item.type==="pdf"?item.files.length+" page"+(item.files.length>1?"s":"")+" · PDF":"Illustration";
const pageHead=(label,title,desc="",back="sommaire")=>'<div class="page-head"><a class="back" href="#'+back+'">← '+(back==="mouvement"?"Le corps en mouvement":"Sommaire")+'</a><p class="eyebrow">'+label+'</p><h1>'+title+'</h1>'+(desc?'<p>'+desc+'</p>':'')+'</div>';
const runner='<svg viewBox="0 0 48 48" fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="29" cy="8" r="4"/><path d="m25 16-9 2-6 6m16-8 6 8 9 1M26 17l-6 14-9 7m9-7 11 2 4 9M6 13h8M5 31h5"/></svg>';
const fileActions=(item)=>[
  item.pdf?link(item.pdf,"Ouvrir le PDF ↗","btn alt",'target="_blank" rel="noopener"'): "",
  item.word?link(item.word,"Télécharger le Word","btn alt","download"):""
].join("");
function card(ch){
  return '<article class="card"><a class="card-link" href="#'+ch.id+'"><div class="card-art '+(ch.style||"")+'">'+(ch.art?'<img src="'+ch.art+'" alt="">':'<span class="quiz-art"><strong>EXOS</strong> INTERACTIFS</span>')+'</div><div class="card-name"><h2>'+ch.title+'</h2><span class="arrow" aria-hidden="true">→</span></div></a><div class="quick">'+ch.quick.map(([label,url])=>url.startsWith("#document/")?openLink(url.split("/")[1],label,"pill"):link(url,label,"pill")).join("")+'</div></article>';
}
function home(){
  return '<section class="hero"><span class="hero-tag">Dossier 10</span><div><p class="eyebrow">Le corps humain et la santé</p><h1>Comment mon corps peut-il bouger ?</h1></div><div class="hero-badge">'+runner+'</div></section>'+
    '<div class="grid" aria-label="Les six entrées du dossier">'+chapters.map(card).join("")+'</div>'+
    '<section class="fiches" aria-labelledby="fiches"><h2 id="fiches">Fiches</h2><div class="fiches-grid">'+fiches.map(group=>'<div class="fiches-group">'+group.map(id=>'<a href="#document/'+id+'" data-open="'+id+'"><span aria-hidden="true">▤</span>'+lookup[id].title+'</a>').join("")+'</div>').join("")+'</div></section>';
}
function resource(id){
  const r=lookup[id];
  return '<article class="resource"><button type="button" class="resource-thumb" data-open="'+id+'" aria-label="Agrandir : '+safe(r.title)+'"><img src="'+r.files[0]+'" alt="" loading="lazy"></button><div class="resource-body"><h3>'+safe(r.title)+'</h3><p>'+displayType(r)+'</p><div class="resource-actions">'+openLink(id,"Afficher","btn")+fileActions(r)+'</div></div></article>';
}
function list(ids){return '<div class="resource-list">'+ids.map(resource).join("")+'</div>';}
function chapter(ch){
  let extra="";
  if(ch.id==="mouvement") extra='<div class="actions">'+link("#videos","▶ Voir la vidéo","btn")+'</div><h2 class="group-title">Illustrations</h2>';
  if(ch.id==="articulations") extra='<div class="actions">'+openLink("schema-recapitulatif","Schéma récapitulatif","btn")+'</div><h2 class="group-title">À observer</h2>';
  return pageHead("Observer",ch.title,ch.intro)+extra+list(ch.items);
}
function resources(){
  return pageHead("Dossier 10","Ressources","Retrouve les fiches, la vidéo et les images du dossier.")+
    '<div class="actions">'+link("#videos","▶ Voir la vidéo","btn")+openLink("schema-recapitulatif","Schéma récapitulatif","btn alt")+'</div>'+
    '<h2 class="group-title">Fiches du dossier</h2>'+list(fiches.flat())+
    '<h2 class="group-title">Planches et illustrations</h2>'+list([...new Set(chapters.flatMap(c=>c.items||[])),"schema-recapitulatif"]);
}
function videoPage(){
  return pageHead("Regarder","Le corps en mouvement","Observe les gestes et repère les parties du corps qui bougent.","mouvement")+
    (videos.length?videos.map(v=>'<section class="video-wrap"><h3>'+safe(v.title)+'</h3><video class="video" controls preload="metadata" playsinline '+(v.poster?'poster="'+safe(v.poster)+'"':'')+' aria-label="'+safe(v.title)+'"><source src="'+safe(v.src)+'" type="'+safe(v.type)+'">Ton navigateur ne peut pas lire cette vidéo.</video><div class="actions">'+link(v.src,"Ouvrir la vidéo ↗","btn alt",'target="_blank" rel="noopener"')+'</div></section>').join(""):'<p class="notice">Aucune vidéo n’est disponible dans ce dossier.</p>');
}
let view, viewPage=0, zoom=1, viewOrigin, documentRoute=false;
function openViewer(id, origin, fromRoute=false){
  if(!lookup[id])return;
  view=lookup[id];viewPage=0;zoom=1;viewOrigin=origin||document.activeElement;documentRoute=fromRoute;
  $("#viewer-title").textContent=view.title;
  drawViewer();
  if(!viewer.open)viewer.showModal();
  $(".close",viewer).focus();
}
function drawViewer(){
  const n=view.files.length;
  canvas.classList.toggle("is-zoom",zoom!==1);
  canvas.style.setProperty("--image-width",Math.round(zoom*100)+"%");
  canvas.innerHTML='<img src="'+view.files[viewPage]+'" alt="'+safe(view.desc||view.title+" – page "+(viewPage+1))+'">';
  canvas.scrollTop=0;canvas.scrollLeft=0;
  const navigation=n>1?btn("← Précédente","view-prev","btn alt",viewPage===0?"disabled":"")+'<span aria-live="polite">'+(viewPage+1)+' / '+n+'</span>'+btn("Suivante →","view-next","btn alt",viewPage===n-1?"disabled":""):"";
  controls.innerHTML=navigation+btn("−","view-out","btn alt",'aria-label="Réduire" '+(zoom===1?"disabled":""))+
    btn(zoom===1?"Taille adaptée":"Ajuster","view-fit","btn alt",zoom===1?"disabled":"")+
    btn("+","view-in","btn alt",'aria-label="Agrandir" '+(zoom>=3?"disabled":""))+
    (view.pdf?link(view.pdf,"PDF / imprimer ↗","btn",'target="_blank" rel="noopener"'):link(view.files[0],"Ouvrir l’image ↗","btn",'target="_blank" rel="noopener"'))+
    (view.word?link(view.word,"Télécharger le Word","btn alt","download"):"");
}
$(".close",viewer).addEventListener("click",()=>viewer.close());
viewer.addEventListener("close",()=>{
  if(documentRoute){documentRoute=false;history.replaceState(null,"","#sommaire");}
  if(viewOrigin?.isConnected)viewOrigin.focus({preventScroll:true});
});
viewer.addEventListener("click",e=>{if(e.target===viewer)viewer.close();});
viewer.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight" && viewPage<view.files.length-1){e.preventDefault();viewPage++;drawViewer();}
  if(e.key==="ArrowLeft" && viewPage>0){e.preventDefault();viewPage--;drawViewer();}
});

let qi=0, quizDone=false, qState=[];
function resetQuiz(){qi=0;quizDone=false;qState=quiz.map(()=>({values:null,tries:0,done:false,first:false,feedback:"",status:""}));}
resetQuiz();
function quizPage(){
  const lead=pageHead("Activité interactive","Entraîne-toi !","Observe, réponds, puis valide pour voir la correction.");
  if(quizDone){
    const n=qState.filter(s=>s.first).length;
    return lead+'<section class="activity"><p class="eyebrow">Bilan</p><h2>Parcours terminé !</h2><p>'+n+' exercice'+(n>1?"s":"")+' réussi'+(n>1?"s":"")+' du premier coup sur '+quiz.length+'.</p><div class="actions">'+btn("Recommencer","quiz-reset","btn")+openLink("je-retiens","Relire « Je retiens »","btn alt")+'</div></section>';
  }
  const q=quiz[qi], s=qState[qi];
  const figure=q.fig||q.photo?'<figure class="figure '+(q.dots?"dots":"")+'"><img src="'+(q.fig?"assets/exercices/"+q.fig+".webp":img(q.photo))+'" alt="'+safe(q.alt)+'">'+
    (q.dots||[]).map(([x,y],i)=>'<b aria-hidden="true" style="left:'+x+'%;top:'+y+'%">'+(i+1)+'</b>').join("")+'</figure>':"";
  const rows=q.rows?'<div class="matching">'+q.rows.map(([label],i)=>'<label class="match"><span>'+safe(label)+'</span><select '+(s.done?"disabled":"")+' name="match-'+i+'"><option value="">Choisir…</option>'+
    q.options.map(o=>'<option value="'+safe(o)+'" '+(s.values?.[i]===o?"selected":"")+'>'+safe(o)+'</option>').join("")+'</select></label>').join("")+'</div>':
    '<div class="choices">'+q.options.map((o,i)=>'<label class="choice"><input name="choice" type="'+(q.multiple?"checkbox":"radio")+'" value="'+i+'" '+(s.values?.includes(i)?"checked ":"")+(s.done?"disabled":"")+'>'+safe(o)+'</label>').join("")+'</div>';
  return lead+'<section class="activity"><div class="progress"><span>Exercice '+(qi+1)+' / '+quiz.length+'</span><progress aria-label="Progression" value="'+(qi+1)+'" max="'+quiz.length+'"></progress></div><h2 id="q-title" tabindex="-1">'+safe(q.title)+'</h2>'+
    (q.hint?'<p>'+safe(q.hint)+'</p>':'')+'<div class="quiz-layout '+(figure?"has-figure":"")+'">'+figure+
    '<form id="quiz-form" class="quiz-form" aria-labelledby="q-title">'+rows+'<p class="feedback '+s.status+'" role="status">'+safe(s.feedback)+'</p>'+
    '<div class="actions">'+btn("← Précédent","quiz-prev","btn alt",qi===0?"disabled":"")+
    '<button class="btn" type="submit" '+(s.done?"disabled":"")+'>Valider</button>'+
    btn(qi===quiz.length-1?"Voir le bilan":"Suivant →","quiz-next","btn alt",s.done?"":"disabled")+
    '</div></form></div></section>';
}
function readQuiz(){
  const q=quiz[qi], f=$("#quiz-form");
  if(!f||qState[qi].done)return;
  qState[qi].values=q.rows?[...f.querySelectorAll("select")].map(x=>x.value):[...f.querySelectorAll("input:checked")].map(x=>Number(x.value));
}
function refreshQuiz(focus){
  main.innerHTML=quizPage();
  const el=focus?$(focus,main):null;
  if(el)el.focus({preventScroll:true});
}
function checkQuiz(){
  readQuiz();
  const q=quiz[qi],s=qState[qi], values=s.values;
  if(s.done)return;
  if(!values.length||values.some(v=>v==="")){
    s.feedback=q.rows?"Complète toutes les lignes avant de valider.":"Choisis au moins une réponse avant de valider.";s.status="warn";
    const f=$(".feedback",main);f.textContent=s.feedback;f.className="feedback warn";return;
  }
  const expected=q.rows?q.rows.map(r=>r[1]):q.answer;
  const correct=values.length===expected.length&&values.every((val,i)=>val===expected[i]);
  s.tries++;
  if(correct){
    s.done=true;s.first=s.tries===1;s.status="good";s.feedback="Bravo, c’est juste !"+(q.explain?" "+q.explain:"");
  }else if(s.tries>=3){
    s.done=true;s.status="warn";s.feedback="Correction : "+(q.rows?q.rows.map(([a,b])=>a+" → "+b).join(" ; "):q.answer.map(i=>q.options[i]).join(", "))+(q.explain?". "+q.explain:"");
  }else{
    s.status="warn";s.feedback="Essaie encore. "+(3-s.tries)+(s.tries===2?" tentative restante.":" tentatives restantes.");
    const f=$(".feedback",main);f.textContent=s.feedback;f.className="feedback warn";return;
  }
  refreshQuiz('[data-action="quiz-next"]');
}

let chosen=null, placed={}, gameMessage="", gameStatus="";
const bonePath=(art)=>"assets/squelette/"+art+".png";
const pieceOrder=["pied-d","avant-bras-g","crane","jambe-g","main-d","cuisse-d","bassin","bras-g","jambe-d","pied-g","main-g","cage","avant-bras-d","cuisse-g","bras-d"];
const side=(id)=>id.endsWith("-g")?", à gauche de l’écran":id.endsWith("-d")?", à droite de l’écran":"";
const boneById=Object.fromEntries(skeleton.map(x=>[x.id,x]));
function gamePage(){
  const count=Object.keys(placed).length;
  const zones=skeleton.map(b=>{
    const art=placed[b.id]?boneById[placed[b.id]].art:null;
    return '<button type="button" class="drop '+(art?"filled":"")+'" data-slot="'+b.id+'" aria-label="Emplacement '+safe(b.label+side(b.id))+(art?", déjà placé":"")+'" style="left:'+b.x+'%;top:'+b.y+'%;width:'+b.w+'%;height:'+b.h+'%" '+(art?"disabled":"")+'>'+(art?'<img alt="" src="'+bonePath(art)+'">':'<span aria-hidden="true">+</span>')+'</button>';
  }).join("");
  const used=new Set(Object.values(placed));
  const pieces=pieceOrder.map(id=>{
    const b=boneById[id], hidden=used.has(id);
    return '<button type="button" class="piece '+(hidden?"placed":"")+'" data-piece="'+id+'" draggable="'+(!hidden)+'" aria-pressed="'+(chosen===id)+'" aria-label="Choisir : '+safe(b.label+side(id))+'" '+(hidden?"disabled":"")+'><img alt="" draggable="false" src="'+bonePath(b.art)+'"><span>'+safe(b.label)+'</span></button>';
  }).join("");
  return pageHead("Activité interactive","À toi de jouer !","Reconstitue le squelette humain.")+
    '<section class="activity"><h2>Place chaque pièce au bon endroit</h2><p>Fais glisser une pièce sur la silhouette. Tu peux aussi sélectionner la pièce, puis toucher ou cliquer sur sa place.</p>'+
    '<div class="progress"><span aria-live="polite">'+count+' / '+skeleton.length+' pièces</span><progress aria-label="Pièces placées" max="'+skeleton.length+'" value="'+count+'"></progress></div>'+
    '<div class="game-layout"><div class="body-board" aria-label="Silhouette à compléter"><img class="silhouette" src="'+bonePath("silhouette")+'" alt="">'+zones+'</div><div class="game-side"><h3>Pièces à placer</h3><div class="pieces">'+pieces+'</div><p class="feedback '+gameStatus+'" role="status">'+safe(gameMessage)+'</p>'+btn("Recommencer","game-reset")+'</div></div></section>';
}
function selectBone(id){
  chosen=id;
  main.querySelectorAll("[data-piece]").forEach(el=>el.setAttribute("aria-pressed",String(el.dataset.piece===id)));
  const el=$(".feedback",main);el.className="feedback";el.textContent=boneById[id].label+" : choisis sa place sur la silhouette.";
}
function placeBone(id,slot){
  const part=boneById[id], target=boneById[slot];
  if(!target||placed[slot])return;
  if(!part||Object.values(placed).includes(id)){
    gameMessage="Choisis d’abord une pièce.";gameStatus="warn";
  }else if(id!==slot){
    gameMessage=part.group===target.group?"Essaie de placer cette pièce de l’autre côté.":"Cette pièce ne va pas à cet endroit. Essaie ailleurs.";gameStatus="warn";
  }else{
    placed[slot]=id;chosen=null;gameStatus="good";
    gameMessage=Object.keys(placed).length===skeleton.length?"Bravo, ton squelette est complet !":part.label+" : bien placé !";
    main.innerHTML=gamePage();
    ($(".piece:not([disabled])",main)||$('[data-action="game-reset"]',main)).focus({preventScroll:true});
    return;
  }
  const el=$(".feedback",main);el.className="feedback "+gameStatus;el.textContent=gameMessage;
}
main.addEventListener("dragstart",e=>{
  const p=e.target.closest("[data-piece]");
  if(!p)return;
  selectBone(p.dataset.piece);
  e.dataTransfer.setData("text/plain",p.dataset.piece);e.dataTransfer.effectAllowed="move";
});
main.addEventListener("dragover",e=>{const x=e.target.closest(".drop:not([disabled])");if(x){e.preventDefault();x.classList.add("hot");e.dataTransfer.dropEffect="move";}});
main.addEventListener("dragleave",e=>e.target.closest(".drop")?.classList.remove("hot"));
main.addEventListener("drop",e=>{
  const x=e.target.closest(".drop:not([disabled])");if(!x)return;
  e.preventDefault();x.classList.remove("hot");placeBone(e.dataTransfer.getData("text/plain"),x.dataset.slot);
});
main.addEventListener("dragend",()=>main.querySelectorAll(".hot").forEach(el=>el.classList.remove("hot")));
main.addEventListener("submit",e=>{if(e.target.id==="quiz-form"){e.preventDefault();checkQuiz();}});
document.addEventListener("click",e=>{
  if(e.target.closest(".skip")){e.preventDefault();main.focus();return;}
  const o=e.target.closest("[data-open]");
  if(o&&!(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)){e.preventDefault();openViewer(o.dataset.open,o);return;}
  const p=e.target.closest("[data-piece]"), d=e.target.closest("[data-slot]");
  if(p&&!p.disabled){selectBone(p.dataset.piece);return;}
  if(d&&!d.disabled){placeBone(chosen,d.dataset.slot);return;}
  const a=e.target.closest("[data-action]")?.dataset.action;
  if(!a)return;
  if(a.startsWith("view-")){
    if(a==="view-prev")viewPage--;
    if(a==="view-next")viewPage++;
    if(a==="view-out")zoom=Math.max(1,zoom-.5);
    if(a==="view-in")zoom=Math.min(3,zoom+.5);
    if(a==="view-fit")zoom=1;
    drawViewer();
    ($('[data-action="'+a+'"]:not([disabled])',controls)||$(".close",viewer)).focus();
  }
  if(a==="quiz-next"){if(qi===quiz.length-1)quizDone=true;else qi++;refreshQuiz(quizDone?'[data-action="quiz-reset"]':"#q-title");}
  if(a==="quiz-prev"){readQuiz();qi--;refreshQuiz("#q-title");}
  if(a==="quiz-reset"){resetQuiz();refreshQuiz("#q-title");}
  if(a==="game-reset"){chosen=null;placed={};gameMessage="";gameStatus="";main.innerHTML=gamePage();$(".piece",main).focus({preventScroll:true});}
});
function render(moveFocus=false){
  const hash=location.hash.slice(1)||"sommaire";
  const [id,detail]=hash.split("/");
  const ch=chapters.find(x=>x.id===id&&x.items);
  const routeDocument=id==="document"&&!!lookup[detail];
  if(viewer.open){documentRoute=false;viewer.close();}
  main.innerHTML=ch?chapter(ch):id==="ressources"?resources():id==="videos"?videoPage():id==="quiz"?quizPage():id==="jeu"?gamePage():home();
  document.querySelectorAll("[data-nav]").forEach(x=>{
    if(x.dataset.nav===(id==="ressources"?"ressources":"sommaire"))x.setAttribute("aria-current","page");
    else x.removeAttribute("aria-current");
  });
  if(moveFocus){window.scrollTo(0,0);main.focus({preventScroll:true});}
  if(routeDocument)openViewer(detail,main,true);
}
window.addEventListener("hashchange",()=>render(true));
const fullscreen=$("#fullscreen");
if(!document.fullscreenEnabled)fullscreen.hidden=true;
fullscreen.addEventListener("click",async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{fullscreen.hidden=true;}
});
document.addEventListener("fullscreenchange",()=>{
  const title=document.fullscreenElement?"Quitter le plein écran":"Plein écran";fullscreen.title=title;fullscreen.setAttribute("aria-label",title);
});
render();

