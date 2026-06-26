import { useEffect } from 'react'
import { CheckCircle2, X, XCircle } from 'lucide-react'
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
        className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white ${
          type === 'success' ? 'bg-emerald-700' : 'bg-rose-700'
        }`}
      >
        {type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        <span>{message}</span>
        <button onClick={clear} className="ml-2 text-white/80 hover:text-white" aria-label="Close">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
