"""
PRR Engine — Proportional Reporting Ratio calculation.

Formula (Evans criteria):
    a = reports for drug D with event E
    b = reports for drug D without event E
    c = reports for all OTHER drugs with event E
    d = reports for all OTHER drugs without event E

    PRR  = (a / (a+b)) / (c / (c+d))
    Chi² = (a - E)² / E   where E = (a+b)(a+c) / N   (Yates-corrected 2x2)

Signal threshold: PRR >= 2.0 AND Chi² >= 4.0 AND a >= 3  (Evans 2001)
"""

import json
import pathlib
import math
from typing import List

import pandas as pd
import numpy as np

_DATA_DIR = pathlib.Path(__file__).parent.parent / "data"

DISCLAIMER = (
    "These are statistical associations only. "
    "They do not confirm a causal relationship and require "
    "further pharmacovigilance review."
)

# Evans signal thresholds
PRR_MIN = 2.0
CHI2_MIN = 4.0
COUNT_MIN = 3


def _load_df() -> pd.DataFrame:
    path = _DATA_DIR / "adverse_events.json"
    return pd.DataFrame(json.loads(path.read_text()))


def _signal_strength(prr: float, chi2: float, count: int) -> str:
    """Map PRR magnitude to a human-readable strength label."""
    if prr < PRR_MIN or chi2 < CHI2_MIN or count < COUNT_MIN:
        return "None"
    if prr >= 5.0 and chi2 >= 10.0:
        return "High"
    if prr >= 3.0:
        return "Medium"
    return "Low"


def calculate_prr(drug_name: str) -> List[dict]:
    """
    Calculate PRR for every event term in the dataset for the given drug.
    Returns a list of result dicts sorted by PRR descending.
    """
    df = _load_df()

    all_drugs = df["drug_name"].unique().tolist()
    if drug_name not in all_drugs:
        return []

    drug_df  = df[df["drug_name"] == drug_name]
    other_df = df[df["drug_name"] != drug_name]

    all_events = df["event_term"].unique().tolist()
    total_drug  = len(drug_df)
    total_other = len(other_df)

    results = []
    for event in all_events:
        a = int((drug_df["event_term"] == event).sum())
        c = int((other_df["event_term"] == event).sum())

        # Need at least 1 case in the drug to compute anything meaningful
        if a == 0:
            continue

        b = total_drug  - a
        d = total_other - c

        # Guard against zero denominators
        drug_rate  = a / (a + b) if (a + b) > 0 else 0.0
        other_rate = c / (c + d) if (c + d) > 0 else None

        if other_rate is None or other_rate == 0.0:
            # Drug-specific event — assign a high PRR sentinel
            prr  = 10.0
            chi2 = 0.0
        else:
            prr = drug_rate / other_rate

            # Chi-squared (2×2 contingency, no Yates correction)
            N = a + b + c + d
            expected = ((a + b) * (a + c)) / N
            chi2 = ((a - expected) ** 2) / expected if expected > 0 else 0.0

        is_signal = (prr >= PRR_MIN) and (chi2 >= CHI2_MIN) and (a >= COUNT_MIN)
        strength  = _signal_strength(prr, chi2, a)

        # Look up the SOC for the first occurrence of this event
        soc_rows = df[df["event_term"] == event]["event_soc"]
        soc = soc_rows.iloc[0] if not soc_rows.empty else "Unknown"

        results.append({
            "drug_name":      drug_name,
            "event_term":     event,
            "event_soc":      soc,
            "case_count":     a,
            "prr":            round(prr, 3),
            "chi2":           round(chi2, 3),
            "is_signal":      is_signal,
            "signal_strength": strength,
            "disclaimer":     DISCLAIMER,
        })

    results.sort(key=lambda x: x["prr"], reverse=True)
    return results


def get_ranked_signals(top_n: int = 20) -> List[dict]:
    """
    Return the top-N drug-event pairs ranked by PRR across all drugs.
    Only includes rows that meet the Evans signal threshold.
    """
    df = _load_df()
    all_drugs = df["drug_name"].unique().tolist()

    signals = []
    for drug in all_drugs:
        for row in calculate_prr(drug):
            if row["is_signal"]:
                signals.append(row)

    signals.sort(key=lambda x: x["prr"], reverse=True)
    return signals[:top_n]
