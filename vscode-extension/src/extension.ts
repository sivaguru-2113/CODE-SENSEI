import * as vscode from 'vscode';
import { BackendManager } from './backendManager';
import { AnalysisClient } from './analysisClient';
import { SidebarProvider } from './sidebarProvider';
import { DiagnosticsManager } from './diagnosticsManager';

/** Map VS Code language IDs to engine-supported language names */
const LANG_MAP: Record<string, string> = {
    python: 'python',
    javascript: 'javascript',
    typescript: 'typescript',
    java: 'java',
    cpp: 'cpp',
    c: 'cpp',
    go: 'go',
    rust: 'rust',
};

let backend: BackendManager;
let client: AnalysisClient;
let sidebar: SidebarProvider;
let diagnosticsManager: DiagnosticsManager;
let statusBarItem: vscode.StatusBarItem;
let outputChannel: vscode.OutputChannel;

export async function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('CODE-SENSEI');
    outputChannel.appendLine('CODE-SENSEI extension activating...');

    // ── Backend ──────────────────────────────────────────
    backend = new BackendManager(outputChannel);
    const started = await backend.start();

    if (started) {
        outputChannel.appendLine('Backend is ready.');
    } else {
        outputChannel.appendLine('Backend failed to start. Some features may not work.');
        vscode.window.showWarningMessage(
            'CODE-SENSEI: Backend failed to start. Make sure Python and dependencies are installed.'
        );
    }

    client = new AnalysisClient(backend.baseUrl);

    // ── Sidebar Webview ──────────────────────────────────
    sidebar = new SidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(SidebarProvider.viewId, sidebar)
    );

    // ── Diagnostics ──────────────────────────────────────
    diagnosticsManager = new DiagnosticsManager();
    context.subscriptions.push(diagnosticsManager as any);

    // ── Status Bar ───────────────────────────────────────
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '$(beaker) SENSEI';
    statusBarItem.tooltip = 'CODE-SENSEI: Click to analyze current file';
    statusBarItem.command = 'code-sensei.analyzeFile';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // ── Commands ─────────────────────────────────────────

    // Analyze current file
    context.subscriptions.push(
        vscode.commands.registerCommand('code-sensei.analyzeFile', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('CODE-SENSEI: No active file to analyze.');
                return;
            }
            await analyzeCode(editor.document.getText(), editor.document);
        })
    );

    // Analyze selection
    context.subscriptions.push(
        vscode.commands.registerCommand('code-sensei.analyzeSelection', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.selection.isEmpty) {
                vscode.window.showWarningMessage('CODE-SENSEI: No text selected.');
                return;
            }
            const selected = editor.document.getText(editor.selection);
            await analyzeCode(selected, editor.document);
        })
    );

    // Show panel
    context.subscriptions.push(
        vscode.commands.registerCommand('code-sensei.showPanel', () => {
            vscode.commands.executeCommand('code-sensei.resultsView.focus');
        })
    );

    // ── Auto-analyze on save (if enabled) ────────────────
    const config = vscode.workspace.getConfiguration('codeSensei');
    if (config.get('autoAnalyze', false)) {
        context.subscriptions.push(
            vscode.workspace.onDidSaveTextDocument(async (doc) => {
                const langId = doc.languageId;
                if (LANG_MAP[langId]) {
                    await analyzeCode(doc.getText(), doc);
                }
            })
        );
    }

    outputChannel.appendLine('CODE-SENSEI extension activated!');
}

/**
 * Core analysis flow — called by all commands.
 */
async function analyzeCode(code: string, document: vscode.TextDocument): Promise<void> {
    const language = LANG_MAP[document.languageId];
    if (!language) {
        vscode.window.showInformationMessage(
            `CODE-SENSEI: Language "${document.languageId}" is not supported. Supported: ${Object.keys(LANG_MAP).join(', ')}`
        );
        return;
    }

    if (!backend.isReady) {
        const retry = await backend.start();
        if (!retry) {
            vscode.window.showErrorMessage('CODE-SENSEI: Backend is not available.');
            return;
        }
    }

    // Show loading
    statusBarItem.text = '$(loading~spin) Analyzing...';
    sidebar.showLoading();

    try {
        const result = await client.analyze(code, language);

        // Update sidebar
        sidebar.showResults(result);

        // Update diagnostics (inline underlines)
        diagnosticsManager.update(document, result);

        // Update status bar with score
        const emoji = result.finalScore >= 85 ? '✨' : result.finalScore >= 70 ? '👍' : result.finalScore >= 50 ? '⚡' : '🔴';
        statusBarItem.text = `$(beaker) SENSEI ${emoji} ${result.finalScore}`;
        statusBarItem.tooltip = `CODE-SENSEI: Score ${result.finalScore}/100 · ${result.issues.length} issues · ${result.complexity.timeComplexity}`;

        outputChannel.appendLine(`Analysis complete: Score ${result.finalScore}/100, ${result.issues.length} issues, ${result.complexity.timeComplexity}`);

    } catch (err: any) {
        statusBarItem.text = '$(beaker) SENSEI';
        sidebar.showError(err.message || 'Analysis failed');
        vscode.window.showErrorMessage(`CODE-SENSEI: ${err.message}`);
        outputChannel.appendLine(`Analysis error: ${err.message}`);
    }
}

export function deactivate() {
    backend?.stop();
    outputChannel?.appendLine('CODE-SENSEI deactivated.');
}
