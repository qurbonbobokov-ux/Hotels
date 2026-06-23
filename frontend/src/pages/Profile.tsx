import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { CalendarCheck, Heart, CheckCircle2, Wallet, LogOut, Search, LayoutDashboard, Star, Settings as SettingsIcon } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { bookingsApi, favoritesApi } from '../services/api'

interface Booking { status: string; totalPrice: number }

export default function Profile() {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const { data: bookingsRes } = useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => bookingsApi.getMyBookings(),
    enabled: !!user,
  })
  const { data: favRes } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.getAll(),
    enabled: !!user,
  })

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card card-body text-center">
          <p className="text-muted mb-4">{t('profile.loginPrompt')}</p>
          <button onClick={() => navigate('/login')} className="btn-primary">{t('common.logIn')}</button>
        </div>
      </div>
    )
  }

  const bookings: Booking[] = bookingsRes?.data ?? []
  const confirmed = bookings.filter((b) => b.status === 'Confirmed')
  const totalSpent = confirmed.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
  const favorites = favRes?.data ?? []
  const initials = user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  const stats = [
    { icon: CalendarCheck, label: t('profile.statBookings'), value: bookings.length },
    { icon: CheckCircle2, label: t('profile.statConfirmed'), value: confirmed.length },
    { icon: Wallet, label: t('profile.statTotalSpent'), value: `$${totalSpent}` },
    { icon: Heart, label: t('profile.statSaved'), value: favorites.length },
  ]

  const links = [
    { to: '/my-bookings', icon: CalendarCheck, label: t('profile.linkBookingsLabel'), desc: t('profile.linkBookingsDesc') },
    { to: '/favorites', icon: Heart, label: t('profile.linkFavoritesLabel'), desc: t('profile.linkFavoritesDesc') },
    { to: '/my-reviews', icon: Star, label: t('profile.linkReviewsLabel'), desc: t('profile.linkReviewsDesc') },
    { to: '/settings', icon: SettingsIcon, label: t('profile.linkSettingsLabel'), desc: t('profile.linkSettingsDesc') },
    { to: '/search', icon: Search, label: t('profile.linkFindLabel'), desc: t('profile.linkFindDesc') },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="card card-body flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
        <div className="grid place-items-center w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 text-white text-xl font-bold shrink-0">
          {initials || 'U'}
        </div>
        <div className="grow">
          <h1 className="font-display text-2xl font-bold text-app">{user.name}</h1>
          <p className="text-muted">{user.email}</p>
          <span className="badge-gray mt-2">{t(`role.${user.role}`, user.role)}</span>
        </div>
        <button onClick={() => { logout(); navigate('/') }} className="btn-secondary">
          <LogOut size={16} /> {t('common.logout')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card card-body">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500/20 to-cyan-500/20 text-accent mb-3">
              <s.icon size={18} />
            </span>
            <p className="text-2xl font-bold text-app">{s.value}</p>
            <p className="text-subtle text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="section-title text-2xl! mb-4">{t('profile.quickActions')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="card card-hover card-body flex items-start gap-4">
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-linear-to-br from-indigo-500/20 to-cyan-500/20 text-accent">
              <l.icon size={20} />
            </span>
            <div>
              <h3 className="font-bold text-app mb-1">{l.label}</h3>
              <p className="text-muted text-sm">{l.desc}</p>
            </div>
          </Link>
        ))}
        {user.role === 'admin' && (
          <Link to="/admin" className="card card-hover card-body flex items-start gap-4">
            <span className="grid place-items-center w-11 h-11 shrink-0 rounded-xl bg-linear-to-br from-indigo-500/20 to-cyan-500/20 text-accent">
              <LayoutDashboard size={20} />
            </span>
            <div>
              <h3 className="font-bold text-app mb-1">{t('profile.linkAdminLabel')}</h3>
              <p className="text-muted text-sm">{t('profile.linkAdminDesc')}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
