import { motion } from 'framer-motion'
import { useSite } from '../SiteContext'
import Section, { fadeUp } from './Section'

export default function About() {
  const { t, cfg, lang, art } = useSite()
  const portrait = art('lion')
  return (
    <Section id="about" title={t.aboutTitle} className="about">
      <motion.div className="about-grid" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <div className="about-art">
          <img src={portrait.src} alt="" draggable="false" />
        </div>
        <div className="about-text">
          {cfg.about[lang].map((p) => <p key={p}>{p}</p>)}
          <ul className="tags">
            {cfg.about.tags[lang].map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <div className="socials">
            <a href={`https://t.me/${cfg.telegram}`} target="_blank" rel="noopener">Telegram · @{cfg.telegram}</a>
            <a href={`https://x.com/${cfg.twitter}`} target="_blank" rel="noopener">X · @{cfg.twitter}</a>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}
