'use client'

import React, { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'

export function BackgroundMotion() {
    const { scrollYProgress } = useScroll()

    // Mouse position for interactive parallax
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Spring animations for smoothness
    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
    const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig)
    const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig)

    // Scroll-linked parallax and scale
    const scrollY = useTransform(scrollYProgress, [0, 1], [0, -150])
    const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.3])
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.15, 0.1])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize mouse position between -0.5 and 0.5
            mouseX.set((e.clientX / window.innerWidth) - 0.5)
            mouseY.set((e.clientY / window.innerHeight) - 0.5)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#0a0a0f]">
            {/* Matrix Layer 1 - Slow Parallax */}
            <motion.div
                style={{ x, y }}
                className="absolute inset-[-10%] w-[120%] h-[120%]"
            >
                <motion.div
                    style={{ y: scrollY, scale, opacity }}
                    className="w-full h-full"
                >
                    <img
                        src="/matrix-bg.png"
                        alt=""
                        className="w-full h-full object-cover blur-[100px] brightness-75 scale-110"
                    />
                </motion.div>
            </motion.div>

            {/* Decorative Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/80 to-[#0a0a0f]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,212,255,0.08),transparent_70%)]" />

            {/* Noise Texture for that premium grainy SaaS feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        </div>
    )
}
