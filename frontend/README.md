# TajikistanHotels — Frontend

React + TypeScript single-page app for searching, viewing, and booking hotels in Tajikistan.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** (dev server + build)
- **Tailwind CSS v4** (shared component classes in `src/index.css`)
- **React Router** (routing)
- **TanStack Query** (data fetching/caching)
- **Zustand** (auth + toast state)
- **Axios** (HTTP client)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

The app expects the backend API at `http://localhost:5050/api`
(override with `VITE_API_URL`). Port 5000 is avoided because macOS
AirPlay Receiver occupies it.

## Project structure

```
src/
  components/   Navbar, Footer, Toaster
  pages/        Home, Search, HotelDetails, Booking,
                MyBookings, Login, Register, AdminDashboard
  services/     api.ts (axios + typed endpoints)
  stores/       authStore.ts, toastStore.ts
  types/        shared TypeScript interfaces
  index.css     Tailwind + shared .btn/.card/.input/.label classes
```

## Routes

| Path | Page | Notes |
|------|------|-------|
| `/` | Home | Hero search + featured hotels |
| `/search` | Search | Filter by city/price, result count |
| `/hotel/:id` | HotelDetails | Rooms, amenities, reviews |
| `/booking` | Booking | Real rooms + live total (needs login) |
| `/my-bookings` | MyBookings | View + cancel (needs login) |
| `/login`, `/register` | Auth | JWT auth |
| `/admin` | AdminDashboard | Add/list hotels (admin role only) |

## Implemented features

- User registration & login (JWT stored in localStorage)
- Hotel search with city + price filters and result count
- Hotel detail page (rooms, amenities, reviews display)
- Booking flow wired to **real room data** — total = room price × nights
- My Bookings page with cancel
- Admin dashboard to add hotels (role-gated)
- Unified design system, toast notifications, mobile nav

## Not yet implemented (see root `Readme.md` vision spec)

Favorites, review submission UI, AI assistant, maps, hotel-owner
dashboard, analytics, payments, i18n. These are future scope.
