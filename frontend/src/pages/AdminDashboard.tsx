import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Building2, CalendarCheck, Users, DollarSign, ImagePlus, Loader2, X, MapPin, Star, UploadCloud } from 'lucide-react'
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
    <div className="admin-page">
      <div className="admin-hero">
        <div className="container-app admin-hero-inner">
          <div>
            <p className="page-eyebrow">{t('nav.admin')}</p>
            <h1>{t('admin.title')}</h1>
            <p>{t('admin.subtitle')}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className={showForm ? 'btn-secondary' : 'btn-primary'}>
            {showForm && <X size={17} />}
            {showForm ? t('common.cancel') : t('admin.addHotel')}
          </button>
        </div>
      </div>

      <div className="page-shell">
        <section className="admin-stats">
          {stats.map((s) => (
            <article key={s.label} className="admin-stat-card">
              <span className="icon-tile w-10 h-10">
                <s.icon size={18} />
              </span>
              <div>
                <p>{s.value}</p>
                <span>{s.label}</span>
              </div>
            </article>
          ))}
        </section>

        {showForm && (
          <section className="admin-form-panel">
            <div className="admin-section-head">
              <div>
                <p className="page-eyebrow">{t('admin.addHotel')}</p>
                <h2 className="section-title">{t('admin.addNewHotel')}</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="admin-form-grid">
              <div className="admin-form-fields">
                <div className="admin-field">
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

                <div className="admin-field">
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

                <div className="admin-field">
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

                <div className="admin-field">
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

                <div className="admin-field">
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

                <div className="admin-field">
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

                <div className="admin-field admin-field-wide">
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
              </div>

              <aside className="admin-upload-panel">
                <label className="label">{t('admin.hotelImage')}</label>
                <div className="admin-image-preview">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" />
                  ) : (
                    <div>
                      <ImagePlus size={28} />
                      <span>{t('admin.hotelImage')}</span>
                    </div>
                  )}
                </div>
                <label className="btn-secondary cursor-pointer admin-upload-button">
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                  {uploading ? t('admin.uploading') : t('admin.uploadImage')}
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
                </label>
                <p>{t('admin.imageHint')}</p>
                <button type="submit" disabled={createHotelMutation.isPending || uploading} className="btn-primary btn-block">
                  {createHotelMutation.isPending ? t('admin.creating') : t('admin.createHotel')}
                </button>
              </aside>
            </form>
          </section>
        )}

        <section className="admin-hotels-section">
          <div className="admin-section-head">
            <div>
              <p className="page-eyebrow">{t('admin.statHotels')}</p>
              <h2 className="section-title">{t('admin.allHotels')}</h2>
            </div>
            <span className="badge-gray">{hotels?.data?.length ?? 0}</span>
          </div>

          {hotels?.data && hotels.data.length > 0 ? (
            <div className="admin-hotels-grid">
              {hotels.data.map((hotel: Hotel) => (
                <article key={hotel.id} className="admin-hotel-card">
                  <div className="admin-hotel-media group/img">
                    <img
                      src={hotelImage(hotel.images?.[0], hotel.id)}
                      alt={hotel.name}
                    />
                    <label className="admin-photo-overlay">
                      {uploadingId === hotel.id ? (
                        <Loader2 size={24} className="text-white animate-spin" />
                      ) : (
                        <>
                          <ImagePlus size={24} className="text-white" />
                          <span>{t('admin.addPhoto')}</span>
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
                  <div className="admin-hotel-body">
                    <div className="admin-hotel-title-row">
                      <h3>{hotel.name}</h3>
                      <span className="badge-amber"><Star size={12} className="fill-current" /> {hotel.rating}</span>
                    </div>
                    <p className="admin-hotel-location"><MapPin size={14} /> {hotel.city} · {hotel.address}</p>
                    <p className="admin-hotel-description">{hotel.description}</p>
                    <p className="price admin-hotel-price">
                      ${hotel.price} <span className="text-subtle font-normal text-sm">{t('common.perNight')}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="text-subtle">{t('admin.noHotels')}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
