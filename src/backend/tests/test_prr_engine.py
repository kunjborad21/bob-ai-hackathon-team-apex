"""
Unit tests for prr_engine.py
Run from the backend directory: py -m pytest tests/test_prr_engine.py -v
"""
import sys
import pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from engines.prr_engine import calculate_prr, get_ranked_signals, PRR_MIN, CHI2_MIN, COUNT_MIN


def test_calculate_prr_returns_list():
    results = calculate_prr("DrugAlpha")
    assert isinstance(results, list)
    assert len(results) > 0


def test_prr_result_fields():
    results = calculate_prr("DrugAlpha")
    required_keys = {
        "drug_name", "event_term", "event_soc",
        "case_count", "prr", "chi2",
        "is_signal", "signal_strength", "disclaimer",
    }
    for row in results:
        assert required_keys.issubset(row.keys()), f"Missing keys in row: {row}"


def test_prr_sorted_descending():
    results = calculate_prr("DrugAlpha")
    prrs = [r["prr"] for r in results]
    assert prrs == sorted(prrs, reverse=True), "Results not sorted by PRR descending"


def test_drugalpha_gi_signal_detected():
    """DrugAlpha is seeded with high GI adverse events — should show PRR signal."""
    results = calculate_prr("DrugAlpha")
    signal_events = {r["event_term"] for r in results if r["is_signal"]}
    gi_events = {"Nausea", "Vomiting", "Abdominal pain"}
    detected = gi_events & signal_events
    assert len(detected) >= 1, (
        f"Expected at least one GI signal for DrugAlpha, got signals: {signal_events}"
    )


def test_drugbeta_cardiac_signal_detected():
    """DrugBeta is seeded with high cardiac adverse events — should show PRR signal."""
    results = calculate_prr("DrugBeta")
    signal_events = {r["event_term"] for r in results if r["is_signal"]}
    cardiac_events = {"Palpitations", "Tachycardia", "Chest pain"}
    detected = cardiac_events & signal_events
    assert len(detected) >= 1, (
        f"Expected at least one cardiac signal for DrugBeta, got signals: {signal_events}"
    )


def test_signal_threshold_consistency():
    """Every row marked is_signal=True must satisfy Evans criteria."""
    for drug in ["DrugAlpha", "DrugBeta", "DrugGamma"]:
        for row in calculate_prr(drug):
            if row["is_signal"]:
                assert row["prr"]  >= PRR_MIN,   f"PRR below threshold: {row}"
                assert row["chi2"] >= CHI2_MIN,  f"Chi2 below threshold: {row}"
                assert row["case_count"] >= COUNT_MIN, f"Count below threshold: {row}"


def test_unknown_drug_returns_empty():
    results = calculate_prr("DrugNotInDataset")
    assert results == []


def test_get_ranked_signals_only_signals():
    signals = get_ranked_signals()
    assert isinstance(signals, list)
    for s in signals:
        assert s["is_signal"] is True, f"Non-signal row in ranked results: {s}"


def test_get_ranked_signals_sorted():
    signals = get_ranked_signals()
    prrs = [s["prr"] for s in signals]
    assert prrs == sorted(prrs, reverse=True)


def test_prr_values_positive():
    for drug in ["DrugAlpha", "DrugBeta"]:
        for row in calculate_prr(drug):
            assert row["prr"] > 0, f"Non-positive PRR: {row}"
            assert row["chi2"] >= 0, f"Negative chi2: {row}"


def test_signal_strength_labels():
    valid_strengths = {"None", "Low", "Medium", "High"}
    for row in calculate_prr("DrugAlpha"):
        assert row["signal_strength"] in valid_strengths, f"Bad strength: {row}"
