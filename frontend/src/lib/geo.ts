// Approximate coordinates for Tajik cities so each hotel can show a real map
// without storing lat/lng in the database.

export interface Coords { lat: number; lng: number }

export const CITY_COORDS: Record<string, Coords> = {
  dushanbe: { lat: 38.5598, lng: 68.787 },
  khujand: { lat: 40.2833, lng: 69.6228 },
  khorog: { lat: 37.4895, lng: 71.556 },
  ishkashim: { lat: 36.7269, lng: 71.6116 },
  bokhtar: { lat: 37.8364, lng: 68.78 },
  kulob: { lat: 37.9145, lng: 69.78 },
  penjikent: { lat: 39.4953, lng: 67.6094 },
}

// Country center fallback for unknown cities.
const DEFAULT: Coords = { lat: 38.861, lng: 71.2761 }

export function cityCoords(city: string | undefined): Coords {
  if (!city) return DEFAULT
  return CITY_COORDS[city.trim().toLowerCase()] ?? DEFAULT
}

// OpenStreetMap embeddable map URL with a marker on the point.
export function osmEmbed({ lat, lng }: Coords): string {
  const d = 0.04
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
}

// Link that opens directions / the location in OpenStreetMap.
export function osmLink({ lat, lng }: Coords): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`
}

// Haversine great-circle distance in kilometres.
export function haversineDistance(a: Coords, b: Coords): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}
