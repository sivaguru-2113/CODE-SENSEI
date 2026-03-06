'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, useInView } from 'framer-motion'

interface AnimatedNumberProps {
    value: number
    duration?: number
    className?: string
    prefix?: string
    suffix?: string
}

export function AnimatedNumber({
    value,
    duration = 2000,
    className = "",
    prefix = "",
    suffix = ""
}: AnimatedNumberProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    // Spring animation for smooth counting
    const springValue = useSpring(0, {
        stiffness: 80,
        damping: 30,
        mass: 1,
        duration: duration,
    })

    // Transform spring value to rounded integer string
    const displayValue = useTransform(springValue, (current) =>
        Math.round(current).toString()
    )

    useEffect(() => {
        if (isInView) {
            springValue.set(value)
        }
    }, [isInView, value, springValue])

    return (
        <span className={className}>
            {prefix}
            <motion.span ref={ref}>{displayValue}</motion.span>
            {suffix}
        </span>
    )
}
