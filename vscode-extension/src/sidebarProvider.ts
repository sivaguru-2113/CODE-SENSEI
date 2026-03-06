import * as vscode from 'vscode';
import { CodeAnalysisResult } from './analysisClient';

/**
 * Provides the webview sidebar panel that shows analysis results.
 * Styled to match the web app's dark theme with score ring, metrics, issues, and AI explanation.
 */
export class SidebarProvider implements vscode.WebviewViewProvider {
    public static readonly viewId = 'code-sensei.resultsView';

    private _view?: vscode.WebviewView;
    private _lastResult?: CodeAnalysisResult;

    constructor(private readonly extensionUri: vscode.Uri) { }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken
    ): void {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = this.getHtml();
    }

    /** Show loading state */
    showLoading(): void {
        if (this._view) {
            this._view.webview.html = this.getHtml(undefined, true);
            this._view.show?.(true);
        }
    }

    /** Update the panel with new analysis results */
    showResults(result: CodeAnalysisResult): void {
        this._lastResult = result;
        if (this._view) {
            this._view.webview.html = this.getHtml(result, false);
            this._view.show?.(true);
        }
    }

    /** Show error state */
    showError(message: string): void {
        if (this._view) {
            this._view.webview.html = this.getHtml(undefined, false, message);
        }
    }

    /** Generate the full webview HTML */
    private getHtml(result?: CodeAnalysisResult, loading = false, error?: string): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0d0d14;
    color: #e2e8f0;
    padding: 16px;
    font-size: 12px;
    line-height: 1.5;
  }
  .header {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 1px solid #1e1e2a;
  }
  .header h1 {
    font-size: 14px; font-weight: 700; color: #fff;
    letter-spacing: 0.5px;
  }
  .header .dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #00ff88;
    box-shadow: 0 0 8px rgba(0,255,136,0.5);
  }

  /* Score Ring */
  .score-container {
    display: flex; align-items: center; gap: 16px;
    padding: 16px; border-radius: 16px;
    border: 1px solid #1e1e2a;
    background: linear-gradient(135deg, rgba(0,212,255,0.05), rgba(99,102,241,0.05));
    margin-bottom: 12px;
  }
  .score-ring { position: relative; width: 72px; height: 72px; flex-shrink: 0; }
  .score-ring svg { transform: rotate(-90deg); }
  .score-ring .value {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .score-ring .value .num { font-size: 20px; font-weight: 800; }
  .score-ring .value .label { font-size: 9px; color: #94a3b8; margin-top: 1px; }
  .score-info { flex: 1; }
  .score-info .grade { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
  .score-info .lang { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }

  /* Cards */
  .card {
    border-radius: 14px; border: 1px solid #1e1e2a;
    background: #12121a; padding: 14px; margin-bottom: 10px;
  }
  .card-title {
    font-size: 11px; font-weight: 600; color: #fff;
    margin-bottom: 10px; display: flex; align-items: center; gap: 6px;
  }
  .card-title .icon { color: #00d4ff; font-size: 13px; }

  /* Metric bars */
  .metric { margin-bottom: 8px; }
  .metric-header {
    display: flex; justify-content: space-between;
    font-size: 10px; margin-bottom: 4px;
  }
  .metric-header .name { color: #94a3b8; text-transform: capitalize; }
  .metric-header .val { font-weight: 700; }
  .metric-bar { height: 6px; border-radius: 3px; background: #1e1e2a; overflow: hidden; }
  .metric-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }

  /* Complexity grid */
  .complexity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .complexity-item {
    padding: 10px; border-radius: 10px;
    border: 1px solid #1e1e2a; background: #0d0d14;
  }
  .complexity-item .label { font-size: 9px; color: #64748b; margin-bottom: 4px; }
  .complexity-item .value { font-size: 18px; font-weight: 800; font-family: monospace; }

  /* Issues */
  .issue {
    padding: 10px; border-radius: 10px; margin-bottom: 8px;
    border-left: 3px solid; background: rgba(0,0,0,0.2);
  }
  .issue.critical { border-color: #f87171; background: rgba(248,113,113,0.05); }
  .issue.warning { border-color: #facc15; background: rgba(250,204,21,0.05); }
  .issue.info { border-color: #00d4ff; background: rgba(0,212,255,0.05); }
  .issue .sev { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .issue.critical .sev { color: #f87171; }
  .issue.warning .sev { color: #facc15; }
  .issue.info .sev { color: #00d4ff; }
  .issue .desc { font-size: 11px; color: #e2e8f0; margin-bottom: 4px; }
  .issue .suggestion { font-size: 10px; color: #94a3b8; }
  .issue .suggestion::before { content: '💡 '; }

  /* AI Explanation */
  .explanation {
    border-radius: 14px; padding: 14px;
    border: 1px solid rgba(99,102,241,0.25);
    background: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(0,212,255,0.03));
    margin-bottom: 10px;
  }
  .explanation .exp-header {
    display: flex; align-items: center; gap: 6px; margin-bottom: 10px; cursor: pointer;
  }
  .explanation .badge {
    margin-left: auto; padding: 2px 8px; border-radius: 99px; font-size: 9px; font-weight: 700;
    background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.25); color: #a78bfa;
  }
  .explanation .section {
    padding: 10px; border-radius: 10px; margin-bottom: 8px;
    border: 1px solid #1e1e2a; font-size: 11px; line-height: 1.6;
    white-space: pre-wrap;
  }
  .explanation .section.complexity-sec { border-color: rgba(0,212,255,0.2); background: rgba(0,212,255,0.04); }
  .explanation .section.issues-sec { border-color: rgba(250,204,21,0.2); background: rgba(250,204,21,0.04); }
  .explanation .section.tip-sec { border-color: rgba(0,255,136,0.2); background: rgba(0,255,136,0.04); }

  /* Loading */
  .loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 60px 20px; text-align: center;
  }
  .spinner {
    width: 32px; height: 32px; border-radius: 50%;
    border: 3px solid #1e1e2a; border-top-color: #00d4ff;
    animation: spin 0.8s linear infinite; margin-bottom: 12px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Empty */
  .empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 60px 20px; text-align: center; color: #64748b;
  }
  .empty .icon { font-size: 36px; margin-bottom: 12px; opacity: 0.4; }
  .empty .hint { font-size: 11px; margin-top: 8px; color: #475569; }
  .empty .shortcut {
    display: inline-block; padding: 2px 8px; border-radius: 6px;
    background: #1e1e2a; color: #00d4ff; font-family: monospace; font-size: 10px;
    margin-top: 4px;
  }

  /* Error */
  .error { padding: 20px; text-align: center; color: #f87171; }
</style>
</head>
<body>
  <div class="header">
    <div class="dot"></div>
    <h1>CODE-SENSEI</h1>
  </div>
  ${loading ? this.loadingHtml() : error ? this.errorHtml(error) : result ? this.resultHtml(result) : this.emptyHtml()}
</body>
</html>`;
    }

    private loadingHtml(): string {
        return `<div class="loading"><div class="spinner"></div><div>Analyzing code...</div></div>`;
    }

    private emptyHtml(): string {
        return `<div class="empty">
            <div class="icon">⟨/⟩</div>
            <div>No analysis yet</div>
            <div class="hint">Open a file and press</div>
            <div class="shortcut">Ctrl+Shift+A</div>
        </div>`;
    }

    private errorHtml(msg: string): string {
        return `<div class="error">⚠ ${msg}</div>`;
    }

    private resultHtml(r: CodeAnalysisResult): string {
        const col = this.scoreColor(r.finalScore);
        const circumference = 2 * Math.PI * 28;
        const offset = circumference - (r.finalScore / 100) * circumference;

        // Split explanation into sections
        const sections = r.explanation.split(/(?=📋|⏱️|⚠️|💡)/).filter((s: string) => s.trim());

        return `
            <!-- Score -->
            <div class="score-container">
                <div class="score-ring">
                    <svg width="72" height="72" viewBox="0 0 72 72">
                        <circle cx="36" cy="36" r="28" fill="none" stroke="#1e1e2a" stroke-width="5"/>
                        <circle cx="36" cy="36" r="28" fill="none" stroke="${col.ring}"
                            stroke-width="5" stroke-linecap="round"
                            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
                    </svg>
                    <div class="value">
                        <span class="num" style="color:${col.ring}">${r.finalScore}</span>
                        <span class="label">/100</span>
                    </div>
                </div>
                <div class="score-info">
                    <div class="grade" style="color:${col.ring}">${col.label}</div>
                    <div class="lang">${r.language} • ${r.issues.length} issue${r.issues.length !== 1 ? 's' : ''}</div>
                </div>
            </div>

            <!-- Complexity -->
            <div class="card">
                <div class="card-title"><span class="icon">📊</span> Complexity</div>
                <div class="complexity-grid">
                    <div class="complexity-item">
                        <div class="label">⏱ Time</div>
                        <div class="value" style="color:${this.complexityColor(r.complexity.timeComplexity)}">${r.complexity.timeComplexity}</div>
                    </div>
                    <div class="complexity-item">
                        <div class="label">💾 Space</div>
                        <div class="value" style="color:${this.complexityColor(r.complexity.spaceComplexity)}">${r.complexity.spaceComplexity}</div>
                    </div>
                    <div class="complexity-item">
                        <div class="label">🔁 Loops</div>
                        <div class="value" style="color:#00d4ff">${r.complexity.loopCount}</div>
                    </div>
                    <div class="complexity-item">
                        <div class="label">📐 Depth</div>
                        <div class="value" style="color:${r.complexity.nestingDepth > 3 ? '#facc15' : '#00d4ff'}">${r.complexity.nestingDepth}</div>
                    </div>
                </div>
            </div>

            <!-- Metrics -->
            <div class="card">
                <div class="card-title"><span class="icon">📈</span> Code Metrics</div>
                ${Object.entries(r.metrics).map(([k, v]) => this.metricBarHtml(k, v as number)).join('')}
            </div>

            <!-- Issues -->
            ${r.issues.length > 0 ? `
            <div class="card" style="background:transparent;border:none;padding:0;">
                <div class="card-title" style="padding: 0 0 6px 0;"><span class="icon">⚠</span> Issues (${r.issues.length})</div>
                ${r.issues.map(issue => `
                    <div class="issue ${issue.severity}">
                        <div class="sev">${issue.severity} · Line ${issue.lineNumber}</div>
                        <div class="desc">${this.escapeHtml(issue.description)}</div>
                        ${issue.suggestion ? `<div class="suggestion">${this.escapeHtml(issue.suggestion)}</div>` : ''}
                    </div>
                `).join('')}
            </div>` : ''}

            <!-- AI Explanation -->
            <div class="explanation">
                <div class="exp-header">
                    <span style="font-size:13px;">🧠</span>
                    <span style="font-size:11px;font-weight:600;color:#fff;">AI Explanation</span>
                    <span class="badge">SENSEI</span>
                </div>
                ${sections.map((sec: string) => {
            const trimmed = sec.trim();
            let cls = '';
            if (trimmed.startsWith('⏱️')) { cls = 'complexity-sec'; }
            if (trimmed.startsWith('⚠️')) { cls = 'issues-sec'; }
            if (trimmed.startsWith('💡')) { cls = 'tip-sec'; }
            return `<div class="section ${cls}">${this.escapeHtml(trimmed)}</div>`;
        }).join('')}
            </div>
        `;
    }

    private metricBarHtml(name: string, value: number): string {
        const color = value >= 85 ? '#00ff88' : value >= 65 ? '#00d4ff' : value >= 40 ? '#facc15' : '#f87171';
        return `<div class="metric">
            <div class="metric-header">
                <span class="name">${name.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span class="val" style="color:${color}">${value}</span>
            </div>
            <div class="metric-bar"><div class="metric-bar-fill" style="width:${value}%;background:${color};"></div></div>
        </div>`;
    }

    private scoreColor(s: number): { ring: string; label: string } {
        if (s >= 85) { return { ring: '#00ff88', label: 'Excellent' }; }
        if (s >= 70) { return { ring: '#00d4ff', label: 'Good' }; }
        if (s >= 50) { return { ring: '#facc15', label: 'Fair' }; }
        return { ring: '#f87171', label: 'Needs Work' };
    }

    private complexityColor(c: string): string {
        if (c === 'O(1)' || c === 'O(log n)') { return '#00ff88'; }
        if (c === 'O(n)' || c === 'O(n log n)') { return '#00d4ff'; }
        if (c === 'O(n²)') { return '#facc15'; }
        return '#f87171';
    }

    private escapeHtml(text: string): string {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}
