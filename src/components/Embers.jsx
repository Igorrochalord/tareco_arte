import { useEffect, useRef } from 'react'

const COLORS = ['214,58,154', '196,18,47', '150,80,220', '255,120,60']

// Slowly rising embers behind the hero; pauses when off-screen.
export default function Embers({ count = 55 }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w, h, raf, visible = true, parts = []
    const spawn = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: 0.6 + Math.random() * 2.2,
      vy: 0.15 + Math.random() * 0.55,
      sway: Math.random() * Math.PI * 2,
      a: 0.25 + Math.random() * 0.6,
      c: COLORS[(Math.random() * COLORS.length) | 0],
    })
    const resize = () => {
      w = cv.width = cv.offsetWidth
      h = cv.height = cv.offsetHeight
      parts = Array.from({ length: count }, () => spawn(true))
    }
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        p.y -= p.vy
        p.sway += 0.01
        p.x += Math.sin(p.sway) * 0.35
        if (p.y < -10) Object.assign(p, spawn(false))
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        g.addColorStop(0, `rgba(${p.c},${p.a})`)
        g.addColorStop(1, `rgba(${p.c},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    resize()
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(cv)
    window.addEventListener('resize', resize)
    if (still) { visible = true; frame(); cancelAnimationFrame(raf) } else frame()
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', resize) }
  }, [count])
  return <canvas ref={ref} className="embers" aria-hidden="true" />
}
