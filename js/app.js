import { loadParsedLog } from './parser.js';
import { renderOverview } from './overview.js';
import { renderHistory } from './history.js';
import { renderLogger } from './logger.js';

const TABS = ['overview', 'history', 'log'];
const TAB_TITLES = { overview: 'Overview', history: 'History', log: 'Log workout' };
const state = { data: null, error: null, activeTab: 'overview' };

function switchTab(name) {
  if (!TABS.includes(name)) return;
  state.activeTab = name;
  document.querySelectorAll('.tab').forEach((el) => {
    el.hidden = el.id !== `tab-${name}`;
    el.classList.toggle('active', el.id === `tab-${name}`);
  });
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === name);
  });
  document.getElementById('tab-title').textContent = TAB_TITLES[name];
  render(name);
}

function render(name) {
  const mount = document.getElementById(`tab-${name}`);
  if (!mount) return;
  if (state.error && name !== 'log') {
    mount.innerHTML = `<div class="banner warn">Couldn't load workout log: ${state.error}</div>`;
    return;
  }
  if (!state.data && name !== 'log') {
    mount.innerHTML = '<div class="loading">Loading your log…</div>';
    return;
  }
  if (name === 'overview') renderOverview(mount, state.data);
  if (name === 'history') renderHistory(mount, state.data);
  if (name === 'log') renderLogger(mount, state.data);
}

function wireTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

async function init() {
  wireTabs();
  try {
    state.data = await loadParsedLog('./data/combined_workout_log.txt');
  } catch (err) {
    console.error(err);
    state.error = err.message || String(err);
  }
  render(state.activeTab);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => console.warn('SW register failed', err));
  });
}

init();
