# Token Radar — sector-comps edition (radar-2-comps)

A token launch radar for the token-radar-01 competition: it ranks pre-token protocols by the value
the market's own comparables imply for them today, states the model in full on the page, and hands
every protocol a farm plan a reader can follow step by step.

## The model

The sealed snapshot carries both TVL and market cap for 133 live-token protocols. For each category,
the median ratio of TVL to market cap among those live protocols is what buyers pay, today, for one
dollar of that business. A protocol with no token is priced by the same measure:

```
sectorMult  = median(tvl / mcap) of the category's live protocols
              (the global median when the category has fewer than 3 live comps)
base        = tvl_usd / sectorMult
growthMult  = 1 + clamp(change_7d, -60, +120) / 100 x 0.5
maturity    = 0.6 + min(age_days, 1095) / 1095 x 0.4      (unknown age scores as 365 days)
signalBonus = 1.10 when the slug is on the house watchlist, else 1.0
implied     = max(1, round(base x growthMult x maturity x signalBonus))
```

No protocol name is special-cased anywhere: the ranking falls out of the snapshot's own figures.
The board ranks the whole 40-slug watchlist plus the 160 strongest early protocols below the
$50,000,000 floor, which is where a radar earns its keep.

## The dashboard

A static page with no framework and no network: `dashboard/index.html` reads `../data.js`, which
`main.ts` writes beside it.

- `app.js` — the board table, sorting, the search and category filters, the detail dialog and the
  model panel, which states the formula and every category's multiple and sample size.
- `farm.js` — the farm-plan engine: six steps per protocol, derived from its category, chains, TVL
  and age, plus short reader notes on risk.
- `live.js` — the Live token view: protocols that already trade, each with its own tvl/mcap ratio
  beside the sector multiple the model uses for its category.
- `plan.css` and `app.css` — the dark ink-and-amber theme and the plan timeline.

## Running it

```
node main.ts --input /input              # the scorer's mount
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts --input ../input/snapshot.json
```

Output lands in `/output`: `board.json` (200 rows), `data.js`, `dashboard/`, `screenshots/`
(three images) and `dossier.json`.

## Layout

```
main.ts                  entrypoint: parse, score, write, copy, dossier
lib/model.ts             the value model and the board builder
vendor/makefun-board.ts  make.fun's dossier library
dashboard/               the page, no network, no framework
screenshots/             board, detail, filtered
```
