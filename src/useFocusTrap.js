import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

// Traps Tab inside `ref` while `active`, closes on Escape, locks scroll and restores focus on exit.
export default function useFocusTrap(active, onClose) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!active) return
    const prev = document.activeElement
    const root = ref.current
    const items = () => [...(root?.querySelectorAll(FOCUSABLE) || [])].filter((el) => el.offsetParent !== null)
    ;(items()[0] || root)?.focus()
    document.body.style.overflow = 'hidden'

    const key = (e) => {
      if (e.key === 'Escape') { closeRef.current?.(); return }
      if (e.key !== 'Tab') return
      const list = items()
      if (!list.length) { e.preventDefault(); return }
      const first = list[0], last = list[list.length - 1]
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('keydown', key)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [active])

  return ref
}
