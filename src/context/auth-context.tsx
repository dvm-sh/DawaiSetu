'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  email: string
  role: 'ADMIN' | 'DONOR' | 'RECIPIENT'
  isActive: boolean
  organization?: {
    id: string
    name: string
    status: string
    type: string
    role: string
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirectUrl?: string }>
  register: (data: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.data)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.data.user)
        const role = data.data.user.role
        const redirectUrl = role === 'ADMIN' ? '/admin' : role === 'DONOR' ? '/donor' : '/recipient'
        return { success: true, redirectUrl }
      }
      return { success: false, error: data.error || 'Login failed' }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const register = async (formData: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        return { success: true }
      }
      return { success: false, error: data.error || 'Registration failed' }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // ignore
    }
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}
