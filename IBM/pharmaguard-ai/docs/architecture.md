# Architecture

## Overview

PharmaGuard AI is a decoupled full-stack application: a Python/FastAPI backend that exposes a REST API, and a React/Vite frontend that consumes it. During development (and in the hackathon demo), the frontend's Vite dev server proxies all `/api` requests to the backend, so no CORS configuration is required in the browser.

```
Browser (localhost:3000)
        │
        │  HTTP  /api/*
        ▼
Vite Dev Server (port 3000) ──proxy──► FastAPI (port 8000)
                                              │
                               ┌──────────────┼──────────────┐
                               ▼              ▼              ▼
                         prr_engine   clustering_engine  ctd_checker
                               │              │              │
                               └──────────────┼──────────────┘
                                              ▼
                                    data/ (JSON files)
```

---

## Directory Structure

```
pharmaguard-ai/
├── .gitignore
├── .github/
│   └── workflows/
│       └── validate.yml          # CI — backend tests + frontend build
├── submission.yaml               # Hackathon submission manifest
├── README.md
├── CONTRIBUTING.md
├── docs/
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md           # this file
│   └── setup-guide.md
├── demo/
│   ├── README.md
│   ├── demo-video-link.txt
│   ├── live-demo-url.txt
│   └── screenshots/
│
├── backend/                      # Python / FastAPI
│   ├── main.py                   # FastAPI app entry point + CORS config
│   ├── requirements.txt
│   ├── routers/
│   │   ├── signals.py            # /api/signals — PRR, cluster, explain, ranked
│   │   └── dossier.py            # /api/dossier — CTD check, schema, recommendations
│   ├── engines/
│   │   ├── prr_engine.py         # PRR calculation + Evans criteria signal detection
│   │   ├── clustering_engine.py  # K-Means AE report clustering
│   │   ├── ctd_checker.py        # ICH M4 completeness checker + gap builder
│   │   ├── explainability_engine.py  # Natural-language signal explanations
│   │   └── recommendation_engine.py  # Gap → recommendation mapper
│   ├── schemas/
│   │   ├── ich_m4_schema.py      # Authoritative ICH M4 module/section tree (74 sections)
│   │   └── models.py             # Pydantic request/response models
│   ├── data/
│   │   ├── adverse_events.json   # 500 synthetic AE reports (PRR-signal-seeded)
│   │   ├── drug_exposure.json    # Synthetic drug exposure counts
│   │   └── sample_dossier.json   # Synthetic CTD dossier (~45% complete)
│   └── tests/
│       ├── test_prr_engine.py             # 11 unit tests
│       ├── test_clustering_engine.py      # 9 unit tests
│       ├── test_explainability_engine.py  # 11 unit tests
│       ├── test_ctd_checker.py            # 13 unit tests
│       └── test_prr_endpoint_regression.py  # 18 regression tests (engine + API)
│
└── frontend/                     # React 18 / Vite 5
    ├── index.html
    ├── vite.config.js            # Dev server on :3000, proxies /api → :8000
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # React Router shell (2 routes)
        ├── index.css             # Tailwind base styles
        ├── api/
        │   ├── signalsApi.js     # Axios client → /api/signals
        │   └── dossierApi.js     # Axios client → /api/dossier
        ├── pages/
        │   ├── SignalDetection.jsx     # Signal Detection page
        │   └── SubmissionReadiness.jsx # Submission Readiness page
        ├── components/
        │   ├── SignalTable.jsx         # Sortable PRR results table
        │   ├── PRRChart.jsx            # Recharts horizontal bar chart
        │   ├── ClusterView.jsx         # Pie chart + cluster detail cards
        │   ├── ExplainPanel.jsx        # Per-signal explainability panel
        │   ├── CTDModuleTree.jsx       # Module score gauges + section tree
        │   ├── GapReport.jsx           # Filterable gap table
        │   ├── RecommendationPanel.jsx # Per-module recommendations
        │   └── DisclaimerBanner.jsx    # Dismissible prototype disclaimer
        └── shared/
            ├── Layout.jsx        # Navigation bar + footer
            ├── Badge.jsx         # Signal-strength colour pill
            └── ScoreGauge.jsx    # SVG circular completeness gauge
```

---

## API Design

### Base URL
`http://localhost:8000` (backend) — all routes prefixed `/api`

### Signal Detection  `/api/signals`

| Method | Path | Description |
|---|---|---|
| `GET` | `/reports` | All 500 synthetic AE reports |
| `POST` | `/prr` | `{ "drug_name": str }` → PRR results for all events of that drug |
| `POST` | `/cluster` | `{ "drug_name": str, "n_clusters"?: int }` → K-Means clusters |
| `GET` | `/ranked` | All Evans-criteria signals across all drugs, ranked by PRR |
| `GET` | `/explain/{drug}/{event}` | Full explainability for a drug-event pair |

### Submission Readiness  `/api/dossier`

| Method | Path | Description |
|---|---|---|
| `GET` | `/structure` | Raw sample dossier JSON |
| `POST` | `/check` | `{ "dossier": obj }` → completeness report for any dossier |
| `GET` | `/check/sample` | Completeness report for the built-in sample dossier |
| `GET` | `/schema` | Full authoritative ICH M4 schema (all 74 sections) |
| `GET` | `/recommend/{module}` | Recommendations for gaps in a specific module |
| `GET` | `/recommend` | All recommendations for all gaps in the sample dossier |

---

## PRR Formula

```
PRR(D, E) = [ a / (a + b) ] / [ c / (c + d) ]

a = reports of drug D with event E
b = reports of drug D with any other event
c = reports of all other drugs with event E
d = reports of all other drugs with any other event

Evans 2001 signal threshold: PRR ≥ 2.0  AND  χ² ≥ 4.0  AND  n ≥ 3
```

Signal strength bucketing:
- **High**: PRR ≥ 5.0
- **Medium**: PRR ≥ 3.0
- **Low**: PRR ≥ 2.0

---

## Data Flow — Signal Detection

```
POST /api/signals/prr  { drug_name: "DrugAlpha" }
        │
        ▼
signals.py router  →  prr_engine.calculate_prr("DrugAlpha")
        │
        ▼
  Load adverse_events.json + drug_exposure.json
  Build 2×2 contingency table for every event term
  Calculate PRR + chi-squared
  Apply Evans threshold → is_signal flag
  Sort by PRR descending
        │
        ▼
  Return List[PRRResult]  (JSON array)
```

## Data Flow — Submission Readiness

```
GET /api/dossier/check/sample
        │
        ▼
dossier.py router  →  ctd_checker.check_dossier(load_sample_dossier())
        │
        ▼
  Load sample_dossier.json
  Compare each section against ich_m4_schema.py
  Compute per-module score_pct = present / total × 100
  Build gap list (missing sections) sorted Critical → Major → Minor
  overall_score_pct = mean(module scores)
        │
        ▼
  Return DossierReport (JSON object)
```

---

## CORS Configuration

The backend allows requests from `http://localhost:3000` (Vite dev server) and `http://localhost:5173` (Vite default fallback). For a production deployment behind a reverse proxy the CORS origins should be updated in [`backend/main.py`](../backend/main.py).

---

## Technology Versions

| Component | Version |
|---|---|
| Python | 3.12 |
| FastAPI | 0.111+ |
| Uvicorn | 0.29+ |
| React | 18.3 |
| Vite | 5.2 |
| Node.js | 18+ |
| Tailwind CSS | 3.4 |
| Recharts | 2.12 |
