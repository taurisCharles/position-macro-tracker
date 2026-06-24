# Portfolio Management Tool — Methodology & Functional Spec

**Working title:** Gate-Based Position Manager
**Version:** v0.5 (build-scope tags added: [MVP] vs [Later]; no mechanics changed)
**Purpose:** Decision-support tool that runs both the *market* and each *position* through fixed elimination gates, combining a fundamental lens (what to own / what it's worth) with a technical lens (when to act), so conviction is always independent, written down, and confirmed by price before capital moves.
**Disclaimer:** Personal decision framework, not investment advice. Anchors dated June 2026.

---

## 0. Build Scope — ship lean, learn, then extend

**Why this section exists:** more gates do not equal more edge. Every gauge added before launch is one you have never seen fire, cannot calibrate, and that gives you another way to talk yourself out of acting when the gates align (the documented failure mode). Ship the smallest version that delivers the core protection, run it through one real market move, then add.

**Tag key:** `[MVP]` = build for v1. `[Later]` = roadmap, add only after v1 has run through a real move.

**v1 MVP — the minimum that delivers the edge:**
- Single-name: the four fundamental gates, the written kill criterion, the add-lock, and the two detectors found by hand (value-trap, debt-funded-buyback). Simplest technical only: price vs 200-day + support-confirmed.
- Macro: Test 0 regime kill switch, ONE valuation witness (CAPE), Gate M3 (capitulation + support), and the deploy/sizing logic.
- The Layer Bridge core routing, plus the buckets.

**`[Later]` roadmap:** second/third valuation witnesses (Buffett Indicator, Fed-adjusted), Gate M2 relative value, the HY financial-conditions filter + yield curve, relative strength, stage analysis, extended/overbought guard, volume confirmation, vol-harvest funding automation.

---

## 1. Design Philosophy `[MVP]`

The tool does not predict prices. It enforces discipline across **two layers** and **two lenses**.

**Two layers:**
- **Layer A — Macro / Regime (top-down):** *when* is the market a place to deploy vs. wait?
- **Layer B — Single-name (bottom-up):** *which* businesses to own or hold inside that window.

**Two lenses (applied in BOTH layers):**
- **Fundamental lens — WHAT & WHERE:** is it worth owning, and at what price? (Valuation, quality, implied expectations.)
- **Technical lens — WHEN:** is now the moment to act? (Trend, support, relative strength, capitulation.)

**Core rule: never act on one lens alone.**
- Fundamentals without technicals → catching falling knives (the STZ "it's cheap" trap; cheap kept getting cheaper).
- Technicals without fundamentals → momentum chasing (the SpaceX hype trap; strength with no valuation floor).
- A buy requires *both* to align. An exit can be triggered by *either*.

Index logic (CAPE, VIX, breadth) belongs only to Layer A. Single-name logic belongs only to Layer B. The **Layer Bridge** (Section 5) is the connective tissue that lets macro state govern single-name action.

### Intellectual lineage (About screen)
- Circle of competence / "too hard pile" — Buffett & Munger
- Quality + moat; value-trap literature — Buffett; academic
- Expectations Investing (price-implied assumptions) — Rappaport & Mauboussin
- Margin of safety / inversion — Graham; Munger
- Capital-allocation scrutiny (buybacks, debt) — Thorndike, *The Outsiders*
- Market cycles, "prepare don't predict" — Howard Marks
- Pre-commitment, anchoring, disposition effect — behavioral finance
- Stage analysis / trend & support — Weinstein; Dow theory; O'Neil/Minervini (buy strength off a base)
- Relative strength / dual momentum — Antonacci

The bespoke elements: the **elimination-gate sequencing** and the **fundamental×technical "both must agree to buy, either can trigger sell"** rule.

---

## 2. LAYER A — Macro / Regime (top-down) `[MVP]`

Ported from the Regime Entry Checklist. Runs Test 0 first (kill switch), then three gates. Output = `regime` + `deploy_gates_open (0-3)`.

### Test 0 — KILL SWITCH (check first, every cycle) `[MVP]`
*Is the inflation/rate regime still in force? If flipped, the whole playbook changes.*
- Stock–bond correlation in a selloff: **both fall together → inflation/rate regime ON** (real-asset tilt live). **Bonds rally as stocks fall → deflation/growth scare** → STOP; favor duration, not commodities.
- Core CPI still hot month-over-month (current early-warning: last print ~+0.2% MoM — softening is the tell).
- Fed holding/hiking, not signaling cuts (now: holding; hikes > cuts priced).
- Rule: all three flip (bonds bid + core MoM ~0 + Fed pivots) → `regime = deflation_growth`; pause inflation playbook.

### Gate M1 — VALUATION (fundamental). Requires TWO independent witnesses to agree.  `[MVP: Witness A / CAPE]` `[Later: Witnesses B & C]`
M1 is a green light only when **both** gauges below confirm. One alone = context, not a signal. (They measure valuation differently — CAPE is price/smoothed-earnings; Buffett Indicator is market-cap/output, i.e. a market-wide price/sales — so agreement is meaningful corroboration.)

**Witness A — CAPE (Shiller P/E).** Anchor: CAPE ~41 @ S&P ~7,400.
- Nibble: CAPE ~32 → S&P ~5,775 (-22%). "Average" ≠ cheap.
- Add: CAPE ~28 → S&P ~5,050 (-32%).
- Back up the truck: CAPE <24 → S&P <4,330 (-41%).
- Recompute index levels as 10-yr earnings average rises.

**Witness B — Buffett Indicator (Total Market Cap / GDP).** `[Later]` Current ~233% (all-time high since 1970; ~1.8x the 20-yr avg of ~128%; implied ~-1.1%/yr forward).
- GuruFocus zones: >167% Significantly Overvalued | 141-167% Modestly Over | 115-141% Fair | 90-115% Modestly Under | <90% Significantly Under.
- Map to gate levels: Nibble when it falls toward the 20-yr average (~128%, fair zone); Add toward ~115%; truck below ~90%.
- **Known bias (build a warning into the UI):** denominator is *domestic* GDP while US market cap reflects *global* earnings → ratio is structurally higher than pre-2000 history; do not compare today's level to the 1970s-80s naively. Also ignores interest rates. Treat the *trend and zone*, not the absolute level vs ancient history.

**Witness C — Fed-adjusted Buffett Indicator, TMC / (GDP + Fed assets).** `[Later]` Currently ~192% (also a record; 20-yr avg ~105%). Same measure adjusted for liquidity, so it partly neutralizes the QE/QT distortion that inflates Witness B. Use as the tiebreaker: if CAPE and the raw Buffett Indicator disagree, the Fed-adjusted reading is the deciding valuation vote.

**M1 confirm rule:** `m1_green = cape_at_or_below_band AND buffett_indicator_at_or_below_band` (the two primary witnesses), with Witness C as tiebreaker on divergence. All three are valuation gauges; do not add a non-valuation metric here. Divergence (one cheap, one rich) = no signal, investigate why. *`[MVP]` v1 simplification: `m1_green = cape_at_or_below_band` (single witness); add the AND-of-witnesses only once the second gauge is built.*

### Financial Conditions gauge (HY credit spreads) — context filter, NOT a valuation input  `[Later]`
Credit spreads measure risk appetite and system stress, not whether stocks are cheap. They serve two distinct roles, kept separate:
- **As a regime/stress read (feeds Test 0 and sizing):** tight/compressed spreads = complacency, risk-on, *be more cautious adding even if M1 improves*; widening spreads = rising stress, a warning the environment is turning; this is a *conditions* signal, not a buy/sell trigger by itself.
- **As the capitulation trigger (in M3):** spreads blow out, then *peak and start tightening* = the panic is exhausting → part of the M3 buy/harvest signal.
- Rule of thumb anchors: IG/HY spreads near cycle tights = late-cycle complacency flag; a fast widening of HY spreads (e.g. blowing through long-run averages) = stress rising; the *peak-and-tighten* turn is the actionable one.
- Optional companion: the Treasury yield curve (inversion → recession-risk context). Both are *conditions*, informing how aggressively to act on the gates, never substituting for them.

### Gate M2 — RELATIVE VALUE (fundamental) `[Later]`
- Equity earnings yield (1/CAPE) minus 3-mo T-bill yield ≥ +1%.
- Now: 2.4% − 4.0% = **−1.6% (FAIL)** — paid more to wait in cash. Opens near CAPE ~20 if bills hold 4%; sooner if bills fall. Recompute vs live bill yield.

### Gate M3 — CAPITULATION + SUPPORT (technical) — *do NOT buy the flush itself*  `[MVP]`
- FLUSH: VIX into the 30s + futures curve in backwardation → **harvest vol here.**
- % of S&P stocks above 200-day MA < 20%, then turning up.
- HY credit spreads blow out, then peak and tighten.
- SUPPORT confirmed: index stops making lower lows — retest holds, OR 20/50-day reclaim, OR VIX peaks and rolls. **Only now does equity deploy.**

### Combination rule (this is "when") `[MVP]`
`deploy_gates_open`: 1 = noise/do nothing; 2 = start ONE tranche; 3 = fat pitch, size up. Always tranche across M1 levels. Never all-in. *`[MVP]` v1: with only M1 and M3 live, "deploy" = both green; M2 adds a third vote `[Later]`.*

---

## 3. LAYER B — Single-Name (bottom-up) `[MVP]`

### 3a. Fundamental gates (knockout order — WHAT & WHERE) `[MVP]`

**Gate 1 — KNOWABLE?** Forecastable 10 yrs within your circle? FAIL = "too hard" pile, no price saves it. Tag `in_circle`/`out_of_circle` (out-of-circle = visible warning regardless of other gates).

**Gate 2 — HEALTHY or IMPAIRED?** Cheap-out-of-favor (proceed) vs cheap-because-eroding (value-trap flag). Check earnings trend, moat, secular headwinds, margin direction. *Multiple-contraction illusion:* a low P/E is only cheap if E is stable; if forward EPS estimates are being cut, low multiple = correct repricing, not a discount.

**Gate 3 — WHAT DOES PRICE FORCE YOU TO BELIEVE?** Invert: back out required growth/duration/terminal margin at your hurdle. Classify `conservative/reasonable/heroic`. Heroic = pass. Pay only for knowable parts; treat speculative upside as a free option.

**Gate 4 — INDEPENDENT THESIS + PRE-SET EXIT?** One-sentence thesis in your own words (if you can't write it, that's the finding). *Borrowed-conviction test:* "a 13F/smart-investor owns it" = FAIL (you can't exit what you didn't independently enter; 13Fs lag ~45 days). Require a written kill criterion at entry.

### 3b. Technical overlay (WHEN — applied after fundamentals pass) `[MVP: trend + support]` `[Later: RS, extended guard, volume]`

Even when all four gates pass AND a fundamental value level is hit, **wait for technical confirmation before buying.** This is the single-name version of M3's "see support first."

- **Trend / stage:** `[MVP]` price vs 200-day MA. Stage 1 base / Stage 2 advance = ok to buy; Stage 4 decline (below falling 200-day) = do not catch the knife, wait for a base.
- **Support confirmation:** `[MVP]` higher low after the low, OR reclaim of 20/50-day MA on rising volume, OR a tested base that holds. (Your explicit rule.)
- **Relative strength:** `[Later]` name's RS vs its sector and vs S&P. For rotation/recovery theses, require *improving* RS — buying a laggard only once it stops lagging.
- **Extended/overbought guard:** `[Later]` block buys when price is far above the 50-day / RSI stretched — prevents chasing strength (the FOMO guard).
- **Volume:** `[Later]` accumulation (up-days on higher volume) confirms; reclaim on weak volume is suspect.

### 3c. Combined buy/hold/add/exit rules `[MVP]`

- **BUY** (single name) requires ALL: Layer-A allows (`deploy_gates_open ≥ 2`, or a specific idiosyncratic opportunity) **AND** Gates 1-4 PASS **AND** fundamental value level hit **AND** technical support confirmed (3b). Tranche in.
- **HOLD / REVIEW:** re-run Gates 2-4 + trend check on cadence. "Down ≠ wrong; early ≠ wrong." Healthy business in a trend Stage 1 base = hold; impaired business that lost its backer = re-evaluate.
- **ADD (averaging down) — strict:** allowed only if BOTH (i) thesis intact AND (ii) *new information strengthened it* — not merely a lower price. Tool must require typing the strengthening info and reject "it's cheaper." If new info *weakened* the thesis (backer exited, OCF deteriorating), adding is forbidden.
- **EXIT — either lens can fire:**
  - Fundamental: kill criterion hit / target (fair value) reached / borrowed-conviction collapse / better risk-adjusted use of capital (e.g. pay down 6%+ debt vs hold).
  - Technical: decisive break below 200-day on volume / series of lower lows / RS breakdown vs sector.
  - Exit is mechanical once any trigger fires.

---

## 4. Red-Flag Library (automated detectors)

| Flag | Lens | Build | Detection signal |
|---|---|---|---|
| Value trap | F | MVP | Falling fwd P/E + falling fwd-EPS estimates + secular headwind |
| Multiple-contraction illusion | F | MVP | P/E low only because E is being cut |
| Borrowed conviction | F | MVP | Thesis references an institution/13F; no independent rationale |
| Debt-funded buybacks | F | MVP | Rising total debt + buybacks_ttm > operating cash flow + falling OCF |
| Pay-for-perfection | F | MVP | Gate-3 implied belief = heroic |
| Out-of-circle | F | MVP | Position tagged out_of_circle |
| Knife-catching | T | MVP | Buy attempted below falling 200-day, no support confirmation |
| Averaging-down anchor | F+T | MVP | "Add" requested with no strengthened-thesis input |
| Chasing / extended | T | Later | Buy attempted far above 50-day / RSI stretched |
| Weak relative strength | T | Later | RS vs sector & S&P declining while attempting a recovery buy |

---

## 5. THE LAYER BRIDGE (routing — the connective tissue) `[MVP: routing + sizing]` `[Later: vol-harvest automation]`

How macro state governs single-name action. This is what makes it one machine, not two checklists.

```
# Regime gates which buckets are buyable and how aggressively
if regime == 'deflation_growth':
    inflation_playbook = OFF              # commodity/real-asset tilt suspended
    favor = ['duration/long_bonds']       # different playbook entirely
elif regime == 'inflation_rate':
    if deploy_gates_open >= 2:
        unlock_buckets = ['out_of_favor_quality', 'delayed_cyclical']
        route_new_capital_to = ['real_assets', 'energy']   # buy on pullbacks, not breakouts
    else:
        action = 'hold cash (~4% carry) + TIPS; wait'

# Capitulation harvest funds the deployment (the puts = the bridge)
if macro.M3_flush_firing:                 # VIX 30s + backwardation
    action_options = 'SELL VOL (harvest puts)'
    proceeds -> equity_dry_powder         # then deploy at single-name support

# Sizing ladder
buy_size = {1:'none', 2:'one tranche', 3:'full size'}[deploy_gates_open]

# Single-name gate is ANDed with macro
can_buy_name = (deploy_gates_open >= 2 or idiosyncratic_opportunity) \
               and gates_1_4_pass and fundamental_value_hit and technical_support_confirmed
```

Key routing principles:
- Macro says *whether and how big*; single-name gates say *which*; technicals say *exactly when*.
- The vol harvest (selling expensive insurance into M3 panic) is the funding source for the equity deployment that the same panic creates.
- Always-on while waiting: short T-bills + TIPS. This is the cash, earning.

Module C, the Watchlist Engine, governs target pricing, confluence zones, support confirmation, lifecycle state, and long-term monitoring after a candidate passes these gates. See [watchlist-engine.md](watchlist-engine.md).

---

## 6. Buckets (classification output) `[MVP]`
- **Out-of-favor quality** — healthy, cheap on sentiment → real opportunity (buy at support, tranches).
- **Delayed cyclical** — healthy, cheap on the cycle; catalyst deferred → hold through trough; kill signal is the *recurring-revenue* base cracking, not the cyclical line.
- **Value trap** — impaired earnings → avoid/exit; never average down.
- **Pay-for-perfection** — great business, heroic price → too-hard pile/pass; never short hype with expensive long puts.
- **Too hard** — unknowable → pass.

---

## 7. Candidate Screening `[MVP]`

Screening is the pre-position workflow. A candidate is not a position until the relevant screen records enough evidence to pass, the entry snapshot is saved, and the user explicitly converts it.

### Candidate lanes

- **Mature business** — established operating history, financial statements matter, valuation can be bounded, and the four single-name gates govern the decision.
- **Startup / early-stage business** — limited operating history, valuation is more uncertain, survival depends on liquidity, runway, dilution, milestones, and the macro/regime window.

Shared candidate statuses:

- `watchlist` — worth tracking, not ready.
- `blocked` — one or more knockout gates failed; no entry until resolved.
- `ready_for_entry` — gates pass, but still requires support-confirmed entry.
- `entered` — converted to a tracked position.
- `rejected` — archived with reason.

### Mature-business screen `[MVP]`

Use the Layer-B gate method before any mature-business candidate can become a position:

1. **Knowable** — in circle, forecastable business model, understandable unit economics.
2. **Healthy or impaired** — earnings quality, moat durability, margin direction, secular headwind check.
3. **Implied expectations** — price forces conservative, reasonable, or heroic assumptions.
4. **Independent thesis + kill criterion** — written one-sentence thesis, independent rationale, target fair value, and pre-set exit.
5. **Value level hit** — current price is at or below the required value band.
6. **Technical confirmation** — price vs 200-day and support-confirmed entry.

Output:

- `bucket`: out_of_favor_quality, delayed_cyclical, value_trap, pay_for_perfection, too_hard.
- `decision`: blocked, watch, ready_for_entry, reject.
- `blockers`: failed gates and missing evidence.
- `entry_requirements`: value level, support trigger, review date.

### Startup / early-stage screen `[MVP]`

Startup candidates do not get forced through mature-business valuation gates. They use regime entry first, then survival/evidence gates. The default bias is pass/watch, not buy, unless the regime and evidence both allow it.

1. **Regime permission** — Test 0 is not in `deflation_growth`; risk appetite/liquidity is not hostile; deploy gates or a specific idiosyncratic catalyst allow speculative capital.
2. **Runway and dilution** — cash runway, burn rate, debt maturity, financing access, and likely dilution are acceptable for the intended hold period.
3. **Milestone evidence** — product, customer, regulatory, revenue, backlog, or adoption milestones are concrete and dateable.
4. **Market and moat formation** — the market is large enough, customer pain is real, and early defensibility is plausible.
5. **Valuation discipline** — price does not require a perfect outcome; downside and dilution are explicitly modeled.
6. **Technical entry** — no entry into a falling, unsupported tape; require support confirmation or a base/reclaim.
7. **Kill criterion** — milestone miss, financing failure, thesis invalidation, dilution threshold, or technical breakdown is written before entry.

Startup output:

- `startup_stage`: pre_revenue, early_revenue, scaling, distressed/speculative.
- `regime_entry`: blocked, wait_for_support, small_tranche_allowed, reject.
- `max_size`: none, watch_only, starter, normal_speculative.
- `blockers`: regime, runway, dilution, evidence, valuation, technicals.

Startup rule:

```
can_enter_startup = regime_allows_speculation
                    and runway_dilution_ok
                    and milestone_evidence_ok
                    and valuation_not_heroic
                    and technical_support_confirmed
                    and kill_criterion_written
```

If the regime is hostile, only an idiosyncratic catalyst with explicit max loss can override the block, and the tool must label the entry as speculative.

---

## 8. Data Model `[MVP core; Later fields can be null until built]`

```
candidate:
  ticker, name, candidate_type(enum: mature_business/startup_early_stage)
  status(enum: watchlist/blocked/ready_for_entry/entered/rejected)
  thesis_sentence, independent_rationale, kill_criterion
  target_fairvalue, required_entry_price, current_price(feed)
  bucket(enum), decision, blockers[], required_evidence[]
  review_cadence, next_review_at, converted_position_id
  entry_snapshot_json

mature_business_screen:
  candidate_id
  in_circle(bool), g1_knowable, g2_health, g3_implied_belief, g4_independent
  value_level_hit(bool), technical_support_confirmed(bool)
  red_flags[]

startup_screen:
  candidate_id
  startup_stage(enum: pre_revenue/early_revenue/scaling/distressed_speculative)
  regime_entry(enum: blocked/wait_for_support/small_tranche_allowed/reject)
  runway_months, burn_rate, financing_risk(enum), dilution_risk(enum)
  milestone_evidence, next_milestone_date
  market_moat_notes, valuation_discipline(enum)
  max_size(enum: none/watch_only/starter/normal_speculative)
  technical_support_confirmed(bool)

position:
  ticker, in_circle(bool), thesis_sentence, bucket(enum)
  entry_price, entry_date, cost_basis, current_price(feed)
  kill_criterion, target_fairvalue
  gates: {g1_knowable, g2_health, g3_implied_belief, g4_independent}
  technicals:
    ma50, ma200, price_vs_ma200(enum: above/below)
    stage(enum: 1_base/2_advance/3_top/4_decline)
    support_level, support_confirmed(bool)
    rs_vs_sector(trend), rs_vs_spx(trend)
    rsi, extended_flag(bool), volume_confirm(bool)
  flags: [red-flag enums]
  last_review, review_cadence

fundamentals_feed (per ticker, time series):
  fwd_eps_estimate_trend, operating_cash_flow, total_debt, buybacks_ttm, pe_forward

price_feed (per ticker, time series):
  close, volume, ma20, ma50, ma200, rsi, sector_index, benchmark(SPX)

macro_layer (shared):
  regime(enum: inflation_rate/deflation_growth/unclear)
  test0: {stockbond_corr, core_cpi_mom, fed_stance}
  m1_cape, m1_cape_index_levels{nibble,add,truck}
  m1_buffett_indicator, m1_buffett_20yr_avg, m1_buffett_zone(enum)
  m1_buffett_fed_adjusted
  m1_green(bool)          # = cape_band_ok AND buffett_band_ok (two witnesses agree)
  m2_earnings_yield, m2_bill_yield, m2_spread
  conditions: {hy_spread, hy_spread_trend(enum: tightening/widening/peak_turn), yield_curve_slope}
  m3: {vix, vix_backwardation, pct_above_200dma, hy_spread_trend, index_support_confirmed}
  deploy_gates_open(int 0-3)
```

### Derived alerts
```
value_trap_risk      = pe_forward_falling AND fwd_eps_estimate_trend < 0 AND secular_flag
buyback_quality_flag = total_debt_rising AND buybacks_ttm > operating_cash_flow
multiple_illusion    = pe_forward_falling AND fwd_eps_estimate_trend < 0
borrowed_conviction  = thesis_refs_institution AND independent_rationale == null
add_blocked          = current_price < cost_basis AND NOT strengthened_thesis_provided
knife_catching       = buy_attempt AND price < ma200 AND ma200_falling AND NOT support_confirmed
chasing_flag         = buy_attempt AND (price > ma50 * 1.15 OR rsi > 75)
regime_kill          = bonds_bid_in_selloff AND core_cpi_mom ~ 0 AND fed_pivot_to_cuts
m1_two_witness       = cape_at_or_below_band AND buffett_indicator_at_or_below_band   # M1 green only if both
candidate_ready      = candidate.status == ready_for_entry AND support_confirmed
startup_entry_block  = regime == deflation_growth OR runway_months < planned_hold_months OR dilution_risk == high
```

---

## 9. Review Cadence `[MVP]`
- Single-name fundamental gates: quarterly, or on earnings / 13F change / kill-criterion event.
- Single-name technicals: weekly trend/support/RS scan (faster than fundamentals).
- Mature-business candidates: monthly, or on earnings / guide-down / price reaches value band.
- Startup candidates: monthly, and immediately on financing, dilution, milestone, regulatory, or runway events.
- Macro layer: monthly + on CPI/FOMC prints (Test-0 kill switch).
- Re-derive CAPE→index anchors as the 10-yr earnings average rises.

---

## 10. The Honest Gap (permanent UI footnote) `[MVP]`
This tool keeps you from overpaying, from catching knives, from chasing, and from holding on borrowed conviction. It will **not** call exact tops or bottoms; in a structural-bid grind its signals fire slowly and only partway. Its edge is *discipline and surviving being early* — being early is being wrong in P&L, and the gates make early cheap rather than fatal. Largest failure mode it guards against: **capitulating after a long stretch of being early, right before the thesis pays.** The fundamental lens keeps you from chasing; the technical lens keeps you from catching knives; neither alone is sufficient, which is the entire point.
