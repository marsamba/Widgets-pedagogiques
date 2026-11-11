'use strict';
/* =====================================================================
   MODULE ÉLÉA (SCORM 1.2) — séparé de la logique des activités.
   Dans Éléa (activité SCORM), il transmet la note sur 100, l'état
   d'achèvement et une sauvegarde des scores. Hors Éléa (index.html,
   GitHub Pages, Genially, ActivInspire…), il ne fait rien.
   ===================================================================== */
window.Elea = (() => {
  function chercher(fenetre) {
    try {
      let f = fenetre;
      for (let i = 0; f && i < 25; i++) {
        if (f.API && typeof f.API.LMSInitialize === 'function') return f.API;
        if (f.parent === f) break;
        f = f.parent;
      }
    } catch { /* cadre d'une autre origine */ }
    return null;
  }
  let api = chercher(window) || chercher(window.opener);
  const appel = (methode, ...args) => { try { return api?.[methode]?.(...args); } catch { return undefined; } };
  if (api && String(appel('LMSInitialize', '')) !== 'true') api = null;

  let termine = false;
  if (api) termine = ['completed', 'passed'].includes(String(appel('LMSGetValue', 'cmi.core.lesson_status')));

  return Object.freeze({
    get connecte() { return !!api; },
    /* Données sauvegardées dans la tentative SCORM (ou null) */
    charger() {
      if (!api) return null;
      try { return JSON.parse(appel('LMSGetValue', 'cmi.suspend_data') || 'null'); } catch { return null; }
    },
    /* note10 : note sur 10 ; fini : toutes les activités faites ou envoi demandé */
    envoyer(note10, sauvegarde, fini) {
      if (!api) return false;
      if (fini) termine = true;
      appel('LMSSetValue', 'cmi.core.score.min', '0');
      appel('LMSSetValue', 'cmi.core.score.max', '100');
      appel('LMSSetValue', 'cmi.core.score.raw', String(Math.round(note10 * 10)));
      appel('LMSSetValue', 'cmi.core.lesson_status', termine ? 'completed' : 'incomplete');
      appel('LMSSetValue', 'cmi.suspend_data', JSON.stringify(sauvegarde).slice(0, 4000));
      appel('LMSSetValue', 'cmi.core.exit', 'suspend');
      return String(appel('LMSCommit', '')) === 'true';
    },
    terminer() { if (api) { appel('LMSFinish', ''); api = null; } }
  });
})();
window.addEventListener('pagehide', e => { if (!e.persisted) window.Elea.terminer(); });
