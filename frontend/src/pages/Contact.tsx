import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { toast } from '../stores/toastStore'

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error(t('toast.contactFillAll'))
      return
    }
    toast.success(t('toast.contactSuccess'))
    setForm({ name: '', email: '', message: '' })
  }

  const contacts = [
    { icon: Mail, label: t('contact.email'), value: 'support@tajhotels.com', href: 'mailto:support@tajhotels.com' },
    { icon: Phone, label: t('contact.phone'), value: '+992 (50) 101-12-77', href: 'tel:+992501011277' },
    { icon: MapPin, label: t('contact.office'), value: t('contact.officeValue'), href: undefined },
  ]

  return (
    <div>
      <section className="page-header">
        <div className="page-header-inner text-center">
          <h1 className="font-display text-4xl font-bold mb-3">{t('contact.title')}</h1>
          <p className="text-emerald-50 max-w-xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact details */}
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.label} className="card card-body flex items-center gap-4">
              <span className="icon-tile w-11 h-11">
                <c.icon size={20} />
              </span>
              <div>
                <p className="text-subtle text-sm">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="text-app font-semibold hover:text-accent">{c.value}</a>
                ) : (
                  <p className="text-app font-semibold">{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} className="card card-body lg:col-span-2 space-y-4">
          <h2 className="section-title text-2xl! mb-2">{t('contact.sendMessage')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('common.name')}</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('contact.namePlaceholder')} />
            </div>
            <div>
              <label className="label">{t('common.email')}</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t('common.emailPlaceholder')} />
            </div>
          </div>
          <div>
            <label className="label">{t('common.message')}</label>
            <textarea rows={5} className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t('contact.messagePlaceholder')} />
          </div>
          <button type="submit" className="btn-primary"><Send size={16} /> {t('contact.send')}</button>
        </form>
      </div>
    </div>
  )
}
