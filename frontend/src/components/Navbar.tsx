import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Hotel, CalendarCheck, Heart, LayoutDashboard, LogOut, Menu, X, Sun, Moon, Sparkles } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import LanguageSwitcher from './LanguageSwitcher'

function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggle } = useThemeStore()
  return (
    <button
      onClick={toggle}
      className="btn-secondary px-3! py-2!"
      aria-label={t('nav.toggleTheme')}
      title={theme === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default function Navbar() {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  const navLinkClass = (path: string) =>
    `flex items-center gap-1.5 font-medium transition-colors ${
      isActive(path) ? 'text-accent' : 'text-muted hover:text-app'
    }`

  const links = (
    <>
      <Link to="/" className={navLinkClass('/')} onClick={() => setMenuOpen(false)}>
        {t('nav.home')}
      </Link>
      <Link to="/search" className={navLinkClass('/search')} onClick={() => setMenuOpen(false)}>
        {t('nav.hotels')}
      </Link>
      <Link to="/tours" className={navLinkClass('/tours')} onClick={() => setMenuOpen(false)}>
        {t('nav.tours')}
      </Link>
      <Link to="/assistant" className={navLinkClass('/assistant')} onClick={() => setMenuOpen(false)}>
        <Sparkles size={16} /> {t('nav.assistant')}
      </Link>
      {user && (
        <Link to="/my-bookings" className={navLinkClass('/my-bookings')} onClick={() => setMenuOpen(false)}>
          <CalendarCheck size={16} /> {t('nav.myBookings')}
        </Link>
      )}
      {user && (
        <Link to="/favorites" className={navLinkClass('/favorites')} onClick={() => setMenuOpen(false)}>
          <Heart size={16} /> {t('nav.favorites')}
        </Link>
      )}
      {user?.role === 'admin' && (
        <Link to="/admin" className={navLinkClass('/admin')} onClick={() => setMenuOpen(false)}>
          <LayoutDashboard size={16} /> {t('nav.admin')}
        </Link>
      )}
    </>
  )

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-900/40">
            <Hotel size={18} />
          </span>
          <span className="font-display text-xl font-bold text-app">Tajikistan<span className="gradient-text">Hotels</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-7 items-center">
          {links}
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4 pl-5 border-l border-app">
              <Link to="/profile" className={navLinkClass('/profile')}>
                {user.name}
              </Link>
              <button onClick={handleLogout} className="btn-secondary px-4! py-2!">
                <LogOut size={16} /> {t('common.logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className={navLinkClass('/login')}>
                {t('common.login')}
              </Link>
              <Link to="/register" className="btn-primary px-5! py-2!">
                {t('common.register')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            className="text-app p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t('nav.toggleMenu')}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-app px-6 py-4 flex flex-col gap-4">
          {links}
          {user && (
            <Link to="/profile" className={navLinkClass('/profile')} onClick={() => setMenuOpen(false)}>
              {t('nav.profile')}
            </Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="btn-secondary">
              <LogOut size={16} /> {t('common.logout')} ({user.name})
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" className={navLinkClass('/login')} onClick={() => setMenuOpen(false)}>
                {t('common.login')}
              </Link>
              <Link to="/register" className="btn-primary" onClick={() => setMenuOpen(false)}>
                {t('common.register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
