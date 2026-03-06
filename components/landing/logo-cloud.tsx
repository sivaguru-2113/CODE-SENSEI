import React from 'react'

const ROW1 = [
    { name: 'Python', icon: '🐍', color: 'text-yellow-300' },
    { name: 'JavaScript', icon: '🟨', color: 'text-yellow-400' },
    { name: 'TypeScript', icon: '🔷', color: 'text-blue-400' },
    { name: 'Rust', icon: '🦀', color: 'text-orange-400' },
    { name: 'Go', icon: '🐹', color: 'text-cyan-400' },
    { name: 'Java', icon: '☕', color: 'text-amber-500' },
    { name: 'C++', icon: '⚙️', color: 'text-slate-300' },
    { name: 'Ruby', icon: '💎', color: 'text-red-400' },
    { name: 'Swift', icon: '🍎', color: 'text-orange-300' },
    { name: 'Kotlin', icon: '🟣', color: 'text-purple-400' },
]

// Duplicate for seamless loop
const ITEMS = [...ROW1, ...ROW1]

function Tag({ name, icon, color }: { name: string; icon: string; color: string }) {
    return (
        <div className="flex items-center gap-2.5 px-5 py-2.5 mx-3 rounded-full border border-[#1e1e2a] bg-[#12121a] whitespace-nowrap hover:border-[#00d4ff]/30 hover:bg-[#00d4ff]/5 transition-all cursor-default">
            <span className="text-lg leading-none">{icon}</span>
            <span className={`text-sm font-semibold ${color}`}>{name}</span>
        </div>
    )
}

export function LogoCloud() {
    return (
        <section className="py-14 border-y border-[#1e1e2a] relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 mb-8 text-center">
                <p className="text-slate-500 text-xs uppercase tracking-[0.2em] font-semibold">
                    Supports all major languages & frameworks
                </p>
            </div>

            {/* Infinite marquee */}
            <div className="marquee-container">
                <div className="flex animate-marquee">
                    {ITEMS.map((item, i) => (
                        <Tag key={i} {...item} />
                    ))}
                </div>
            </div>
        </section>
    )
}
