import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { authApi } from '../services/api'
import { useAuthStore } from '../stores/authStore'

export default function Register() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const registerMutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) =>
      authApi.register(data.name, data.email, data.password),
    onSuccess: (response) => {
      const { user, token } = response.data
      login(user, token)
      navigate('/')
    },
    onError: () => {
      setError(t('register.failed'))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordMismatch'))
      return
    }

    if (formData.password.length < 6) {
      setError(t('register.passwordShort'))
      return
    }

    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    })
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card card-body p-8!">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🏨</div>
            <h1 className="text-2xl font-bold text-app mb-1">{t('register.title')}</h1>
            <p className="text-muted">{t('register.subtitle')}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">{t('common.fullName')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input"
                placeholder={t('register.namePlaceholder')}
              />
            </div>

            <div>
              <label className="label">{t('common.emailAddress')}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="input"
                placeholder={t('common.emailPlaceholder')}
              />
            </div>

            <div>
              <label className="label">{t('common.password')}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="input"
                placeholder={t('register.passwordPlaceholder')}
              />
            </div>

            <div>
              <label className="label">{t('register.confirmPassword')}</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="input"
                placeholder={t('register.confirmPlaceholder')}
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-muted cursor-pointer">
              <input type="checkbox" required className="w-4 h-4 rounded accent-indigo-500" />
              <span>{t('common.agreeTerms')}</span>
            </label>

            <button type="submit" disabled={registerMutation.isPending} className="btn-primary btn-block">
              {registerMutation.isPending ? t('register.creating') : t('register.create')}
            </button>
          </form>

          <p className="text-center mt-8 text-muted">
            {t('register.haveAccount')}{' '}
            <Link to="/login" className="text-accent hover:text-accent font-bold">
              {t('register.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
