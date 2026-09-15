# Source Code

All source code for PharmaGuard AI is organized in this folder.

## Structure

```text
src/
  backend/        ← FastAPI backend and analysis engines
  frontend/       ← React + Vite frontend
  .env.example    ← Environment variable template
  README.md       ← This file
```

### Backend

The `backend/` folder contains:

* FastAPI application and API routes
* PRR signal detection engine
* K-Means clustering engine
* Signal explainability engine
* CTD completeness checker
* Recommendation engine
* Synthetic adverse-event and dossier data
* ICH M4 schema
* Backend tests

### Frontend

The `frontend/` folder contains:

* React user interface
* Signal Detection page
* Submission Readiness page
* Signal tables and charts
* Cluster visualization
* Explainability panel
* CTD module tree
* Gap report
* Recommendation panel

## Important Files to Include

* `backend/requirements.txt` — Python dependencies
* `frontend/package.json` — Frontend dependencies
* `.env.example` — Environment variable template

## What NOT to Include in src/

* `.env` files containing real secrets
* `node_modules/`
* `.venv/`
* `__pycache__/`
* `dist/` or other build artifacts
* Other generated files

## Testing

Backend tests can be run with:

```bash
cd src/backend
py -m pytest tests/ -v
```

The current test suite contains 62 passing tests.

## Important Note

PharmaGuard AI uses synthetic data for demonstration and testing. It is a hackathon prototype and is not intended for clinical, diagnostic, pharmacovigilance, or regulatory decision-making without appropriate expert review.
