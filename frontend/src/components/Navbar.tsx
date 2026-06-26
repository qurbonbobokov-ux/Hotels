import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Hotel, CalendarCheck, Heart, LayoutDashboard, LogOut, Menu, X, Sun, Moon, Sparkles, UserRound } from 'lucide-react'
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
    `nav-link flex items-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
      isActive(path) ? 'nav-link-active' : ''
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5 min-w-0" onClick={() => setMenuOpen(false)}>
          <span className="icon-tile w-9 h-9 text-white" style={{ background: 'linear-gradient(135deg, var(--accent-strong), var(--brand))' }}>
            <Hotel size={18} />
          </span>
          <span className="font-display text-lg sm:text-xl font-bold text-app truncate">Tajikistan<span className="gradient-text">Hotels</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex gap-5 xl:gap-6 items-center">
          {links}
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-app">
              <Link to="/profile" className={navLinkClass('/profile')}>
                <UserRound size={16} /> {user.name}
              </Link>
              <button onClick={handleLogout} className="nav-icon-button" aria-label={t('common.logout')} title={t('common.logout')}>
                <LogOut size={17} />
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
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            className="nav-icon-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t('nav.toggleMenu')}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden mobile-nav-panel">
          <div className="mobile-nav-links">{links}</div>
          {user && (
            <Link to="/profile" className={navLinkClass('/profile')} onClick={() => setMenuOpen(false)}>
              <UserRound size={16} /> {t('nav.profile')}
            </Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="btn-secondary">
              <LogOut size={16} /> {t('common.logout')} ({user.name})
            </button>
          ) : (
            <div className="mobile-nav-actions">
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
