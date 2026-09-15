# PharmaGuard AI
### Drug Safety Signal Detector & Regulatory Submission Readiness Checker
**IBM Bob AI Hackathon Prototype** — All data is synthetic. Not for clinical use.

---

## What It Does

PharmaGuard AI is a two-mode pharmacovigilance prototype built for the IBM Bob Hackathon.

| Mode | What it analyses | Key output |
|---|---|---|
| **Signal Detection** | 500 synthetic adverse-event reports across 6 drugs | PRR per drug-event pair, K-Means clusters, signal strength ranking, per-pair explainability |
| **Submission Readiness** | A synthetic ICH M4 CTD dossier (DrugAlpha NDA-2024-001) | Completeness scores for Modules 1–5, gap list sorted by severity, AI-assisted recommendations |

---

## Quick Start

### Prerequisites
| Tool | Version |
|---|---|
| Python | 3.11+ (tested on 3.14) |
| Node.js | 18+ |

### 1 — Backend
```bash
cd pharmaguard-ai/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Interactive API docs: **http://localhost:8000/docs**

### 2 — Frontend
```bash
cd pharmaguard-ai/frontend
npm install
npm run dev
```
App: **http://localhost:3000**

---

## Architecture

```
pharmaguard-ai/
├── backend/
│   ├── main.py                        # FastAPI app + CORS
│   ├── requirements.txt
│   ├── routers/
│   │   ├── signals.py                 # /api/signals — PRR, cluster, explain, ranked
│   │   └── dossier.py                 # /api/dossier — CTD check, schema, recommendations
│   ├── engines/
│   │   ├── prr_engine.py              # PRR + Evans criteria signal detection
│   │   ├── clustering_engine.py       # K-Means clustering of AE reports
│   │   ├── ctd_checker.py             # ICH M4 completeness checker
│   │   ├── explainability_engine.py   # Data-driven signal explanations
│   │   └── recommendation_engine.py  # Gap → recommendation mapper
│   ├── data/
│   │   ├── adverse_events.json        # 500 synthetic AE reports (signal-seeded)
│   │   ├── drug_exposure.json         # Synthetic drug exposure counts
│   │   └── sample_dossier.json        # Synthetic CTD dossier (~45% complete)
│   ├── schemas/
│   │   ├── ich_m4_schema.py           # Authoritative ICH M4 module tree (74 sections)
│   │   └── models.py                  # Pydantic request/response models
│   └── tests/
│       ├── test_prr_engine.py                  # 11 tests
│       ├── test_clustering_engine.py           #  9 tests
│       ├── test_explainability_engine.py       # 11 tests
│       ├── test_ctd_checker.py                 # 13 tests
│       └── test_prr_endpoint_regression.py     # 18 tests  →  62 total, all passing
│
└── frontend/
    └── src/
        ├── App.jsx                    # Router shell
        ├── shared/
        │   ├── Layout.jsx             # Nav + DisclaimerBanner + footer
        │   ├── Badge.jsx              # Signal strength pill
        │   └── ScoreGauge.jsx         # SVG circular completeness gauge
        ├── pages/
        │   ├── SignalDetection.jsx    # PRR table/chart, clusters, ranked signals, explain
        │   └── SubmissionReadiness.jsx # Module tree, gap report, recommendations
        ├── components/
        │   ├── SignalTable.jsx        # Sortable PRR results table
        │   ├── PRRChart.jsx           # Recharts horizontal bar chart
        │   ├── ClusterView.jsx        # Pie chart + cluster cards
        │   ├── ExplainPanel.jsx       # Per-signal explainability panel
        │   ├── CTDModuleTree.jsx      # Per-module score gauges + gap list
        │   ├── GapReport.jsx          # Filterable gap table
        │   ├── RecommendationPanel.jsx # Per-module/section recommendations
        │   └── DisclaimerBanner.jsx   # Dismissible prototype disclaimer
        └── api/
            ├── signalsApi.js          # Axios calls → /api/signals
            └── dossierApi.js          # Axios calls → /api/dossier
```

---

## API Reference

### Signal Detection `/api/signals`
| Method | Path | Description |
|---|---|---|
| GET | `/reports` | All 500 synthetic AE reports |
| POST | `/prr` | `{ drug_name }` → PRR results for all events |
| POST | `/cluster` | `{ drug_name, n_clusters? }` → K-Means cluster groups |
| GET | `/ranked` | All Evans-criteria signals ranked by PRR |
| GET | `/explain/{drug}/{event}` | Full data-driven explainability for a drug-event pair |

### Submission Readiness `/api/dossier`
| Method | Path | Description |
|---|---|---|
| GET | `/structure` | Raw sample dossier JSON |
| POST | `/check` | `{ dossier }` → completeness report for any dossier |
| GET | `/check/sample` | Completeness report for the built-in sample |
| GET | `/schema` | Authoritative ICH M4 schema (all 74 sections) |
| GET | `/recommend/{module}` | Recommendations for gaps in a module |
| GET | `/recommend` | All recommendations for all gaps in the sample |

---

## PRR Calculation

```
PRR(drug D, event E) = [a / (a+b)] / [c / (c+d)]

a = reports of drug D with event E
b = reports of drug D without event E
c = reports of all other drugs with event E
d = reports of all other drugs without event E

Signal threshold (Evans 2001): PRR >= 2.0  AND  Chi² >= 4.0  AND  n >= 3
```

---

## Demo Signals (seeded in synthetic data)

| Drug | Signal | PRR | Strength |
|---|---|---|---|
| DrugAlpha | Nausea | 5.00 | High |
| DrugAlpha | Vomiting | 4.21 | Medium |
| DrugBeta | Tachycardia | 3.73 | Medium |
| DrugBeta | Palpitations | 3.29 | Medium |

---

## Test Suite

```bash
cd backend
py -m pytest tests/ -v
# 62 passed
```

---

## How IBM Bob Was Used

Every artefact in this project was built interactively with IBM Bob acting as the development partner.

| Task | Bob's contribution |
|---|---|
| **Architecture planning** | Bob produced the full technical blueprint, folder structure, API design, and phased implementation plan from the P2 problem statement |
| **Synthetic data generation** | Bob generated the 500-row `adverse_events.json` with realistic MedDRA-style terms and seeded PRR signals for two drugs |
| **PRR engine** | Bob wrote `prr_engine.py`, applied Evans 2001 criteria, designed the signal-strength bucketing logic, and wrote all 11 unit tests |
| **Clustering engine** | Bob designed the 4-feature encoding pipeline, the auto-label heuristic for cluster names, and the centroid description templates in `clustering_engine.py` |
| **Explainability engine** | Bob authored the complete `explainability_engine.py` — including the Evans checklist builder, rate comparison, and the natural-language narrative template — and wrote 11 unit tests |
| **ICH M4 schema** | Bob coded the full `ich_m4_schema.py` with all 74 sections across 5 modules, correct severity classifications, and accurate section names from the ICH M4 guideline |
| **CTD checker** | Bob implemented `ctd_checker.py`, the gap-list builder, the severity-ordered sorting, and the `ready_for_submission` logic, then validated it with 15 unit tests |
| **Recommendation engine** | Bob generated all recommendation templates in `recommendation_engine.py`, including the module-level contextual hints for each of the 5 CTD modules |
| **All React components** | Bob scaffolded every frontend component — SignalTable, PRRChart, ClusterView, ExplainPanel, CTDModuleTree, GapReport, RecommendationPanel, DisclaimerBanner, ScoreGauge, Badge, Layout — from component-level descriptions |
| **API wiring** | Bob iteratively wired each engine into its router as each phase completed, replacing stubs with live implementations |
| **Code review** | Bob reviewed each engine for correctness before endpoint wiring: checked formula implementation, edge-case handling (zero denominators, unknown drugs, empty datasets), and return-type consistency |
| **Test writing** | Bob authored all 62 unit tests across 5 test files, including seeded-signal assertions, boundary tests (perfect/empty dossier), mathematical consistency checks, and full FastAPI endpoint regression tests |
| **README** | Bob wrote this README and the Bob usage section |

---

## Disclaimer

> All adverse-event data in this application is **entirely synthetic** and was generated for
> demonstration purposes only.
>
> PRR results are **statistical associations** and do not confirm any causal relationship
> between a drug and an adverse event.
>
> CTD completeness scores are based on a synthetic, intentionally incomplete dossier and
> do not reflect any real regulatory submission.
>
> This prototype is **not intended for clinical, regulatory, or diagnostic use**.
> All pharmacovigilance findings require further expert review.
