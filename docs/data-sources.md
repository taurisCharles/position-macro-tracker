# Data Sources

This app is local-first and source-aware. Each thesis snapshot should store both the value and the source that produced it.

## Preferred Sources

| Source | Role | Cost | Notes |
|---|---|---|---|
| FRED | Macro time series | Free API key | Primary macro source for rates, volatility, inflation, labor, and broad economic context. |
| EIA | Oil and gas fundamentals | Free API key | Primary energy source for WTI, Henry Hub, inventories, production, demand, storage, and petroleum/natural gas routes. |
| Multpl | Market valuation context | Free web source | Useful for S&P 500 PE, Shiller PE, dividend yield, earnings yield, and long valuation history. Treat as web-sourced and cache locally. |
| X | Social/news narrative feed | Optional paid/token access | Useful for capturing narrative context around entry and monitoring dates. Do not require it for Phase 1. |
| NASDAQ Trader | Symbol directory | Free | Ticker lookup/autocomplete only. Not a quote source. |
| yfinance | Best-effort quotes/history | Free unofficial | Good for theoretical trade marks in Phase 1. Cache results and expect occasional failures. |
| SEC EDGAR | Filings and company disclosures | Free | Use for 10-K, 10-Q, S-1, 8-K, proxy, debt, dilution, cash/runway, and milestone evidence. |
| Company IR | Primary company evidence | Free | Use for investor decks, press releases, earnings materials, pipeline updates, and milestone dates. Store URLs and retrieval timestamps. |

## FRED Starter Series

| Code | Label | Use |
|---|---|---|
| `VIXCLS` | VIX close | Volatility baseline. |
| `VXVCLS` | CBOE 3-month volatility index | VIX/VIX3M regime ratio. |
| `VVIXCLS` | VVIX | Volatility-of-volatility context. |
| `DGS10` | 10-year Treasury yield | Rates backdrop. |
| `T10Y2Y` | 10Y minus 2Y spread | Yield curve regime. |
| `CPIAUCSL` | CPI | Inflation regime. |
| `UNRATE` | Unemployment rate | Labor regime. |
| `SP500` | S&P 500 index | Broad market context. |

## EIA Starter Topics

Use EIA API v2 routes. Keep the route/facet map configurable because EIA route shapes vary by dataset.

| Topic | Use |
|---|---|
| WTI spot | Oil price context for energy equities, inflation, and macro stress. |
| Henry Hub spot | Natural gas context. |
| Weekly crude inventories | Supply/demand stress. |
| Weekly gasoline inventories | Refined product balance. |
| Natural gas storage | Gas regime and seasonality. |
| US crude production | Production trend. |
| Refinery utilization | Downstream demand/capacity stress. |

## Multpl Starter Metrics

| Metric | Use |
|---|---|
| S&P 500 P/E Ratio | Broad valuation backdrop. |
| Shiller PE Ratio | Long-cycle valuation regime. |
| S&P 500 Dividend Yield | Equity risk premium context. |
| S&P 500 Earnings Yield | Valuation vs rates comparison. |

## Candidate Screening Inputs

### Mature Business Candidates

Use these inputs to support the gate method:

| Input | Use |
|---|---|
| Revenue, operating income, margins | Business health and trend. |
| Forward EPS estimates | Value-trap and multiple-contraction checks. |
| Operating cash flow | Earnings quality and buyback quality. |
| Total debt and maturities | Balance-sheet risk. |
| Buybacks and share count | Debt-funded buyback and dilution checks. |
| Segment/geography notes | Knowability and secular-headwind review. |
| Price history and moving averages | Technical confirmation. |

### Startup / Early-Stage Candidates

Startup screening needs survival and evidence data more than mature-company multiples:

| Input | Use |
|---|---|
| Cash, burn rate, runway | Survival through the intended hold period. |
| Debt, preferred stock, warrants, convertibles | Dilution and financing risk. |
| Share count trend | Dilution pressure. |
| Revenue traction, backlog, customer counts | Milestone evidence. |
| Regulatory/product milestones | Dateable catalysts and kill criteria. |
| Gross margin or unit economics, if available | Evidence of business model quality. |
| Insider ownership and financing history | Alignment and access to capital. |
| Price history, 200-day MA, support/base behavior | Regime-entry timing. |

For startup candidates, missing data is itself a blocker unless the user explicitly marks the candidate as speculative and sets a max loss.

## X Feed Topics

X should be used as a context feed, not a trading signal by itself. Store links, author handles, post ids, retrieval time, and the query that found each post.

| Topic | Example query intent | Use |
|---|---|---|
| Volatility | VIX, VVIX, volatility-control, hedging terms | Capture volatility narrative at entry. |
| Rates | 10Y, yield curve, Fed, Treasury yields | Capture rates narrative for equity and option theses. |
| Oil and gas | WTI, Henry Hub, crude, natural gas, EIA | Capture energy-market narrative. |
| Position watchlist | Symbols from open theoretical trades | Show what the market is saying about tracked names. |

Current implementation rule: X is optional and disabled unless an `X_BEARER_TOKEN` is provided. API pricing/read access changes often, so verify cost before enabling automated pulls.

## Implementation Rules

- Capture source, observation date, retrieval timestamp, and units.
- Cache all remote pulls locally.
- Do not overwrite thesis entry snapshots after save.
- For Multpl, store the source URL with every value.
- For EIA and FRED, store the series/route identifier and API response metadata when available.
- For X, store post id, URL, author, query, retrieval timestamp, and whether the post was used in a thesis snapshot.
- For SEC and company IR sources, store filing/accession id when available, source URL, period date, retrieval timestamp, and the exact field or claim used.
- Keep theoretical trades manual-first: source data informs marks and context, but does not imply execution.
