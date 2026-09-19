import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { useSite } from '../SiteContext'
import Section, { fadeUp } from './Section'
import Art from './Art'
const RequestModal = lazy(() => import('./RequestModal'))

export default function Commissions() {
  const { t, cfg, lang, money, deadline, art } = useSite()
  const [picked, setPicked] = useState({}) // typeId -> optionId
  const [modal, setModal] = useState(null) // { typeId, optId }
  const [used, setUsed] = useState(false)
  const closed = cfg.status === 'closed'

  return (
    <Section id="commissions" title={t.commTitle} sub={t.commSub} className="tinted">
      <div className="plans">
        {cfg.types.map((ty, i) => {
          const optId = picked[ty.id] || ty.options[0].id
          const item = art(ty.art)
          return (
            <motion.article key={ty.id} className={`plan ${ty.featured ? 'featured' : ''}`} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} transition={{ delay: (i % 3) * 0.08 }}>
              <div className="plan-art">
                <Art item={item} />
                {ty.featured && <span className="badge">{t.featured}</span>}
              </div>
              <div className="plan-body">
                <h3>{ty.name[lang]}</h3>
                <p className="plan-price"><small>{t.from}</small> {money(Math.min(...ty.options.map((o) => o.price)))}</p>
                <p className="deadline">⏱ {deadline(ty)}</p>
                {ty.featured && <p className="note">{t.horrorNote}</p>}
                <div className="plan-opts" role="group" aria-label={`${ty.name[lang]}: ${t.included}`}>
                  {ty.options.map((op) => (
                    <button key={op.id} aria-pressed={op.id === optId} onClick={() => setPicked((p) => ({ ...p, [ty.id]: op.id }))}>
                      <span>{op.label[lang]}</span><b>{money(op.price)}</b>
                    </button>
                  ))}
                </div>
                <button className="btn primary block" disabled={closed} onClick={() => { setUsed(true); setModal({ typeId: ty.id, optId }) }}>
                  {closed ? t.ctaClosed : t.choose}
                </button>
              </div>
            </motion.article>
          )
        })}
      </div>
      <p className="contact">
        <a href={`https://t.me/${cfg.telegram}`} target="_blank" rel="noopener">Telegram</a> ·{' '}
        <a href={`https://x.com/${cfg.twitter}`} target="_blank" rel="noopener">X / Twitter</a>
      </p>

      {used && <Suspense fallback={null}><RequestModal open={!!modal} onClose={() => setModal(null)} initialType={modal?.typeId} initialOpt={modal?.optId} /></Suspense>}
    </Section>
  )
}
