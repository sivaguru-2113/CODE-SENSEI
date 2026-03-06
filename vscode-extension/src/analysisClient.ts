import * as http from 'http';
import * as https from 'https';

/** Mirrors the backend's CodeAnalysisResult */
export interface CodeAnalysisResult {
    id: string;
    code: string;
    language: string;
    complexity: {
        timeComplexity: string;
        spaceComplexity: string;
        loopCount: number;
        nestingDepth: number;
    };
    metrics: {
        readability: number;
        efficiency: number;
        maintainability: number;
        bestPractices: number;
        errorHandling: number;
    };
    issues: Array<{
        id: string;
        type: string;
        lineNumber: number;
        severity: string;
        description: string;
        suggestion: string;
    }>;
    finalScore: number;
    explanation: string;
    timestamp: number;
}

/**
 * HTTP/HTTPS client for the CODE-SENSEI backend API.
 */
export class AnalysisClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Send code to the backend for full pipeline analysis.
     */
    async analyze(code: string, language: string): Promise<CodeAnalysisResult> {
        const body = JSON.stringify({ code, language });

        return new Promise((resolve, reject) => {
            const url = new URL(`${this.baseUrl}/api/analyze`);
            const isHttps = url.protocol === 'https:';
            const client = isHttps ? https : http;

            const req = client.request(
                {
                    hostname: url.hostname,
                    port: url.port || (isHttps ? 443 : 80),
                    path: url.pathname,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(body),
                    },
                },
                (res) => {
                    let data = '';
                    res.on('data', (chunk) => { data += chunk; });
                    res.on('end', () => {
                        try {
                            if (res.statusCode === 200) {
                                resolve(JSON.parse(data));
                            } else {
                                reject(new Error(`Backend error ${res.statusCode}: ${data}`));
                            }
                        } catch (e) {
                            reject(new Error(`Parse error: ${data}`));
                        }
                    });
                }
            );

            req.on('error', (err) => reject(err));
            req.setTimeout(60000, () => { req.destroy(); reject(new Error('Request timeout (60s)')); });
            req.write(body);
            req.end();
        });
    }
}
