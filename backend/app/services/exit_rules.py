from datetime import datetime
from operator import eq, ge, gt, le, lt, ne
from typing import Any

OPS = {
    ">": gt,
    ">=": ge,
    "<": lt,
    "<=": le,
    "==": eq,
    "!=": ne,
}


def evaluate_condition(condition: dict[str, Any], context: dict[str, Any]) -> bool:
    metric = condition.get("metric")
    op = condition.get("op")
    target = condition.get("value")
    if metric not in context or op not in OPS:
        return False
    current = context[metric]
    if current is None:
        return False
    return bool(OPS[op](current, target))


def fired_timestamp(condition: dict[str, Any], context: dict[str, Any]) -> datetime | None:
    return datetime.utcnow() if evaluate_condition(condition, context) else None

