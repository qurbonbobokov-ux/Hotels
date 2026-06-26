import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ChevronRight, MapPin, Star, Search as SearchIcon, LocateFixed, Loader2 } from 'lucide-react'
import { hotelsApi } from '../services/api'
import { hotelImage } from '../lib/images'
import { cityCoords, haversineDistance, type Coords } from '../lib/geo'
import type { Hotel } from '../types'

type Sort = 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'distance'

export default function Search() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [maxPrice, setMaxPrice] = useState(parseInt(searchParams.get('maxPrice') || '10000'))
  const [sort, setSort] = useState<Sort>('recommended')
  const [userCoords, setUserCoords] = useState<Coords | null>(null)
  const [locating, setLocating] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['hotels', { city, maxPrice }],
    queryFn: () => hotelsApi.getAll({ city, maxPrice }),
  })

  const locateMe = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setSort('distance')
        setLocating(false)
      },
      () => {
        setLocating(false)
        alert(t('search.locationDenied'))
      },
      { timeout: 8000 },
    )
  }

  const results = useMemo(() => {
    const list = [...(data?.data ?? [])]
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'distance' && userCoords) {
      list.sort((a, b) => {
        const da = haversineDistance(userCoords, cityCoords(a.city))
        const db = haversineDistance(userCoords, cityCoords(b.city))
        return da - db
      })
    }
    return list
  }, [data, sort, userCoords])

  const distanceKm = (hotel: Hotel): number | null => {
    if (!userCoords) return null
    return Math.round(haversineDistance(userCoords, cityCoords(hotel.city)))
  }

  const clear = () => {
    setCity('')
    setMaxPrice(10000)
    setSort('recommended')
    setUserCoords(null)
  }

  return (
    <div className="page-shell">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-subtle mb-4">
        <Link to="/" className="hover:text-app">{t('nav.home')}</Link>
        <ChevronRight size={14} />
        <span className="text-app">{t('nav.hotels')}</span>
      </nav>

      <div className="page-title-row">
        <div>
          <p className="page-eyebrow">{t('nav.hotels')}</p>
          <h1 className="page-heading">{t('search.title')}</h1>
        </div>
        {!isLoading && !error && (
          <p className="badge-gray">{t('search.found', { count: results.length })}</p>
        )}
      </div>

      {/* Filter + sort bar */}
      <div className="panel mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.4fr_1.15fr_1fr_auto_auto] gap-4 lg:gap-5 items-end">
          <div>
            <label className="label">{t('home.destination')}</label>
            <div className="relative">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t('search.cityPlaceholder')}
                className="input pl-9!"
              />
            </div>
          </div>
          <div>
            <label className="label">{t('search.maxPrice')}: <span className="text-accent font-semibold">${maxPrice}</span></label>
            <input type="range" min="0" max="10000" step="50" value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-teal-600" />
          </div>
          <div>
            <label className="label">{t('search.sortBy')}</label>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="input">
              <option value="recommended">{t('search.recommended')}</option>
              <option value="price-asc">{t('search.priceAsc')}</option>
              <option value="price-desc">{t('search.priceDesc')}</option>
              <option value="rating">{t('search.rating')}</option>
              {userCoords && <option value="distance">{t('search.sortDistance')}</option>}
            </select>
          </div>

          {/* Near me button */}
          <button
            onClick={locateMe}
            disabled={locating}
            title={t('search.nearMe')}
            className={`btn-secondary px-3! py-2.5! shrink-0 ${userCoords ? 'text-emerald-400 border-emerald-500/40!' : ''}`}
          >
            {locating ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
            <span>{t('search.nearMe')}</span>
          </button>

          <button onClick={clear} className="btn-secondary shrink-0">{t('common.clear')}</button>
        </div>

        {/* Active location indicator */}
        {userCoords && (
          <p className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
            <LocateFixed size={13} />
            {t('search.locationActive')}
          </p>
        )}
      </div>

      {/* Results */}
      {isLoading && <div className="text-center py-16 text-subtle">{t('search.loading')}</div>}
      {error && <div className="text-center py-16 text-rose-400">{t('search.loadError')}</div>}

      {results.length > 0 ? (
        <div className="card-grid-3">
          {results.map((hotel: Hotel) => {
            const km = distanceKm(hotel)
            return (
              <Link key={hotel.id} to={`/hotel/${hotel.id}`} className="hotel-card group flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotelImage(hotel.images?.[0], hotel.id)}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 badge-amber"><Star size={12} className="fill-current" /> {hotel.rating}</span>
                  {km !== null && (
                    <span className="absolute top-3 right-3 badge-gray flex items-center gap-1">
                      <MapPin size={11} /> {km} km
                    </span>
                  )}
                </div>
                <div className="card-body flex flex-col grow">
                  <h3 className="text-lg font-bold text-app">{hotel.name}</h3>
                  <p className="flex items-center gap-1 text-subtle text-sm mt-1 mb-3"><MapPin size={14} /> {hotel.city}</p>
                  <p className="text-muted text-sm line-clamp-2 mb-4">{hotel.description}</p>
                  <div className="mt-auto flex items-baseline justify-between">
                    <p className="price text-xl">${hotel.price}<span className="text-subtle font-normal text-sm"> {t('common.perNight')}</span></p>
                    <span className="text-accent text-sm font-semibold">{t('common.view')} →</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : !isLoading ? (
        <div className="empty-state">
          <p className="text-app font-medium mb-1">{t('search.noResults')}</p>
          <p className="text-subtle text-sm">{t('search.noResultsHint')}</p>
        </div>
      ) : null}
    </div>
  )
}
