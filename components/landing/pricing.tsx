'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, Zap } from 'lucide-react'

const PLANS = [
    {
        name: 'Starter',
        monthly: 0, yearly: 0,
        description: 'Perfect for learners and side projects.',
        features: ['50 analyses / month', 'JS & Python support', 'Basic complexity detection', 'Issue severity ranking', '7-day history'],
        cta: 'Get Started Free',
        featured: false,
    },
    {
        name: 'Pro',
        monthly: 12, yearly: 9,
        description: 'For developers serious about leveling up.',
        features: ['Unlimited analyses', 'All 12+ languages', 'Advanced AI explanations', 'Full history & analytics', 'API access', 'Priority support'],
        cta: 'Start Pro Trial',
        featured: true,
        badge: 'Most Popular',
    },
    {
        name: 'Team',
        monthly: 49, yearly: 39,
        description: 'For engineering teams with a quality culture.',
        features: ['Everything in Pro', 'Up to 10 seats', 'Team analytics dashboard', 'GitHub PR integration', 'Custom rule sets', 'Dedicated support'],
        cta: 'Contact Sales',
        featured: false,
    },
]

export function Pricing() {
    const [yearly, setYearly] = useState(false)

    return (
        <section id="pricing" className="py-28 relative">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-14">
                    <p className="font-pixel text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
                    <h2 className="text-4xl sm:text-5xl font-tech font-bold text-white mb-5">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-slate-400 font-sans text-lg mb-8">Start free. Upgrade when you need more power.</p>

                    {/* Toggle */}
                    <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-[#12121a] border border-[#1e1e2a]">
                        <button
                            onClick={() => setYearly(false)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${!yearly ? 'bg-[#1e1e2a] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >Monthly</button>
                        <button
                            onClick={() => setYearly(true)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${yearly ? 'bg-[#1e1e2a] text-white' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Yearly
                            <span className="px-2 py-0.5 rounded-full bg-[#00ff88]/15 text-[#00ff88] text-xs font-bold">−25%</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col rounded-2xl p-8 border transition-all duration-300 ${plan.featured
                                ? 'border-[#00d4ff]/40 bg-gradient-to-b from-[#00d4ff]/5 to-[#6366f1]/5 shadow-2xl shadow-cyan-500/10 scale-[1.02]'
                                : 'border-[#1e1e2a] glass-card'
                                }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#6366f1] text-black text-xs font-bold flex items-center gap-1">
                                    <Zap size={10} /> {plan.badge}
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-white font-tech font-bold text-xl mb-1">{plan.name}</h3>
                                <p className="text-slate-500 font-sans text-sm mb-4">{plan.description}</p>
                                <div className="flex items-end gap-1 transition-all">
                                    <span className="text-5xl font-tech font-black text-white">
                                        ${yearly ? plan.yearly : plan.monthly}
                                    </span>
                                    {(plan.monthly > 0) && (
                                        <span className="text-slate-500 mb-1.5 text-sm">/month</span>
                                    )}
                                </div>
                                {yearly && plan.monthly > 0 && (
                                    <p className="text-[#00ff88] text-xs mt-1">Billed annually · Save ${(plan.monthly - plan.yearly) * 12}/yr</p>
                                )}
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                                        <Check size={15} className="text-[#00ff88] mt-0.5 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/analyze"
                                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all text-sm glow-btn ${plan.featured
                                    ? 'bg-gradient-to-r from-[#00d4ff] to-[#6366f1] text-black shadow-lg shadow-cyan-500/20'
                                    : 'border border-[#1e1e2a] text-slate-300 hover:border-[#00d4ff]/30 hover:text-white'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
