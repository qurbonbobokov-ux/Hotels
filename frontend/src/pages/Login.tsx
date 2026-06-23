import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { authApi } from '../services/api'
import { useAuthStore } from '../stores/authStore'

export default function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authApi.login(data.email, data.password),
    onSuccess: (response) => {
      const { user, token } = response.data
      login(user, token)
      navigate('/')
    },
    onError: () => {
      setError(t('login.invalid'))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card card-body p-8!">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🏨</div>
            <h1 className="text-2xl font-bold text-app mb-1">{t('login.welcome')}</h1>
            <p className="text-muted">{t('login.subtitle')}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">{t('common.password')}</label>
                <Link to="/forgot-password" className="text-accent text-sm hover:text-accent">{t('login.forgot')}</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loginMutation.isPending} className="btn-primary btn-block">
              {loginMutation.isPending ? t('login.signingIn') : t('login.signIn')}
            </button>
          </form>

          <p className="text-center mt-8 text-muted">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-accent hover:text-accent font-bold">
              {t('login.createOne')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
