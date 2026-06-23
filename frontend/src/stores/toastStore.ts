import { create } from 'zustand'

type ToastType = 'success' | 'error'

interface ToastState {
  message: string | null
  type: ToastType
  show: (message: string, type?: ToastType) => void
  clear: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'success',
  show: (message, type = 'success') => set({ message, type }),
  clear: () => set({ message: null }),
}))

export const toast = {
  success: (message: string) => useToastStore.getState().show(message, 'success'),
  error: (message: string) => useToastStore.getState().show(message, 'error'),
}
