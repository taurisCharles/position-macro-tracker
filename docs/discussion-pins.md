# Discussion Pins

Use this as the running checklist while the Open Design UI is being built.

## Product Shape

- This is a gate-based investment decision app, not just a P&L tracker.
- Open Design is being used to build the Project UI/prototype.
- The backend/data pipes can come later; the UI should be designed around eventual API-backed fields.
- The app should support candidates before they become positions.

## Core Workflows

1. **Macro Regime**
   - Test 0 kill switch.
   - CAPE valuation gate.
   - VIX/VIX3M and backwardation.
   - `deploy_gates_open` from 0-3.
   - Macro gates sizing and deployment permission.

2. **Candidate Screening**
   - Mature-business lane uses the gate method.
   - Startup / early-stage lane uses regime-entry plus runway, dilution, milestone evidence, valuation discipline, and support confirmation.
   - Candidate statuses: `watchlist`, `blocked`, `ready_for_entry`, `entered`, `rejected`.

3. **Watchlist Engine / Target Pricing**
   - Module C after Layer A and Layer B.
   - State machine: `SCREENED`, `WATCHLIST`, `ENTRY_ZONE`, `CONFIRMED`, `OWNED`, `TRIM_SCALE`, `EXIT`.
   - Fundamental zones: fair, nibble, add, truck.
   - Technical witnesses: 50/200-day moving averages, prior support, market structure, volume, Fibonacci confluence, later anchored VWAP.
   - Reaching a price target creates `ENTRY_ZONE`, not an automatic buy.
   - Buy requires support confirmation and macro permission.

4. **Position Monitoring**
   - Written thesis and kill criterion required.
   - Drift detection catches value-trap drift, heroic valuation drift, borrowed-conviction drift, circle-of-competence drift, and parabola/overweight risk.
   - Fired kill criterion means mandatory re-decision.
   - Add only on strengthened thesis or lower confluence tranche with thesis intact.

5. **Data Health**
   - UI should show data-pipe status without becoming an engineering screen.
   - Pipes to plan for: FRED, Yahoo/yfinance or other price feed, SEC EDGAR, EIA, manual overrides.
   - Each source should show connected/stale/error, last pull, failed symbols/series, and pending manual evidence.

## Open Design UI Target

- Dense operational cockpit, not a marketing page.
- Left navigation: Macro, Candidates, Watchlist, Positions, Alerts, Data.
- Top strip: regime state, deploy gates, cash/debt priority, next refresh.
- Main table: watchlist/candidate names with state, target price, current price, confluence, confirmation, blockers.
- Right detail panel: selected name gates, entry zones, technical witnesses, kill criterion, next action.

## Eventual API Surfaces

```text
/api/candidates
/api/candidates/:id/screen
/api/watchlist
/api/watchlist/:id/entry-zones
/api/macro/regime
/api/positions
/api/alerts
/api/data-sources/status
```

## Important Design Rules

- Fundamentals choose.
- Macro sizes.
- Technicals time.
- Monitoring protects.
- Technical analysis never rescues a fundamental fail.
- Speculative/startup names stay tagged and walled off from the mature-business lifecycle.
- All live values should eventually be cached with source, observation date, retrieval timestamp, units, and raw payload.
