'use client'

import React, { Suspense, lazy, useState, useEffect } from 'react'
import { useCodeAnalysis } from '../hooks/useCodeAnalysis'
import { AnalysisResults } from './AnalysisResults'
import { useSettings } from './SettingsContext'
import {
  Play, Trash2, History, AlertTriangle, Loader2, FileCode2,
  TrendingUp, X, Clock
} from 'lucide-react'

const Editor = lazy(() =>
  import('@monaco-editor/react').then(m => ({ default: m.Editor }))
)

const LANGS = [
  { value: 'javascript', label: 'JavaScript', ext: '.js' },
  { value: 'typescript', label: 'TypeScript', ext: '.ts' },
  { value: 'python', label: 'Python', ext: '.py' },
  { value: 'java', label: 'Java', ext: '.java' },
  { value: 'cpp', label: 'C++', ext: '.cpp' },
  { value: 'rust', label: 'Rust', ext: '.rs' },
  { value: 'go', label: 'Go', ext: '.go' },
]

const DEFAULT_CODE = `// Write your code here — try pasting any algorithm!
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`

/* ── History item ────────────────────────────────────────── */
function HistoryItem({
  item, onSelect,
}: {
  item: { finalScore: number; language: string; timestamp: number; id: string }
  onSelect: () => void
}) {
  const score = item.finalScore
  const col = score >= 85 ? 'text-[#00ff88]' : score >= 70 ? 'text-[#00d4ff]' : score >= 50 ? 'text-yellow-400' : 'text-red-400'
  const dt = new Date(item.timestamp > 1e10 ? item.timestamp : item.timestamp * 1000)
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left group"
    >
      <div className="w-8 h-8 rounded-lg bg-[#12121a] border border-[#1e1e2a] flex items-center justify-center shrink-0">
        <FileCode2 size={13} className="text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-300 font-medium truncate capitalize">{item.language}</div>
        <div className="text-[10px] text-slate-600">{dt.toLocaleTimeString()}</div>
      </div>
      <span className={`text-xs font-bold shrink-0 ${col}`}>{score}</span>
    </button>
  )
}

export function CodeEditorPanel() {
  const { settings } = useSettings()
  const [code, setCode] = useState(DEFAULT_CODE)
  const [lang, setLang] = useState(settings.defaultLanguage || 'javascript')
  const [histOpen, setHistOpen] = useState(false)

  // Sync default language from settings
  useEffect(() => {
    if (settings.defaultLanguage && !code.trim() || code === DEFAULT_CODE) {
      setLang(settings.defaultLanguage)
    }
  }, [settings.defaultLanguage])

  const { result, loading, error, analyzeCode, clearHistory, history } = useCodeAnalysis()

  const ext = LANGS.find(l => l.value === lang)?.ext ?? '.js'
  const lines = code.split('\n').length

  const handleAnalyze = () => { if (code.trim()) analyzeCode(code, lang) }

  return (
    <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden bg-[#0a0a0f]">
      {/* ── Workspace row ─────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Panel 1 — Editor */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden border-r border-[#1e1e2a]">
          {/* Editor tab bar */}
          <div className="flex items-center gap-3 px-4 h-12 border-b border-[#1e1e2a] bg-[#12121a] shrink-0">
            <div className="flex gap-1.5 items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl bg-[#0a0a0f] border-x border-t border-[#1e1e2a] -mb-px shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.5)]">
              <FileCode2 size={13} className="text-[#00d4ff] drop-shadow-[0_0_5px_rgba(0,212,255,0.3)]" />
              <span className="text-sm text-slate-200 font-mono tracking-tight font-medium">main{ext}</span>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <select
                value={lang}
                onChange={e => setLang(e.target.value)}
                className="bg-[#1a1a25] border border-[#2a2a3a] text-slate-300 text-[11px] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00d4ff]/40 cursor-pointer hover:bg-[#20202e] transition-colors"
              >
                {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>

              <button
                onClick={handleAnalyze}
                disabled={loading || !code.trim()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#00d4ff] to-[#6366f1] text-black text-[11px] font-bold rounded-lg disabled:opacity-50 hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} className="fill-black" />}
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {/* Monaco */}
          <div className="flex-1 min-h-0 bg-[#0a0a0f]">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full text-slate-500 text-xs gap-3">
                <div className="w-5 h-5 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
                Loading editor...
              </div>
            }>
              <Editor
                height="100%"
                language={lang}
                value={code}
                onChange={v => setCode(v || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: parseInt(settings.fontSize) || 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  wordWrap: 'on',
                  lineNumbers: settings.showLineNumbers ? 'on' : 'off',
                  padding: { top: 20, bottom: 20 },
                  renderLineHighlight: 'all',
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                  contextmenu: false,
                  roundedSelection: true,
                  scrollbar: {
                    vertical: 'hidden',
                    horizontalScrollbarSize: 8
                  }
                }}
              />
            </Suspense>
          </div>

          {/* Error bar */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs shrink-0 font-medium">
              <AlertTriangle size={14} />
              <span className="flex-1">{error}</span>
            </div>
          )}
        </div>

        {/* Panel 2 — Results */}
        <div
          className="flex flex-col shrink-0 overflow-hidden border-r border-[#1e1e2a] bg-[#0d0d14]/30 backdrop-blur-sm"
          style={{ width: '450px' }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 h-12 border-b border-[#1e1e2a] bg-[#12121a] shrink-0">
            <div className="flex items-center gap-2.5">
              <TrendingUp size={14} className="text-[#00d4ff]" />
              <span className="text-sm font-bold text-white tracking-tight">Analysis Results</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHistOpen(!histOpen)}
                className="p-2 text-slate-500 hover:text-white transition-colors relative"
              >
                <History size={16} />
                {history.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#6366f1] rounded-full border border-[#12121a]" />
                )}
              </button>
              <button
                onClick={clearHistory}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                title="Clear Results"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable results */}
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-none hover:scrollbar-thin">
            <AnalysisResults result={result} loading={loading} />
          </div>

          {/* Footer Info (Localized) */}
          <div className="px-4 py-2.5 border-t border-[#1e1e2a] bg-[#12121a]/50 flex items-center justify-between text-[10px] text-slate-500 shrink-0 font-mono">
            <span>{lang.toUpperCase()} · v1.0.4</span>
            <span className="flex items-center gap-1.5 text-[#00ff88]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" /> SYSTEM READY
            </span>
          </div>
        </div>

        {/* Panel 3 — History drawer (slide-in) */}
        {histOpen && (
          <div className="flex flex-col w-64 shrink-0 border-l border-[#1e1e2a] bg-[#0d0d14] overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-4 h-12 border-b border-[#1e1e2a] bg-[#12121a] shrink-0">
              <div className="flex items-center gap-2.5">
                <Clock size={14} className="text-[#6366f1]" />
                <span className="text-sm font-bold text-white tracking-tight">Recent Activity</span>
              </div>
              <button onClick={() => setHistOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 min-h-0 space-y-2 scrollbar-thin">
              {history.length === 0
                ? <div className="flex flex-col items-center justify-center h-40 text-slate-600">
                  <History size={32} className="opacity-20 mb-3" />
                  <p className="text-xs">No analysis history</p>
                </div>
                : history.map(h => (
                  <HistoryItem
                    key={h.id}
                    item={h}
                    onSelect={() => { /* logic to load history */ }}
                  />
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
