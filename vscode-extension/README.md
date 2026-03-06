# CODE-SENSEI VS Code Extension

Analyze code directly inside VS Code with the full CODE-SENSEI pipeline.

## Features

- **Ctrl+Shift+A** — Analyze the current file
- **Sidebar panel** — Score ring, metrics, issues, AI explanation
- **Inline diagnostics** — Issues as squiggly underlines in the editor
- **Status bar** — Live score after analysis
- **Auto-analyze on save** — Optional

## Install from Source

```bash
npm install
npm run compile
npx @vscode/vsce package --allow-missing-repository
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
