import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  BedDouble,
  Building2,
  Calendar,
  CalendarCheck,
  Compass,
  Headset,
  MapPin,
  Search as SearchIcon,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { hotelsApi } from '../services/api'
import { hotelImage } from '../lib/images'
import type { Hotel } from '../types'
import tajikistanHero from '../assets/tajikistan-hero.png'

const HERO_IMG = tajikistanHero

const DESTINATIONS = [
  {
    city: 'Dushanbe',
    key: 'dushanbe',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=82',
  },
  {
    city: 'Pamir',
    key: 'pamir',
    image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=82',
  },
  {
    city: 'Khujand',
    key: 'khujand',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=82',
  },
  {
    city: 'Penjikent',
    key: 'penjikent',
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=900&q=82',
  },
]

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [city, setCity] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  const { data } = useQuery({ queryKey: ['hotels'], queryFn: () => hotelsApi.getAll() })
  const featured = (data?.data ?? []).slice(0, 3)

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.append('city', city)
    if (checkIn) params.append('checkIn', checkIn)
    if (checkOut) params.append('checkOut', checkOut)
    if (guests) params.append('guests', String(guests))
    navigate(`/search?${params.toString()}`)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-media">
          <img src={HERO_IMG} alt="" />
        </div>
        <div className="home-hero-overlay" />

        <div className="container-app relative z-10">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <div className="hero-kicker">
                <Compass size={16} />
                <span>{t('home.eyebrow')}</span>
              </div>
              <h1 className="hero-title text-white">
                {t('home.heroTitlePre')}{' '}
                <span className="hero-country">{t('home.country')}</span>
              </h1>
              <p className="home-hero-subtitle">{t('home.heroSubtitle')}</p>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('/search')} className="btn-primary">
                  {t('home.exploreStays')} <ArrowRight size={17} />
                </button>
                <button onClick={() => navigate('/assistant')} className="hero-secondary-button">
                  <Sparkles size={17} /> {t('home.planWithAi')}
                </button>
              </div>

              <div className="hero-proof">
                {[
                  { icon: Building2, value: '500+', label: t('about.statHotels') },
                  { icon: Users, value: '50k+', label: t('about.statGuests') },
                  { icon: Star, value: '4.8', label: t('home.averageRating') },
                ].map((item) => (
                  <div key={item.label} className="hero-proof-item">
                    <item.icon size={17} />
                    <div>
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="hero-feature-card">
              <div className="hero-feature-image">
                <img
                  src={tajikistanHero}
                  alt={t('home.pamirEscape')}
                />
                <span className="hero-feature-badge">
                  <Sparkles size={13} /> {t('home.featuredJourney')}
                </span>
              </div>
              <div className="hero-feature-content">
                <div>
                  <p className="hero-feature-location"><MapPin size={13} /> GBAO, Tajikistan</p>
                  <h2>{t('home.pamirEscape')}</h2>
                </div>
                <Link to="/tours" className="hero-feature-link" aria-label={t('home.discoverJourney')}>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </aside>
          </div>

          <form onSubmit={submitSearch} className="home-search">
            <div className="home-search-field home-search-destination">
              <span className="home-search-icon"><MapPin size={19} /></span>
              <label>
                <span>{t('home.destination')}</span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t('home.destinationPlaceholder')}
                />
              </label>
            </div>

            <div className="home-search-field">
              <span className="home-search-icon"><Calendar size={19} /></span>
              <label>
                <span>{t('home.checkIn')}</span>
                <input
                  type="date"
                  min={today}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </label>
            </div>

            <div className="home-search-field">
              <span className="home-search-icon"><CalendarCheck size={19} /></span>
              <label>
                <span>{t('home.checkOut')}</span>
                <input
                  type="date"
                  min={checkIn || today}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </label>
            </div>

            <div className="home-search-field">
              <span className="home-search-icon"><BedDouble size={19} /></span>
              <label>
                <span>{t('home.guests')}</span>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>

            <button type="submit" className="home-search-button">
              <SearchIcon size={18} /> <span>{t('common.search')}</span>
            </button>
          </form>
        </div>
      </section>

      <section className="home-section">
        <div className="container-app">
          <div className="section-heading">
            <div>
              <p className="page-eyebrow">{t('home.destinationEyebrow')}</p>
              <h2 className="section-title">{t('home.destinationTitle')}</h2>
            </div>
            <p className="section-heading-copy">{t('home.destinationCopy')}</p>
          </div>

          <div className="destination-grid">
            {DESTINATIONS.map((destination, index) => (
              <button
                key={destination.city}
                onClick={() => navigate(`/search?city=${destination.city}`)}
                className="destination-card"
              >
                <img src={destination.image} alt={destination.city} />
                <span className="destination-shade" />
                <span className="destination-index">0{index + 1}</span>
                <span className="destination-content">
                  <span className="destination-region">{t(`home.destinations.${destination.key}`)}</span>
                  <strong>{destination.city}</strong>
                  <span className="destination-action">
                    {t('home.discover')} <ArrowRight size={14} />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="home-section home-section-muted">
          <div className="container-app">
            <div className="section-heading">
              <div>
                <p className="page-eyebrow">{t('home.topRated')}</p>
                <h2 className="section-title">{t('home.featured')}</h2>
              </div>
              <Link to="/search" className="section-link">
                {t('common.viewAll')} <ArrowRight size={15} />
              </Link>
            </div>

            <div className="featured-grid">
              {featured.map((hotel: Hotel) => (
                <Link key={hotel.id} to={`/hotel/${hotel.id}`} className="featured-card">
                  <img src={hotelImage(hotel.images?.[0], hotel.id)} alt={hotel.name} />
                  <span className="featured-shade" />
                  <span className="badge-amber featured-rating">
                    <Star size={12} className="fill-current" /> {hotel.rating}
                  </span>
                  <span className="featured-content">
                    <span className="featured-city"><MapPin size={13} /> {hotel.city}</span>
                    <strong>{hotel.name}</strong>
                    <span className="featured-price">
                      ${hotel.price}<small>{t('common.perNight')}</small>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="container-app">
          <div className="trust-panel">
            <div className="trust-intro">
              <span className="icon-tile w-12 h-12"><ShieldCheck size={23} /></span>
              <p className="page-eyebrow">{t('home.whyEyebrow')}</p>
              <h2 className="section-title">{t('home.whyTitle')}</h2>
              <p className="page-copy">{t('home.whyCopy')}</p>
            </div>

            <div className="trust-features">
              {[
                { icon: Wallet, number: '01', title: t('home.feature.priceTitle'), text: t('home.feature.priceText') },
                { icon: Zap, number: '02', title: t('home.feature.instantTitle'), text: t('home.feature.instantText') },
                { icon: Headset, number: '03', title: t('home.feature.supportTitle'), text: t('home.feature.supportText') },
              ].map((feature) => (
                <article key={feature.title} className="trust-feature">
                  <div className="trust-feature-top">
                    <span className="icon-tile w-11 h-11"><feature.icon size={20} /></span>
                    <span>{feature.number}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-app">
        <div className="home-cta">
          <div>
            <p className="page-eyebrow">{t('home.ctaEyebrow')}</p>
            <h2>{t('home.ctaTitle')}</h2>
            <p>{t('home.ctaCopy')}</p>
          </div>
          <Link to="/assistant" className="hero-secondary-button">
            <Sparkles size={17} /> {t('home.planWithAi')}
          </Link>
        </div>
      </section>
    </div>
  )
}
