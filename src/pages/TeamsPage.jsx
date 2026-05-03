import { Link } from 'react-router-dom'
import './TeamsPage.css'
import { rosters } from '../data/rosters.js'
import Photo7 from '../assets/photos/Photo7.jpeg'
import LogoBB from '../assets/logos/baybandits.png'

const LOGO_FALLBACK = `${import.meta.env.BASE_URL}logos/ESCUDO%20BAY%20BANDITS%202026.PNG`

const TEAM_THEMES = {
  'senior-femeni': {
    accent: '#f3a0d0',
    accentStrong: '#ff4ea3',
    accentSoft: 'rgba(243, 160, 208, 0.28)',
  },
  'senior-masculi-a': {
    accent: '#9edfff',
    accentStrong: '#2aa8ff',
    accentSoft: 'rgba(158, 223, 255, 0.28)',
  },
  'senior-masculi-b': {
    accent: '#d9a6f7',
    accentStrong: '#b963ff',
    accentSoft: 'rgba(217, 166, 247, 0.28)',
  },
  'juvenil-masculi': {
    accent: '#8fe3de',
    accentStrong: '#27c7bc',
    accentSoft: 'rgba(143, 227, 222, 0.28)',
  },
  'cadet-femeni': {
    accent: '#ffc38f',
    accentStrong: '#ff9a3d',
    accentSoft: 'rgba(255, 195, 143, 0.28)',
  },
  'cadet-masculi': {
    accent: '#b6c1ff',
    accentStrong: '#7389ff',
    accentSoft: 'rgba(182, 193, 255, 0.28)',
  },
  'infantil-femeni': {
    accent: '#f8dc8d',
    accentStrong: '#f2ba23',
    accentSoft: 'rgba(248, 220, 141, 0.28)',
  },
  'infantil-masculi': {
    accent: '#9ee7b2',
    accentStrong: '#35c86a',
    accentSoft: 'rgba(158, 231, 178, 0.28)',
  },
}

function TeamsPage() {
  return (
    <div className="teams-page">
      <div className="teams-page__bg" style={{ backgroundImage: `url(${Photo7})` }} />
      <div className="teams-page__overlay" />
      <div className="teams-page__transition" />

      <header className="teams-hero">
        <Link to="/" className="teams-back">volver</Link>
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

      <nav className="teams-index" aria-label="Indice de equipos">
        {rosters.map((team) => (
          <a key={team.id} href={`#${team.id}`} className="teams-index__item">
            {team.name}
          </a>
        ))}
      </nav>

      <main className="teams-content">
        {rosters.map((team, teamIndex) => (
          (() => {
            const theme = TEAM_THEMES[team.id]
            return (
          <section
            key={team.id}
            id={team.id}
            className="team-block"
            style={{
              '--team-delay': `${teamIndex * 70}ms`,
              '--team-accent': theme.accent,
              '--team-accent-strong': theme.accentStrong,
              '--team-accent-soft': theme.accentSoft,
            }}
          >
            <div className="team-block__header">
              <h2>{team.name}</h2>
              <p>{team.coach}</p>
            </div>

            <ul className="team-cards" aria-label={team.name}>
              {team.players.map((player, playerIndex) => (
                <li
                  key={`${team.id}-${player.dorsal}`}
                  className="team-card"
                  style={{ '--card-delay': `${teamIndex * 80 + playerIndex * 26}ms` }}
                >
                  <div className="team-jersey" aria-label={`${player.name} dorsal ${player.dorsal}`}>
                    <span className="team-jersey__name">{player.name}</span>
                    <span className="team-jersey__number">{player.dorsal}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
            )
          })()
        ))}
      </main>
    </div>
  )
}

export default TeamsPage
