import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

const LOGO_WHITE = 'https://sensacions.com/wp-content/uploads/2022/11/SGE_Principal-Blanco-1024x311.png'
const LOGO_DARK  = 'https://sensacions.com/wp-content/uploads/2022/11/SGE_Principal-Positivo-e1680104677436-1024x346.png'
const IMG_BASE   = 'https://sensacions.com/wp-content/uploads/2024/01/'

/* ── Page configs ── */
const PAGES = {
  corporatiu: {
    theme: 'dark',               // #0F0F0F bg, white text
    logo: LOGO_WHITE,
    title: 'CORPORATIU',
    heroDesktop: `${IMG_BASE}DESKTOP-1-1.jpg`,
    heroMobile:  `${IMG_BASE}MOBILE-1-1.jpg`,
    queFem: {
      label: 'QUÈ FEM?',
      lines: ['Alta gastronomia', 'PER <b>GRANS<br/>ESDEVENIMENTS</b>'],
    },
    desc1: 'Moltes empreses nacionals i internacionals, DMCs i organismes públics confien en nosaltres, en la nostra feina i el nostre compromís.',
    comHoFem: {
      label: 'COM HO FEM?',
      lines: ['Passió', 'per cada <b>detall</b>'],
    },
    desc2: 'Cada esdeveniment és una oportunitat per comunicar la vostra visió, valors i essència. Oferim un servei integral que inclou gastronomia d\'alta qualitat, disseny d\'espais, producció i coordinació logística.',
    parallax1: `${IMG_BASE}DESKTOP-2-1.jpg`,
    parallax1Mob: `${IMG_BASE}MOBILE-2-1.jpg`,
    parallax2: `${IMG_BASE}DESKTOP-3-1.jpg`,
    parallax2Mob: `${IMG_BASE}MOBILE-3-1.jpg`,
    venues: [
      { name: 'Can Magí', desc: 'Una antiga masia vinícola, amb exteriors i interiors perfectament preparats per acollir tota mena d\'esdeveniments de gran format durant tot l\'any.', imgs: [`${IMG_BASE}1-10.jpg`,`${IMG_BASE}2-10.jpg`,`${IMG_BASE}3-10.jpg`,`${IMG_BASE}4-10.jpg`] },
      { name: 'Xalet del Nin', desc: 'Amb més de 150 metres de vistes frontals al Mar Mediterrani. És un dels espais més exclusius de tota la costa catalana.', imgs: [`${IMG_BASE}1-11.jpg`,`${IMG_BASE}2-11.jpg`,`${IMG_BASE}3-11.jpg`,`${IMG_BASE}4-11.jpg`] },
      { name: 'MNAC', desc: 'Amb la seva privilegiada ubicació a Montjuïc, exhibeix la col·lecció d\'art català més important del món.', imgs: [`${IMG_BASE}1-12.jpg`,`${IMG_BASE}2-12.jpg`,`${IMG_BASE}3-12.jpg`,`${IMG_BASE}4-12.jpg`] },
      { name: 'La Llotja de Mar', desc: 'Declarat Bé Cultural d\'Interès Nacional i amb més de 600 anys d\'història.', imgs: [`${IMG_BASE}1-13.jpg`,`${IMG_BASE}2-13.jpg`,`${IMG_BASE}3-13.jpg`] },
      { name: 'Drassanes Reials', desc: 'Construït al segle XIII, avui dia és la seu del Museu Marítim de Barcelona.', imgs: [`${IMG_BASE}1-14.jpg`,`${IMG_BASE}2-14.jpg`,`${IMG_BASE}3-14.jpg`,`${IMG_BASE}4-13.jpg`] },
      { name: 'Codorniu', desc: 'Les bodegues Codorniu representen el modernisme català i un espai únic per a grans esdeveniments.', imgs: [`${IMG_BASE}1-15.jpg`,`${IMG_BASE}2-15.jpg`,`${IMG_BASE}3-15.jpg`] },
      { name: 'MACBA', desc: 'Art, cultura i modernitat. Un dels espais més emblemàtics de Barcelona.', imgs: [`${IMG_BASE}1-16.jpg`,`${IMG_BASE}2-16.jpg`,`${IMG_BASE}3-16.jpg`] },
      { name: 'La Pedrera', desc: 'Coneguda com a Casa Milà, declarada Patrimoni Mundial per la UNESCO, és l\'espai més exclusiu de la ciutat.', imgs: [`${IMG_BASE}1-17.jpg`,`${IMG_BASE}2-17.jpg`,`${IMG_BASE}3-17.jpg`] },
      { name: 'Casa Batlló', desc: 'Un dels edificis més visitats de tot el territori nacional pel seu encant modernista gràcies a l\'arquitectura d\'Antoni Gaudí.', imgs: [`${IMG_BASE}2-18.jpg`,`${IMG_BASE}1-18.jpg`] },
      { name: 'Masia Rosàs', desc: 'Masia catalana que combina història i modernitat per acollir els esdeveniments més exclusius.', imgs: [`${IMG_BASE}1-19.jpg`,`${IMG_BASE}2-19.jpg`,`${IMG_BASE}3-18.jpg`,`${IMG_BASE}4-15.jpg`] },
      { name: 'Fira de Barcelona', desc: 'Amb més de 500.000 m² de superfície, és un dels espais més grans disponibles a Barcelona.', imgs: [`${IMG_BASE}1-20.jpg`,`${IMG_BASE}2-20.jpg`,`${IMG_BASE}3-19.jpg`] },
      { name: 'I on més vulguis', desc: 'Ens adaptem a les teves necessitats i portem la nostra gastronomia allà on tu vulguis.', imgs: [`${IMG_BASE}1-1-1.jpg`,`${IMG_BASE}2-1-1.jpg`,`${IMG_BASE}3-1-1.jpg`] },
    ],
    clients: true,
    clientsDesc: 'Moltes empreses nacionals i internacionals, DMCs i organismes públics confien en nosaltres, en la nostra feina i el nostre compromís.',
  },
  casaments: {
    theme: 'light',              // #FFF bg, dark text
    logo: LOGO_DARK,
    title: 'CASAMENTS',
    heroDesktop: `${IMG_BASE}DESKTOP-1.jpg`,
    heroMobile:  `${IMG_BASE}MOBILE-1.jpg`,
    queFem: {
      label: 'QUÈ FEM?',
      lines: ['Inspirant<br/>emocions, creant'],
      animated: ['records', 'moments', 'memòries'],
    },
    desc1: 'Transformem cada celebració en una experiència completa de 360 graus, amb la gastronomia en el punt central d\'aquesta vivència. Posem la nostra màgia a disposició de cada parella.',
    comHoFem: {
      label: 'COM HO FEM?',
      lines: ['Creativitat<br/>i passió', 'En cada<br/><b>casament</b>'],
    },
    desc2: 'La nostra filosofia es basa en la comprensió de les vostres idees i desitjos, <b>per crear un casament que us representi plenament</b>. Us acompanyem al llarg de tot el procés.',
    parallax1: `${IMG_BASE}DESKTOP-2.jpg`,
    parallax1Mob: `${IMG_BASE}MOBILE-2.jpg`,
    parallax2: `${IMG_BASE}DESKTOP-3-scaled.jpg`,
    parallax2Mob: `${IMG_BASE}MOBILE-3.jpg`,
    venues: [
      { name: 'Can Magí', desc: 'Una antiga masia vinícola, amb exteriors i interiors perfectament preparats per acollir casaments durant tot l\'any.', imgs: [`${IMG_BASE}1-10.jpg`,`${IMG_BASE}2-10.jpg`,`${IMG_BASE}3-10.jpg`] },
      { name: 'Xalet del Nin', desc: 'Amb més de 150 metres de vistes frontals al Mar Mediterrani.', imgs: [`${IMG_BASE}1-11.jpg`,`${IMG_BASE}2-11.jpg`,`${IMG_BASE}3-11.jpg`] },
      { name: 'Vallfort', desc: 'Tradició envoltada de natura i vinyes, disposa d\'un entorn de més de tres hectàrees al cor del Penedès.', imgs: [`${IMG_BASE}1-2.jpg`,`${IMG_BASE}2-10.jpg`] },
      { name: 'Bell Recó', desc: 'De l\'any 1952, és una finca pairal de la burgesia catalana, un espai exclusiu al ben mig del Maresme.', imgs: [`${IMG_BASE}1-3.jpg`,`${IMG_BASE}2-10.jpg`] },
      { name: 'Masia Rosàs', desc: 'Espai que combina història i modernitat per acollir casaments amb tota mena de versatilitat.', imgs: [`${IMG_BASE}2-5.jpg`,`${IMG_BASE}1-19.jpg`] },
      { name: 'La Garriga de Castelladral', desc: 'D\'origen medieval, l\'espai ideal per connectar amb la natura.', imgs: [`${IMG_BASE}3-6.jpg`,`${IMG_BASE}2-10.jpg`] },
      { name: 'Mas Terrats', desc: 'Del segle XVII, situada a un dels racons amb més encant de Catalunya, l\'Empordà.', imgs: [`${IMG_BASE}1-7.jpg`,`${IMG_BASE}2-10.jpg`] },
      { name: 'Illa de Gràcia', desc: 'Un dels espais més privilegiats de Catalunya, una illa natural al riu Ebre.', imgs: [`${IMG_BASE}1-8.jpg`,`${IMG_BASE}2-10.jpg`] },
      { name: 'I on més vulguis', desc: 'Ens adaptem al lloc que trieu i hi portem tota la nostra màgia.', imgs: [`${IMG_BASE}1-1-1.jpg`,`${IMG_BASE}2-1-1.jpg`] },
    ],
    clients: false,
  }
}

/* ── Venue Card with mini image slider ── */
function VenueCard({ venue, theme }) {
  const [idx, setIdx] = useState(0)
  const len = venue.imgs.length
  const prev = useCallback((e) => { e.stopPropagation(); setIdx(i => (i - 1 + len) % len) }, [len])
  const next = useCallback((e) => { e.stopPropagation(); setIdx(i => (i + 1) % len) }, [len])

  return (
    <div className={`sp-venue ${theme === 'light' ? 'sp-venue--light' : ''}`}>
      <div className="sp-venue__slider">
        <img src={venue.imgs[idx]} alt={venue.name} className="sp-venue__img" />
        {len > 1 && (
          <>
            <button className="sp-venue__arrow sp-venue__arrow--prev" onClick={prev} aria-label="Anterior">‹</button>
            <button className="sp-venue__arrow sp-venue__arrow--next" onClick={next} aria-label="Següent">›</button>
          </>
        )}
      </div>
      <h2 className="sp-venue__name">{venue.name}</h2>
      <p className="sp-venue__desc">{venue.desc}</p>
    </div>
  )
}

/* ── Venues Carousel ── */
function VenuesCarousel({ venues, theme }) {
  const trackRef = useRef(null)
  const [offset, setOffset] = useState(0)
  const perView = 3
  const maxOffset = Math.max(0, venues.length - perView)

  const slidePrev = () => setOffset(o => Math.max(0, o - 1))
  const slideNext = () => setOffset(o => Math.min(maxOffset, o + 1))

  return (
    <div className="sp-carousel">
      <button className="sp-carousel__arrow sp-carousel__arrow--prev" onClick={slidePrev} aria-label="Anterior">‹</button>
      <div className="sp-carousel__viewport">
        <div
          className="sp-carousel__track"
          ref={trackRef}
          style={{ transform: `translateX(-${offset * (100 / perView)}%)` }}
        >
          {venues.map(v => (
            <div key={v.name} className="sp-carousel__slide">
              <VenueCard venue={v} theme={theme} />
            </div>
          ))}
        </div>
      </div>
      <button className="sp-carousel__arrow sp-carousel__arrow--next" onClick={slideNext} aria-label="Següent">›</button>
    </div>
  )
}


export default function SubPage({ pageKey }) {
  const p = PAGES[pageKey]
  const isDark = p.theme === 'dark'
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => { window.scrollTo(0, 0) }, [pageKey])

  /* Animated rotating words (casaments) */
  useEffect(() => {
    if (!p.queFem.animated) return
    const interval = setInterval(() => {
      setWordIdx(i => (i + 1) % p.queFem.animated.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [p])

  /* Intersection observer — fadeInLeft */
  useEffect(() => {
    const els = document.querySelectorAll('.sp-anim')
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('sp-anim--visible'); obs.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  /* Parallax scale effect on scroll */
  useEffect(() => {
    const parallaxEls = document.querySelectorAll('.sp-parallax__inner')
    const handleScroll = () => {
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const progress = 1 - (rect.top / vh)  // 0 at bottom, 1 at top
        const clamped = Math.max(0, Math.min(1, progress))
        const scale = 1.15 - (clamped * 0.15)  // 1.15 → 1.0
        el.style.transform = `scale(${scale})`
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`sp ${isDark ? 'sp--dark' : 'sp--light'}`}>
      <div className="page-transition" />

      {/* ── Nav triangle (hamburger) ── */}
      <Link to="/" className="sp-nav-icon" aria-label="Tornar a l\'inici">
        <img
          src={isDark
            ? 'https://sensacions.com/wp-content/uploads/2022/11/Triangulo-blanco.png'
            : 'https://sensacions.com/wp-content/uploads/2022/11/Triangulo-negro.png'}
          alt="" className="sp-nav-icon__img"
        />
      </Link>

      {/* ── Hero ── */}
      <section
        className={`sp-hero ${isDark ? 'sp-hero--dark' : 'sp-hero--light'}`}
        style={{
          '--hero-image': `url(${p.heroDesktop})`,
          '--hero-image-mobile': `url(${p.heroMobile})`,
        }}
      >
        <div className="sp-hero__bg" />
        <div className="sp-hero__content">
          <img src={p.logo} alt="Sensacions" className="sp-hero__logo" />
          <h2 className="sp-hero__title">{p.title}</h2>
        </div>
      </section>

      {/* ── Què fem? ── */}
      <section className="sp-text-section sp-anim sp-anim--left">
        <h6 className="sp-label">{p.queFem.label}</h6>
        {p.queFem.lines.map((line, i) => (
          <h3 key={i} className="sp-heading" dangerouslySetInnerHTML={{ __html: line }} />
        ))}
        {p.queFem.animated && (
          <h3 className="sp-heading sp-heading--animated">
            <span className="sp-rotating-word" key={wordIdx}>{p.queFem.animated[wordIdx]}</span>
          </h3>
        )}
      </section>

      {/* ── Parallax Image 1 ── */}
      <section className="sp-parallax sp-anim">
        <div className="sp-parallax__inner" style={{ backgroundImage: `url(${p.parallax1})` }} />
      </section>

      {/* ── Description 1 ── */}
      <section className="sp-text-section sp-text-section--narrow sp-anim">
        <p className="sp-body" dangerouslySetInnerHTML={{ __html: p.desc1 }} />
      </section>

      {/* ── Com ho fem? ── */}
      <section className="sp-text-section sp-anim">
        <h6 className="sp-label">{p.comHoFem.label}</h6>
        {p.comHoFem.lines.map((line, i) => (
          <h3 key={i} className="sp-heading" dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </section>

      {/* ── Parallax Image 2 ── */}
      <section className="sp-parallax sp-anim">
        <div className="sp-parallax__inner" style={{ backgroundImage: `url(${p.parallax2})` }} />
      </section>

      {/* ── Description 2 ── */}
      <section className="sp-text-section sp-text-section--narrow sp-anim">
        <p className="sp-body" dangerouslySetInnerHTML={{ __html: p.desc2 }} />
      </section>

      {/* ── Espais (Venues carousel) ── */}
      <section className="sp-text-section sp-text-section--wide sp-anim">
        <h6 className="sp-label">ESPAIS</h6>
        <h3 className="sp-heading"><b>Espais</b></h3>
        <VenuesCarousel venues={p.venues} theme={p.theme} />
      </section>

      {/* ── Clients (corporatiu only) ── */}
      {p.clients && (
        <section className="sp-text-section sp-anim">
          <h6 className="sp-label">CLIENTS</h6>
          <h3 className="sp-heading">Junts, <b>creem històries d'èxit</b></h3>
          <p className="sp-body" style={{ marginTop: 16 }}>{p.clientsDesc}</p>
          <div className="sp-logos">
            <div className="sp-logos__track">
              {Array.from({ length: 33 }, (_, i) => (
                <img key={i} src={`${IMG_BASE}${i + 1}.png`} alt="" className="sp-logos__img" />
              ))}
              {Array.from({ length: 33 }, (_, i) => (
                <img key={`d${i}`} src={`${IMG_BASE}${i + 1}.png`} alt="" className="sp-logos__img" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="sp-cta sp-anim">
        <div className="sp-cta__border" />
        <h6 className="sp-label">CONTACTA</h6>
        <h3 className="sp-heading">DEMANA EL TEU<br/>PRESSUPOST</h3>
        <p className="sp-body" style={{ maxWidth: 400, margin: '16px auto 0' }}>Envia'ns les teves idees i junts treballarem per a fer-les realitat.</p>
        <Link to="/" className="sp-pill-btn">contacte</Link>
      </section>
    </div>
  )
}

