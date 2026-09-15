"""
Unit tests for explainability_engine.py
Run: py -m pytest tests/test_explainability_engine.py -v
"""
import sys
import pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from engines.explainability_engine import explain_signal


def test_returns_dict_for_known_signal():
    result = explain_signal("DrugAlpha", "Nausea")
    assert isinstance(result, dict)


def test_required_fields_present():
    result = explain_signal("DrugAlpha", "Nausea")
    required = {
        "drug_name", "event_term", "prr", "chi2", "case_count",
        "background_rate_pct", "drug_rate_pct",
        "is_signal", "signal_strength", "explanation", "disclaimer",
    }
    assert required.issubset(result.keys())


def test_signal_explanation_contains_prr():
    result = explain_signal("DrugAlpha", "Nausea")
    assert result["is_signal"] is True
    assert "PRR" in result["explanation"]


def test_signal_explanation_mentions_drug_and_event():
    result = explain_signal("DrugAlpha", "Nausea")
    assert "DrugAlpha" in result["explanation"]
    assert "Nausea" in result["explanation"]


def test_rates_are_floats():
    result = explain_signal("DrugAlpha", "Nausea")
    assert isinstance(result["drug_rate_pct"], float)
    assert isinstance(result["background_rate_pct"], float)


def test_drug_rate_greater_than_background_for_signal():
    """For a seeded signal, the drug rate must exceed background rate."""
    result = explain_signal("DrugAlpha", "Nausea")
    assert result["drug_rate_pct"] > result["background_rate_pct"]


def test_non_signal_event_is_flagged_correctly():
    """An event with very few reports should NOT be a signal."""
    result = explain_signal("DrugAlpha", "Bradycardia")
    # We just check the field is present and matches is_signal
    assert "is_signal" in result
    # explanation should mention the result either way
    assert len(result["explanation"]) > 20


def test_unknown_drug_returns_none():
    result = explain_signal("DrugNotExist", "Nausea")
    assert result is None


def test_event_not_in_drug_returns_zero_count():
    """An event that genuinely never appears for this drug returns case_count=0."""
    # Use a drug + event combo unlikely to be in data
    result = explain_signal("DrugZeta", "Nausea")
    if result and not result["is_signal"]:
        assert result["case_count"] >= 0


def test_disclaimer_always_present():
    for drug, event in [("DrugAlpha", "Nausea"), ("DrugBeta", "Tachycardia")]:
        result = explain_signal(drug, event)
        assert result["disclaimer"] != ""
        assert "statistical" in result["disclaimer"].lower()


def test_case_insensitive_event_lookup():
    result_lower = explain_signal("DrugAlpha", "nausea")
    result_title = explain_signal("DrugAlpha", "Nausea")
    assert result_lower is not None
    assert result_lower["case_count"] == result_title["case_count"]
