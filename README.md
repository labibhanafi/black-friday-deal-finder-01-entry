[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/labibhanafi/black-friday-deal-finder-01-entry/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/labibhanafi/black-friday-deal-finder-01-entry/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)

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
