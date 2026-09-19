import { motion } from 'framer-motion'

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } },
}

export default function Section({ id, title, sub, children, className = '' }) {
  return (
    <section id={id} className={`section ${className}`}>
      <motion.div className="section-head" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
        <span className="rule" />
      </motion.div>
      {children}
    </section>
  )
}
