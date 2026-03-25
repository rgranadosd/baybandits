import { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'

/* ── Assets — fotos ── */
import Photo1  from './assets/photos/Photo1.jpeg'
import Photo10 from './assets/photos/Photo10.jpeg'
import Photo11 from './assets/photos/Photo11.jpeg'
import LogoBB  from './assets/logos/ESCUDO BAY BANDITS 2026.PNG'

/* ── Sensacions original video ── */
const DESKTOP_VIDEO = 'https://sensacions.com/wp-content/uploads/2024/09/SENSACIONS_LANDING_V3.webm'
const MOBILE_VIDEO  = 'https://sensacions.com/wp-content/uploads/2024/04/SENSACIONS_LANDING_VERT_V31.mp4'

/* ── Traduccions ── */
const i18n = {
  es: {
    cta1: 'únete a los bandits',
    cta2: 'calendario 2025',
    contact: 'CONTACTO',
    club: 'El Club',
    horaris: 'Horarios Playa',
    inscripcions: 'Inscripciones',
    seccio: 'Sección de balonmano playa del Handbol Cooperativa Sant Boi.',
    stats: '7 equipos · 100+ jugadores · Est. 2023',
    legal: '© 2025 Bay Bandits · Handbol Cooperativa Sant Boi',
    privacy: 'Política de privacidad',
  },
  ca: {
    cta1: 'uneix-te als bandits',
    cta2: 'calendari 2025',
    contact: 'CONTACTE',
    club: 'El Club',
    horaris: 'Horaris Platja',
    inscripcions: 'Inscripcions',
    seccio: "Secció d'handbol platja de l'Handbol Cooperativa Sant Boi.",
    stats: '7 equips · 100+ jugadors · Est. 2023',
    legal: '© 2025 Bay Bandits · Handbol Cooperativa Sant Boi',
    privacy: 'Política de privacitat',
  },
}

/* ── SVG icons ── */
const VolumeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" width="22" height="22">
    <path d="M301.1 34.8C312.6 40 320 51.4 320 64v384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64v-64c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/>
  </svg>
)
const VolumeOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" width="22" height="22">
    <path d="M301.1 34.8C312.6 40 320 51.4 320 64v384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64v-64c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C425.9 196.6 434 215.2 434 256s-8.1 59.4-21.4 74.5c-8.5 9.7-23.7 10.7-33.4 2.2s-10.7-23.7-2.2-33.4c6.1-6.9 9-16.4 9-43.3s-2.9-36.4-9-43.3c-8.5-9.7-7.5-24.9 2.2-33.4s24.9-7.5 33.4 2.2zm69.9-50.2c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8c31.6-25.8 53.3-65.3 53.3-111.7s-21.7-85.9-53.3-111.7c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm86.8-79.7C623.5 93.8 640 165.8 640 256s-16.5 162.2-69.6 204.5c-10.3 8.2-25.4 6.5-33.6-3.8s-6.5-25.4 3.8-33.6C584.4 387.4 592 324.2 592 256s-7.6-131.4-51.4-167.1c-10.3-8.2-11.9-23.3-3.8-33.6s23.3-11.9 33.6-3.8z"/>
  </svg>
)

function App() {
  const videoDesktopRef = useRef(null)
  const videoMobileRef  = useRef(null)
  const pageRef         = useRef(null)
  const [muted, setMuted]       = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [lang, setLang]         = useState('es')
  const t = i18n[lang]

  /* ── Mobile detect ── */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  /* ── Video mute / play ── */
  useEffect(() => {
    const vid = isMobile ? videoMobileRef.current : videoDesktopRef.current
    if (!vid) return
    vid.muted = muted
    vid.play().catch(() => {})
  }, [muted, isMobile])

  const toggleMute = useCallback(() => setMuted(m => !m), [])

  /* ── Intersection Observer – fade-in on scroll ── */
  useEffect(() => {
    const els = document.querySelectorAll('.anim-in')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="page" ref={pageRef}>
      <div className="page-transition" />

      {/* ── Language switcher (top-right, like sensacions) ── */}
      <nav className="lang-nav" aria-label="Idioma">
        <button
          className={lang === 'es' ? 'lang-active' : ''}
          onClick={() => setLang('es')}
        >ES</button>
        <button
          className={lang === 'ca' ? 'lang-active' : ''}
          onClick={() => setLang('ca')}
        >CA</button>
      </nav>

      {/* ═══ SECTION 1 — Hero: Logo + Video + Mute ═══ */}
      <section className="snap-section hero-section">
        <div className="video-bg">
          <video ref={videoDesktopRef} className="bg-vid bg-vid--desk" src={DESKTOP_VIDEO} autoPlay loop muted playsInline />
          <video ref={videoMobileRef}  className="bg-vid bg-vid--mob"  src={MOBILE_VIDEO}  autoPlay loop muted playsInline />
        </div>
        <div className="overlay overlay--light" />
        <div className="hero-center anim-in">
          <img src={LogoBB} alt="Bay Bandits" className="logo-intro__mark" />
        </div>
        <button className="mute-toggle" onClick={toggleMute} aria-label={muted ? 'Activar so' : 'Silenciar'}>
          {muted ? <VolumeOff /> : <VolumeOn />}
        </button>
      </section>

      {/* ═══ SECTION 2 — CTA Equips (grayscale + dark overlay) ═══ */}
      <section className="snap-section cta-section cta-section--dark">
        <div className="cta-bg" style={{ backgroundImage: `url(${Photo11})` }} />
        <div className="overlay overlay--dark" />
        <div className="cta-content anim-in">
          <a href="https://hcsbhandbol.com/inscripciones/" target="_blank" rel="noreferrer" className="cta-button">
            {t.cta1}
          </a>
        </div>
      </section>

      {/* ═══ SECTION 3 — CTA Temporada (grayscale + light overlay) ═══ */}
      <section className="snap-section cta-section cta-section--light">
        <div className="cta-bg" style={{ backgroundImage: `url(${Photo10})` }} />
        <div className="overlay overlay--light-wash" />
        <div className="cta-content anim-in">
          <a href="https://hcsbhandbol.com/horari-platja/" target="_blank" rel="noreferrer" className="cta-button cta-button--dark">
            {t.cta2}
          </a>
        </div>
      </section>

      {/* ═══ SECTION 4 — Footer / Contact ═══ */}
      <section className="snap-section footer-section">
        <div className="footer-bg-image" style={{ backgroundImage: `url(${Photo1})` }} />
        <div className="overlay overlay--heavy" />

        <div className="footer-content anim-in">
          <img src={LogoBB} alt="Bay Bandits" className="footer-logo" />

          <div className="footer-columns">
            {/* Col 1 — Contacte */}
            <div className="footer-col">
              <h4>{t.contact}</h4>
              <a href="mailto:hcsbhandbol@gmail.com">hcsbhandbol@gmail.com</a>
              <a href="tel:+34661342473">+34 661 34 24 73</a>
              <p>C/ de Lluís Companys, 23<br/>08830 Sant Boi de Llobregat<br/>(Barcelona)</p>
            </div>

            {/* Col 2 — Info */}
            <div className="footer-col footer-col--nav">
              <a href="https://hcsbhandbol.com/historia/" target="_blank" rel="noreferrer">{t.club}</a>
              <a href="https://hcsbhandbol.com/horari-platja/" target="_blank" rel="noreferrer">{t.horaris}</a>
              <a href="https://hcsbhandbol.com/inscripciones/" target="_blank" rel="noreferrer">{t.inscripcions}</a>
            </div>

            {/* Col 3 — La secció */}
            <div className="footer-col">
              <h4>BAY BANDITS</h4>
              <p>{t.seccio}</p>
              <p>{t.stats}</p>
            </div>
          </div>

          {/* Social */}
          <div className="footer-social">
            <a href="https://www.instagram.com/baybanditsbh" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 448 512" fill="currentColor" width="18" height="18"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.8 224.1 370.8 339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8 0-14.9 12-26.8 26.8-26.8 14.9 0 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1S4.2 127.9 2.4 163.8c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
            </a>
            <a href="https://twitter.com/hcsantboi" target="_blank" rel="noreferrer" aria-label="Twitter / X">
              <svg viewBox="0 0 512 512" fill="currentColor" width="18" height="18"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48H172.4l102.5 135.5zm-24.8 373.8h39.1L151.1 88h-42z"/></svg>
            </a>
            <a href="mailto:hcsbhandbol@gmail.com" aria-label="Email">
              <svg viewBox="0 0 512 512" fill="currentColor" width="18" height="18"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4l217.6 163.2c11.4 8.5 27 8.5 38.4 0l217.6-163.2C504.9 141.3 512 127.1 512 112c0-26.5-21.5-48-48-48H48zm-6.4 254.4C14.7 297.5 0 278 0 256V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V256c0-22-14.7-41.5-36.6-46.6L256 372.8 54.4 318.4z"/></svg>
            </a>
          </div>

          {/* Legal */}
          <div className="footer-legal">
            <span>{t.legal}</span>
            <a href="https://hcsbhandbol.com/politica-de-privacitat/" target="_blank" rel="noreferrer">{t.privacy}</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App