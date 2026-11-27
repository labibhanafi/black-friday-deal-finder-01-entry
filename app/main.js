// A deal finder: every deal and a page for each, on hash routes. The deals
// live in data.js, so the site needs no network to show them; each deal links
// out to its store.
//
//   #/            the list, with search + filters + sort
//   #/deal/<id>   one deal, with its verdict and cross-store prices
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from './data.js';
import { applyFilters, crossStoreMatches, emptyFilters } from './filters.js';
import { detailPage, listPage, missingPage, statsBar } from './views.js';

const app = document.getElementById('app');
const stats = document.getElementById('stats');
const filters = emptyFilters();

// Shareable filter presets from the query string, e.g.
//   ?q=lego&cat=Toys&store=Amazon&minoff=40&sort=pct
// Lets a filtered view be linked, bookmarked and screenshotted as-is.
function readPresets() {
  const params = new URLSearchParams(location.search);
  if (params.get('q')) filters.q = params.get('q');
  if (params.get('cat')) filters.category = params.get('cat');
  if (params.get('store')) filters.store = params.get('store');
  const min = Number(params.get('minoff'));
  if (Number.isInteger(min) && min >= 0 && min <= 90) filters.minOff = min;
  const sorts = ['best', 'pct', 'save', 'low', 'newlow'];
  if (sorts.includes(params.get('sort'))) filters.sort = params.get('sort');
}
readPresets();

function renderList() {
  const shown = applyFilters(deals, filters);
  document.title = 'DealBeacon — Black Friday Deal Finder';
  app.innerHTML = listPage(deals, shown, filters);
  const q = app.querySelector('#q');
  const cat = app.querySelector('#cat');
  const store = app.querySelector('#store');
  const minoff = app.querySelector('#minoff');
  const sort = app.querySelector('#sort');
  q.addEventListener('input', () => { filters.q = q.value; renderListKeepFocus(); });
  cat.addEventListener('change', () => { filters.category = cat.value; renderList(); });
  store.addEventListener('change', () => { filters.store = store.value; renderList(); });
  minoff.addEventListener('change', () => { filters.minOff = Number(minoff.value); renderList(); });
  sort.addEventListener('change', () => { filters.sort = sort.value; renderList(); });
}

// Re-render after typing, keeping the caret in the search box.
function renderListKeepFocus() {
  const pos = app.querySelector('#q').selectionStart;
  renderList();
  const q = app.querySelector('#q');
  q.focus();
  q.setSelectionRange(pos, pos);
}

function render() {
  window.__shotReady = false;
  stats.innerHTML = statsBar(deals);
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : 'Not found'} | DealBeacon`;
    app.innerHTML = found
      ? detailPage(deals, found, crossStoreMatches(deals, found))
      : missingPage();
  } else {
    renderList();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
