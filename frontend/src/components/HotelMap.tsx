import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Coords } from '../lib/geo'

// Custom SVG pin — avoids Vite/Leaflet default-icon asset resolution issue.
function makePin(color = '#6366f1') {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path fill="${color}" d="M12 0C7.13 0 3 4.13 3 9c0 7.2 9 21 9 27 0-6 9-19.8 9-27C21 4.13 16.87 0 12 0z"/>
      <circle cx="12" cy="9" r="4.5" fill="white"/>
    </svg>`,
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -44],
    className: '',
  })
}

interface Props {
  center: Coords
  zoom?: number
  hotelName: string
  address: string
  /** Optional second pin for user location */
  userCoords?: Coords | null
  userLabel?: string
}

export default function HotelMap({ center, zoom = 14, hotelName, address, userCoords, userLabel }: Props) {
  const hotelIcon = useMemo(() => makePin('#6366f1'), [])
  const userIcon = useMemo(() => makePin('#10b981'), [])

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      className="w-full h-80 rounded-none"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[center.lat, center.lng]} icon={hotelIcon}>
        <Popup>
          <span className="font-semibold">{hotelName}</span>
          <br />
          <span className="text-xs text-gray-500">{address}</span>
        </Popup>
      </Marker>
      {userCoords && (
        <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
          <Popup>{userLabel ?? 'You are here'}</Popup>
        </Marker>
      )}
    </MapContainer>
  )
}
