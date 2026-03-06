'use client'

import React from 'react'
import { CodeAnalysisResult } from '../hooks/useCodeAnalysis'
import { getScoreColor } from '../utils/helpers'

interface DashboardProps {
  results: CodeAnalysisResult[]
}

export function Dashboard({ results }: DashboardProps) {
  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg text-slate-300">📊 No Analysis Data</p>
          <p className="text-sm text-slate-400 mt-2">Start analyzing code to see statistics</p>
        </div>
      </div>
    )
  }

  const averageScore = Math.round(results.reduce((sum, r) => sum + r.finalScore, 0) / results.length)
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0)
  const criticalIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'critical').length, 0)
  const averageReadability = Math.round(results.reduce((sum, r) => sum + r.metrics.readability, 0) / results.length)

  return (
    <div className="grid grid-cols-4 gap-4 p-6 bg-gradient-to-br from-slate-900 to-slate-950">
      {/* Average Score Card */}
      <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-purple-500/20">
        <div className="text-sm text-slate-400 mb-2">Average Score</div>
        <div className={`text-4xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}</div>
        <div className="text-xs text-slate-400 mt-2">{results.length} analyses</div>
      </div>

      {/* Total Issues Card */}
      <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-lg p-6 border border-orange-500/20">
        <div className="text-sm text-slate-400 mb-2">Total Issues</div>
        <div className="text-4xl font-bold text-orange-400">{totalIssues}</div>
        <div className="text-xs text-slate-400 mt-2">{criticalIssues} critical</div>
      </div>

      {/* Critical Issues Card */}
      <div className="bg-gradient-to-br from-red-900/50 to-pink-900/50 rounded-lg p-6 border border-red-500/20">
        <div className="text-sm text-slate-400 mb-2">Critical Issues</div>
        <div className="text-4xl font-bold text-red-400">{criticalIssues}</div>
        <div className="text-xs text-slate-400 mt-2">Needs attention</div>
      </div>

      {/* Avg Readability Card */}
      <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg p-6 border border-green-500/20">
        <div className="text-sm text-slate-400 mb-2">Avg Readability</div>
        <div className="text-4xl font-bold text-green-400">{averageReadability}</div>
        <div className="text-xs text-slate-400 mt-2">Out of 100</div>
      </div>
    </div>
  )
}
