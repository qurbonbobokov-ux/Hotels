// The seed data ships with placeholder image URLs. To make the UI look real,
// we swap those for a curated set of Unsplash hotel photos (deterministic per hotel).

const GALLERY = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
]

function isPlaceholder(url?: string): boolean {
  return !url || url.includes('placeholder') || url.trim() === ''
}

// Stable index from a string (hotel id) so the same hotel always gets the same photo.
function hashIndex(seed: string, mod: number): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h % mod
}

export function hotelImage(url: string | undefined, seed: string): string {
  if (!isPlaceholder(url)) return url as string
  return GALLERY[hashIndex(seed, GALLERY.length)]
}

// A deterministic set of distinct photos for a hotel's gallery.
export function hotelGallery(url: string | undefined, seed: string, count = 5): string[] {
  const start = hashIndex(seed, GALLERY.length)
  const rotated = GALLERY.map((_, i) => GALLERY[(start + i) % GALLERY.length])
  const list = isPlaceholder(url) ? rotated : [url as string, ...rotated]
  return list.slice(0, count)
}
