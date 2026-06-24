from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class InstrumentType(str, Enum):
    equity = "equity"
    option = "option"
    etf = "etf"
    warrant = "warrant"


class OptionRight(str, Enum):
    put = "put"
    call = "call"


class PositionStatus(str, Enum):
    open = "open"
    closed = "closed"


class ExitRuleType(str, Enum):
    profit_target = "profit_target"
    stop_loss = "stop_loss"
    time_stop = "time_stop"
    macro_trigger = "macro_trigger"


class Account(Base):
    __tablename__ = "accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    broker: Mapped[str] = mapped_column(String(80), default="Fidelity")
    label: Mapped[str] = mapped_column(String(120))
    cash_balance: Mapped[float | None] = mapped_column(Float)
    total_value: Mapped[float | None] = mapped_column(Float)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    positions: Mapped[list["Position"]] = relationship(back_populates="account")


class Instrument(Base):
    __tablename__ = "instruments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(40), index=True)
    type: Mapped[str] = mapped_column(String(20))
    underlying: Mapped[str | None] = mapped_column(String(40), index=True)
    strike: Mapped[float | None] = mapped_column(Float)
    expiry: Mapped[str | None] = mapped_column(String(10))
    right: Mapped[str | None] = mapped_column(String(10))
    multiplier: Mapped[int] = mapped_column(Integer, default=100)

    positions: Mapped[list["Position"]] = relationship(back_populates="instrument")
    price_snapshots: Mapped[list["PriceSnapshot"]] = relationship(back_populates="instrument")


class Position(Base):
    __tablename__ = "positions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("accounts.id"))
    instrument_id: Mapped[int] = mapped_column(ForeignKey("instruments.id"))
    quantity: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(20), default=PositionStatus.open.value)
    opened_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime)

    account: Mapped[Account] = relationship(back_populates="positions")
    instrument: Mapped[Instrument] = relationship(back_populates="positions")
    lots: Mapped[list["Lot"]] = relationship(back_populates="position")
    theses: Mapped[list["Thesis"]] = relationship(back_populates="position")


class Lot(Base):
    __tablename__ = "lots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    position_id: Mapped[int] = mapped_column(ForeignKey("positions.id"))
    quantity: Mapped[float] = mapped_column(Float)
    cost_basis_per_unit: Mapped[float] = mapped_column(Float)
    acquired_at: Mapped[datetime] = mapped_column(DateTime)

    position: Mapped[Position] = relationship(back_populates="lots")


class Thesis(Base):
    __tablename__ = "theses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    position_id: Mapped[int] = mapped_column(ForeignKey("positions.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    conviction: Mapped[int] = mapped_column(Integer)
    narrative: Mapped[str] = mapped_column(Text)
    entry_macro_snapshot: Mapped[dict] = mapped_column(JSON)

    position: Mapped[Position] = relationship(back_populates="theses")
    exit_rules: Mapped[list["ExitRule"]] = relationship(back_populates="thesis")


class ExitRule(Base):
    __tablename__ = "exit_rules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    thesis_id: Mapped[int] = mapped_column(ForeignKey("theses.id"))
    type: Mapped[str] = mapped_column(String(40))
    condition: Mapped[dict] = mapped_column(JSON)
    action_note: Mapped[str | None] = mapped_column(Text)
    fired: Mapped[bool] = mapped_column(default=False)
    fired_at: Mapped[datetime | None] = mapped_column(DateTime)

    thesis: Mapped[Thesis] = relationship(back_populates="exit_rules")


class MacroIndicator(Base):
    __tablename__ = "macro_indicators"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    source: Mapped[str] = mapped_column(String(40), default="FRED")
    label: Mapped[str] = mapped_column(String(120))
    category: Mapped[str] = mapped_column(String(40))

    snapshots: Mapped[list["MacroSnapshot"]] = relationship(back_populates="indicator")


class MacroSnapshot(Base):
    __tablename__ = "macro_snapshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    indicator_id: Mapped[int] = mapped_column(ForeignKey("macro_indicators.id"))
    value: Mapped[float] = mapped_column(Float)
    observed_at: Mapped[datetime] = mapped_column(DateTime, index=True)

    indicator: Mapped[MacroIndicator] = relationship(back_populates="snapshots")


class PriceSnapshot(Base):
    __tablename__ = "price_snapshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    instrument_id: Mapped[int] = mapped_column(ForeignKey("instruments.id"))
    price: Mapped[float] = mapped_column(Float)
    observed_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    source: Mapped[str] = mapped_column(String(40))

    instrument: Mapped[Instrument] = relationship(back_populates="price_snapshots")

