// ============================================================
//  logger.js — Log a test form
//  Handles form submit, reset, and star init.
// ============================================================

const Logger = (() => {

  const STAR_IDS = ['sr-walls', 'sr-floor', 'sr-ceil', 'sr-glass', 'sr-tex', 'sr-use'];

  function init() {
    STAR_IDS.forEach(id => UI.buildStars(id));
    // Pre-fill name from config
    const name = Sync.getConfig().name;
    if (name) document.getElementById('l-who').value = name;
  }

  function collectEntry() {
    const comp = document.getElementById('l-comp').value;
    const opt  = document.getElementById('l-opt').value.trim();
    if (!comp || !opt) return null;
    return {
      id:       Date.now(),
      comp,
      opt,
      who:      document.getElementById('l-who').value.trim() || Sync.getConfig().name || '?',
      scale:    document.getElementById('l-scale').value,
      capTime:  document.getElementById('l-cap').value,
      procTime: document.getElementById('l-proc').value,
      cost:     document.getElementById('l-cost').value.trim(),
      pass:     document.getElementById('l-pass').value,
      scores: {
        walls: UI.getStarVal('sr-walls'),
        floor: UI.getStarVal('sr-floor'),
        ceil:  UI.getStarVal('sr-ceil'),
        glass: UI.getStarVal('sr-glass'),
        tex:   UI.getStarVal('sr-tex'),
        use:   UI.getStarVal('sr-use'),
      },
      failures: document.getElementById('l-fail').value.trim(),
      notes:    document.getElementById('l-notes').value.trim(),
      rec:      document.getElementById('l-rec').value,
      date:     new Date().toISOString().split('T')[0],
      ts:       Date.now(),
    };
  }

  async function submit() {
    if (!Sync.getConfig().binId) {
      UI.toast('Configure JSONBin in Setup first', true);
      return;
    }
    const entry = collectEntry();
    if (!entry) {
      UI.toast('Compartment and option are required', true);
      return;
    }
    const ok = await Sync.addLog(entry);
    if (ok) {
      UI.toast('Saved & synced ✓');
      reset();
      App.refresh();
    } else {
      UI.toast('Sync failed — check credentials', true);
    }
  }

  function reset() {
    ['l-comp', 'l-opt', 'l-cap', 'l-proc', 'l-cost', 'l-fail', 'l-notes'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('l-pass').value  = 'pass';
    document.getElementById('l-rec').value   = 'recommended';
    document.getElementById('l-scale').value = 'small';
    STAR_IDS.forEach(id => UI.resetStars(id));
  }

  return { init, submit, reset };

})();
