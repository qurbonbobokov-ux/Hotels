import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Languages, Check } from 'lucide-react'
import { LANGUAGES, setLanguage, type Language } from '../i18n'

const SHORT: Record<Language, string> = { en: 'EN', ru: 'RU', tg: 'TJ' }

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = (LANGUAGES.includes(i18n.language as Language) ? i18n.language : 'en') as Language

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-secondary px-3! py-2! gap-1.5!"
        aria-label={t('language.label')}
        title={t('language.label')}
      >
        <Languages size={18} />
        <span className="text-sm font-semibold">{SHORT[current]}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 card p-1.5 z-50 shadow-xl">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang)
                setOpen(false)
              }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition ${
                current === lang ? 'text-accent font-semibold' : 'text-app hover:surface-2'
              }`}
            >
              {t(`language.${lang}`)}
              {current === lang && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
