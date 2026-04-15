const KEY_ENTRIES = 'lt.newEntries.v1';

export function loadEntries() {
  try {
    const raw = localStorage.getItem(KEY_ENTRIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries) {
  localStorage.setItem(KEY_ENTRIES, JSON.stringify(entries));
}

export function addEntry(entry) {
  const entries = loadEntries();
  entries.push({ ...entry, id: Date.now(), createdAt: new Date().toISOString() });
  saveEntries(entries);
  return entries;
}

export function deleteEntry(id) {
  const entries = loadEntries().filter((e) => e.id !== id);
  saveEntries(entries);
  return entries;
}
