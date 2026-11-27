[![make.fun](https://img.shields.io/badge/make.fun-black--friday--deal--finder--01-7c3aed)](https://make.fun/c/black-friday-deal-finder-01)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![status](https://img.shields.io/badge/status-built-blue)](app/index.html)

# DealBeacon — Black Friday Deal Finder

A static deal finder of real Black Friday and Cyber Monday 2026 deals, built
for the [make.fun bounty](https://make.fun/c/black-friday-deal-finder-01).

Every deal was checked on 27 Nov 2026 at its store or in a named deals
source, and carries an honest five-tier verdict — NEW LOW, STRONG, GOOD,
ROUTINE, or NOT A DEAL — with the evidence behind it. The finder has search,
filters by category, store and minimum discount, five sorts, a detail page per
deal, and a same-product cross-store price comparison.

## Run it

```sh
node serve.ts
# app/ is on http://localhost:8080
```

No build step, no network requests, no framework: plain HTML, CSS and
vanilla JavaScript under `app/`, with the deals in `app/data.js`.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library.
