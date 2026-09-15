"""
Unit tests for ctd_checker.py
Run: py -m pytest tests/test_ctd_checker.py -v
"""
import sys
import pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from engines.ctd_checker import check_dossier, load_sample_dossier, READY_THRESHOLD
from schemas.ich_m4_schema import ICH_M4_SCHEMA


# ── Helpers ──────────────────────────────────────────────────────────────────

def _perfect_dossier():
    """Build a dossier where every section is present."""
    modules = {}
    for mod_id, mod_schema in ICH_M4_SCHEMA.items():
        modules[mod_id] = {
            "present":  True,
            "sections": {sec_id: True for sec_id in mod_schema["sections"]},
        }
    return {"submission_name": "PerfectDossier", "modules": modules}


def _empty_dossier():
    """Build a dossier where nothing is present."""
    modules = {}
    for mod_id, mod_schema in ICH_M4_SCHEMA.items():
        modules[mod_id] = {
            "present":  False,
            "sections": {sec_id: False for sec_id in mod_schema["sections"]},
        }
    return {"submission_name": "EmptyDossier", "modules": modules}


# ── Tests ─────────────────────────────────────────────────────────────────────

def test_returns_dict():
    report = check_dossier(load_sample_dossier())
    assert isinstance(report, dict)


def test_required_top_level_keys():
    report = check_dossier(load_sample_dossier())
    required = {"submission_name", "overall_score_pct", "modules", "gaps", "ready_for_submission"}
    assert required.issubset(report.keys())


def test_five_modules_returned():
    report = check_dossier(load_sample_dossier())
    assert len(report["modules"]) == 5


def test_module_fields():
    report = check_dossier(load_sample_dossier())
    required = {"module_id", "module_name", "score_pct", "present_count", "missing_count", "total_count"}
    for m in report["modules"]:
        assert required.issubset(m.keys()), f"Missing keys in module: {m}"


def test_perfect_dossier_scores_100():
    report = check_dossier(_perfect_dossier())
    assert report["overall_score_pct"] == 100.0
    for m in report["modules"]:
        assert m["score_pct"] == 100.0
    assert report["gaps"] == []
    assert report["ready_for_submission"] is True


def test_empty_dossier_scores_0():
    report = check_dossier(_empty_dossier())
    assert report["overall_score_pct"] == 0.0
    assert report["ready_for_submission"] is False


def test_sample_dossier_has_gaps():
    report = check_dossier(load_sample_dossier())
    assert len(report["gaps"]) > 0


def test_sample_dossier_not_ready():
    """The sample dossier is intentionally incomplete."""
    report = check_dossier(load_sample_dossier())
    assert report["ready_for_submission"] is False


def test_gap_fields():
    report = check_dossier(load_sample_dossier())
    required = {"module_id", "section_id", "section_name", "severity", "status"}
    for gap in report["gaps"]:
        assert required.issubset(gap.keys()), f"Missing keys in gap: {gap}"


def test_gap_severity_values():
    report = check_dossier(load_sample_dossier())
    valid = {"Critical", "Major", "Minor"}
    for gap in report["gaps"]:
        assert gap["severity"] in valid, f"Bad severity: {gap['severity']}"


def test_gaps_sorted_critical_first():
    report = check_dossier(load_sample_dossier())
    sev_order = {"Critical": 0, "Major": 1, "Minor": 2}
    orders = [sev_order[g["severity"]] for g in report["gaps"]]
    assert orders == sorted(orders), "Gaps not sorted Critical → Major → Minor"


def test_present_plus_missing_equals_total():
    report = check_dossier(load_sample_dossier())
    for m in report["modules"]:
        assert m["present_count"] + m["missing_count"] == m["total_count"]


def test_score_consistent_with_counts():
    report = check_dossier(load_sample_dossier())
    for m in report["modules"]:
        if m["total_count"] > 0:
            expected = round(100 * m["present_count"] / m["total_count"], 1)
            assert abs(m["score_pct"] - expected) < 0.01, f"Score mismatch: {m}"


def test_submission_name_preserved():
    dossier = load_sample_dossier()
    report  = check_dossier(dossier)
    assert report["submission_name"] == dossier["submission_name"]


def test_overall_score_is_mean_of_module_scores():
    report = check_dossier(load_sample_dossier())
    module_scores = [m["score_pct"] for m in report["modules"]]
    expected = round(sum(module_scores) / len(module_scores), 1)
    assert abs(report["overall_score_pct"] - expected) < 0.1
