import React from 'react'

export function LogoIcon({ className = "w-8 h-8", style }: { className?: string, style?: React.CSSProperties }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            style={style}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
            </defs>

            {/* Graduation Cap Code Logo */}

            {/* < / > Top Mortarboard parts */}
            <g fill="url(#logoGradient)">
                {/* Left '<' */}
                <polygon points="40,26 8,45 40,64 40,52 23,45 40,38" />

                {/* Right '>' */}
                <polygon points="60,26 92,45 60,64 60,52 77,45 60,38" />

                {/* Middle '/' */}
                <polygon points="46,65 52,65 54,25 48,25" />
            </g>

            {/* Skull Cap Base */}
            <g stroke="url(#logoGradient)" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 38 60 V 68 Q 50 78 62 68 V 60" />
            </g>

            {/* Tassel */}
            <g>
                <line x1="72" y1="56" x2="72" y2="76" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="72" cy="78" r="3" fill="url(#logoGradient)" />
                <polygon points="68,88 76,88 72,78" fill="url(#logoGradient)" strokeLinejoin="round" />
            </g>
        </svg>
    )
}
