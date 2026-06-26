import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MessageCircle, X, Send, Sparkles, Star, Volume2, Mic, Square } from 'lucide-react'
import { getAssistantReply, type ChatMessage } from '../lib/assistant'
import { hotelImage } from '../lib/images'
import { speak, stopSpeaking, startListening, isSpeechSynthesisSupported, isSpeechRecognitionSupported } from '../lib/speech'
import { toast } from '../stores/toastStore'

export default function ChatWidget() {
  const { t } = useTranslation()
  const suggestions = t('assistant.suggestions', { returnObjects: true }) as string[]
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: t('chat.greeting') },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState<number | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, open])

  const handleSpeak = async (text: string, index: number) => {
    if (!isSpeechSynthesisSupported()) {
      toast.error('Speech synthesis not supported')
      return
    }

    if (speaking === index) {
      stopSpeaking()
      setSpeaking(null)
    } else {
      setSpeaking(index)
      try {
        await speak(text, { lang: 'en-US', rate: 0.9 })
      } catch {
        toast.error('Failed to play speech')
      } finally {
        setSpeaking(null)
      }
    }
  }

  const handleListen = async () => {
    if (!isSpeechRecognitionSupported()) {
      toast.error('Speech recognition not supported')
      return
    }

    setListening(true)
    try {
      const text = await startListening({ lang: 'en-US' })
      if (text) {
        setInput(text)
        toast.success('Recognized: ' + text)
      }
    } catch (e) {
      if (String(e).includes('No speech')) {
        toast.error('No speech detected. Try again.')
      } else {
        toast.error('Failed to recognize speech')
      }
    } finally {
      setListening(false)
    }
  }

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)
    try {
      const reply = await getAssistantReply(text)
      setMessages((m) => [...m, { role: 'assistant', ...reply }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: t('assistant.error') }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('chat.openAria')}
        className="fixed bottom-5 right-5 z-50 grid place-items-center w-14 h-14 rounded-full text-white shadow-xl hover:scale-105 transition"
        style={{ background: 'linear-gradient(135deg, var(--accent-strong), var(--brand))' }}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 max-h-[70vh] flex flex-col card overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 text-white" style={{ background: 'linear-gradient(135deg, var(--accent-strong), var(--brand))' }}>
            <Sparkles size={18} />
            <div className="grow">
              <p className="font-bold leading-none">{t('chat.title')}</p>
              <p className="text-xs text-white/80 mt-0.5">{t('chat.online')}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t('chat.closeAria')}><X size={18} /></button>
          </div>

          {/* Messages */}
          <div className="grow overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
                <div className={`inline-flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`inline-block max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${m.role === 'user' ? 'text-white' : 'surface-2 text-app'
                      }`}
                    style={m.role === 'user' ? { background: 'linear-gradient(135deg, var(--accent-strong), var(--brand))' } : undefined}
                  >
                    {m.text}
                  </div>
                  {m.role === 'assistant' && isSpeechSynthesisSupported() && (
                    <button
                      onClick={() => handleSpeak(m.text, i)}
                      className={`p-1.5 rounded-lg transition ${speaking === i ? 'text-white' : 'hover:surface-2'
                        }`}
                      style={speaking === i ? { background: 'var(--accent-strong)' } : undefined}
                      title="Listen"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
                {m.hotels && (
                  <div className="mt-2 space-y-2">
                    {m.hotels.map((h) => (
                      <Link key={h.id} to={`/hotel/${h.id}`} onClick={() => setOpen(false)} className="card card-hover flex items-center gap-3 p-2 text-left">
                        <img src={hotelImage(h.images?.[0], h.id)} alt={h.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-app text-sm truncate">{h.name}</p>
                          <p className="text-subtle text-xs truncate">{h.city}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-accent font-bold text-sm">${h.price}</span>
                            <span className="badge-amber"><Star size={10} className="fill-current" /> {h.rating}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className="surface-2 text-subtle inline-block px-3 py-2 rounded-lg text-sm">{t('assistant.thinking')}</div>}
            <div ref={endRef} />
          </div>

          {/* Suggestions (first time) */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestions.slice(0, 3).map((s) => (
                <button key={s} onClick={() => send(s)} className="badge-gray hover:text-app transition text-left">{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="p-3 border-t border-app flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="input py-2!"
            />
            {isSpeechRecognitionSupported() && (
              <button
                type="button"
                onClick={handleListen}
                disabled={loading || listening}
                className={`px-3 py-2 rounded transition ${listening ? 'bg-red-500 text-white' : 'btn-primary'
                  }`}
                title="Listen"
              >
                {listening ? <Square size={16} /> : <Mic size={16} />}
              </button>
            )}
            <button type="submit" disabled={loading} className="btn-primary px-4! py-2!"><Send size={16} /></button>
          </form>
        </div>
      )}
    </>
  )
}
