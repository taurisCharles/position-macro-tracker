import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AlertTriangle, BarChart3, BookOpen, Clock, RefreshCw } from "lucide-react";
import "./styles.css";

const positions = [
  {
    symbol: "QQQ Jun-2027 600P",
    quantity: 2,
    entry: 23.49,
    mark: 26.76,
    pnl: 654,
    pnlPct: 13.92,
    dte: 740,
    thesis: "Index downside hedge entered with VIX below long-run stress levels.",
  },
];

const macroRows = [
  { label: "VIX", entry: 15.77, now: 18.51, unit: "", flag: "Watch" },
  { label: "VIX/VIX3M", entry: 0.88, now: 0.96, unit: "", flag: "Flat" },
  { label: "VVIX", entry: 83.2, now: 91.4, unit: "", flag: "Elevated" },
  { label: "10Y", entry: 4.28, now: 4.42, unit: "%", flag: "Higher" },
];

function App() {
  const [symbolQuery, setSymbolQuery] = useState("QQQ");
  const [symbolResults, setSymbolResults] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    if (!symbolQuery.trim()) {
      setSymbolResults([]);
      return undefined;
    }

    const timeout = setTimeout(() => {
      fetch(`/api/symbols/search?q=${encodeURIComponent(symbolQuery)}&limit=8`, {
        signal: controller.signal,
      })
        .then((response) => response.json())
        .then(setSymbolResults)
        .catch(() => setSymbolResults([]));
    }, 180);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [symbolQuery]);

  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Local-first</p>
          <h1>Position and Macro Tracker</h1>
        </div>
        <button className="iconButton" title="Refresh snapshots" aria-label="Refresh snapshots">
          <RefreshCw size={18} />
        </button>
      </header>

      <section className="summaryGrid">
        <Metric label="Open positions" value="1" icon={<BookOpen size={18} />} />
        <Metric label="Unrealized P&L" value="+$654" tone="good" icon={<BarChart3 size={18} />} />
        <Metric label="Fired rules" value="0" icon={<AlertTriangle size={18} />} />
        <Metric label="Next snapshot" value="5:00 PM" icon={<Clock size={18} />} />
      </section>

      <section className="workGrid">
        <div className="panel wide">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Positions</p>
              <h2>Open Lines</h2>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Qty</th>
                <th>Entry</th>
                <th>Mark</th>
                <th>P&L</th>
                <th>DTE</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.symbol}>
                  <td>
                    <strong>{position.symbol}</strong>
                    <span>{position.thesis}</span>
                  </td>
                  <td>{position.quantity}</td>
                  <td>${position.entry.toFixed(2)}</td>
                  <td>${position.mark.toFixed(2)}</td>
                  <td className="good">+${position.pnl.toFixed(0)} ({position.pnlPct.toFixed(2)}%)</td>
                  <td>{position.dte}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sideStack">
        <div className="panel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Ticker Puller</p>
              <h2>Find Symbol</h2>
            </div>
          </div>
          <div className="searchBox">
            <label htmlFor="symbol-search">Symbol or company</label>
            <input
              id="symbol-search"
              value={symbolQuery}
              onChange={(event) => setSymbolQuery(event.target.value)}
              placeholder="QQQ, Apple, SPY"
            />
          </div>
          <div className="symbolList">
            {symbolResults.map((result) => (
              <button className="symbolRow" key={`${result.exchange}-${result.symbol}`}>
                <strong>{result.symbol}</strong>
                <span>{result.name}</span>
                <em>{result.exchange} / {result.type}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Macro</p>
              <h2>Thesis vs Now</h2>
            </div>
          </div>
          <div className="macroList">
            {macroRows.map((row) => (
              <div className="macroRow" key={row.label}>
                <div>
                  <strong>{row.label}</strong>
                  <span>{row.entry}{row.unit} entry to {row.now}{row.unit} now</span>
                </div>
                <span className="badge">{row.flag}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, icon, tone }) {
  return (
    <article className="metric">
      <div className="metricIcon">{icon}</div>
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
    </article>
  );
}

createRoot(document.getElementById("root")).render(<App />);
