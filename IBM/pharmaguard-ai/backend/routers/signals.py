"""Signal detection endpoints — PRR (Phase 2), clustering (Phase 3), explainability (Phase 4)."""
import json
import pathlib

from fastapi import APIRouter, HTTPException
from schemas.models import PRRRequest, ClusterRequest
from engines.prr_engine import calculate_prr as _calculate_prr, get_ranked_signals
from engines.clustering_engine import cluster_reports as _cluster_reports
from engines.explainability_engine import explain_signal as _explain_signal

router = APIRouter()


@router.get("/reports")
def get_reports():
    """Return all synthetic adverse-event reports."""
    path = pathlib.Path(__file__).parent.parent / "data" / "adverse_events.json"
    return json.loads(path.read_text())


@router.post("/prr")
def calculate_prr(body: PRRRequest):
    """Calculate PRR for all event terms associated with the given drug."""
    results = _calculate_prr(body.drug_name)
    if not results:
        raise HTTPException(status_code=404, detail=f"Drug '{body.drug_name}' not found in dataset.")
    return results


@router.post("/cluster")
def cluster_reports(body: ClusterRequest):
    """Cluster adverse-event reports for the given drug into K groups."""
    results = _cluster_reports(body.drug_name, body.n_clusters or 4)
    if results is None or (isinstance(results, list) and len(results) == 0):
        raise HTTPException(status_code=404, detail=f"Drug '{body.drug_name}' not found or too few reports.")
    return results


@router.get("/ranked")
def ranked_signals():
    """All drug-event pairs that meet the Evans signal threshold, ranked by PRR."""
    return get_ranked_signals()


@router.get("/explain/{drug_name}/{event_term}")
def explain_signal(drug_name: str, event_term: str):
    """Return a data-driven explanation for a drug–event pair."""
    result = _explain_signal(drug_name, event_term)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Drug '{drug_name}' not found in dataset.")
    return result
