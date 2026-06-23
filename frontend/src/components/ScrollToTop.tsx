import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls to the top whenever the route changes (professional SPA behavior).
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}
