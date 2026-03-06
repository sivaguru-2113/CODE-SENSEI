'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    logout: () => void
    updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MOCK_USER: User = {
    id: 'user_123',
    name: 'Sivaguru',
    email: 'sivaguru@code-sensei.io',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sivaguru',
    joinedAt: '2024-03-01',
    totalAnalyses: 42
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('cs_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email: string, name: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        const freshUser = { ...MOCK_USER, email, name }
        setUser(freshUser)
        localStorage.setItem('cs_user', JSON.stringify(freshUser))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('cs_user')
        window.location.href = '/'
    }

    const updateProfile = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates }
            setUser(updatedUser)
            localStorage.setItem('cs_user', JSON.stringify(updatedUser))
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
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
