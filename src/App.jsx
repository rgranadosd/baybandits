import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

/* ── Assets — fotos ── */
import Photo1  from './assets/photos/Photo1.jpeg'
import Photo10 from './assets/photos/Photo10.jpeg'
import Photo11 from './assets/photos/Photo11.jpeg'
import Photo7  from './assets/photos/Photo7.jpeg'
import LogoBB  from './assets/logos/baybandits.png'

/* ── Home video sources ── */
const VIDEO_MP4  = `${import.meta.env.BASE_URL}videos/bandits-wb.mp4`

const sponsorLogos = Object.entries(
  import.meta.glob('./assets/partners/*.{png,jpg,jpeg,svg,PNG,JPG,JPEG,SVG}', {
    eager: true,
    import: 'default',
  })
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => {
    const fileName = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Patrocinador'
    return {
      src,
      alt: fileName.replace(/[_-]+/g, ' ').trim(),
    }
  })

/* ── Traduccions ── */

const i18n = {
  es: {
    cta1: 'nuestros equipos',
    cta2: 'calendario 2026',
    contact: 'CONTACTO',
    club: 'El Club',
    horaris: 'Horarios Playa',
    inscripcions: 'Inscripciones',
    seccio: 'Sección de balonmano playa del Handbol Cooperativa Sant Boi.',
    stats: '7 equipos · 100+ jugadores · Est. 2023',
    sponsorsKicker: 'Partners oficiales',
    sponsors: 'Patrocinadores',
    sponsorsLead: 'Marcas que apoyan nuestro proyecto deportivo.',
    legal: '© 2026 baybandits · Handbol Cooperativa Sant Boi',
    privacy: 'Política de privacidad',
  },
  ca: {
    cta1: 'els nostres equips',
    cta2: 'calendari 2026',
    contact: 'CONTACTE',
    club: 'El Club',
    horaris: 'Horaris Platja',
    inscripcions: 'Inscripcions',
    seccio: "Secció d'handbol platja de l'Handbol Cooperativa Sant Boi.",
    stats: '7 equips · 100+ jugadors · Est. 2023',
    sponsorsKicker: 'Partners oficials',
    sponsors: 'Patrocinadors',
    sponsorsLead: 'Marques que donen suport al nostre projecte esportiu.',
    legal: '© 2026 baybandits · Handbol Cooperativa Sant Boi',
    privacy: 'Política de privacitat',
  },
}

function App() {
  const videoRef = useRef(null)
  const pageRef         = useRef(null)
  const [lang, setLang]         = useState('es')
  const [videoPct, setVideoPct] = useState(0)
  const t = i18n[lang]

  /* ── Video play + loading progress ── */
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    let hasStarted = false

    vid.autoplay = true
    vid.loop = true
    vid.muted = true
    vid.defaultMuted = true
    vid.playsInline = true
    vid.setAttribute('muted', '')
    vid.setAttribute('playsinline', '')
    vid.setAttribute('webkit-playsinline', 'true')
    vid.setAttribute('autoplay', '')

    if (!vid.getAttribute('src')) {
      vid.setAttribute('src', VIDEO_MP4)
    }

    const tryPlay = () => {
      const playPromise = vid.play()
      if (playPromise?.catch) playPromise.catch(() => {})
    }

    const primeFrame = () => {
      if (vid.currentTime > 0) return
      try {
        vid.currentTime = 0.001
      } catch {
        // Safari iOS may reject early seeks until metadata is available.
      }
    }

    const markStarted = () => {
      hasStarted = true
      window.clearInterval(retryPlayInterval)
      window.clearTimeout(stopRetryTimeout)
    }

    vid.load()
    tryPlay()

    const handleCanPlayThrough = () => setVideoPct(100)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }

    const retryPlayInterval = window.setInterval(() => {
      if (hasStarted) return
      primeFrame()
      tryPlay()
    }, 350)

    const stopRetryTimeout = window.setTimeout(() => {
      window.clearInterval(retryPlayInterval)
    }, 8000)

    vid.addEventListener('canplay', tryPlay)
    vid.addEventListener('loadedmetadata', primeFrame)
    vid.addEventListener('loadedmetadata', tryPlay)
    vid.addEventListener('loadeddata', tryPlay)
    vid.addEventListener('playing', markStarted)
    vid.addEventListener('timeupdate', markStarted)
    vid.addEventListener('seeked', tryPlay)
    vid.addEventListener('suspend', tryPlay)
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('pageshow', tryPlay)

    const updateProgress = () => {
      if (!vid.duration) return
      let loaded = 0
      for (let i = 0; i < vid.buffered.length; i++) {
        loaded = Math.max(loaded, vid.buffered.end(i))
      }
      setVideoPct(Math.min(100, Math.round((loaded / vid.duration) * 100)))
    }

    vid.addEventListener('progress', updateProgress)
    vid.addEventListener('canplaythrough', handleCanPlayThrough)
    if (vid.readyState >= 4) setVideoPct(100)
    return () => {
      vid.removeEventListener('canplay', tryPlay)
      vid.removeEventListener('loadedmetadata', primeFrame)
      vid.removeEventListener('loadedmetadata', tryPlay)
      vid.removeEventListener('loadeddata', tryPlay)
      vid.removeEventListener('playing', markStarted)
      vid.removeEventListener('timeupdate', markStarted)
      vid.removeEventListener('seeked', tryPlay)
      vid.removeEventListener('suspend', tryPlay)
      vid.removeEventListener('progress', updateProgress)
      vid.removeEventListener('canplaythrough', handleCanPlayThrough)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('pageshow', tryPlay)
      window.clearInterval(retryPlayInterval)
      window.clearTimeout(stopRetryTimeout)
    }
  }, [])

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

      {/* ── Language switcher (top-right) ── */}
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
          <video ref={videoRef} className="bg-vid" autoPlay loop muted playsInline preload="auto" disablePictureInPicture />
        </div>
        <div className="overlay overlay--light" />
        <div className="hero-center anim-in">
          <img src={LogoBB} alt="baybandits" className="logo-intro__mark" />
          {videoPct < 100 && (
            <div className="vid-progress" role="progressbar" aria-valuenow={videoPct} aria-valuemin={0} aria-valuemax={100}>
              <div className="vid-progress__bar" style={{ width: `${videoPct}%` }} />
            </div>
          )}
        </div>
      </section>

      {/* ═══ SECTION 2 — CTA Equips (grayscale + dark overlay) ═══ */}
      <section className="snap-section cta-section cta-section--dark">
        <div className="cta-bg" style={{ backgroundImage: `url(${Photo11})` }} />
        <div className="overlay overlay--dark" />
        <div className="cta-content anim-in">
          <Link to="/equipos" className="cta-button">
            {t.cta1}
          </Link>
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

      {/* ═══ SECTION 4 — Sponsors ═══ */}
      <section className="snap-section sponsors-section">
        <div className="cta-bg" style={{ backgroundImage: `url(${Photo7})` }} />
        <div className="overlay overlay--dark" />
        <div className="sponsors-wrap anim-in">
          <p className="sponsors-kicker">{t.sponsorsKicker}</p>
          <h3 className="sponsors-title">{t.sponsors}</h3>
          <p className="sponsors-lead">{t.sponsorsLead}</p>
          <div className="sponsors-grid" aria-label={t.sponsors}>
            {sponsorLogos.map((logo) => (
              <article className="sponsor-card" key={logo.src}>
                <img src={logo.src} alt={logo.alt} loading="lazy" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5 — Footer / Contact ═══ */}
      <section className="snap-section footer-section">
        <div className="footer-bg-image" style={{ backgroundImage: `url(${Photo1})` }} />
        <div className="overlay overlay--heavy" />

        <div className="footer-content anim-in">
          <img src={LogoBB} alt="baybandits" className="footer-logo" />

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
              <h4>baybandits</h4>
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