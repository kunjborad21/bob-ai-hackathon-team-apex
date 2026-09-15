# Screenshots

Place application screenshots in this directory before submission.

## Recommended Screenshots

Capture at least the following views to give reviewers a clear picture of the application:

| Filename (suggested) | What to capture |
|---|---|
| `01-signal-detection-table.png` | Signal Detection page — PRR results table with DrugAlpha selected, showing Nausea as a High signal |
| `02-signal-detection-chart.png` | Signal Detection page — PRR horizontal bar chart |
| `03-cluster-view.png` | Signal Detection page — K-Means cluster cards and pie chart for DrugAlpha |
| `04-explain-panel.png` | Signal Detection page — explainability panel for DrugAlpha / Nausea |
| `05-submission-readiness-overview.png` | Submission Readiness page — module score gauges and overall completeness score |
| `06-gap-report.png` | Submission Readiness page — gap report table filtered to Critical gaps |
| `07-recommendations.png` | Submission Readiness page — recommendation panel for Module 3 (Quality) |

## How to Capture

1. Start the backend: `cd backend && uvicorn main:app --reload --port 8000`
2. Start the frontend: `cd frontend && npm run dev`
3. Open `http://localhost:3000` in your browser
4. Navigate to each view and take a screenshot
5. Save files into this `demo/screenshots/` directory using the suggested filenames above

## Placeholder Notice

> **This directory currently contains no screenshots.**
> Screenshots must be added manually before final submission.
