import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import TeamsPage from './pages/TeamsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/calendario" element={<CalendarPage />} />
        <Route path="/equipos" element={<TeamsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
