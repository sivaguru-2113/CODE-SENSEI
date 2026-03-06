'use client'

import { SettingsProvider } from '@/frontend/components/SettingsContext'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SettingsProvider>
            {children}
        </SettingsProvider>
    )
}
