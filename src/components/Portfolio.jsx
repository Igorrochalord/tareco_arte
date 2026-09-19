import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSite } from '../SiteContext'
import Section, { fadeUp } from './Section'
import { lazy, Suspense } from 'react'

const Lightbox = lazy(() => import('./Lightbox'))
const ORDER = ['horror', 'icon', 'halfbody', 'fullbody', 'stickers']

export default function Portfolio() {
  const { t, cfg } = useSite()
  const all = cfg.gallery.filter((g) => !g.crop)
  const cats = ORDER.filter((c) => all.some((g) => g.cat === c))
  const [cat, setCat] = useState('all')
  const items = cat === 'all' ? all : all.filter((g) => g.cat === cat)
  const [open, setOpen] = useState(null)
  const [wasOpen, setWasOpen] = useState(false)

  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <Section id="work" title={t.workTitle} sub={t.workSub}>
      {cats.length > 1 && (
        <div className="filters" role="group" aria-label={t.filterLabel}>
          {['all', ...cats].map((c) => (
            <button key={c} aria-pressed={c === cat} onClick={() => setCat(c)}>{t.cats[c]}</button>
          ))}
        </div>
      )}
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
            onClick={() => { setWasOpen(true); setOpen(i) }}
            aria-label={`${t.slide}: ${it.title || t.cats[it.cat]}`}
          >
            <img src={it.thumb || it.src} width={it.w} height={it.h} alt="" loading="lazy" decoding="async" draggable="false" />
            <span className="tile-shine" />
            <span className="tile-title">{it.title && <b>{it.title}</b>}<small>{t.cats[it.cat]}</small></span>
          </motion.button>
        ))}
      </div>
      {wasOpen && <Suspense fallback={null}><Lightbox items={items} index={open} setIndex={setOpen} /></Suspense>}
    </Section>
  )
}
