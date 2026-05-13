import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './CalendarPage.css'
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
    accent: '#2aa8ff',
    accentSoft: 'rgba(42, 168, 255, 0.24)',
    events: [
      {
        dates: '12-14 juny',
        name: 'Arena 1000 Vilanova i la Geltru',
      },
      {
        dates: '30 juliol - 2 agost',
        name: 'Campeonato de España Laredo',
      },
    ],
  },
  {
    id: 'catala',
    title: 'Circuito Català',
    summary: 'Calendario del circuito catalán con cinco paradas confirmadas.',
    accent: '#ff4ea3',
    accentSoft: 'rgba(255, 78, 163, 0.24)',
    events: [
      {
        dates: '6-7 juny',
        name: 'OAR Gràcia Sabadell',
      },
      {
        dates: '20-21 juny',
        name: 'Gavà',
      },
      {
        dates: '4-5 juliol',
        name: 'Estartit',
      },
      {
        dates: '11-12 juliol',
        name: 'Malgrat de Mar',
      },
      {
        dates: '18-19 juliol',
        name: 'Mataró',
      },
    ],
  },
]

function CalendarPage() {
  const navigate = useNavigate()
  const swipeStartRef = useRef(null)

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

  return (
    <div className="teams-page calendar-page" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { swipeStartRef.current = null }}>
      <div className="teams-page__bg" style={{ backgroundImage: `url(${Photo7})` }} />
      <div className="teams-page__overlay" />
      <div className="teams-page__transition" />

      <header className="teams-header">
        <button type="button" className="teams-back" onClick={handleGoBack}>
          volver
        </button>
        <h1 className="teams-title">Calendario 2026</h1>
        <img
          src={LogoBB}
          alt="baybandits"
          className="teams-logo"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = LOGO_FALLBACK
          }}
        />
      </header>

      <div className="teams-scroll">
        <main className="teams-content calendar-content">
          <section className="calendar-intro">
            <p className="calendar-kicker">Temporada 2026</p>
            <h2>Dos circuitos, siete citas</h2>
            <p>
              El calendario se divide entre el circuito nacional y el circuito català. Cada bloque recoge las
              fechas confirmadas y la sede correspondiente.
            </p>
          </section>

          {circuits.map((circuit, circuitIndex) => (
            <section
              key={circuit.id}
              className="calendar-block"
              style={{
                '--calendar-accent': circuit.accent,
                '--calendar-accent-soft': circuit.accentSoft,
                '--calendar-delay': `${circuitIndex * 90}ms`,
              }}
            >
              <div className="calendar-block__header">
                <div>
                  <p className="calendar-block__eyebrow">Circuito</p>
                  <h2>{circuit.title}</h2>
                </div>
                <p className="calendar-block__summary">{circuit.summary}</p>
              </div>

              <ol className="calendar-events" aria-label={circuit.title}>
                {circuit.events.map((event) => (
                  <li key={`${circuit.id}-${event.dates}-${event.name}`} className="calendar-event">
                    <span className="calendar-event__dates">{event.dates}</span>
                    <strong className="calendar-event__name">{event.name}</strong>
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