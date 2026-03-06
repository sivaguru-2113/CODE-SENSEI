'use client'

import { SettingsProvider } from '@/frontend/components/SettingsContext'
import { AuthProvider } from '@/frontend/components/AuthContext'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthProvider>
                <SettingsProvider>
                    {children}
                </SettingsProvider>
            </AuthProvider>
        </SessionProvider>
    )
}
