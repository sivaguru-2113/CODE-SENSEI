# Contributing to CODE-SENSEI

Thank you for considering contributing to CODE-SENSEI! 🎉

## Development Setup

1. **Fork & clone** the repository
2. Follow the [Quick Start](README.md#-quick-start) guide to set up locally
3. Create a feature branch: `git checkout -b feature/your-feature`

## Project Structure

| Directory | What lives here |
|-----------|----------------|
| `app/` | Next.js pages (routes) |
| `components/landing/` | Landing page sections |
| `frontend/components/` | App components (editor, results, layout) |
| `frontend/hooks/` | Custom React hooks |
| `backend/engine/` | Python analysis pipeline modules |
| `vscode-extension/src/` | VS Code extension source |

## Guidelines

### Code Style
- **Frontend**: TypeScript, functional components, hooks-only
- **Backend**: Python 3.9+, type hints, Pydantic models
- **Commits**: Use conventional commit messages (`feat:`, `fix:`, `docs:`)

### Adding a New Pattern Rule
1. Open `backend/engine/patterns.py`
2. Add a new detection function following the existing pattern
3. Register it in the `RULES` list
4. Test with a code sample that triggers the rule

### Adding a New Frontend Page
1. Create `app/your-page/page.tsx`
2. Wrap content in `<DashboardLayout>`
3. Add a navigation link in `frontend/components/DashboardLayout.tsx`

## Pull Request Process

1. Ensure your code compiles (`npm run build` and `npx tsc`)
2. Test both frontend and backend
3. Update documentation if needed
4. Submit a PR with a clear description

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS/Python version
