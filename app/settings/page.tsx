'use client'

import React from 'react'
import { DashboardLayout } from '@/frontend/components/DashboardLayout'
import { useSettings } from '@/frontend/components/SettingsContext'
import { motion } from 'framer-motion'
import { Palette, Code2, Brain, RotateCcw, TrendingUp } from 'lucide-react'

/* ── Toggle Switch ───────────────────────────────────────── */
function Toggle({ enabled, onToggle, label, description }: {
    enabled: boolean; onToggle: () => void; label: string; description?: string
}) {
    return (
        <button onClick={onToggle} className="w-full flex items-center justify-between py-3 group cursor-pointer">
            <div className="flex-1 text-left">
                <p className="text-sm text-white font-medium group-hover:text-[#00d4ff] transition-colors">{label}</p>
                {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
            <div className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 ${enabled ? 'bg-[#00d4ff]/20 border border-[#00d4ff]/40' : 'bg-[#1e1e2a] border border-[#2a2a3a]'}`}>
                <motion.div
                    animate={{ x: enabled ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`w-5 h-5 rounded-full shadow-md transition-colors ${enabled ? 'bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.4)]' : 'bg-slate-500'}`}
                />
            </div>
        </button>
    )
}

/* ── Select Dropdown ──────────────────────────────────────── */
function SelectOption({ label, description, value, options, onChange }: {
    label: string; description?: string; value: string
    options: { value: string; label: string }[]
    onChange: (v: string) => void
}) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1">
                <p className="text-sm text-white font-medium">{label}</p>
                {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-[#12121a] border border-[#2a2a3a] rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#00d4ff]/40 cursor-pointer hover:border-[#3a3a4a] transition-colors"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )
}

/* ── Settings Section Card ────────────────────────────────── */
function SettingsSection({ icon: Icon, title, badge, children, delay = 0 }: {
    icon: React.ElementType; title: string; badge?: string
    children: React.ReactNode; delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.35, ease: 'easeOut' }}
            className="rounded-2xl border border-[#1e1e2a] bg-[#0d0d14]/60 backdrop-blur-xl overflow-hidden"
        >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e1e2a]">
                <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center">
                    <Icon size={16} className="text-[#00d4ff]" />
                </div>
                <h3 className="text-white font-semibold text-sm tracking-wide">{title}</h3>
                {badge && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-[#6366f1]/15 border border-[#6366f1]/25 text-[#a78bfa] text-[10px] font-semibold">
                        {badge}
                    </span>
                )}
            </div>
            <div className="px-5 divide-y divide-[#1e1e2a]">
                {children}
            </div>
        </motion.div>
    )
}

/* ── Main Settings Page ───────────────────────────────────── */
export default function SettingsPage() {
    const { settings, updateSetting, resetSettings } = useSettings()

    return (
        <DashboardLayout>
            <div className="p-6 max-w-3xl mx-auto space-y-5">

                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-2"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
                        <p className="text-sm text-slate-500 mt-1">Configure your CODE-SENSEI environment</p>
                    </div>
                    <button
                        onClick={resetSettings}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2a2a3a] bg-[#12121a] text-slate-400 text-xs font-medium hover:text-white hover:border-[#3a3a4a] transition-all cursor-pointer"
                    >
                        <RotateCcw size={12} />
                        Reset All
                    </button>
                </motion.div>

                {/* ── Editor & Analysis ─────────────────────────── */}
                <SettingsSection icon={Code2} title="Editor & Analysis" delay={0.05}>
                    <SelectOption
                        label="Default Language"
                        description="Language auto-selected when you open the Analyze page"
                        value={settings.defaultLanguage}
                        onChange={(v) => updateSetting('defaultLanguage', v)}
                        options={[
                            { value: 'python', label: 'Python' },
                            { value: 'javascript', label: 'JavaScript' },
                            { value: 'typescript', label: 'TypeScript' },
                            { value: 'java', label: 'Java' },
                            { value: 'cpp', label: 'C++' },
                            { value: 'go', label: 'Go' },
                            { value: 'rust', label: 'Rust' },
                        ]}
                    />
                    <Toggle
                        enabled={settings.showLineNumbers}
                        onToggle={() => updateSetting('showLineNumbers', !settings.showLineNumbers)}
                        label="Show line numbers"
                        description="Display line numbers in the code editor"
                    />
                </SettingsSection>

                {/* ── Appearance ───────────────────────────────── */}
                <SettingsSection icon={Palette} title="Appearance" delay={0.1}>
                    <SelectOption
                        label="Editor Font Size"
                        description="Code editor text size in pixels"
                        value={settings.fontSize}
                        onChange={(v) => updateSetting('fontSize', v)}
                        options={[
                            { value: '12', label: '12px (Small)' },
                            { value: '14', label: '14px (Default)' },
                            { value: '16', label: '16px (Large)' },
                            { value: '18', label: '18px (Extra Large)' },
                        ]}
                    />
                    <Toggle
                        enabled={settings.animationsEnabled}
                        onToggle={() => updateSetting('animationsEnabled', !settings.animationsEnabled)}
                        label="Enable animations"
                        description="Smooth page transitions and micro-interactions"
                    />
                    <Toggle
                        enabled={settings.compactMode}
                        onToggle={() => updateSetting('compactMode', !settings.compactMode)}
                        label="Compact mode"
                        description="Reduce text size across all pages for more screen space"
                    />
                </SettingsSection>

                {/* ── Analysis Results ─────────────────────────── */}
                <SettingsSection icon={TrendingUp} title="Analysis Results" delay={0.15}>
                    <Toggle
                        enabled={settings.showComplexityAnalysis}
                        onToggle={() => updateSetting('showComplexityAnalysis', !settings.showComplexityAnalysis)}
                        label="Show complexity analysis"
                        description="Display the Big-O time/space complexity section in analysis results"
                    />
                </SettingsSection>

                {/* ── About ────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                    className="rounded-2xl border border-[#1e1e2a] bg-[#0d0d14]/60 backdrop-blur-xl p-5"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-semibold text-sm">CODE-SENSEI</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Hybrid AST + AI Code Analysis Engine • v2.0</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
                            <span className="text-xs text-[#00ff88] font-medium">Engine Active</span>
                        </div>
                    </div>
                    <div className="mt-3 flex gap-3 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] text-[10px] font-semibold">AST Parser</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#a78bfa] text-[10px] font-semibold">Pattern Engine</span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-[10px] font-semibold">AI Explainer</span>
                        <span className="px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-semibold">Quality Scorer</span>
                    </div>
                </motion.div>

                <div className="h-8" />
            </div>
        </DashboardLayout>
    )
}
