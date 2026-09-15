"""Dossier / submission readiness endpoints — CTD checker (Phase 5), recommendations (Phase 6)."""
import json
import pathlib

from fastapi import APIRouter, HTTPException
from schemas.models import DossierCheckRequest
from engines.ctd_checker import check_dossier as _check_dossier, load_sample_dossier
from engines.recommendation_engine import get_recommendations as _get_recommendations, get_all_recommendations
from schemas.ich_m4_schema import ICH_M4_SCHEMA

router = APIRouter()


@router.get("/structure")
def get_structure():
    """Return the loaded sample dossier tree."""
    return load_sample_dossier()


@router.post("/check")
def check_dossier(body: DossierCheckRequest):
    """Run CTD completeness check against the ICH M4 schema."""
    if not body.dossier:
        raise HTTPException(status_code=400, detail="Dossier payload is empty.")
    return _check_dossier(body.dossier)


@router.get("/check/sample")
def check_sample_dossier():
    """Run CTD completeness check on the built-in sample dossier."""
    return _check_dossier(load_sample_dossier())


@router.get("/schema")
def get_schema():
    """Return the authoritative ICH M4 module schema."""
    return ICH_M4_SCHEMA


@router.get("/recommend/{module_id}")
def get_recommendations(module_id: str):
    """Get AI-assisted recommendations for gaps in a specific module."""
    valid_modules = list(ICH_M4_SCHEMA.keys())
    if module_id not in valid_modules:
        raise HTTPException(
            status_code=404,
            detail=f"Module '{module_id}' not found. Valid: {valid_modules}"
        )
    return _get_recommendations(module_id)


@router.get("/recommend")
def get_all_recs():
    """Get all recommendations for all gaps in the sample dossier."""
    report = _check_dossier(load_sample_dossier())
    return get_all_recommendations(report["gaps"])
