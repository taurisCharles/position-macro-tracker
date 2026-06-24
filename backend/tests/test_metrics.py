from app.services.exit_rules import evaluate_condition
from app.services.metrics import reload_zone, vix_regime


def test_vix_regime_flags_backwardation():
    result = vix_regime(18.51, 17.90)
    assert result["regime"] == "backwardation"


def test_reload_zone():
    assert reload_zone(14.25) is True
    assert reload_zone(18.51) is False


def test_exit_rule_condition():
    condition = {"metric": "premium", "op": ">=", "value": 40}
    assert evaluate_condition(condition, {"premium": 41}) is True
    assert evaluate_condition(condition, {"premium": 39}) is False

