import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SubPage from './pages/SubPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/corporatiu" element={<SubPage pageKey="corporatiu" />} />
        <Route path="/casaments" element={<SubPage pageKey="casaments" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
