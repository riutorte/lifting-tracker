import { loadEntries, addEntry, deleteEntry } from './storage.js';

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toMDY(iso) {
  const [y, m, d] = iso.split('-');
  return `${parseInt(m, 10).toString().padStart(2, '0')}/${parseInt(d, 10).toString().padStart(2, '0')}/${y}`;
}

function exportText(entries) {
  // Format each entry in the same style the combined log uses:
  //   MM/DD/YYYY
  //     <pasted content>
  return entries.map((e) => {
    const body = e.body.split(/\r?\n/).map((l) => (l.startsWith('  ') ? l : `  ${l}`)).join('\n');
    return `${toMDY(e.date)}\n${body}`;
  }).join('\n\n');
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback: create a temporary textarea.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* ignore */ }
    document.body.removeChild(ta);
    return ok;
  }
}

export function renderLogger(mount) {
  const entries = loadEntries();
  mount.innerHTML = `
    <div class="banner info">
      Paste your session from Notes below. Saved locally on this device — use
      <em>Copy all</em> to move them into your combined log later.
    </div>
    <label for="entry-date">Session date</label>
    <input id="entry-date" type="date" value="${todayISO()}" />

    <label for="entry-body">Notes / sets</label>
    <textarea id="entry-body" placeholder="Bench Press: 45x20, 135x15, 135x10
Pec Fly: 115x15x10
Body weight: 208 lbs"></textarea>

    <div class="row mt-2 mb-2" style="gap:8px;">
      <button class="btn primary" id="save-btn">Save entry</button>
      <button class="btn" id="copy-btn" ${entries.length ? '' : 'disabled'}>Copy all (${entries.length})</button>
    </div>

    <div id="saved-list"></div>
  `;

  const dateEl = mount.querySelector('#entry-date');
  const bodyEl = mount.querySelector('#entry-body');
  const saveBtn = mount.querySelector('#save-btn');
  const copyBtn = mount.querySelector('#copy-btn');
  const listEl = mount.querySelector('#saved-list');

  function renderList() {
    const current = loadEntries().slice().reverse();
    if (!current.length) {
      listEl.innerHTML = '<div class="empty">No saved entries yet.</div>';
      return;
    }
    listEl.innerHTML = `<h2 class="small text-dim" style="margin:8px 0">Saved entries (${current.length})</h2>
      <ul class="list">${current.map((e) => `
        <li>
          <div class="row"><strong>${toMDY(e.date)}</strong>
            <button class="btn small" data-del="${e.id}" style="padding:4px 10px">Delete</button>
          </div>
          <pre class="small" style="white-space:pre-wrap; margin:6px 0 0; font-family:ui-monospace,Menlo,monospace">${e.body.replace(/</g, '&lt;')}</pre>
        </li>`).join('')}
      </ul>`;
    listEl.querySelectorAll('button[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => {
        deleteEntry(parseInt(btn.dataset.del, 10));
        const updated = loadEntries();
        copyBtn.textContent = `Copy all (${updated.length})`;
        copyBtn.disabled = updated.length === 0;
        renderList();
      });
    });
  }

  saveBtn.addEventListener('click', () => {
    const body = bodyEl.value.trim();
    if (!body) { bodyEl.focus(); return; }
    addEntry({ date: dateEl.value || todayISO(), body });
    bodyEl.value = '';
    const updated = loadEntries();
    copyBtn.textContent = `Copy all (${updated.length})`;
    copyBtn.disabled = false;
    renderList();
  });

  copyBtn.addEventListener('click', async () => {
    const current = loadEntries();
    if (!current.length) return;
    const text = exportText(current);
    const ok = await copyToClipboard(text);
    copyBtn.textContent = ok ? 'Copied ✓' : 'Copy failed';
    setTimeout(() => { copyBtn.textContent = `Copy all (${loadEntries().length})`; }, 1800);
  });

  renderList();
}
