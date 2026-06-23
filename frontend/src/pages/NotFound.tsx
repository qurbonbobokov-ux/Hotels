import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Compass } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <span className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 text-white mb-6">
          <Compass size={28} />
        </span>
        <p className="font-display text-6xl font-bold gradient-text mb-2">404</p>
        <h1 className="text-2xl font-bold text-app mb-2">{t('notFound.title')}</h1>
        <p className="text-muted mb-6">{t('notFound.text')}</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">{t('notFound.backHome')}</Link>
          <Link to="/search" className="btn-secondary">{t('notFound.browseHotels')}</Link>
        </div>
      </div>
    </div>
  )
}
