import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

/* ── Assets ── */
const DESKTOP_VIDEO = 'https://sensacions.com/wp-content/uploads/2024/09/SENSACIONS_LANDING_V3.webm'
const MOBILE_VIDEO  = 'https://sensacions.com/wp-content/uploads/2024/04/SENSACIONS_LANDING_VERT_V31.mp4'
const LOGO_MARK     = 'https://sensacions.com/wp-content/uploads/2022/11/Recurso-27.png'
const LOGO_WHITE    = 'https://sensacions.com/wp-content/uploads/2022/11/SGE_Principal-Blanco.png'

const BG_CORP_DESK  = 'https://sensacions.com/wp-content/uploads/2023/06/D01_CORPORATIU.jpg'
const BG_CORP_MOB   = 'https://sensacions.com/wp-content/uploads/2023/06/M01_CORPORATIU.jpg'
const BG_BODA_DESK  = 'https://sensacions.com/wp-content/uploads/2023/06/D02_BODAS.jpg'
const BG_BODA_MOB   = 'https://sensacions.com/wp-content/uploads/2023/06/M02_BODAS.jpg'

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
  const [muted, setMuted]     = useState(true)
  const [isMobile, setIsMobile] = useState(false)

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

      {/* ── Language switcher (top-right, like original) ── */}
      <nav className="lang-nav" aria-label="Idioma">
        <span className="lang-active">CA</span>
        <a href="#es" onClick={(e) => e.preventDefault()}>ES</a>
        <a href="#en" onClick={(e) => e.preventDefault()}>EN</a>
      </nav>

      {/* ═══ SECTION 1 — Hero: Logo + Video + Mute ═══ */}
      <section className="snap-section hero-section">
        <div className="video-bg">
          <video ref={videoDesktopRef} className="bg-vid bg-vid--desk" src={DESKTOP_VIDEO} autoPlay loop muted playsInline />
          <video ref={videoMobileRef}  className="bg-vid bg-vid--mob"  src={MOBILE_VIDEO}  autoPlay loop muted playsInline />
        </div>
        <div className="overlay overlay--light" />
        <div className="hero-center anim-in">
          <img src={LOGO_MARK} alt="Sensacions" className="logo-intro__mark" />
        </div>
        <button className="mute-toggle" onClick={toggleMute} aria-label={muted ? 'Activar so' : 'Silenciar'}>
          {muted ? <VolumeOff /> : <VolumeOn />}
        </button>
      </section>

      {/* ═══ SECTION 2 — CTA Esdeveniments Corporatius (parallax bg) ═══ */}
      <section className="snap-section cta-section cta-corp" style={{ backgroundImage: `url(${isMobile ? BG_CORP_MOB : BG_CORP_DESK})` }}>
        <div className="overlay overlay--dark" />
        <div className="cta-content anim-in">
          <Link to="/corporatiu" className="cta-button">
            esdeveniments corporatius
          </Link>
        </div>
      </section>

      {/* ═══ SECTION 3 — CTA Casaments (parallax bg) ═══ */}
      <section className="snap-section cta-section cta-boda" style={{ backgroundImage: `url(${isMobile ? BG_BODA_MOB : BG_BODA_DESK})` }}>
        <div className="overlay overlay--dark" />
        <div className="cta-content anim-in">
          <Link to="/casaments" className="cta-button">
            casaments
          </Link>
        </div>
      </section>

      {/* ═══ SECTION 4 — Footer / Contact (video bg) ═══ */}
      <section className="snap-section footer-section">
        <div className="footer-bg-image" />
        <div className="overlay overlay--heavy" />

        <div className="footer-content anim-in">
          <img src={LOGO_WHITE} alt="Sensacions" className="footer-logo" />

          <div className="footer-columns">
            {/* Col 1 — Contacte */}
            <div className="footer-col">
              <a href="mailto:events@sensacions.barcelona">events@sensacions.barcelona</a>
              <a href="tel:+34931874342">+34 931 874 342</a>
              <p>Av. Can Magí, 5<br/>08173 Sant Cugat del Vallès<br/>(Barcelona)</p>
            </div>

            {/* Col 2 — Navegació */}
            <div className="footer-col footer-col--nav">
              <Link to="/corporatiu">Corporatiu</Link>
              <Link to="/casaments">Casaments</Link>
              <a href="#gastronomia" onClick={(e) => e.preventDefault()}>Gastronomia</a>
              <a href="#equip" onClick={(e) => e.preventDefault()}>Equip</a>
              <a href="#sostenibilitat" onClick={(e) => e.preventDefault()}>Sostenibilitat</a>
              <a href="#blog" onClick={(e) => e.preventDefault()}>Blog</a>
              <a href="#contacte" onClick={(e) => e.preventDefault()}>Contacte</a>
            </div>

            {/* Col 3 — Com arribar */}
            <div className="footer-col">
              <h4>COM ARRIBAR</h4>
              <p>Bus: L1 Sant Cugat, L8 Sant Cugat, PR A4 Barcelona</p>
              <p>Tren: Ferrocarrils catalans S1 i S2, Rodalies R8</p>
            </div>
          </div>

          {/* Social */}
          <div className="footer-social">
            <a href="https://www.facebook.com/sensacionsbarcelona/" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 320 512" fill="currentColor" width="18" height="18"><path d="M80 299.3V512h116V299.3h86.5l12-95.8H196V135.7c0-26.2 7.2-44 44.8-44H300V6.3C294.5 5.5 264.7 3 229.8 3 157 3 108 47 108 133.3v70.2H20v95.8h88z"/></svg>
            </a>
            <a href="https://www.instagram.com/sensacionsbarcelona/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 448 512" fill="currentColor" width="18" height="18"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.8 224.1 370.8 339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8 0-14.9 12-26.8 26.8-26.8 14.9 0 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1S4.2 127.9 2.4 163.8c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/sensacionsbarcelona/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 448 512" fill="currentColor" width="18" height="18"><path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8S24.1 0 53.8 0s53.8 24.1 53.8 53.8-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"/></svg>
            </a>
          </div>

          {/* Legal */}
          <div className="footer-legal">
            <a href="#cookies" onClick={(e) => e.preventDefault()}>Política de cookies</a>
            <a href="#avis-legal" onClick={(e) => e.preventDefault()}>Avís legal</a>
            <a href="#privacitat" onClick={(e) => e.preventDefault()}>Política de privacitat</a>
            <a href="#denuncies" onClick={(e) => e.preventDefault()}>Canal de denúncies</a>
            <a href="#qualitat" onClick={(e) => e.preventDefault()}>Política de qualitat</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
