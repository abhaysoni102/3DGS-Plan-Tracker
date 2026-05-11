// ============================================================
//  app.js — Main app: init, navigation, global refresh
// ============================================================

const App = (() => {

  // Called whenever data changes (load or push)
  function refresh() {
    Roadmap.render();
    Compare.render();
    Activity.render();
  }

  function init() {
    // Wire up sync callback
    Sync.onUpdate(() => refresh());

    // Load saved config into Setup form
    const cfg = Sync.loadConfig();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('cfg-binid',  cfg.binId);
    set('cfg-apikey', cfg.apiKey);
    set('cfg-name',   cfg.name);

    // Init sub-modules
    Logger.init();
    Roadmap.render();
    Compare.buildTabs();

    // Wire nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        if (!section) return;
        UI.nav(section);
        // Re-render on navigate
        if (section === 'roadmap')      Roadmap.render();
        if (section === 'compartments') Roadmap.renderCompartments();
        if (section === 'compare')      { Compare.buildTabs(); Compare.render(); }
        if (section === 'activity')     Activity.render();
      });
    });

    // Start with Setup if not configured, else roadmap
    if (cfg.binId && cfg.apiKey) {
      UI.nav('roadmap');
      Roadmap.render();
      Sync.load();
    } else {
      UI.nav('setup');
    }

    // Auto-refresh every 30 seconds
    setInterval(() => {
      const c = Sync.getConfig();
      if (c.binId && c.apiKey) Sync.load();
    }, 30000);
  }

  return { init, refresh };

})();

// ── GLOBAL HANDLERS (called from inline HTML onclick) ────────
function saveConfig() {
  const binId  = document.getElementById('cfg-binid').value;
  const apiKey = document.getElementById('cfg-apikey').value;
  const name   = document.getElementById('cfg-name').value;
  if (!binId || !apiKey) { UI.toast('Enter both bin ID and API key', true); return; }
  Sync.saveConfig(binId, apiKey, name);
  const whoEl = document.getElementById('l-who');
  if (whoEl) whoEl.value = name;
  UI.toast('Config saved — connecting…');
  Sync.load();
}

function exportJSON() {
  Sync.exportJSON();
  UI.toast('JSON backup downloaded');
}

window.addEventListener('DOMContentLoaded', App.init);
