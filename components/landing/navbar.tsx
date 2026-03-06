'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Code2, History, Zap } from 'lucide-react'
import { LogoIcon } from '../LogoIcon'

const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
]

const APP_LINKS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Analyze', href: '/analyze', icon: Code2 },
    { label: 'History', href: '/history', icon: History },
]

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 24)
        window.addEventListener('scroll', fn, { passive: true })
        fn()
        return () => window.removeEventListener('scroll', fn)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-[#0a0a0f]/70 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/30'
            : 'bg-white/[0.02] backdrop-blur-md border-b border-white/[0.04]'
            }`}>

            {/* Subtle inner glow line at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent opacity-0 transition-opacity duration-500"
                style={{ opacity: scrolled ? 1 : 0 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <LogoIcon className="w-8 h-8 drop-shadow-[0_0_8px_rgba(0,212,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,0.6)] transition-all duration-300 group-hover:scale-110" />
                        <span className="font-tech font-bold text-white text-[17px] tracking-wide">
                            CODE<span className="text-[#00d4ff] ml-1">SENSEI</span>
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200 relative group"
                            >
                                {label}
                                <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-[#00d4ff] to-[#6366f1] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                            </a>
                        ))}
                    </div>

                    {/* Desktop app links + CTA */}
                    <div className="hidden md:flex items-center gap-1">
                        {APP_LINKS.map(({ label, href, icon: Icon }) => {
                            const isActive = pathname === href
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20 shadow-inner shadow-cyan-500/5'
                                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                                        }`}
                                >
                                    <Icon
                                        size={14}
                                        className={isActive ? 'text-[#00d4ff] drop-shadow-[0_0_6px_#00d4ff]' : ''}
                                    />
                                    {label}
                                    {isActive && (
                                        <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-[#00d4ff] shadow-[0_0_6px_#00d4ff]" />
                                    )}
                                </Link>
                            )
                        })}

                        <Link
                            href="/analyze"
                            className="ml-2 glow-btn inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#6366f1] text-black text-sm font-bold rounded-lg shadow-lg shadow-cyan-500/20"
                        >
                            Start Free →
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            {open && (
                <div className="md:hidden bg-[#0a0a0f]/90 backdrop-blur-2xl border-b border-white/[0.06]">
                    <div className="px-4 py-4 space-y-1">
                        {NAV_LINKS.map(({ label, href }) => (
                            <a
                                key={label}
                                href={href}
                                onClick={() => setOpen(false)}
                                className="block px-3 py-2.5 text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all text-sm"
                            >
                                {label}
                            </a>
                        ))}
                        <div className="border-t border-white/[0.06] pt-3 mt-3 space-y-1">
                            {APP_LINKS.map(({ label, href, icon: Icon }) => {
                                const isActive = pathname === href
                                return (
                                    <Link
                                        key={label}
                                        href={href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isActive
                                            ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20'
                                            : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                                            }`}
                                    >
                                        <Icon size={14} className={isActive ? 'text-[#00d4ff] drop-shadow-[0_0_6px_#00d4ff]' : ''} />
                                        {label}
                                    </Link>
                                )
                            })}

                            <Link
                                href="/analyze"
                                onClick={() => setOpen(false)}
                                className="block mt-2 px-4 py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#6366f1] text-black text-sm font-bold rounded-lg text-center"
                            >
                                Start Free →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

function ChevronRight({ size, className }: { size: number, className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
