# CODE-SENSEI VS Code Extension

Analyze code directly inside VS Code with the full CODE-SENSEI pipeline.

## Features

- **🚀 Instant Analysis** (`Ctrl+Shift+A`) — Analyze the current file through the 7-stage pipeline.
- **📊 Interactive Sidebar** — Real-time score ring, 5-dimension metrics, and 12-rule pattern matching.
- **🤖 AI Mentorship** — Get structured explanations and fix suggestions directly in your IDE.
- **🔍 Inline Squiggles** — See code smells and anti-patterns highlighed in the editor (Diagnostics).
- **📉 Live Status Bar** — Transparent health score of your code visible at all times.

## Installation (.vsix)

1. Ensure you have **Node.js** and **npm** installed.
2. Build the extension:
   ```bash
   npm install
   npm run compile
   ```
3. Package it:
   ```bash
   npx @vscode/vsce package --allow-missing-repository
   ```
4. Install in VS Code:
   ```bash
   code --install-extension code-sensei-2.0.0.vsix
   ```

## Development

1. Open this folder in VS Code
2. Press **F5** to launch Extension Development Host
3. Edit `src/*.ts`, the `watch` task auto-recompiles

## Configuration

Open VS Code Settings (`Ctrl+,`) and search `codeSensei`:

| Setting | Description | Default |
|---------|-------------|---------|
| `codeSensei.backendUrl` | Deployed backend URL | `""` (uses local) |
| `codeSensei.backendPort` | Local backend port | `8777` |
| `codeSensei.pythonPath` | Python executable path | `python` |
| `codeSensei.autoAnalyze` | Auto-analyze on save | `false` |

## Supported Languages

Python, JavaScript, TypeScript, Java, C++, Go, Rust
