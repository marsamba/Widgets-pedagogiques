'use strict';
/* =====================================================================
   SCORES — une variable score par activité + une note générale sur 10.
   Note générale = moyenne des réussites de chaque activité × 10
   (chaque activité compte autant ; une activité non faite compte 0).
   ===================================================================== */
window.Scores = (() => {
  const activites = VIGNETTES.flatMap(v => v.pages.filter(p => p.type === 'activite').map(p => ({id: p.id, titre: p.titre, vignette: v.id})));
  const cle = 'scores-' + SEANCE.id;
  let etat = {};            // { idActivite: {score, max} }
  const abonnes = [];

  // Reprise : d'abord la tentative Éléa, sinon la mémoire du navigateur
  const repris = window.Elea.charger();
  if (repris?.v === 2 && repris.s) etat = repris.s;
  else { try { etat = JSON.parse(localStorage.getItem(cle) || '{}') || {}; } catch { etat = {}; } }

  const note = () => {
    if (!activites.length) return 0;
    const somme = activites.reduce((t, a) => t + (etat[a.id] ? etat[a.id].score / etat[a.id].max : 0), 0);
    return Math.round(somme / activites.length * 20) / 2;   // arrondi au demi-point
  };
  const faites = () => activites.filter(a => etat[a.id]).length;
  const toutFini = () => faites() === activites.length;

  function sauver(envoiDemande = false) {
    try { localStorage.setItem(cle, JSON.stringify(etat)); } catch {}
    const ok = window.Elea.envoyer(note(), {v: 2, s: etat}, envoiDemande || toutFini());
    abonnes.forEach(f => f());
    return ok;
  }

  return {
    activites,
    note, faites, toutFini,
    get: id => etat[id] || null,
    enregistrer(id, score, max) { etat[id] = {score, max}; sauver(); },
    effacer(id) { delete etat[id]; sauver(); },
    toutEffacer() { etat = {}; sauver(); },
    envoyer: () => sauver(true),
    onChange: f => abonnes.push(f),
    format: n => String(n).replace('.', ',')
  };
})();
