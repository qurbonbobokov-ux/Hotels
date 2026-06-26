import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, Globe2, Sparkles, HeartHandshake } from 'lucide-react'

export default function About() {
  const { t } = useTranslation()

  const VALUES = [
    { icon: ShieldCheck, title: t('about.valueTrustedTitle'), text: t('about.valueTrustedText') },
    { icon: Globe2, title: t('about.valueLocalTitle'), text: t('about.valueLocalText') },
    { icon: Sparkles, title: t('about.valueModernTitle'), text: t('about.valueModernText') },
    { icon: HeartHandshake, title: t('about.valueHelpTitle'), text: t('about.valueHelpText') },
  ]

  const STATS = [
    { value: '500+', label: t('about.statHotels') },
    { value: '12', label: t('about.statCities') },
    { value: '50k+', label: t('about.statGuests') },
    { value: '4.8★', label: t('about.statRating') },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="page-header">
        <div className="page-header-inner text-center">
          <h1 className="font-display text-4xl font-bold mb-3">{t('about.title')}</h1>
          <p className="text-emerald-50 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {STATS.map((s) => (
            <div key={s.label} className="card card-body text-center">
              <p className="font-display text-3xl font-bold gradient-text">{s.value}</p>
              <p className="text-subtle text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
            alt="Hotel lobby"
            className="w-full h-72 object-cover rounded-lg"
          />
          <div>
            <p className="text-accent font-semibold mb-2">{t('about.ourMission')}</p>
            <h2 className="section-title mb-4">{t('about.missionTitle')}</h2>
            <p className="text-muted leading-relaxed mb-4">
              {t('about.missionText')}
            </p>
            <Link to="/search" className="btn-primary">{t('about.exploreHotels')}</Link>
          </div>
        </div>

        {/* Values */}
        <h2 className="section-title text-center mb-8">{t('about.whyChoose')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="card card-body">
              <span className="icon-tile w-11 h-11 mb-4">
                <v.icon size={20} />
              </span>
              <h3 className="font-bold text-app mb-1">{v.title}</h3>
              <p className="text-muted text-sm">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
