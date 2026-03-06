import * as vscode from 'vscode';
import { CodeAnalysisResult } from './analysisClient';

/**
 * Converts CODE-SENSEI issues into VS Code diagnostics (inline underlines).
 */
export class DiagnosticsManager {
    private collection: vscode.DiagnosticCollection;

    constructor() {
        this.collection = vscode.languages.createDiagnosticCollection('code-sensei');
    }

    /**
     * Push analysis issues as diagnostics for the given document.
     */
    update(document: vscode.TextDocument, result: CodeAnalysisResult): void {
        const diagnostics: vscode.Diagnostic[] = [];

        for (const issue of result.issues) {
            const line = Math.max(0, (issue.lineNumber || 1) - 1);
            const lineText = line < document.lineCount ? document.lineAt(line).text : '';

            const range = new vscode.Range(
                line, 0,
                line, lineText.length
            );

            const severity = this.mapSeverity(issue.severity);
            const diag = new vscode.Diagnostic(range, issue.description, severity);
            diag.source = 'CODE-SENSEI';
            diag.code = issue.type;

            // Add suggestion as a related hint
            if (issue.suggestion) {
                diag.message += `\n💡 ${issue.suggestion}`;
            }

            diagnostics.push(diag);
        }

        this.collection.set(document.uri, diagnostics);
    }

    clear(document?: vscode.TextDocument): void {
        if (document) {
            this.collection.delete(document.uri);
        } else {
            this.collection.clear();
        }
    }

    dispose(): void {
        this.collection.dispose();
    }

    private mapSeverity(severity: string): vscode.DiagnosticSeverity {
        switch (severity) {
            case 'critical': return vscode.DiagnosticSeverity.Error;
            case 'warning': return vscode.DiagnosticSeverity.Warning;
            case 'info': return vscode.DiagnosticSeverity.Information;
            default: return vscode.DiagnosticSeverity.Hint;
        }
    }
}
