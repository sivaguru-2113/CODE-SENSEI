'use client'

import React, { useState } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useCodeAnalysis, type CodeAnalysisResult } from '@/hooks/useCodeAnalysis'
import { formatDate } from '@/utils/helpers'
import { Trash2, ChevronRight, FileCode2, Clock, Search, History, Filter } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HistoryPage() {
  const { history, clearHistory } = useCodeAnalysis()
  const [selectedItem, setSelectedItem] = useState<CodeAnalysisResult | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  }

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 py-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                <History size={18} className="text-[#6366f1]" />
              </div>
              <h1 className="text-3xl font-tech font-bold text-white tracking-tight">Analysis History</h1>
            </div>
            <p className="text-slate-400 font-sans text-sm mt-2">Review your past code performance and AI recommendations</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-xl border border-red-500/20 transition-all"
            >
              Clear All Data
            </button>
          )}
        </motion.div>

        {history.length === 0 ? (
          <motion.div variants={itemVariants} className="bg-[#12121a]/60 backdrop-blur-xl rounded-2xl p-16 text-center border border-[#1e1e2a] shadow-inner">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <History size={24} className="text-slate-500" />
            </div>
            <h3 className="text-white font-bold mb-2">No History Yet</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">Your code analysis history will appear here once you've completed your first session.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {history.map((result) => (
              <motion.div
                key={result.id}
                variants={itemVariants}
                onClick={() => setSelectedItem(selectedItem?.id === result.id ? null : result)}
                className={`group bg-[#12121a]/60 backdrop-blur-xl hover:bg-[#1a1a25]/80 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${selectedItem?.id === result.id ? 'border-[#00d4ff]/50 shadow-[0_0_20px_rgba(0,212,255,0.1)]' : 'border-[#1e1e2a] hover:border-[#00d4ff]/40'
                  }`}
              >
                {/* Score Left Bar Indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${result.finalScore >= 80 ? 'bg-[#00ff88]' : 'bg-[#00d4ff]'}`} />

                <div className="p-5 flex flex-wrap lg:flex-nowrap items-center gap-6">
                  {/* Score */}
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex flex-col items-center justify-center group-hover:bg-[#00d4ff]/10 transition-colors">
                    <span className={`text-2xl font-tech font-black ${result.finalScore >= 80 ? 'text-[#00ff88]' : 'text-[#00d4ff]'}`}>{result.finalScore}</span>
                    <span className="text-[8px] font-pixel tracking-widest font-bold text-slate-500 uppercase mt-1">Score</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-pixel tracking-widest text-slate-500">{formatDate(result.timestamp)}</span>
                      <span className="text-[9px] bg-[#6366f1]/20 text-[#6366f1] px-2 py-0.5 rounded-full font-tech font-bold uppercase tracking-widest">{result.complexity.timeComplexity}</span>
                    </div>
                    <h3 className="text-white font-tech font-bold text-[15px] group-hover:text-[#00d4ff] transition-colors">Code Analysis Session</h3>
                  </div>

                  {/* Metrics Hub */}
                  <div className="flex items-center gap-8 px-6 border-l border-r border-[#1e1e2a] hidden md:flex">
                    <div className="text-center">
                      <div className="text-slate-500 font-pixel text-[9px] font-bold uppercase tracking-widest mb-2">Metrics</div>
                      <div className="flex items-center gap-5">
                        <div className="flex flex-col">
                          <span className="text-[#00d4ff] font-tech text-sm font-bold">{result.metrics.readability}%</span>
                          <span className="text-slate-600 font-pixel text-[8px] tracking-widest mt-1 uppercase">Readability</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#00ff88] font-tech text-sm font-bold">{result.metrics.efficiency}%</span>
                          <span className="text-slate-600 font-pixel text-[8px] tracking-widest mt-1 uppercase">Efficiency</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="ml-auto flex items-center gap-3">
                    <button className={`p-2 rounded-full transition-all ${selectedItem?.id === result.id ? 'bg-[#00d4ff] text-black rotate-90' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {selectedItem?.id === result.id && (
                  <div className="p-6 border-t border-[#1e1e2a] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Summary */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-[10px] font-pixel font-bold text-slate-500 uppercase tracking-widest mb-3">AI Contextual Analysis</h4>
                          <p className="text-sm font-sans text-slate-300 leading-relaxed font-medium bg-white/[0.02] p-4 rounded-2xl border border-white/5">{result.explanation}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="flex-1 py-3 px-4 rounded-xl bg-[#00d4ff] text-black font-bold text-xs hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all">Reload in Editor</button>
                          <button className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">Download Report</button>
                        </div>
                      </div>

                      {/* Top Issues */}
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-pixel font-bold text-slate-500 uppercase tracking-widest mb-3">Key Improvement Vectors</h4>
                        <div className="space-y-3">
                          {result.issues.length > 0 ? (
                            result.issues.slice(0, 3).map((issue: any) => (
                              <div key={issue.id} className="p-4 rounded-2xl bg-[#0d0d14] border border-[#1e1e2a] hover:border-[#00d4ff]/20 transition-all group/issue">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`w-2 h-2 rounded-full ${issue.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                                  <span className="text-[11px] font-tech font-bold text-white uppercase tracking-tight">{issue.type || 'Optimization'}</span>
                                </div>
                                <div className="text-slate-300 font-sans text-sm mb-2">{issue.description}</div>
                                <div className="text-[11px] text-[#00d4ff] italic flex items-center gap-1.5 opacity-80 group-hover/issue:opacity-100 transition-opacity">
                                  <ChevronRight size={10} /> Suggestion: {issue.suggestion}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 rounded-2xl bg-[#00ff88]/5 border border-[#00ff88]/10 text-center">
                              <span className="text-[#00ff88] font-tech text-[12px] font-bold block mb-2">✓ Optimized Implementation</span>
                              <span className="text-slate-400 font-sans text-xs">This session represents a high-standard coding practice.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
