import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function FinalCta() {
    return (
        <section className="py-28 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-gradient-to-r from-[#00d4ff]/8 to-[#6366f1]/8 blur-3xl" />
            </div>
            <div className="absolute inset-0 grid-pattern opacity-15" />

            <div className="relative max-w-4xl mx-auto px-4 text-center">
                {/* Gradient border card */}
                <div className="gradient-border p-[1px] rounded-3xl">
                    <div className="rounded-3xl bg-[#0d0d14] px-10 py-16">

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00ff88]/25 bg-[#00ff88]/8 text-[#00ff88] text-xs font-pixel tracking-widest font-medium mb-8">
                            <Sparkles size={13} />
                            No credit card required
                        </div>

                        <h2 className="text-4xl sm:text-6xl font-tech font-black text-white mb-6 leading-tight">
                            Write code that{' '}
                            <span className="shimmer-text">impresses</span>
                        </h2>

                        <p className="text-slate-400 font-sans text-xl max-w-xl mx-auto mb-10 leading-relaxed">
                            Join 50,000+ developers using CODE-SENSEI to ship faster, cleaner, and more efficient code.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/analyze"
                                className="glow-btn inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#00d4ff] to-[#6366f1] text-black font-black rounded-xl text-lg shadow-2xl shadow-cyan-500/25"
                            >
                                Start Analyzing Free
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                        <p className="mt-6 text-slate-600 font-pixel text-[10px] tracking-widest">
                            Free forever <span className="text-[#00ff88] px-2">·</span> 50 analyses/month <span className="text-[#00ff88] px-2">·</span> No credit card
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
