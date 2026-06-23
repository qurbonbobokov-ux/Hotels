import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Star, Heart, MapPin, Check, ShieldCheck, Navigation } from 'lucide-react'
import { hotelsApi, reviewsApi, favoritesApi } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { toast } from '../stores/toastStore'
import { hotelGallery } from '../lib/images'
import { cityCoords, osmLink } from '../lib/geo'
import HotelMap from '../components/HotelMap'

type Tab = 'overview' | 'rooms' | 'reviews' | 'location'

export default function HotelDetails() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [tab, setTab] = useState<Tab>('overview')
  const [activeImg, setActiveImg] = useState(0)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const { data: hotel, isLoading } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelsApi.getById(id!),
    enabled: !!id,
  })

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsApi.getByHotel(id!),
    enabled: !!id,
  })

  const { data: favIds, refetch: refetchFavs } = useQuery({
    queryKey: ['favorite-ids'],
    queryFn: () => favoritesApi.getIds(),
    enabled: !!user,
  })

  const isFavorite = !!id && (favIds?.data ?? []).includes(id)

  const favoriteMutation = useMutation({
    mutationFn: () => (isFavorite ? favoritesApi.remove(id!) : favoritesApi.add(id!)),
    onSuccess: () => {
      toast.success(isFavorite ? t('toast.removedFavorite') : t('toast.addedFavorite'))
      refetchFavs()
    },
    onError: () => toast.error(t('toast.favoriteError')),
  })

  const reviewMutation = useMutation({
    mutationFn: () => reviewsApi.create({ hotelId: id!, rating, comment }),
    onSuccess: () => {
      toast.success(t('toast.reviewSubmitted'))
      setComment('')
      setRating(5)
      refetchReviews()
    },
    onError: () => toast.error(t('toast.reviewError')),
  })

  const handleBooking = () => {
    if (!user) return navigate('/login')
    navigate('/booking', { state: { hotelId: id } })
  }
  const handleFavorite = () => {
    if (!user) return navigate('/login')
    favoriteMutation.mutate()
  }
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return toast.error(t('toast.writeComment'))
    reviewMutation.mutate()
  }

  if (isLoading) return <div className="text-center py-20 text-muted">{t('common.loading')}</div>
  const h = hotel?.data
  if (!h) return <div className="text-center py-20 text-muted">{t('hotel.notFound')}</div>

  const gallery = hotelGallery(h.images?.[0], h.id)
  const reviewList = reviews?.data ?? []

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: t('hotel.overview') },
    { id: 'rooms', label: t('hotel.rooms') },
    { id: 'reviews', label: t('hotel.reviewsCount', { count: reviewList.length }) },
    { id: 'location', label: t('hotel.location') },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-subtle mb-5">
        <Link to="/" className="hover:text-app">{t('nav.home')}</Link>
        <ChevronRight size={14} />
        <Link to="/search" className="hover:text-app">{t('nav.hotels')}</Link>
        <ChevronRight size={14} />
        <span className="text-app">{h.name}</span>
      </nav>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-app">{h.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="badge-amber"><Star size={12} className="fill-current" /> {h.rating}</span>
            <span className="flex items-center gap-1 text-muted text-sm"><MapPin size={14} /> {h.city} • {h.address}</span>
          </div>
        </div>
        <button onClick={handleFavorite} className="btn-secondary px-4! py-2!" disabled={favoriteMutation.isPending}>
          <Heart size={16} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
          {isFavorite ? t('common.saved') : t('common.save')}
        </button>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 mb-8">
        <img src={gallery[activeImg]} alt={h.name} className="w-full h-72 md:h-105 object-cover rounded-2xl" />
        <div className="grid grid-cols-4 lg:grid-cols-2 gap-3">
          {gallery.slice(0, 4).map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`overflow-hidden rounded-xl border-2 transition ${activeImg === i ? 'border-indigo-500' : 'border-transparent'}`}
            >
              <img src={src} alt="" className="w-full h-20 lg:h-25 object-cover hover:scale-105 transition" />
            </button>
          ))}
        </div>
      </div>

      {/* Content + sticky booking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-app mb-6 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-3 font-semibold whitespace-nowrap border-b-2 -mb-px transition ${
                  tab === t.id ? 'border-indigo-500 text-app' : 'border-transparent text-muted hover:text-app'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="space-y-8">
              <section>
                <h2 className="section-title text-2xl! mb-3">{t('hotel.about')}</h2>
                <p className="text-muted leading-relaxed">{h.description}</p>
              </section>
              <section>
                <h2 className="section-title text-2xl! mb-4">{t('hotel.amenities')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {h.amenities?.map((a: string) => (
                    <div key={a} className="flex items-center gap-2 text-muted">
                      <Check size={16} className="text-emerald-400 shrink-0" /> {a}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {tab === 'rooms' && (
            <div className="space-y-4">
              {h.rooms?.map((room: { id: string; type: string; capacity: number; price: number; available: boolean }) => (
                <div key={room.id} className="card card-body flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-app">{room.type}</h3>
                    <p className="text-subtle text-sm">{t('hotel.sleeps', { count: room.capacity })}</p>
                    <span className={`mt-2 inline-block ${room.available ? 'badge-green' : 'badge-red'}`}>
                      {room.available ? t('hotel.available') : t('hotel.soldOut')}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-accent">${room.price}</p>
                    <p className="text-subtle text-xs mb-2">{t('common.perNightShort')}</p>
                    <button onClick={handleBooking} className="btn-primary px-5! py-2!">{t('common.book')}</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="card card-body mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <label className="label mb-0">{t('hotel.yourRating')}</label>
                    <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} className="input w-auto">
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                    </select>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="input mb-3"
                    placeholder={t('hotel.reviewPlaceholder')}
                  />
                  <button type="submit" disabled={reviewMutation.isPending} className="btn-primary">
                    {reviewMutation.isPending ? t('hotel.submitting') : t('hotel.submitReview')}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-subtle mb-6">
                  <button onClick={() => navigate('/login')} className="text-accent font-semibold">{t('hotel.logIn')}</button>{t('hotel.toWriteReview')}
                </p>
              )}

              <div className="space-y-4">
                {reviewList.length ? (
                  reviewList.map((review: { id: string; userName: string; rating: number; comment: string }) => (
                    <div key={review.id} className="card card-body">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-app">{review.userName}</p>
                        <span className="badge-amber"><Star size={12} className="fill-current" /> {review.rating}</span>
                      </div>
                      <p className="text-muted">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-subtle">{t('hotel.noReviews')}</p>
                )}
              </div>
            </div>
          )}

          {tab === 'location' && (
            <div className="card overflow-hidden">
              <HotelMap
                center={cityCoords(h.city)}
                hotelName={h.name}
                address={`${h.address}, ${h.city}`}
              />
              <div className="card-body flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-muted">
                  <MapPin size={16} className="text-accent shrink-0" /> {h.address}, {h.city}
                </div>
                <a
                  href={osmLink(cityCoords(h.city))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-4! py-2! shrink-0"
                >
                  <Navigation size={16} /> {t('hotel.getDirections')}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sticky booking */}
        <div className="lg:col-span-1">
          <div className="card card-body sticky top-20">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-accent">${h.price}</span>
              <span className="text-subtle text-sm">{t('common.perNight')}</span>
            </div>
            <button onClick={handleBooking} className="btn-primary btn-block mb-4">{t('common.bookNow')}</button>
            <div className="flex items-center gap-2 text-emerald-400 text-sm mb-4">
              <ShieldCheck size={16} /> {t('hotel.freeCancellation')}
            </div>
            <div className="border-t border-app pt-4">
              <h3 className="font-semibold text-app mb-3">{t('hotel.included')}</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> {t('hotel.freeWifi')}</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> {t('hotel.freeBreakfast')}</li>
                <li className="flex items-center gap-2"><Check size={15} className="text-emerald-400" /> {t('hotel.support247')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
