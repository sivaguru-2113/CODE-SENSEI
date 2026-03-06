import React from 'react'
import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'
import { LogoIcon } from '../LogoIcon'

const COL1 = [
    { label: 'Analyze Code', href: '/analyze' },
    { label: 'Insights', href: '/insights' },
    { label: 'History', href: '/history' },
]
const COL2 = [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
]
const COL3 = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Cookies', href: '#' },
    { label: 'Status', href: '#' },
]
const SOCIALS = [
    { icon: Github, href: '#', name: 'github' },
    { icon: Twitter, href: '#', name: 'twitter' },
    { icon: Linkedin, href: '#', name: 'linkedin' },
]

export function Footer() {
    return (
        <footer className="border-t border-[#1e1e2a] pt-16 pb-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 mb-14">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-5 group">
                            <LogoIcon className="w-8 h-8 drop-shadow-[0_0_8px_rgba(0,212,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,0.6)] transition-all duration-300 group-hover:scale-110" />
                            <span className="font-tech font-bold text-white text-lg">CODE<span className="text-[#00d4ff] ml-1">SENSEI</span></span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-5">
                            AI-powered code mentorship that teaches you to write cleaner, faster, and more maintainable code.
                        </p>
                        <div className="flex gap-3">
                            {SOCIALS.map(({ icon: Icon, href, name }) => (
                                <a key={name} href={href} className="w-9 h-9 rounded-lg bg-[#12121a] border border-[#1e1e2a] flex items-center justify-center text-slate-400 hover:text-white hover:border-[#00d4ff]/30 transition-all">
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {[{ title: 'Product', links: COL1 }, { title: 'Company', links: COL2 }, { title: 'Legal', links: COL3 }].map(({ title, links }) => (
                        <div key={title}>
                            <h4 className="text-white font-tech font-semibold tracking-wide text-[13px] mb-4 uppercase">{title}</h4>
                            <ul className="space-y-2.5">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link href={href} className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-[#1e1e2a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-slate-600 text-sm">© {new Date().getFullYear()} CODE-SENSEI. All rights reserved.</p>
                    <p className="text-slate-700 text-xs">Built with ♥ for developers who care about quality.</p>
                </div>
            </div>
        </footer>
    )
}
