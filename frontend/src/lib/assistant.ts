import { hotelsApi } from '../services/api'
import type { Hotel } from '../types'

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  hotels?: Hotel[]
}

export interface AssistantReply {
  text: string
  hotels?: Hotel[]
}

const CITIES = ['Dushanbe', 'Khujand', 'Khorog', 'Ishkashim', 'Bokhtar', 'Kulob', 'Penjikent']

export const SUGGESTIONS = [
  'Hotel in Dushanbe under $200',
  'Best rated hotels in Khujand',
  'Hotels near the airport',
  'Plan a 3-day trip',
  'How do I book a room?',
  'Translate "thank you" to Tajik',
]

const PHRASEBOOK: Record<string, string> = {
  hello: 'Salom',
  hi: 'Salom',
  'thank you': 'Rahmat',
  thanks: 'Rahmat',
  please: 'Lutfan',
  yes: 'Ha',
  no: 'Не',
  goodbye: 'Khayr',
  'how much': 'Chand pul?',
  water: 'Ob',
  hotel: 'Mehmonkhona',
}

const rx = (p: string) => new RegExp(p, 'i')

export async function getAssistantReply(text: string): Promise<AssistantReply> {
  const t = text.trim()
  const lower = t.toLowerCase()

  // Small talk
  if (rx('^(hi|hello|hey|salom|privet|assalom)').test(lower))
    return { text: 'Salom! 👋 I can help you find hotels, plan a trip, or answer questions about booking. What are you looking for?' }
  if (rx('(thank|spasibo|rahmat)').test(lower))
    return { text: "You're welcome! Anything else I can help with? 😊" }
  if (rx('^(bye|goodbye|khayr|poka)').test(lower))
    return { text: 'Safe travels! Khayr 👋' }

  // Translator
  if (rx('translate|how do you say|in tajik|to tajik').test(lower)) {
    const phrase = Object.keys(PHRASEBOOK).find((k) => lower.includes(k))
    if (phrase) return { text: `"${phrase}" in Tajik is "${PHRASEBOOK[phrase]}".` }
    return {
      text:
        'I can translate common phrases to Tajik:\n• hello → Salom\n• thank you → Rahmat\n• please → Lutfan\n• how much → Chand pul?\nAsk me to translate any of these.',
    }
  }

  // Booking / FAQ
  if (rx('how.*(book|reserve)|book a room|booking process').test(lower))
    return { text: 'To book: open a hotel → pick your dates, guests and room → press "Book Now" and confirm. You can see it afterwards under My Bookings. Want me to find a hotel for you?' }
  if (rx('cancel|refund').test(lower))
    return { text: 'All stays include free cancellation. Go to My Bookings and press Cancel — the room is released and the booking is marked cancelled.' }
  if (rx('pay|payment|card|stripe').test(lower))
    return { text: 'Booking is instant and secure. Payment options (Visa, MasterCard, Alif, local banks) are shown at checkout.' }
  if (rx('contact|support|help.*you|customer service').test(lower))
    return { text: 'You can reach support at support@tajhotels.com or +992 (37) 221-23-45 — or use the Contact page. 📞' }

  // Travel advisor / attractions
  if (rx('visit|see|attraction|things to do|sightsee').test(lower))
    return { text: 'Top sights: Rudaki Park & the National Museum (Dushanbe), Khujand fortress & Panjshanbe Bazaar, the Pamir Highway near Khorog, and Iskanderkul Lake. Spring and early autumn are best for the mountains.' }
  if (rx('plan|itinerary|trip|\\bday(s)?\\b').test(lower))
    return {
      text:
        'Sample 3-day plan:\n• Day 1 — Dushanbe: Rudaki Ave, National Museum, Mehrgon Bazaar.\n• Day 2 — Iskanderkul Lake day trip.\n• Day 3 — Hisor Fortress, then a spa hotel.\nWant hotels for any of these? Just tell me the city and budget.',
    }

  // Hotel recommendation — query live data
  const nearAirport = rx('airport').test(lower)
  const city = CITIES.find((c) => lower.includes(c.toLowerCase())) ?? (nearAirport ? 'Dushanbe' : undefined)
  const priceMatch = lower.match(/\$?\s?(\d{2,5})/)
  const maxPrice = priceMatch ? parseInt(priceMatch[1]) : undefined

  if (city || maxPrice || rx('hotel|stay|room|recommend').test(lower)) {
    const res = await hotelsApi.getAll({ city, maxPrice })
    let hotels = res.data ?? []
    if (rx('best|top|rated|rating').test(lower)) hotels = [...hotels].sort((a, b) => b.rating - a.rating)
    hotels = hotels.slice(0, 3)

    if (hotels.length === 0)
      return { text: `I couldn't find hotels matching that${city ? ` in ${city}` : ''}. Try another city or a higher budget.` }

    const where = city ? ` in ${city}` : ''
    const budget = maxPrice ? ` under $${maxPrice}` : ''
    const note = nearAirport ? ' (closest to Dushanbe International Airport)' : ''
    return { text: `Here are some great hotels${where}${budget}${note}:`, hotels }
  }

  // Fallback
  return {
    text:
      "I can help with:\n• Hotel recommendations (e.g. \"hotel in Khujand under $150\")\n• Trip planning and things to do\n• Booking, cancellation & payment questions\n• Translating phrases to Tajik\nWhat would you like?",
  }
}
