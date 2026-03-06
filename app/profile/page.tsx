'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Code, BarChart3, Award, Settings, LogOut, Camera } from 'lucide-react'
import { useAuth } from '@/frontend/components/AuthContext'
import { DashboardLayout } from '@/frontend/components/DashboardLayout'

export default function ProfilePage() {
    const { user, logout } = useAuth()

    if (!user) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-white/40">Please log in to view your profile.</p>
                </div>
            </DashboardLayout>
        )
    }

    const stats = [
        { label: 'Analyses', value: user.totalAnalyses, icon: BarChart3, color: 'text-cyan-400' },
        { label: 'Lines Scanned', value: '12.4k', icon: Code, color: 'text-indigo-400' },
        { label: 'Mastery Rank', value: 'Sensei', icon: Award, color: 'text-purple-400' },
    ]

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -z-10" />

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/30 p-1 bg-black/40">
                                <img
                                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full shadow-lg hover:bg-cyan-400 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/50">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Joined {user.joinedAt}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm">
                                <Settings className="w-4 h-4" />
                                Edit Profile
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 text-red-400 transition-all text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-4"
                        >
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Achievement Timeline (Placeholder) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8"
                >
                    <h2 className="text-xl font-semibold text-white mb-6">Recent Mastery Achievements</h2>
                    <div className="space-y-6">
                        {[
                            { date: 'Yesterday', title: 'Complexity Crusher', desc: 'Optimized an O(n²) algorithm to O(n log n).', icon: Zap },
                            { date: '3 days ago', title: 'Clean Sweep', desc: 'Resolved 10+ architectural code smells in a single file.', icon: ShieldCheck },
                            { date: 'Last week', title: 'Language Polyglot', desc: 'Analyzed code in 4 different programming languages.', icon: Globe },
                        ].map((achievement, idx) => (
                            <div key={idx} className="flex gap-4 group">
                                <div className="relative flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center z-10">
                                        <achievement.icon className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    {idx !== 2 && <div className="w-px h-full bg-white/10 absolute top-10" />}
                                </div>
                                <div className="flex-grow pb-6">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{achievement.date}</p>
                                    <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">{achievement.title}</h3>
                                    <p className="text-white/50 text-sm mt-1">{achievement.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    )
}

function Zap(props: any) {
    return <BarChart3 {...props} /> // Placeholder
}

function ShieldCheck(props: any) {
    return <Award {...props} /> // Placeholder
}

function Globe(props: any) {
    return <BarChart3 {...props} /> // Placeholder
}
