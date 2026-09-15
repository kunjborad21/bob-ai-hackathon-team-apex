"""
CTD Completeness Checker — validates a submitted dossier structure
against the authoritative ICH M4 schema.

Algorithm:
  For each module in the schema:
    For each required section:
      Mark present / missing based on what the dossier provides.
  Compute per-module score = present / (present + missing) × 100
  Compute overall score = mean of per-module scores
  Build a gap list with severity (Critical / Major / Minor)
  Flag ready_for_submission = overall >= 80% AND no Critical gaps remain
"""

import json
import pathlib
from typing import Any

from schemas.ich_m4_schema import ICH_M4_SCHEMA

# Threshold to consider ready for submission
READY_THRESHOLD = 80.0


def check_dossier(dossier: dict[str, Any]) -> dict:
    """
    Compare *dossier* (the submitted structure) against ICH_M4_SCHEMA.

    dossier expected shape:
    {
      "submission_name": "...",
      "modules": {
        "module_1": { "present": bool, "sections": { "1.1": bool, ... } },
        ...
      }
    }

    Returns a CompletenessReport dict.
    """
    submitted_modules = dossier.get("modules", {})
    submission_name   = dossier.get("submission_name", "Unknown Submission")

    module_results = []
    all_gaps       = []

    for mod_id, mod_schema in ICH_M4_SCHEMA.items():
        submitted_mod      = submitted_modules.get(mod_id, {})
        submitted_sections = submitted_mod.get("sections", {})
        module_present     = submitted_mod.get("present", False)

        present_count = 0
        missing_count = 0

        for sec_id, sec_info in mod_schema["sections"].items():
            # A section is present if: the module is present AND
            # either (a) the section key exists and is True, or
            # (b) no section keys at all (treat whole module as present but ungranular)
            if module_present:
                sec_value = submitted_sections.get(sec_id)
                is_present = bool(sec_value) if sec_value is not None else False
            else:
                is_present = False

            if is_present:
                present_count += 1
            else:
                missing_count += 1
                all_gaps.append({
                    "module_id":    mod_id,
                    "section_id":   sec_id,
                    "section_name": sec_info["name"],
                    "severity":     sec_info["severity"],
                    "status":       "Missing",
                })

        total = present_count + missing_count
        score = round(100 * present_count / total, 1) if total > 0 else 0.0

        module_results.append({
            "module_id":     mod_id,
            "module_name":   mod_schema["name"],
            "score_pct":     score,
            "present_count": present_count,
            "missing_count": missing_count,
            "total_count":   total,
        })

    # Overall score = mean of module scores
    overall = round(sum(m["score_pct"] for m in module_results) / len(module_results), 1) \
        if module_results else 0.0

    # Submission-ready: overall >= threshold AND no unresolved Critical gaps
    critical_gaps = [g for g in all_gaps if g["severity"] == "Critical"]
    ready = (overall >= READY_THRESHOLD) and (len(critical_gaps) == 0)

    # Sort gaps: Critical first, then Major, then Minor; alphabetical within group
    severity_order = {"Critical": 0, "Major": 1, "Minor": 2}
    all_gaps.sort(key=lambda g: (severity_order[g["severity"]], g["section_id"]))

    return {
        "submission_name":   submission_name,
        "overall_score_pct": overall,
        "modules":           module_results,
        "gaps":              all_gaps,
        "ready_for_submission": ready,
    }


def load_sample_dossier() -> dict:
    path = pathlib.Path(__file__).parent.parent / "data" / "sample_dossier.json"
    return json.loads(path.read_text())
