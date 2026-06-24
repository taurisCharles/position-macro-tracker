import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  CircleDollarSign,
  Database,
  Gauge,
  LineChart,
  Search,
  ShieldCheck,
  Table2,
} from "lucide-react";
import "./styles.css";

const navItems = [
  { id: "command", label: "Command Center", icon: Gauge },
  { id: "macro", label: "Macro Regime", icon: BarChart3 },
  { id: "screener", label: "Screener", icon: Search },
  { id: "watchlists", label: "Watchlists", icon: Table2 },
  { id: "ticker", label: "Ticker Detail", icon: LineChart },
  { id: "positions", label: "Positions", icon: CircleDollarSign },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "data", label: "Data Health", icon: Database },
  { id: "trades", label: "Trade Ideas", icon: Bot },
];

const macro = {
  deployGatesOpen: 1,
  posture: "Patient - nibble only",
  test0: "Regime OK",
  witnesses: [
    { label: "CAPE", value: "41", tone: "bad", band: "Red", ladder: "Nibble 32 / Add 28 / Truck 24" },
    { label: "Buffett", value: "233%", tone: "bad", band: "Extreme", ladder: "Fair near 128%" },
    { label: "Fed-adjusted", value: "192%", tone: "warn", band: "Record", ladder: "Tiebreaker witness" },
  ],
  metrics: [
    { label: "Core CPI MoM", value: "0.2%", source: "FRED", flag: "watch", spark: [33, 26, 28, 20, 18, 22] },
    { label: "Fed Funds", value: "4.00%", source: "FRED", flag: "hold", spark: [48, 48, 48, 48, 47, 47] },
    { label: "10Y Treasury", value: "4.70%", source: "FRED", flag: "tight", spark: [34, 38, 42, 39, 45, 47] },
    { label: "HY Spread", value: "3.1%", source: "FRED", flag: "calm", spark: [42, 39, 35, 33, 31, 31] },
    { label: "VIX/VIX3M", value: "0.96", source: "FRED", flag: "flat", spark: [80, 72, 64, 55, 50, 48] },
  ],
};

const tickers = [
  {
    symbol: "GOOGL",
    name: "Alphabet",
    group: "Out-of-Favor Quality",
    state: "ENTRY_ZONE",
    tier: "A",
    price: 350,
    fair: 360,
    add: 313,
    truck: 270,
    distance: 12.1,
    confluence: "Fib 38.2% + Add zone",
    gates: ["pass", "pass", "pass", "pass"],
    kill: "Armed",
    thesis: "Platform quality with AI monetization optionality; add only when support confirms near value.",
    earningsBasis: "real",
    drift: "News negative, not fundamental",
    support: "Awaiting higher low",
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    group: "Out-of-Favor Quality",
    state: "WATCHLIST",
    tier: "A",
    price: 610,
    fair: 630,
    add: 540,
    truck: 450,
    distance: 13,
    confluence: "No current confluence",
    gates: ["pass", "pass", "pass", "pass"],
    kill: "Clear",
    thesis: "Advertising engine plus optional AI efficiency; wait for pullback into Add zone.",
    earningsBasis: "real",
    drift: "None",
    support: "Above rising 200D",
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    group: "Out-of-Favor Quality",
    state: "WATCHLIST",
    tier: "A",
    price: 367,
    fair: 390,
    add: 340,
    truck: 295,
    distance: 7.9,
    confluence: "Knife warning",
    gates: ["pass", "pass", "pass", "pass"],
    kill: "Armed",
    thesis: "Durable compounder; do not catch below falling 200-day without a base.",
    earningsBasis: "real",
    drift: "Below falling 200D",
    support: "Not confirmed",
  },
  {
    symbol: "AAPL",
    name: "Apple",
    group: "Needs Pullback",
    state: "WATCHLIST",
    tier: "B",
    price: 297,
    fair: 235,
    add: 228,
    truck: 190,
    distance: 30.3,
    confluence: "Too high",
    gates: ["pass", "pass", "warn", "pass"],
    kill: "Clear",
    thesis: "Great business, but current price asks too much for expected growth.",
    earningsBasis: "real",
    drift: "Price-implied belief caution",
    support: "No value support",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    group: "Cyclicals - Wait",
    state: "WATCHLIST",
    tier: "C",
    price: 209,
    fair: 170,
    add: 145,
    truck: 120,
    distance: 44.1,
    confluence: "Haircut required",
    gates: ["pass", "warn", "warn", "pass"],
    kill: "Capex guide",
    thesis: "Cyclical peak earnings risk; re-derive on cut EPS before treating levels as floors.",
    earningsBasis: "peak_cyclical",
    drift: "Cyclical-peak earnings flag",
    support: "Wait for base",
  },
  {
    symbol: "EPD",
    name: "Enterprise Products",
    group: "Owned Income",
    state: "OWNED",
    tier: "A",
    price: 29,
    fair: 33,
    add: 28,
    truck: 24,
    distance: 3.6,
    confluence: "Income add zone",
    gates: ["pass", "pass", "pass", "pass"],
    kill: "Distribution coverage",
    thesis: "In-circle income compounder with durable fee-based cash flows.",
    earningsBasis: "real",
    drift: "None",
    support: "Confirmed",
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    group: "Rejected",
    state: "REJECTED",
    tier: "D",
    price: 420,
    fair: 110,
    add: null,
    truck: null,
    distance: null,
    confluence: "No TA on fail",
    gates: ["warn", "warn", "fail", "fail"],
    kill: "N/A",
    thesis: "Price-implied belief is heroic; archived until fundamental change.",
    earningsBasis: "heroic",
    drift: "Too hard",
    support: "Ignored",
  },
  {
    symbol: "RDW",
    name: "Redwire",
    group: "Speculative Sleeve",
    state: "SPECULATIVE",
    tier: "S",
    price: 12.7,
    fair: null,
    add: null,
    truck: null,
    distance: null,
    confluence: "Launch gates only",
    gates: ["warn", "pass", "warn", "pass"],
    kill: "Dilution threshold",
    thesis: "Speculative asymmetry with dilution risk; walled off from core lifecycle.",
    earningsBasis: "pre_profit",
    drift: "Runway review due",
    support: "Base forming",
  },
];

const alerts = [
  { type: "Entry-zone armed", symbol: "GOOGL", tone: "warn", copy: "Confluence near $312; waiting for support confirmation." },
  { type: "Knife warning", symbol: "MSFT", tone: "bad", copy: "Below falling 200-day. No catch until base forms." },
  { type: "Drift", symbol: "NVDA", tone: "warn", copy: "Peak-cyclical earnings basis requires haircut re-derivation." },
  { type: "Owned review", symbol: "EPD", tone: "good", copy: "Distribution coverage check due after next filing." },
  { type: "Rejected", symbol: "TSLA", tone: "bad", copy: "Gate-3 heroic. Technical analysis suppressed." },
];

const positions = [
  { symbol: "EPD", state: "OWNED", cost: 27.4, price: 29, target: 12, current: 10.4, pnl: 5.8, stop: 24.6, kill: "Clear" },
  { symbol: "VNOM", state: "OWNED", cost: 35.2, price: 38.1, target: 8, current: 7.2, pnl: 8.2, stop: 31.5, kill: "Clear" },
  { symbol: "QQQ 600P", state: "HEDGE", cost: 23.49, price: 26.76, target: 2, current: 1.7, pnl: 13.9, stop: 18.5, kill: "Time stop" },
];

const sources = [
  { name: "FRED", status: "planned", lastPull: "mock", scope: "Macro series, VIX, rates, CPI, HY spreads" },
  { name: "Yahoo / yfinance", status: "planned", lastPull: "mock", scope: "Daily bars, marks, moving averages" },
  { name: "SEC EDGAR", status: "planned", lastPull: "mock", scope: "Company facts, filings, cash, debt, dilution" },
  { name: "EIA", status: "planned", lastPull: "mock", scope: "WTI, Henry Hub, inventories, storage" },
  { name: "Manual overrides", status: "active", lastPull: "local", scope: "Thesis, kill criteria, support confirmation" },
];

function App() {
  const [route, setRoute] = useState("command");
  const [selected, setSelected] = useState("GOOGL");
  const selectedTicker = tickers.find((ticker) => ticker.symbol === selected) || tickers[0];

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} />
      <main>
        {route === "command" && <CommandCenter setRoute={setRoute} setSelected={setSelected} />}
        {route === "macro" && <MacroRegime />}
        {route === "screener" && <Screener setRoute={setRoute} setSelected={setSelected} />}
        {route === "watchlists" && <Watchlists setRoute={setRoute} setSelected={setSelected} />}
        {route === "ticker" && <TickerDetail ticker={selectedTicker} setSelected={setSelected} />}
        {route === "positions" && <Positions />}
        {route === "alerts" && <Alerts />}
        {route === "data" && <DataHealth />}
        {route === "trades" && <TradeIdeas />}
      </main>
    </div>
  );
}

function Sidebar({ route, setRoute }) {
  return (
    <aside className="rail">
      <div className="brand">
        <div className="mark">CX</div>
        <div>
          <h1>Codex</h1>
          <p>Portfolio decision engine</p>
        </div>
      </div>
      <nav className="nav" aria-label="Primary">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              className={route === item.id ? "active" : ""}
              key={item.id}
              onClick={() => setRoute(item.id)}
              type="button"
            >
              <span><Icon size={15} /> {item.label}</span>
              <em>{String(index + 1).padStart(2, "0")}</em>
            </button>
          );
        })}
      </nav>
      <div className="ticker-stack">
        <div className="kicker">Discipline</div>
        <p className="side-note">Fundamentals choose. Macro sizes. Technicals time. Monitoring protects.</p>
      </div>
    </aside>
  );
}

function Header({ kicker, title, copy, action }) {
  return (
    <header className="topbar">
      <div>
        <div className="kicker">{kicker}</div>
        <h2>{title}</h2>
        {copy && <p className="lead">{copy}</p>}
      </div>
      {action}
    </header>
  );
}

function CommandCenter({ setRoute, setSelected }) {
  return (
    <>
      <Header
        kicker="Pre-pullback market risk dashboard"
        title="Command Center"
        copy="A local-first cockpit for macro gates, candidate screening, entry-zone timing, and drift monitoring."
        action={<button className="btn primary" onClick={() => setRoute("screener")}>Run Scout</button>}
      />
      <RegimeBanner />
      <section className="summary">
        <Stat label="Cash" value="40%" sub="Patient dry powder" />
        <Stat label="Deploy gates" value="1 / 3" sub="Nibble only" tone="warn" />
        <Stat label="Entry zones" value="2" sub="GOOGL, EPD" />
        <Stat label="Critical alerts" value="3" sub="Review queue" tone="bad" />
      </section>
      <section className="layout">
        <div className="stack">
          <Panel title="Active Alerts" meta="most urgent">
            <AlertList limit={4} />
          </Panel>
          <Panel title="Watchlist Heat Strip" meta="state machine">
            <div className="heat-strip">
              {tickers.map((ticker) => (
                <button
                  className={`heat-tile ${stateTone(ticker.state)}`}
                  key={ticker.symbol}
                  onClick={() => {
                    setSelected(ticker.symbol);
                    setRoute("ticker");
                  }}
                >
                  <strong>{ticker.symbol}</strong>
                  <span>{ticker.state.replace("_", " ")}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>
        <Panel title="Watchlist Engine" meta="Module C">
          <WatchlistTable tickers={tickers.slice(0, 6)} setRoute={setRoute} setSelected={setSelected} />
        </Panel>
      </section>
    </>
  );
}

function RegimeBanner() {
  return (
    <section className="regime">
      <div>
        <div className="kicker">Layer A - Macro gates all deployment</div>
        <h3>Deploy Gates {macro.deployGatesOpen} / 3</h3>
        <p>{macro.posture}. Test-0 kill switch is green, but valuation witnesses remain hostile.</p>
      </div>
      <div className="gate-meter" aria-label="Deploy gates">
        {[1, 2, 3].map((gate) => <span className={gate <= macro.deployGatesOpen ? "on" : ""} key={gate} />)}
      </div>
      <div className="chips">
        {macro.witnesses.map((witness) => <Pill key={witness.label} tone={witness.tone}>{witness.label} {witness.value}</Pill>)}
        <Pill tone="good">Test-0 OK</Pill>
      </div>
    </section>
  );
}

function MacroRegime() {
  return (
    <>
      <Header
        kicker="Layer A"
        title="Macro Regime"
        copy="Pre-pullback dashboard for divergence: credit or leverage stress worsening while equity valuation remains elevated."
      />
      <RegimeBanner />
      <section className="layout">
        <Panel title="Valuation Witnesses" meta="M1">
          <div className="ladder-grid">
            {macro.witnesses.map((witness) => (
              <div className="box" key={witness.label}>
                <span className="kicker">{witness.band}</span>
                <strong>{witness.label} <span className={witness.tone}>{witness.value}</span></strong>
                <p>{witness.ladder}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="FRED Macro Panel" meta="source mapped">
          <table>
            <thead><tr><th>Metric</th><th>Value</th><th>Flag</th><th>Trend</th><th>Source</th></tr></thead>
            <tbody>
              {macro.metrics.map((metric) => (
                <tr key={metric.label}>
                  <td>{metric.label}</td>
                  <td className="num">{metric.value}</td>
                  <td><Pill tone={metric.flag === "watch" || metric.flag === "tight" ? "warn" : "neutral"}>{metric.flag}</Pill></td>
                  <td><Spark values={metric.spark} /></td>
                  <td className="muted">{metric.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </section>
    </>
  );
}

function Screener({ setRoute, setSelected }) {
  const [mode, setMode] = useState("mature");
  const rows = mode === "startup" ? tickers.filter((t) => t.group === "Speculative Sleeve") : tickers.filter((t) => t.group !== "Speculative Sleeve");
  return (
    <>
      <Header
        kicker="Candidate Screening"
        title="Screener"
        copy="Scout mature businesses through the gate method, or route early-stage names through the regime-entry lane."
        action={
          <div className="toolbar">
            <select className="select" value={mode} onChange={(event) => setMode(event.target.value)}>
              <option value="mature">Mature business lane</option>
              <option value="startup">Startup / speculative lane</option>
            </select>
            <button className="btn primary">Add Ticker</button>
          </div>
        }
      />
      <section className="summary">
        <Stat label="Universe" value={rows.length} />
        <Stat label="Qualified" value={rows.filter((r) => r.gates.every((g) => g === "pass")).length} tone="good" />
        <Stat label="Blocked" value={rows.filter((r) => r.state === "REJECTED").length} tone="bad" />
        <Stat label="Entry armed" value={rows.filter((r) => r.state === "ENTRY_ZONE").length} tone="warn" />
      </section>
      <Panel title={mode === "startup" ? "Startup Candidate Queue" : "Mature Business Candidate Queue"} meta="manual first">
        <WatchlistTable tickers={rows} setRoute={setRoute} setSelected={setSelected} />
      </Panel>
    </>
  );
}

function Watchlists({ setRoute, setSelected }) {
  const groups = useMemo(() => Array.from(new Set(tickers.map((ticker) => ticker.group))), []);
  return (
    <>
      <Header kicker="Module C" title="Watchlists" copy="Tiered lists separate investable ideas from too-hard names, then route valid names into chart timing." />
      <section className="watch-grid">
        {groups.map((group) => (
          <Panel title={group} meta={`${tickers.filter((t) => t.group === group).length} names`} key={group}>
            <div className="card-list">
              {tickers.filter((ticker) => ticker.group === group).map((ticker) => (
                <button className="ticker-card" key={ticker.symbol} onClick={() => { setSelected(ticker.symbol); setRoute("ticker"); }}>
                  <div>
                    <strong>{ticker.symbol}</strong>
                    <span>{ticker.name}</span>
                  </div>
                  <Pill tone={stateTone(ticker.state)}>{ticker.state}</Pill>
                  <p>{ticker.confluence}</p>
                  <div className="mini-row"><GateDots gates={ticker.gates} /><span>Tier {ticker.tier}</span></div>
                </button>
              ))}
            </div>
          </Panel>
        ))}
      </section>
    </>
  );
}

function TickerDetail({ ticker, setSelected }) {
  return (
    <>
      <Header
        kicker="Ticker Detail"
        title={`${ticker.symbol} - ${ticker.name}`}
        copy={ticker.thesis}
        action={<TickerSelect selected={ticker.symbol} setSelected={setSelected} />}
      />
      <section className="ticker-hero">
        <Stat label="State" value={ticker.state} />
        <Stat label="Current" value={money(ticker.price)} />
        <Stat label="Add Zone" value={ticker.add ? money(ticker.add) : "N/A"} tone={ticker.add ? "warn" : "bad"} />
        <Stat label="Support" value={ticker.support} />
      </section>
      <section className="detail-grid">
        <Panel title="The Four Gates" meta="Layer B">
          {["Knowable", "Healthy", "Price-implied", "Thesis + Kill"].map((label, index) => (
            <div className="gate-row" key={label}>
              <GateDots gates={[ticker.gates[index]]} />
              <div>
                <strong>{label}</strong>
                <p>{gateCopy(ticker, index)}</p>
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Valuation & Entry Zones" meta={ticker.earningsBasis}>
          <PriceLadder ticker={ticker} />
        </Panel>
        <Panel title="WHEN Layer" meta="confluence">
          <ChartPlaceholder ticker={ticker} />
        </Panel>
        <Panel title="Monitoring" meta="drift + kill">
          <div className="stack">
            <div className="box"><strong>Kill criterion</strong><p>{ticker.kill}</p></div>
            <div className="box"><strong>Drift status</strong><p>{ticker.drift}</p></div>
            <div className="box"><strong>Next action</strong><p>{nextAction(ticker)}</p></div>
          </div>
        </Panel>
      </section>
    </>
  );
}

function Positions() {
  return (
    <>
      <Header kicker="Owned Lifecycle" title="Positions" copy="Owned holdings track target weight, kill criteria, stops, overweight flags, and review state." />
      <section className="layout">
        <Panel title="Owned Holdings" meta="monitoring protects">
          <table>
            <thead><tr><th>Ticker</th><th>State</th><th>Cost</th><th>Price</th><th>Weight</th><th>P&L</th><th>Stop</th><th>Kill</th></tr></thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.symbol}>
                  <td className="num">{position.symbol}</td>
                  <td><Pill tone="good">{position.state}</Pill></td>
                  <td className="num">{money(position.cost)}</td>
                  <td className="num">{money(position.price)}</td>
                  <td><WeightBar current={position.current} target={position.target} /></td>
                  <td className="good num">{position.pnl}%</td>
                  <td className="num">{money(position.stop)}</td>
                  <td>{position.kill}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="Barbell Allocation" meta="safe core + tail">
          <div className="allocation">
            <span style={{ width: "46%" }}>Cash / bills 40%</span>
            <span style={{ width: "36%" }}>Core 42%</span>
            <span style={{ width: "18%" }}>Spec 6%</span>
          </div>
          <p className="note">Speculative sleeve is capped and walled off. It never counts as core.</p>
        </Panel>
      </section>
    </>
  );
}

function Alerts() {
  return (
    <>
      <Header kicker="Unified Alert Stream" title="Alerts" copy="Entry-zone, buy signal, knife warning, drift, kill criterion, and re-underwriting events." />
      <Panel title="Review Queue" meta={`${alerts.length} active`}>
        <AlertList />
      </Panel>
    </>
  );
}

function DataHealth() {
  return (
    <>
      <Header kicker="Data Pipes" title="Data Health" copy="UI contract for eventual FRED, price, SEC, EIA, and manual evidence feeds." />
      <section className="data-grid">
        {sources.map((source) => (
          <Panel title={source.name} meta={source.status} key={source.name}>
            <div className="source-card">
              <Pill tone={source.status === "active" ? "good" : "warn"}>{source.status}</Pill>
              <strong>{source.lastPull}</strong>
              <p>{source.scope}</p>
            </div>
          </Panel>
        ))}
      </section>
    </>
  );
}

function TradeIdeas() {
  return (
    <>
      <Header kicker="Future Gated" title="Trade Ideas" copy="Execution staging is intentionally disabled in v1. Keep broker keys and order submission backend-only." />
      <section className="regime blocked">
        <ShieldCheck size={24} />
        <div>
          <h3>Trading disabled</h3>
          <p>The app is decision support only. Re-enable this page only after explicit broker, paper/live, review, kill-switch, and audit controls exist.</p>
        </div>
      </section>
    </>
  );
}

function WatchlistTable({ tickers: rows, setRoute, setSelected }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Ticker</th><th>State</th><th>Gates</th><th>Tier</th><th>Current</th><th>Fair</th><th>Add</th><th>Truck</th><th>Confluence</th><th>Distance</th><th>Kill</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((ticker) => (
            <tr key={ticker.symbol} onClick={() => { setSelected(ticker.symbol); setRoute("ticker"); }}>
              <td><strong className="num">{ticker.symbol}</strong><br /><span className="muted">{ticker.name}</span></td>
              <td><Pill tone={stateTone(ticker.state)}>{ticker.state}</Pill></td>
              <td><GateDots gates={ticker.gates} /></td>
              <td>Tier {ticker.tier}</td>
              <td className="num">{money(ticker.price)}</td>
              <td className="num">{ticker.fair ? money(ticker.fair) : "N/A"}</td>
              <td className="num">{ticker.add ? money(ticker.add) : "N/A"}</td>
              <td className="num">{ticker.truck ? money(ticker.truck) : "N/A"}</td>
              <td>{ticker.confluence}</td>
              <td className="num">{ticker.distance ? `${ticker.distance}%` : "N/A"}</td>
              <td>{ticker.kill}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Panel({ title, meta, children }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
        {meta && <Pill>{meta}</Pill>}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

function Stat({ label, value, sub, tone }) {
  return (
    <div className="stat">
      <label>{label}</label>
      <strong className={tone}>{value}</strong>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function Pill({ tone = "neutral", children }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function GateDots({ gates }) {
  return (
    <div className="gate-dots">
      {gates.map((gate, index) => <span className={gate} key={`${gate}-${index}`} title={gate} />)}
    </div>
  );
}

function AlertList({ limit }) {
  return (
    <div className="alert-list">
      {alerts.slice(0, limit || alerts.length).map((alert) => (
        <div className="alert-item" key={`${alert.type}-${alert.symbol}`}>
          <AlertTriangle className={alert.tone} size={18} />
          <div>
            <strong>{alert.type} - <span className="num">{alert.symbol}</span></strong>
            <p>{alert.copy}</p>
          </div>
          <Pill tone={alert.tone}>review</Pill>
        </div>
      ))}
    </div>
  );
}

function Spark({ values }) {
  const points = values.map((value, index) => `${index * 18},${60 - value}`).join(" ");
  return (
    <svg className="spark" viewBox="0 0 92 64" role="img" aria-label="sparkline">
      <polyline points={points} />
    </svg>
  );
}

function PriceLadder({ ticker }) {
  const levels = [
    ["Current", ticker.price],
    ["Fair", ticker.fair],
    ["Add", ticker.add],
    ["Truck", ticker.truck],
  ].filter(([, value]) => value);
  return (
    <div className="price-ladder">
      {levels.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong className="num">{money(value)}</strong>
        </div>
      ))}
    </div>
  );
}

function ChartPlaceholder({ ticker }) {
  return (
    <div className="chart-box">
      <div className="fib-zone" />
      <svg viewBox="0 0 500 210" preserveAspectRatio="none">
        <path className="ma slow" d="M0 138 C80 130 130 150 200 122 S360 96 500 84" />
        <path className="ma fast" d="M0 160 C90 130 135 170 220 126 S390 78 500 112" />
        <path className="price" d="M0 170 C70 150 90 112 150 130 S260 170 315 118 S420 88 500 128" />
      </svg>
      <div className="chart-label left">200D / 50D</div>
      <div className="chart-label right">{ticker.confluence}</div>
    </div>
  );
}

function TickerSelect({ selected, setSelected }) {
  return (
    <select className="select" value={selected} onChange={(event) => setSelected(event.target.value)}>
      {tickers.map((ticker) => <option key={ticker.symbol} value={ticker.symbol}>{ticker.symbol}</option>)}
    </select>
  );
}

function WeightBar({ current, target }) {
  const width = Math.min(100, (current / target) * 100);
  return (
    <div>
      <div className="bar"><span style={{ width: `${width}%` }} /></div>
      <span className="muted num">{current}% / {target}%</span>
    </div>
  );
}

function stateTone(state) {
  if (["OWNED", "CONFIRMED"].includes(state)) return "good";
  if (["ENTRY_ZONE", "WATCHLIST", "SPECULATIVE"].includes(state)) return "warn";
  if (["REJECTED", "EXIT"].includes(state)) return "bad";
  return "neutral";
}

function gateCopy(ticker, index) {
  const copy = [
    `${ticker.symbol} is ${ticker.gates[0] === "pass" ? "inside" : "near the edge of"} the circle of competence.`,
    ticker.group === "Rejected" ? "Business quality does not compensate for the failed valuation gate." : "Business health is acceptable, with drift monitored after earnings.",
    ticker.gates[2] === "pass" ? "Price-implied belief is reasonable." : "Price-implied belief requires caution or haircut.",
    `Kill criterion: ${ticker.kill}.`,
  ];
  return copy[index];
}

function nextAction(ticker) {
  if (ticker.state === "ENTRY_ZONE") return "Arm support trigger; do not buy until higher low or reclaim confirms.";
  if (ticker.state === "REJECTED") return "Archive until documented fundamental change.";
  if (ticker.state === "OWNED") return "Monitor kill criterion and add only if thesis strengthens.";
  if (ticker.group === "Speculative Sleeve") return "Keep capped, tagged, and separate from core.";
  return "Wait for value zone or re-underwriting trigger.";
}

function money(value) {
  if (typeof value !== "number") return "N/A";
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: value < 100 ? 2 : 0 })}`;
}

createRoot(document.getElementById("root")).render(<App />);
