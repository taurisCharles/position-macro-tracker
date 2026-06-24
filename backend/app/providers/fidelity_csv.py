import csv

from app.providers.interfaces import ImportedPosition, PositionProvider


class FidelityCsvPositionProvider(PositionProvider):
    """Manual Fidelity CSV importer.

    Fidelity export column names vary by view. Keep this parser explicit and add
    aliases as real exports are tested.
    """

    def get_positions(self, source: str) -> list[ImportedPosition]:
        rows: list[ImportedPosition] = []
        with open(source, newline="", encoding="utf-8-sig") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                symbol = (row.get("Symbol") or row.get("Security") or "").strip()
                quantity = _to_float(row.get("Quantity"))
                if not symbol or quantity is None:
                    continue
                rows.append(
                    ImportedPosition(
                        account_label=(row.get("Account") or "Fidelity").strip(),
                        symbol=symbol,
                        quantity=quantity,
                        market_value=_to_float(row.get("Current Value")),
                        cost_basis=_to_float(row.get("Cost Basis Total")),
                    )
                )
        return rows


def _to_float(value: str | None) -> float | None:
    if value is None:
        return None
    cleaned = value.replace("$", "").replace(",", "").strip()
    if not cleaned:
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None

