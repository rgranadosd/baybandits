import { useCallback, useEffect, useMemo, useRef } from 'react'
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
    summary: 'Paradas clave del circuito estatal con presencia de los principales equipos nacionales.',
    region: 'España',
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
    summary: 'Calendario oficial del circuito catalán con cinco sedes y trazado competitivo continuo.',
    region: 'Cataluña',
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
  const swipeStartRef = useRef(null)

  const stats = useMemo(() => {
    const totalEvents = circuits.reduce((acc, circuit) => acc + circuit.events.length, 0)

    return {
      circuits: circuits.length,
      totalEvents,
      venues: totalEvents,
    }
  }, [])

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

    if (event.target.closest('a, button, input, textarea, select, .calendar-topbar')) {
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

  return (
    <div className="calendar-premium" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { swipeStartRef.current = null }}>
      <div className="calendar-premium__bg" style={{ backgroundImage: `url(${Photo7})` }} />
      <div className="calendar-premium__veil" />

      <header className="calendar-topbar">
        <button type="button" className="calendar-topbar__back" onClick={handleGoBack}>
          volver
        </button>

        <button className="calendar-topbar__brand" onClick={() => navigate('/')} aria-label="Ir a la home">
          <img
            src={LogoBB}
            alt="baybandits"
            className="calendar-topbar__logo"
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = LOGO_FALLBACK
            }}
          />
        </button>
      </header>

      <main className="calendar-shell">
        <section className="calendar-hero" aria-label="Resumen calendario 2026">
          <p className="calendar-hero__kicker">Bay Bandits Beach Handball</p>
          <h1>
            Calendario Oficial <span className="calendar-hero__year">2026</span>
          </h1>

          <dl className="calendar-hero__stats">
            <div>
              <dt>Circuitos</dt>
              <dd>{stats.circuits}</dd>
            </div>
            <div>
              <dt>Pruebas</dt>
              <dd>{stats.totalEvents}</dd>
            </div>
            <div>
              <dt>Sedes</dt>
              <dd>{stats.venues}</dd>
            </div>
            <div>
              <dt>Temporada</dt>
              <dd>2026</dd>
            </div>
          </dl>
        </section>

        <div className="calendar-circuits" aria-label="Circuitos disponibles">
          {circuits.map((circuit) => (
            <section
              key={circuit.id}
              className="calendar-circuit"
              style={{ '--circuit-accent': circuit.accent, '--circuit-soft': circuit.accentSoft }}
            >
              <header className="calendar-circuit__header">
                <p className="calendar-circuit__region">{circuit.region}</p>
                <div className="calendar-circuit__title-row">
                  <h2>{circuit.title}</h2>
                  <span>{circuit.events.length} pruebas</span>
                </div>
                <p className="calendar-circuit__summary">{circuit.summary}</p>
              </header>

              <ol className="calendar-event-grid" aria-label={circuit.title}>
                {circuit.events.map((event, eventIndex) => (
                  <li
                    key={`${circuit.id}-${event.dates}-${event.name}`}
                    className="calendar-event-card"
                    style={{ '--event-order': eventIndex }}
                  >
                    <figure className="calendar-event-card__media">
                      <img src={event.image} alt={`Sede ${event.location}`} loading="lazy" />
                      <figcaption>{event.location}</figcaption>
                    </figure>

                    <div className="calendar-event-card__body">
                      <div className="calendar-event-card__meta">
                        <span className="calendar-event-card__dates">{event.dates}</span>
                      </div>
                      <h3>{event.name}</h3>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}

export default CalendarPage