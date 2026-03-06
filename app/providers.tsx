'use client'

import { SettingsProvider } from '@/frontend/components/SettingsContext'
import { AuthProvider } from '@/frontend/components/AuthContext'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SettingsProvider>
                {children}
            </SettingsProvider>
        </AuthProvider>
    )
}
