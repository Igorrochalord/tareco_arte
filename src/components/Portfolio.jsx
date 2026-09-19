import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSite } from '../SiteContext'
import Section, { fadeUp } from './Section'
import Lightbox from './Lightbox'

export default function Portfolio() {
  const { t, cfg } = useSite()
  const items = cfg.gallery.filter((g) => !g.crop)
  const [open, setOpen] = useState(null)

  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <Section id="work" title={t.workTitle} sub={t.workSub}>
      <div className="masonry">
        {items.map((it, i) => (
          <motion.button
            key={it.id}
            className="tile"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: (i % 3) * 0.08 }}
            onMouseMove={spot}
            onClick={() => setOpen(i)}
          >
            <img src={it.src} alt={it.title} loading="lazy" draggable="false" />
            <span className="tile-shine" />
            {it.title && <span className="tile-title">{it.title}</span>}
          </motion.button>
        ))}
      </div>
      <Lightbox items={items} index={open} setIndex={setOpen} />
    </Section>
  )
}
