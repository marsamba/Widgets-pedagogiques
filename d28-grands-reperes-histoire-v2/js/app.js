'use strict';
/* =====================================================================
   APPLICATION — navigation, sommaire, pages, visionneuse, bilan.
   Le contenu vient de contenus.js ; rien de spécifique à la séance ici.
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const num = i => String(i + 1).padStart(2, '0');
const main = $('#contenu'), viewer = $('#viewer');

/* Toutes les pages, dans l'ordre, avec leur vignette */
const PAGES = VIGNETTES.flatMap((v, vi) => v.pages.map((p, pi) => ({...p, v, vi, pi})));
const pageParId = Object.fromEntries(PAGES.map(p => [p.id, p]));
const icone = (type, cls = '') => `<img class="icone ${cls}" src="assets/icones/${TYPES[type].icone}" alt="">`;
const docSrc = (cle, n) => `assets/apercus/${cle}-${n}.webp`;

$('#brand-matiere').textContent = SEANCE.matiere;
$('#brand-niveau').textContent = SEANCE.niveau;

/* ---------------------------------------------------------------- SOMMAIRE */
function artVignette(v) {
  if (v.art.img) return `<img class="art-img" src="${v.art.img}" alt="">`;
  if (v.art.portraits) return `<div class="art-portraits">${v.art.portraits.map(n => `<img src="assets/images/${n}.webp" alt="">`).join('')}</div>`;
  return v.art.html;
}
function sommaire() {
  const carte = (v, i) => `<article class="card tone-${i % 5}">
      <a class="card-link" href="#p-${v.pages[0].id}"><div class="card-art"><span class="card-number">${num(i)}</span>${artVignette(v)}</div>
        <div class="card-body"><p class="eyebrow">${esc(v.categorie)}</p><h3>${esc(v.titre)}</h3></div></a>
      <nav class="card-rail" aria-label="Accès direct : ${esc(v.titre)}">${v.pages.map(p => `<a class="rail-btn" href="#p-${p.id}" title="${esc(p.titre)}">${icone(p.bouton)}<span class="sr">${esc(TYPES[p.bouton].label)} : ${esc(p.titre)}</span></a>`).join('')}</nav>
    </article>`;
  return `<section class="hero"><span class="hero-tag">Dossier ${esc(SEANCE.numero)}</span><div><p class="eyebrow">${esc(SEANCE.theme)}</p><h1 tabindex="-1">${esc(SEANCE.titre)}</h1></div></section>
    <div class="grid">${VIGNETTES.map(carte).join('')}</div>
    ${bandeauFichiers()}`;
}

/* Bandeau inférieur : les fichiers de la séquence, regroupés */
function lienFichier([genre, cle]) {
  if (genre === 'doc') return `<button type="button" class="fichier" data-ouvrir="doc:${cle}">${icone('pdf')}<span>${esc(DOCUMENTS[cle].titre)}</span></button>`;
  if (genre === 'word') return `<a class="fichier" href="assets/documents/${DOCUMENTS[cle].word}" download>${icone('pdf')}<span>${esc(DOCUMENTS[cle].titre)} · Word</span></a>`;
  if (genre === 'video') return `<button type="button" class="fichier" data-ouvrir="video:${cle}">${icone('video')}<span>${esc(VIDEOS[cle].titre)}</span></button>`;
  return '';
}
function bandeauFichiers() {
  return `<section class="fichiers" aria-labelledby="fichiers-titre"><h2 id="fichiers-titre">Fichiers</h2><div class="fichiers-grille">${FICHIERS.map(g =>
    `<div class="fichiers-groupe"><p>${esc(g.groupe)}</p>${g.items.map(lienFichier).join('')}</div>`).join('')}</div></section>`;
}

/* ---------------------------------------------------------------- RESSOURCES */
function ressources() {
  const carteDoc = cle => { const d = DOCUMENTS[cle]; return `<article class="ressource"><button type="button" class="ressource-vignette" data-ouvrir="doc:${cle}" aria-label="Afficher : ${esc(d.titre)}"><img src="${docSrc(cle, 1)}" alt="" loading="lazy"></button><div class="ressource-corps"><h3>${esc(d.titre)}</h3><p>${d.pages} page${d.pages > 1 ? 's' : ''} · PDF</p><div class="actions"><button type="button" class="btn small" data-ouvrir="doc:${cle}">Afficher</button><a class="btn small alt" href="assets/documents/${cle}.pdf" download>Télécharger</a>${d.word ? `<a class="btn small alt" href="assets/documents/${d.word}" download>Word</a>` : ''}</div></div></article>`; };
  const carteVideo = cle => { const v = VIDEOS[cle]; return `<article class="ressource"><button type="button" class="ressource-vignette video" data-ouvrir="video:${cle}" aria-label="Lire : ${esc(v.titre)}"><img src="${v.poster}" alt="" loading="lazy"><span aria-hidden="true">▶</span></button><div class="ressource-corps"><h3>${esc(v.titre)}</h3><p>Vidéo</p><div class="actions"><button type="button" class="btn small" data-ouvrir="video:${cle}">Lire</button><a class="btn small alt" href="${v.src}" download>Télécharger</a></div></div></article>`; };
  const groupes = [
    ['Fiches de la séance', ['fiche-eleve', 'fiche-a-decouper', 'je-retiens', 'evaluation']],
    ['Pour l’enseignant', ['fiche-enseignant', 'corriges']],
    ['Documents', ['chiffres-romains', 'lieux-histoire', 'grandes-dates', 'schema-recapitulatif']],
    ['Fiches personnages', Object.keys(DOCUMENTS).filter(k => k.startsWith('bio-'))]
  ];
  return `<header class="page-head"><a class="back" href="#sommaire">← Sommaire</a><h1 tabindex="-1">Ressources</h1></header>
    ${groupes.map(([t, cles]) => `<h2 class="groupe-titre">${t}</h2><div class="ressources">${cles.map(carteDoc).join('')}</div>`).join('')}
    <h2 class="groupe-titre">Vidéos</h2><div class="ressources">${Object.keys(VIDEOS).map(carteVideo).join('')}</div>
    <h2 class="groupe-titre">Images</h2><div class="galerie">${GALERIE.map(([n, t]) => `<button type="button" class="galerie-item" data-ouvrir="img:${n}:${esc(t)}"><img src="assets/images/${n}.webp" alt="" loading="lazy"><span>${esc(t)}</span></button>`).join('')}</div>`;
}

/* ---------------------------------------------------------------- VISIONNEUSE */
/* Une même visionneuse sert dans les pages et dans la fenêtre. */
function visionneuse(conteneur, src) {
  const etat = {page: 1, zoom: 1};
  function rendre() {
    const multi = src.images.length > 1;
    conteneur.innerHTML = `<div class="vision"><div class="vision-cadre${etat.zoom > 1 ? ' zoom' : ''}" tabindex="0" aria-label="Aperçu"><img src="${src.images[etat.page - 1]}" alt="${esc(src.titre)}${multi ? ', page ' + etat.page : ''}" style="--z:${etat.zoom}"></div>
      <div class="vision-barre">
        ${multi ? `<button type="button" class="btn small alt" data-v="prev" ${etat.page === 1 ? 'disabled' : ''}>← Page</button><span class="vision-num">${etat.page} / ${src.images.length}</span><button type="button" class="btn small alt" data-v="next" ${etat.page === src.images.length ? 'disabled' : ''}>Page →</button><span class="sep"></span>` : ''}
        <button type="button" class="btn small alt" data-v="out" aria-label="Réduire" ${etat.zoom <= 1 ? 'disabled' : ''}>−</button><span class="vision-num">${Math.round(etat.zoom * 100)} %</span><button type="button" class="btn small alt" data-v="in" aria-label="Agrandir" ${etat.zoom >= 3 ? 'disabled' : ''}>+</button>
        <span class="sep"></span>
        ${src.pdf ? `<a class="btn small alt" href="${src.pdf}" target="_blank" rel="noopener">Ouvrir le PDF ↗</a>` : ''}
        <a class="btn small alt" href="${src.telecharger || src.images[0]}" download>Télécharger</a>
        ${src.word ? `<a class="btn small alt" href="${src.word}" download>Word</a>` : ''}
      </div></div>`;
  }
  conteneur.onclick = e => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    const a = b.dataset.v;
    if (a === 'prev') { etat.page--; etat.zoom = 1; }
    if (a === 'next') { etat.page++; etat.zoom = 1; }
    if (a === 'in') etat.zoom = Math.min(3, etat.zoom + .5);
    if (a === 'out') etat.zoom = Math.max(1, etat.zoom - .5);
    rendre();
    ($(`[data-v="${a}"]:not(:disabled)`, conteneur) || $('.vision-cadre', conteneur)).focus();
  };
  rendre();
}
const sourceDoc = cle => { const d = DOCUMENTS[cle]; return {titre: d.titre, images: Array.from({length: d.pages}, (_, i) => docSrc(cle, i + 1)), pdf: `assets/documents/${cle}.pdf`, telecharger: `assets/documents/${cle}.pdf`, word: d.word && `assets/documents/${d.word}`}; };
const lecteurVideo = cle => { const v = VIDEOS[cle]; return `<video class="video" controls preload="metadata" playsinline poster="${v.poster}"><source src="${v.src}" type="video/mp4">Ton navigateur ne peut pas lire cette vidéo.</video>`; };

let opener;
function ouvrir(code, depuis) {
  const [genre, cle, titre] = code.split(':');
  opener = depuis;
  const corps = $('#viewer-body');
  if (genre === 'doc') { $('#viewer-title').textContent = DOCUMENTS[cle].titre; visionneuse(corps, sourceDoc(cle)); }
  if (genre === 'img') { $('#viewer-title').textContent = titre; visionneuse(corps, {titre, images: [`assets/images/${cle}.webp`]}); }
  if (genre === 'video') { $('#viewer-title').textContent = VIDEOS[cle].titre; corps.onclick = null; corps.innerHTML = `<div class="vision">${lecteurVideo(cle)}<div class="vision-barre"><a class="btn small alt" href="${VIDEOS[cle].src}" download>Télécharger la vidéo</a></div></div>`; }
  viewer.showModal();
  $('#close-viewer').focus();
}
$('#close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', e => { if (e.target === viewer) viewer.close(); });
viewer.addEventListener('close', () => { $('#viewer-body').querySelectorAll('video').forEach(v => v.pause()); $('#viewer-body').innerHTML = ''; opener?.focus(); });

/* ---------------------------------------------------------------- PAGES */
function enTetePage(p) {
  const i = PAGES.indexOf(p), prec = PAGES[i - 1], suiv = PAGES[i + 1];
  return `<header class="page-barre tone-${p.vi % 5}">
    <div class="fil"><a class="back" href="#sommaire" aria-label="Retour au sommaire">←</a><span class="fil-num">${num(p.vi)}</span><span class="fil-titre">${esc(p.v.titre)}</span></div>
    <h1 tabindex="-1">${icone(p.bouton, 'h1-icone')}${esc(p.titre)}</h1>
    <nav class="onglets" aria-label="Pages de la vignette">${p.v.pages.map(q => `<a class="onglet" href="#p-${q.id}" title="${esc(q.titre)}" ${q === p ? 'aria-current="page"' : ''}>${icone(q.bouton)}<span class="sr">${esc(q.titre)}</span></a>`).join('')}</nav>
    <nav class="fleches" aria-label="Page précédente ou suivante">${prec ? `<a class="fleche" href="#p-${prec.id}" title="Précédente : ${esc(prec.titre)}">‹</a>` : '<span class="fleche off">‹</span>'}${suiv ? `<a class="fleche" href="#p-${suiv.id}" title="Suivante : ${esc(suiv.titre)}">›</a>` : '<span class="fleche off">›</span>'}</nav>
  </header>`;
}

const rendus = {
  video: (p, el) => { el.innerHTML = `<div class="media-fit">${lecteurVideo(p.video)}</div>`; },
  image: (p, el) => visionneuse(el, {titre: p.titre, images: [p.img]}),
  document: (p, el) => visionneuse(el, sourceDoc(p.doc)),
  carrousel: (p, el) => carrousel(p, el),
  activite: (p, el) => activite(p, el),
  bilan: (p, el) => bilan(el)
};

function carrousel(p, el) {
  let i = 0;
  const n = p.diapos.length;
  function rendre() {
    const d = p.diapos[i];
    const diapo = d.doc
      ? `<div class="diapo-doc"><img src="${docSrc(d.doc, 1)}" alt="${esc(d.titre)}"></div>`
      : `<div class="diapo-repere" style="--c:${d.couleur}"><div class="diapo-images">${d.imgs.map(m => `<img src="assets/images/${m}.webp" alt="">`).join('')}</div><div class="diapo-texte"><span class="periode-tag">${esc(d.periode)}</span><h2>${esc(d.titre)}</h2><p class="diapo-sous">${esc(d.sous)}</p><p>${esc(d.texte)}</p></div></div>`;
    el.innerHTML = `<div class="carrousel"><button type="button" class="car-fleche" data-c="-1" aria-label="Précédent" ${i === 0 ? 'disabled' : ''}>‹</button>
      <div class="car-scene" aria-live="polite">${diapo}</div>
      <button type="button" class="car-fleche" data-c="1" aria-label="Suivant" ${i === n - 1 ? 'disabled' : ''}>›</button>
      <div class="car-points">${p.diapos.map((x, j) => `<button type="button" class="car-point" data-g="${j}" aria-label="${esc(x.titre)}" ${j === i ? 'aria-current="true"' : ''}>${x.doc ? esc(x.titre) : ''}</button>`).join('')}
      ${d.doc ? `<span class="sep"></span><button type="button" class="btn small alt" data-ouvrir="doc:${d.doc}">Agrandir</button><a class="btn small alt" href="assets/documents/${d.doc}.pdf" download>Télécharger</a>` : ''}</div></div>`;
  }
  el.onclick = e => {
    const b = e.target.closest('[data-c],[data-g]'); if (!b) return;
    i = b.dataset.g !== undefined ? +b.dataset.g : Math.max(0, Math.min(n - 1, i + +b.dataset.c));
    rendre();
    ($(`[data-g="${i}"]`, el)).focus();
  };
  el.tabIndex = -1;
  el.addEventListener('keydown', e => { if (e.key === 'ArrowRight' && i < n - 1) { i++; rendre(); } if (e.key === 'ArrowLeft' && i > 0) { i--; rendre(); } });
  rendre();
}

/* Coquille commune des activités : consigne, zone, Vérifier / Recommencer, score */
function activite(p, el) {
  const a = p.activite;
  el.innerHTML = `<div class="activite">${p.consigne ? `<p class="consigne">${esc(p.consigne)}</p>` : ''}<div class="activite-zone"></div>
    ${a.moteur === 'quiz' ? '' : `<div class="activite-pied"><button type="button" class="btn" data-a="verifier">Vérifier</button><button type="button" class="btn alt" data-a="recommencer">Recommencer</button><p class="retour" role="status"></p><span class="score-pastille" hidden></span></div>`}</div>`;
  const zone = $('.activite-zone', el), retour = $('.retour', el), pastille = $('.score-pastille', el);
  const ctx = {enregistrer: (s, m) => Scores.enregistrer(p.id, s, m), effacer: () => Scores.effacer(p.id)};
  const m = Moteurs[a.moteur](zone, a, ctx);
  let fait = false;
  if (!m.autonome) {
    const deja = Scores.get(p.id);
    retour.textContent = deja ? `Déjà fait : ${deja.score} / ${deja.max}. Tu peux le refaire.` : '';
  }
  el.onclick = e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'recommencer') return activite(p, el);   // repart d'un état neuf
    if (fait) return;
    if (!m.pret()) { const r = m.reste(); retour.textContent = `Il te reste ${r} réponse${r > 1 ? 's' : ''} à donner.`; retour.className = 'retour attention'; return; }
    const {score, max} = m.verifier();
    fait = true; b.disabled = true;
    Scores.enregistrer(p.id, score, max);
    retour.textContent = score === max ? '✓ Bravo, tout est juste !' : `Les erreurs sont en rouge, la bonne réponse est indiquée. Tu peux recommencer.`;
    retour.className = 'retour ' + (score === max ? 'ok' : 'ko');
    pastille.hidden = false; pastille.innerHTML = `Score : <strong>${score} / ${max}</strong>`;
  };
}

/* Bilan : score de chaque activité et note générale sur 10 */
function bilan(el) {
  function rendre() {
    const n = Scores.note(), connecte = Elea.connecte;
    el.innerHTML = `<div class="bilan"><div class="bilan-note"><p class="eyebrow">Ma note générale</p><div class="note-grande">${Scores.format(n)}<span> / 10</span></div>
        <p>${Scores.faites()} activité${Scores.faites() > 1 ? 's' : ''} faite${Scores.faites() > 1 ? 's' : ''} sur ${Scores.activites.length}</p>
        <div class="actions"><button type="button" class="btn" data-b="envoyer" ${connecte ? '' : 'disabled'}>Envoyer ma note à Éléa</button><button type="button" class="btn alt" data-b="effacer">Tout recommencer</button></div>
        <p class="bilan-info" role="status">${connecte ? 'Ta note est enregistrée dans Éléa à chaque activité. Le bouton la marque comme terminée.' : 'Hors Éléa, la note reste sur cet appareil.'}</p></div>
      <ol class="bilan-liste">${Scores.activites.map(a => { const s = Scores.get(a.id); const pc = s ? s.score / s.max : 0; return `<li><a href="#p-${a.id}">${esc(a.titre)}</a><span class="barre"><span style="width:${pc * 100}%"></span></span><strong>${s ? `${s.score} / ${s.max}` : '—'}</strong></li>`; }).join('')}</ol></div>`;
  }
  el.onclick = e => {
    const b = e.target.closest('[data-b]'); if (!b) return;
    if (b.dataset.b === 'envoyer') { const ok = Scores.envoyer(); rendre(); $('.bilan-info', el).textContent = ok ? '✓ Ta note a été envoyée à Éléa.' : 'L’envoi n’a pas abouti. Réessaie.'; }
    if (b.dataset.b === 'effacer') {
      // Double appui pour confirmer (pas de fenêtre « confirm », bloquée dans certains cadres)
      if (b.dataset.ok) { Scores.toutEffacer(); location.reload(); }
      else { b.dataset.ok = '1'; b.textContent = 'Toucher encore pour tout effacer'; b.classList.remove('alt'); }
    }
  };
  Scores.onChange(() => { if (el.isConnected) rendre(); });
  rendre();
}

/* ---------------------------------------------------------------- ROUTAGE */
const ecrans = new Map();
let courant;
function afficher(premier = false) {
  let h = decodeURIComponent(location.hash.slice(1));
  if (h === 'contenu') return;
  if (h.startsWith('p-') && !pageParId[h.slice(2)]) h = 'sommaire';
  if (!h.startsWith('p-') && h !== 'ressources') h = 'sommaire';
  if (h === courant) return;
  ecrans.get(courant)?.querySelectorAll('video').forEach(v => v.pause());
  courant = h;
  for (const [id, e] of ecrans) e.hidden = id !== h;
  if (!ecrans.has(h)) {
    const e = document.createElement('div');
    if (h.startsWith('p-')) {
      const p = pageParId[h.slice(2)];
      e.className = 'ecran page fit page-' + p.type;
      e.innerHTML = enTetePage(p) + '<div class="page-corps"></div>';
      rendus[p.type](p, $('.page-corps', e));
    } else {
      e.className = 'ecran ecran-' + h;
      e.innerHTML = h === 'ressources' ? ressources() : sommaire();
    }
    main.append(e); ecrans.set(h, e);
  }
  document.body.dataset.ecran = h.startsWith('p-') ? 'page' : h;
  document.querySelectorAll('[data-nav], .page-link').forEach(a => a.getAttribute('href') === '#' + h ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  if (!premier) { window.scrollTo({top: 0}); $('h1', ecrans.get(h))?.focus({preventScroll: true}); }
}
window.addEventListener('hashchange', () => afficher());

main.addEventListener('click', e => {
  const o = e.target.closest('[data-ouvrir]');
  if (o) ouvrir(o.dataset.ouvrir, o);
});

/* ---------------------------------------------------------------- NAVIGATEUR DE PAGES */
const sidebar = $('#navigateur'), btnPages = $('#pages'), pin = $('#pin');
$('#page-links').innerHTML = `<a class="page-link accueil" href="#sommaire"><span class="page-num">⌂</span><span>Sommaire</span></a>` +
  VIGNETTES.map((v, i) => `<div class="nav-groupe"><p class="nav-vignette"><span class="page-num">${num(i)}</span>${esc(v.titre)}</p>${v.pages.map(p => `<a class="page-link" href="#p-${p.id}">${icone(p.bouton)}<span>${esc(p.titre)}</span></a>`).join('')}</div>`).join('') +
  `<a class="page-link accueil" href="#ressources"><span class="page-num">▤</span><span>Ressources</span></a>`;
let epingle = false;
try { epingle = localStorage.getItem('nav-epingle') === 'true'; } catch {}
const large = matchMedia('(min-width: 1100px)');
function nav(ouvert) {
  sidebar.hidden = !ouvert;
  btnPages.setAttribute('aria-expanded', String(ouvert));
  pin.setAttribute('aria-pressed', String(epingle));
  pin.textContent = epingle ? 'Désépingler' : 'Épingler';
  document.body.classList.toggle('nav-pinned', ouvert && epingle && large.matches);
}
nav(epingle && large.matches);
large.addEventListener('change', () => nav(large.matches && epingle));
btnPages.addEventListener('click', () => { nav(sidebar.hidden); if (!sidebar.hidden) ($('[aria-current="page"]', sidebar) || $('.page-link', sidebar)).focus(); });
$('#close-nav').addEventListener('click', () => { nav(false); btnPages.focus(); });
pin.addEventListener('click', () => { epingle = !epingle; try { localStorage.setItem('nav-epingle', String(epingle)); } catch {} nav(true); });
sidebar.addEventListener('click', e => { if (e.target.closest('.page-link') && !document.body.classList.contains('nav-pinned')) nav(false); });
document.addEventListener('click', e => { if (!sidebar.hidden && !document.body.classList.contains('nav-pinned') && !sidebar.contains(e.target) && !btnPages.contains(e.target)) nav(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !viewer.open && !sidebar.hidden && !document.body.classList.contains('nav-pinned')) { nav(false); btnPages.focus(); } });

/* ---------------------------------------------------------------- PLEIN ÉCRAN ET NOTE */
const full = $('#fullscreen');
full.hidden = !document.fullscreenEnabled;
full.addEventListener('click', async () => { try { document.fullscreenElement ? await document.exitFullscreen() : await document.documentElement.requestFullscreen(); } catch {} });
const majNote = () => { $('#note-valeur').textContent = Scores.format(Scores.note()); };
Scores.onChange(majNote); majNote();

if (location.hash === '#contenu') history.replaceState(null, '', '#sommaire');
afficher(true);
