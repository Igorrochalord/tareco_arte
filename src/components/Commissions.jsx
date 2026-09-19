import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSite } from '../SiteContext'
import Section, { fadeUp } from './Section'
import Art from './Art'
import RequestModal from './RequestModal'

export default function Commissions() {
  const { t, cfg, lang, money, deadline, art } = useSite()
  const [typeId, setTypeId] = useState(cfg.types[0].id)
  const [modal, setModal] = useState(false)
  const ty = cfg.types.find((x) => x.id === typeId)
  const item = art(ty.art)
  const closed = cfg.status === 'closed'

  return (
    <Section id="commissions" title={t.commTitle} sub={t.commSub} className="tinted">
      <motion.div className="comm" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <div className="viewer">
          <AnimatePresence mode="popLayout">
            <motion.div key={item.id} className="viewer-art" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <Art item={item} />
            </motion.div>
          </AnimatePresence>
          <div className="viewer-vignette" />
          {item.title && <span className="viewer-title">{item.title}</span>}
        </div>

        <div className="card">
          <div className="chips" role="tablist">
            {cfg.types.map((x) => (
              <button key={x.id} role="tab" aria-selected={x.id === typeId} onClick={() => setTypeId(x.id)}>
                {x.id === typeId && <motion.span layoutId="chip" className="chip-bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span>{x.name[lang]}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={ty.id} className="card-body" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
              {ty.featured && <span className="badge">{t.featured}</span>}
              <h3>{ty.name[lang]}</h3>
              <p className="from">{t.from}</p>
              <p className="price">{money(Math.min(...ty.options.map((o) => o.price)))}</p>
              <p className="deadline">⏱ {deadline(ty)}</p>
              {ty.featured && <p className="note">{t.horrorNote}</p>}
              <ul className="options">
                {ty.options.map((op) => (
                  <li key={op.id}><span>{op.label[lang]}</span><b>{money(op.price)}</b></li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <button className="btn primary block" disabled={closed} onClick={() => setModal(true)}>
            {closed ? t.ctaClosed : t.cta}
          </button>
          <p className="contact">
            <a href={`https://t.me/${cfg.telegram}`} target="_blank" rel="noopener">Telegram</a> ·{' '}
            <a href={`https://x.com/${cfg.twitter}`} target="_blank" rel="noopener">X / Twitter</a>
          </p>
        </div>
      </motion.div>

      <RequestModal open={modal} onClose={() => setModal(false)} initialType={typeId} />
    </Section>
  )
}
