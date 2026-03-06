'use client'

import React from 'react'
import { CodeAnalysisResult } from '../frontend/hooks/useCodeAnalysis'

interface AnalysisResultsProps {
  result: CodeAnalysisResult | null
  loading?: boolean
}

export function AnalysisResults({ result, loading }: AnalysisResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin">⚙️</div>
          <p className="mt-2 text-slate-400">Analyzing code...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg text-slate-300 mb-2">📊 No Analysis Yet</p>
          <p className="text-sm text-slate-400">Write code and click Analyze to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-4 p-4">
      {/* Score Card */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold mb-2">Code Quality Score</h2>
            <p className="text-slate-400 text-sm">Overall assessment of your code</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {result.finalScore}
            </div>
            <div className="text-xs text-slate-400">/ 100</div>
          </div>
        </div>
      </div>

      {/* Complexity */}
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
        <h3 className="text-white font-semibold text-sm mb-3">Complexity Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">Time</div>
            <div className="text-purple-400 font-mono text-lg font-semibold">{result.complexity.timeComplexity}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">Space</div>
            <div className="text-purple-400 font-mono text-lg font-semibold">{result.complexity.spaceComplexity}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">Nesting</div>
            <div className="text-blue-400 font-semibold">{result.complexity.nestingDepth}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">Loops</div>
            <div className="text-blue-400 font-semibold">{result.complexity.loopCount}</div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
        <h3 className="text-white font-semibold text-sm mb-3">Code Metrics</h3>
        <div className="space-y-2">
          {Object.entries(result.metrics).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-slate-300 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-purple-400 font-semibold text-sm min-w-[2rem] text-right">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues */}
      {result.issues.length > 0 && (
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <h3 className="text-white font-semibold text-sm mb-3">Issues Found ({result.issues.length})</h3>
          <div className="space-y-3">
            {result.issues.map(issue => (
              <div key={issue.id} className={`border-l-4 pl-3 py-2 rounded ${
                issue.severity === 'critical' ? 'border-red-500 bg-red-900/20' :
                issue.severity === 'warning' ? 'border-yellow-500 bg-yellow-900/20' :
                'border-blue-500 bg-blue-900/20'
              }`}>
                <div className="flex items-start justify-between mb-1">
                  <div className={`font-semibold text-sm ${
                    issue.severity === 'critical' ? 'text-red-400' :
                    issue.severity === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    {issue.description}
                  </div>
                  <div className="text-xs text-slate-400">Line {issue.lineNumber}</div>
                </div>
                <div className="text-slate-300 text-xs">💡 {issue.suggestion}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Explanation */}
      <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-lg p-4 border border-purple-500/20">
        <h3 className="text-white font-semibold text-sm mb-3">AI Explanation</h3>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
      </div>
    </div>
  )
}
