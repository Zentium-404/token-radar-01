// live.js — the Live token view and the comparison helpers behind it.
//
// A live-token protocol already trades, so its market cap is a fact the page can quote against the
// model's estimate for its pre-token peers. Everything in this module reads DATA.live and
// DATA.sector_multiples; no protocol name is special-cased.
window.LIVE = (function () {
  'use strict';

  /** The category's TVL/mcap multiple, or the global median when the category has no comps. */
  function multipleOf(category) {
    var table = window.RADAR && window.RADAR.sector_multiples ? window.RADAR.sector_multiples : {};
    var hit = category !== null && category !== undefined ? table[category] : null;
    return hit ? hit.multiple : (window.RADAR ? window.RADAR.global_multiple : null);
  }

  /** How many live comps backed the category's multiple. */
  function sampleOf(category) {
    var table = window.RADAR && window.RADAR.sector_multiples ? window.RADAR.sector_multiples : {};
    var hit = category !== null && category !== undefined ? table[category] : null;
    return hit ? hit.sample : (window.RADAR ? 0 : 0);
  }

  /** Whole dollars, short form: $1.2B, $340M, $25K. */
  function usd(n) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
    return '$' + Math.round(n);
  }

  /** A percentage with its sign; an em dash when the record reports none. */
  function pct(v) {
    if (v === null || v === undefined) return '—';
    return (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
  }

  /** A day count in words: '3 days', '14 months', '2.4 years'; 'unknown' when absent. */
  function ageWords(days) {
    if (days === null || days === undefined) return 'unknown';
    if (days < 60) return days + ' days';
    if (days < 730) return Math.round(days / 30) + ' months';
    return (days / 365).toFixed(1) + ' years';
  }

  /** The TVL/mcap ratio itself, to two places. */
  function ratio(tvl, mcap) {
    if (mcap === null || mcap === undefined || mcap <= 0) return '—';
    return (tvl / mcap).toFixed(2);
  }

  /** The bar's fill fraction: TVL against the largest TVL in the live set. */
  function barFraction(r, maxTvl) {
    if (!maxTvl || maxTvl <= 0) return 0;
    return Math.max(0.02, Math.min(1, r.tvl_usd / maxTvl));
  }

  /**
   * Build the live table body: one row per live protocol with its market's own ratio, the category's
   * multiple beside it, and a bar that shows relative TVL at a glance.
   */
  function renderTable(tbody, rows) {
    var maxTvl = rows.reduce(function (m, r) { return Math.max(m, r.tvl_usd); }, 0);
    tbody.textContent = '';
    rows.forEach(function (r) {
      var tr = document.createElement('tr');
      var tdName = document.createElement('td');
      var wrap = document.createElement('div');
      wrap.className = 'name';
      var b = document.createElement('b');
      b.textContent = r.name;
      var sub = document.createElement('span');
      sub.className = 'sub';
      sub.textContent = (r.category || 'Other') + ' · ' + ratio(r.tvl_usd, r.mcap_usd) + ' tvl/mcap · ' + multipleOf(r.category) + ' sector';
      wrap.appendChild(b);
      wrap.appendChild(sub);
      tdName.appendChild(wrap);
      var tdTvl = document.createElement('td');
      tdTvl.className = 'num';
      var bar = document.createElement('span');
      bar.className = 'bar';
      var fill = document.createElement('i');
      fill.style.width = (barFraction(r, maxTvl) * 100).toFixed(1) + '%';
      bar.appendChild(fill);
      tdTvl.appendChild(document.createTextNode(usd(r.tvl_usd) + ' '));
      tdTvl.appendChild(bar);
      var td7 = document.createElement('td');
      td7.className = 'num ' + (r.change_7d !== null && r.change_7d >= 0 ? 'pos' : 'neg');
      td7.textContent = pct(r.change_7d);
      var tdMcap = document.createElement('td');
      tdMcap.className = 'num';
      tdMcap.textContent = usd(r.mcap_usd);
      var tdAge = document.createElement('td');
      tdAge.className = 'num muted';
      tdAge.textContent = ageWords(r.age_days);
      tr.appendChild(tdName);
      tr.appendChild(tdTvl);
      tr.appendChild(td7);
      tr.appendChild(tdMcap);
      tr.appendChild(tdAge);
      tbody.appendChild(tr);
    });
  }

  /** The table header matching renderTable's columns. */
  function headerRow() {
    var tr = document.createElement('tr');
    ['Protocol', 'TVL', '7d', 'Market cap', 'Live since'].forEach(function (h) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = h;
      tr.appendChild(th);
    });
    return tr;
  }

  /** One line for the model panel: the category, its multiple and how many comps back it. */
  function compsLine(category) {
    var m = multipleOf(category);
    var n = sampleOf(category);
    return category + ': ' + m + ' from ' + n + ' live comps';
  }

  /** Every category with at least one comp, strongest sample first. */
  function compsTable() {
    var table = window.RADAR && window.RADAR.sector_multiples ? window.RADAR.sector_multiples : {};
    return Object.keys(table)
      .sort(function (a, b) { return table[b].sample - table[a].sample; })
      .map(compsLine);
  }

  return { multipleOf: multipleOf, sampleOf: sampleOf, usd: usd, pct: pct, ageWords: ageWords, ratio: ratio, barFraction: barFraction, renderTable: renderTable, headerRow: headerRow, compsLine: compsLine, compsTable: compsTable };
})();
