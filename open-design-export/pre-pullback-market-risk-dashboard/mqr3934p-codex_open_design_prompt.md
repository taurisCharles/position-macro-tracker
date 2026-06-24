# Claude Design Prompt — "Codex" Portfolio Decision Engine

> Copy everything inside the rule below into Claude Design (Open Design). It is self-contained.

---

**Build a dark, data-dense, Bloomberg-terminal-meets-modern web app called "Codex" — a portfolio decision-and-monitoring engine.** It does not auto-trade; it scores opportunities through a disciplined gate framework, times entries with technicals, and monitors holdings for drift. Use sample/representative data (described at the end) so every screen renders fully. Design for desktop-first, with a responsive layout.

## Product concept

Codex implements a four-part investing framework. Reflect this structure in the navigation and visual hierarchy:

- **Layer A — Macro Regime** (gates ALL deployment). A "deploy gates" meter from 0-3 driven by valuation witnesses and a kill-switch, fed by macro data (FRED).
- **Layer B — Single-Name Gates** (decides WHAT passes). Four sequential elimination gates per ticker.
- **Module C — Entry & Monitoring** (decides WHEN and watches for rot). Confluence of fundamental value zones with technical support; position lifecycle; drift detection.
- **Speculative Sleeve** (parallel, walled-off track for pre-profit names, capped and tagged).

Tagline to show somewhere: *"Fundamentals choose. Macro sizes. Technicals time. Monitoring protects."*

## Navigation (left sidebar)
Command Center · Macro Regime · Watchlists · Ticker Detail · Positions · Speculative Sleeve · Alerts

---

## Screen 1 — Command Center (dashboard)
- **Macro Regime banner** at top: a horizontal "Deploy Gates" gauge reading **1 / 3** ("Patient — nibble only"), with the three valuation witnesses as chips: CAPE 41 (red), Buffett Indicator 233% (red), Fed-adjusted 192% (amber). A "Test-0 kill switch" status light (green = OK).
- **Portfolio snapshot:** total value, cash % (show a high ~40% cash), and a barbell visual (safe core vs small speculative tail).
- **Active alerts** feed (most urgent): e.g., "GOOGL entered confluence zone ~$312," "NVDA drift: cyclical-peak earnings flag," "Kill criterion armed: MSFT below 200-day."
- **Watchlist heat strip:** the watchlist tickers as tiles colored by state (green = buy-signal, blue = watchlist, amber = needs pullback, grey = rejected).

## Screen 2 — Macro Regime (Layer A)
- Big **Deploy Gates gauge (0-3)** with explanation of current reading.
- **Valuation witnesses** panel: CAPE, Buffett Indicator, Fed-adjusted Buffett Indicator — each with current value, historical band, and a "nibble / add / truck" threshold ladder.
- **FRED macro panel** (label as live-data-fed): Core CPI MoM, Fed Funds rate, 10-yr Treasury, High-Yield credit spreads, stock-bond correlation. Each as a sparkline + current value + a regime flag.
- **Test-0 kill switch** card: shows the three conditions (stock-bond correlation flip / core CPI re-accelerating / Fed stance) and an overall pass/fail.

## Screen 3 — Watchlists (the core interactive surface)
- Support **multiple named watchlists** (e.g., "Out-of-Favor Quality," "In-Circle Energy/Royalty," "Cyclicals — Wait," "Speculative Sleeve").
- Prominent **"+ Add Ticker"** button (with an input/search field).
- Each watchlist is a **table**, one row per ticker, columns:
  - Ticker / name
  - **State** (pill: Watchlist / Entry-Zone / Confirmed / Owned / Trim / Rejected)
  - **Gate scores**: four small dots/badges (G1 Knowable, G2 Healthy, G3 Price, G4 Thesis) colored pass/fail/caution
  - **Tier** (A/B/C/D)
  - Current price · Fundamental "fair" price · **Add** · **Truck**
  - **Confluence flag** (★ when a fundamental level meets technical support, with tooltip listing the agreeing methods)
  - Distance-to-entry % · mini price sparkline with 50/200-day MA
  - Kill-criterion status

## Screen 4 — Ticker Detail (the deep view)
Header: ticker, price, state pill, tier, one-line thesis, deploy-gate context.

Then four panels:

1. **The Four Gates** (Layer B) — each gate as a card with pass/fail/caution, a one-line rationale, and the key metric:
   - G1 Knowable / in-circle (and a "too-hard" flag)
   - G2 Healthy vs Impaired (earnings-trend arrow; value-trap detector)
   - G3 Price-implied belief (a gauge: conservative / reasonable / heroic) with the "earnings basis" tag (real / peak-cyclical / reinvestment)
   - G4 Independent thesis + **editable kill criterion** field

2. **Valuation & Entry Zones** — forward P/E vs historical mean; a vertical price ladder showing current price, Fair, Nibble, Add, Truck levels; for cyclicals show a "haircut earnings" toggle that re-derives the zones on cut EPS.

3. **Technical chart (the WHEN layer)** — candlestick/line chart with 50-day & 200-day MAs, **Fibonacci retracement overlay** (38.2/50/61.8/78.6%), prior swing lows, and **highlighted confluence zones** where fundamental levels meet technical support. Show RSI subpanel and a "support confirmed?" indicator (the buy trigger). Place a suggested ATR-based stop line.

4. **News & Monitoring** — a news feed for the ticker (sentiment-tagged), the kill-criterion metric being tracked with its threshold, re-underwriting triggers, and a drift-status line.

## Screen 5 — Positions
- Owned holdings table: ticker, lifecycle state, cost basis, current weight vs **target weight**, P&L, stop, kill-criterion status, "overweight → trim" flag for winners that have run.
- A **barbell allocation** visual: safe core vs speculative tail vs cash.

## Screen 6 — Speculative Sleeve (visually distinct, walled off)
- A clear banner: "Speculative — capped at X% of portfolio, pre-accepted as losable. NEVER counts as core."
- Sleeve cap progress bar.
- Names scored on the **Launch Gates** instead: S1 Survival (runway/dilution), S2 Convergence (margin trend, backlog/book-to-bill), S3 Structural Edge (vs "TAM-only" flag), S4 Asymmetry + written pre-mortem.
- Each name sized as a small lottery ticket; show upside-multiple-if-win vs downside.

## Screen 7 — Alerts
A unified, filterable alert stream with types:
- **Buy signal** (confluence zone + support confirmed + deploy gates permit)
- **Entry-zone armed** (price in zone, awaiting confirmation)
- **Knife warning** (below falling 200-day)
- **Drift** (value-trap drift / heroic drift / parabola drift / borrowed-conviction drift / circle drift)
- **Kill criterion fired**
- **Re-underwrite** (earnings, capex change, ±20% move, governance)

---

## Data integrations to represent (design for these as live feeds, render with sample data)
- **FRED** → Macro Regime panel (CPI, Fed Funds, 10-yr, HY spreads, stock-bond correlation) and the valuation witnesses.
- **Market/fundamental data** → prices, P/E, EPS estimates, margins, balance-sheet items, 50/200-day MAs, swing highs/lows for Fibonacci.
- **News feed** → per-ticker, sentiment-tagged, feeding the kill-criterion and drift monitors.

## Seed data (use to populate the mockup realistically)
- **GOOGL** — Watchlist→Entry-Zone, Tier A. Gates: G1 pass, G2 pass, G3 reasonable, G4 set. Price ~$350; Fair ~$360; Add $313; Truck $270. ★ Confluence at ~$312 (Fib 38.2% + fundamental Add). News: AI-talent departures (sentiment negative, sentiment-not-fundamental tag).
- **META** — Watchlist, Tier A. G1-G3 pass (reasonable ~20x), price ~$610; Add $540; Truck $450.
- **MSFT** — Watchlist, Tier A, **knife-warning** (below falling 200-day). Price ~$367; Add $340; Truck $295.
- **AAPL** — Watchlist, Tier B, G3 = caution (pricey for ~9% growth). Price ~$297; Fair ~$235; Add $228.
- **NVDA** — Watchlist, Tier C, **drift: cyclical-peak**. Forward P/E ~22x flagged "peak-cyclical earnings basis"; haircut toggle re-derives entry to ~$120-150; current ~$209.
- **EPD** — Owned, in-circle income, Tier A; ~6% yield; healthy.
- **VNOM** — Owned, in-circle royalty; ~5% yield; G1 strongly in-circle.
- **TSLA** — Rejected / Too-Hard (G3 heroic ~195x). No technical analysis shown.
- **ARM** — Rejected (pay-for-perfection ~190x, beta 3.78).
- **RDW** — Speculative Sleeve; Launch Gates: S1 weak-pass (dilution flag), S2 converging (margin trend up), S3 some edge, S4 asymmetry + pre-mortem written.

## Design aesthetic
Dark theme, high information density but uncluttered, a "professional trading terminal" feel with modern polish. Use color sparingly and meaningfully: green (pass/buy), red (fail/expensive), amber (caution), blue (watchlist/neutral). Monospace for numbers. Clear typographic hierarchy. Gauges and ladders for the regime gates and entry zones. Make the gate dots/badges and the confluence ★ instantly scannable across the watchlist table.
