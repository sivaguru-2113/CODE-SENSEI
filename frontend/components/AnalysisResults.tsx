'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodeAnalysisResult } from '../hooks/useCodeAnalysis'
import { useSettings } from './SettingsContext'
import {
  AlertTriangle, AlertCircle, Info, Lightbulb,
  TrendingUp, Clock, Database, Layers, RefreshCw,
  ThumbsUp, Brain, ChevronRight, ChevronDown, Zap
} from 'lucide-react'

interface Props { result: CodeAnalysisResult | null; loading?: boolean }

/* ── AI Explanation Panel (Collapsible) ──────────────────── */
function AIExplanationPanel({ explanation }: { explanation: string }) {
  const [expanded, setExpanded] = useState(false)

  // Split explanation into sections by emoji headers
  const sections = explanation.split(/(?=📋|⏱️|⚠️|💡)/).filter(s => s.trim())
  const previewSection = sections[0] || explanation.slice(0, 120) + '...'
  const remainingSections = sections.slice(1)
  const hasStructuredSections = sections.length > 1

  return (
    <div className="rounded-2xl border border-[#6366f1]/25 bg-gradient-to-br from-[#6366f1]/8 to-[#00d4ff]/5 overflow-hidden">
      {/* Header — always visible, clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 p-4 pb-3 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <Brain size={14} className="text-[#a78bfa] shrink-0" />
        <h3 className="text-white font-semibold text-sm">AI Explanation</h3>
        <span className="ml-auto flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-[#6366f1]/15 border border-[#6366f1]/25 text-[#a78bfa] text-[10px] font-semibold">
            SENSEI
          </span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ChevronDown size={14} className="text-[#a78bfa]" />
          </motion.span>
        </span>
      </button>

      {/* Preview — always visible */}
      <div className="px-4 pb-2">
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
          {previewSection.trim()}
        </p>
      </div>

      {/* Expanded content — smooth reveal */}
      <AnimatePresence>
        {expanded && hasStructuredSections && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-[#6366f1]/10 pt-3 mt-1">
              {remainingSections.map((section, i) => {
                const trimmed = section.trim()
                // Determine section styling
                let borderColor = 'border-slate-700/50'
                let bgColor = 'bg-transparent'
                if (trimmed.startsWith('⏱️')) { borderColor = 'border-[#00d4ff]/20'; bgColor = 'bg-[#00d4ff]/5' }
                if (trimmed.startsWith('⚠️')) { borderColor = 'border-yellow-500/20'; bgColor = 'bg-yellow-500/5' }
                if (trimmed.startsWith('💡')) { borderColor = 'border-[#00ff88]/20'; bgColor = 'bg-[#00ff88]/5' }

                return (
                  <motion.div
                    key={i}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className={`rounded-xl border ${borderColor} ${bgColor} p-3`}
                  >
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {trimmed}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* If no structured sections, show full text when expanded */}
      <AnimatePresence>
        {expanded && !hasStructuredSections && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-[#6366f1]/10 pt-3 mt-1">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand hint */}
      {!expanded && hasStructuredSections && (
        <div className="px-4 pb-3">
          <button
            onClick={() => setExpanded(true)}
            className="text-[#a78bfa] text-xs hover:text-[#c4b5fd] transition-colors flex items-center gap-1 cursor-pointer"
          >
            Click to see full analysis
            <ChevronDown size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Helpers ─────────────────────────────────────────────── */
function scoreColor(s: number) {
  if (s >= 85) return { text: 'text-[#00ff88]', ring: '#00ff88', bg: 'from-[#00ff88]/15 to-[#00d4ff]/10', label: 'Excellent' }
  if (s >= 70) return { text: 'text-[#00d4ff]', ring: '#00d4ff', bg: 'from-[#00d4ff]/15 to-[#6366f1]/10', label: 'Good' }
  if (s >= 50) return { text: 'text-yellow-400', ring: '#facc15', bg: 'from-yellow-500/15 to-orange-500/10', label: 'Fair' }
  return { text: 'text-red-400', ring: '#f87171', bg: 'from-red-500/15 to-orange-500/10', label: 'Needs Work' }
}

function metricColor(v: number) {
  if (v >= 85) return 'from-[#00ff88] to-[#00d4ff]'
  if (v >= 65) return 'from-[#00d4ff] to-[#6366f1]'
  if (v >= 40) return 'from-yellow-400 to-orange-400'
  return 'from-red-500 to-orange-500'
}

function complexityRisk(c: string) {
  if (c.includes('n³') || c.includes('n²')) return { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' }
  if (c.includes('n log') || c.includes('log')) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' }
  return { color: 'text-[#00ff88]', bg: 'bg-[#00ff88]/10 border-[#00ff88]/30' }
}

/* ── SVG Score Ring ──────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const R = 52, C = 2 * Math.PI * R
  const filled = (score / 100) * C
  const col = scoreColor(score)
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" className="shrink-0">
      <circle cx="65" cy="65" r={R} fill="none" stroke="#1e1e2a" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={R} fill="none"
        stroke={col.ring} strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${C}`}
        strokeDashoffset={C / 4}
        style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 8px ${col.ring}55)` }}
      />
      <text x="65" y="60" textAnchor="middle" className="fill-white font-bold" fontSize="26" fontWeight="800" fill="white">{score}</text>
      <text x="65" y="78" textAnchor="middle" fontSize="10" fill="#6b7280">/100</text>
    </svg>
  )
}

/* ── Metric Bar ──────────────────────────────────────────── */
function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-xs text-slate-400 capitalize shrink-0">{label.replace(/([A-Z])/g, ' $1').trim()}</span>
      <div className="flex-1 h-2 bg-[#1e1e2a] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${metricColor(value)} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-7 text-right ${value >= 80 ? 'text-[#00ff88]' : value >= 60 ? 'text-[#00d4ff]' : 'text-yellow-400'}`}>{value}</span>
    </div>
  )
}

/* ── Issue Card ──────────────────────────────────────────── */
function IssueCard({ issue }: { issue: CodeAnalysisResult['issues'][0] }) {
  const cfg = {
    critical: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/8 border-red-500/25', bar: 'bg-red-500' },
    warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/8 border-yellow-500/25', bar: 'bg-yellow-400' },
    info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/8 border-blue-500/25', bar: 'bg-blue-400' },
  }[issue.severity]
  const Icon = cfg.icon
  return (
    <div className={`relative flex gap-3 p-3 rounded-xl border ${cfg.bg} overflow-hidden`}>
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg.bar}`} />
      <Icon size={14} className={`${cfg.color} shrink-0 mt-0.5`} />
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className={`text-xs font-bold uppercase tracking-wide ${cfg.color}`}>{issue.severity}</span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-slate-500 text-xs font-mono">Line {issue.lineNumber}</span>
        </div>
        <p className="text-slate-200 text-sm font-medium mb-1.5">{issue.description}</p>
        <div className="flex items-start gap-1.5 text-xs text-slate-400">
          <Lightbulb size={11} className="text-yellow-400 shrink-0 mt-0.5" />
          <span>{issue.suggestion}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Loading skeleton ────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="flex gap-4 items-center p-4 rounded-2xl bg-[#12121a] border border-[#1e1e2a]">
        <div className="w-32 h-32 rounded-full bg-[#1e1e2a]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#1e1e2a] rounded w-3/4" />
          <div className="h-3 bg-[#1e1e2a] rounded w-1/2" />
          <div className="h-8 bg-[#1e1e2a] rounded-lg w-24 mt-3" />
        </div>
      </div>
      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-[#12121a] rounded-xl border border-[#1e1e2a]" />)}
      <div className="h-32 bg-[#12121a] rounded-xl border border-[#1e1e2a]" />
    </div>
  )
}

/* ── Empty state ─────────────────────────────────────────── */
function Empty() {
  const hints = [
    'Paste any JavaScript, Python, Rust, or Go code',
    'Click ▶ Analyze and results appear in seconds',
    'See your score, complexity, and improvement tips',
  ]
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4ff]/20 to-[#6366f1]/20 border border-[#00d4ff]/20 flex items-center justify-center mb-5">
        <Zap size={28} className="text-[#00d4ff]" />
      </div>
      <h3 className="text-white font-bold text-lg mb-2">Ready to Analyze</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-[220px]">Paste your code in the editor and click Analyze to get instant feedback.</p>
      <ul className="text-left space-y-2.5 w-full max-w-[240px]">
        {hints.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
            <ChevronRight size={12} className="text-[#00d4ff] mt-0.5 shrink-0" />
            {h}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Main Component ──────────────────────────────────────── */
export function AnalysisResults({ result, loading }: Props) {
  if (loading) return <Skeleton />
  if (!result) return <Empty />

  const col = scoreColor(result.finalScore)
  const { settings } = useSettings()
  const issuesBySev = {
    critical: result.issues.filter(i => i.severity === 'critical'),
    warning: result.issues.filter(i => i.severity === 'warning'),
    info: result.issues.filter(i => i.severity === 'info'),
  }
  const timeRisk = complexityRisk(result.complexity.timeComplexity)
  const spaceRisk = complexityRisk(result.complexity.spaceComplexity)

  const improvements = result.issues
    .filter(i => i.severity !== 'info')
    .map(i => i.suggestion)
    .slice(0, 3)

  return (
    <div className="p-4 space-y-4">

      {/* ── Score Card ──────────────────────────────── */}
      <div className={`flex items-center gap-5 p-4 rounded-2xl border border-[#1e1e2a] bg-gradient-to-br ${col.bg} bg-[#12121a]`}>
        <ScoreRing score={result.finalScore} />
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Code Quality Score</p>
          <h2 className={`text-3xl font-black ${col.text} mb-1`}>{col.label}</h2>
          <p className="text-slate-400 text-xs mb-3">
            Analyzed <span className="text-white font-mono">{result.language}</span> · {new Date(result.timestamp * 1000 || result.timestamp).toLocaleTimeString()}
          </p>
          {/* Issue badges */}
          <div className="flex flex-wrap gap-1.5">
            {issuesBySev.critical.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-semibold">
                <AlertCircle size={9} /> {issuesBySev.critical.length} critical
              </span>
            )}
            {issuesBySev.warning.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/25 text-yellow-400 text-xs font-semibold">
                <AlertTriangle size={9} /> {issuesBySev.warning.length} warning
              </span>
            )}
            {issuesBySev.info.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-semibold">
                <Info size={9} /> {issuesBySev.info.length} info
              </span>
            )}
            {result.issues.length === 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00ff88]/15 border border-[#00ff88]/25 text-[#00ff88] text-xs font-semibold">
                <ThumbsUp size={9} /> No issues!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Complexity Analysis ──────────────────────── */}
      {settings.showComplexityAnalysis && (
        <div className="rounded-2xl border border-[#1e1e2a] bg-[#12121a] p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-[#00d4ff]" />
            <h3 className="text-white font-semibold text-sm">Complexity Analysis</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Time */}
            <div className={`flex flex-col gap-1 p-3 rounded-xl border ${timeRisk.bg}`}>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Clock size={10} /> Time Complexity
              </div>
              <span className={`font-mono font-bold text-xl ${timeRisk.color}`}>{result.complexity.timeComplexity}</span>
            </div>
            {/* Space */}
            <div className={`flex flex-col gap-1 p-3 rounded-xl border ${spaceRisk.bg}`}>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Database size={10} /> Space Complexity
              </div>
              <span className={`font-mono font-bold text-xl ${spaceRisk.color}`}>{result.complexity.spaceComplexity}</span>
            </div>
            {/* Nesting */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0d0d14] border border-[#1e1e2a]">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Layers size={10} /> Nesting Depth
              </div>
              <span className={`font-bold text-sm ${result.complexity.nestingDepth > 3 ? 'text-orange-400' : 'text-[#00d4ff]'}`}>
                {result.complexity.nestingDepth}
              </span>
            </div>
            {/* Loops */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0d0d14] border border-[#1e1e2a]">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <RefreshCw size={10} /> Loop Count
              </div>
              <span className={`font-bold text-sm ${result.complexity.loopCount > 2 ? 'text-orange-400' : 'text-[#00d4ff]'}`}>
                {result.complexity.loopCount}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Code Metrics ────────────────────────────── */}
      <div className="rounded-2xl border border-[#1e1e2a] bg-[#12121a] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={14} className="text-[#6366f1]" />
          <h3 className="text-white font-semibold text-sm">Code Metrics</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(result.metrics).map(([k, v]) => (
            <MetricBar key={k} label={k} value={v as number} />
          ))}
        </div>
      </div>

      {/* ── Issues ──────────────────────────────────── */}
      {result.issues.length > 0 && (
        <div className="rounded-2xl border border-[#1e1e2a] bg-[#12121a] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-yellow-400" />
              <h3 className="text-white font-semibold text-sm">Issues Found</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#1e1e2a] text-slate-400 text-xs font-semibold">{result.issues.length}</span>
          </div>
          <div className="space-y-2">
            {result.issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
          </div>
        </div>
      )}

      {/* ── Improvement Suggestions ──────────────────── */}
      {improvements.length > 0 && (
        <div className="rounded-2xl border border-[#00d4ff]/20 bg-gradient-to-br from-[#00d4ff]/5 to-[#6366f1]/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={14} className="text-yellow-400" />
            <h3 className="text-white font-semibold text-sm">Improvement Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {improvements.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="shrink-0 w-5 h-5 rounded-full bg-[#00d4ff]/15 border border-[#00d4ff]/25 flex items-center justify-center text-[#00d4ff] text-[10px] font-bold mt-0.5">{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── AI Explanation (Collapsible) ─────────────── */}
      <AIExplanationPanel explanation={result.explanation} />

    </div>
  )
}
