"""
Explainability engine — produces a human-readable explanation for why a
given drug-event pair was (or was not) flagged as a safety signal.

The explanation is deterministic and data-driven: it shows the exact
rates, compares them to the background, and states which Evans criteria
were met or missed. No speculative causal claims are made.
"""

import json
import pathlib
from typing import Optional

from engines.prr_engine import calculate_prr, DISCLAIMER, PRR_MIN, CHI2_MIN, COUNT_MIN

_DATA_DIR = pathlib.Path(__file__).parent.parent / "data"


def _drug_exposure(drug_name: str) -> Optional[int]:
    path = _DATA_DIR / "drug_exposure.json"
    records = json.loads(path.read_text())
    for r in records:
        if r["drug_name"] == drug_name:
            return r["total_patients_exposed"]
    return None


def explain_signal(drug_name: str, event_term: str) -> Optional[dict]:
    """
    Return a structured explanation for a drug-event pair.
    Returns None if the drug is not in the dataset.
    """
    prr_rows = calculate_prr(drug_name)
    if not prr_rows:
        return None

    # Find the row for this specific event (case-insensitive)
    row = next(
        (r for r in prr_rows if r["event_term"].lower() == event_term.lower()),
        None,
    )

    # If event not found for this drug, build a "not observed" explanation
    if row is None:
        return {
            "drug_name":          drug_name,
            "event_term":         event_term,
            "prr":                0.0,
            "chi2":               0.0,
            "case_count":         0,
            "background_rate_pct": None,
            "drug_rate_pct":      0.0,
            "is_signal":          False,
            "signal_strength":    "None",
            "explanation":        (
                f"No reports of '{event_term}' were found for {drug_name} in the dataset. "
                "This event cannot be assessed for this drug with available data."
            ),
            "disclaimer": DISCLAIMER,
        }

    # ── Compute rates ────────────────────────────────────────────────────────
    import pandas as pd
    df = pd.DataFrame(json.loads((_DATA_DIR / "adverse_events.json").read_text()))

    total_drug   = int((df["drug_name"] == drug_name).sum())
    total_other  = int((df["drug_name"] != drug_name).sum())
    a = row["case_count"]                                         # drug + event
    c = int(((df["drug_name"] != drug_name) & (df["event_term"] == event_term)).sum())

    drug_rate_pct  = round(100 * a / total_drug,  2) if total_drug  > 0 else 0.0
    bg_rate_pct    = round(100 * c / total_other, 2) if total_other > 0 else 0.0
    exposure       = _drug_exposure(drug_name)

    # ── Build Evans criteria checklist ───────────────────────────────────────
    criteria = {
        f"PRR ≥ {PRR_MIN}":   (row["prr"]  >= PRR_MIN,  f"PRR = {row['prr']:.3f}"),
        f"χ² ≥ {CHI2_MIN}":   (row["chi2"] >= CHI2_MIN, f"χ² = {row['chi2']:.3f}"),
        f"n ≥ {COUNT_MIN}":   (a           >= COUNT_MIN, f"n = {a}"),
    }
    met     = [f"{k} ✓ ({v})" for k, (ok, v) in criteria.items() if ok]
    not_met = [f"{k} ✗ ({v})" for k, (ok, v) in criteria.items() if not ok]

    # ── Narrative ────────────────────────────────────────────────────────────
    if row["is_signal"]:
        verdict = (
            f"{drug_name} shows a POTENTIAL SAFETY SIGNAL for '{event_term}'. "
        )
        context = (
            f"The reporting rate for this event in {drug_name} is {drug_rate_pct}% "
            f"({a} of {total_drug} reports), compared to {bg_rate_pct}% in all other drugs combined "
            f"({c} of {total_other} reports). "
            f"This gives a PRR of {row['prr']:.3f}, meaning '{event_term}' is reported "
            f"{row['prr']:.1f}× more often with {drug_name} than with other drugs."
        )
        if exposure:
            context += (
                f" With an estimated {exposure:,} patients exposed, "
                f"this signal warrants further pharmacovigilance investigation."
            )
        strength_note = (
            f"Signal strength is classified as '{row['signal_strength']}' "
            f"based on PRR magnitude and statistical confidence."
        )
        criteria_text = "All Evans criteria met: " + "; ".join(met) + "."
    else:
        verdict = (
            f"No safety signal was detected for '{event_term}' with {drug_name} "
            f"using the Evans disproportionality criteria. "
        )
        context = (
            f"The reporting rate is {drug_rate_pct}% for {drug_name} vs {bg_rate_pct}% background. "
            f"PRR = {row['prr']:.3f}."
        )
        if not_met:
            criteria_text = "Criteria not met: " + "; ".join(not_met) + "."
            if met:
                criteria_text += " Criteria met: " + "; ".join(met) + "."
        else:
            criteria_text = "All Evans criteria were evaluated."
        strength_note = "Further monitoring may still be warranted if case counts increase."

    explanation = f"{verdict}{context} {criteria_text} {strength_note}"

    return {
        "drug_name":           drug_name,
        "event_term":          event_term,
        "prr":                 row["prr"],
        "chi2":                row["chi2"],
        "case_count":          a,
        "background_rate_pct": bg_rate_pct,
        "drug_rate_pct":       drug_rate_pct,
        "is_signal":           row["is_signal"],
        "signal_strength":     row["signal_strength"],
        "explanation":         explanation,
        "disclaimer":          DISCLAIMER,
    }
