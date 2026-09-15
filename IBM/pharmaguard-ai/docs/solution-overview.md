# Solution Overview

## What PharmaGuard AI Does

PharmaGuard AI is a full-stack pharmacovigilance prototype with two distinct analytical modules accessible from a single React frontend.

---

## Module 1 — Signal Detection

### What it solves
Automates the detection, clustering, and explanation of adverse-event safety signals from spontaneous AE report data.

### How it works

| Step | Technology | Description |
|---|---|---|
| **1. PRR Calculation** | `prr_engine.py` | Computes the Proportional Reporting Ratio (PRR) and chi-squared statistic for every drug-event pair using the Evans 2001 2×2 contingency table. Signals are flagged when PRR ≥ 2.0, χ² ≥ 4.0, and n ≥ 3. |
| **2. Signal Ranking** | `prr_engine.py` | Returns all drug-event pairs that meet the Evans threshold, ranked by PRR descending. Strength is bucketed: High (PRR ≥ 5), Medium (PRR ≥ 3), Low (PRR ≥ 2). |
| **3. AE Clustering** | `clustering_engine.py` | Encodes each AE report as a 4-feature vector (event term, SOC, severity, sex) and groups reports for a selected drug into K-Means clusters. Each cluster is auto-labelled using dominant SOC and severity. |
| **4. Explainability** | `explainability_engine.py` | For any drug-event pair, generates a data-driven natural-language explanation that includes the PRR value, chi-squared value, case count, drug vs. background event rate, Evans checklist status, and a regulatory disclaimer. |

### Key outputs
- Per-drug PRR table (sortable by any column)
- Horizontal bar chart of top signals by PRR
- K-Means cluster cards with representative events
- Plain-English signal explanation panel

---

## Module 2 — Submission Readiness

### What it solves
Automates completeness validation of a CTD dossier against the full ICH M4 section tree and generates actionable gap recommendations.

### How it works

| Step | Technology | Description |
|---|---|---|
| **1. Schema definition** | `ich_m4_schema.py` | Encodes all 74 required sections across the 5 ICH M4 modules, with severity classification (Critical / Major / Minor) for each section. |
| **2. Completeness check** | `ctd_checker.py` | Compares a submitted dossier JSON against the schema, computes per-module and overall completeness scores, and builds a sorted gap list (Critical → Major → Minor). |
| **3. Recommendations** | `recommendation_engine.py` | Maps each missing section to a contextual, actionable recommendation describing what content should be provided. |

### Key outputs
- Overall completeness score (gauge visual)
- Per-module score gauges for Modules 1–5
- Filterable gap report table sorted by severity
- Per-module recommendation panel

---

## IBM Bob's Role

IBM Bob was the primary development partner throughout this project. Bob produced the architecture plan, all engine code, all test suites, all React components, the API layer, and this documentation from interactive, iterative conversations. See the `README.md` "How IBM Bob Was Used" section for a task-by-task breakdown.

---

## Data

All data used by this prototype is **entirely synthetic**:

| Dataset | File | Contents |
|---|---|---|
| Adverse events | `backend/data/adverse_events.json` | 500 synthetic AE reports across 6 drugs with MedDRA-style event terms and seeded PRR signals |
| Drug exposure | `backend/data/drug_exposure.json` | Synthetic exposure counts for denominator calculations |
| Sample dossier | `backend/data/sample_dossier.json` | A synthetic ICH M4 CTD dossier intentionally set to ~45% completeness |

---

## Key Metrics (Prototype)

| Metric | Value |
|---|---|
| Adverse-event reports | 500 (synthetic) |
| Drugs analysed | 6 (DrugAlpha – DrugZeta) |
| ICH M4 sections validated | 74 (Modules 1–5) |
| PRR signals detected (sample data) | 8+ |
| Test suite | 62 tests, 100% pass rate |
| Backend response time (PRR endpoint) | < 200 ms on local hardware |
