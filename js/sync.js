// ============================================================
//  sync.js — JSONBin real-time sync
//  Handles config, load, push, and sync state UI.
// ============================================================

const Sync = (() => {

  let cfg = { binId: '', apiKey: '', name: '' };
  let logs = [];
  let onDataUpdate = null; // callback set by app.js

  // ── CONFIG ──────────────────────────────────────────────
  function loadConfig() {
    try {
      const s = localStorage.getItem('spaces360_cfg');
      if (s) cfg = JSON.parse(s);
    } catch(e) {}
    return cfg;
  }

  function saveConfig(binId, apiKey, name) {
    cfg = { binId: binId.trim(), apiKey: apiKey.trim(), name: name.trim() };
    localStorage.setItem('spaces360_cfg', JSON.stringify(cfg));
    return cfg;
  }

  function getConfig() { return cfg; }
  function getLogs() { return logs; }

  // ── SYNC STATE UI ───────────────────────────────────────
  function setState(state) {
    const dot = document.getElementById('syncDot');
    const txt = document.getElementById('syncText');
    if (!dot || !txt) return;
    dot.className = 'sync-dot';
    const states = {
      idle:    { cls: '',        text: 'not configured', color: 'var(--text3)' },
      syncing: { cls: 'syncing', text: 'syncing…',       color: 'var(--amber)' },
      live:    { cls: 'live',    text: 'live',            color: 'var(--accent)' },
      error:   { cls: 'error',   text: 'sync error',      color: 'var(--red)' },
    };
    const s = states[state] || states.idle;
    if (s.cls) dot.classList.add(s.cls);
    txt.textContent = s.text;
    txt.style.color = s.color;
  }

  // ── LOAD ────────────────────────────────────────────────
  async function load() {
    if (!cfg.binId || !cfg.apiKey) { setState('idle'); return false; }
    setState('syncing');
    try {
      const r = await fetch(
        `https://api.jsonbin.io/v3/b/${cfg.binId}/latest`,
        { headers: { 'X-Master-Key': cfg.apiKey } }
      );
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      logs = d.record.logs || [];
      setState('live');
      if (onDataUpdate) onDataUpdate(logs);
      return true;
    } catch(e) {
      setState('error');
      return false;
    }
  }

  // ── PUSH ────────────────────────────────────────────────
  async function push() {
    if (!cfg.binId || !cfg.apiKey) return false;
    setState('syncing');
    try {
      const r = await fetch(
        `https://api.jsonbin.io/v3/b/${cfg.binId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': cfg.apiKey,
          },
          body: JSON.stringify({ logs }),
        }
      );
      if (!r.ok) throw new Error(r.status);
      setState('live');
      return true;
    } catch(e) {
      setState('error');
      return false;
    }
  }

  // ── ADD LOG ENTRY ────────────────────────────────────────
  async function addLog(entry) {
    logs.unshift(entry);
    const ok = await push();
    if (!ok) logs.shift(); // rollback on failure
    return ok;
  }

  // ── DELETE LOG ENTRY ─────────────────────────────────────
  async function deleteLog(id) {
    const prev = [...logs];
    logs = logs.filter(l => l.id !== id);
    const ok = await push();
    if (!ok) logs = prev;
    return ok;
  }

  // ── EXPORT ──────────────────────────────────────────────
  function exportJSON() {
    const blob = new Blob([JSON.stringify({ logs }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'spaces360-tracker-backup.json';
    a.click();
  }

  // ── SET CALLBACK ─────────────────────────────────────────
  function onUpdate(fn) { onDataUpdate = fn; }

  return { loadConfig, saveConfig, getConfig, getLogs, load, push, addLog, deleteLog, exportJSON, onUpdate, setState };

})();
