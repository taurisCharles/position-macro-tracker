from dataclasses import dataclass
from functools import lru_cache
from urllib.error import URLError
from urllib.request import urlopen

NASDAQ_LISTED_URL = "https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt"
OTHER_LISTED_URL = "https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt"

FALLBACK_SYMBOLS = [
    {"symbol": "AAPL", "name": "Apple Inc.", "exchange": "NASDAQ", "type": "stock"},
    {"symbol": "AMD", "name": "Advanced Micro Devices, Inc.", "exchange": "NASDAQ", "type": "stock"},
    {"symbol": "MSFT", "name": "Microsoft Corporation", "exchange": "NASDAQ", "type": "stock"},
    {"symbol": "NVDA", "name": "NVIDIA Corporation", "exchange": "NASDAQ", "type": "stock"},
    {"symbol": "QQQ", "name": "Invesco QQQ Trust", "exchange": "NASDAQ", "type": "etf"},
    {"symbol": "SPY", "name": "SPDR S&P 500 ETF Trust", "exchange": "NYSE Arca", "type": "etf"},
    {"symbol": "TSLA", "name": "Tesla, Inc.", "exchange": "NASDAQ", "type": "stock"},
    {"symbol": "VIX", "name": "Cboe Volatility Index", "exchange": "CBOE", "type": "index"},
]


@dataclass(frozen=True)
class SymbolResult:
    symbol: str
    name: str
    exchange: str
    type: str


def search_symbols(query: str, limit: int = 12) -> list[SymbolResult]:
    normalized = query.strip().upper()
    if not normalized:
        return []

    exact: list[SymbolResult] = []
    symbol_prefix: list[SymbolResult] = []
    name_contains: list[SymbolResult] = []
    for row in symbol_universe():
        symbol = row["symbol"].upper()
        name = row["name"].upper()
        result = SymbolResult(**row)
        if symbol == normalized:
            exact.append(result)
        elif symbol.startswith(normalized):
            symbol_prefix.append(result)
        elif normalized in name:
            name_contains.append(result)

    return [*exact, *symbol_prefix, *name_contains][:limit]


@lru_cache(maxsize=1)
def symbol_universe() -> tuple[dict[str, str], ...]:
    rows: list[dict[str, str]] = []
    try:
        rows.extend(_fetch_nasdaq_listed())
        rows.extend(_fetch_other_listed())
    except URLError:
        rows = list(FALLBACK_SYMBOLS)
    except TimeoutError:
        rows = list(FALLBACK_SYMBOLS)

    if not rows:
        rows = list(FALLBACK_SYMBOLS)

    deduped: dict[str, dict[str, str]] = {}
    for row in rows:
        deduped[row["symbol"]] = row
    return tuple(sorted(deduped.values(), key=lambda item: item["symbol"]))


def _fetch_text(url: str) -> str:
    with urlopen(url, timeout=6) as response:
        return response.read().decode("utf-8", errors="replace")


def _fetch_nasdaq_listed() -> list[dict[str, str]]:
    rows = []
    for line in _fetch_text(NASDAQ_LISTED_URL).splitlines()[1:]:
        if not line or line.startswith("File Creation Time"):
            continue
        parts = line.split("|")
        if len(parts) < 7 or parts[3] != "N":
            continue
        rows.append(
            {
                "symbol": parts[0],
                "name": parts[1],
                "exchange": "NASDAQ",
                "type": "etf" if parts[6] == "Y" else "stock",
            }
        )
    return rows


def _fetch_other_listed() -> list[dict[str, str]]:
    rows = []
    for line in _fetch_text(OTHER_LISTED_URL).splitlines()[1:]:
        if not line or line.startswith("File Creation Time"):
            continue
        parts = line.split("|")
        if len(parts) < 7:
            continue
        rows.append(
            {
                "symbol": parts[0],
                "name": parts[1],
                "exchange": parts[2],
                "type": "etf" if parts[4] == "Y" else "stock",
            }
        )
    return rows
