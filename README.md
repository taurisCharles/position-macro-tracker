# Position and Macro Tracker

Local-first tracker for investment positions, entry theses, macro snapshots, and exit-rule monitoring.

The app is designed to answer: is the original position thesis still intact, and how has the macro setup changed since entry?

## Phase 1 Scope

- Manual Fidelity CSV import.
- SQLite database through SQLAlchemy.
- FastAPI backend.
- Vite React dashboard.
- FRED macro provider.
- EIA energy provider for oil and gas context.
- Multpl valuation source descriptors.
- Optional X social-feed source descriptors for narrative context.
- yfinance quote provider.
- Immutable entry macro snapshots.
- Exit-rule evaluation on demand and through a daily scheduler.

No trade execution is included.

## Project Layout

```text
backend/   FastAPI app, SQLAlchemy models, providers, services
frontend/  Vite React dashboard
docs/      Product spec and implementation notes
```

## Quick Start

```bash
make setup
make dev
```

Backend API: `http://127.0.0.1:8000`

Frontend: `http://127.0.0.1:5173`

## Configuration

Copy `.env.example` to `.env` and set API keys as needed.

```bash
cp .env.example .env
```

Phase 1 can run with no paid subscriptions. FRED is the macro backbone. yfinance is unofficial and should be treated as a best-effort free quote source.

Data-source notes live in [docs/data-sources.md](docs/data-sources.md).
Swing-trading scaffold notes live in [docs/swing-trading-data-plan.md](docs/swing-trading-data-plan.md).
