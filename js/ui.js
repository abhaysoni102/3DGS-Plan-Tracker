// ============================================================
//  ui.js — shared UI utilities
//  Toast, star ratings, pip display, navigation, badges.
// ============================================================

const UI = (() => {

  // ── TOAST ────────────────────────────────────────────────
  function toast(msg, isError = false) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast' + (isError ? ' error' : '') + ' show';
    setTimeout(() => el.classList.remove('show'), 2500);
  }

  // ── STAR RATINGS ─────────────────────────────────────────
  function buildStars(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    el.dataset.v = 0;
    for (let i = 1; i <= 5; i++) {
      const s = document.createElement('span');
      s.className = 'star';
      s.textContent = '★';
      s.dataset.v = i;
      s.onclick = () => {
        el.dataset.v = i;
        el.querySelectorAll('.star').forEach((st, idx) => st.classList.toggle('on', idx < i));
      };
      el.appendChild(s);
    }
  }

  function getStarVal(id) {
    return parseInt(document.getElementById(id)?.dataset.v) || 0;
  }

  function resetStars(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.v = 0;
    el.querySelectorAll('.star').forEach(s => s.classList.remove('on'));
  }

  // ── PIPS (score display) ─────────────────────────────────
  function pips(n, max = 5) {
    let h = '<div class="pips">';
    for (let i = 0; i < max; i++) h += `<div class="pip${i < n ? ' on' : ''}"></div>`;
    return h + '</div>';
  }

  // ── BADGES ───────────────────────────────────────────────
  function passBadge(pass) {
    const map = { pass: 'b-ok', partial: 'b-warn', fail: 'b-fail' };
    return `<span class="badge ${map[pass] || 'b-gray'}">${pass}</span>`;
  }

  function recBadge(rec) {
    const map = { recommended: 'b-ok', conditional: 'b-warn', 'not-recommended': 'b-fail', tbd: 'b-gray' };
    return `<span class="badge ${map[rec] || 'b-gray'}" style="font-size:9px">${rec}</span>`;
  }

  function diffBadge(d) {
    const map = { Easy: 'b-easy', Medium: 'b-med', Hard: 'b-hard' };
    return `<span class="badge ${map[d] || 'b-gray'}">${d}</span>`;
  }

  function gpuBadge(g) {
    const map = { cloud: 'b-cloud', none: 'b-ok', local: 'b-local', webgl: 'b-med', webgpu: 'b-warn' };
    return `<span class="badge ${map[g] || 'b-gray'}">${g}</span>`;
  }

  function costBadge(c) {
    const isFree = c.toLowerCase().includes('free');
    return `<span class="badge ${isFree ? 'b-free' : 'b-warn'}">${c}</span>`;
  }

  function layerBadge(comp) {
    const layer = comp.charAt(0);
    const map = { A: 'b-p1', B: 'b-p2', C: 'b-p3' };
    return `<span class="badge ${map[layer] || 'b-gray'}">${comp}</span>`;
  }

  // ── NAVIGATION ───────────────────────────────────────────
  function nav(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const section = document.getElementById('s-' + id);
    const navItem = document.querySelector(`.nav-item[data-section="${id}"]`);
    if (section) section.classList.add('active');
    if (navItem) navItem.classList.add('active');
  }

  // ── EMPTY STATE ──────────────────────────────────────────
  function emptyState(icon, message) {
    return `<div class="empty"><div class="empty-icon">${icon}</div>${message}</div>`;
  }

  // ── AVG SCORE ────────────────────────────────────────────
  function avgScore(scores) {
    const vals = Object.values(scores).filter(v => v > 0);
    if (!vals.length) return '—';
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  }

  return {
    toast, buildStars, getStarVal, resetStars,
    pips, passBadge, recBadge, diffBadge, gpuBadge, costBadge, layerBadge,
    nav, emptyState, avgScore,
  };

})();
