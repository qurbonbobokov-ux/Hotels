import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Search as SearchIcon, MapPin, Star, Wallet, Zap, Headset, Users, Building2, Globe2, Calendar, CalendarCheck } from 'lucide-react'
import { hotelsApi } from '../services/api'
import { hotelImage } from '../lib/images'
import type { Hotel } from '../types'

const HERO_IMG =
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=2000&q=80'

const CITIES = ['Dushanbe', 'Khujand', 'Khorog', 'Kulob', 'Bokhtar', 'Penjikent']

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

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/55 via-slate-950/50 to-slate-950/85" />
        </div>

        {/* Hero content — w-full so mx-auto works correctly inside any layout */}
        <div className="relative w-full">
          <div className="max-w-7xl mx-auto px-6 pt-28 pb-10 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-6 tracking-widest uppercase">
              Tajikistan · {new Date().getFullYear()}
            </span>
            <h1 className="hero-title text-5xl md:text-7xl text-white mb-5 leading-tight">
              {t('home.heroTitlePre')}{' '}
              <span className="gradient-text">{t('home.country')}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-7xl mx-auto mb-10 text-center">
              {t('home.heroSubtitle')}
            </p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-10 mb-12">
              {[
                { icon: Building2, value: '500+', label: t('about.statHotels') },
                { icon: Globe2, value: '12', label: t('about.statCities') },
                { icon: Users, value: '50k+', label: t('about.statGuests') },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="max-w-7xl mx-auto ml-4 md:ml-0 px-6 -mt-8 md:-mt-12">
            <form onSubmit={submitSearch} className="card overflow-hidden shadow-2xl shadow-black/60">
              <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-(--border)">
                {/* Destination */}
                <div className="flex items-center gap-3 px-7 py-5 md:flex-[2_2_0%] min-w-0">
                  <MapPin size={18} className="text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-subtle uppercase tracking-widest mb-0.5">{t('home.destination')}</p>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={t('home.destinationPlaceholder')}
                      className="bg-transparent w-full text-app text-sm font-medium outline-none placeholder:text-muted"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="flex items-center gap-3 px-7 py-5 md:flex-1 min-w-0">
                  <Calendar size={18} className="text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-subtle uppercase tracking-widest mb-0.5">{t('home.checkIn')}</p>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="bg-transparent w-full text-app text-sm font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="flex items-center gap-3 px-7 py-5 md:flex-1 min-w-0">
                  <CalendarCheck size={18} className="text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-subtle uppercase tracking-widest mb-0.5">{t('home.checkOut')}</p>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-transparent w-full text-app text-sm font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="flex items-center gap-3 px-7 py-5 min-w-0">
                  <Users size={18} className="text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-subtle uppercase tracking-widest mb-0.5">{t('home.guests')}</p>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="bg-transparent w-full text-app text-sm font-medium outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search button */}
                <div className="p-4 flex items-center shrink-0">
                  <button
                    type="submit"
                    className="h-full min-h-13 px-8 rounded-xl font-semibold text-sm flex items-center gap-2 bg-linear-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-400 hover:to-violet-500 transition-all shadow-lg shadow-indigo-900/40"
                  >
                    <SearchIcon size={17} /> {t('common.search')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── Popular cities ── */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-4 flex flex-wrap gap-3">
        {CITIES.map((c) => (
          <button
            key={c}
            onClick={() => navigate(`/search?city=${c}`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium surface-2 text-muted hover:text-accent hover:border-indigo-500/40 border border-app transition"
          >
            <MapPin size={12} className="text-accent" /> {c}
          </button>
        ))}
      </section>

      {/* ── Featured Hotels ── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pt-14 pb-6">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-accent font-semibold text-sm mb-1 tracking-widest uppercase">{t('home.topRated')}</p>
              <h2 className="section-title">{t('home.featured')}</h2>
            </div>
            <Link to="/search" className="text-accent hover:text-app font-semibold text-sm">
              {t('common.viewAll')} →
            </Link>
          </div>

          {featured.length >= 3 ? (
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-5">
              {/* Big featured card */}
              <Link to={`/hotel/${featured[0].id}`} className="card card-hover overflow-hidden group">
                <div className="relative h-90 overflow-hidden">
                  <img
                    src={hotelImage(featured[0].images?.[0], featured[0].id)}
                    alt={featured[0].name}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                  <span className="absolute top-4 left-4 badge-amber">
                    <Star size={13} className="fill-current" /> {featured[0].rating}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">{featured[0].name}</h3>
                    <p className="flex items-center gap-1 text-slate-300 text-sm mb-4">
                      <MapPin size={13} /> {featured[0].city}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-accent font-bold text-2xl">
                        ${featured[0].price}
                        <span className="text-slate-400 font-normal text-sm ml-1">{t('common.perNight')}</span>
                      </p>
                      <span className="text-sm font-semibold text-white bg-indigo-500/90 hover:bg-indigo-500 px-4 py-2 rounded-full transition">
                        {t('common.book')} →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Two stacked cards */}
              <div className="flex flex-col gap-5">
                {featured.slice(1).map((hotel: Hotel) => (
                  <Link
                    key={hotel.id}
                    to={`/hotel/${hotel.id}`}
                    className="card card-hover overflow-hidden group flex-1"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={hotelImage(hotel.images?.[0], hotel.id)}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 badge-amber">
                        <Star size={11} className="fill-current" /> {hotel.rating}
                      </span>
                    </div>
                    <div className="card-body py-3.5">
                      <h3 className="font-bold text-app">{hotel.name}</h3>
                      <p className="flex items-center gap-1 text-subtle text-xs mt-0.5 mb-2">
                        <MapPin size={11} /> {hotel.city}
                      </p>
                      <div className="flex items-baseline justify-between">
                        <p className="text-accent font-bold text-lg">
                          ${hotel.price}
                          <span className="text-subtle font-normal text-xs ml-1">{t('common.perNight')}</span>
                        </p>
                        <span className="text-accent text-xs font-semibold">{t('common.book')} →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((hotel: Hotel) => (
                <Link key={hotel.id} to={`/hotel/${hotel.id}`} className="card card-hover overflow-hidden group">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={hotelImage(hotel.images?.[0], hotel.id)}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 badge-amber"><Star size={12} className="fill-current" /> {hotel.rating}</span>
                  </div>
                  <div className="card-body">
                    <h3 className="text-lg font-bold text-app mb-1">{hotel.name}</h3>
                    <p className="flex items-center gap-1 text-subtle text-sm mb-4"><MapPin size={14} /> {hotel.city}</p>
                    <div className="flex items-baseline justify-between">
                      <p className="text-accent font-bold text-xl">
                        ${hotel.price}<span className="text-subtle font-normal text-sm"> {t('common.perNight')}</span>
                      </p>
                      <span className="text-sm font-semibold text-accent">{t('common.book')} →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Why us ── */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="grid grid-cols-1  md:grid-cols-3 gap-6">
          {[
            { icon: Wallet, title: t('home.feature.priceTitle'), text: t('home.feature.priceText') },
            { icon: Zap, title: t('home.feature.instantTitle'), text: t('home.feature.instantText') },
            { icon: Headset, title: t('home.feature.supportTitle'), text: t('home.feature.supportText') },
          ].map((f) => (
            <div key={f.title} className="card card-body text-center group hover:border-indigo-500/40 transition-colors">
              <span className="grid place-items-center w-14 h-14 mx-auto rounded-2xl bg-linear-to-br from-indigo-500/20 to-cyan-500/20 text-accent mb-4 group-hover:from-indigo-500/30 group-hover:to-cyan-500/30 transition-all">
                <f.icon size={24} />
              </span>
              <h3 className="font-bold text-app text-base mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
