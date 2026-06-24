from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import Account, MacroIndicator, Position
from app.services.metrics import reload_zone, vix_regime
from app.services.symbols import search_symbols
from app.providers.eia import ENERGY_SERIES
from app.providers.multpl import MultplValuationProvider
from app.providers.x_feed import XFeedProvider

router = APIRouter()


@router.get("/summary")
def summary(db: Session = Depends(get_db)) -> dict:
    open_positions = db.scalar(select(Position).where(Position.status == "open").limit(1))
    account_count = len(db.scalars(select(Account)).all())
    return {
        "account_count": account_count,
        "has_open_positions": open_positions is not None,
        "phase": "phase_1_mvp",
    }


@router.get("/macro/monitor")
def macro_monitor() -> dict:
    sample_vix = 18.51
    sample_vix3m = 19.30
    regime = vix_regime(sample_vix, sample_vix3m)
    return {
        "indicators": [
            {"code": "VIXCLS", "label": "VIX", "value": sample_vix, "reload_zone": reload_zone(sample_vix)},
            {"code": "VXVCLS", "label": "VIX 3M", "value": sample_vix3m},
            {"code": "DGS10", "label": "10Y Treasury", "value": None},
        ],
        "vix_vix3m": regime,
        "flags": {
            "reload_zone": reload_zone(sample_vix),
            "backwardation": regime["regime"] == "backwardation",
        },
    }


@router.get("/positions")
def positions() -> list[dict]:
    return [
        {
            "symbol": "QQQ 2027-06-18 600P",
            "quantity": 2,
            "entry_price": 23.49,
            "last_price": 26.76,
            "unrealized_pnl": 654.0,
            "unrealized_pnl_pct": 13.92,
            "thesis_status": "intact",
            "days_to_expiry": 740,
        }
    ]


@router.get("/symbols/search")
def symbols_search(q: str, limit: int = 12) -> list[dict]:
    return [result.__dict__ for result in search_symbols(q, limit=limit)]


@router.get("/data-sources")
def data_sources() -> dict:
    return {
        "macro": {
            "provider": "FRED",
            "series": ["VIXCLS", "VXVCLS", "VVIXCLS", "DGS10", "T10Y2Y", "CPIAUCSL", "UNRATE", "SP500"],
        },
        "energy": {
            "provider": "EIA",
            "series": ENERGY_SERIES,
        },
        "valuation": {
            "provider": "Multpl",
            "metrics": [metric.__dict__ for metric in MultplValuationProvider().catalog()],
        },
        "social": {
            "provider": "X",
            "status": "optional_paid_or_token_required",
            "topics": [topic.__dict__ for topic in XFeedProvider().topics()],
        },
    }
