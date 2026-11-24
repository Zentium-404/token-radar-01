# Data appendix

## Snapshot shape

The sealed input carries exactly four top-level fields:

- `as_of` — the UTC date of the house's single DefiLlama fetch, the anchor every age in the model
  is measured from.
- `source` — the endpoint and the exact fetch time, quoted in the dashboard's header.
- `floor_usd` — the watchlist floor in whole dollars, $50,000,000 here.
- `protocols` — every protocol at or above $5,000,000 of TVL, sorted by slug, ten fields each:
  slug, name, category (null when DefiLlama names none), chains, tvl_usd, change_7d (null when
  unreported), mcap_usd (null when no token is recorded), listed_at (the UTC day tracking began,
  or null), gecko_id and symbol (both null when no token).

`watchlist` names the 40 slugs the house's rule kept: at or above the floor, no token recorded,
not a wrapped, staked or bridged product of a trading token, not a bridge, liquid staking, liquid
restaking, restaked BTC or exchange category, no version-marker name, no wrapped/staked words, no
exchange-name prefix.

## Board shape

`/output/board.json` holds `rows`: 200 entries, each with rank (1 to 200), slug, name, the ten
snapshot fields carried through, `token_status: "pre-token"`, `age_days`, `implied_value_usd`, a
`model` block with the row's sector multiple, its sample size, its growth percentage, its growth
and maturity multipliers and its age, and `farm_steps` as six strings of 20 to 600 characters.

Ranks follow implied value descending, ties broken on slug. Every watchlist slug appears; the other
160 rows are the strongest pre-token protocols below the floor, which is where the radar earns its
keep — the watchlist is a floor, never a ceiling.

## Files

- `main.ts` — parse the snapshot, score the board, check it against the gate's shape, write
  board.json, data.js, the dashboard, the screenshots and the dossier.
- `lib/model.ts` — the comps model, the board builder, the snapshot parser and the shape check.
- `vendor/makefun-board.ts` — make.fun's dossier library, vendored as the starter ships it.
- `dashboard/` — index.html, app.css, plan.css, app.js, farm.js, live.js; no framework, no network.
- `screenshots/` — the board, a detail view with its farm plan, and a filtered view.
