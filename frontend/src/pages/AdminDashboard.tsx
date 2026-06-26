import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Building2, CalendarCheck, Users, DollarSign, ImagePlus, Loader2 } from 'lucide-react'
import { hotelsApi, adminApi, uploadApi, type AdminBooking } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { toast } from '../stores/toastStore'
import { hotelImage } from '../lib/images'
import type { Hotel } from '../types'

interface HotelFormData {
  name: string
  description: string
  city: string
  address: string
  phone: string
  email: string
  price: number
  imageUrl: string
}

const emptyForm: HotelFormData = {
  name: '', description: '', city: '', address: '', phone: '', email: '', price: 0, imageUrl: '',
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<HotelFormData>(emptyForm)

  const isAdmin = user?.role === 'admin'

  const { data: hotels, refetch } = useQuery({
    queryKey: ['hotels'],
    queryFn: () => hotelsApi.getAll(),
    enabled: isAdmin,
  })

  const { data: bookingsRes } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: () => adminApi.getAllBookings(),
    enabled: isAdmin,
  })

  const { data: usersRes } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers(),
    enabled: isAdmin,
  })

  const createHotelMutation = useMutation({
    mutationFn: (data: HotelFormData) => hotelsApi.create(data),
    onSuccess: () => {
      toast.success(t('toast.hotelCreated'))
      setShowForm(false)
      setFormData(emptyForm)
      refetch()
    },
    onError: () => {
      toast.error(t('toast.hotelCreateError'))
    },
  })

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
        <div className="card card-body text-center max-w-sm">
          <h1 className="text-xl font-bold text-rose-400 mb-2">{t('admin.accessDenied')}</h1>
          <p className="text-muted mb-6">{t('admin.onlyAdmins')}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            {t('admin.goHome')}
          </button>
        </div>
      </div>
    )
  }

  const bookings: AdminBooking[] = bookingsRes?.data ?? []
  const revenue = bookings.filter((b) => b.status === 'Confirmed').reduce((s, b) => s + (b.totalPrice || 0), 0)
  const stats = [
    { icon: Building2, label: t('admin.statHotels'), value: hotels?.data?.length ?? 0 },
    { icon: CalendarCheck, label: t('admin.statBookings'), value: bookings.length },
    { icon: Users, label: t('admin.statUsers'), value: usersRes?.data?.length ?? 0 },
    { icon: DollarSign, label: t('admin.statRevenue'), value: `$${revenue}` },
  ]

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadApi.image(file)
      setFormData((f) => ({ ...f, imageUrl: res.data.url }))
      toast.success(t('toast.imageUploaded'))
    } catch {
      toast.error(t('toast.imageUploadError'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createHotelMutation.mutate(formData)
  }

  const handleHotelPhoto = async (hotelId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingId(hotelId)
    try {
      const res = await uploadApi.image(file)
      await hotelsApi.update(hotelId, { imageUrl: res.data.url })
      toast.success(t('admin.photoUpdated'))
      refetch()
    } catch {
      toast.error(t('admin.photoUpdateError'))
    } finally {
      setUploadingId(null)
      e.target.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="page-header">
        <div className="page-header-inner flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
            <p className="text-emerald-50 mt-1">{t('admin.subtitle')}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-secondary">
            {showForm ? t('common.cancel') : t('admin.addHotel')}
          </button>
        </div>
      </div>

      <div className="page-shell">
        {/* Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="panel">
              <span className="icon-tile w-10 h-10 mb-3">
                <s.icon size={18} />
              </span>
              <p className="text-2xl font-bold text-app">{s.value}</p>
              <p className="text-subtle text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add Hotel Form */}
        {showForm && (
          <div className="panel mb-8">
            <h2 className="section-title mb-6">{t('admin.addNewHotel')}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('admin.hotelName')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="input"
                    placeholder={t('admin.hotelNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="label">{t('admin.city')}</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    className="input"
                    placeholder={t('admin.cityPlaceholder')}
                  />
                </div>

                <div>
                  <label className="label">{t('admin.address')}</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="input"
                    placeholder={t('admin.addressPlaceholder')}
                  />
                </div>

                <div>
                  <label className="label">{t('admin.pricePerNight')}</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                    className="input"
                    placeholder={t('admin.pricePlaceholder')}
                  />
                </div>

                <div>
                  <label className="label">{t('common.phone')}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="input"
                    placeholder={t('admin.phonePlaceholder')}
                  />
                </div>

                <div>
                  <label className="label">{t('common.email')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="input"
                    placeholder={t('admin.emailPlaceholder')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">{t('admin.description')}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="input"
                    placeholder={t('admin.descriptionPlaceholder')}
                  />
                </div>

                {/* Hotel image */}
                <div className="md:col-span-2">
                  <label className="label">{t('admin.hotelImage')}</label>
                  <div className="flex items-center gap-4">
                    <div className="w-28 h-20 rounded-xl overflow-hidden border border-app surface-2 shrink-0 grid place-items-center">
                      {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus size={22} className="text-subtle" />
                      )}
                    </div>
                    <div>
                      <label className="btn-secondary cursor-pointer">
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                        {uploading ? t('admin.uploading') : t('admin.uploadImage')}
                        <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
                      </label>
                      <p className="text-subtle text-xs mt-2">{t('admin.imageHint')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={createHotelMutation.isPending || uploading} className="btn-primary btn-block">
                {createHotelMutation.isPending ? t('admin.creating') : t('admin.createHotel')}
              </button>
            </form>
          </div>
        )}

        {/* Hotels List */}
        <div>
          <h2 className="section-title mb-6">{t('admin.allHotels')}</h2>

          {hotels?.data && hotels.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.data.map((hotel: Hotel) => (
                <div key={hotel.id} className="hotel-card">
                  {/* Image with overlay upload button */}
                  <div className="relative group/img h-40">
                    <img
                      src={hotelImage(hotel.images?.[0], hotel.id)}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-950/60 opacity-0 group-hover/img:opacity-100 transition cursor-pointer">
                      {uploadingId === hotel.id ? (
                        <Loader2 size={24} className="text-white animate-spin" />
                      ) : (
                        <>
                          <ImagePlus size={24} className="text-white" />
                          <span className="text-white text-xs font-semibold">{t('admin.addPhoto')}</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingId === hotel.id}
                        onChange={(e) => handleHotelPhoto(hotel.id, e)}
                      />
                    </label>
                  </div>
                  <div className="card-body">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-app">{hotel.name}</h3>
                      <span className="badge-gray shrink-0">⭐ {hotel.rating}</span>
                    </div>
                    <p className="text-subtle text-sm mb-2">{hotel.city} • {hotel.address}</p>
                    <p className="text-muted text-sm line-clamp-2 mb-4">{hotel.description}</p>
                    <p className="price text-xl">
                      ${hotel.price} <span className="text-subtle font-normal text-sm">{t('common.perNight')}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-subtle text-center py-12">{t('admin.noHotels')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
