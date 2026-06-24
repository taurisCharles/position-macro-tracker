# Button Test Plan

Use this plan to verify every clickable control in the React UI either performs the intended action, persists state correctly, or is clearly disabled/future-gated.

## Goal

Verify all buttons, navigation controls, row clicks, selects, and toggles across the prototype.

Acceptance criteria:

- No console errors.
- No dead buttons except intentionally future-gated ones.
- Every control has visible feedback: route change, form open/close, persisted row, layer toggle, or disabled explanation.
- Mobile width remains usable, especially nav, tables, Add Ticker form, and chart toggles.

## Test Pass 1: Navigation

Click each left-nav item:

- Command Center
- Macro Regime
- Screener
- Watchlists
- Ticker Detail
- Chart Workspace
- Positions
- Alerts
- Data Health
- Trade Ideas

Expected:

- Active nav state changes.
- Correct screen renders.
- No blank page.
- No console error.

## Test Pass 2: Command Center

Actions:

- Click `Run Scout`.
- Click each heat-strip ticker tile.
- Click rows in the Watchlist Engine table.

Expected:

- `Run Scout` routes to Screener.
- Ticker clicks route to Ticker Detail.
- Selected ticker matches clicked row/tile.

## Test Pass 3: Screener

Actions:

- Switch between `Mature business lane` and `Startup / speculative lane`.
- Click `Add Ticker`.
- Fill minimal ticker form and save.
- Cancel Add Ticker form.
- Add duplicate ticker symbol.
- Refresh browser.

Expected:

- Lane switch filters visible candidates.
- Add form opens and closes.
- New ticker persists via `localStorage` key `codex.tickers`.
- Duplicate symbol replaces prior ticker cleanly.
- Cancel does not add.
- Refresh preserves added tickers.

## Test Pass 4: Watchlists

Actions:

- Click each ticker card.

Expected:

- Routes to Ticker Detail.
- Selected ticker matches clicked card.

## Test Pass 5: Ticker Detail

Actions:

- Change ticker dropdown.
- Click `Open Chart`.

Expected:

- Detail content updates to selected ticker.
- Chart Workspace opens for selected ticker.

## Test Pass 6: Chart Workspace

Actions:

- Change ticker dropdown.
- Toggle `MA`, `FIB`, `RSI`, and `ATR`.

Expected:

- Chart content updates to selected ticker.
- Overlays show/hide without layout shift or errors.

## Test Pass 7: Disabled / Future Controls

Actions:

- Open Trade Ideas.

Expected:

- Execution is clearly disabled/future-gated.
- No broker-like action can be taken.

## Test Pass 8: Persistence / Reset

Actions:

- Add 2-3 tickers.
- Refresh page.
- Confirm they remain.
- Clear browser localStorage key `codex.tickers`.
- Refresh page.

Expected:

- Added tickers persist after refresh.
- Clearing `codex.tickers` restores seed data on next page load.

## Notes For Next Session

Current UI storage is browser `localStorage`, not SQLite.

Production persistence should move to backend APIs and SQLite tables:

- `candidates`
- `price_bars`
- `technical_snapshots`
- `entry_zones`
- `alerts`

Production chart flow should be:

```text
Yahoo/yfinance daily bars
-> SQLite price_bars
-> technical snapshot service
-> /api/watchlist/:symbol/technicals
-> React chart
```
