// ============================================================
//  compare.js — Tool comparison page
//  Renders tool cards and results tables per compartment.
// ============================================================

const Compare = (() => {

  let activeTab = 'A.1';
  const TABS = ['A.1', 'A.2', 'B.1', 'B.2', 'C.1'];
  const TAB_LABELS = {
    'A.1': 'A.1 Venue capture',
    'A.2': 'A.2 Furniture',
    'B.1': 'B.1 Manual comp.',
    'B.2': 'B.2 Auto + LLM',
    'C.1': 'C.1 Viewer',
  };

  function buildTabs() {
    const el = document.getElementById('tool-tabs');
    if (!el) return;
    el.innerHTML = TABS.map(t =>
      `<div class="tool-tab${t === activeTab ? ' active' : ''}" onclick="Compare.switchTab('${t}')">${TAB_LABELS[t]}</div>`
    ).join('');
  }

  function switchTab(tab) {
    activeTab = tab;
    buildTabs();
    render();
  }

  function switchToComp(compId) {
    if (TABS.includes(compId)) {
      activeTab = compId;
      buildTabs();
      render();
      UI.nav('compare');
    }
  }

  function render() {
    const logs  = Sync.getLogs().filter(l => l.comp === activeTab);
    const tools = TOOLS[activeTab] || [];
    const el    = document.getElementById('tools-content');
    if (!el) return;

    // Tool cards
    let html = '<div class="tools-grid">';
    tools.forEach(t => {
      const tested = logs.some(l => l.opt.includes(t.id));
      html += `
        <div class="tool-card${tested ? ' tested' : ''}">
          <div class="tool-id">${t.id}</div>
          <div class="tool-name">${t.name}</div>
          <div class="tool-badges">
            ${UI.diffBadge(t.diff)}
            ${UI.gpuBadge(t.gpu)}
            ${UI.costBadge(t.cost)}
            ${tested ? '<span class="badge b-tested">tested ✓</span>' : ''}
          </div>
          <div class="tool-notes">${t.notes}</div>
          ${t.link ? `<a class="tool-link" href="${t.link}" target="_blank">↗ ${t.link.replace('https://','')}</a>` : ''}
        </div>`;
    });
    html += '</div>';

    // Results table
    html += `<div class="results-card">
      <h3>// logged results for ${activeTab} (${logs.length} entr${logs.length !== 1 ? 'ies' : 'y'})</h3>`;

    if (logs.length === 0) {
      html += UI.emptyState('◎', 'No tests logged yet.<br>Use "Log a test" to record your first result.');
    } else {
      html += `<div class="table-wrap"><table>
        <thead><tr>
          <th>Option</th><th>Who</th><th>Scale</th><th>Pass</th>
          <th>Walls</th><th>Floor</th><th>Ceil</th><th>Glass</th><th>Tex</th><th>Use</th>
          <th>Avg</th><th>Cap (min)</th><th>Proc (min)</th><th>Cost</th><th>Rec</th><th>Date</th>
        </tr></thead><tbody>`;
      logs.forEach(l => {
        const avg = UI.avgScore(l.scores);
        html += `<tr>
          <td style="font-size:10px;max-width:130px;word-break:break-word">${l.opt}</td>
          <td style="color:var(--purple);font-size:11px">${l.who || '?'}</td>
          <td>${l.scale}</td>
          <td>${UI.passBadge(l.pass)}</td>
          <td>${UI.pips(l.scores.walls)}</td>
          <td>${UI.pips(l.scores.floor)}</td>
          <td>${UI.pips(l.scores.ceil)}</td>
          <td>${UI.pips(l.scores.glass)}</td>
          <td>${UI.pips(l.scores.tex)}</td>
          <td>${UI.pips(l.scores.use)}</td>
          <td style="color:var(--accent);font-weight:500">${avg}</td>
          <td>${l.capTime || '—'}</td>
          <td>${l.procTime || '—'}</td>
          <td>${l.cost || '—'}</td>
          <td>${UI.recBadge(l.rec)}</td>
          <td style="color:var(--text3);font-size:10px">${l.date}</td>
        </tr>`;
        if (l.failures || l.notes) {
          html += `<tr class="note-row"><td colspan="16">`;
          if (l.failures) html += `<span style="color:var(--red)">⚠ ${l.failures.replace(/\n/g, ' · ')}</span>  `;
          if (l.notes) html += l.notes;
          html += `</td></tr>`;
        }
      });
      html += '</tbody></table></div>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  function getActiveTab() { return activeTab; }

  return { buildTabs, switchTab, switchToComp, render, getActiveTab };

})();
