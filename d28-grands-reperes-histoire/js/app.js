'use strict';

const $ = (sel, scope = document) => scope.querySelector(sel);
const main = $('#contenu');
const pages = $('#pages');
const sidebar = $('#navigateur');
const pin = $('#pin');
const viewer = $('#viewer');
const routes = ['sommaire', ...SECTIONS.map(s => s[0])];
const panels = new Map();
const titles = ['Sommaire', ...SECTIONS.map(s => s[1])];
const photo = (id, alt = '', attrs = '') => `<img src="assets/images/${id}.webp" alt="${alt}" ${attrs}>`;
const btn = (text, attrs, alt = false) => `<button type="button" class="btn${alt ? ' alt' : ''}" ${attrs}>${text}</button>`;
const pageHead = (i, extra = '') => {
  const [, title, desc, category] = SECTIONS[i];
  return `<header class="page-head tone-${i}"><a href="#sommaire" class="back">← Sommaire</a><p class="eyebrow">Vignette ${String(i+1).padStart(2,'0')} · ${category}</p><h1 tabindex="-1">${title}</h1><p>${desc}</p>${extra}</header>`;
};

const arts = [
  photo('frise', '', 'class="art-frise"'),
  '<div class="roman-art"><span>I</span><span>V</span><span>X</span><small>CHIFFRES ROMAINS</small></div>',
  `<div class="portraits-art">${photo('vercingetorix')}${photo('charlemagne')}${photo('louis_xiv')}</div>`,
  '<div class="match-art"><span>Portrait</span><svg viewBox="0 0 90 60"><path d="M2 15h22c16 0 26 30 42 30h22M2 45h22c16 0 26-30 42-30h22"/><circle cx="3" cy="15" r="3"/><circle cx="87" cy="45" r="3"/><circle cx="3" cy="45" r="3"/><circle cx="87" cy="15" r="3"/></svg><span>Événement</span></div>',
  '<div class="quiz-art"><strong>10</strong><span>QUESTIONS</span></div>'
];

function home() {
  return `<section class="hero">
    <div class="hero-copy"><span class="hero-tag">Dossier 28</span><p class="eyebrow">Se situer dans le temps</p><h1 tabindex="-1">Quels sont les grands repères de l’histoire&nbsp;?</h1><p>Explore les six périodes de la frise et prépare-toi à l’évaluation.</p></div>
    <div class="hero-mark" aria-hidden="true"><svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="37"/><circle cx="50" cy="50" r="30" stroke-dasharray="2 5"/><path d="M59 36 54 55 40 65l5-19 14-10Z" fill="currentColor"/><path d="M50 3v9m0 76v9M3 50h9m76 0h9"/><circle cx="50" cy="50" r="3" fill="white" stroke="white"/></svg></div>
  </section>
  <div class="section-label"><h2>Sommaire</h2><span>5 vignettes</span></div>
  <div class="grid">${SECTIONS.map(([id,title,desc,category], i) =>
    `<article class="card tone-${i}"><a class="card-link" href="#${id}"><div class="card-art" aria-hidden="true"><span class="card-number">${String(i+1).padStart(2,'0')}</span>${arts[i]}</div><div class="card-body"><p class="eyebrow">${category}</p><h3>${title}<span class="arrow" aria-hidden="true">→</span></h3><p>${desc}</p></div></a></article>`).join('')}</div>`;
}

function frise() {
  return `${pageHead(0, '<div class="actions"><a class="btn alt" href="assets/frise/index.html" target="_blank" rel="noopener">Ouvrir la frise seule ↗</a></div>')}<iframe class="frise-frame" src="assets/frise/index.html" title="Frise interactive : place les événements et les exemples dans les deux pages"></iframe>`;
}

const ROMAN = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
function toRoman(n) {
  let out = '';
  for (const [value, symbol] of ROMAN) {
    while (n >= value) { out += symbol; n -= value; }
  }
  return out;
}

function romains() {
  return `${pageHead(1)}
  <div class="lesson-grid">
    <section class="activity"><p class="eyebrow">Les symboles</p><h2>Sept lettres pour écrire les nombres</h2><dl class="symbols">${[[1,'I'],[5,'V'],[10,'X'],[50,'L'],[100,'C'],[500,'D'],[1000,'M']].map(([v,k]) => `<div><dt>${k}</dt><dd>${v.toLocaleString('fr-FR')}</dd></div>`).join('')}</dl>
      <div class="rules"><p><strong>On ajoute</strong> quand la petite valeur est après la grande : <b>VI = 5 + 1 = 6</b>.</p><p><strong>On enlève</strong> dans des groupes comme IV ou IX : <b>IV = 5 − 1 = 4</b> et <b>IX = 10 − 1 = 9</b>.</p></div>
      <form id="convert" class="practice"><label for="number">Essaie avec un nombre de 1 à 3 999.</label><div class="actions"><input id="number" name="number" type="number" min="1" max="3999" required value="21"><button class="btn">Convertir</button></div><p id="roman-out" class="result-text" role="status">21 = XXI</p></form>
    </section>
    <section class="activity"><p class="eyebrow">Les siècles</p><h2>Quel siècle pour cette année ?</h2><p>Un siècle dure <strong>100 ans</strong>. Le premier commence en l’an 1 et se termine en l’an 100. Le deuxième commence en 101 et se termine en 200.</p><p><strong>Astuce :</strong> l’an 1800 est la dernière année du XVIIIᵉ siècle ; l’an 1801 est la première du XIXᵉ.</p>
      <form id="century" class="practice"><label for="year">Entre une année de 1 à 9999.</label><div class="actions"><input id="year" name="year" type="number" min="1" max="9999" required value="1789"><button class="btn">Trouver le siècle</button></div><p id="century-out" class="result-text" role="status">1789 : XVIIIᵉ siècle (1701–1800)</p></form>
    </section>
  </div>`;
}

const PERIOD_IDS = [['tautavel'],['vercingetorix'],['clovis','charlemagne'],['colomb','louis'],['napoleon'],['gaulle']];
function reperes() {
  return `${pageHead(2)}<div class="period-filters" aria-label="Choisir une période">${PERIODES.map(([name,, tone], i) => `<button class="period-chip ${tone}" type="button" data-period="${i}" aria-pressed="${i === 0}">${name}</button>`).join('')}</div>
  <section class="activity" id="period" aria-labelledby="period-title">${periodBody(0)}</section>`;
}
function periodBody(i) {
  const [title, date, tone] = PERIODES[i];
  return `<div class="period-head ${tone}"><h2 id="period-title" tabindex="-1">${title}</h2><p>${date}</p></div><div class="event-grid">${PERIOD_IDS[i].map(id => {
    const item = REPERES[id];
    return `<article class="event">
      <div class="event-photos">${[item.portrait,item.photo].map((pic,j)=> `<button class="image-btn" type="button" data-image="${pic}" data-caption="${j ? item.evenement : item.nom}">${photo(pic, j ? item.evenement : item.nom)}<span aria-hidden="true">⤢</span></button>`).join('')}</div>
      <div class="event-body"><p class="eyebrow">${item.date}</p><h3>${item.nom}</h3><strong>${item.evenement}</strong><p>${item.description}</p></div>
    </article>`;
  }).join('')}</div>`;
}

let activeActivity = 'fiche';
function activites() {
  return `${pageHead(3)}<div class="period-filters" aria-label="Choisir une activité">
    <button type="button" class="period-chip violet" data-activity="fiche" aria-pressed="${activeActivity === 'fiche'}">1 · Fiche élève</button>
    <button type="button" class="period-chip bleu" data-activity="eval" aria-pressed="${activeActivity === 'eval'}">2 · Évaluation</button>
    </div><div id="exercise-fiche"${activeActivity === 'fiche' ? '' : ' hidden'}>${fiche()}</div><div id="exercise-eval"${activeActivity === 'eval' ? '' : ' hidden'}>${evaluation()}</div>`;
}
const selectOptions = (ids, label) => `<option value="">Choisis…</option>${ids.map(id=>`<option value="${id}">${label(id)}</option>`).join('')}`;
function fiche() {
  const gallery = ['tautavel','vercingetorix','clovis','charlemagne','louis','napoleon','gaulle'];
  return `<section class="activity"><p class="eyebrow">Activité 1 · Fiche élève 2, exercice 2</p><h2 tabindex="-1">Qui est-ce ?</h2><p>Observe les portraits. Pour chaque description, choisis le personnage qui correspond.</p>
  <div class="portrait-strip">${gallery.map((id,i)=>{const r=REPERES[id];const letter=String.fromCharCode(65+i);return `<button class="image-btn" type="button" data-image="${r.portrait}" data-caption="Portrait ${letter}">${photo(r.portrait, '')}<strong>Portrait ${letter}</strong></button>`;}).join('')}</div>
  <form class="matches"><div class="match-list">${FICHE.map((id,i)=> `<div class="match-row"><label for="fiche-${i}"><strong>${i+1}.</strong> ${REPERES[id].indice}</label><select id="fiche-${i}" data-answer="${id}" data-correction="Portrait ${String.fromCharCode(65+gallery.indexOf(id))} · ${REPERES[id].nom}">${selectOptions(gallery,k=>`Portrait ${String.fromCharCode(65+gallery.indexOf(k))}`)}</select><small class="row-result"></small></div>`).join('')}</div>
  ${matchingControls()}</form></section>`;
}
function evaluation() {
  const events = ['colomb','charlemagne','tautavel','napoleon','clovis','vercingetorix','gaulle'];
  const dates = ['clovis','charlemagne','gaulle','vercingetorix','napoleon','tautavel','colomb'];
  const eventLabel = id => id === 'tautavel' ? 'Restes d’un humain préhistorique' : REPERES[id].evenement;
  return `<section class="activity"><p class="eyebrow">Activité 2 · Évaluation, exercice 4</p><h2 tabindex="-1">Qui, quoi, quand ?</h2><p>Pour chaque personnage, choisis un événement ou un repère et la date qui va avec.</p>
  <form class="matches"><div class="match-list">${EVAL.map((id,i) => {const r=REPERES[id];return `<div class="match-row triple">
    <div class="named-portrait">${photo(r.portrait)}<strong>${r.nom}</strong></div>
    <label>Événement ou repère<span class="sr"> pour ${r.nom}</span><select data-answer="${id}" data-correction="${eventLabel(id)}">${selectOptions(events,eventLabel)}</select></label>
    <label>Date<span class="sr"> pour ${r.nom}</span><select data-answer="${id}" data-correction="${DATES_EVAL[id]}">${selectOptions(dates,k=>DATES_EVAL[k])}</select></label><small class="row-result"></small>
  </div>`;}).join('')}</div>${matchingControls()}</form></section>`;
}
function matchingControls() {
  return '<div class="actions"><button type="submit" class="btn">Vérifier</button><button type="reset" class="btn alt">Recommencer l’activité</button></div><p class="feedback" role="status"></p>';
}
function clearMatch(form) {
  form.querySelectorAll('[data-result]').forEach(el => delete el.dataset.result);
  form.querySelectorAll('.row-result').forEach(el => el.textContent = '');
  $('.feedback',form).textContent = '';
}

const resumedQuiz = window.eleaQuiz.resume();
const quizState = {answers: resumedQuiz, index: resumedQuiz.length, chosen:null};
function quizScore() {
  return quizState.answers.reduce((sum, a, i)=>sum + Number(a === QUIZ[i][2]),0);
}
function quiz() {
  return `${pageHead(4)}<section id="quiz-panel" class="activity quiz-panel">${quizBody()}</section>`;
}
function quizBody() {
  const {answers,index,chosen} = quizState;
  const score = quizScore();
  const total = QUIZ.length;
  if (index === total) {
    return `<div class="quiz-end"><p class="eyebrow">Quiz terminé</p><h2 tabindex="-1">Ton score final</h2><div class="score-final">${score} <span>/ ${total}</span></div><p>${score === total ? 'Bravo, tu maîtrises les grands repères !' : 'Tu peux revoir les repères puis refaire le quiz.'}</p><div class="actions">${btn('Recommencer le quiz','data-quiz="reset"')}<a class="btn alt" href="#sommaire">Retour au sommaire</a></div></div>`;
  }
  const [question, options, correct, explanation, pic] = QUIZ[index];
  const validated = index < answers.length;
  const answer = answers[index];
  return `<div class="quiz-top"><div class="progress"><label for="quiz-progress">Question ${index+1} / ${total}</label><progress id="quiz-progress" value="${answers.length}" max="${total}">${answers.length} / ${total}</progress></div><div class="score" aria-live="polite">Score : <strong>${score} / ${total}</strong></div></div>
    <h2 id="quiz-question" tabindex="-1">${question}</h2>
    <div class="quiz-layout${pic ? ' has-figure' : ''}">${pic ? `<figure class="figure">${photo(pic)}</figure>` : ''}
    <form id="quiz-form"><fieldset aria-labelledby="quiz-question" ${validated ? 'disabled' : ''} class="choices">
      ${options.map((op,i)=>`<label class="choice" ${validated && (i === correct || i === answer) ? `data-result="${i === correct ? 'good' : 'bad'}"` : ''}><input type="radio" name="answer" value="${i}" ${(validated ? answer : chosen) === i ? 'checked' : ''} required><span>${op}</span>${validated && i === correct ? '<small>✓ Bonne réponse</small>' : validated && i === answer ? '<small>✗ Ta réponse</small>' : ''}</label>`).join('')}
    </fieldset>
    <p class="feedback ${validated ? (answer === correct ? 'good' : 'warn') : ''}" id="quiz-feedback" tabindex="-1" ${validated ? 'role="status"' : ''}>${validated ? (answer === correct ? '✓ Bravo ! ' : '✗ À revoir. ') + explanation : 'Choisis une réponse, puis valide-la.'}</p>
    <div class="actions">${validated ? btn(index + 1 === total ? 'Voir le résultat' : 'Question suivante','data-quiz="next"') : '<button class="btn" type="submit">Valider ma réponse</button>'}${btn('Recommencer le quiz','data-quiz="reset"',true)}</div></form></div>`;
}
function updateQuiz(focus) {
  $('#quiz-panel').innerHTML = quizBody();
  $(focus, $('#quiz-panel'))?.focus();
}

const renderers = [home, frise, romains, reperes, activites, quiz];
$('#page-links').innerHTML = routes.map((route, i) => `<a class="page-link" href="#${route}"><span class="page-num">${i ? String(i).padStart(2,'0') : '⌂'}</span><span>${titles[i]}</span></a>`).join('');
let current;
let pinned = false;
try { pinned = localStorage.getItem('d28-pinned') === 'true'; } catch {}
const wide = matchMedia('(min-width: 1000px)');
function navState(open) {
  sidebar.hidden = !open;
  pages.setAttribute('aria-expanded', String(open));
  pin.setAttribute('aria-pressed', String(pinned));
  pin.textContent = pinned ? 'Désépingler' : 'Épingler';
  document.body.classList.toggle('nav-pinned', open && pinned && wide.matches);
}
navState(pinned && wide.matches);
wide.addEventListener('change', () => navState(wide.matches && pinned));
pages.addEventListener('click', () => {
  navState(sidebar.hidden);
  if (!sidebar.hidden && !document.body.classList.contains('nav-pinned')) {
    ($('[aria-current="page"]', sidebar) || $('.page-link', sidebar)).focus();
  }
});
$('#close-nav').addEventListener('click',()=>{navState(false);pages.focus();});
pin.addEventListener('click', () => {
  pinned = !pinned;
  try {localStorage.setItem('d28-pinned', String(pinned));} catch {}
  navState(true);
});
sidebar.addEventListener('click', e => {
  if (!e.target.closest('.page-link')) return;
  if (!document.body.classList.contains('nav-pinned')) navState(false);
  if (e.target.closest('a').hash === '#' + current) $('h1',main)?.focus();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !viewer.open && !sidebar.hidden && !document.body.classList.contains('nav-pinned')) {
    navState(false);
    pages.focus();
  }
});
document.addEventListener('click', e => {
  if (sidebar.hidden || document.body.classList.contains('nav-pinned')) return;
  if (!sidebar.contains(e.target) && !pages.contains(e.target)) navState(false);
});
function renderPage(first = false) {
  const hash = location.hash.slice(1);
  if (hash === 'contenu') return;
  const route = routes.includes(hash) ? hash : 'sommaire';
  if (route === current) return;
  current = route;
  for (const [id,panel] of panels) panel.hidden = id !== current;
  if (!panels.has(route)) {
    const panel = document.createElement('div');
    panel.className = 'screen';
    panel.innerHTML = renderers[routes.indexOf(route)]();
    main.append(panel);
    panels.set(route,panel);
  }
  if (route === 'quiz') $('#quiz-panel').innerHTML = quizBody();
  document.querySelectorAll('[data-nav],.page-link').forEach(el => {
    if (el.hash === '#' + route) el.setAttribute('aria-current','page');
    else el.removeAttribute('aria-current');
  });
  if (!first) {
    window.scrollTo({top:0});
    $('h1',panels.get(route)).focus({preventScroll:true});
  }
}
window.addEventListener('hashchange', () => renderPage());
if (location.hash === '#contenu') history.replaceState(null,'','#sommaire');
renderPage(true);

const full = $('#fullscreen');
full.hidden = !document.fullscreenEnabled;
full.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {}
});
document.addEventListener('fullscreenchange', () => {
  const label = document.fullscreenElement ? 'Quitter le plein écran' : 'Plein écran';
  full.title = label;
  full.setAttribute('aria-label',label);
});

let view;
function viewOpen(data, opener) {
  view = {...data, opener, zoom:1};
  updateView();
  viewer.showModal();
  $('#close-viewer').focus();
}
function updateView() {
  const {title,img,zoom} = view;
  $('#viewer-title').textContent = title;
  const canvas = $('#viewer-canvas');
  canvas.classList.toggle('is-zoom', zoom > 1);
  canvas.style.setProperty('--zoom',`${100*zoom}%`);
  canvas.innerHTML = `<img src="${img}" alt="${title}">`;
  canvas.scrollTo(0,0);
  $('#viewer-controls').innerHTML = `${btn('−',`data-view="out" aria-label="Réduire le zoom" ${zoom <= 1 ? 'disabled' : ''}`,true)}<span>${Math.round(zoom*100)} %</span>${btn('+',`data-view="in" aria-label="Agrandir" ${zoom >= 3 ? 'disabled' : ''}`,true)}`;
}
$('#close-viewer').addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>view.opener.focus());
viewer.addEventListener('click',e=>{
  if(e.target === viewer) { viewer.close(); return; }
  const control=e.target.closest('[data-view]');
  if (!control) return;
  const cmd=control.dataset.view;
  if (cmd==='out') view.zoom-=0.5;
  if (cmd==='in') view.zoom+=0.5;
  updateView();
  const newControl = $(`[data-view="${cmd}"]:not(:disabled)`,viewer);
  (newControl || $('#viewer-canvas')).focus();
});

main.addEventListener('click', e => {
  const target = e.target.closest('button');
  if (!target) return;
  const d = target.dataset;
  if (d.image) viewOpen({title:d.caption,img:`assets/images/${d.image}.webp`},target);
  if (d.period !== undefined) {
    main.querySelectorAll('[data-period]').forEach(b=>b.setAttribute('aria-pressed', String(b===target)));
    $('#period').innerHTML = periodBody(+d.period);
    $('#period-title').focus({preventScroll:true});
  }
  if (d.activity) {
    activeActivity = d.activity;
    main.querySelectorAll('[data-activity]').forEach(b=>b.setAttribute('aria-pressed', String(b===target)));
    for (const k of ['fiche','eval']) $(`#exercise-${k}`).hidden = k !== activeActivity;
    $(`#exercise-${activeActivity} h2`).focus({preventScroll:true});
  }
  if (d.quiz === 'next' && quizState.index < quizState.answers.length) {
    quizState.index++;
    quizState.chosen = null;
    updateQuiz('h2');
  }
  if (d.quiz === 'reset') {
    Object.assign(quizState,{answers:[],index:0,chosen:null});
    window.eleaQuiz.report([],0);
    updateQuiz('h2');
  }
});

main.addEventListener('input',e=>{
  if (e.target.matches('#quiz-form input[name="answer"]')) quizState.chosen=Number(e.target.value);
  if (e.target.matches('.matches select')) {
    const form = e.target.form;
    if (form.querySelector('[data-result]')) clearMatch(form);
  }
});
main.addEventListener('reset', e => {
  if (e.target.matches('.matches')) clearMatch(e.target);
});
main.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  if (form.id === 'convert') $('#roman-out').textContent = `${form.elements.number.value} = ${toRoman(Number(form.elements.number.value))}`;
  if (form.id === 'century') {
    const year = Number(form.elements.year.value), century=Math.ceil(year/100);
    $('#century-out').textContent = `${year} : ${toRoman(century)}${century === 1 ? 'ᵉʳ' : 'ᵉ'} siècle (${(century-1)*100+1}–${century*100})`;
  }
  if (form.matches('.matches')) {
    let score = 0;
    const rows = [...form.querySelectorAll('.match-row')];
    rows.forEach(row => {
      const selects=[...row.querySelectorAll('select')];
      const correct=selects.every(sel=>{
        return sel.value === sel.dataset.answer;
      });
      selects.forEach(sel => sel.dataset.result = sel.value === sel.dataset.answer ? 'good' : 'bad');
      if (correct) score++;
      $('.row-result',row).textContent = correct ? '✓ Bien associé' : '↻ À revoir. Réponse : ' + selects.map(sel=>sel.dataset.correction).join(' · ');
      $('.row-result',row).dataset.result = correct ? 'good' : 'bad';
    });
    $('.feedback',form).textContent = score === rows.length ? '✓ Bravo, toutes tes associations sont justes !' : `${score} / ${rows.length} associations complètes. Tu peux corriger tes réponses.`;
  }
  if (form.id === 'quiz-form' && quizState.index === quizState.answers.length) {
    const raw = new FormData(form).get('answer');
    if (raw === null) return;
    quizState.answers.push(Number(raw));
    window.eleaQuiz.report(quizState.answers, quizScore());
    updateQuiz('#quiz-feedback');
  }
});
