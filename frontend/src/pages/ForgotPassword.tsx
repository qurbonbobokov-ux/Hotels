import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSent(true)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card card-body p-8!">
          <div className="text-center mb-6">
            <span className="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 text-white mb-3">
              <Mail size={22} />
            </span>
            <h1 className="font-display text-2xl font-bold text-app">{t('forgot.title')}</h1>
            <p className="text-muted text-sm mt-1">{t('forgot.subtitle')}</p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="badge-green mb-4">{t('forgot.emailSent')}</div>
              <p className="text-muted text-sm mb-6">
                {t('forgot.sentBefore')} <span className="text-app font-semibold">{email}</span>{t('forgot.sentAfter')}
              </p>
              <Link to="/login" className="btn-primary btn-block">{t('forgot.backToLogin')}</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="label">{t('common.emailAddress')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                  placeholder={t('common.emailPlaceholder')}
                />
              </div>
              <button type="submit" className="btn-primary btn-block">{t('forgot.sendLink')}</button>
            </form>
          )}

          <Link to="/login" className="flex items-center justify-center gap-1 text-subtle hover:text-app text-sm mt-6">
            <ArrowLeft size={14} /> {t('forgot.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  )
}
