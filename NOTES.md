# Model notes

## Why comps

The snapshot is a single sealed frame, so anything the board claims has to come out of that frame.
The only prices in it are the market caps of the 133 protocols that already trade. Those prices
carry the market's judgment about what a unit of each business is worth, and the TVL/mcap ratio is
that judgment expressed per category. A protocol with no token is the same kind of business with the
same kind of cash flows, so its category's ratio is the least-invented number available for it.

## The multipliers

Growth is half-weighted and clamped: seven-day TVL moves are noisy, and a protocol doubling in a
week is usually running an incentive program, not compounding a business. Age runs on a three-year
window from 0.6 to 1.0 of the maturity multiplier, because a protocol tracked for years has survived
at least one market cycle. The watchlist premium is small on purpose: the house's screen is evidence,
not proof, and the radar's job is the protocols the screen did not catch.

Ties break on slug so the board is deterministic: two runs over the same snapshot produce the same
file, which is what the scorer's rebuild compares.

## What the number is not

The implied value is not a prediction that a token comes, or when it comes. It is the value the
business would command if it were priced like its peers today — the entry's own claim, stated on the
page, recomputed in the browser from the same model constants, and never attributed to make.fun.

## Where the model is weakest

- Categories with one or two live comps score against the global median, which blends very
  different businesses together.
- A protocol the snapshot records as token-less may already have a token its record does not carry.
- Seven-day growth says nothing about why capital moved; the reader notes flag the extremes but
  cannot explain them.
- The model has no view on team, audits or token design, because the snapshot carries none of them.

## Reading the page

The board sorts by implied value, then by growth, TVL, or age on a second click. The search matches
names and slugs; the category filter narrows to one sector and keeps the ranks from the full board.
The detail dialog shows the equation with the row's own numbers and recomputes it in the page, so a
reader can see the arithmetic rather than trust the table.
