// Filtering and sorting for the deal list. Pure functions over the deals
// array: the list view owns the controls, this file owns the rules.

import { dealScore, dollarsSaved, percentOff } from './verdict.js';

export const SORTS = [
  { id: 'best', label: 'Best deal first' },
  { id: 'pct', label: 'Highest % off' },
  { id: 'save', label: 'Biggest saving ($)' },
  { id: 'low', label: 'Lowest price' },
  { id: 'newlow', label: 'New lows first' },
];

const VERDICT_RANK = { NEW_LOW: 0, STRONG: 1, GOOD: 2, ROUTINE: 3, NOT_A_DEAL: 4 };

export function emptyFilters() {
  return { q: '', category: 'all', store: 'all', minOff: 0, sort: 'best' };
}

export function applyFilters(deals, f) {
  const q = f.q.trim().toLowerCase();
  const list = deals.filter((d) => {
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    if (f.category !== 'all' && d.category !== f.category) return false;
    if (f.store !== 'all' && d.store !== f.store) return false;
    if (percentOff(d) < f.minOff) return false;
    return true;
  });
  const by = {
    best: (a, b) => dealScore(b) - dealScore(a),
    pct: (a, b) => percentOff(b) - percentOff(a),
    save: (a, b) => dollarsSaved(b) - dollarsSaved(a),
    low: (a, b) => a.price - b.price,
    newlow: (a, b) => VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || dealScore(b) - dealScore(a),
  };
  return list.sort(by[f.sort] || by.best);
}

// Distinct values for the filter dropdowns, in first-seen order.
export function distinct(deals, key) {
  const seen = new Set();
  const out = [];
  for (const d of deals) {
    if (!seen.has(d[key])) { seen.add(d[key]); out.push(d[key]); }
  }
  return out;
}

// Other deals for the same product (same group key) at other stores,
// cheapest first. Used by the detail page's cross-store block.
export function crossStoreMatches(deals, deal) {
  if (!deal.group) return [];
  return deals
    .filter((d) => d.group === deal.group && d.id !== deal.id)
    .sort((a, b) => a.price - b.price);
}
