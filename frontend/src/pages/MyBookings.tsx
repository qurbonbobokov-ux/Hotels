import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { bookingsApi } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { toast } from '../stores/toastStore'
import type { MyBooking } from '../types'

function statusBadge(status: string) {
  const s = status.toLowerCase()
  if (s === 'confirmed') return 'badge-green'
  if (s === 'cancelled') return 'badge-red'
  return 'badge-gray'
}

function formatDate(value: string, locale: string) {
  return new Date(value).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function MyBookings() {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsApi.getMyBookings(),
    enabled: !!user,
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onSuccess: () => {
      toast.success(t('toast.bookingCancelled'))
      refetch()
    },
    onError: () => toast.error(t('toast.cancelError')),
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-app mb-4">{t('myBookings.loginPrompt')}</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            {t('common.logIn')}
          </button>
        </div>
      </div>
    )
  }

  const bookings = data?.data ?? []

  return (
    <div className="min-h-screen bg-transparent">
      <div className="page-header">
        <div className="page-header-inner">
          <h1 className="text-3xl font-bold">{t('myBookings.title')}</h1>
        </div>
      </div>

      <div className="page-shell">
        {isLoading && <div className="text-center py-12 text-muted">{t('common.loading')}</div>}
        {error && <div className="text-center py-12 text-rose-400">{t('myBookings.loadError')}</div>}

        {!isLoading && !error && bookings.length === 0 && (
          <div className="empty-state">
            <p className="text-lg text-muted mb-4">{t('myBookings.empty')}</p>
            <Link to="/search" className="btn-primary">
              {t('myBookings.findHotel')}
            </Link>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((b: MyBooking) => {
              const cancelled = b.status.toLowerCase() === 'cancelled'
              return (
                <div key={b.id} className="list-row flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Link to={`/hotel/${b.hotelId}`} className="text-xl font-bold text-app hover:text-accent">
                        {b.hotelName}
                      </Link>
                      <span className={statusBadge(b.status)}>{t(`status.${b.status.toLowerCase()}`, b.status)}</span>
                    </div>
                    <p className="text-muted text-sm">
                      {formatDate(b.checkInDate, i18n.language)} → {formatDate(b.checkOutDate, i18n.language)} · {t('myBookings.guests', { count: b.guestCount })}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="price text-2xl">${b.totalPrice}</p>
                      <p className="text-subtle text-sm">{t('common.total')}</p>
                    </div>
                    {!cancelled && (
                      <button
                        onClick={() => {
                          if (confirm(t('myBookings.confirmCancel'))) cancelMutation.mutate(b.id)
                        }}
                        disabled={cancelMutation.isPending}
                        className="btn-danger"
                      >
                        {t('common.cancel')}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
