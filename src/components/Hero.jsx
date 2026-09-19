import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useSite } from '../SiteContext'
import Embers from './Embers'

const letters = (s) => s.split('')

export default function Hero() {
  const { t, cfg, art } = useSite()
  const [i, setI] = useState(0)
  const slides = cfg.hero.map(art)

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), 6500)
    return () => clearInterval(id)
  }, [slides.length])

  // Mouse-driven tilt on the artwork.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 18 })
  const sy = useSpring(my, { stiffness: 90, damping: 18 })
  const rotY = useTransform(sx, [-1, 1], [-9, 9])
  const rotX = useTransform(sy, [-1, 1], [7, -7])
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <header className="hero" id="top" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-fade" aria-hidden="true" />
      <Embers />

      <div className="hero-inner">
        <div className="hero-text">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {t.eyebrow}
          </motion.p>
          <h1 className="hero-title" aria-label="Tareco Mariola">
            {['Tareco', 'Mariola'].map((word, w) => (
              <span className="word" key={word} aria-hidden="true">
                {letters(word).map((ch, k) => (
                  <motion.span
                    key={k}
                    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.25 + w * 0.35 + k * 0.05, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <motion.p className="tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}>
            {t.tagline}
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
            <a className="btn primary" href="#commissions">{t.heroCta}</a>
            <a className="link-arrow" href="#work">{t.heroSecondary} →</a>
          </motion.div>
        </div>

        <motion.div className="hero-art" style={{ rotateX: rotX, rotateY: rotY }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }}>
          <div className="hero-frame">
            <AnimatePresence mode="sync">
              <motion.img
                key={slides[i].id}
                src={slides[i].src}
                alt={slides[i].title}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />
            </AnimatePresence>
            <div className="frame-glow" />
          </div>
          <div className="dots">
            {slides.map((s, k) => (
              <button key={s.id} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`${k + 1}`} />
            ))}
          </div>
        </motion.div>
      </div>
      <svg className="drips" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0h1200v22c-20 0-24 30-24 44 0 10-10 10-10 0 0-14-6-30-26-30-18 0-22 20-22 34 0 12-12 12-12 0 0-22-8-48-30-48-24 0-20 26-22 40-2 12-12 10-12 0 0-14-4-36-24-36S960 40 960 62c0 10-12 10-12 0 0-18-6-40-28-40-20 0-24 16-24 30 0 12-12 12-12 0 0-14-6-30-26-30-22 0-26 24-26 40 0 8-10 8-10 0 0-20-8-42-32-42-20 0-20 16-22 28-2 10-12 8-12 0 0-14-6-28-24-28-20 0-24 22-24 38 0 10-12 10-12 0 0-18-8-38-30-38-18 0-22 14-22 26 0 10-10 10-10 0 0-16-8-34-28-34-22 0-24 22-26 36-2 12-12 10-12 0 0-14-6-32-26-32-18 0-22 16-22 30 0 10-12 10-12 0 0-16-8-36-28-36S66 44 66 60c0 8-10 8-10 0 0-18-8-38-28-38-12 0-20 4-28 10z" />
      </svg>
      <a className="scroll-hint" href="#work" aria-hidden="true"><span /></a>
    </header>
  )
}
