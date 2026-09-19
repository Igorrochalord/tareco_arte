import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSite } from '../SiteContext'

export default function Lightbox({ items, index, setIndex }) {
  const { t } = useSite()
  const open = index !== null
  const go = (d) => setIndex((i) => (i + d + items.length) % items.length)

  useEffect(() => {
    if (!open) return
    const key = (e) => {
      if (e.key === 'Escape') setIndex(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', key)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', key) }
  }, [open, items.length])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIndex(null)}>
          <button className="lb-close" aria-label={t.close} onClick={() => setIndex(null)}>×</button>
          <button className="lb-nav prev" aria-label={t.prev} onClick={(e) => { e.stopPropagation(); go(-1) }}>‹</button>
          <AnimatePresence mode="wait">
            <motion.figure key={items[index].id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()}>
              <img src={items[index].src} alt={items[index].title} />
              {items[index].title && <figcaption>{items[index].title}</figcaption>}
            </motion.figure>
          </AnimatePresence>
          <button className="lb-nav next" aria-label={t.next} onClick={(e) => { e.stopPropagation(); go(1) }}>›</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
