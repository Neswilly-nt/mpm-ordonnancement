/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import * as api from '../services/api'
import type { User } from '../types/auth'

type AuthContextValue = { user: User | null; loading: boolean; signIn: (email: string, password: string) => Promise<void>; signUp: (name: string, email: string, password: string) => Promise<void>; signOut: () => void }
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const expire = () => setUser(null)
    window.addEventListener('mpm-auth-expired', expire)
    if (!localStorage.getItem('mpm_token')) setLoading(false)
    else api.getMe().then(setUser).catch(() => localStorage.removeItem('mpm_token')).finally(() => setLoading(false))
    return () => window.removeEventListener('mpm-auth-expired', expire)
  }, [])
  const accept = (result: Awaited<ReturnType<typeof api.login>>) => { localStorage.setItem('mpm_token', result.access_token); setUser(result.user) }
  return <AuthContext.Provider value={{ user, loading, signIn: async (email, password) => accept(await api.login(email, password)), signUp: async (name, email, password) => accept(await api.register(name, email, password)), signOut: () => { localStorage.removeItem('mpm_token'); setUser(null) } }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider manquant')
  return value
}
