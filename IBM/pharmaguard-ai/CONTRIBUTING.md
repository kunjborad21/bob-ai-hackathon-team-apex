# Contributing to PharmaGuard AI

Thank you for your interest in PharmaGuard AI. This document describes how to set up your development environment, run the test suite, and submit changes.

> **Note:** This project was submitted as a hackathon prototype. All adverse-event data is synthetic. This codebase is not intended for production pharmacovigilance or regulatory use.

---

## Getting Started

### 1 — Fork and clone

```bash
# TODO: GitHub repository not yet created.
# Replace the URL below once the repo is published.
git clone <REPO_URL_TO_BE_ADDED>
cd pharmaguard-ai
```

### 2 — Set up the backend

```bash
cd backend
python -m venv .venv

# Activate (Linux / macOS)
source .venv/bin/activate

# Activate (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

### 3 — Set up the frontend

```bash
cd frontend
npm install
```

See [`docs/setup-guide.md`](docs/setup-guide.md) for full prerequisites and troubleshooting.

---

## Development Workflow

### Running the application locally

Start both processes in separate terminals:

```bash
# Terminal 1 — backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend
npm run dev
```

App: **http://localhost:3000** | API docs: **http://localhost:8000/docs**

---

## Running the Tests

All backend tests must pass before a pull request will be reviewed.

```bash
cd backend
python -m pytest tests/ -v
```

Expected: **62 passed**

### Test files

| File | Coverage |
|---|---|
| `tests/test_prr_engine.py` | PRR calculation, Evans criteria, signal-strength labelling |
| `tests/test_clustering_engine.py` | K-Means clustering, cluster fields, unknown drug handling |
| `tests/test_explainability_engine.py` | Explanation generation, rate comparison, case-insensitive lookup |
| `tests/test_ctd_checker.py` | ICH M4 completeness scoring, gap builder, severity sorting |
| `tests/test_prr_endpoint_regression.py` | Engine regression + FastAPI TestClient endpoint tests |

---

## Code Style

### Python (backend)
- Follow **PEP 8**.
- Keep functions small and single-purpose.
- All public engine functions must have a docstring.
- New engines must have a corresponding test file in `backend/tests/`.

### JavaScript / React (frontend)
- Use functional components and React hooks.
- Follow the existing file structure: pages in `pages/`, reusable components in `components/`, shared primitives in `shared/`.
- Use Tailwind CSS utility classes for styling. Do not add custom CSS unless strictly necessary.

---

## Submitting Changes

1. Create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and write or update tests as needed.

3. Run the full test suite and confirm all tests pass:
   ```bash
   cd backend && python -m pytest tests/ -v
   ```

4. Run the frontend build to confirm no build errors:
   ```bash
   cd frontend && npm run build
   ```

5. Commit with a descriptive message:
   ```bash
   git commit -m "feat: describe your change here"
   ```

6. Push and open a pull request against `main`.

---

## What Not to Change

- **`backend/data/`** — The synthetic datasets are deliberately seeded to produce known PRR signals. Do not modify them without updating the corresponding tests.
- **`backend/schemas/ich_m4_schema.py`** — The ICH M4 schema is based on the authoritative ICH M4 guideline. Changes must be backed by a reference to the guideline.
- **Application disclaimer** — The `DisclaimerBanner` and README disclaimer must remain present in any derivative work.

---

## Reporting Issues

Open a GitHub issue describing:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Python version and OS

---

## Disclaimer

All adverse-event data in this application is entirely synthetic and generated for demonstration purposes only. This prototype is not intended for clinical, regulatory, or diagnostic use.
