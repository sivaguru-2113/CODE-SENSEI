'use client'

import React, { useState } from 'react'

const faqs = [
    {
        question: 'What programming languages does CODE-SENSEI support?',
        answer:
            'Currently we fully support JavaScript and Python with TypeScript, Rust, Go, Java, C++, and Ruby in beta. We\'re continuously adding new language support based on community demand.',
    },
    {
        question: 'How accurate is the complexity detection?',
        answer:
            'Our complexity analysis achieves 98% accuracy on standard algorithmic patterns. For edge cases, our AI provides explanations and confidence levels so you always understand the reasoning.',
    },
    {
        question: 'Is my code stored or used for training?',
        answer:
            'No. Your code is analyzed in real-time and never stored permanently or used for model training. We take privacy seriously—analysis results are kept only for your history and you can delete them anytime.',
    },
    {
        question: 'Can I use CODE-SENSEI in my CI/CD pipeline?',
        answer:
            'Yes! Pro and Team plans include API access so you can integrate CODE-SENSEI into your GitHub Actions, GitLab CI, or any custom pipeline. We also offer a GitHub PR integration coming soon.',
    },
    {
        question: 'What\'s the difference between CODE-SENSEI and a linter like ESLint?',
        answer:
            'Linters check syntax and style rules. CODE-SENSEI goes deeper: it understands algorithmic complexity, detects patterns that cause performance problems, and provides human-readable AI explanations—not just rule violations.',
    },
    {
        question: 'Do you offer student or educational discounts?',
        answer:
            'Yes! Students and educators can apply for a free Pro account via our education program. Just sign up and submit your .edu email address.',
    },
]

export function FaqSection() {
    const [open, setOpen] = useState<number | null>(null)

    return (
        <section id="faq" className="py-24">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-tech font-bold text-white mb-4">
                        Frequently asked questions
                    </h2>
                    <p className="text-slate-400 font-sans text-lg">
                        Everything you need to know about CODE-SENSEI.
                    </p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="glass-card rounded-xl border border-[#1e1e2a] overflow-hidden hover:border-[#00d4ff]/20 transition-colors"
                        >
                            <button
                                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                                onClick={() => setOpen(open === index ? null : index)}
                            >
                                <span className="text-white font-tech font-bold text-[15px]">{faq.question}</span>
                                <span
                                    className={`text-[#00d4ff] text-xl flex-shrink-0 transition-transform duration-200 ${open === index ? 'rotate-45' : ''
                                        }`}
                                >
                                    +
                                </span>
                            </button>
                            {open === index && (
                                <div className="px-6 pb-5">
                                    <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
