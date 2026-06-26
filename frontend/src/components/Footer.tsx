import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Hotel, Mail, Phone, MapPin, Heart } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer mt-20 border-t border-app">
      {/* Top gradient accent line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />

      <div className="surface-solid backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_0.8fr_1fr] gap-12 lg:gap-20 mb-14">

            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="icon-tile w-9 h-9 text-white" style={{ background: 'linear-gradient(135deg, var(--accent-strong), var(--brand))' }}>
                  <Hotel size={18} />
                </span>
                <span className="font-display text-xl font-bold text-app">
                  Tajikistan<span className="gradient-text">Hotels</span>
                </span>
              </div>
              <p className="text-muted text-sm leading-relaxed max-w-xs">
                {t('footer.tagline')}
              </p>
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="mailto:support@tajhotels.com"
                  className="footer-link text-xs"
                >
                  <Mail size={14} /> support@tajhotels.com
                </a>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-subtle">
                <Phone size={14} /> +992 (50) 101-12-77
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-subtle">
                <MapPin size={14} /> Rudaki Avenue, Dushanbe
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-app font-semibold mb-5 text-sm uppercase tracking-wider">{t('footer.explore')}</h3>
              <ul className="space-y-3">
                {[
                  { to: '/', label: t('nav.home') },
                  { to: '/search', label: t('nav.hotels') },
                  { to: '/tours', label: t('nav.tours') },
                  { to: '/assistant', label: t('nav.assistant') },
                  { to: '/about', label: t('nav.about') },
                  { to: '/contact', label: t('nav.contact') },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="footer-link text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-app font-semibold mb-5 text-sm uppercase tracking-wider">{t('footer.contactHeading')}</h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:support@tajhotels.com" className="footer-link text-sm">
                    <Mail size={14} className="text-accent shrink-0" />
                    support@tajhotels.com
                  </a>
                </li>
                <li>
                  <a href="tel:+992501011277" className="footer-link text-sm">
                    <Phone size={14} className="text-accent shrink-0" />
                    +992 (50) 101-12-77
                  </a>
                </li>
                <li className="flex items-start gap-2 text-muted text-sm">
                  <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
                  Rudaki Avenue, Dushanbe, Tajikistan
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-app pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-subtle text-xs">
              {t('footer.rights', { year })}
            </p>
            <p className="text-subtle text-xs flex items-center gap-1">
              Made with <Heart size={11} className="text-rose-500 fill-rose-500" /> for Tajikistan
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
