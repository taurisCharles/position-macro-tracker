# Swing Trading Data Plan

This project is for manually logged theoretical and real swing trades. The goal
is not day-trading execution. The app should help answer:

- Why did I enter this trade?
- What did the market, macro, valuation, and volatility backdrop look like at entry?
- What has changed since entry?
- Did any invalidation, profit, stop, time, or macro trigger fire?

## Core Objects To Track

### Trade Journal

Each trade should capture:

- Symbol or option contract.
- Entry date and intended holding period.
- Entry price or option premium.
- Position size.
- Thesis narrative.
- Conviction score.
- Setup category.
- Profit target.
- Stop loss or invalidation rule.
- Time stop.
- Notes, screenshots, or external references.

The thesis snapshot should be immutable once saved.

### Market Regime At Entry

Capture these at entry and compare against current values:

- VIX.
- VIX/VIX3M ratio.
- VVIX.
- 10Y Treasury yield.
- 2Y/10Y spread.
- SPY and QQQ trend context.
- 20/50/200-day moving-average relationship.
- Market breadth if available.
- Sector trend if trading a single name.

### Valuation Backdrop

Use valuation metrics as context, not as exact timing signals:

- S&P 500 P/E.
- Shiller PE.
- S&P 500 dividend yield.
- S&P 500 earnings yield.
- Valuation versus rates where useful.

### Oil And Gas / Macro Inputs

For energy or inflation-sensitive trades, track:

- WTI.
- Henry Hub.
- Crude inventories.
- Gasoline inventories.
- Natural gas storage.
- US crude production.
- Refinery utilization.

### Event Calendar

Track upcoming events that can change the thesis:

- Earnings date.
- Ex-dividend date.
- FOMC.
- CPI.
- Jobs report.
- EIA petroleum status report.
- EIA natural gas storage report.

### Technical Setup

Keep technicals simple and explainable:

- Trend: 20/50/200-day moving averages.
- Momentum: RSI or rate of change.
- Volatility: ATR or realized volatility.
- Manual support/resistance levels.
- Distance from entry to invalidation.
- Distance from entry to target.

### Options-Specific Fields

For option trades:

- Underlying.
- Expiry.
- Strike.
- Right: put or call.
- Entry premium.
- Current premium.
- Days to expiry.
- Break-even.
- IV at entry versus now.
- Delta, gamma, theta, vega when available.
- Open interest and volume.
- IV rank/percentile if available or computable.

## Preferred Free Data Sources

| Source | Role | Notes |
|---|---|---|
| FRED | Macro time series | Free API key. Use for VIX, VIX3M, VVIX, rates, CPI, unemployment, and broad macro series. |
| EIA | Oil and gas data | Free API key. Use for WTI, Henry Hub, inventories, production, storage, and refinery utilization. |
| Multpl | Valuation context | Public web source. Cache locally and store source URLs with retrieved values. |
| NASDAQ Trader | Symbol directory | Free source for ticker lookup/autocomplete. Not a quote provider. |
| yfinance | Quotes/history | Free and useful for MVP, but unofficial. Cache values and expect occasional failures. |

## Optional Paid Sources

| Source | When To Consider | Why |
|---|---|---|
| Koyfin Plus | First paid research subscription | Strong fit for swing trading research, dashboards, screens, charts, valuation, macro, earnings, and watchlists. |
| Tradier | First paid/API upgrade for options | Useful for option chains, Greeks, IV, quotes, and expirations. |
| X API | Only if narrative feed becomes important | Useful for narrative context, but access/pricing changes and should not be required for core app workflows. |
| Polygon/Massive | Later only | Overkill unless real-time market data or breadth/tape becomes necessary. |

Default path:

1. Start with free sources: FRED, EIA, Multpl, NASDAQ symbols, yfinance, and manual trade entry.
2. Add Koyfin if research workflow needs a stronger human-facing dashboard.
3. Add Tradier if options chains, Greeks, and IV become central.
4. Add X only as optional narrative capture.

## Provider Design

Use provider interfaces so the app can swap sources without changing trade logic:

- `SymbolProvider`
- `QuoteProvider`
- `OptionChainProvider`
- `MacroProvider`
- `EnergyProvider`
- `ValuationProvider`
- `SocialFeedProvider`
- `CalendarProvider`

Provider outputs should always include:

- Value.
- Unit.
- Observation date.
- Retrieval timestamp.
- Source name.
- Source identifier, such as FRED series code, EIA route/facet, Multpl URL, or post id.

## Data Integrity Rules

- Never overwrite the entry thesis snapshot after save.
- Cache all remote pulls locally.
- Record source and retrieval metadata for every value used in a thesis.
- Treat Multpl as web-sourced and store the URL.
- Treat yfinance as best-effort, not authoritative.
- Treat X as narrative context, not a trading signal by itself.
- Keep manual override fields for every automated value.

## Phase 1 Scaffold Target

Phase 1 should support:

- Manual theoretical trade entry.
- Ticker search/autocomplete.
- Equity and option trade forms.
- Thesis and conviction capture.
- Entry macro snapshot using FRED.
- Oil/gas context using EIA.
- Valuation context using Multpl.
- yfinance quote/history marks.
- Simple technical indicators from daily prices.
- Exit-rule evaluation.
- Dashboard panels for open trades, thesis-vs-now, macro monitor, and triggered rules.

No automated trading, broker execution, or live Fidelity API dependency belongs
in Phase 1.

