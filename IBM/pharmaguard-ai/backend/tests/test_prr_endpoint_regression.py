"""
Regression test for POST /api/signals/prr — the endpoint that returned 500
in the reported runtime error.

Uses FastAPI's TestClient (ASGI) so this works without a running server and
exercises the full router → engine → data pipeline identically to production.

Covers:
  - All 6 synthetic drugs return 200 with valid PRR results
  - Correct 2×2 contingency table (a, b, c, d) verified arithmetically
  - Evans signal threshold (PRR≥2, χ²≥4, n≥3) correctly applied
  - Seeded signals (DrugAlpha/Nausea, DrugBeta/Tachycardia) detected
  - No NaN / Inf values in any response
  - 404 for unknown drug (not 500)
  - 422 for malformed payload (not 500)
"""

import sys
import math
import pathlib
import json

import pytest

sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

# FastAPI TestClient requires httpx / httpx2
try:
    from fastapi.testclient import TestClient
    from main import app
    CLIENT_AVAILABLE = True
except (ImportError, RuntimeError):
    CLIENT_AVAILABLE = False

# Also import the engine directly for arithmetic verification
from engines.prr_engine import calculate_prr, PRR_MIN, CHI2_MIN, COUNT_MIN

DRUGS = ["DrugAlpha", "DrugBeta", "DrugGamma", "DrugDelta", "DrugEpsilon", "DrugZeta"]


# ── Engine-level tests (always run) ─────────────────────────────────────────

def test_prr_engine_returns_list_for_all_drugs():
    for drug in DRUGS:
        result = calculate_prr(drug)
        assert isinstance(result, list), f"{drug}: expected list"
        assert len(result) > 0, f"{drug}: empty result list"


def test_prr_no_nan_inf_for_all_drugs():
    """Regression: ensure no NaN or Inf PRR/chi2 values for any drug."""
    for drug in DRUGS:
        for row in calculate_prr(drug):
            assert not math.isnan(row["prr"]),  f"{drug}/{row['event_term']}: NaN prr"
            assert not math.isinf(row["prr"]),  f"{drug}/{row['event_term']}: Inf prr"
            assert not math.isnan(row["chi2"]), f"{drug}/{row['event_term']}: NaN chi2"
            assert not math.isinf(row["chi2"]), f"{drug}/{row['event_term']}: Inf chi2"


def test_prr_2x2_contingency_table_arithmetic():
    """
    Verify PRR is computed from the correct 2×2 table:
      a = drug D + event E reports
      b = drug D + other event reports
      c = other drugs + event E reports
      d = other drugs + other event reports
      PRR = (a/(a+b)) / (c/(c+d))
    """
    import pandas as pd
    data_path = pathlib.Path(__file__).parent.parent / "data" / "adverse_events.json"
    df = pd.DataFrame(json.loads(data_path.read_text()))

    drug = "DrugAlpha"
    event = "Nausea"

    drug_df  = df[df["drug_name"] == drug]
    other_df = df[df["drug_name"] != drug]

    a = int((drug_df["event_term"] == event).sum())
    b = int((drug_df["event_term"] != event).sum())
    c = int((other_df["event_term"] == event).sum())
    d = int((other_df["event_term"] != event).sum())

    assert a > 0, "Expected DrugAlpha/Nausea cases in data"
    assert c > 0, "Expected Nausea cases in other drugs"

    expected_prr = (a / (a + b)) / (c / (c + d))

    rows = calculate_prr(drug)
    row = next(r for r in rows if r["event_term"] == event)

    assert abs(row["prr"] - round(expected_prr, 3)) < 0.001, (
        f"PRR mismatch: engine={row['prr']}, manual={expected_prr:.3f}"
    )
    assert row["case_count"] == a, f"case_count mismatch: {row['case_count']} vs {a}"


def test_drugalpha_nausea_is_high_signal():
    """Regression: DrugAlpha/Nausea must be a High-strength signal."""
    rows = calculate_prr("DrugAlpha")
    nausea = next((r for r in rows if r["event_term"] == "Nausea"), None)
    assert nausea is not None, "Nausea row missing for DrugAlpha"
    assert nausea["is_signal"] is True, f"Nausea should be a signal, got: {nausea}"
    assert nausea["prr"] >= PRR_MIN, f"PRR {nausea['prr']} below threshold {PRR_MIN}"
    assert nausea["chi2"] >= CHI2_MIN, f"chi2 {nausea['chi2']} below threshold {CHI2_MIN}"
    assert nausea["case_count"] >= COUNT_MIN
    assert nausea["signal_strength"] == "High", f"Expected High, got {nausea['signal_strength']}"


def test_drugbeta_cardiac_signal_detected():
    """Regression: DrugBeta must have at least one cardiac signal."""
    rows = calculate_prr("DrugBeta")
    cardiac = [r for r in rows if r["is_signal"] and r["event_soc"] == "Cardiac disorders"]
    assert len(cardiac) >= 1, f"Expected cardiac signal for DrugBeta, signals: {[r['event_term'] for r in rows if r['is_signal']]}"


def test_prr_result_required_fields():
    """Every PRR result dict must contain the full required field set."""
    required = {"drug_name","event_term","event_soc","case_count","prr","chi2","is_signal","signal_strength","disclaimer"}
    for row in calculate_prr("DrugAlpha"):
        assert required.issubset(row.keys()), f"Missing keys: {required - row.keys()}"


def test_unknown_drug_returns_empty_not_exception():
    """Engine must return [] for unknown drug, not raise an exception."""
    result = calculate_prr("DrugNotInDataset")
    assert result == []


# ── FastAPI TestClient tests (require httpx) ─────────────────────────────────

@pytest.mark.skipif(not CLIENT_AVAILABLE, reason="httpx/httpx2 not installed")
class TestPRREndpoint:
    client = TestClient(app) if CLIENT_AVAILABLE else None  # type: ignore[arg-type]

    def test_post_prr_drugalpha_returns_200(self):
        r = self.client.post("/api/signals/prr", json={"drug_name": "DrugAlpha"})
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:200]}"

    def test_post_prr_all_drugs_return_200(self):
        for drug in DRUGS:
            r = self.client.post("/api/signals/prr", json={"drug_name": drug})
            assert r.status_code == 200, f"{drug}: Expected 200, got {r.status_code}: {r.text[:200]}"

    def test_post_prr_response_is_list(self):
        r = self.client.post("/api/signals/prr", json={"drug_name": "DrugAlpha"})
        data = r.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_post_prr_drugalpha_has_nausea_high_signal(self):
        r = self.client.post("/api/signals/prr", json={"drug_name": "DrugAlpha"})
        data = r.json()
        nausea = next((row for row in data if row["event_term"] == "Nausea"), None)
        assert nausea is not None
        assert nausea["is_signal"] is True
        assert nausea["signal_strength"] == "High"
        assert nausea["prr"] >= 2.0
        assert nausea["chi2"] >= 4.0

    def test_post_prr_unknown_drug_returns_404_not_500(self):
        """Regression: unknown drug must return 404, never 500."""
        r = self.client.post("/api/signals/prr", json={"drug_name": "DrugNotExist"})
        assert r.status_code == 404, f"Expected 404, got {r.status_code}"

    def test_post_prr_null_drug_returns_422_not_500(self):
        """Regression: null drug_name must return 422 validation error, never 500."""
        r = self.client.post("/api/signals/prr", json={"drug_name": None})
        assert r.status_code == 422, f"Expected 422, got {r.status_code}"

    def test_post_prr_missing_drug_field_returns_422_not_500(self):
        """Regression: missing drug_name field must return 422, never 500."""
        r = self.client.post("/api/signals/prr", json={})
        assert r.status_code == 422, f"Expected 422, got {r.status_code}"

    def test_post_prr_no_nan_inf_in_response(self):
        """Regression: no NaN/Inf values in any PRR response field."""
        for drug in DRUGS:
            r = self.client.post("/api/signals/prr", json={"drug_name": drug})
            for row in r.json():
                assert not math.isnan(row["prr"]),  f"{drug}/{row['event_term']}: NaN prr"
                assert not math.isinf(row["prr"]),  f"{drug}/{row['event_term']}: Inf prr"
                assert not math.isnan(row["chi2"]), f"{drug}/{row['event_term']}: NaN chi2"

    def test_post_prr_response_sorted_by_prr_desc(self):
        r = self.client.post("/api/signals/prr", json={"drug_name": "DrugAlpha"})
        prrs = [row["prr"] for row in r.json()]
        assert prrs == sorted(prrs, reverse=True)
