# Setup Guide

## Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| Python | 3.11 | Tested on 3.12. Install from [python.org](https://www.python.org/downloads/) or `winget install Python.Python.3.12` |
| Node.js | 18 | Tested on 20+. Install from [nodejs.org](https://nodejs.org/) |
| npm | 9+ | Bundled with Node.js |
| Git | Any | For cloning the repository |

---

## 1 — Clone the Repository

```bash
# TODO: GitHub repository not yet created.
# Replace the URL below once the repo is published on GitHub.
git clone <REPO_URL_TO_BE_ADDED>
cd pharmaguard-ai
```

> **TODO:** The GitHub repository has not been created yet. This URL will be updated before final submission.

---

## 2 — Backend Setup

### Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

The `requirements.txt` includes:

| Package | Purpose |
|---|---|
| `fastapi` | REST API framework |
| `uvicorn[standard]` | ASGI server |
| `pandas` | AE report data manipulation |
| `numpy` | Numerical operations |
| `scikit-learn` | K-Means clustering |
| `scipy` | Chi-squared statistics |
| `pydantic` | Request/response validation |
| `python-multipart` | Form data support |

### Start the backend

```bash
uvicorn main:app --reload --port 8000
```

The backend will be available at:
- **API base:** `http://localhost:8000`
- **Interactive docs (Swagger UI):** `http://localhost:8000/docs`
- **Health check:** `http://localhost:8000/` → `{ "status": "ok", "app": "PharmaGuard AI" }`

#### Windows (PowerShell)

```powershell
python -m uvicorn main:app --reload --port 8000
```

---

## 3 — Frontend Setup

Open a **new terminal** (keep the backend running).

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: **`http://localhost:3000`**

The Vite dev server automatically proxies all `/api/*` requests to `http://localhost:8000`, so no additional configuration is needed.

---

## 4 — Run the Test Suite

```bash
cd backend
python -m pytest tests/ -v
```

Expected output:

```
62 passed in ~58s
```

To run a specific test file:

```bash
python -m pytest tests/test_prr_engine.py -v
python -m pytest tests/test_clustering_engine.py -v
python -m pytest tests/test_explainability_engine.py -v
python -m pytest tests/test_ctd_checker.py -v
python -m pytest tests/test_prr_endpoint_regression.py -v
```

---

## 5 — Frontend Production Build

```bash
cd frontend
npm run build
```

Build output is written to `frontend/dist/`. This directory is excluded from version control via `.gitignore`.

---

## 6 — Verify Everything Is Working

After starting both backend and frontend:

1. Open `http://localhost:3000` in your browser.
2. The **Signal Detection** page should load automatically.
3. Select a drug from the dropdown (e.g., DrugAlpha) and click **Analyse**.
4. You should see a PRR table, bar chart, cluster cards, and an explanation panel.
5. Navigate to **Submission Readiness** using the top navigation.
6. The CTD completeness dashboard should load with module scores and a gap report.

---

## Troubleshooting

### `Module not found` on backend startup

Ensure you are running `uvicorn` from inside the `backend/` directory:

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend shows blank page or network errors

- Confirm the backend is running on port 8000 before starting the frontend.
- Check the browser console for any failed `/api/` requests.
- Verify that both terminals are active (backend + frontend).

### `python` not found on Windows

Use `python` instead of `python3`, or explicitly call `py`:

```powershell
py -m uvicorn main:app --reload --port 8000
py -m pytest tests/ -v
```

### Port conflicts

If port 8000 or 3000 is in use, change them:

```bash
# Backend — different port
uvicorn main:app --reload --port 8001

# Frontend — update vite.config.js proxy target to match, then:
npm run dev -- --port 3001
```

---

## Environment Variables

No environment variables are required to run the prototype. All configuration is hard-coded for the hackathon demo. If you extend the project for production, add a `.env` file (excluded from git by `.gitignore`) and reference variables via `python-dotenv`.

---

## Virtual Environment (Recommended)

```bash
cd backend
python -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

The `.venv/` directory is excluded from version control via `.gitignore`.
