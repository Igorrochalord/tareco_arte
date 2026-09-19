import { useEffect, useState } from 'react'
import { useSite } from '../SiteContext'

export default function Nav() {
  const { t, cfg, toggleLang } = useSite()
  const [solid, setSolid] = useState(false)
  const [menu, setMenu] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (!menu) return
    const key = (e) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [menu])

  const links = [['#work', t.navWork], ['#commissions', t.navComm], ['#how', t.navHow], ['#about', t.navAbout]]
  const close = () => setMenu(false)

  return (
    <nav className={`nav ${solid || menu ? 'solid' : ''}`} aria-label="Principal">
      <a className="brand" href="#top" onClick={close}>Tareco Mariola</a>
      <div className="nav-links">
        {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
      </div>
      <div className="nav-right">
        <span className="status" data-s={cfg.status}><i />{t[cfg.status]}</span>
        <button className="lang" onClick={toggleLang} aria-label="Language">{t.langBtn}</button>
        <button className="burger" aria-expanded={menu} aria-controls="mobile-menu" aria-label={t.menu} onClick={() => setMenu((m) => !m)}>
          <span /><span /><span />
        </button>
      </div>
      {menu && (
        <div id="mobile-menu" className="mobile-menu">
          {links.map(([href, label]) => <a key={href} href={href} onClick={close}>{label}</a>)}
          <span className="status" data-s={cfg.status}><i />{t[cfg.status]}</span>
        </div>
      )}
    </nav>
  )
}
