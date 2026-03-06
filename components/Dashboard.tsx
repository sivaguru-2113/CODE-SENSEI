'use client'

import React, { useMemo } from 'react'
import { CodeAnalysisResult } from '../frontend/hooks/useCodeAnalysis'
import { getScoreColor } from '../frontend/utils/helpers'
import { AnimatedNumber } from './AnimatedNumber'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'

interface DashboardProps {
  results: CodeAnalysisResult[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f16]/95 backdrop-blur-md border border-[#1e1e2a] p-4 rounded-xl shadow-2xl">
        <p className="text-white font-tech font-bold text-sm mb-3 pb-2 border-b border-white/5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 mb-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-400 font-pixel text-[9px] uppercase tracking-widest flex-1">{entry.name}</span>
            <span className="text-white font-tech font-bold text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function Dashboard({ results }: DashboardProps) {
  const chartData = useMemo(() => {
    return [...results]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(r => ({
        date: format(new Date(r.timestamp), 'MMM dd, HH:mm'),
        score: r.finalScore,
        readability: r.metrics.readability,
        efficiency: r.metrics.efficiency
      }))
  }, [results])

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-[#12121a]/60 backdrop-blur-xl rounded-3xl border border-[#1e1e2a]">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <span className="text-slate-500 text-xl">📊</span>
        </div>
        <p className="text-sm font-tech font-bold text-white tracking-wide">NO ANALYSIS DATA</p>
        <p className="text-xs font-sans text-slate-500 mt-1">Start analyzing code to generate your progress graph</p>
      </div>
    )
  }

  const averageScore = Math.round(results.reduce((sum, r) => sum + r.finalScore, 0) / results.length)
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0)
  const criticalIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'critical').length, 0)
  const averageReadability = Math.round(results.reduce((sum, r) => sum + r.metrics.readability, 0) / results.length)

  return (
    <div className="space-y-6">
      {/* Dynamic Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Average Score Card */}
        <div className="bg-[#12121a]/60 backdrop-blur-xl hover:bg-[#1a1a25]/80 transition-colors rounded-2xl p-5 border border-[#1e1e2a] hover:border-[#00d4ff]/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00d4ff]/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00d4ff]/10" />
          <div className="text-[10px] text-slate-500 font-pixel uppercase tracking-widest font-bold mb-2">Avg Score</div>
          <div className={`text-4xl font-tech font-black ${getScoreColor(averageScore)}`}>
            <AnimatedNumber value={averageScore} />
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" /> {results.length} total sessions
          </div>
        </div>

        {/* Total Issues Card */}
        <div className="bg-[#12121a]/60 backdrop-blur-xl hover:bg-[#1a1a25]/80 transition-colors rounded-2xl p-5 border border-[#1e1e2a] hover:border-orange-500/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/10" />
          <div className="text-[10px] text-slate-500 font-pixel uppercase tracking-widest font-bold mb-2">Total Issues</div>
          <div className="text-4xl font-tech font-black text-orange-400">
            <AnimatedNumber value={totalIssues} />
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">Auto-detected</div>
        </div>

        {/* Critical Issues Card */}
        <div className="bg-[#12121a]/60 backdrop-blur-xl hover:bg-[#1a1a25]/80 transition-colors rounded-2xl p-5 border border-[#1e1e2a] hover:border-red-500/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/10" />
          <div className="text-[10px] text-slate-500 font-pixel uppercase tracking-widest font-bold mb-2">Critical Bugs</div>
          <div className="text-4xl font-tech font-black text-red-500">
            <AnimatedNumber value={criticalIssues} />
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">Needs attention</div>
        </div>

        {/* Avg Readability Card */}
        <div className="bg-[#12121a]/60 backdrop-blur-xl hover:bg-[#1a1a25]/80 transition-colors rounded-2xl p-5 border border-[#1e1e2a] hover:border-[#00ff88]/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff88]/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00ff88]/10" />
          <div className="text-[10px] text-slate-500 font-pixel uppercase tracking-widest font-bold mb-2">Readability</div>
          <div className="text-4xl font-tech font-black text-[#00ff88]">
            <AnimatedNumber value={averageReadability} />
            <span className="text-lg text-slate-500 ml-1">%</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 font-medium">Code clarity index</div>
        </div>
      </div>

      {/* Progress Graph */}
      {chartData.length > 1 && (
        <div className="bg-[#12121a]/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-[#1e1e2a]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-tech font-bold text-white tracking-tight">Performance Trajectory</h3>
              <p className="text-slate-400 font-sans text-sm mt-1">Track your coding progression across recent sessions</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00d4ff]" />
                <span className="text-[#00d4ff] font-pixel text-[9px] uppercase tracking-widest font-bold">Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88]" />
                <span className="text-[#00ff88] font-pixel text-[9px] uppercase tracking-widest font-bold">Efficiency</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2a" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)', stroke: '#1e1e2a', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Final Score"
                  stroke="#00d4ff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorScore)"
                  activeDot={{ r: 6, fill: "#00d4ff", stroke: "#12121a", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  name="Efficiency"
                  stroke="#00ff88"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEfficiency)"
                  activeDot={{ r: 6, fill: "#00ff88", stroke: "#12121a", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
