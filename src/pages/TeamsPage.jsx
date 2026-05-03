import { Link } from 'react-router-dom'
import './TeamsPage.css'
import { rosters } from '../data/rosters.js'
import Photo7 from '../assets/photos/Photo7.jpeg'
import LogoBB from '../assets/logos/baybandits.png'

const LOGO_FALLBACK = `${import.meta.env.BASE_URL}logos/ESCUDO%20BAY%20BANDITS%202026.PNG`

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
          <section
            key={team.id}
            id={team.id}
            className="team-block"
            style={{ '--team-delay': `${teamIndex * 70}ms` }}
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
                  <span className="team-card__number">{player.dorsal}</span>
                  <span className="team-card__name">{player.name}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}

export default TeamsPage
