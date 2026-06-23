import { create } from 'zustand'

type Theme = 'dark' | 'light'

function applyTheme(theme: Theme) {
  const el = document.documentElement
  el.classList.toggle('light', theme === 'light')
  el.classList.toggle('dark', theme === 'dark')
}

const stored = (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) as Theme | null
const initialTheme: Theme = stored ?? 'dark'
applyTheme(initialTheme)

interface ThemeState {
  theme: Theme
  toggle: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  toggle: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    applyTheme(next)
    set({ theme: next })
  },
}))
