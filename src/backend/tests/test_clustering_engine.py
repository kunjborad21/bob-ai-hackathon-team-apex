"""
Unit tests for clustering_engine.py
Run: py -m pytest tests/test_clustering_engine.py -v
"""
import sys
import pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from engines.clustering_engine import cluster_reports


def test_returns_list():
    result = cluster_reports("DrugAlpha")
    assert isinstance(result, list)
    assert len(result) > 0


def test_cluster_fields():
    result = cluster_reports("DrugAlpha")
    required = {
        "cluster_id", "cluster_label", "report_count",
        "representative_events", "dominant_soc",
        "dominant_severity", "centroid_description",
    }
    for cluster in result:
        assert required.issubset(cluster.keys()), f"Missing keys: {cluster}"


def test_report_counts_sum_to_drug_total():
    """Sum of cluster report counts must equal total AE reports for that drug."""
    import json, pathlib
    df_path = pathlib.Path(__file__).parent.parent / "data" / "adverse_events.json"
    import pandas as pd
    df = pd.DataFrame(json.loads(df_path.read_text()))
    for drug in ["DrugAlpha", "DrugBeta", "DrugGamma"]:
        total_in_data = int((df["drug_name"] == drug).sum())
        clusters = cluster_reports(drug)
        total_in_clusters = sum(c["report_count"] for c in clusters)
        assert total_in_clusters == total_in_data, (
            f"{drug}: data={total_in_data}, clusters sum={total_in_clusters}"
        )


def test_cluster_count_respects_k():
    """Requesting k=3 should return at most 3 clusters."""
    result = cluster_reports("DrugAlpha", n_clusters=3)
    assert len(result) <= 3


def test_representative_events_are_list():
    result = cluster_reports("DrugAlpha")
    for c in result:
        assert isinstance(c["representative_events"], list)
        assert len(c["representative_events"]) >= 1


def test_sorted_by_report_count_desc():
    result = cluster_reports("DrugAlpha")
    counts = [c["report_count"] for c in result]
    assert counts == sorted(counts, reverse=True)


def test_unknown_drug_returns_empty():
    result = cluster_reports("DrugNotExist")
    assert result == []


def test_all_drugs_cluster():
    """Every drug in the dataset should produce at least 2 clusters."""
    for drug in ["DrugAlpha", "DrugBeta", "DrugGamma", "DrugDelta", "DrugEpsilon", "DrugZeta"]:
        result = cluster_reports(drug)
        assert len(result) >= 2, f"{drug} produced fewer than 2 clusters: {len(result)}"


def test_cluster_ids_are_ints():
    result = cluster_reports("DrugBeta")
    for c in result:
        assert isinstance(c["cluster_id"], int)
