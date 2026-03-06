'use client'

import React from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { useCodeAnalysis } from '@/hooks/useCodeAnalysis'
import { Dashboard } from '@/components/Dashboard'
import { formatDate } from '@/utils/helpers'

import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { history } = useCodeAnalysis()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
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
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-3xl font-tech font-bold text-white mb-2 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 font-sans text-sm">A centralized view of your coding performance and analysis history</p>
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div variants={itemVariants}>
          <Dashboard results={history} />
        </motion.div>

        {/* Recent Analyses */}
        <div className="mt-12">
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-tech font-bold text-white tracking-tight">Recent Performance</h2>
            <button className="text-xs font-medium text-[#00d4ff] hover:underline transition-all">View All Activity</button>
          </motion.div>

          {history.length === 0 ? (
            <motion.div variants={itemVariants} className="bg-[#12121a]/60 backdrop-blur-xl rounded-2xl p-12 text-center border border-[#1e1e2a] shadow-inner">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <span className="text-slate-500">?</span>
              </div>
              <p className="text-slate-400 text-sm">No analyses performed yet. Start your first session!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {history.slice(0, 6).map((result, idx) => (
                <motion.div
                  key={result.id}
                  variants={itemVariants}
                  className="bg-[#12121a]/60 backdrop-blur-xl hover:bg-[#1a1a25]/80 rounded-2xl p-5 border border-[#1e1e2a] hover:border-[#00d4ff]/40 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-pixel uppercase tracking-widest font-bold mb-1">Session Score</span>
                      <div className={`text-3xl font-tech font-black ${result.finalScore >= 80 ? 'text-[#00ff88]' : 'text-[#00d4ff]'}`}>{result.finalScore}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-pixel bg-white/5 px-2 py-1 rounded-md">{formatDate(result.timestamp)}</div>
                  </div>

                  <div className="mb-5 text-sm">
                    <div className="text-slate-200 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                      <span className="font-bold text-[#6366f1]">{result.complexity.timeComplexity}</span>
                      <span className="text-slate-400 text-xs">Runtime</span>
                    </div>
                    <div className="text-slate-500 text-xs">
                      Detected <span className="text-white font-medium">{result.issues.length}</span> improvement areas
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-white/[0.03] rounded-xl p-2.5 border border-white/[0.05]">
                      <div className="text-slate-500 font-pixel mb-1 font-medium">Readability</div>
                      <div className="text-[#00d4ff] font-tech font-bold">{result.metrics.readability}%</div>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-2.5 border border-white/[0.05]">
                      <div className="text-slate-500 font-pixel mb-1 font-medium">Efficiency</div>
                      <div className="text-[#00ff88] font-tech font-bold">{result.metrics.efficiency}%</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Improvement Recommendations */}
        <motion.div
          variants={itemVariants}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-[#12121a]/80 to-[#0d0d14]/80 backdrop-blur-2xl border border-[#1e1e2a] shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d4ff]/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00d4ff]/10 transition-colors" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center">
                <span className="text-[#00d4ff] text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">AI Curated Growth Plan</h3>
            </div>

            {history.length === 0 ? (
              <p className="text-slate-400 text-sm">Your personalized growth plan will be generated after your first code analysis.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history[0]?.issues.slice(0, 4).map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#00d4ff]/20 transition-all">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#6366f1]/20 text-[#6366f1] text-[10px] font-bold flex items-center justify-center mt-0.5">{idx + 1}</span>
                    <span className="text-slate-300 text-sm leading-relaxed">{issue.suggestion}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
