# Demo

This directory contains all demo artefacts for the PharmaGuard AI hackathon submission.

---

## Contents

| File / Directory | Description |
|---|---|
| `demo-video-link.txt` | Link to the recorded walkthrough video |
| `live-demo-url.txt` | URL of the live deployment (if available) |
| `screenshots/` | Annotated screenshots of the working application |
| `screenshots/README.md` | Guide for which screenshots to capture |

---

## How to Run the Demo Locally

### Prerequisites
- Python 3.11+, Node.js 18+

### 1 — Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2 — Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3 — Open the App
Navigate to **http://localhost:3000**

---

## Demo Script

### Signal Detection
1. Select **DrugAlpha** from the drug selector and click **Analyse**.
2. Observe **Nausea** flagged as a **High** signal (PRR ≈ 5.0, χ² well above 4.0).
3. Scroll down to the **Cluster View** — 4 clusters are shown, the largest being GI-dominant.
4. Click **Explain** on the Nausea row — the explainability panel shows rate comparison and the Evans criteria checklist.
5. Switch to **DrugBeta** and observe the **Cardiac disorders** cluster and Tachycardia signal.

### Submission Readiness
1. Navigate to **Submission Readiness** via the top navigation bar.
2. The overall completeness score for the sample dossier is shown (~45%).
3. Module 3 (Quality) and Module 5 (Clinical) show the lowest scores.
4. The **Gap Report** table lists all missing sections sorted Critical → Major → Minor.
5. Click **Recommendations** for any module to see actionable guidance for each gap.

---

## Seeded Demo Signals (Synthetic Data)

| Drug | Event | PRR | Signal Strength |
|---|---|---|---|
| DrugAlpha | Nausea | ≈ 5.00 | High |
| DrugAlpha | Vomiting | ≈ 4.21 | Medium |
| DrugBeta | Tachycardia | ≈ 3.73 | Medium |
| DrugBeta | Palpitations | ≈ 3.29 | Medium |

---

## Placeholder Notice

> **`demo-video-link.txt`** and **`live-demo-url.txt`** currently contain placeholder values.
> Replace them with your actual video and deployment URLs before final submission.
>
> **`screenshots/`** currently contains no images.
> Add screenshots as described in `screenshots/README.md` before final submission.
