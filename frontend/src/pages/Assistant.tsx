import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, Send, MapPin, Star, Volume2, Mic, Square } from 'lucide-react'
import { hotelImage } from '../lib/images'
import { getAssistantReply, type ChatMessage } from '../lib/assistant'
import { speak, stopSpeaking, startListening, isSpeechSynthesisSupported, isSpeechRecognitionSupported } from '../lib/speech'
import { toast } from '../stores/toastStore'

export default function Assistant() {
  const { t } = useTranslation()
  const suggestions = t('assistant.suggestions', { returnObjects: true }) as string[]
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: t('assistant.greeting') },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState<number | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

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
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="grid place-items-center w-11 h-11 rounded-xl bg-linear-to-br from-indigo-500 to-cyan-500 text-white">
          <Sparkles size={20} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-app">{t('assistant.title')}</h1>
          <p className="text-subtle text-sm">{t('assistant.subtitle')}</p>
        </div>
      </div>

      <div className="card card-body min-h-[55vh] flex flex-col">
        <div className="grow space-y-4 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
              <div className={`inline-flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`inline-block max-w-[85%] px-4 py-2.5 rounded-2xl whitespace-pre-line ${m.role === 'user' ? 'bg-linear-to-r from-indigo-500 to-violet-600 text-white' : 'surface-2 text-app'
                  }`}>
                  {m.text}
                </div>
                {m.role === 'assistant' && isSpeechSynthesisSupported() && (
                  <button
                    onClick={() => handleSpeak(m.text, i)}
                    className={`p-2 rounded-full transition ${speaking === i ? 'bg-indigo-500 text-white' : 'hover:bg-surface-1'
                      }`}
                    title="Listen"
                  >
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
              {m.hotels && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  {m.hotels.map((h) => (
                    <Link key={h.id} to={`/hotel/${h.id}`} className="card card-hover overflow-hidden text-left">
                      <img src={hotelImage(h.images?.[0], h.id)} alt={h.name} className="w-full h-24 object-cover" />
                      <div className="p-3">
                        <p className="font-semibold text-app text-sm truncate">{h.name}</p>
                        <p className="flex items-center gap-1 text-subtle text-xs mt-0.5"><MapPin size={11} /> {h.city}</p>
                        <div className="flex items-center justify-between mt-1">
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
          {loading && <div className="surface-2 text-subtle inline-block px-4 py-2.5 rounded-2xl">{t('assistant.thinking')}</div>}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="badge-gray hover:text-app transition">{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('assistant.placeholder')}
            className="input"
          />
          {isSpeechRecognitionSupported() && (
            <button
              type="button"
              onClick={handleListen}
              disabled={loading || listening}
              className={`px-4 py-2 rounded transition ${listening ? 'bg-red-500 text-white' : 'btn-primary'
                }`}
              title="Listen"
            >
              {listening ? <Square size={18} /> : <Mic size={18} />}
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-primary px-5!"><Send size={18} /></button>
        </form>
      </div>
    </div>
  )
}
