"""
Recommendation Engine — maps ICH M4 gap items to actionable,
module-specific recommendations.

Each recommendation is deterministic and section-aware: it uses the
section name and severity level to generate a targeted action item.
No speculative content is added — recommendations are grounded in the
ICH M4 guideline requirements.
"""

from schemas.ich_m4_schema import ICH_M4_SCHEMA

# ── Recommendation templates keyed by severity ──────────────────────────────
# {section_name} is substituted at runtime.

_CRITICAL_TEMPLATE = (
    "ACTION REQUIRED: '{section_name}' is a Critical section under ICH M4. "
    "Prepare and include this document before submission. "
    "Absence of Critical sections will result in a formal deficiency notice from the regulatory authority."
)

_MAJOR_TEMPLATE = (
    "RECOMMENDED: '{section_name}' is a Major section under ICH M4. "
    "Include this section to ensure a complete submission. "
    "Missing Major sections frequently trigger information requests and delay review timelines."
)

_MINOR_TEMPLATE = (
    "CONSIDER: '{section_name}' is a Minor section under ICH M4. "
    "While not mandatory, including this section improves dossier quality and reviewability."
)

_TEMPLATE_BY_SEVERITY = {
    "Critical": _CRITICAL_TEMPLATE,
    "Major":    _MAJOR_TEMPLATE,
    "Minor":    _MINOR_TEMPLATE,
}

# ── Module-level contextual hints ────────────────────────────────────────────
_MODULE_CONTEXT = {
    "module_1": (
        "Module 1 contains regional administrative documents. "
        "Ensure all local regulatory forms are complete and current."
    ),
    "module_2": (
        "Module 2 summaries must be consistent with the data in Modules 3–5. "
        "Prepare summaries after all study data is finalised."
    ),
    "module_3": (
        "Module 3 covers pharmaceutical quality. "
        "All drug substance and drug product sections must be supported by validated analytical data."
    ),
    "module_4": (
        "Module 4 contains nonclinical study reports. "
        "Ensure all pivotal studies (safety pharmacology, toxicology) are fully reported."
    ),
    "module_5": (
        "Module 5 contains clinical study reports. "
        "Phase II and Phase III efficacy studies are critical for product approval."
    ),
}


def get_recommendations(module_id: str) -> list[dict]:
    """
    Return a list of recommendations for all *missing* sections in the
    given module of the SAMPLE dossier.

    Each recommendation is tied to a specific gap section.
    """
    if module_id not in ICH_M4_SCHEMA:
        return []

    from engines.ctd_checker import load_sample_dossier, check_dossier

    report = check_dossier(load_sample_dossier())
    module_gaps = [g for g in report["gaps"] if g["module_id"] == module_id]

    context = _MODULE_CONTEXT.get(module_id, "")
    recs = []

    for gap in module_gaps:
        template = _TEMPLATE_BY_SEVERITY.get(gap["severity"], _MINOR_TEMPLATE)
        text = template.format(section_name=gap["section_name"])
        if context:
            text = f"{text} {context}"

        recs.append({
            "section_id":          gap["section_id"],
            "section_name":        gap["section_name"],
            "severity":            gap["severity"],
            "recommendation_text": text,
        })

    return recs


def get_all_recommendations(gaps: list[dict]) -> list[dict]:
    """
    Given a list of gap items (from ctd_checker output), return
    a recommendation for each gap.
    """
    recs = []
    for gap in gaps:
        template = _TEMPLATE_BY_SEVERITY.get(gap["severity"], _MINOR_TEMPLATE)
        context  = _MODULE_CONTEXT.get(gap["module_id"], "")
        text     = template.format(section_name=gap["section_name"])
        if context:
            text = f"{text} {context}"

        recs.append({
            "section_id":          gap["section_id"],
            "section_name":        gap["section_name"],
            "severity":            gap["severity"],
            "recommendation_text": text,
        })
    return recs
