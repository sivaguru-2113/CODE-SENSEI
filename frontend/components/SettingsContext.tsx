'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

/* ── Settings Shape (only settings that actually affect the UI) ── */
export interface AppSettings {
    // Analysis
    defaultLanguage: string
    showLineNumbers: boolean
    // Appearance
    fontSize: string
    animationsEnabled: boolean
    compactMode: boolean
    // Results
    showComplexityAnalysis: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
    defaultLanguage: 'python',
    showLineNumbers: true,
    fontSize: '14',
    animationsEnabled: true,
    compactMode: false,
    showComplexityAnalysis: true,
}

/* ── Context ─────────────────────────────────────────────── */
interface SettingsContextType {
    settings: AppSettings
    updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
    resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType>({
    settings: DEFAULT_SETTINGS,
    updateSetting: () => { },
    resetSettings: () => { },
})

/* ── Provider ────────────────────────────────────────────── */
const STORAGE_KEY = 'code-sensei-settings'

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                setSettings({ ...DEFAULT_SETTINGS, ...parsed })
            }
        } catch { }
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (loaded) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) } catch { }
        }
    }, [settings, loaded])

    const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS)
        try { localStorage.removeItem(STORAGE_KEY) } catch { }
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}

/* ── Hook ────────────────────────────────────────────────── */
export function useSettings() {
    return useContext(SettingsContext)
}
