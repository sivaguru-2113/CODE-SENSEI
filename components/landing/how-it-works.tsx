import React from 'react'
import { ClipboardPaste, Cpu, BarChart2, Rocket } from 'lucide-react'

const STEPS = [
    { num: '01', icon: ClipboardPaste, title: 'Paste Your Code', description: 'Drop any JS, Python, TypeScript or 12+ other languages into the Monaco editor.', color: 'from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/20', border: 'border-cyan-500/30' },
    { num: '02', icon: Cpu, title: 'AI Analyzes', description: 'Our engine detects Big-O complexity, anti-patterns, and potential bugs in under a second.', color: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/20', border: 'border-purple-500/30' },
    { num: '03', icon: BarChart2, title: 'Get Scored', description: 'Receive a 0–100 quality score with a detailed breakdown across 5 dimensions.', color: 'from-orange-500 to-red-500', glow: 'shadow-orange-500/20', border: 'border-orange-500/30' },
    { num: '04', icon: Rocket, title: 'Learn & Improve', description: 'Apply the AI suggestions, re-analyze, and watch your score climb.', color: 'from-green-500 to-emerald-500', glow: 'shadow-green-500/20', border: 'border-green-500/30' },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-28 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-r from-[#6366f1]/6 to-[#00d4ff]/6 blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <p className="font-pixel text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">How It Works</p>
                    <h2 className="text-4xl sm:text-5xl font-tech font-bold text-white mb-5">
                        From code to insights in{' '}
                        <span className="shimmer-text">4 simple steps</span>
                    </h2>
                    <p className="text-slate-400 text-lg">No setup. No configuration. Just paste and go.</p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-green-500/30" />

                    {STEPS.map((step, i) => (
                        <div
                            key={step.num}
                            className="relative flex flex-col items-center text-center animate-fade-up"
                            style={{ animationDelay: `${i * 0.12}s` }}
                        >
                            {/* Icon circle */}
                            <div className={`relative z-10 w-[104px] h-[104px] rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-xl ${step.glow} hover:scale-105 transition-transform duration-300 animate-pulse-glow`}>
                                <step.icon size={36} className="text-white" strokeWidth={1.5} />
                                {/* Step number badge */}
                                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0a0a0f] border border-[#1e1e2a] flex items-center justify-center text-xs font-pixel font-bold text-slate-300">
                                    {step.num}
                                </span>
                            </div>

                            <h3 className="text-white font-tech font-bold text-[15px] mb-2">{step.title}</h3>
                            <p className="text-slate-400 font-sans text-sm leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
