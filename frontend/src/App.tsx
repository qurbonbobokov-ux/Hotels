import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import HotelDetails from './pages/HotelDetails'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import MyBookings from './pages/MyBookings'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Assistant from './pages/Assistant'
import Tours from './pages/Tours'
import ForgotPassword from './pages/ForgotPassword'
import Settings from './pages/Settings'
import MyReviews from './pages/MyReviews'
import Toaster from './components/Toaster'
import ScrollToTop from './components/ScrollToTop'
import ChatWidget from './components/ChatWidget'
import './App.css'
import './index.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <Toaster />
          <main className="grow">
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
          </main>
          <Footer />
          <ChatWidget />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
