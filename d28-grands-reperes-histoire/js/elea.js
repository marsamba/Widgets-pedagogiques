'use strict';

// Interface SCORM 1.2. L’application fonctionne aussi sans LMS.
window.eleaQuiz = (() => {
  function search(start) {
    try {
      let frame = start;
      for (let i = 0; frame && i < 25; i++) {
        if (frame.API && typeof frame.API.LMSInitialize === 'function') return frame.API;
        if (frame.parent === frame) break;
        frame = frame.parent;
      }
    } catch {}
    return null;
  }
  let api = search(window) || search(window.opener);
  const call = (method, ...args) => {
    try { return api?.[method]?.(...args); } catch { return undefined; }
  };
  if (String(call('LMSInitialize', '')) !== 'true') api = null;
  const total = 10;
  const resume = () => {
    try {
      const data = JSON.parse(call('LMSGetValue', 'cmi.suspend_data') || 'null');
      const a = data?.version === 1 && data.answers;
      return Array.isArray(a) && a.length <= total &&
        a.every(n => Number.isInteger(n) && n >= 0 && n <= 2) ? a : [];
    } catch { return []; }
  };
  function report(answers, score) {
    if (!api) return;
    const done = answers.length === total;
    call('LMSSetValue', 'cmi.core.score.min', '0');
    call('LMSSetValue', 'cmi.core.score.max', '100');
    call('LMSSetValue', 'cmi.core.score.raw', String(score * 100 / total));
    call('LMSSetValue', 'cmi.core.lesson_status', done ? 'completed' : 'incomplete');
    call('LMSSetValue', 'cmi.suspend_data', JSON.stringify({version:1, answers}));
    call('LMSSetValue', 'cmi.core.exit', 'suspend');
    call('LMSCommit', '');
  }
  window.addEventListener('pagehide', event => {
    if (!event.persisted && api) {
      call('LMSFinish', '');
      api = null;
    }
  });
  return Object.freeze({resume, report});
})();
