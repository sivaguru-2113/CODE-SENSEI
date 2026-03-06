import React from 'react'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
    { name: 'Sarah Chen', role: 'Senior Frontend Engineer', company: 'Stripe', avatar: '👩‍💻', quote: 'CODE-SENSEI caught an O(n²) bug before it hit production. Saved us from a major incident.', score: 94, stars: 5 },
    { name: 'Marcus Johnson', role: 'CS Student', company: 'MIT', avatar: '👨‍🎓', quote: 'Went from spaghetti code to clean algorithms in 3 weeks. The AI explanations actually teach, not just flag.', score: 88, stars: 5 },
    { name: 'Priya Patel', role: 'Backend Developer', company: 'Shopify', avatar: '👩‍🔬', quote: 'We use it in our PR review process. Catches complexity issues human reviewers miss under time pressure.', score: 91, stars: 5 },
    { name: 'Alex Torres', role: 'Fullstack Engineer', company: 'Vercel', avatar: '👨‍💻', quote: 'Knowing exact Big-O for every function changed how I approach algorithm design completely.', score: 97, stars: 5 },
    { name: 'Li Wei', role: 'Data Scientist', company: 'Google', avatar: '👨‍🔬', quote: 'My Python code quality jumped after one month. Progress tracking keeps motivation high.', score: 85, stars: 5 },
    { name: 'Emma Rodriguez', role: 'Bootcamp Grad', company: 'Startup', avatar: '👩‍🏫', quote: 'As a bootcamp grad, this bridged the gap between what I learned and what industry expects.', score: 79, stars: 5 },
    { name: 'Raj Mehta', role: 'Tech Lead', company: 'Atlassian', avatar: '👨‍💼', quote: 'Onboarded 3 juniors with CODE-SENSEI. Junior code quality is measurably better now.', score: 92, stars: 5 },
    { name: 'Zoe Kim', role: 'Competitive Programmer', company: 'ICPC Finalist', avatar: '🏆', quote: 'The complexity breakdown is spot-on. I use it to verify my competitive programming solutions.', score: 99, stars: 5 },
]

// Duplicate for seamless infinite scroll
const ROW1 = [...TESTIMONIALS.slice(0, 4), ...TESTIMONIALS.slice(0, 4)]
const ROW2 = [...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(4)]

function Card({ t }: { t: typeof TESTIMONIALS[0] }) {
    return (
        <div className="w-72 shrink-0 mx-3 glass-card rounded-2xl border border-[#1e1e2a] p-5 hover:border-[#00d4ff]/25 transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1a24] flex items-center justify-center text-xl">{t.avatar}</div>
                <div className="flex-1 min-w-0">
                    <div className="text-white font-tech font-bold text-[13px] truncate">{t.name}</div>
                    <div className="text-slate-500 font-sans text-xs truncate">{t.role} · {t.company}</div>
                </div>
                <div className="text-right shrink-0">
                    <div className="text-[#00ff88] font-tech font-bold text-base leading-none">{t.score}</div>
                    <div className="text-slate-600 font-pixel tracking-widest text-[8px] mt-1">SCORE</div>
                </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">&quot;{t.quote}&quot;</p>
            <div className="flex gap-0.5 mt-3">
                {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />)}
            </div>
        </div>
    )
}

export function Testimonials() {
    return (
        <section className="py-28 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#1e1e2a] to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#1e1e2a] to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto px-4 text-center mb-14">
                <p className="font-pixel text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">Testimonials</p>
                <h2 className="text-4xl sm:text-5xl font-tech font-bold text-white mb-5">
                    Loved by <span className="shimmer-text">developers worldwide</span>
                </h2>
                <p className="text-slate-400 font-sans text-lg">From students to senior engineers at top companies.</p>
            </div>

            <div className="space-y-5">
                {/* Row 1 — left scroll */}
                <div className="marquee-container">
                    <div className="flex animate-marquee">
                        {ROW1.map((t, i) => <Card key={i} t={t} />)}
                    </div>
                </div>
                {/* Row 2 — right scroll */}
                <div className="marquee-container">
                    <div className="flex animate-marquee-rev">
                        {ROW2.map((t, i) => <Card key={i} t={t} />)}
                    </div>
                </div>
            </div>
        </section>
    )
}
