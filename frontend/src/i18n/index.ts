import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ru from './locales/ru.json'
import tg from './locales/tg.json'

export const LANGUAGES = ['en', 'ru', 'tg'] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEY = 'lang'

function detectLanguage(): Language {
  const stored = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Language | null
  if (stored && LANGUAGES.includes(stored)) return stored
  const browser = (typeof navigator !== 'undefined' && navigator.language.slice(0, 2)) as Language
  return LANGUAGES.includes(browser) ? browser : 'en'
}

const initialLanguage = detectLanguage()

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    tg: { translation: tg },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

if (typeof document !== 'undefined') document.documentElement.lang = initialLanguage

export function setLanguage(lang: Language) {
  localStorage.setItem(STORAGE_KEY, lang)
  i18n.changeLanguage(lang)
  if (typeof document !== 'undefined') document.documentElement.lang = lang
}

export default i18n
