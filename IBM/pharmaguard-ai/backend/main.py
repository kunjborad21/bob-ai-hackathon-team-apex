from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import signals, dossier

app = FastAPI(
    title="PharmaGuard AI",
    description="Drug Safety Signal Detector & Regulatory Submission Readiness Checker",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(signals.router, prefix="/api/signals", tags=["Signal Detection"])
app.include_router(dossier.router, prefix="/api/dossier", tags=["Submission Readiness"])


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "app": "PharmaGuard AI"}
