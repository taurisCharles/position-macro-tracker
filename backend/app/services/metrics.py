from statistics import quantiles


def percentile_rank_12m(values: list[float], current: float) -> float | None:
    if not values:
        return None
    below_or_equal = sum(1 for value in values if value <= current)
    return round((below_or_equal / len(values)) * 100, 2)


def vix_regime(vix: float | None, vix3m: float | None) -> dict[str, float | str | None]:
    if vix is None or vix3m in (None, 0):
        return {"ratio": None, "regime": None}
    ratio = round(vix / vix3m, 4)
    if ratio > 1.0:
        regime = "backwardation"
    elif ratio < 0.95:
        regime = "contango"
    else:
        regime = "flat"
    return {"ratio": ratio, "regime": regime}


def reload_zone(vix: float | None) -> bool:
    return vix is not None and 14.0 <= vix <= 14.75

