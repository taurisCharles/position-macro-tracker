# Build Spec

This project implements a personal, local-first application to screen candidates, track positions, capture entry thesis assumptions, and compare current market/macro conditions against the entry baseline.

## Differentiator

Most trackers focus on current P&L. This app stores why a position was opened and what the macro setup looked like at entry, then monitors whether exit rules or thesis-drift triggers have fired.

The research workflow starts before entry. New candidates are screened into two lanes:

- Mature businesses: run through the gate method for knowability, business health, implied expectations, independent thesis, value level, and technical confirmation.
- Startup or early-stage businesses: run through a regime-entry screen that treats macro/liquidity conditions, funding runway, dilution risk, milestone evidence, and technical confirmation as the governing constraints.

A candidate can graduate into a tracked position only after the relevant lane records its pass/fail gates, written thesis, kill criterion, and entry snapshot.

## Fidelity Constraint

Fidelity does not provide a public retail brokerage API. Phase 1 uses manual CSV imports for positions. Market data and option chains must come from separate providers.

## Phase Defaults

- Phase 1: Fidelity CSV, yfinance, FRED.
- Phase 2: Tradier for quotes/option chains, optional SnapTrade for Fidelity sync.
- Phase 3: VIX futures term structure and richer alerts.
- Phase 4: explicitly gated broker execution.

## Screening Scope

Phase 1 should support manual candidate creation and review before position entry:

- Candidate type: `mature_business` or `startup_early_stage`.
- Candidate status: `watchlist`, `blocked`, `ready_for_entry`, `entered`, `rejected`.
- Mature-business screen: four fundamental gates, target fair value, kill criterion, bucket, red flags, price vs 200-day, and support confirmation.
- Startup screen: regime permission, funding/runway quality, dilution risk, milestone traction, founder/product-market evidence, valuation discipline, and support-confirmed entry.
- Shared output: action recommendation, blockers, required evidence, suggested review date, and immutable snapshot if converted to a position.

## Entry Targeting Scope

Use the Watchlist Engine in [watchlist-engine.md](watchlist-engine.md) as Module C after macro and single-name gates:

- Layer B produces fundamental value zones: fair, nibble, add, and truck prices.
- Module C combines those zones with technical witnesses: moving averages, prior support, market structure, volume, Fibonacci confluence, and later anchored VWAP.
- A candidate reaching a target price becomes `ENTRY_ZONE`, not an automatic buy.
- A buy requires support confirmation plus macro permission.
- The same module governs ongoing monitoring, drift detection, kill-criterion tracking, trims, and exits.

Trade execution is out of scope for v1.
