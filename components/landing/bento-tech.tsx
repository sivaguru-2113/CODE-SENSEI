'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Layers, Lock, GitMerge, Lightbulb, Globe, ChevronRight } from 'lucide-react'

const FEATURES = [
  {
    id: 'engine',
    icon: Cpu,
    title: 'Multi-language Engine',
    description: 'Consistent analysis across your entire stack — JS, Python, Go, Rust, and more with language-specific rules.',
    color: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
    glowColor: 'shadow-cyan-500/20'
  },
  {
    id: 'context',
    icon: Layers,
    title: 'Deep Context',
    description: 'Correlates patterns across files and history to surface systemic issues rather than just isolated linting errors.',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    glowColor: 'shadow-purple-500/20'
  },
  {
    id: 'privacy',
    icon: Lock,
    title: 'Privacy First',
    description: 'Your code is analyzed in-memory. Nothing is stored, logged, or used for training underlying AI models.',
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-400',
    glowColor: 'shadow-green-500/20'
  },
  {
    id: 'cicd',
    icon: GitMerge,
    title: 'CI/CD Ready',
    description: 'API-first design lets you seamlessly plug CODE-SENSEI into GitHub Actions, GitLab CI, or any custom pipeline.',
    color: 'from-orange-500/20 to-red-500/20',
    borderColor: 'border-orange-500/30',
    iconColor: 'text-orange-400',
    glowColor: 'shadow-orange-500/20'
  },
  {
    id: 'insights',
    icon: Lightbulb,
    title: 'Human-ready Insights',
    description: 'Not raw diagnostics. Get concise, actionable explanations you can actually share with your team or drop into PRs.',
    color: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    glowColor: 'shadow-yellow-500/20'
  },
  {
    id: 'api',
    icon: Globe,
    title: 'Open API',
    description: 'Full REST API access for Pro and Team plans. Integrate our analysis engine anywhere into your developer tooling.',
    color: 'from-indigo-500/20 to-violet-500/20',
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-400',
    glowColor: 'shadow-indigo-500/20'
  }
]

export function BentoTech() {
  const [activeFeature, setActiveFeature] = useState(FEATURES[0].id)

  return (
    <section className="py-32 relative overflow-hidden" id="under-the-hood">
      {/* Background Glow based on active feature */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] opacity-20 blur-[120px] pointer-events-none transition-colors duration-700 ease-in-out"
        style={{
          background: `radial-gradient(circle, ${FEATURES.find(f => f.id === activeFeature)?.iconColor.replace('text-', '')} 0%, transparent 70%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-pixel text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Built for serious engineers
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-tech font-bold text-white mb-6 tracking-tight"
          >
            Under the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#6366f1]">Hood</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-sans leading-relaxed"
          >
            CODE-SENSEI combines static analysis, AI, and explainability to deliver insights that actually make you better.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Interactive Feature List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {FEATURES.map((feature, idx) => {
              const isActive = activeFeature === feature.id
              const Icon = feature.icon

              return (
                <motion.button
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onMouseEnter={() => setActiveFeature(feature.id)}
                  className={`group relative text-left w-full p-5 rounded-2xl border transition-all duration-300 overflow-hidden ${isActive
                    ? `bg-[#12121a]/80 backdrop-blur-xl ${feature.borderColor} shadow-lg ${feature.glowColor}`
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                    }`}
                >
                  {/* Subtle active state background gradient */}
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`} />
                  )}

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${isActive ? `bg-white/10 ${feature.iconColor}` : 'bg-white/5 text-slate-500 group-hover:text-slate-300'
                        }`}>
                        <Icon size={20} />
                      </div>
                      <h3 className={`font-tech font-bold text-lg transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        }`}>
                        {feature.title}
                      </h3>
                    </div>

                    <ChevronRight size={18} className={`transition-all duration-300 ${isActive ? `${feature.iconColor} translate-x-0` : 'text-slate-600 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                      }`} />
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Right Column: Dynamic Display Panel */}
          <div className="lg:col-span-7 sticky top-32">
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-[#0a0a0f]/80 backdrop-blur-2xl border border-[#1e1e2a] overflow-hidden shadow-2xl flex items-center justify-center p-8 md:p-12">

              {/* Complex inner borders/glows to look high-tech */}
              <div className="absolute inset-0 border border-white/[0.02] rounded-3xl m-2" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <AnimatePresence mode="wait">
                {FEATURES.map((feature) => (
                  feature.id === activeFeature && (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.05, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="relative z-10 flex flex-col items-center text-center max-w-lg"
                    >
                      <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-2xl ${feature.glowColor} relative`}>
                        {/* Decorative bounding box */}
                        <div className="absolute inset-0 rounded-3xl border border-white/20" />
                        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white/40" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white/40" />
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white/40" />
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white/40" />

                        <feature.icon size={48} className={feature.iconColor} />
                      </div>

                      <h3 className="text-2xl md:text-3xl font-tech font-bold text-white mb-4 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 font-sans text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
