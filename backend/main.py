# pyre-ignore-all-errors
"""
CODE-SENSEI Backend — FastAPI Application
Slim API layer that delegates all analysis to the modular engine pipeline.
"""
import os
from fastapi import FastAPI, HTTPException  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from typing import List
from dotenv import load_dotenv

from engine.models import CodeAnalysisResult, AnalyzeRequest
from engine.pipeline import run_analysis

# Load environment variables
load_dotenv()

# ── App Setup ────────────────────────────────────────────────

app = FastAPI(title="CodeSensei Backend", version="2.0.0")

# Production-ready CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Analysis History (in-memory store) ───────────────────────

analysis_history: List[CodeAnalysisResult] = []

# ── Routes ───────────────────────────────────────────────────

@app.post("/analyze", response_model=CodeAnalysisResult)
async def analyze_code(request: AnalyzeRequest):
    """Run the full CODE-SENSEI analysis pipeline on submitted code."""
    try:
        result = run_analysis(request.code, request.language)
        analysis_history.append(result)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Engine Error: {str(e)}")


@app.get("/history", response_model=List[CodeAnalysisResult])
async def get_history():
    """Return all past analysis results."""
    return analysis_history


@app.delete("/history")
async def clear_history():
    """Clear all analysis history."""
    analysis_history.clear()
    return {"message": "History cleared"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "engine": "CODE-SENSEI v2.0 — Hybrid AST + AI Pipeline"}


# ── Entry Point ──────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn  # type: ignore
    # Use PORT from environment (for Render/Heroku/etc)
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)