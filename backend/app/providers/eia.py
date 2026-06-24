from datetime import date
from urllib.parse import urlencode
from urllib.request import urlopen
import json

from app.core.config import settings
from app.providers.interfaces import Observation

EIA_BASE_URL = "https://api.eia.gov/v2"


class EiaEnergyProvider:
    """Free EIA Open Data API v2 provider for oil and gas thesis inputs."""

    def get_route_data(
        self,
        route: str,
        *,
        start: date | None = None,
        end: date | None = None,
        frequency: str | None = None,
        data: list[str] | None = None,
        facets: dict[str, list[str]] | None = None,
        length: int = 5000,
    ) -> dict:
        query: dict[str, str | int] = {"length": length}
        if settings.eia_api_key:
            query["api_key"] = settings.eia_api_key
        if start:
            query["start"] = start.isoformat()
        if end:
            query["end"] = end.isoformat()
        if frequency:
            query["frequency"] = frequency
        for index, item in enumerate(data or []):
            query[f"data[{index}]"] = item
        for facet, values in (facets or {}).items():
            for index, value in enumerate(values):
                query[f"facets[{facet}][]"] = value

        url = f"{EIA_BASE_URL}/{route.strip('/')}/data/?{urlencode(query)}"
        with urlopen(url, timeout=12) as response:
            return json.loads(response.read().decode("utf-8"))


ENERGY_SERIES = {
    "wti_spot": {
        "label": "WTI Cushing spot price",
        "route": "petroleum/pri/spt",
        "frequency": "daily",
        "data": ["value"],
        "facets": {"series": ["RWTC"]},
    },
    "henry_hub_spot": {
        "label": "Henry Hub natural gas spot price",
        "route": "natural-gas/pri/fut",
        "frequency": "daily",
        "data": ["value"],
        "facets": {"series": ["RNGWHHD"]},
    },
}

