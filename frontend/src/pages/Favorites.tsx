import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { favoritesApi } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { toast } from '../stores/toastStore'
import { hotelImage } from '../lib/images'
import type { Hotel } from '../types'

export default function Favorites() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.getAll(),
    enabled: !!user,
  })

  const removeMutation = useMutation({
    mutationFn: (hotelId: string) => favoritesApi.remove(hotelId),
    onSuccess: () => {
      toast.success(t('toast.removedFavorite'))
      refetch()
    },
    onError: () => toast.error(t('toast.removeFavoriteError')),
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-app mb-4">{t('favorites.loginPrompt')}</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            {t('common.logIn')}
          </button>
        </div>
      </div>
    )
  }

  const hotels = data?.data ?? []

  return (
    <div className="min-h-screen bg-transparent">
      <div className="page-header">
        <div className="page-header-inner">
          <h1 className="text-3xl font-bold">{t('favorites.title')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading && <div className="text-center py-12 text-muted">{t('common.loading')}</div>}
        {error && <div className="text-center py-12 text-rose-400">{t('favorites.loadError')}</div>}

        {!isLoading && !error && hotels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted mb-4">{t('favorites.empty')}</p>
            <Link to="/search" className="btn-primary">
              {t('favorites.find')}
            </Link>
          </div>
        )}

        {hotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotels.map((hotel: Hotel) => (
              <div key={hotel.id} className="card overflow-hidden">
                <Link to={`/hotel/${hotel.id}`}>
                  <img
                    src={hotelImage(hotel.images?.[0], hotel.id)}
                    alt={hotel.name}
                    className="w-full h-44 object-cover"
                  />
                </Link>
                <div className="card-body">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link to={`/hotel/${hotel.id}`} className="text-lg font-bold text-app hover:text-accent">
                      {hotel.name}
                    </Link>
                    <span className="text-amber-300 text-sm whitespace-nowrap">⭐ {hotel.rating}</span>
                  </div>
                  <p className="text-subtle text-sm mb-3">{hotel.city}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-accent font-bold">
                      ${hotel.price} <span className="text-subtle font-normal text-sm">{t('common.perNight')}</span>
                    </p>
                    <button
                      onClick={() => removeMutation.mutate(hotel.id)}
                      disabled={removeMutation.isPending}
                      className="btn-danger px-3! py-1.5! text-sm"
                    >
                      {t('common.remove')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
