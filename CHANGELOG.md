# Changelog

## radar-2-comps (v2)

- Value model rebuilt as sector comps: per-category median TVL/mcap of live-token protocols, global
  median fallback when a category has fewer than three live comps, growth clamped to the -60 to
  +120 range at half weight, maturity from the listing age over a three-year window, and a 10%
  premium for house-screened watchlist slugs.
- Farm plans regenerated from each protocol's own record: the category names the action, the chain
  comes from the record, the position size scales with TVL, the hold window stretches for younger
  protocols, and every step carries a cost and a time.
- Reader notes per protocol: how old it is, what its TVL did over seven days, and what the implied
  value does and does not claim.
- Dashboard rebuilt: dark ink-and-amber theme, board with sort, search and category filters, a
  detail dialog whose equation recomputes in the page, and a model panel that states the formula
  with every category's multiple and sample size.
- Live token view rebuilt: each row shows the market's own tvl/mcap ratio beside the sector
  multiple the model uses for that category, with a relative-TVL bar.
- Board shape: the whole 40-slug watchlist plus the 160 strongest early protocols under the floor,
  ranked by implied value with stable slug tie-breaks.

## starter baseline (v1)

- The kit's starter as unpacked: flat TVL x 0.25 x growth x maturity model, plain light dashboard,
  one generic six-step farm plan for every protocol, 200 rows, gate-clean.
- Kept as the reference point the v2 numbers are compared against.
