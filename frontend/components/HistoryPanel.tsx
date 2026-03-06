'use client'

import React from 'react'
import { CodeAnalysisResult } from '../hooks/useCodeAnalysis'

interface HistoryPanelProps {
  history: CodeAnalysisResult[]
  onSelect?: (result: CodeAnalysisResult) => void
  onClear?: () => void
}

export function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col h-full bg-slate-800/50 rounded-xl border border-purple-500/20 backdrop-blur-xl">
      <div className="p-4 border-b border-purple-500/20 bg-slate-800/80 flex justify-between items-center">
        <div>
          <h2 className="text-white font-semibold">Analysis History</h2>
          <p className="text-sm text-slate-400">{history.length} analyses</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs px-2 py-1 rounded bg-red-900/50 text-red-400 hover:bg-red-900/70 transition"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 p-3">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            No analyses yet
          </div>
        ) : (
          history.map((result) => (
            <button
              key={result.id}
              onClick={() => onSelect?.(result)}
              className="w-full text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-purple-500/50 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-semibold text-slate-300">
                  Score: <span className="text-purple-400">{result.finalScore}/100</span>
                </div>
                <div className="text-xs text-slate-500">{formatDate(result.timestamp)}</div>
              </div>
              <div className="text-xs text-slate-400 mb-2">
                {result.complexity.timeComplexity} • {result.issues.length} issues
              </div>
              <div className="text-xs text-slate-500 truncate">
                {result.code.substring(0, 50)}...
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
