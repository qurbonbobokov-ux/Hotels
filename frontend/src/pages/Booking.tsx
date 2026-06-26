import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { bookingsApi, hotelsApi } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { toast } from '../stores/toastStore'

interface BookingData {
  hotelId: string
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  guestName: string
  guestEmail: string
  guestPhone: string
  specialRequests: string
}

export default function Booking() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const hotelId = location.state?.hotelId as string | undefined

  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomId: '',
    guestName: user?.name || '',
    guestEmail: user?.email || '',
    guestPhone: '',
    specialRequests: '',
  })

  const { data: hotel } = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => hotelsApi.getById(hotelId!),
    enabled: !!hotelId,
  })

  const bookingMutation = useMutation({
    mutationFn: (data: BookingData) => bookingsApi.create(data),
    onSuccess: () => {
      toast.success(t('toast.bookingConfirmed'))
      navigate('/my-bookings')
    },
    onError: () => {
      toast.error(t('toast.bookingFailed'))
    },
  })

  // No hotel selected — send the user back to search.
  if (!hotelId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-app mb-4">{t('booking.noHotel')}</p>
          <button onClick={() => navigate('/search')} className="btn-primary">
            {t('booking.browseHotels')}
          </button>
        </div>
      </div>
    )
  }

  const rooms = hotel?.data.rooms ?? []
  const selectedRoom = rooms.find((r) => r.id === formData.roomId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    if (!formData.checkIn || !formData.checkOut || !formData.roomId) {
      toast.error(t('toast.fillRequired'))
      return
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      toast.error(t('toast.checkoutAfterCheckin'))
      return
    }

    bookingMutation.mutate({
      hotelId,
      roomId: formData.roomId,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
      guestName: formData.guestName,
      guestEmail: formData.guestEmail,
      guestPhone: formData.guestPhone,
      specialRequests: formData.specialRequests,
    })
  }

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn)
      const checkOut = new Date(formData.checkOut)
      const diff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : 0
    }
    return 0
  }

  const nights = calculateNights()
  const rate = selectedRoom?.price ?? 0
  const totalPrice = rate * nights

  return (
    <div className="min-h-screen bg-transparent">
      <div className="page-header">
        <div className="page-header-inner">
          <h1 className="text-3xl font-bold">{t('booking.title')}</h1>
          {hotel?.data && <p className="text-emerald-50 mt-1">{hotel.data.name}</p>}
        </div>
      </div>

      <div className="page-shell">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
            <div className="panel">
              <h2 className="section-title mb-4">{t('booking.tripDetails')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('home.checkIn')}</label>
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">{t('home.checkOut')}</label>
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">{t('home.guests')}</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">{t('booking.roomType')}</label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    required
                    className="input"
                  >
                    <option value="">{t('booking.selectRoom')}</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id} disabled={!room.available}>
                        {room.type} — ${room.price}/{t('common.nightUnit')}{room.available ? '' : ` (${t('booking.unavailable')})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="panel">
              <h2 className="section-title mb-4">{t('booking.guestInfo')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('common.name')}</label>
                  <input
                    type="text"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">{t('common.email')}</label>
                  <input
                    type="email"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    required
                    className="input"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">{t('common.phone')}</label>
                  <input
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    required
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div className="panel">
              <h2 className="section-title mb-4">{t('booking.specialRequests')}</h2>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                rows={3}
                className="input"
                placeholder={t('booking.specialPlaceholder')}
              />
            </div>

            <button type="submit" disabled={bookingMutation.isPending} className="btn-primary btn-block">
              {bookingMutation.isPending ? t('booking.processing') : t('booking.confirm')}
            </button>
          </form>

          <div className="md:col-span-1">
            <div className="panel h-fit sticky top-20">
              <h3 className="section-title mb-4">{t('booking.summary')}</h3>

              <div className="space-y-2 mb-4 pb-4 border-b border-app">
                <div className="flex justify-between text-sm text-app">
                  <span>{t('booking.room')}:</span>
                  <span>{selectedRoom ? selectedRoom.type : '-'}</span>
                </div>
                <div className="flex justify-between text-sm text-app">
                  <span>{t('booking.rate')}:</span>
                  <span>{selectedRoom ? `$${rate}/${t('common.nightUnit')}` : '-'}</span>
                </div>
                <div className="flex justify-between text-sm text-app">
                  <span>{t('booking.nights')}:</span>
                  <span>{nights || '-'}</span>
                </div>
              </div>

              <div className="surface-2 p-3 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-app">{t('booking.total')}:</span>
                  <span className="text-2xl font-bold text-accent">${totalPrice}</span>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-muted">
                <input type="checkbox" required className="rounded accent-teal-600" />
                <span>{t('common.agreeTerms')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
