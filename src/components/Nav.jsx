import { useEffect, useState } from 'react'
import { useSite } from '../SiteContext'

export default function Nav() {
  const { t, cfg, toggleLang } = useSite()
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <nav className={`nav ${solid ? 'solid' : ''}`}>
      <a className="brand" href="#top">Tareco Mariola</a>
      <div className="nav-links">
        <a href="#work">{t.navWork}</a>
        <a href="#commissions">{t.navComm}</a>
        <a href="#about">{t.navAbout}</a>
      </div>
      <div className="nav-right">
        <span className="status" data-s={cfg.status}><i />{t[cfg.status]}</span>
        <button className="lang" onClick={toggleLang} aria-label="Language">{t.langBtn}</button>
      </div>
    </nav>
  )
}
