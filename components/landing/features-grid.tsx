'use client'

import React, { useState } from 'react'
import { Zap, Brain, BarChart2, ShieldAlert, TrendingUp, Trophy, Code2, GitBranch } from 'lucide-react'

const TABS = [
    { id: 'analysis', label: 'Analysis', icon: BarChart2 },
    { id: 'ai', label: 'AI Mentor', icon: Brain },
    { id: 'tracking', label: 'Progress', icon: TrendingUp },
]

const FEATURES: Record<string, Array<{ icon: React.ElementType; title: string; description: string; color: string; bg: string }>> = {
    analysis: [
        { icon: Zap, title: 'Real-time Analysis', description: 'Get instant O(n), O(n²) complexity detection as you type. Sub-second feedback on every keystroke.', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
        { icon: ShieldAlert, title: 'Bug Detection', description: 'Catch critical issues before production — null pointers, unhandled async, and anti-patterns flagged instantly.', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
        { icon: BarChart2, title: 'Code Metrics', description: 'Five-dimensional scoring: readability, efficiency, maintainability, best practices, and error handling.', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
        { icon: Code2, title: 'Multi-language', description: 'JavaScript, Python, TypeScript, Rust, Go, and 8+ more languages with language-specific best-practice rules.', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
    ],
    ai: [
        { icon: Brain, title: 'Plain-English Explanations', description: 'Not just "nested loop found" — we explain WHY it matters, the math behind it, and a concrete fix.', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
        { icon: GitBranch, title: 'Alternative Approaches', description: 'AI suggests 2–3 better patterns for each issue. See the O(n) HashMap solution side-by-side with your O(n²) code.', color: 'text-indigo-400', bg: 'bg-indigo-400/10 border-indigo-400/20' },
        { icon: ShieldAlert, title: 'Severity Ranking', description: 'Issues ranked Critical → Warning → Info with exact line numbers. Know exactly what to fix first.', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
        { icon: Zap, title: 'Instant Teach Mode', description: 'Toggle "Explain like a senior engineer" mode for deep-dive explanations or "Quick fix" for one-liners.', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
    ],
    tracking: [
        { icon: TrendingUp, title: 'Score History', description: 'Watch your code quality score climb over time. Every analysis logged, every improvement recorded.', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
        { icon: Trophy, title: 'Skill Milestones', description: 'Earn milestones as you master complexity reduction, error handling, and clean code principles.', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
        { icon: BarChart2, title: 'Analytics Dashboard', description: 'Radar charts, trend lines, and metric breakdowns. Share your progress report with your team or portfolio.', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
        { icon: Brain, title: 'Personalized Tips', description: 'AI identifies your recurring patterns and serves targeted recommendations to break bad habits.', color: 'text-pink-400', bg: 'bg-pink-400/10 border-pink-400/20' },
    ],
}

export function FeaturesGrid() {
    const [activeTab, setActiveTab] = useState('analysis')

    return (
        <section id="features" className="py-28 relative">
            <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-4">
                {/* Heading */}
                <div className="text-center mb-14">
                    <p className="font-pixel text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
                    <h2 className="text-4xl sm:text-5xl font-tech font-bold text-white mb-5">
                        Everything you need to write{' '}
                        <span className="shimmer-text">better code</span>
                    </h2>
                    <p className="text-slate-400 font-sans text-lg max-w-2xl mx-auto">
                        A full feedback loop — analyze, learn, and track. Built for developers who take code quality seriously.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="flex gap-1 p-1 rounded-xl bg-[#12121a] border border-[#1e1e2a]">
                        {TABS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center font-tech gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === id
                                    ? 'bg-gradient-to-r from-[#00d4ff]/20 to-[#6366f1]/20 text-[#00d4ff] border border-[#00d4ff]/30 shadow-lg shadow-cyan-500/10'
                                    : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                <Icon size={15} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {FEATURES[activeTab].map((f, i) => (
                        <div
                            key={f.title}
                            className={`glass-card rounded-2xl p-6 border hover:scale-[1.03] transition-all duration-300 animate-fade-up animation-delay-${i * 100}`}
                            style={{ animationDelay: `${i * 0.07}s` }}
                        >
                            <div className={`w-11 h-11 rounded-xl border ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <f.icon size={20} className={f.color} />
                            </div>
                            <h3 className="text-white font-tech font-semibold text-[15px] mb-2">{f.title}</h3>
                            <p className="text-slate-400 font-sans text-sm leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
