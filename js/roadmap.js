// ============================================================
//  roadmap.js — Roadmap page + Compartments page rendering
// ============================================================

const Roadmap = (() => {

  function renderStats() {
    const logs = Sync.getLogs();
    const started = Object.keys(COMP_META).filter(c => logs.some(l => l.comp === c)).length;
    const opts    = [...new Set(logs.map(l => l.opt))].length;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('rd-tests', logs.length);
    set('rd-comp',  started + '/' + Object.keys(COMP_META).length);
    set('rd-opts',  opts);
    set('ss-tests', logs.length);
    set('ss-opts',  opts);
  }

  function renderPriorities() {
    const el = document.getElementById('priority-list');
    if (!el) return;
    el.innerHTML = PRIORITY_DATA.map(p => `
      <div class="p-row">
        <div class="p-num ${p.cls}">${p.n}</div>
        <div class="p-body">
          <div class="p-title">
            <span>${p.label}</span>
            <span class="badge ${p.badge}">${p.badge_text}</span>
          </div>
          <div class="p-desc">${p.desc}</div>
          <div class="chips">${p.chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>
        </div>
      </div>`).join('');
  }

  function renderCompartments() {
    const logs = Sync.getLogs();
    ['A', 'B', 'C'].forEach(layer => {
      const el = document.getElementById('comp-layer-' + layer.toLowerCase());
      if (!el) return;
      const entries  = Object.entries(COMP_META).filter(([k]) => k.startsWith(layer));
      const layerLabel = { A: 'Layer A — Capture-to-Splat', B: 'Layer B — Composition', C: 'Layer C — Render & Interaction' }[layer];
      const priBadge = p => p === 1 ? 'b-p1' : p === 2 ? 'b-p2' : 'b-p3';

      el.innerHTML = `
        <h3 style="font-family:var(--mono);font-size:12px;color:var(--text2);margin-bottom:.6rem;margin-top:1.25rem">${layerLabel}</h3>
        <div class="comp-grid">
          ${entries.map(([key, meta]) => {
            const myLogs   = logs.filter(l => l.comp === key);
            const toolCount = (TOOLS[key] || []).length;
            const prog     = Math.min(100, myLogs.length * 14);
            return `
              <div class="comp-card${myLogs.length > 0 ? ' has-data' : ''}"
                   onclick="Compare.switchToComp('${key}'); UI.nav('compare')">
                <div class="comp-name">
                  ${meta.label}
                  <span class="badge ${priBadge(meta.pri)}">P${meta.pri}</span>
                </div>
                <div class="comp-goal">${meta.goal}</div>
                <div class="prog-bar"><div class="prog-fill" style="width:${prog}%"></div></div>
                <div class="comp-meta">
                  <span>${myLogs.length} test${myLogs.length !== 1 ? 's' : ''} logged</span>
                  <span>${toolCount} options to evaluate</span>
                </div>
              </div>`;
          }).join('')}
        </div>`;
    });
  }

  function render() {
    renderStats();
    renderPriorities();
    renderCompartments();
  }

  return { render, renderStats, renderCompartments };

})();
