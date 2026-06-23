import axios from 'axios'
import type { Hotel, MyBooking } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api'

const api = axios.create({
  baseURL: API_URL,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth types
interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

// Hotel types
interface HotelFilters {
  city?: string
  minPrice?: number
  maxPrice?: number
}

interface CreateHotelRequest {
  name: string
  description: string
  city: string
  address: string
  phone: string
  email: string
  price: number
  imageUrl?: string
}

// Booking types
interface CreateBookingRequest {
  hotelId: string
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  guestName: string
  guestEmail: string
  guestPhone: string
  specialRequests?: string
}

// Review types
interface CreateReviewRequest {
  hotelId: string
  rating: number
  comment: string
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password } as LoginRequest),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password } as RegisterRequest),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
}

export interface MyReview {
  id: string
  hotelId: string
  hotelName: string
  rating: number
  comment: string
  createdAt: string
}

// Hotels
export const hotelsApi = {
  getAll: (params?: HotelFilters) =>
    api.get<Hotel[]>('/hotels', { params }),
  getById: (id: string) => api.get<Hotel>(`/hotels/${id}`),
  create: (data: CreateHotelRequest) => api.post('/hotels', data),
  update: (id: string, data: Partial<CreateHotelRequest>) =>
    api.put(`/hotels/${id}`, data),
}

// Image upload (admin) — returns { url }
export const uploadApi = {
  image: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post<{ url: string }>('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// Bookings
export const bookingsApi = {
  create: (data: CreateBookingRequest) => api.post('/bookings', data),
  getMyBookings: () => api.get<MyBooking[]>('/bookings/my'),
  cancel: (id: string) => api.delete(`/bookings/${id}`),
}

// Reviews
export const reviewsApi = {
  getByHotel: (hotelId: string) =>
    api.get(`/reviews/hotel/${hotelId}`),
  create: (data: CreateReviewRequest) => api.post('/reviews', data),
  getMine: () => api.get<MyReview[]>('/reviews/my'),
}

export interface AdminBooking { id: string; hotelName: string; guestName: string; totalPrice: number; status: string; checkInDate: string; checkOutDate: string }
export interface AdminUser { id: string; fullName: string; email: string; role: string; createdAt: string }

// Admin
export const adminApi = {
  getAllBookings: () => api.get<AdminBooking[]>('/bookings/all'),
  getUsers: () => api.get<AdminUser[]>('/users'),
}

// Favorites
export const favoritesApi = {
  getAll: () => api.get<Hotel[]>('/favorites'),
  getIds: () => api.get<string[]>('/favorites/ids'),
  add: (hotelId: string) => api.post(`/favorites/${hotelId}`),
  remove: (hotelId: string) => api.delete(`/favorites/${hotelId}`),
}

export default api
