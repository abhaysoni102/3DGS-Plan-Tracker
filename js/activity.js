// ============================================================
//  activity.js — Activity feed + Export report
// ============================================================

const Activity = (() => {

  let feedFilter = 'all';

  // ── FEED ─────────────────────────────────────────────────
  function setFilter(f, btn) {
    feedFilter = f;
    document.querySelectorAll('#feed-filter .btn').forEach(b => b.classList.remove('filter-active'));
    if (btn) btn.classList.add('filter-active');
    render();
  }

  function render() {
    const allLogs = Sync.getLogs();
    const logs    = feedFilter === 'all' ? allLogs : allLogs.filter(l => l.comp === feedFilter);
    const el      = document.getElementById('feed');
    if (!el) return;

    if (logs.length === 0) {
      el.innerHTML = UI.emptyState('◎', 'No entries yet.<br>Log your first test result.');
      return;
    }

    el.innerHTML = logs.map(l => {
      const avg = UI.avgScore(l.scores);
      return `
        <div class="feed-item ${l.pass}">
          <div class="feed-header">
            <div class="feed-opt">${l.opt}</div>
            <div class="feed-meta">
              ${UI.passBadge(l.pass)}
              ${UI.layerBadge(l.comp)}
              ${l.who ? `<span class="feed-who">${l.who}</span>` : ''}
              <span class="feed-date">${l.date}</span>
            </div>
          </div>
          <div class="feed-scores">
            <span class="feed-score">walls ${UI.pips(l.scores.walls)}</span>
            <span class="feed-score">floor ${UI.pips(l.scores.floor)}</span>
            <span class="feed-score">ceil ${UI.pips(l.scores.ceil)}</span>
            <span class="feed-score">glass ${UI.pips(l.scores.glass)}</span>
            <span class="feed-score">tex ${UI.pips(l.scores.tex)}</span>
            <span class="feed-score">avg <strong style="color:var(--accent)">${avg}/5</strong></span>
            ${l.capTime  ? `<span class="feed-score">cap ${l.capTime} min</span>`  : ''}
            ${l.procTime ? `<span class="feed-score">proc ${l.procTime} min</span>` : ''}
            ${l.cost     ? `<span class="feed-score">cost ${l.cost}</span>`         : ''}
          </div>
          ${l.failures ? `<div class="feed-fail">⚠ ${l.failures.replace(/\n/g, ' · ')}</div>` : ''}
          ${l.notes    ? `<div class="feed-notes">${l.notes}</div>` : ''}
          <div class="feed-actions">
            <button class="btn btn-sm btn-danger" onclick="Activity.deleteEntry(${l.id})">Delete</button>
          </div>
        </div>`;
    }).join('');
  }

  async function deleteEntry(id) {
    if (!confirm('Delete this entry?')) return;
    const ok = await Sync.deleteLog(id);
    if (ok) { UI.toast('Entry deleted'); App.refresh(); }
    else UI.toast('Delete failed', true);
  }

  // ── REPORT ───────────────────────────────────────────────
  function buildReport() {
    const logs = Sync.getLogs();
    const el   = document.getElementById('report-out');
    if (!el) return;

    if (logs.length === 0) {
      el.innerHTML = UI.emptyState('◎', 'No data yet. Log some tests first.');
      return;
    }

    const comps = [...new Set(logs.map(l => l.comp))].sort();
    el.innerHTML = comps.map(c => {
      const meta  = COMP_META[c];
      const cLogs = logs.filter(l => l.comp === c);

      const text = [
        `== ${c} — ${meta?.label || c} ==`,
        `Goal: ${meta?.goal || ''}`,
        ``,
        `Q5 Results — ${cLogs.length} option${cLogs.length !== 1 ? 's' : ''} tested`,
        ``,
        ...cLogs.map(l => [
          `Option:       ${l.opt}`,
          `Tested by:    ${l.who || '?'} on ${l.date}`,
          `Scale:        ${l.scale}`,
          `Pass:         ${l.pass}`,
          `Avg score:    ${UI.avgScore(l.scores)}/5`,
          `Capture:      ${l.capTime  || '?'} min`,
          `Processing:   ${l.procTime || '?'} min`,
          `Cost:         ${l.cost     || '?'}`,
          `Scores:       walls:${l.scores.walls} floor:${l.scores.floor} ceil:${l.scores.ceil} glass:${l.scores.glass} tex:${l.scores.tex} usability:${l.scores.use}`,
          l.failures ? `Failures:     ${l.failures.replace(/\n/g, '; ')}` : '',
          l.notes    ? `Notes:        ${l.notes}` : '',
          `Rec:          ${l.rec}`,
        ].filter(Boolean).join('\n')),
      ].join('\n').replace(/\n{3,}/g, '\n\n---\n\n');

      return `
        <div class="report-block">
          <h3>${c} — ${meta?.label || c}</h3>
          <div class="report-content">
            <div style="display:flex;gap:8px;margin-bottom:.75rem">
              <button class="btn btn-sm btn-accent" onclick="Activity.copyReport('rpt-${c}')">Copy to clipboard</button>
            </div>
            <pre id="rpt-${c}">${text}</pre>
          </div>
        </div>`;
    }).join('');
  }

  function copyReport(id) {
    const el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.textContent).then(() => UI.toast('Copied ✓'));
  }

  return { setFilter, render, deleteEntry, buildReport, copyReport };

})();
