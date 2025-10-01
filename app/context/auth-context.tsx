'use client'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type User = {
  id: string
  username: string
  email: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 检查会话状态
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      }
      catch (error) {
        console.error('Session check failed:', error)
      }
      finally {
        setLoading(false)
      }
    }

    // 如果是登录或注册页面，跳过session检查
    if (pathname === '/login' || pathname === '/register') {
      setLoading(false)
      return
    }

    checkSession()
  }, [pathname])

  const login = (userData: User) => {
    setUser(userData)
    router.push('/chat')
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/login')
    }
    catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined)
    throw new Error('useAuth must be used within an AuthProvider')

  return context
}
