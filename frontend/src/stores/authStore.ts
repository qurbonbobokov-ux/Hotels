import { create } from 'zustand'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'owner' | 'admin'
}

interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '{}')
    : null,
  token: localStorage.getItem('token'),

  login: (user, token) => {
    set({ user, token })
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
  },

  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },

  setUser: (user) => {
    set({ user })
    if (user) localStorage.setItem('user', JSON.stringify(user))
  }
}))
