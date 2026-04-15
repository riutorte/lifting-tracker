function fmt(n) { return n == null ? '—' : Number(n).toLocaleString('en-US'); }
function fmtWeight(n) { return n == null ? '—' : `${n.toLocaleString('en-US')} lbs`; }

function statCard(label, value, sub) {
  return `<div class="stat">
    <div class="label">${label}</div>
    <div class="value">${value}</div>
    ${sub ? `<div class="sub">${sub}</div>` : ''}
  </div>`;
}

function benchProgressCard(data) {
  const { maxReps, date, goal } = data.bench135;
  const pct = Math.min(100, Math.round((maxReps / goal) * 100));
  const dateStr = date ? new Date(date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  return `<div class="card">
    <h2>Active goal · 135 × 100 reps</h2>
    <div class="row">
      <div class="value" style="font-size:1.6rem"><span class="accent">${maxReps}</span> <span class="text-dim" style="font-size:1rem">/ ${goal} reps</span></div>
      <div class="muted">${pct}%</div>
    </div>
    <div class="progress"><span style="width:${pct}%"></span></div>
    <div class="small text-dim mt-1">Best single set at 135 lbs${date ? ` · ${dateStr}` : ''}</div>
  </div>`;
}

function bodyWeightCard(data) {
  const bw = data.bodyWeight;
  if (!bw.length) return '';
  const latest = bw[bw.length - 1];
  const prev = bw.length > 1 ? bw[bw.length - 2] : null;
  const delta = prev ? (latest.weight - prev.weight) : null;
  const deltaStr = delta == null ? '' : `${delta >= 0 ? '+' : ''}${delta.toFixed(1)} lbs from prev`;
  // Mini trend: last 20 readings as a bar chart.
  const recent = bw.slice(-20);
  const weights = recent.map((r) => r.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = Math.max(1, max - min);
  const bars = recent.map((r) => {
    const h = Math.round(((r.weight - min) / range) * 100);
    return `<div style="height:${Math.max(8, h)}%" title="${r.date}: ${r.weight} lbs"></div>`;
  }).join('');
  const latestDate = new Date(latest.date + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `<div class="card">
    <h2>Body weight</h2>
    <div class="row">
      <div class="value">${fmtWeight(latest.weight)}</div>
      <div class="muted small">${latestDate}</div>
    </div>
    ${deltaStr ? `<div class="small text-dim">${deltaStr}</div>` : ''}
    <div class="bar-chart" aria-hidden="true">${bars}</div>
    <div class="small text-dim mt-1">Range ${min.toFixed(1)}–${max.toFixed(1)} lbs · last ${recent.length} readings</div>
  </div>`;
}

function totalsCard(data) {
  const { sessions, volume } = data.totals;
  const volM = (volume / 1_000_000).toFixed(2);
  return `<div class="stat-grid mb-2">
    ${statCard('Total sessions', fmt(sessions), 'all modalities')}
    ${statCard('Total volume', `${volM}M`, `${fmt(volume)} lbs`)}
  </div>`;
}

function recentYearsCard(data) {
  if (!data.annual.length) return '';
  const rows = data.annual.map((y) => `
    <li>
      <div class="row">
        <strong>${y.year}</strong>
        <span class="muted">${fmt(y.total)} sessions</span>
      </div>
      <div class="row small text-dim">
        <span>Volume</span><span>${fmt(y.volume)} lbs</span>
      </div>
    </li>
  `).join('');
  return `<div class="card">
    <h2>Yearly breakdown</h2>
    <ul class="list">${rows}</ul>
  </div>`;
}

function topExercisesCard(data) {
  const top = data.exercises.filter((e) => e.totalVolume > 0).slice(0, 5);
  if (!top.length) return '';
  const rows = top.map((e) => `
    <li>
      <div class="row">
        <strong>${e.name}</strong>
        <span class="muted">${fmt(e.totalVolume)} lbs</span>
      </div>
      <div class="row small text-dim">
        <span>${e.entries} entries</span><span>last ${e.lastDate || '—'}</span>
      </div>
    </li>
  `).join('');
  return `<div class="card">
    <h2>Top exercises by volume</h2>
    <ul class="list">${rows}</ul>
  </div>`;
}

export function renderOverview(mount, data) {
  if (!data) { mount.innerHTML = '<div class="loading">No data</div>'; return; }
  mount.innerHTML = [
    benchProgressCard(data),
    totalsCard(data),
    bodyWeightCard(data),
    recentYearsCard(data),
    topExercisesCard(data)
  ].join('');
}
