'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

interface User {
    id: string
    name: string
    email: string
    avatar?: string
    joinedAt: string
    totalAnalyses: number
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, name: string) => Promise<void>
    loginWithGoogle: () => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession()
    const loading = status === 'loading'

    const user: User | null = session?.user ? {
        id: (session.user as any).id || 'user_123',
        name: session.user.name || 'Sensei User',
        email: session.user.email || '',
        avatar: session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`,
        joinedAt: '2024-03-01', // Mock joined date
        totalAnalyses: 42 // Mock stats
    } : null

    const login = async (email: string, name: string) => {
        await signIn('credentials', { email, name, callbackUrl: '/analyze' })
    }

    const loginWithGoogle = async () => {
        await signIn('google', { callbackUrl: '/analyze' })
    }

    const logout = () => {
        signOut({ callbackUrl: '/' })
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
