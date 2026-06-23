export interface Hotel {
  id: string
  name: string
  city: string
  address: string
  description: string
  rating: number
  price: number
  images: string[]
  amenities: string[]
  rooms: Room[]
}

export interface Room {
  id: string
  hotelId: string
  type: string
  capacity: number
  price: number
  available: boolean
}

export interface Booking {
  id: string
  hotelId: string
  roomId: string
  userId: string
  checkIn: string
  checkOut: string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled'
  totalPrice: number
}

export interface Review {
  id: string
  hotelId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

// Matches the backend BookingDto returned by GET /bookings/my
export interface MyBooking {
  id: string
  hotelId: string
  hotelName: string
  checkInDate: string
  checkOutDate: string
  guestCount: number
  totalPrice: number
  status: string
  createdAt: string
}
