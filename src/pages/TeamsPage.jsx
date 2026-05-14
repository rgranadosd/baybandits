import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './TeamsPage.css'
import { rosters } from '../data/rosters.js'
import Photo7 from '../assets/photos/Photo7.jpeg'
import LogoBB from '../assets/logos/baybandits.png'
import LandingFooter from '../components/LandingFooter'

const LOGO_FALLBACK = `${import.meta.env.BASE_URL}logos/ESCUDO%20BAY%20BANDITS%202026.PNG`
const SHIRT_PATH = 'M36,10 Q50,26 64,10 L80,10 L90,14 L88,28 Q84,38 80,36 L80,108 C65,112 35,112 20,108 L20,36 Q16,38 12,28 L10,14 Z'
const SHIRT_CENTER_X = 50
const SHIRT_NAME_Y = 48
const SHIRT_NUMBER_Y = 76
const SHIRT_NAME_MAX_WIDTH = 52
const SHIRT_NAME_FONT_SIZE = 9.5
const SHIRT_NAME_MIN_FONT_SIZE = 6
const SHIRT_NUMBER_FONT_SIZE = 34
const EDGE_BACK_ZONE = 36
const BACK_SWIPE_MIN_DISTANCE = 72

const TEAM_THEMES = {
  pink: {
    accent: '#f3a0d0',
    accentStrong: '#ff4ea3',
    accentSoft: 'rgba(243, 160, 208, 0.26)',
  },
  blue: {
    accent: '#9edfff',
    accentStrong: '#2aa8ff',
    accentSoft: 'rgba(158, 223, 255, 0.26)',
  },
}

function getTeamTheme(teamId) {
  return teamId.includes('femeni') ? TEAM_THEMES.pink : TEAM_THEMES.blue
}

function JerseySvg({ name, dorsal }) {
  const gradientId = useId()
  const nameRef = useRef(null)
  const [nameFontSize, setNameFontSize] = useState(SHIRT_NAME_FONT_SIZE)
  const [nameNeedsCompression, setNameNeedsCompression] = useState(false)

  useLayoutEffect(() => {
    const textNode = nameRef.current

    if (!textNode) {
      return undefined
    }

    let animationFrame = 0

    const fitName = () => {
      let nextSize = SHIRT_NAME_FONT_SIZE
      textNode.setAttribute('font-size', String(nextSize))

      while (nextSize > SHIRT_NAME_MIN_FONT_SIZE && textNode.getBBox().width > SHIRT_NAME_MAX_WIDTH) {
        nextSize -= 0.5
        textNode.setAttribute('font-size', String(nextSize))
      }

      const stillTooWide = textNode.getBBox().width > SHIRT_NAME_MAX_WIDTH
      setNameFontSize(nextSize)
      setNameNeedsCompression(stillTooWide)
    }

    animationFrame = window.requestAnimationFrame(fitName)

    return () => window.cancelAnimationFrame(animationFrame)
  }, [name])

  return (
    <svg className="team-jersey-svg" viewBox="0 0 100 130" role="img" aria-label={`${name} dorsal ${dorsal}`}>
      <defs>
        <linearGradient id={gradientId} x1="18" y1="10" x2="82" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff4ea3" />
          <stop offset="52%" stopColor="#f6b5da" />
          <stop offset="100%" stopColor="#2aa8ff" />
        </linearGradient>
      </defs>
      <g className="team-jersey-svg__group" transform="translate(0 0)">
        <path className="team-jersey-svg__shadow" d={SHIRT_PATH} fillRule="evenodd" clipRule="evenodd" />
        <path className="team-jersey-svg__body" d={SHIRT_PATH} fillRule="evenodd" clipRule="evenodd" style={{ '--shirt-fill': `url(#${gradientId})` }} />
        <text
          ref={nameRef}
          className="team-jersey-svg__name"
          x={SHIRT_CENTER_X}
          y={SHIRT_NAME_Y}
          fontSize={nameFontSize}
          textAnchor="middle"
          dominantBaseline="middle"
          textLength={nameNeedsCompression ? SHIRT_NAME_MAX_WIDTH : undefined}
          lengthAdjust={nameNeedsCompression ? 'spacingAndGlyphs' : undefined}
        >
          {name}
        </text>
        <text
          className="team-jersey-svg__number"
          x={SHIRT_CENTER_X}
          y={SHIRT_NUMBER_Y}
          fontSize={SHIRT_NUMBER_FONT_SIZE}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {dorsal}
        </text>
      </g>
    </svg>
  )
}

function TeamsPage() {
  const navigate = useNavigate()
  const sectionRefs = useRef(new Map())
  const swipeStartRef = useRef(null)
  const [visibleSections, setVisibleSections] = useState(() => ({ [rosters[0].id]: true }))
  const [parallaxOffsets, setParallaxOffsets] = useState({})

  const stats = useMemo(() => {
    const totalPlayers = rosters.reduce((acc, team) => acc + team.players.length, 0)

    return {
      teams: rosters.length,
      players: totalPlayers,
      coaches: rosters.length,
      season: 2026,
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
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((current) => {
          let changed = false
          const next = { ...current }

          entries.forEach((entry) => {
            const sectionId = entry.target.getAttribute('data-team-id')

            if (entry.isIntersecting && sectionId && !next[sectionId]) {
              next[sectionId] = true
              changed = true
              observer.unobserve(entry.target)
            }
          })

          return changed ? next : current
        })
      },
      {
        rootMargin: '180px 0px',
        threshold: 0.12,
      },
    )

    rosters.forEach((team) => {
      const node = sectionRefs.current.get(team.id)

      if (node) {
        observer.observe(node)
      }
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let animationFrame = 0

    const updateParallax = () => {
      animationFrame = 0
      const rootCenter = window.innerHeight * 0.5

      setParallaxOffsets((current) => {
        let changed = false
        const next = {}

        rosters.forEach((team) => {
          const node = sectionRefs.current.get(team.id)

          if (!node) {
            return
          }

          const sectionId = team.id
          const rect = node.getBoundingClientRect()
          const distanceFromCenter = rootCenter - (rect.top + rect.height * 0.5)
          const shift = Math.max(-48, Math.min(48, Number((distanceFromCenter * 0.12).toFixed(2))))

          next[sectionId] = shift

          if (current[sectionId] !== shift) {
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
    window.addEventListener('scroll', scheduleParallaxUpdate, { passive: true })
    window.addEventListener('resize', scheduleParallaxUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleParallaxUpdate)
      window.removeEventListener('resize', scheduleParallaxUpdate)

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        handleGoBack()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [handleGoBack])

  const setSectionRef = (sectionId, node) => {
    if (node) {
      sectionRefs.current.set(sectionId, node)
      return
    }

    sectionRefs.current.delete(sectionId)
  }

  return (
    <div className="teams-page" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { swipeStartRef.current = null }}>
      <div className="teams-page__bg" style={{ backgroundImage: `url(${Photo7})` }} />
      <div className="teams-page__overlay" />
      <div className="teams-page__transition" />

      <header className="teams-header">
        <button type="button" className="teams-back" onClick={handleGoBack}>
          volver
        </button>

        <span className="teams-header-spacer" aria-hidden="true" />

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

      <main className="teams-shell">
        <section className="teams-hero" aria-label="Resumen equipos 2026">
          <p className="teams-hero__kicker">Bay Bandits Beach Handball</p>
          <h1>
            Nuestros Equipos <span className="teams-hero__year">2026</span>
          </h1>

          <dl className="teams-hero__stats">
            <div>
              <dt>Equipos</dt>
              <dd>{stats.teams}</dd>
            </div>
            <div>
              <dt>Jugadores</dt>
              <dd>{stats.players}</dd>
            </div>
            <div>
              <dt>Entrenadores</dt>
              <dd>{stats.coaches}</dd>
            </div>
            <div>
              <dt>Temporada</dt>
              <dd>{stats.season}</dd>
            </div>
          </dl>
        </section>

        <div className="teams-content">
        {rosters.map((team, teamIndex) => (
          (() => {
            const theme = getTeamTheme(team.id)
            const isVisible = Boolean(visibleSections[team.id])
            return (
          <section
            key={team.id}
            id={team.id}
            ref={(node) => setSectionRef(team.id, node)}
            data-team-id={team.id}
            className={`team-block ${isVisible ? 'is-visible' : 'is-pending'}`}
            style={{
              '--team-delay': `${teamIndex * 70}ms`,
              '--team-accent': theme.accent,
              '--team-accent-strong': theme.accentStrong,
              '--team-accent-soft': theme.accentSoft,
              '--parallax-shift': `${parallaxOffsets[team.id] ?? 0}px`,
            }}
          >
            <div className="team-block__header">
              <h2>{team.name}</h2>
              <p>{team.coach}</p>
            </div>

            {isVisible ? (
              <ul className="team-cards" aria-label={team.name}>
                {team.players.map((player, playerIndex) => (
                  <li
                    key={`${team.id}-${player.dorsal}`}
                    className="team-card"
                    style={{ '--card-delay': `${teamIndex * 80 + playerIndex * 26}ms` }}
                  >
                    <JerseySvg
                      name={player.name}
                      dorsal={player.dorsal}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="team-block__loading" aria-hidden="true">
                <span>cargando seccion</span>
              </div>
            )}
          </section>
            )
          })()
        ))}
        </div>

        <LandingFooter className="teams-shell__footer" />
      </main>
    </div>
  )
}

export default TeamsPage
