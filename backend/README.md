# CODE-SENSEI Backend

FastAPI-powered analysis engine with a 7-stage modular pipeline.

## Setup

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
```

## Run

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

API docs available at: **http://127.0.0.1:8000/docs**

## Engine Modules

| Module | Stage | Purpose |
|--------|-------|---------|
| `preprocessor.py` | 1 | Language detection, comment stripping, syntax validation |
| `ast_parser.py` | 2 | AST analysis with 4 visitors (Python) / regex (others) |
| `static_analyzer.py` | 3 | Structural issues + 7 algorithm recognitions |
| `complexity.py` | 4 | Big-O time/space estimation |
| `patterns.py` | 5 | 12 code smell detection rules |
| `ai_explainer.py` | 6 | AI explanation via OpenRouter (Qwen3 Coder) |
| `scorer.py` | 7 | 5-dimension weighted quality score |
| `pipeline.py` | — | Orchestrator that chains all stages |
| `models.py` | — | Pydantic data models |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/analyze` | Analyze code (body: `{ "code": "...", "language": "python" }`) |
| `GET` | `/history` | Get past analysis results |
| `DELETE` | `/history` | Clear analysis history |
| `GET` | `/health` | Health check |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENROUTER_API_KEY` | Yes | — | OpenRouter API key |
| `AI_MODEL_NAME` | No | `qwen/qwen3-coder:free` | AI model to use |
| `SITE_URL` | No | `http://localhost:3000` | Site URL for OpenRouter |
| `SITE_NAME` | No | `CODE-SENSEI` | Site name for OpenRouter |
