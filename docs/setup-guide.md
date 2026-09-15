# Setup Guide

> **This file is read by the automated evaluation pipeline. Be precise and complete.**

## Prerequisites

Before you begin, ensure you have the following installed:

* [ ] Python 3.11+
* [ ] Node.js 18+
* [ ] npm
* [ ] Git

The project has two parts:

* `src/backend` — FastAPI/Python backend
* `src/frontend` — React/Vite frontend

## Environment Variables

PharmaGuard AI does not require external API keys, database credentials, or other secrets for the current hackathon prototype.

The project uses synthetic data stored inside the repository.

If environment-specific configuration is added in the future, it should be stored in a `.env` file and documented through `.env.example`.

**Do not commit real secrets or credentials to Git.**

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/[your-username]/bob-ai-hackathon-pharmaguard-ai.git
cd bob-ai-hackathon-pharmaguard-ai

# 2. Open the backend directory
cd src/backend

# 3. Install backend dependencies
py -m pip install -r requirements.txt

# 4. Open a new terminal and go to the frontend directory
cd ../frontend

# 5. Install frontend dependencies
npm install
```

## Running the Application

The backend and frontend should be run in separate terminals.

### Terminal 1 — Start the Backend

```bash
cd src/backend
py -m uvicorn main:app --reload --port 8000
```

The FastAPI backend will be available at:

```text
http://localhost:8000
```

### Terminal 2 — Start the Frontend

```bash
cd src/frontend
npm run dev
```

The React application will be available at:

```text
http://localhost:3000/
```

Open the frontend URL in a browser to use PharmaGuard AI.

## Running Tests

From the backend directory:

```bash
cd src/backend
py -m pytest tests/ -v
```

The project has been verified with:

```text
62 passed
```

A Starlette deprecation warning may appear during the test run, but it does not cause the tests to fail.

## Frontend Build Verification

To verify that the React frontend can be built successfully:

```bash
cd src/frontend
npm run build
```

The production build should complete successfully.

A Vite warning about a large JavaScript chunk may appear. This is a build warning and does not prevent the build from completing.

## Quick Demo

After starting both the backend and frontend:

1. Open `http://localhost:3000/`.
2. Open the **Signal Detection** section.
3. View the drug-event signal results and PRR values.
4. Explore signal rankings and clusters.
5. Select a drug-event pair to view its explanation.
6. Open the **Submission Readiness** section.
7. View the synthetic CTD dossier completeness results.
8. Review identified gaps and their severity.
9. View the recommendations generated for the identified gaps.

The application uses synthetic adverse-event and regulatory dossier data for demonstration.

## Troubleshooting

| Issue                                               | Solution                                                                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `ModuleNotFoundError`                               | Run `py -m pip install -r requirements.txt` from `src/backend`.                                                                |
| `npm` command not found                             | Install Node.js and npm, then reopen the terminal.                                                                             |
| Frontend cannot connect to backend                  | Make sure the FastAPI backend is running on port `8000`.                                                                       |
| `ERR_CONNECTION_REFUSED` from frontend API requests | Start the backend using `py -m uvicorn main:app --reload --port 8000`.                                                         |
| `npm install` fails                                 | Check that Node.js and npm are installed correctly, then run `npm install` again.                                              |
| Backend starts but API results are unavailable      | Confirm that you started the backend from `src/backend` so that the project data and modules are available.                    |
| Port `8000` is already in use                       | Stop the process using port `8000` or start the backend on another port and update the frontend API configuration accordingly. |
| Port `3000` is already in use                       | Stop the process using port `3000` or use the Vite option to start the frontend on another available port.                     |
| Tests fail because dependencies are missing         | Run `py -m pip install -r requirements.txt` again.                                                                             |
| Frontend build shows a chunk-size warning           | This is a Vite build warning. The build can still complete successfully.                                                       |
