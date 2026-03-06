<div align="center">

# ⟨/⟩ CODE-SENSEI

### AI-Powered Code Mentor — Analyze, Learn, Master

[![License: MIT](https://img.shields.io/badge/License-MIT-00d4ff.svg)](LICENSE)
[![Python 3.x](https://img.shields.io/badge/Python-3.x-6366f1.svg)](https://python.org)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000.svg)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00ff88.svg)](https://fastapi.tiangolo.com)

**CODE-SENSEI** is a hybrid AST + AI code analysis platform that acts as your personal code mentor.
It analyzes your code structurally, detects patterns and anti-patterns, estimates Big-O complexity,
and generates AI-powered explanations — all in real time.

[Live Demo](#) · [VS Code Extension](#vs-code-extension) · [Documentation](#architecture)

</div>

---

## ✨ Features

- **🧠 7-Stage Analysis Pipeline** — Preprocessing → AST Parsing → Static Analysis → Complexity Detection → Pattern Matching → AI Explanation → Quality Scoring
- **📊 Big-O Complexity Estimation** — Automatic time and space complexity detection with algorithm recognition
- **🔍 12 Code Smell Rules** — Detects anti-patterns like sort-in-loop, mutable defaults, hardcoded credentials
- **🤖 AI-Powered Explanations** — Structured mentor-style explanations using Qwen3 Coder via OpenRouter
- **⭐ 5-Dimension Scoring** — Readability, Efficiency, Maintainability, Best Practices, Error Handling
- **7 Algorithm Detection** — Bubble Sort, Binary Search, Two-Pointer, DP, BFS, DFS, Sliding Window
- **🔌 VS Code Extension** — Use CODE-SENSEI directly in your editor with inline diagnostics
- **⚙️ Persistent Settings** — Font size, animations, compact mode, language preferences — all synced via localStorage

---

## 📁 Project Structure

```
CODE-SENSEI/
├── app/                          # Next.js App Router (Pages)
│   ├── layout.tsx                # Root layout + Providers
│   ├── page.tsx                  # Landing page
│   ├── analyze/page.tsx          # Code analysis workspace
│   ├── dashboard/page.tsx        # Analytics dashboard
│   ├── history/page.tsx          # Analysis history
│   └── settings/page.tsx         # User preferences
│
├── components/                   # UI Components
│   ├── landing/                  # Landing page sections (12 files)
│   └── *.tsx                     # Shared components
│
├── frontend/                     # App-level React modules
│   ├── components/               # App components (6 files)
│   ├── hooks/                    # Custom React hooks
│   └── utils/                    # Utility functions
│
├── backend/                      # Python Backend
│   ├── main.py                   # FastAPI routes
│   └── engine/                   # Analysis Engine (10 modules)
│       ├── pipeline.py           # Orchestrator
│       ├── preprocessor.py       # Code cleaning & language detection
│       ├── ast_parser.py         # AST analysis with 4 visitors
│       ├── static_analyzer.py    # Structural issues + algorithm detection
│       ├── complexity.py         # Big-O estimation
│       ├── patterns.py           # 12 code smell rules
│       ├── ai_explainer.py       # AI explanation via OpenRouter
│       ├── scorer.py             # 5-dimension weighted scoring
│       └── models.py             # Pydantic data models
│
└── vscode-extension/             # VS Code Extension
    ├── src/                      # Extension source (TypeScript)
    └── package.json              # Extension manifest
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.9+
- **OpenRouter API Key** ([get one free](https://openrouter.ai/keys))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/CODE-SENSEI.git
cd CODE-SENSEI
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
```

### 3. Set up the frontend

```bash
cd ..
npm install
```

### 4. Run both servers

```bash
# Terminal 1 — Backend (port 8000)
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2 — Frontend (port 3000)
npm run dev
```

### 5. Open the app

Visit **http://localhost:3000** → Navigate to **Analyze** → Paste code → Click **Analyze**

---

## 🔌 VS Code Extension

Use CODE-SENSEI directly inside VS Code without opening the web app.

### Install from VSIX

```bash
cd vscode-extension
npm install
npm run compile
npx @vscode/vsce package --allow-missing-repository
code --install-extension code-sensei-2.0.0.vsix
```

### Usage

- **`Ctrl+Shift+A`** — Analyze the current file
- **Sidebar** — Click the beaker icon to view results
- **Inline diagnostics** — Issues appear as underlines in the editor
- **Status bar** — Shows the score after analysis

### Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| `codeSensei.backendUrl` | Deployed backend URL (leave empty for local) | `""` |
| `codeSensei.backendPort` | Local backend port | `8777` |
| `codeSensei.autoAnalyze` | Auto-analyze on file save | `false` |

---

## 🏗️ Architecture

```
User Code → Preprocessor → AST Parser → Static Analyzer
         → Complexity Detector → Pattern Matcher
         → AI Explainer (OpenRouter) → Quality Scorer
         → Results API → Frontend / VS Code Extension
```

### Analysis Pipeline (7 Stages)

| Stage | Module | What it does |
|-------|--------|-------------|
| 1 | `preprocessor.py` | Language detection, comment stripping, syntax validation |
| 2 | `ast_parser.py` | Full AST with 4 node visitors (Python), regex fallback (others) |
| 3 | `static_analyzer.py` | Deep nesting, long functions, unused variables, algorithm recognition |
| 4 | `complexity.py` | Big-O time/space estimation from loop patterns |
| 5 | `patterns.py` | 12 code smell detection rules |
| 6 | `ai_explainer.py` | Structured AI explanations via Qwen3 Coder |
| 7 | `scorer.py` | 5-dimension weighted score (0–100) |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze` | Run full analysis pipeline |
| `GET` | `/history` | Get past analyses |
| `DELETE` | `/history` | Clear history |
| `GET` | `/health` | Server health check |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, Monaco Editor |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic v2 |
| **AI** | OpenRouter API, Qwen3 Coder (free tier) |
| **Extension** | VS Code Extension API, TypeScript |

---

## 🌐 Deployment

### Frontend (Vercel)

```bash
npm run build
# Deploy to Vercel via GitHub integration
```

### Backend (Render)

1. Push `backend/` to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Build: `pip install -r requirements.txt`
4. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add `OPENROUTER_API_KEY` to environment variables

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ by the CODE-SENSEI team**

⭐ Star this repo if CODE-SENSEI helped you write better code!

</div>
