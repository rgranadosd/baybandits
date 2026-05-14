import LogoBB from '../assets/logos/baybandits.png'
import './LandingFooter.css'

const footerData = {
  contactTitle: 'CONTACTO',
  email: 'baybanditsbh@gmail.com',
  phoneHref: '+34661342473',
  phoneLabel: '+34 661 34 24 73',
  address: ['C/ de Lluís Companys, 23', '08830 Sant Boi de Llobregat', '(Barcelona)'],
  clubLabel: 'El Club',
  clubHref: 'https://hcsbhandbol.com/historia/',
  registrationsLabel: 'Inscripciones',
  registrationsHref: 'https://hcsbhandbol.com/inscripciones/',
  sectionTitle: 'baybandits',
  sectionText: 'Sección de balonmano playa del Handbol Cooperativa Sant Boi.',
  stats: '7 equipos · 100+ jugadores · Est. 2023',
  legal: '© 2026 baybandits · Handbol Cooperativa Sant Boi',
  privacyLabel: 'Política de privacidad',
  privacyHref: 'https://hcsbhandbol.com/politica-de-privacitat/',
}

function LandingFooter({ className = '' }) {
  const classes = className ? `landing-footer ${className}` : 'landing-footer'

  return (
    <footer className={classes}>
      <img src={LogoBB} alt="baybandits" className="landing-footer__logo" />

      <div className="landing-footer__columns">
        <div className="landing-footer__col">
          <h4>{footerData.contactTitle}</h4>
          <a href={`mailto:${footerData.email}`}>{footerData.email}</a>
          <a href={`tel:${footerData.phoneHref}`}>{footerData.phoneLabel}</a>
          <p>
            {footerData.address[0]}
            <br />
            {footerData.address[1]}
            <br />
            {footerData.address[2]}
          </p>
        </div>

        <div className="landing-footer__col landing-footer__col--nav">
          <a href={footerData.clubHref} target="_blank" rel="noreferrer">
            {footerData.clubLabel}
          </a>
          <a href={footerData.registrationsHref} target="_blank" rel="noreferrer">
            {footerData.registrationsLabel}
          </a>
        </div>

        <div className="landing-footer__col">
          <h4>{footerData.sectionTitle}</h4>
          <p>{footerData.sectionText}</p>
          <p>{footerData.stats}</p>
        </div>
      </div>

      <div className="landing-footer__social">
        <a href="https://www.instagram.com/baybanditsbh" target="_blank" rel="noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 448 512" fill="currentColor" width="18" height="18">
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.8 224.1 370.8 339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8 0-14.9 12-26.8 26.8-26.8 14.9 0 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1S4.2 127.9 2.4 163.8c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
          </svg>
        </a>
        <a href="https://twitter.com/hcsantboi" target="_blank" rel="noreferrer" aria-label="Twitter / X">
          <svg viewBox="0 0 512 512" fill="currentColor" width="18" height="18">
            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48H172.4l102.5 135.5zm-24.8 373.8h39.1L151.1 88h-42z" />
          </svg>
        </a>
        <a href={`mailto:${footerData.email}`} aria-label="Email">
          <svg viewBox="0 0 512 512" fill="currentColor" width="18" height="18">
            <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4l217.6 163.2c11.4 8.5 27 8.5 38.4 0l217.6-163.2C504.9 141.3 512 127.1 512 112c0-26.5-21.5-48-48-48H48zm-6.4 254.4C14.7 297.5 0 278 0 256V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V256c0-22-14.7-41.5-36.6-46.6L256 372.8 54.4 318.4z" />
          </svg>
        </a>
      </div>

      <div className="landing-footer__legal">
        <span>{footerData.legal}</span>
        <a href={footerData.privacyHref} target="_blank" rel="noreferrer">
          {footerData.privacyLabel}
        </a>
      </div>
    </footer>
  )
}

export default LandingFooter
