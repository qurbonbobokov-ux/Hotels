import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Clock, MapPin, Users, Star } from 'lucide-react'
import { toast } from '../stores/toastStore'

interface Tour {
  id: string
  days: number
  group: 'smallGroup' | 'private'
  price: number
  rating: number
  img: string
}

const TOURS: Tour[] = [
  {
    id: 'pamir-highway',
    days: 7,
    group: 'smallGroup',
    price: 890,
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'dushanbe-city',
    days: 3,
    group: 'private',
    price: 320,
    rating: 4.7,
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'iskanderkul',
    days: 2,
    group: 'smallGroup',
    price: 240,
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'khujand-heritage',
    days: 2,
    group: 'private',
    price: 210,
    rating: 4.6,
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'wakhan-valley',
    days: 5,
    group: 'smallGroup',
    price: 720,
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'fann-trek',
    days: 4,
    group: 'smallGroup',
    price: 540,
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80',
  },
]

export default function Tours() {
  const { t } = useTranslation()
  return (
    <div>
      <section className="page-header">
        <div className="page-header-inner text-center">
          <h1 className="font-display text-4xl font-bold mb-3">{t('tours.title')}</h1>
          <p className="text-emerald-50 max-w-2xl mx-auto">
            {t('tours.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOURS.map((tour) => (
            <div key={tour.id} className="card card-hover overflow-hidden flex flex-col group">
              <div className="relative h-48 overflow-hidden">
                <img src={tour.img} alt={t(`tours.items.${tour.id}.title`)} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute top-3 left-3 badge-amber"><Star size={12} className="fill-current" /> {tour.rating}</span>
              </div>
              <div className="card-body flex flex-col grow">
                <h3 className="text-lg font-bold text-app">{t(`tours.items.${tour.id}.title`)}</h3>
                <p className="flex items-center gap-1 text-subtle text-sm mt-1 mb-3"><MapPin size={14} /> {t(`tours.items.${tour.id}.city`)}</p>
                <p className="text-muted text-sm mb-4">{t(`tours.items.${tour.id}.summary`)}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge-gray"><Clock size={12} /> {t('tours.days', { count: tour.days })}</span>
                  <span className="badge-gray"><Users size={12} /> {t(`tours.${tour.group}`)}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <p className="text-accent font-bold text-xl">${tour.price}<span className="text-subtle font-normal text-sm"> {t('common.perPerson')}</span></p>
                  <button onClick={() => toast.success(t('toast.tourEnquiry'))} className="btn-primary px-5! py-2!">
                    {t('common.book')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card card-body text-center mt-10">
          <p className="text-muted">{t('tours.lookingForStay')}</p>
          <div className="mt-3">
            <Link to="/search" className="btn-secondary">{t('tours.browseHotels')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
