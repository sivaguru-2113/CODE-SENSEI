'use client'

import React, { useState, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard, Code2, BarChart2, History,
    Settings, Zap, ChevronRight, Home, Search,
    Bell, User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackgroundMotion } from '@/components/background-motion'
import { LogoIcon } from '@/components/LogoIcon'
import { useSettings } from './SettingsContext'

/* ── Sidebar nav config ──────────────────────────────────── */
const NAV = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/analyze', label: 'Analyze Code', icon: Code2 },
    { href: '/history', label: 'History', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
]

interface DashboardLayoutProps {
    children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()
    const { settings } = useSettings()
    const compact = settings.compactMode
    const animate = settings.animationsEnabled

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0f] text-white font-sans relative">
            {/* Global SaaS Interactive Background */}
            <BackgroundMotion />

            {/* ── Sidebar ─────────────────────────────────── */}
            <aside
                className={`flex flex-col shrink-0 bg-[#0d0d14]/80 backdrop-blur-xl border-r border-[#1e1e2a] transition-[width] duration-300 overflow-hidden relative z-30 ${collapsed ? 'w-16' : 'w-60'
                    }`}
            >
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 h-16 px-4 border-b border-[#1e1e2a] shrink-0 group">
                    <LogoIcon className="w-9 h-9 shrink-0 drop-shadow-[0_0_8px_rgba(0,212,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,0.6)] transition-all duration-300 group-hover:scale-110" />
                    {!collapsed && (
                        <span className="font-tech font-bold text-white text-[17px] tracking-wide whitespace-nowrap group-hover:text-[#00d4ff] transition-colors">
                            CODE<span className="text-[#00d4ff] ml-1 group-hover:text-white transition-colors">SENSEI</span>
                        </span>
                    )}
                </Link>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none">
                    {NAV.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href && label !== 'Home'

                        return (
                            <Link
                                key={label}
                                href={href}
                                title={collapsed ? label : ''}
                                className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${active
                                    ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20 shadow-[0_0_15px_rgba(0,212,255,0.05)]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                                    }`}
                            >
                                <Icon
                                    size={18}
                                    className={`shrink-0 transition-all duration-300 ${active
                                        ? 'text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]'
                                        : 'group-hover:scale-110 group-hover:text-white'
                                        }`}
                                />
                                {!collapsed && <span className="truncate tracking-wide">{label}</span>}

                                {/* Active Indicator Line */}
                                {active && !collapsed && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00d4ff] rounded-l-full shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                                )}

                                {/* Hover Tooltip Glow */}
                                {!active && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00d4ff]/0 via-[#00d4ff]/0 to-[#00d4ff]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* User / Bottom Section */}
                <div className="p-3 border-t border-[#1e1e2a] space-y-1">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.03] transition-all group"
                    >
                        <ChevronRight
                            size={18}
                            className={`shrink-0 transition-transform duration-500 ${collapsed ? '' : 'rotate-180'}`}
                        />
                        {!collapsed && <span className="text-sm font-medium">Collapse Sidebar</span>}
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area ───────────────────────── */}
            <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden bg-transparent">

                {/* Content Header (Consistent across pages) */}
                <header className="flex items-center justify-between px-6 h-16 border-b border-[#1e1e2a] bg-[#0d0d14]/40 backdrop-blur-xl shrink-0 z-20">
                    <div className="flex items-center gap-6">
                        <div className="relative group hidden sm:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00d4ff] transition-colors" />
                            <input
                                type="text"
                                placeholder="Quick search..."
                                className="bg-[#12121a] border border-[#1e1e2a] rounded-full py-1.5 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-[#00d4ff]/40 focus:ring-1 focus:ring-[#00d4ff]/20 w-64 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all relative">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0d0d14]" />
                        </button>
                    </div>
                </header>

                {/* Animated Page Content */}
                <div className="flex-1 overflow-auto relative z-10 scrollbar-thin">
                    <AnimatePresence mode="wait">
                        {animate ? (
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={`h-full ${compact ? 'text-sm' : ''}`}
                            >
                                {children}
                            </motion.div>
                        ) : (
                            <div key={pathname} className={`h-full ${compact ? 'text-sm' : ''}`}>
                                {children}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}
