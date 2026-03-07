import React, { useState, useEffect } from 'react'
import api from '../lib/api'
import { AuthContext } from '@/lib/useAuth'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )
  const [loading, setLoading] = useState(true)

  const login = (newToken: string, loggedInUser: User) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(loggedInUser)
  }

  const logout = React.useCallback(async () => {
    try {
      if (token) {
        await api.post('/logout')
      }
    } finally {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }, [token])

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/me')
          setUser(res.data)
        } catch {
          logout()
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [token, logout])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
