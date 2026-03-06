import * as vscode from 'vscode';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import { ChildProcess, spawn } from 'child_process';

/**
 * Manages the backend connection.
 * Supports two modes:
 *   1. Remote: connects to a deployed backend URL (no local server needed)
 *   2. Local: spawns a local Python uvicorn process
 */
export class BackendManager {
    private process: ChildProcess | null = null;
    private port: number;
    private pythonPath: string;
    private backendDir: string;
    private remoteUrl: string;
    private outputChannel: vscode.OutputChannel;
    private _isReady = false;

    constructor(outputChannel: vscode.OutputChannel) {
        this.outputChannel = outputChannel;
        const config = vscode.workspace.getConfiguration('codeSensei');
        this.port = config.get('backendPort', 8777);
        this.pythonPath = config.get('pythonPath', 'python');
        this.remoteUrl = config.get('backendUrl', '');
        this.backendDir = path.join(path.dirname(path.dirname(__dirname)), 'backend');
    }

    get isReady(): boolean {
        return this._isReady;
    }

    /** Returns the active backend URL (remote if configured, otherwise local) */
    get baseUrl(): string {
        if (this.remoteUrl) {
            return this.remoteUrl.replace(/\/$/, ''); // strip trailing slash
        }
        return `http://127.0.0.1:${this.port}`;
    }

    get isRemote(): boolean {
        return !!this.remoteUrl;
    }

    /**
     * Connect to backend.
     * If a remote URL is configured, just health-check it.
     * Otherwise, try to start a local server.
     */
    async start(): Promise<boolean> {
        // --- Remote mode ---
        if (this.remoteUrl) {
            this.outputChannel.appendLine(`[Backend] Using remote: ${this.remoteUrl}`);
            if (await this.healthCheck()) {
                this._isReady = true;
                this.outputChannel.appendLine(`[Backend] Remote server is healthy!`);
                return true;
            } else {
                this.outputChannel.appendLine(`[Backend] Remote server not responding.`);
                return false;
            }
        }

        // --- Local mode ---
        // Check if already running
        if (await this.healthCheck()) {
            this._isReady = true;
            this.outputChannel.appendLine(`[Backend] Already running on port ${this.port}`);
            return true;
        }

        this.outputChannel.appendLine(`[Backend] Starting local server on port ${this.port}...`);
        this.outputChannel.appendLine(`[Backend] Python: ${this.pythonPath}`);
        this.outputChannel.appendLine(`[Backend] Directory: ${this.backendDir}`);

        try {
            this.process = spawn(
                this.pythonPath,
                ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', String(this.port)],
                {
                    cwd: this.backendDir,
                    stdio: ['ignore', 'pipe', 'pipe'],
                    shell: true,
                }
            );

            this.process.stdout?.on('data', (data: Buffer) => {
                this.outputChannel.appendLine(`[Backend] ${data.toString().trim()}`);
            });

            this.process.stderr?.on('data', (data: Buffer) => {
                this.outputChannel.appendLine(`[Backend] ${data.toString().trim()}`);
            });

            this.process.on('exit', (code) => {
                this.outputChannel.appendLine(`[Backend] Process exited with code ${code}`);
                this._isReady = false;
            });

            // Wait for server to be ready
            for (let i = 0; i < 30; i++) {
                await this.sleep(1000);
                if (await this.healthCheck()) {
                    this._isReady = true;
                    this.outputChannel.appendLine(`[Backend] Server ready!`);
                    return true;
                }
            }

            this.outputChannel.appendLine(`[Backend] Failed to start within 30 seconds`);
            return false;

        } catch (err: any) {
            this.outputChannel.appendLine(`[Backend] Spawn error: ${err.message}`);
            return false;
        }
    }

    async stop(): Promise<void> {
        if (this.process) {
            this.process.kill();
            this.process = null;
            this._isReady = false;
            this.outputChannel.appendLine(`[Backend] Stopped`);
        }
    }

    private healthCheck(): Promise<boolean> {
        const url = `${this.baseUrl}/health`;
        const isHttps = url.startsWith('https');
        const client = isHttps ? https : http;

        return new Promise((resolve) => {
            const req = client.get(url, (res) => {
                resolve(res.statusCode === 200);
            });
            req.on('error', () => resolve(false));
            req.setTimeout(5000, () => { req.destroy(); resolve(false); });
        });
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(r => setTimeout(r, ms));
    }
}
