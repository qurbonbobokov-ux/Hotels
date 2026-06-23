import { useEffect } from 'react'
import { useToastStore } from '../stores/toastStore'

export default function Toaster() {
  const { message, type, clear } = useToastStore()

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(clear, 3000)
    return () => clearTimeout(timer)
  }, [message, clear])

  if (!message) return null

  return (
    <div className="fixed top-20 right-6 z-[100] animate-[fadeIn_0.2s_ease-out]">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-app ${
          type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}
      >
        <span className="font-semibold">{type === 'success' ? '✓' : '✕'}</span>
        <span>{message}</span>
        <button onClick={clear} className="ml-2 text-app/80 hover:text-app">
          ✕
        </button>
      </div>
    </div>
  )
}
