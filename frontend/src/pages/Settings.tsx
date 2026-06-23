import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, User, KeyRound } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { authApi } from '../services/api'
import { toast } from '../stores/toastStore'

export default function Settings() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')

  const changePw = useMutation({
    mutationFn: () => authApi.changePassword(current, next),
    onSuccess: () => {
      toast.success(t('toast.passwordUpdated'))
      setCurrent('')
      setNext('')
    },
    onError: () => toast.error(t('toast.passwordError')),
  })

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card card-body text-center">
          <p className="text-muted mb-4">{t('settings.loginPrompt')}</p>
          <button onClick={() => navigate('/login')} className="btn-primary">{t('common.logIn')}</button>
        </div>
      </div>
    )
  }

  const submitPw = (e: React.FormEvent) => {
    e.preventDefault()
    if (next.length < 6) return toast.error(t('toast.newPasswordShort'))
    changePw.mutate()
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-app mb-6">{t('settings.title')}</h1>

      {/* Account */}
      <div className="card card-body mb-6">
        <h2 className="flex items-center gap-2 font-bold text-app mb-4"><User size={18} className="text-accent" /> {t('settings.account')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="label">{t('common.name')}</p>
            <p className="text-app font-medium">{user.name}</p>
          </div>
          <div>
            <p className="label">{t('common.email')}</p>
            <p className="text-app font-medium">{user.email}</p>
          </div>
          <div>
            <p className="label">{t('settings.role')}</p>
            <span className="badge-gray">{t(`role.${user.role}`, user.role)}</span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card card-body mb-6">
        <h2 className="font-bold text-app mb-4">{t('settings.appearance')}</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-app font-medium">{t('settings.theme')}</p>
            <p className="text-subtle text-sm">{t('settings.currentMode', { mode: t(`theme.${theme}`) })}</p>
          </div>
          <button onClick={toggle} className="btn-secondary">
            {theme === 'dark' ? <><Sun size={16} /> {t('settings.light')}</> : <><Moon size={16} /> {t('settings.dark')}</>}
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="card card-body">
        <h2 className="flex items-center gap-2 font-bold text-app mb-4"><KeyRound size={18} className="text-accent" /> {t('settings.changePassword')}</h2>
        <form onSubmit={submitPw} className="space-y-4">
          <div>
            <label className="label">{t('settings.currentPassword')}</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required className="input" />
          </div>
          <div>
            <label className="label">{t('settings.newPassword')}</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} required className="input" placeholder={t('register.passwordPlaceholder')} />
          </div>
          <button type="submit" disabled={changePw.isPending} className="btn-primary">
            {changePw.isPending ? t('settings.updating') : t('settings.updatePassword')}
          </button>
        </form>
      </div>
    </div>
  )
}
