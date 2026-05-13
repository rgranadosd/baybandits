import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './TeamsPage.css'
import { rosters } from '../data/rosters.js'
import Photo7 from '../assets/photos/Photo7.jpeg'
import LogoBB from '../assets/logos/baybandits.png'

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

function normalizeForSearch(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

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
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [visibleSections, setVisibleSections] = useState(() => ({ [rosters[0].id]: true }))
  const [parallaxOffsets, setParallaxOffsets] = useState({})
  const [activeTeamId, setActiveTeamId] = useState(rosters[0].id)

  const normalizedQuery = normalizeForSearch(query.trim())

  const filteredRosters = useMemo(() => rosters.filter((team) => {
    const isFeminine = team.id.includes('femeni')
    const matchesCategory = category === 'all' || (category === 'femeni' ? isFeminine : !isFeminine)

    if (!matchesCategory) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    const searchBlob = normalizeForSearch([
      team.name,
      team.coach,
      ...team.players.map((player) => player.name),
      ...team.players.map((player) => String(player.dorsal)),
    ].join(' '))

    return searchBlob.includes(normalizedQuery)
  }), [category, normalizedQuery])

  const hasNoResults = filteredRosters.length === 0

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

    if (event.target.closest('a, button, input, textarea, select, .teams-index, .teams-toolbar')) {
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
    if (!filteredRosters.length) {
      setActiveTeamId('')
      return
    }

    const stillVisible = filteredRosters.some((team) => team.id === activeTeamId)

    if (!stillVisible) {
      setActiveTeamId(filteredRosters[0].id)
    }
  }, [activeTeamId, filteredRosters])

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

    filteredRosters.forEach((team) => {
      const node = sectionRefs.current.get(team.id)

      if (node) {
        observer.observe(node)
      }
    })

    return () => observer.disconnect()
  }, [filteredRosters])

  useEffect(() => {
    let animationFrame = 0

    const updateParallax = () => {
      animationFrame = 0
      let nearestId = ''
      let nearestDistance = Number.POSITIVE_INFINITY

      setParallaxOffsets((current) => {
        let changed = false
        const next = {}

        filteredRosters.forEach((team) => {
          const node = sectionRefs.current.get(team.id)

          if (!node) {
            return
          }

          const sectionId = team.id
          const rect = node.getBoundingClientRect()
          const distanceFromCenter = window.innerHeight * 0.5 - (rect.top + rect.height * 0.5)
          const shift = Math.max(-48, Math.min(48, Number((distanceFromCenter * 0.12).toFixed(2))))
          const absDistance = Math.abs(distanceFromCenter)

          if (absDistance < nearestDistance) {
            nearestDistance = absDistance
            nearestId = sectionId
          }

          next[sectionId] = shift

          if (current[sectionId] !== shift) {
            changed = true
          }
        })

        return changed ? next : current
      })

      if (nearestId) {
        setActiveTeamId((current) => (current === nearestId ? current : nearestId))
      }
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
  }, [filteredRosters])

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
      <button type="button" className="teams-back teams-back--floating" onClick={handleGoBack}>
        volver
      </button>
      <div className="teams-page__bg" style={{ backgroundImage: `url(${Photo7})` }} />
      <div className="teams-page__overlay" />
      <div className="teams-page__transition" />

      <header className="teams-hero">
        <img
          src={LogoBB}
          alt="baybandits"
          className="teams-logo"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = LOGO_FALLBACK
          }}
        />
        <p className="teams-kicker">Plantillas 2026</p>
        <h1 className="teams-title">Nuestros Equipos</h1>
      </header>

      <section className="teams-toolbar" aria-label="Filtros de equipos">
        <div className="teams-search">
          <label className="teams-search__label" htmlFor="teams-search-input">Buscar</label>
          <input
            id="teams-search-input"
            type="search"
            className="teams-search__input"
            placeholder="Equipo, entrenador, jugador o dorsal"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button type="button" className="teams-search__clear" onClick={() => setQuery('')}>limpiar</button>
          )}
        </div>

        <div className="teams-filter-tabs" role="tablist" aria-label="Filtrar por categoria">
          <button
            type="button"
            role="tab"
            aria-selected={category === 'all'}
            className={`teams-filter-tabs__item ${category === 'all' ? 'is-active' : ''}`}
            onClick={() => setCategory('all')}
          >
            todos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={category === 'femeni'}
            className={`teams-filter-tabs__item ${category === 'femeni' ? 'is-active' : ''}`}
            onClick={() => setCategory('femeni')}
          >
            femenino
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={category === 'masculi'}
            className={`teams-filter-tabs__item ${category === 'masculi' ? 'is-active' : ''}`}
            onClick={() => setCategory('masculi')}
          >
            masculino
          </button>
        </div>

        <p className="teams-toolbar__meta">{filteredRosters.length} equipos visibles</p>
      </section>

      {!hasNoResults && (
        <nav className="teams-index" aria-label="Indice de equipos">
          {filteredRosters.map((team) => (
            <a
              key={team.id}
              href={`#${team.id}`}
              className={`teams-index__item ${activeTeamId === team.id ? 'is-active' : ''}`}
              onClick={() => setActiveTeamId(team.id)}
            >
              {team.name}
            </a>
          ))}
        </nav>
      )}

      <main className="teams-content">
        {hasNoResults ? (
          <section className="team-empty-state" aria-live="polite">
            <h2>No hemos encontrado equipos</h2>
            <p>Prueba otro nombre, dorsal o cambia el filtro.</p>
          </section>
        ) : filteredRosters.map((team, teamIndex) => (
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
      </main>
    </div>
  )
}

export default TeamsPage
