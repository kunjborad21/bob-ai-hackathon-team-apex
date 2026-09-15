from pydantic import BaseModel
from typing import Optional, List, Dict, Any


# ── Signal Detection models ──────────────────────────────────────────────────

class PRRRequest(BaseModel):
    drug_name: str


class PRRResult(BaseModel):
    drug_name: str
    event_term: str
    event_soc: str
    case_count: int       # a: reports for this drug + event
    prr: float
    chi2: float
    is_signal: bool
    signal_strength: str  # "None" | "Low" | "Medium" | "High"
    disclaimer: str


class ClusterRequest(BaseModel):
    drug_name: str
    n_clusters: Optional[int] = 4


class ClusterGroup(BaseModel):
    cluster_id: int
    cluster_label: str
    report_count: int
    representative_events: List[str]
    dominant_soc: str
    dominant_severity: str
    centroid_description: str


class RankedSignal(BaseModel):
    drug_name: str
    event_term: str
    prr: float
    chi2: float
    case_count: int
    signal_strength: str


class ExplainResult(BaseModel):
    drug_name: str
    event_term: str
    prr: float
    chi2: float
    case_count: int
    background_rate_pct: Optional[float]   # None when event not observed in background
    drug_rate_pct: float
    is_signal: bool                         # Required by frontend ExplainPanel
    signal_strength: str                    # Required by frontend ExplainPanel
    explanation: str
    disclaimer: str


# ── Dossier / Submission Readiness models ────────────────────────────────────

class ModuleCompleteness(BaseModel):
    module_id: str
    module_name: str
    score_pct: float
    present_count: int
    missing_count: int
    total_count: int


class GapItem(BaseModel):
    module_id: str
    section_id: str
    section_name: str
    severity: str   # "Critical" | "Major" | "Minor"
    status: str     # "Missing" | "Incomplete"


class CompletenessReport(BaseModel):
    submission_name: str
    overall_score_pct: float
    modules: List[ModuleCompleteness]
    gaps: List[GapItem]
    ready_for_submission: bool


class Recommendation(BaseModel):
    section_id: str
    section_name: str
    severity: str
    recommendation_text: str


class DossierCheckRequest(BaseModel):
    dossier: Dict[str, Any]
