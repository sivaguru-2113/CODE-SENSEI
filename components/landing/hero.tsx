'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Shield, TrendingUp, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const WORDS = [
    { text: 'Smarter.', color: 'from-[#00ff88] to-[#00d4ff]' },
    { text: 'Faster.', color: 'from-[#ff0080] to-[#7928ca]' },
    { text: 'Cleaner.', color: 'from-[#f5cb5c] to-[#f9a03f]' },
    { text: 'Better.', color: 'from-[#6366f1] to-[#a855f7]' },
]

const CODE_LINES = [
    { indent: 0, tokens: [{ t: 'keyword', v: 'function ' }, { t: 'fn', v: 'bubbleSort' }, { t: 'plain', v: '(arr) {' }] },
    { indent: 1, tokens: [{ t: 'keyword', v: 'const ' }, { t: 'plain', v: 'n = arr.length;' }] },
    { indent: 1, tokens: [{ t: 'keyword', v: 'for ' }, { t: 'plain', v: '(let i = 0; i < n; i++) {' }] },
    { indent: 2, tokens: [{ t: 'keyword', v: 'for ' }, { t: 'plain', v: '(let j = 0; j < n-i-1; j++) {' }] },
    { indent: 3, tokens: [{ t: 'keyword', v: 'if ' }, { t: 'plain', v: '(arr[j] > arr[j+1]) {' }] },
    { indent: 4, tokens: [{ t: 'plain', v: '[arr[j], arr[j+1]] = [arr[j+1], arr[j]];' }] },
    { indent: 3, tokens: [{ t: 'plain', v: '}' }] },
    { indent: 2, tokens: [{ t: 'plain', v: '}' }] },
    { indent: 1, tokens: [{ t: 'plain', v: '}' }] },
    { indent: 0, tokens: [{ t: 'plain', v: '}' }] },
]

const RESULT_LINES = [
    { label: 'Score', value: '72 / 100', color: 'text-yellow-400' },
    { label: 'Complexity', value: 'O(n²)', color: 'text-orange-400' },
    { label: 'Issue', value: 'Nested loop — use Map for O(n)', color: 'text-red-400' },
    { label: 'Fix', value: 'Replace with hash-based approach ✓', color: 'text-green-400' },
]

const STATS = [
    { value: '50K+', label: 'Code Reviews' },
    { value: '98%', label: 'Accuracy' },
    { value: '<1s', label: 'Analysis Time' },
    { value: '12+', label: 'Languages' },
]

const BADGES = [
    { icon: Zap, label: 'Instant Analysis', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    { icon: Shield, label: 'Bug Detection', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
    { icon: TrendingUp, label: 'Score Tracking', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
]

export function Hero() {
    const [visibleLines, setVisibleLines] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [visibleResults, setVisibleResults] = useState(0)
    const [wordIndex, setWordIndex] = useState(0)

    useEffect(() => {
        let i = 0
        const t = setInterval(() => {
            i++
            setVisibleLines(i)
            if (i >= CODE_LINES.length) {
                clearInterval(t)
                setTimeout(() => {
                    setShowResult(true)
                    let r = 0
                    const rt = setInterval(() => {
                        r++
                        setVisibleResults(r)
                        if (r >= RESULT_LINES.length) clearInterval(rt)
                    }, 250)
                }, 400)
            }
        }, 120)
        return () => clearInterval(t)
    }, [])

    useEffect(() => {
        const wordInterval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % WORDS.length)
        }, 2000)
        return () => clearInterval(wordInterval)
    }, [])

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Ambient blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="animate-blob absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-[#00d4ff]/8 blur-3xl" />
                <div className="animate-blob animation-delay-2000 absolute bottom-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-[#6366f1]/8 blur-3xl" />
                <div className="animate-blob animation-delay-4000 absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#00ff88]/5 blur-2xl" />
            </div>
            <div className="absolute inset-0 grid-pattern opacity-30" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left — copy */}
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00d4ff]/25 bg-[#00d4ff]/8 text-[#00d4ff] text-sm font-medium mb-7 animate-fade-up">
                            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                            AI-Powered Code Intelligence · Free to Start
                        </div>

                        {/* Headline */}
                        <div className="mb-8 animate-fade-up animation-delay-100">
                            <h1 className="text-6xl lg:text-7xl font-tech font-extrabold text-white leading-[1.2] tracking-tight">
                                Code{' '}
                                <span className="relative inline-block min-w-[280px] h-[1.1em] align-top overflow-visible font-sans">
                                    <AnimatePresence mode="popLayout">
                                        <motion.span
                                            key={wordIndex}
                                            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                            className={`absolute left-0 top-0 bg-gradient-to-r bg-clip-text text-transparent pb-4 pr-10 ${WORDS[wordIndex].color}`}
                                        >
                                            {WORDS[wordIndex].text}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                <br />
                                <span className="text-white">Not just harder.</span>
                            </h1>
                        </div>

                        {/* Badges row */}
                        <div className="flex flex-wrap gap-2 mb-8 animate-fade-up animation-delay-300">
                            {BADGES.map(({ icon: Icon, label, color }) => (
                                <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${color}`}>
                                    <Icon size={12} />
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3 mb-10 animate-fade-up animation-delay-500">
                            <Link href="/analyze" className="glow-btn inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#00d4ff] to-[#6366f1] text-black font-bold rounded-xl text-base shadow-lg shadow-cyan-500/20">
                                Start Analyzing Free
                                <ArrowRight size={16} />
                            </Link>
                            <Link href="/dashboard" className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#1e1e2a] text-white font-semibold rounded-xl text-base hover:border-[#00d4ff]/30 hover:bg-[#00d4ff]/5 transition-all">
                                View Dashboard
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 animate-fade-up animation-delay-700">
                            {STATS.map((s, i) => (
                                <div key={s.label} className="text-center">
                                    <div className="text-2xl font-tech font-bold text-white">{s.value}</div>
                                    <div className="text-xs font-pixel text-slate-500 mt-0.5">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — animated terminal */}
                    <div className="animate-fade-up animation-delay-300 lg:mt-32">
                        <div className="relative">
                            {/* Glow ring */}
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00d4ff]/20 to-[#6366f1]/20 blur-xl" />

                            <div className="relative rounded-2xl border border-[#1e1e2a] bg-[#0d0d14] overflow-hidden shadow-2xl">
                                {/* Terminal header */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e2a] bg-[#12121a]">
                                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                                    <span className="ml-3 text-xs text-slate-500 font-pixel tracking-wider">bubbleSort.js — CODE-SENSEI</span>
                                </div>

                                {/* Code area */}
                                <div className="p-5 font-mono text-sm min-h-[220px]">
                                    {CODE_LINES.slice(0, visibleLines).map((line, li) => (
                                        <div key={li} className="leading-7 animate-fade-in" style={{ paddingLeft: `${line.indent * 16}px` }}>
                                            <span className="text-slate-600 select-none mr-4 text-xs">{String(li + 1).padStart(2, '0')}</span>
                                            {line.tokens.map((tok, ti) => (
                                                <span key={ti} className={
                                                    tok.t === 'keyword' ? 'text-[#6366f1]' :
                                                        tok.t === 'fn' ? 'text-[#00d4ff]' :
                                                            'text-slate-300'
                                                }>{tok.v}</span>
                                            ))}
                                        </div>
                                    ))}
                                    {visibleLines < CODE_LINES.length && (
                                        <span className="w-2 h-4 bg-[#00d4ff] inline-block animate-blink ml-1" />
                                    )}
                                </div>

                                {/* Divider */}
                                {showResult && (
                                    <div className="border-t border-[#1e1e2a] bg-[#0a0a14] p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                                            <span className="text-xs text-[#00ff88] font-mono font-semibold">Analysis Complete</span>
                                        </div>
                                        {RESULT_LINES.slice(0, visibleResults).map((r, i) => (
                                            <div key={i} className="flex gap-3 text-xs font-mono mb-1.5 animate-slide-right">
                                                <span className="text-slate-600 w-20 shrink-0">{r.label}</span>
                                                <span className={r.color}>{r.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Floating score badge */}
                            {showResult && (
                                <div className="absolute -top-4 -right-4 animate-float animate-fade-in animation-delay-500">
                                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#6366f1] shadow-xl shadow-cyan-500/30">
                                        <div className="text-black font-tech font-black text-lg leading-none">72</div>
                                        <div className="text-black/70 text-[9px] font-pixel font-bold mt-1">SCORE</div>
                                    </div>
                                </div>
                            )}

                            {/* Floating star badge */}
                            <div className="absolute -bottom-3 -left-4 animate-float animation-delay-1000 animate-fade-in animation-delay-700">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#12121a] border border-[#1e1e2a] shadow-xl">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-white font-semibold">+18 pts this week</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
