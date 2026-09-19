import { useEffect } from 'react'
import useFocusTrap from '../useFocusTrap'
import { AnimatePresence, motion } from 'framer-motion'
import { useSite } from '../SiteContext'

export default function Lightbox({ items, index, setIndex }) {
  const { t } = useSite()
  const open = index !== null
  const ref = useFocusTrap(open, () => setIndex(null))
  const go = (d) => setIndex((i) => (i + d + items.length) % items.length)

  useEffect(() => {
    if (!open) return
    const key = (e) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [open, items.length])

  return (
    <AnimatePresence>
      {open && (
        <motion.div ref={ref} className="lightbox" role="dialog" aria-modal="true" aria-label={items[index].title || t.slide} tabIndex={-1} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIndex(null)}>
          <button className="lb-close" aria-label={t.close} onClick={() => setIndex(null)}>×</button>
          <button className="lb-nav prev" aria-label={t.prev} onClick={(e) => { e.stopPropagation(); go(-1) }}>‹</button>
          <AnimatePresence mode="wait">
            <motion.figure key={items[index].id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()}>
              <img src={items[index].src} width={items[index].w} height={items[index].h} alt={items[index].title || ''} />
              {items[index].title && <figcaption>{items[index].title}</figcaption>}
            </motion.figure>
          </AnimatePresence>
          <button className="lb-nav next" aria-label={t.next} onClick={(e) => { e.stopPropagation(); go(1) }}>›</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
