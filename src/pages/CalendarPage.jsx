import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CalendarPage.css'
import EstartitCity from '../assets/cities/estartit.jpg'
import GavaCity from '../assets/cities/gava.jpg'
import LaredoCity from '../assets/cities/laredo.png'
import MalgratCity from '../assets/cities/malgrat.jpg'
import MataroCity from '../assets/cities/mataro.jpg'
import SabadellCity from '../assets/cities/sabadell.jpg'
import VilanovaCity from '../assets/cities/vilanova.jpg'
import Photo7 from '../assets/photos/Photo7.jpeg'
import LogoBB from '../assets/logos/baybandits.png'

const LOGO_FALLBACK = `${import.meta.env.BASE_URL}logos/ESCUDO%20BAY%20BANDITS%202026.PNG`
const EDGE_BACK_ZONE = 36
const BACK_SWIPE_MIN_DISTANCE = 72

const circuits = [
  {
    id: 'nacional',
    title: 'Circuito Nacional',
    summary: 'Paradas clave del circuito estatal para la temporada 2026.',
    eyebrow: 'España',
    accent: '#2aa8ff',
    accentSoft: 'rgba(42, 168, 255, 0.24)',
    events: [
      {
        dates: '12-14 junio',
        name: 'Arena 1000 Vilanova i la Geltrú',
        location: 'Vilanova i la Geltrú',
        image: VilanovaCity,
      },
      {
        dates: '30 julio - 2 agosto',
        name: 'Campeonato de España Laredo',
        location: 'Laredo',
        image: LaredoCity,
      },
    ],
  },
  {
    id: 'catala',
    title: 'Circuito Catalán',
    summary: 'Calendario del circuito catalán con cinco paradas confirmadas.',
    eyebrow: 'Cataluña',
    accent: '#ff4ea3',
    accentSoft: 'rgba(255, 78, 163, 0.24)',
    events: [
      {
        dates: '6-7 junio',
        name: 'OAR Gràcia Sabadell',
        location: 'Sabadell',
        image: SabadellCity,
      },
      {
        dates: '20-21 junio',
        name: 'Gavà',
        location: 'Gavà',
        image: GavaCity,
      },
      {
        dates: '4-5 julio',
        name: 'Estartit',
        location: 'Estartit',
        image: EstartitCity,
      },
      {
        dates: '11-12 julio',
        name: 'Malgrat de Mar',
        location: 'Malgrat de Mar',
        image: MalgratCity,
      },
      {
        dates: '18-19 julio',
        name: 'Mataró',
        location: 'Mataró',
        image: MataroCity,
      },
    ],
  },
] 

function CalendarPage() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const sectionRefs = useRef(new Map())
  const swipeStartRef = useRef(null)
  const [parallaxOffsets, setParallaxOffsets] = useState({})
  const [backgroundShift, setBackgroundShift] = useState(0)

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }, [navigate])

  const handleTouchStart = (event) => {
    const touch = event.changedTouches[0]

    if (!touch) {
      return
    }

    if (touch.clientX > EDGE_BACK_ZONE) {
      swipeStartRef.current = null
      return
    }

    if (event.target.closest('a, button, input, textarea, select, .teams-header')) {
      swipeStartRef.current = null
      return
    }

    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    }
  }

  const handleTouchEnd = (event) => {
    const start = swipeStartRef.current
    const touch = event.changedTouches[0]

    swipeStartRef.current = null

    if (!start || !touch) {
      return
    }

    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y

    if (deltaX > BACK_SWIPE_MIN_DISTANCE && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      handleGoBack()
    }
  }

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        handleGoBack()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [handleGoBack])

  useEffect(() => {
    let animationFrame = 0

    const updateParallax = () => {
      animationFrame = 0
      const scrollRoot = scrollRef.current

      if (!scrollRoot) {
        return
      }

      const rootRect = scrollRoot.getBoundingClientRect()
      const rootCenter = rootRect.top + rootRect.height * 0.5
      const nextBackgroundShift = Math.max(-64, Math.min(64, Number((scrollRoot.scrollTop * -0.22).toFixed(2))))

      setBackgroundShift((current) => (current === nextBackgroundShift ? current : nextBackgroundShift))

      setParallaxOffsets((current) => {
        let changed = false
        const next = {}

        circuits.forEach((circuit) => {
          const node = sectionRefs.current.get(circuit.id)

          if (!node) {
            return
          }

          const rect = node.getBoundingClientRect()
          const distanceFromCenter = rootCenter - (rect.top + rect.height * 0.5)
          const shift = Math.max(-64, Math.min(64, Number((distanceFromCenter * 0.18).toFixed(2))))

          next[circuit.id] = shift

          if (current[circuit.id] !== shift) {
            changed = true
          }
        })

        return changed ? next : current
      })
    }

    const scheduleParallaxUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateParallax)
      }
    }

    scheduleParallaxUpdate()

    const scrollRoot = scrollRef.current
    scrollRoot?.addEventListener('scroll', scheduleParallaxUpdate, { passive: true })
    window.addEventListener('resize', scheduleParallaxUpdate)

    return () => {
      scrollRoot?.removeEventListener('scroll', scheduleParallaxUpdate)
      window.removeEventListener('resize', scheduleParallaxUpdate)

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <div className="teams-page calendar-page" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { swipeStartRef.current = null }}>
      <div className="teams-page__bg" style={{ backgroundImage: `url(${Photo7})`, transform: `translate3d(0, ${backgroundShift}px, 0) scale(1.08)` }} />
      <div className="teams-page__overlay" />
      <div className="teams-page__transition" />

      <header className="teams-header">
        <button type="button" className="teams-back" onClick={handleGoBack}>
          volver
        </button>
        <h1 className="teams-title">Calendario 2026</h1>
        <button className="teams-logo-btn" onClick={() => navigate('/')} aria-label="Ir a la home">
          <img
            src={LogoBB}
            alt="baybandits"
            className="teams-logo"
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = LOGO_FALLBACK
            }}
          />
        </button>
      </header>

      <div className="teams-scroll" ref={scrollRef}>
        <main className="teams-content calendar-content">
          <section className="calendar-intro">
            <p className="calendar-kicker">Temporada 2026</p>
            <h2>Dos circuitos, siete citas</h2>
            <p>
              El calendario se divide entre el circuito nacional y el circuito catalán. Cada bloque recoge las
              fechas confirmadas y la sede correspondiente.
            </p>
          </section>

          {circuits.map((circuit, circuitIndex) => (
            <section
              key={circuit.id}
              className="calendar-block"
              ref={(node) => {
                if (node) {
                  sectionRefs.current.set(circuit.id, node)
                } else {
                  sectionRefs.current.delete(circuit.id)
                }
              }}
              style={{
                '--calendar-accent': circuit.accent,
                '--calendar-accent-soft': circuit.accentSoft,
                '--calendar-delay': `${circuitIndex * 90}ms`,
                '--calendar-parallax-shift': `${parallaxOffsets[circuit.id] ?? 0}px`,
              }}
            >
              <div className="calendar-block__header">
                <div className="calendar-block__title-wrap">
                  <p className="calendar-block__eyebrow">{circuit.eyebrow}</p>
                  <h2>{circuit.title}</h2>
                </div>
                <p className="calendar-block__summary">{circuit.summary}</p>
              </div>

              <ol className="calendar-events" aria-label={circuit.title}>
                {circuit.events.map((event, eventIndex) => (
                  <li key={`${circuit.id}-${event.dates}-${event.name}`} className="calendar-event">
                    <div className="calendar-event__media">
                      <div
                        className="calendar-event__photo"
                        style={{
                          backgroundImage: `url(${event.image})`,
                          animationDelay: `${eventIndex * -4}s`,
                        }}
                      />
                      <div className="calendar-event__overlay" />
                      <span className="calendar-event__city">{event.location}</span>
                    </div>
                    <div className="calendar-event__body">
                      <span className="calendar-event__dates">{event.dates}</span>
                      <strong className="calendar-event__name">{event.name}</strong>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}

export default CalendarPage