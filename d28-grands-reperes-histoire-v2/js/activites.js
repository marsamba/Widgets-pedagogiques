'use strict';
/* =====================================================================
   MOTEURS D'ACTIVITÉS — réutilisables d'une séance à l'autre.
   placer  : glisser-déposer (frise, lignes, périodes, texte à trous)
   romains : composer des nombres en chiffres romains
   choix   : une réponse à toucher par ligne
   relier  : relier des colonnes par des traits
   quiz    : questions une par une, une seule validation par question
   Chaque moteur renvoie { pret(), verifier() → {score,max}, reinit() }.
   Interaction : toucher/cliquer un élément puis sa place, ou le faire glisser.
   ===================================================================== */
const Moteurs = (() => {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const imgSrc = n => `assets/images/${n}.webp`;
  const melanger = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const marque = ok => `<span class="marque ${ok ? 'ok' : 'ko'}" aria-hidden="true">${ok ? '✓' : '✗'}</span>`;

  /* ---------- Glisser-déposer + toucher-placer (souris, doigt, clavier) ---------- */
  function rendreDeplacable(racine, {deposer, estVerrouille}) {
    let choisi = null, glisse = null;
    const choisir = j => {
      racine.querySelectorAll('.jeton[aria-pressed="true"]').forEach(x => x.setAttribute('aria-pressed', 'false'));
      choisi = j; if (j) j.setAttribute('aria-pressed', 'true');
      racine.classList.toggle('en-choix', !!j);
    };
    racine.addEventListener('click', e => {
      if (estVerrouille() || glisse?.bouge) return;
      const jeton = e.target.closest('.jeton');
      const cible = e.target.closest('[data-cible]');
      if (jeton) {
        if (!choisi) return choisir(jeton);                       // 1er toucher : on prend l'élément
        if (jeton === choisi) return choisir(null);               // re-toucher : on le repose
        if (jeton.closest('.banque')) return choisir(jeton);      // autre élément de la réserve
        deposer(choisi, cible); return choisir(null);             // élément déjà placé : on prend sa place
      }
      if (cible && choisi) { deposer(choisi, cible); choisir(null); }
    });
    racine.addEventListener('pointerdown', e => {
      const j = e.target.closest('.jeton');
      if (!j || estVerrouille() || e.button > 0) return;
      glisse = {j, x: e.clientX, y: e.clientY, bouge: false, id: e.pointerId};
    });
    racine.addEventListener('pointermove', e => {
      if (!glisse || e.pointerId !== glisse.id) return;
      const dx = e.clientX - glisse.x, dy = e.clientY - glisse.y;
      if (!glisse.bouge && Math.hypot(dx, dy) > 7) {
        glisse.bouge = true;
        const r = glisse.j.getBoundingClientRect();
        glisse.fantome = glisse.j.cloneNode(true);
        Object.assign(glisse.fantome.style, {position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', margin: 0, zIndex: 50, pointerEvents: 'none'});
        glisse.fantome.classList.add('fantome');
        document.body.append(glisse.fantome);
        glisse.ox = r.left; glisse.oy = r.top;
        glisse.j.classList.add('origine');
        try { racine.setPointerCapture(e.pointerId); } catch {}
      }
      if (glisse.bouge) {
        e.preventDefault();
        glisse.fantome.style.transform = `translate(${dx}px,${dy}px) rotate(-2deg)`;
        racine.querySelectorAll('.survol').forEach(z => z.classList.remove('survol'));
        document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-cible]')?.classList.add('survol');
      }
    });
    const fin = e => {
      if (!glisse || e.pointerId !== glisse.id) return;
      if (glisse.bouge) {
        glisse.fantome.remove(); glisse.j.classList.remove('origine');
        racine.querySelectorAll('.survol').forEach(z => z.classList.remove('survol'));
        const cible = e.type === 'pointerup' && document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-cible]');
        if (cible && racine.contains(cible)) deposer(glisse.j, cible);
        choisir(null);
        setTimeout(() => { glisse = null; }, 0);
      } else glisse = null;
    };
    racine.addEventListener('pointerup', fin);
    racine.addEventListener('pointercancel', fin);
    racine.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-cible]:not(.jeton)')) { e.preventDefault(); e.target.click(); }
      if (e.key === 'Escape') choisir(null);
    });
    return {annuler: () => choisir(null)};
  }

  const jetonHTML = it => `<button type="button" class="jeton${it.img ? ' a-image' : ''}" data-id="${esc(it.id)}" aria-pressed="false">${it.img ? `<img src="${imgSrc(it.img)}" alt="" draggable="false">` : ''}<span>${esc(it.texte)}</span></button>`;

  /* ================= PLACER ================= */
  function placer(el, d) {
    const items = melanger(d.items);
    const parId = Object.fromEntries(d.items.map(i => [i.id, i]));
    let verrou = false;
    const zoneHTML = z => `<div class="zone${z.multiple ? ' multiple' : ''}" data-cible="${z.id}" tabindex="0" role="button" aria-label="Place : ${esc(z.label)}" style="--c:${z.couleur || 'var(--accent)'}">` +
      (d.disposition === 'lignes'
        ? `<div class="emplacement"></div><p class="zone-label">${esc(z.label)}</p>`
        : `<div class="emplacement"></div><p class="zone-label">${esc(z.label)}</p>`) + `<small class="zone-correction"></small></div>`;
    let corps;
    if (d.disposition === 'texte') {
      const z = {};
      corps = `<p class="texte-trous">${esc(d.texte).replace(/ ([:;!?])/g, '\u00a0$1').replace(/\[(\w+)\]/g, (_, id) => { z[id] = 1; return `<span class="zone trou" data-cible="t-${id}" data-attend="${id}" tabindex="0" role="button" aria-label="Trou"><span class="emplacement"></span><small class="zone-correction"></small></span>`; })}</p>`;
      d.zones = Object.keys(z).map(id => ({id: 't-' + id, attend: [id]}));
    } else corps = `<div class="zones zones-${d.disposition}" style="--n:${d.zones.length}">${d.zones.map(zoneHTML).join('')}</div>`;
    const banque = `<div class="banque" data-cible="banque" aria-label="Éléments à placer">${items.map(jetonHTML).join('')}</div>`;
    el.innerHTML = `<div class="placer placer-${d.disposition}">${d.disposition === 'frise' || d.disposition === 'periodes' ? corps + banque : banque + corps}</div>`;
    const racine = el.firstElementChild;
    const zoneDe = id => racine.querySelector(`[data-cible="${id}"]`);
    const dnd = rendreDeplacable(racine, {
      estVerrouille: () => verrou,
      deposer(j, cible) {
        const dest = cible.dataset.cible === 'banque' ? racine.querySelector('.banque') : cible.querySelector('.emplacement');
        if (!dest) return;
        if (!cible.classList.contains('multiple') && dest !== racine.querySelector('.banque')) {
          const occupant = dest.querySelector('.jeton');
          if (occupant && occupant !== j) racine.querySelector('.banque').append(occupant);
        }
        dest.append(j);
        racine.querySelectorAll('.zone').forEach(z => z.classList.toggle('remplie', !!z.querySelector('.jeton')));
      }
    });
    return {
      pret: () => !racine.querySelector('.banque .jeton'),
      reste: () => racine.querySelectorAll('.banque .jeton').length,
      verifier() {
        verrou = true; dnd.annuler();
        let score = 0;
        d.zones.forEach(z => {
          const zone = zoneDe(z.id);
          const jetons = [...zone.querySelectorAll('.jeton')];
          let toutBon = jetons.length > 0;
          jetons.forEach(j => {
            const ok = z.attend.includes(j.dataset.id);
            if (ok) score++; else toutBon = false;
            j.dataset.result = ok ? 'ok' : 'ko';
            j.insertAdjacentHTML('beforeend', marque(ok));
            if (!ok && z.multiple && d.correction) j.insertAdjacentHTML('beforeend', `<small class="jeton-correction">→ ${esc(d.correction(j.dataset.id))}</small>`);
          });
          zone.dataset.result = toutBon ? 'ok' : 'ko';
          if (!toutBon && !z.multiple) zone.querySelector('.zone-correction').textContent = '→ ' + z.attend.map(a => parId[a].texte).join(', ');
        });
        return {score, max: d.items.length};
      }
    };
  }

  /* ================= CHIFFRES ROMAINS ================= */
  const enRomain = n => [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']].reduce((s, [v, l]) => { while (n >= v) { s += l; n -= v; } return s; }, '');
  function romains(el, d) {
    let verrou = false, actif = 0;
    const rep = d.nombres.map(() => '');
    el.innerHTML = `<div class="romains"><div class="cartes-nombres">${d.nombres.map((n, i) => `<button type="button" class="carte-nombre" data-i="${i}" aria-pressed="${i === 0}"><strong>${n}</strong><span class="saisie" aria-live="polite"></span></button>`).join('')}</div>
      <div class="clavier" aria-label="Lettres romaines">${d.lettres.map(l => `<button type="button" class="touche" data-l="${l}">${l}</button>`).join('')}<button type="button" class="touche effacer" data-l="⌫" aria-label="Effacer une lettre">⌫</button></div></div>`;
    const cartes = [...el.querySelectorAll('.carte-nombre')];
    const maj = () => cartes.forEach((c, i) => { c.querySelector('.saisie').textContent = rep[i] || '…'; c.setAttribute('aria-pressed', String(i === actif)); c.classList.toggle('remplie', !!rep[i]); });
    const taper = l => {
      if (verrou) return;
      rep[actif] = l === '⌫' ? rep[actif].slice(0, -1) : (rep[actif] + l).slice(0, 6);
      maj();
    };
    el.addEventListener('click', e => {
      const c = e.target.closest('.carte-nombre'), t = e.target.closest('.touche');
      if (c && !verrou) { actif = +c.dataset.i; maj(); }
      if (t) taper(t.dataset.l);
    });
    el.addEventListener('keydown', e => {
      const k = e.key.toUpperCase();
      if (d.lettres.includes(k)) { taper(k); e.preventDefault(); }
      if (e.key === 'Backspace') { taper('⌫'); e.preventDefault(); }
    });
    maj();
    return {
      pret: () => rep.every(Boolean),
      reste: () => rep.filter(r => !r).length,
      verifier() {
        verrou = true; let score = 0;
        cartes.forEach((c, i) => {
          const juste = enRomain(d.nombres[i]), ok = rep[i] === juste;
          if (ok) score++;
          c.dataset.result = ok ? 'ok' : 'ko'; c.setAttribute('aria-pressed', 'false');
          c.insertAdjacentHTML('beforeend', marque(ok) + (ok ? '' : `<small class="correction">→ ${juste}</small>`));
        });
        return {score, max: d.nombres.length};
      }
    };
  }

  /* ================= CHOIX (une réponse par ligne) ================= */
  function choix(el, d) {
    let verrou = false;
    const rep = d.lignes.map(() => null);
    el.innerHTML = `<div class="choix-grille">${d.lignes.map(([q, ops], i) => `<div class="choix-ligne" role="radiogroup" aria-label="${esc(q)}"><p>${esc(q)}</p><div class="pastilles">${ops.map((o, j) => `<button type="button" class="pastille" role="radio" aria-checked="false" data-i="${i}" data-j="${j}">${esc(o)}</button>`).join('')}</div></div>`).join('')}</div>`;
    el.addEventListener('click', e => {
      const b = e.target.closest('.pastille'); if (!b || verrou) return;
      const i = +b.dataset.i; rep[i] = +b.dataset.j;
      el.querySelectorAll(`.pastille[data-i="${i}"]`).forEach(x => x.setAttribute('aria-checked', String(x === b)));
    });
    return {
      pret: () => rep.every(r => r !== null),
      reste: () => rep.filter(r => r === null).length,
      verifier() {
        verrou = true; let score = 0;
        d.lignes.forEach(([, , bonne], i) => {
          const ok = rep[i] === bonne; if (ok) score++;
          el.querySelectorAll(`.pastille[data-i="${i}"]`).forEach(b => {
            const j = +b.dataset.j;
            if (j === bonne) { b.dataset.result = 'ok'; b.insertAdjacentHTML('beforeend', marque(true)); }
            else if (j === rep[i]) { b.dataset.result = 'ko'; b.insertAdjacentHTML('beforeend', marque(false)); }
          });
        });
        return {score, max: d.lignes.length};
      }
    };
  }

  /* ================= RELIER ================= */
  function relier(el, d) {
    let verrou = false, choisi = null;
    const liens = d.colonnes.slice(1).map(() => new Map());   // liens[c] : id colonne c → id colonne c+1
    el.innerHTML = `<div class="relier" style="--cols:${d.colonnes.length}"><svg class="traits" aria-hidden="true"></svg>${d.colonnes.map((col, c) => `<div class="colonne">${col.map(it => `<button type="button" class="point" data-c="${c}" data-id="${it.id}" aria-pressed="false">${it.img ? `<img src="${imgSrc(it.img)}" alt="">` : ''}<span>${esc(it.texte)}</span></button>`).join('')}</div>`).join('')}</div>`;
    const racine = el.firstElementChild, svg = racine.querySelector('svg');
    const btn = (c, id) => racine.querySelector(`.point[data-c="${c}"][data-id="${id}"]`);
    function dessiner(extra = []) {
      const R = racine.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`);
      const seg = (c, a, b, cls) => {
        const A = btn(c, a).getBoundingClientRect(), B = btn(c + 1, b).getBoundingClientRect();
        return `<line class="${cls}" x1="${A.right - R.left}" y1="${A.top + A.height / 2 - R.top}" x2="${B.left - R.left}" y2="${B.top + B.height / 2 - R.top}"/><circle class="${cls}" cx="${A.right - R.left}" cy="${A.top + A.height / 2 - R.top}" r="5"/><circle class="${cls}" cx="${B.left - R.left}" cy="${B.top + B.height / 2 - R.top}" r="5"/>`;
      };
      svg.innerHTML = liens.flatMap((m, c) => [...m].map(([a, b]) => seg(c, a, b, verrou ? (a === b ? 'ok' : 'ko') : ''))).join('') + extra.map(([c, a, b]) => seg(c, a, b, 'attendu')).join('');
      racine.querySelectorAll('.point').forEach(p => {
        const c = +p.dataset.c, id = p.dataset.id;
        p.classList.toggle('lie', (c < liens.length && liens[c].has(id)) || (c > 0 && [...liens[c - 1].values()].includes(id)));
      });
    }
    new ResizeObserver(() => dessiner(verrou ? attendus : [])).observe(racine);
    let attendus = [];
    racine.addEventListener('click', e => {
      const p = e.target.closest('.point'); if (!p || verrou) return;
      if (!choisi) { choisi = p; p.setAttribute('aria-pressed', 'true'); return; }
      const c1 = +choisi.dataset.c, c2 = +p.dataset.c;
      choisi.setAttribute('aria-pressed', 'false');
      if (p === choisi) { choisi = null; return; }
      if (Math.abs(c1 - c2) !== 1) { choisi = p; p.setAttribute('aria-pressed', 'true'); return; }
      const [g, dr] = c1 < c2 ? [choisi, p] : [p, choisi];
      const m = liens[Math.min(c1, c2)];
      for (const [a, b] of m) if (b === dr.dataset.id) m.delete(a);       // une seule arrivée par point
      if (m.get(g.dataset.id) === dr.dataset.id) m.delete(g.dataset.id); else m.set(g.dataset.id, dr.dataset.id);
      choisi = null; dessiner();
    });
    return {
      pret: () => liens.every(m => m.size === d.ids.length),
      reste: () => liens.reduce((t, m) => t + d.ids.length - m.size, 0),
      verifier() {
        verrou = true; let score = 0;
        d.ids.forEach(id => {
          const ok = liens.every(m => m.get(id) === id);
          if (ok) score++;
          btn(0, id).dataset.result = ok ? 'ok' : 'ko';
          btn(0, id).insertAdjacentHTML('beforeend', marque(ok));
          liens.forEach((m, c) => { if (m.get(id) !== id) attendus.push([c, id, id]); });
        });
        dessiner(attendus);
        return {score, max: d.ids.length};
      }
    };
  }

  /* ================= QUIZ ================= */
  function quiz(el, d, ctx) {
    const Q = d.questions, total = Q.length;
    let etat = {rep: [], i: 0, choix: null};
    const score = () => etat.rep.reduce((t, r, i) => t + (r === Q[i][2]), 0);
    function rendre(focus) {
      const s = score();
      if (etat.i === total) {
        el.innerHTML = `<div class="quiz-fin"><p class="eyebrow">Quiz terminé</p><h2 tabindex="-1">Ton score</h2><div class="score-final">${s}<span> / ${total}</span></div><p>${s === total ? 'Bravo, tu maîtrises les grands repères !' : 'Revois les repères, puis refais le quiz.'}</p><div class="actions"><button type="button" class="btn" data-q="reset">Recommencer le quiz</button><a class="btn alt" href="#p-bilan">Voir mon bilan</a></div></div>`;
      } else {
        const [q, ops, bonne, expl, img] = Q[etat.i];
        const valide = etat.i < etat.rep.length, r = etat.rep[etat.i];
        el.innerHTML = `<div class="quiz">
          <div class="quiz-haut"><div class="progression"><span>Question ${etat.i + 1} / ${total}</span><progress value="${etat.rep.length}" max="${total}"></progress></div><div class="score-pastille" aria-live="polite">Score : <strong>${s} / ${total}</strong></div></div>
          <div class="quiz-corps${img ? ' avec-image' : ''}">${img ? `<figure class="quiz-image"><img src="${imgSrc(img)}" alt=""></figure>` : ''}
          <div class="quiz-q"><h2 id="qq" tabindex="-1">${esc(q)}</h2>
          <div class="reponses" role="radiogroup" aria-labelledby="qq">${ops.map((o, j) => {
            const res = valide && (j === bonne ? 'ok' : j === r ? 'ko' : '');
            return `<button type="button" class="reponse" role="radio" data-j="${j}" aria-checked="${(valide ? r : etat.choix) === j}" ${valide ? 'aria-disabled="true"' : ''} ${res ? `data-result="${res}"` : ''}><span class="lettre">${'ABC'[j]}</span>${esc(o)}${res ? marque(res === 'ok') : ''}</button>`;
          }).join('')}</div>
          <p class="retour ${valide ? (r === bonne ? 'ok' : 'ko') : ''}" id="retour" tabindex="-1" role="status">${valide ? (r === bonne ? '✓ Bravo ! ' : '✗ Pas tout à fait. ') + esc(expl) : 'Choisis une réponse, puis valide.'}</p>
          <div class="actions">${valide ? `<button type="button" class="btn" data-q="suite">${etat.i + 1 === total ? 'Voir mon score' : 'Question suivante →'}</button>` : `<button type="button" class="btn" data-q="valider" ${etat.choix === null ? 'disabled' : ''}>Valider ma réponse</button>`}<button type="button" class="btn alt" data-q="reset">Recommencer le quiz</button></div></div></div></div>`;
      }
      if (focus) el.querySelector(focus)?.focus({preventScroll: true});
    }
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-q],.reponse'); if (!b) return;
      if (b.classList.contains('reponse')) { if (etat.i < etat.rep.length) return; etat.choix = +b.dataset.j; rendre(); el.querySelector(`.reponse[data-j="${etat.choix}"]`).focus(); return; }
      const a = b.dataset.q;
      if (a === 'valider' && etat.choix !== null) { etat.rep.push(etat.choix); etat.choix = null; ctx.enregistrer(score(), total); rendre('#retour'); }
      if (a === 'suite') { etat.i++; rendre('h2'); }
      if (a === 'reset') { etat = {rep: [], i: 0, choix: null}; ctx.effacer(); rendre('h2'); }
    });
    rendre();
    return {autonome: true};
  }

  return {placer, romains, choix, relier, quiz};
})();
