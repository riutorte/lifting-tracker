let mode = 'date'; // 'date' or 'exercise'
let filter = '';
let selectedExercise = null;

function fmt(n) { return n == null ? '—' : Number(n).toLocaleString('en-US'); }

function prettyDate(iso) {
  if (!iso) return '';
  return new Date(iso + 'T00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
}

function renderByDate(data) {
  // Build a map: date -> session (from chronological, fallback to sessionIndex entry).
  const byDate = new Map();
  for (const s of data.sessionIndex) byDate.set(s.date, { ...s, exercises: [] });
  for (const c of data.chronological) {
    const existing = byDate.get(c.date) || { date: c.date, muscleGroups: [], gym: null, estVolume: null };
    existing.exercises = c.exercises;
    existing.volume = c.volume;
    byDate.set(c.date, existing);
  }
  const sessions = Array.from(byDate.values())
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first

  const q = filter.trim().toLowerCase();
  const filtered = q ? sessions.filter((s) => {
    return s.date.includes(q)
      || (s.muscleGroups || []).some((g) => g.toLowerCase().includes(q))
      || (s.gym || '').toLowerCase().includes(q)
      || (s.exercises || []).some((e) => e.name.toLowerCase().includes(q));
  }) : sessions;

  const items = filtered.slice(0, 200).map((s) => {
    const vol = s.volume ?? s.estVolume;
    const groups = (s.muscleGroups || []).join(' · ') || '—';
    const gym = s.gym ? ` @ ${s.gym}` : '';
    const exCount = s.exercises?.length || 0;
    const exPreview = exCount
      ? `<details class="mt-1"><summary class="small text-dim">${exCount} exercises</summary>
           <ul class="list mt-1">${s.exercises.map((e) => `
             <li>
               <div class="row"><strong>${e.name}</strong>${e.total ? `<span class="muted">${fmt(e.total)} lbs</span>` : ''}</div>
               <div class="small text-dim">${e.sets}</div>
             </li>`).join('')}
           </ul>
         </details>`
      : '';
    return `<li>
      <div class="row"><strong>${prettyDate(s.date)}</strong>${vol ? `<span class="muted">${fmt(vol)} lbs</span>` : ''}</div>
      <div class="small text-dim">${groups}${gym}</div>
      ${exPreview}
    </li>`;
  }).join('');

  const note = filtered.length > 200 ? `<div class="small text-dim text-right mb-1">Showing 200 of ${filtered.length}</div>` : '';
  return `${note}<ul class="list">${items || '<li class="empty">No sessions match.</li>'}</ul>`;
}

function renderByExercise(data) {
  const q = filter.trim().toLowerCase();
  const list = q
    ? data.exercises.filter((e) => e.name.toLowerCase().includes(q))
    : data.exercises;

  if (selectedExercise) {
    const ex = data.exercises.find((e) => e.name === selectedExercise);
    if (!ex) { selectedExercise = null; return renderByExercise(data); }
    // Pull every chronological entry for this exercise.
    const entries = [];
    for (const session of data.chronological) {
      for (const e of session.exercises) {
        if (e.name === selectedExercise) entries.push({ date: session.date, sets: e.sets, total: e.total });
      }
    }
    entries.sort((a, b) => b.date.localeCompare(a.date));
    const rows = entries.slice(0, 300).map((e) => `
      <li>
        <div class="row"><strong>${prettyDate(e.date)}</strong>${e.total ? `<span class="muted">${fmt(e.total)} lbs</span>` : ''}</div>
        <div class="small">${e.sets}</div>
      </li>`).join('');
    return `<button class="btn mb-1" id="ex-back">← All exercises</button>
      <div class="card">
        <h2>${ex.name}</h2>
        <div class="row"><span>${ex.entries} entries</span><span class="muted">${fmt(ex.totalVolume)} lbs</span></div>
        <div class="small text-dim">Last: ${ex.lastDate || '—'}</div>
      </div>
      <ul class="list">${rows || '<li class="empty">No detailed entries in chronological log.</li>'}</ul>`;
  }

  const items = list.slice(0, 200).map((e) => `
    <li data-exercise="${e.name.replace(/"/g, '&quot;')}" role="button" tabindex="0">
      <div class="row"><strong>${e.name}</strong><span class="muted">${fmt(e.totalVolume)} lbs</span></div>
      <div class="small text-dim">${e.entries} entries · last ${e.lastDate || '—'}</div>
    </li>`).join('');
  return `<ul class="list" id="ex-list">${items || '<li class="empty">No exercises match.</li>'}</ul>`;
}

export function renderHistory(mount, data) {
  if (!data) { mount.innerHTML = '<div class="loading">No data</div>'; return; }
  const content = mode === 'date' ? renderByDate(data) : renderByExercise(data);
  mount.innerHTML = `
    <div class="row mb-1">
      <div role="tablist" aria-label="History mode" style="display:flex; gap:6px;">
        <button class="btn${mode === 'date' ? ' primary' : ''}" id="mode-date">By date</button>
        <button class="btn${mode === 'exercise' ? ' primary' : ''}" id="mode-exercise">By exercise</button>
      </div>
    </div>
    <input id="filter" type="search" placeholder="Search…" value="${filter.replace(/"/g, '&quot;')}" class="mb-2" />
    ${content}
  `;

  mount.querySelector('#mode-date').addEventListener('click', () => { mode = 'date'; selectedExercise = null; renderHistory(mount, data); });
  mount.querySelector('#mode-exercise').addEventListener('click', () => { mode = 'exercise'; selectedExercise = null; renderHistory(mount, data); });

  const input = mount.querySelector('#filter');
  input.addEventListener('input', (e) => {
    filter = e.target.value;
    renderHistory(mount, data);
    // Restore focus after innerHTML rewrite.
    const newInput = mount.querySelector('#filter');
    if (newInput) { newInput.focus(); newInput.setSelectionRange(filter.length, filter.length); }
  });

  if (mode === 'exercise') {
    if (!selectedExercise) {
      mount.querySelectorAll('#ex-list > li[data-exercise]').forEach((li) => {
        li.addEventListener('click', () => { selectedExercise = li.dataset.exercise; renderHistory(mount, data); });
      });
    } else {
      const back = mount.querySelector('#ex-back');
      if (back) back.addEventListener('click', () => { selectedExercise = null; renderHistory(mount, data); });
    }
  }
}
