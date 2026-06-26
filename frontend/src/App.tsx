import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toaster from './components/Toaster'
import ScrollToTop from './components/ScrollToTop'
import ChatWidget from './components/ChatWidget'
import './App.css'
import './index.css'

const Home = lazy(() => import('./pages/Home'))
const Search = lazy(() => import('./pages/Search'))
const HotelDetails = lazy(() => import('./pages/HotelDetails'))
const Booking = lazy(() => import('./pages/Booking'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const MyBookings = lazy(() => import('./pages/MyBookings'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Profile = lazy(() => import('./pages/Profile'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Assistant = lazy(() => import('./pages/Assistant'))
const Tours = lazy(() => import('./pages/Tours'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Settings = lazy(() => import('./pages/Settings'))
const MyReviews = lazy(() => import('./pages/MyReviews'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading page">
      <span />
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Toaster />
          <main className="grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/hotel/:id" element={<HotelDetails />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/my-reviews" element={<MyReviews />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
