"""
Clustering Engine — group similar adverse-event reports for a given drug.

Pipeline:
  1. Filter AE DataFrame to the selected drug.
  2. Encode features: event_soc (one-hot), severity (ordinal), age_group (one-hot), sex (binary).
  3. Normalise with StandardScaler.
  4. Run K-Means (default k=4).
  5. For each cluster build a human-readable label + centroid description.
  6. Return structured ClusterGroup dicts.
"""

import json
import pathlib
from typing import List

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

_DATA_DIR = pathlib.Path(__file__).parent.parent / "data"

# Ordinal encoding for severity
SEVERITY_MAP = {"Mild": 1, "Moderate": 2, "Severe": 3}

# Minimum reports needed to attempt clustering
MIN_REPORTS = 6


def _load_df() -> pd.DataFrame:
    path = _DATA_DIR / "adverse_events.json"
    return pd.DataFrame(json.loads(path.read_text()))


def _encode(df: pd.DataFrame) -> np.ndarray:
    """
    Build a numeric feature matrix from categorical AE fields.
    Returns a 2-D numpy array (n_samples × n_features).
    """
    frames = []

    # 1. event_soc — one-hot
    soc_dummies = pd.get_dummies(df["event_soc"], prefix="soc")
    frames.append(soc_dummies)

    # 2. severity — ordinal (Mild=1, Moderate=2, Severe=3)
    frames.append(df["severity"].map(SEVERITY_MAP).fillna(2).rename("severity_ord").to_frame())

    # 3. patient_age_group — one-hot
    age_dummies = pd.get_dummies(df["patient_age_group"], prefix="age")
    frames.append(age_dummies)

    # 4. sex — binary (F=0, M=1)
    frames.append((df["sex"] == "M").astype(int).rename("sex_male").to_frame())

    X = pd.concat(frames, axis=1).fillna(0).astype(float)
    return X.values, X.columns.tolist()


def _auto_label(cluster_df: pd.DataFrame) -> tuple[str, str]:
    """
    Derive a short cluster label and a longer centroid description
    from the dominant values within the cluster.
    """
    top_soc      = cluster_df["event_soc"].value_counts().idxmax()
    top_severity = cluster_df["severity"].value_counts().idxmax()
    top_age      = cluster_df["patient_age_group"].value_counts().idxmax()
    top_sex      = cluster_df["sex"].value_counts().idxmax()
    top_event    = cluster_df["event_term"].value_counts().idxmax()
    report_n     = len(cluster_df)

    label = f"{top_severity} {top_soc.replace(' disorders','').replace(' and subcutaneous tissue','')}"

    description = (
        f"Primarily {top_severity.lower()} {top_soc.lower()} events "
        f"(most common: '{top_event}') in {top_age.lower()} {top_sex} patients. "
        f"Contains {report_n} report{'s' if report_n != 1 else ''}."
    )
    return label, description


def cluster_reports(drug_name: str, n_clusters: int = 4) -> List[dict]:
    """
    Cluster adverse-event reports for the given drug.
    Returns a list of ClusterGroup dicts sorted by report_count descending.
    """
    df = _load_df()
    drug_df = df[df["drug_name"] == drug_name].reset_index(drop=True)

    if len(drug_df) < MIN_REPORTS:
        return []

    # Cap n_clusters to unique SOCs or report count
    max_k = min(n_clusters, len(drug_df), drug_df["event_soc"].nunique())
    k = max(2, max_k)

    X, _ = _encode(drug_df)
    X_scaled = StandardScaler().fit_transform(X)

    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(X_scaled)
    drug_df = drug_df.copy()
    drug_df["_cluster"] = labels

    results = []
    for cid in range(k):
        cdf = drug_df[drug_df["_cluster"] == cid]
        if cdf.empty:
            continue

        label, description = _auto_label(cdf)

        top_events = (
            cdf["event_term"]
            .value_counts()
            .head(3)
            .index.tolist()
        )

        results.append({
            "cluster_id":            int(cid),
            "cluster_label":         label,
            "report_count":          int(len(cdf)),
            "representative_events": top_events,
            "dominant_soc":          cdf["event_soc"].value_counts().idxmax(),
            "dominant_severity":     cdf["severity"].value_counts().idxmax(),
            "centroid_description":  description,
        })

    results.sort(key=lambda x: x["report_count"], reverse=True)
    return results
