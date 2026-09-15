# Solution Overview

## What We Built

PharmaGuard AI is a web-based prototype that combines **drug safety signal detection** and **regulatory submission readiness checking** in one dashboard.

It helps users analyze synthetic adverse-event reports, identify potentially important drug-event associations, understand why a signal was detected, and check a synthetic ICH M4 CTD dossier for missing or incomplete sections.

The system has two main areas:

* **Signal Detection:** Uses PRR statistical analysis, clustering, ranking, and explainability to investigate potential drug-safety signals.
* **Submission Readiness:** Checks the completeness of CTD Modules 1–5, identifies gaps by severity, and provides AI-assisted recommendations.

All data used by the prototype is synthetic.

## How It Works

1. The user opens the PharmaGuard AI web application and selects either Signal Detection or Submission Readiness.
2. In Signal Detection, the system analyzes synthetic adverse-event reports and calculates the **Proportional Reporting Ratio (PRR)** for drug-event pairs.
3. Potential signals are ranked using their signal strength, and clustering is used to group related patterns.
4. The user can select an individual drug-event pair to view an explanation of the detected signal.
5. In Submission Readiness, the system checks a synthetic ICH M4 CTD dossier against its defined section structure.
6. The system calculates completeness scores for Modules 1–5 and identifies missing or incomplete sections.
7. Gaps are organized by severity and AI-assisted recommendations are provided to help the user understand what needs attention.
8. The results are displayed through the React dashboard and are provided by the FastAPI backend.

## Architecture Diagram

> See [`architecture.md`](architecture.md) for the detailed diagram.

```text
[User]
   ↓
[React/Vite Frontend]
   ↓
[FastAPI Backend]
   ├──→ [PRR Engine]
   ├──→ [Clustering Engine]
   ├──→ [Explainability Engine]
   ├──→ [CTD Checker]
   └──→ [Recommendation Engine]
          ↓
   [Synthetic Data + ICH M4 Schema]
          ↓
      [Dashboard Results]
```

## Key Design Decisions

| Decision                                  | Rationale                                                                                                                                      |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Use PRR for signal detection              | PRR provides a simple statistical method for identifying potential drug-event associations from adverse-event reports.                         |
| Use clustering for signal analysis        | Clustering helps group patterns in the safety data and provides another way to explore the detected signals.                                   |
| Add explainability for individual signals | Users should be able to understand the statistical information behind a detected drug-event signal instead of seeing only a score.             |
| Use a structured ICH M4 schema            | A defined CTD structure allows the prototype to check whether expected sections are present and identify documentation gaps.                   |
| Separate the frontend and backend         | React/Vite provides the dashboard interface while FastAPI handles analysis and API requests, making the prototype easier to organize and test. |

## IBM Technologies Used

* **IBM Bob:** Used extensively during development to assist with the project architecture, synthetic data generation, PRR signal-detection implementation, clustering, explainability, ICH M4 schema and CTD checking, recommendation logic, React components, API integration, testing, and documentation.

* **IBM Bob AI Hackathon environment:** The project was developed as a hackathon prototype using IBM Bob as the AI-assisted development tool.

> Note: The current project implementation does not claim to use watsonx.ai or another IBM AI service unless it is actually present in the source code. The IBM technology section should describe the technologies that were genuinely used.
