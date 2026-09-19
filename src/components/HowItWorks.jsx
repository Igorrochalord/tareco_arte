import { motion } from 'framer-motion'
import { useSite } from '../SiteContext'
import Section, { fadeUp } from './Section'

export default function HowItWorks() {
  const { t } = useSite()
  return (
    <Section id="how" title={t.howTitle}>
      <div className="steps">
        {t.steps.map(([title, text], i) => (
          <motion.article key={title} className="step" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
            <span className="step-n">0{i + 1}</span>
            <h4>{title}</h4>
            <p>{text}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
