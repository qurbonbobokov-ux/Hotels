import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'
import { reviewsApi, type MyReview } from '../services/api'
import { useAuthStore } from '../stores/authStore'

export default function MyReviews() {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', 'mine'],
    queryFn: () => reviewsApi.getMine(),
    enabled: !!user,
  })

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card card-body text-center">
          <p className="text-muted mb-4">{t('myReviews.loginPrompt')}</p>
          <button onClick={() => navigate('/login')} className="btn-primary">{t('common.logIn')}</button>
        </div>
      </div>
    )
  }

  const reviews = data?.data ?? []

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-app mb-6">{t('myReviews.title')}</h1>

      {isLoading && <div className="text-center py-12 text-subtle">{t('common.loading')}</div>}
      {error && <div className="text-center py-12 text-rose-400">{t('myReviews.loadError')}</div>}

      {!isLoading && reviews.length === 0 && (
        <div className="card card-body text-center py-12">
          <p className="text-muted mb-4">{t('myReviews.empty')}</p>
          <Link to="/search" className="btn-primary">{t('myReviews.findHotel')}</Link>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((r: MyReview) => (
          <div key={r.id} className="card card-body">
            <div className="flex items-start justify-between gap-2 mb-2">
              <Link to={`/hotel/${r.hotelId}`} className="font-bold text-app hover:text-accent">{r.hotelName}</Link>
              <span className="badge-amber"><Star size={12} className="fill-current" /> {r.rating}</span>
            </div>
            <p className="text-muted">{r.comment}</p>
            <p className="text-subtle text-xs mt-2">{new Date(r.createdAt).toLocaleDateString(i18n.language)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
