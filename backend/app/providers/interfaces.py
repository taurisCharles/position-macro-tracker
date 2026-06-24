from dataclasses import dataclass
from datetime import date
from typing import Protocol


@dataclass(frozen=True)
class Quote:
    symbol: str
    price: float
    source: str


@dataclass(frozen=True)
class Observation:
    code: str
    value: float
    observed_at: date
    source: str


@dataclass(frozen=True)
class ImportedPosition:
    account_label: str
    symbol: str
    quantity: float
    market_value: float | None = None
    cost_basis: float | None = None


class QuoteProvider(Protocol):
    def get_quote(self, symbol: str) -> Quote:
        ...


class OptionChainProvider(Protocol):
    def get_chain(self, symbol: str, expiry: str | None = None) -> dict:
        ...


class MacroProvider(Protocol):
    def get_series(self, code: str, start: date, end: date) -> list[Observation]:
        ...


class PositionProvider(Protocol):
    def get_positions(self, source: str) -> list[ImportedPosition]:
        ...

