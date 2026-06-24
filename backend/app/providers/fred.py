from datetime import date

from app.providers.interfaces import MacroProvider, Observation


class FredMacroProvider(MacroProvider):
    """FRED provider placeholder.

    Phase 1 implementation should call the FRED observations endpoint and map
    VIXCLS, VXVCLS, VVIXCLS, DGS10, and any configured custom series.
    """

    def get_series(self, code: str, start: date, end: date) -> list[Observation]:
        return []

