import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Hotel, Mail, Phone, MapPin, Heart } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-white/8">
      {/* Top gradient accent line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 md:px-12 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-16 mb-14">

            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-900/40">
                  <Hotel size={18} />
                </span>
                <span className="font-display text-xl font-bold text-white">
                  Tajikistan<span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Hotels</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                {t('footer.tagline')}
              </p>
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="mailto:support@tajhotels.com"
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  <Mail size={14} /> support@tajhotels.com
                </a>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <Phone size={14} /> +992 (50) 101-12-77
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <MapPin size={14} /> Rudaki Avenue, Dushanbe
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">{t('footer.explore')}</h3>
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
                    <Link to={to} className="text-slate-400 text-sm hover:text-indigo-300 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">{t('footer.contactHeading')}</h3>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:support@tajhotels.com" className="flex items-center gap-2 text-slate-400 text-sm hover:text-indigo-300 transition-colors">
                    <Mail size={14} className="text-indigo-400 shrink-0" />
                    support@tajhotels.com
                  </a>
                </li>
                <li>
                  <a href="tel:+99250101277" className="flex items-center gap-2 text-slate-400 text-sm hover:text-indigo-300 transition-colors">
                    <Phone size={14} className="text-indigo-400 shrink-0" />
                    +992 (50) 101-12-77
                  </a>
                </li>
                <li className="flex items-start gap-2 text-slate-400 text-sm">
                  <MapPin size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                  Rudaki Avenue, Dushanbe, Tajikistan
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-xs">
              {t('footer.rights', { year })}
            </p>
            <p className="text-slate-600 text-xs flex items-center gap-1">
              Made with <Heart size={11} className="text-rose-500 fill-rose-500" /> for Tajikistan
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
