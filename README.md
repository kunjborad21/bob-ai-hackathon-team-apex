# 🚀 PharmaGuard AI

> ⚠️ **Hackathon prototype:** All adverse-event and regulatory dossier data used by this project is synthetic.

---

## 👥 Team

| Field         | Value                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| **Team Name** | Team Apex                                                                |
| **Track**     | AI                                                                       |
| **Team Lead** | Kunj Borad — [25dcs013@charusat.edu.in](mailto:25dcs013@charusat.edu.in) |
| **Members**   | Parva Jadav, Shreyansh Kavad, Krish Vaghasiya                            |

---

## 🎯 Problem Statement

Pharmacovigilance teams need to identify potential drug safety signals from adverse-event reports, while regulatory teams need to check whether submission dossiers are complete and ready for review. These tasks can require analyzing large amounts of information and identifying important gaps efficiently.

PharmaGuard AI addresses these challenges by combining drug safety signal detection with regulatory submission readiness checking in one web-based prototype.

---

## 💡 Solution

PharmaGuard AI is a web-based application with two main modules: **Signal Detection** and **Submission Readiness**. The Signal Detection module uses PRR analysis, K-Means clustering, ranking, and explainability to identify potential drug-event safety signals, while the Submission Readiness module checks an ICH M4-based CTD structure for missing sections and provides recommendations.

The prototype uses synthetic data for demonstration and testing.

---

## ✨ Key Features

* **Signal Detection:** Identifies potential drug-event safety signals using Proportional Reporting Ratio (PRR).
* **K-Means Clustering:** Groups drug-event patterns to support signal analysis.
* **Signal Ranking:** Ranks detected signals based on their strength.
* **Explainability:** Provides supporting information for individual drug-event signals.
* **Submission Readiness:** Checks the completeness of an ICH M4-based CTD dossier.
* **Gap Reporting:** Shows missing or incomplete sections with severity information.
* **Recommendations:** Provides AI-assisted recommendations for identified submission gaps.
* **Interactive Dashboard:** React-based interface for exploring results.

---

## 🛠️ Tech Stack

| Category             | Technologies                                                                   |
| -------------------- | ------------------------------------------------------------------------------ |
| **Languages**        | Python, JavaScript                                                             |
| **Frameworks**       | FastAPI, React, Vite                                                           |
| **IBM Technologies** | IBM Bob                                                                        |
| **Databases**        | JSON-based synthetic data                                                      |
| **Other**            | REST API, K-Means, PRR Statistical Analysis, ICH M4 CTD Schema, GitHub Actions |

---

## 📁 Repository Structure

```text
├── src/                  # All source code
│   ├── backend/          # FastAPI backend and analysis engines
│   ├── frontend/         # React + Vite frontend
│   ├── .env.example      # Environment variable template
│   └── README.md         # Source code documentation
├── docs/                 # Written documentation
│   ├── problem-statement.md
│   ├── solution-overview.md
│   ├── architecture.md
│   └── setup-guide.md
├── demo/                 # Demo artifacts
│   ├── screenshots/      # App screenshots
│   ├── demo-video-link.txt
│   └── live-demo-url.txt
├── presentation/         # Slide deck
├── submission.yaml       # Structured submission metadata
├── CONTRIBUTING.md
└── .gitignore
```

---

## ⚡ How to Run

> **See [`docs/setup-guide.md`](docs/setup-guide.md) for the complete setup instructions.**

### Backend

```bash
cd src/backend
py -m pip install -r requirements.txt
py -m uvicorn main:app --reload --port 8000
```

### Frontend

Open a separate terminal:

```bash
cd src/frontend
npm install
npm run dev
```

The application will be available at:

```text
http://localhost:3000/
```

Backend API:

```text
http://localhost:8000
```

### Running Tests

```bash
cd src/backend
py -m pytest tests/ -v
```

The current backend test suite contains **62 passing tests**.

---

## 🖥️ Demo

| Artifact        | Link                                                     |
| --------------- | -------------------------------------------------------- |
| 📹 Demo Video   | [See demo/demo-video-link.txt](demo/demo-video-link.txt) |
| 🌐 Live Demo    | [See demo/live-demo-url.txt](demo/live-demo-url.txt)     |
| 🖼️ Screenshots | [See demo/screenshots/](demo/screenshots/)               |
| 📊 Presentation | [See presentation/](presentation/)                       |

> Demo links will be added before final submission.

---

## ⚠️ Known Limitations

* The adverse-event data is synthetic and does not represent real-world pharmacovigilance data.
* The regulatory dossier data is synthetic and does not represent an actual regulatory submission.
* PRR identifies statistical associations and does not establish causality.
* The prototype is not intended for clinical, diagnostic, pharmacovigilance, or regulatory decision-making without appropriate expert review.
* The current prototype does not replace expert regulatory or pharmacovigilance assessment.

---

## 🏅 What We're Most Proud Of

We are most proud of combining two related but different challenges—**drug safety signal detection and regulatory submission readiness**—into one interactive prototype. The project combines PRR-based statistical analysis, clustering, explainability, and ICH M4-based dossier checking into a single workflow while keeping the demonstration reproducible through synthetic data.

---
