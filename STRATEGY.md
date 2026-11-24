# Strategy

The judge reads the dashboard, the model and the farm plans against the house dashboards. Three
pillars, in the order the scoring weighs them:

1. Value model from snapshot figures. The comps model reads the market's own valuations out of the
   snapshot: per category, the median TVL/mcap ratio of live-token protocols. A pre-token protocol
   is priced as its category's market prices that business today, adjusted for growth, age and
   watchlist standing. Nothing is hardcoded; the whole model is stated on the page, per row in the
   detail dialog, with each category's multiple and its sample size beside it.

2. Farm plans that fit the protocol. Each plan is six steps generated from the protocol's own
   record — category names the action, chains name the place, TVL names the position size, age
   names the qualifying window — with cost and time per step and short risk notes. The same
   generator covers every category, so the plan is never a copy-paste line.

3. A dashboard that reads well. Dark ink-and-amber theme, a board with sort, search and category
   filters, a detail dialog whose equation recomputes in the page, a model panel with the formula
   and the comps table, and a Live token view that sets the model's multiples beside the market's
   own ratios.

## What was improved over the starter

- The starter's flat `TVL x 0.25 x growth x maturity` formula priced every protocol identically per
  dollar; the comps model prices each by what its own category's market pays.
- Farm plans were generic; they are now category-aware and age-aware, with costs and times.
- The dashboard was a plain light table; it is now a themed page with a stated model, a live-comps
  view, plan timeline chips and per-protocol notes.
- The board keeps the watchlist whole and adds 160 early protocols below the floor, which is the
  radar's actual job.

## Honest limits

- The implied value is an estimate from one sealed snapshot: it is the entry's claim, not a price
  and not a prediction of whether or when a token appears.
- A protocol the snapshot records as token-less may still have a token its record does not carry.
- Categories with fewer than three live comps fall back to the global median, and the page says so.
