import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import TeamsPage from './pages/TeamsPage.jsx'

function Analytics() {
  const location = useLocation()
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
      })
    }
  }, [location.pathname])
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Analytics />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/calendario" element={<CalendarPage />} />
        <Route path="/equipos" element={<TeamsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
