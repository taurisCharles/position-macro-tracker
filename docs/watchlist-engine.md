# Entry-Timing & Monitoring Module - The Watchlist Engine

**Module:** C, after Layer A macro and Layer B single-name gates
**Version:** v0.1
**Purpose:** Govern what happens to a name after it passes the fundamental gates: how to time entry, how to treat it at each stage, and how to monitor it long term. This is the connective tissue between "this is a good business at a fair price" and an actual managed position.
**Disclaimer:** Decision framework, not advice. Gate 4, independent thesis plus written kill criterion, is required on every owned position. Macro overlay gates all deployment.

---

## 0. Where This Module Sits

```text
Layer A (macro regime checklist)  -> gates ALL deployment (deploy_gates_open: 0-3)
Layer B (4 single-name gates)     -> decides WHAT passes (knowable/healthy/priced/thesis)
Module C (this)                   -> decides WHEN to enter, HOW to treat, HOW to monitor
Speculative sleeve module         -> parallel track for pre-profit names (tagged, walled off)
```

A name only enters this module after passing Layer B. This module never overrides a fundamental verdict. A perfect technical setup on a Gate-3 failure is still no trade. Technicals time and risk-define; fundamentals decide.

---

## 1. Position Lifecycle `[MVP]`

Every name is in exactly one state. The tool is a state machine.

| State | Meaning | Treatment |
|---|---|---|
| `SCREENED` | Ran through gates; result logged | Route to `REJECTED` or `WATCHLIST`. |
| `REJECTED` / `TOO_HARD` | Failed Gate 1, value-trap, heroic, or impaired | Archive with reason; re-screen only on a fundamental change. |
| `WATCHLIST` | Passed gates, but price not yet attractive | Monitor; compute entry zones; wait. |
| `ENTRY_ZONE` | Price reached a fundamental value level and/or confluence zone | Do not buy yet. Arm the confirmation trigger; watch support. |
| `CONFIRMED` | Support confirmed and macro permits | Enter first tranche; set ATR stop; write Gate-4 thesis and kill criterion. |
| `OWNED` | Position held | Monitor kill criterion and thesis; add at lower confluence tranches only if thesis intact; let winners run. |
| `TRIM_SCALE` | Winner ran, position is overweight, target hit, or thesis weakening | Trim to target weight or reduce. |
| `EXIT` | Kill criterion fired, gate now fails, or stop hit | Exit; archive with post-mortem. |

Key transition rule: `WATCHLIST -> ENTRY_ZONE -> CONFIRMED` is gated by both technical confirmation and macro deploy gates. At a confluence zone with deploy gates shut, only a small nibble is permitted. Full Add/Truck deployment requires the regime checklist to open during a broad drawdown.

---

## 2. The WHEN Layer - Confluence Engine `[MVP]`

Fundamentals set the value zones: Nibble, Add, and Truck prices from Layer B. Technicals locate support and define risk. The output is confluence: where a fundamental value level and at least one technical level stack near the same price.

A value level with no technical support beneath it is weaker. A technical level with no fundamental value behind it is no trade.

### Technical Witnesses

#### Tier 1 - Structural `[MVP]`

- **Moving averages:** 50-day for intermediate trend; 200-day for primary trend and Weinstein stage. Do not buy below a falling 200-day, Stage 4; wait for a base.
- **Prior swing lows / horizontal support:** transaction memory; the most reliable level type.
- **Market structure:** higher highs and higher lows mean uptrend intact; first lower low is a break.
- **Volume:** support holding on rising volume is stronger; low-volume bounce is suspect.

#### Tier 2 - Refinement / Confluence `[MVP for Fib; Later for VWAP]`

- **Fibonacci retracement:** draw swing low to swing high; flag 38.2%, 50%, 61.8%, and 78.6%. Caveat: weak theoretical basis; use only for confluence, never standalone.
- **Anchored VWAP `[Later]`:** institutional cost basis from a key date, such as the high or an earnings gap.
- **Round numbers:** psychological levels.

#### Tier 3 - Confirmation / Risk `[Later]`

- **RSI / momentum divergence:** price makes a new low while RSI makes a higher low, showing waning selling.
- **ATR:** size stops to volatility; wider for high-beta names.
- **Relative strength:** buy improving relative strength versus sector and SPX.

### Confluence Detection `[MVP]`

```python
for each watchlist_name:
    fib_levels = fib_retracement(swing_low, swing_high)  # 38.2/50/61.8/78.6%
    support_levels = [ma_200, ma_50, prior_swing_low, round_numbers] + fib_levels

    for value_level in [fund_add_price, fund_truck_price]:
        for support_level in support_levels:
            if abs(value_level - support_level) / value_level < 0.04:
                flag_confluence_zone(
                    price=mean(value_level, support_level),
                    methods=[value_level, support_level],
                )
```

Worked example: GOOGL swing from `$163` to `$404`, Fib 38.2% near `$312`, and fundamental Add near `$313` creates a confluence zone around `$312`. Two independent witnesses make this the cleanest kind of entry the engine should surface.

### Confirmation Trigger `[MVP]`

Price reaching a confluence zone is not the buy. Require one of:

- Higher low after the zone.
- Reclaim of the 20-day or 50-day on rising volume.
- RSI divergence.

Only then enter, with the stop just below the confluence zone and sized to ATR. This converts "I think this is support" into "support proved itself, and I know where I am wrong."

---

## 3. How To Treat Each Tier `[MVP]`

- **Tier A - already-reasonable quality:** `WATCHLIST` or `ENTRY_ZONE` now. Nibble on single-name weakness at confluence; reserve Add/Truck tranches for a broad-market drawdown that opens macro gates.
- **Tier B - good business, needs a real pullback:** `WATCHLIST`. Do nothing until price reaches the mean-reversion value zone; no nibbling above it.
- **Tier C - cyclical peak:** `WATCHLIST` with a flag. Haircut earnings first. The value level drops if estimates get cut, so re-derive the zone on cut EPS before treating any technical level as a floor. Buy only at trough earnings plus confirmed base.
- **Tier D - fundamental fail:** `REJECTED`. No technical analysis, no watchlist. Technical analysis on a pass is decoration.

---

## 4. Long-Term Monitoring `[MVP]`

The monitoring job is to notice change before it costs you: a thesis breaking, a healthy name drifting into a value trap, a winner going parabolic, or a kill criterion firing.

### Monitoring Cadence

| Holding type | Cadence |
|---|---|
| `OWNED` core | Every earnings plus any thesis event: capex change, contract/customer, governance, or +/-20% move. |
| `WATCHLIST` | Weekly price-vs-entry-zone check plus every earnings. |
| `OWNED` speculative sleeve | More frequent and milestone-driven; every quarter check runway, dilution, and margin trend. |
| Macro layer | Monthly regime-checklist refresh: deploy gates and valuation witnesses. |

### Re-Underwriting Triggers

Force a full gate re-run on:

- Earnings report.
- Capex or guidance change.
- Major contract or customer event.
- Management or governance change.
- +/-20% price move.
- Any kill-criterion data point crossing.

### Drift Detection `[MVP]`

Periodically re-run the gates on owned and watchlist names and alert on state changes, because quality erodes silently.

```text
drift_alerts:
  value_trap_drift = earnings_trend flipped to declining
  heroic_drift     = price-implied belief crossed into heroic
  parabola_drift   = price extended > N sigma above 50-day / RSI sustained overbought
  borrowed_drift   = thesis now leans on momentum, analyst, or holder
  circle_drift     = thesis quietly became a macro/forecast bet
```

A drift alert moves a name from `OWNED` toward `TRIM_SCALE` or `EXIT` for review. It does not auto-sell; it forces a re-decision.

### Kill-Criterion Tracking `[MVP]`

Each owned position stores its written falsifier as a monitored field tied to a metric. The tool alerts when the metric crosses. Examples:

- Large-cap platform: forward EPS estimates cut without monetization evidence.
- Cyclical AI-capex name: capex guidance softens or inventory builds.
- Delayed cyclical: the down-quarter that was supposed to test the thesis arrives and breaks the recurring-revenue base.

A fired kill criterion means mandatory re-decision, not optional review.

### Winner Management `[MVP]`

- Let winners run, but if a position exceeds target weight, trim to target.
- Add only on a strengthened thesis or a lower confluence tranche with thesis intact.
- Never average down on price alone. A falling quality name is often thesis breakage, not a discount.

---

## 5. Data Model And Derived Alerts `[MVP]`

```text
position:
  ticker, state(enum), tier(enum A/B/C/D), speculative_tag(bool)
  thesis_sentence, kill_criterion, kill_metric, kill_threshold
  entry_zones: [{price, type: nibble/add/truck, confluence_methods[]}]
  stop_price, target_weight, current_weight, cost_basis

valuation:
  fund_fair_price, fund_add_price, fund_truck_price
  earnings_basis(enum: real/peak_cyclical/reinvestment)
  gate_status: {g1, g2, g3, g4}

technical:
  ma_50, ma_200, ma_200_slope(enum up/flat/down)
  swing_low, swing_high, fib_levels[]
  rsi, atr, rel_strength_trend(enum)
  support_confirmed(bool)

macro_link:
  deploy_gates_open(int 0-3)

derived_alerts:
  confluence_zone   = fund level within ~4% of a technical support level
  entry_armed       = price in confluence_zone AND NOT support_confirmed
  buy_signal        = price in confluence_zone AND support_confirmed AND deploy_gates_open >= 1
  knife_warning     = price below falling ma_200
  haircut_required  = earnings_basis == peak_cyclical AND not re-derived on cut EPS
  drift_*           = see drift detection
  kill_fired        = kill_metric crossed kill_threshold
  overweight        = current_weight > target_weight
```

---

## 6. Integration With Other Modules `[MVP]`

- **Layer A gates size.** `buy_signal` requires `deploy_gates_open >= 1`. At `0`, watchlist only. At `2-3`, broad drawdown Add/Truck tranches unlock.
- **Layer B feeds the zones.** `fund_add_price`, `fund_truck_price`, and `earnings_basis` come from the single-name gates. If a re-run flips a gate, drift fires.
- **Speculative names do not enter Module C's core lifecycle.** They run the parallel sleeve module, tagged and walled off.
- **One-way valve:** `REJECTED -> WATCHLIST` only on a documented fundamental change, never on price action or a good-looking chart alone.

---

## 7. Honest Gap

This module cannot predict tops or bottoms, and Fibonacci/technical levels are probabilistic, not magic. What it does: stops you buying value levels with no support beneath them, stops you deploying into froth while macro gates are shut, surfaces rare high-conviction confluence entries, and catches silent drift.

The discipline it enforces: fundamentals choose, macro sizes, technicals time, monitoring protects.

Not advice. Levels are illustrative; verify live. Gate 4 and the kill criterion are yours on every position.
