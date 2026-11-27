// HTML for the list and detail pages, built from the deal data. Every value
// is escaped before it goes into the page.

import { distinct } from './filters.js';
import { dollarsSaved, percentOff, verdictInfo } from './verdict.js';

const escape = (s) => String(s).replace(/[&<>\"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const checkedShort = (iso) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';

export function statsBar(deals) {
  const total = deals.reduce((s, d) => s + dollarsSaved(d), 0);
  const avg = deals.length ? Math.round(deals.reduce((s, d) => s + percentOff(d), 0) / deals.length) : 0;
  const lows = deals.filter((d) => d.verdict === 'NEW_LOW').length;
  const stores = new Set(deals.map((d) => d.store)).size;
  return `<span><b>${deals.length}</b> deals checked</span>
<span><b>${usd(total)}</b> total savings</span>
<span><b>${avg}%</b> average off</span>
<span><b>${lows}</b> new lows</span>
<span><b>${stores}</b> stores</span>
<span class="stats-note">Checked 27 Nov 2026</span>`;
}

function option(value, label, current) {
  return `<option value="${escape(value)}"${value === current ? ' selected' : ''}>${escape(label)}</option>`;
}

export function filterBar(deals, f) {
  const cats = distinct(deals, 'category');
  const stores = distinct(deals, 'store');
  return `<section class="filters" aria-label="Search and filter deals">
  <label class="f-search">Search <input id="q" type="search" placeholder="Product, store, category…" value="${escape(f.q)}"></label>
  <label>Category <select id="cat">${option('all', 'All categories', f.category)}${cats.map((c) => option(c, c, f.category)).join('')}</select></label>
  <label>Store <select id="store">${option('all', 'All stores', f.store)}${stores.map((s) => option(s, s, f.store)).join('')}</select></label>
  <label>Min. discount <select id="minoff">
    ${option('0', 'Any discount', String(f.minOff))}
    ${option('20', '20% off or more', String(f.minOff))}
    ${option('30', '30% off or more', String(f.minOff))}
    ${option('40', '40% off or more', String(f.minOff))}
    ${option('50', '50% off or more', String(f.minOff))}
  </select></label>
  <label>Sort <select id="sort">
    <option value="best"${f.sort === 'best' ? ' selected' : ''}>Best deal first</option>
    <option value="pct"${f.sort === 'pct' ? ' selected' : ''}>Highest % off</option>
    <option value="save"${f.sort === 'save' ? ' selected' : ''}>Biggest saving ($)</option>
    <option value="low"${f.sort === 'low' ? ' selected' : ''}>Lowest price</option>
    <option value="newlow"${f.sort === 'newlow' ? ' selected' : ''}>New lows first</option>
  </select></label>
</section>`;
}

function verdictBadge(d) {
  const v = verdictInfo(d.verdict);
  return `<span class="badge ${v.cls}" title="${escape(v.blurb)}">${escape(v.label)}</span>`;
}

export function dealCard(d) {
  return `<article class="card">
  <a class="card-title" href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a>
  <p class="card-meta">${escape(d.store)} &middot; ${escape(d.category)}</p>
  <p class="card-price"><b>${usd(d.price)}</b> <s>${usd(d.was)}</s> <span class="off">${percentOff(d)}% off</span></p>
  <p class="card-save">You save ${usd(dollarsSaved(d))}</p>
  <p class="card-verdict">${verdictBadge(d)} <span class="evidence">${escape(d.evidence)}</span></p>
  <p class="card-foot"><a class="store-link" href="${escape(d.url)}" rel="noopener" target="_blank">View at ${escape(d.store)} &rarr;</a> <span class="checked">Checked ${checkedShort(d.checked)}</span></p>
</article>`;
}

export function listPage(deals, shown, f) {
  const count = `<p class="count">Showing <b>${shown.length}</b> of ${deals.length} deals${f.q || f.category !== 'all' || f.store !== 'all' || f.minOff > 0 ? ' &mdash; filters active' : ''}</p>`;
  const grid = shown.length
    ? `<div class="grid">${shown.map(dealCard).join('')}</div>`
    : '<p class="empty">No deal matches these filters. Loosen the discount or clear the search.</p>';
  return `<h1>Black Friday deal finder</h1>
<p class="lede">Every deal below was checked today at its store or in a named deals source. The verdict says whether it is really a deal.</p>
${filterBar(deals, f)}
${count}
${grid}`;
}

export function detailPage(deals, d, others) {
  const v = verdictInfo(d.verdict);
  const cross = others.length
    ? `<section class="cross"><h2>Same product at other stores</h2>
<table><thead><tr><th>Store</th><th>Price</th><th>Was</th><th>Off</th><th></th></tr></thead><tbody>
${others.map((o) => `<tr${o.price < d.price ? ' class="cheaper"' : ''}><td>${escape(o.store)}</td><td><b>${usd(o.price)}</b></td><td><s>${usd(o.was)}</s></td><td>${percentOff(o)}% off</td><td><a href="${escape(o.url)}" rel="noopener" target="_blank">View &rarr;</a></td></tr>`).join('')}
</tbody></table>
<p class="cross-note">${others.some((o) => o.price < d.price) ? 'A cheaper price for the same product is listed above.' : 'This store has the lowest price we found for this product.'}</p></section>`
    : `<section class="cross"><h2>Same product at other stores</h2><p class="cross-note">We did not find this exact product on sale at another store we track.</p></section>`;
  return `<p><a class="back" href="#/">&larr; All deals</a></p>
<article class="detail">
  <h1>${escape(d.title)}</h1>
  <p class="detail-meta">${escape(d.store)} &middot; ${escape(d.category)}</p>
  <p class="detail-price"><b>${usd(d.price)}</b> <s>${usd(d.was)}</s> <span class="off big">${percentOff(d)}% off</span></p>
  <p class="detail-save">You save <b>${usd(dollarsSaved(d))}</b> off the usual price.</p>
  <section class="verdict-box ${v.cls}"><h2>Verdict: ${escape(v.label)}</h2><p>${escape(d.evidence)}</p><p class="verdict-blurb">${escape(v.blurb)}.</p></section>
  <dl class="facts">
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Checked</dt><dd>${checkedShort(d.checked)}</dd>
    <dt>Price read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="cta" href="${escape(d.url)}" rel="noopener" target="_blank">Buy at ${escape(d.store)} &mdash; ${usd(d.price)} &rarr;</a></p>
  ${cross}
</article>`;
}

export function missingPage() {
  return `<h1>Deal not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
