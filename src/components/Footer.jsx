import { useSite } from '../SiteContext'

export default function Footer() {
  const { t, cfg } = useSite()
  return (
    <footer className="footer">
      <p className="footer-brand">Tareco Mariola</p>
      <p>
        <a href={`https://t.me/${cfg.telegram}`} target="_blank" rel="noopener">Telegram</a> ·{' '}
        <a href={`https://x.com/${cfg.twitter}`} target="_blank" rel="noopener">X / Twitter</a>
      </p>
      <p className="rights">© 2026 · {t.rights}</p>
    </footer>
  )
}
