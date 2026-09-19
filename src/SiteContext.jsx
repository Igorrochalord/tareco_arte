import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STR } from './i18n'

const STORE = 'tareco_cfg_v2'
const Ctx = createContext(null)
export const useSite = () => useContext(Ctx)

// The admin panel keeps a per-browser preview of prazos/precos/status.
function applyOverride(base) {
  const cfg = structuredClone(base)
  try {
    const o = JSON.parse(localStorage.getItem(STORE) || 'null')
    if (!o) return cfg
    if (o.status) cfg.status = o.status
    for (const ty of cfg.types) {
      const ot = o.types?.[ty.id]
      if (!ot) continue
      ty.min = ot.min
      ty.max = ot.max
      for (const op of ty.options) if (ot.prices?.[op.id] != null) op.price = ot.prices[op.id]
    }
  } catch { /* storage unavailable: use file config */ }
  return cfg
}

function saveOverride(cfg) {
  const o = { status: cfg.status, types: {} }
  for (const ty of cfg.types) {
    o.types[ty.id] = { min: ty.min, max: ty.max, prices: Object.fromEntries(ty.options.map((p) => [p.id, p.price])) }
  }
  try { localStorage.setItem(STORE, JSON.stringify(o)) } catch { /* ignore */ }
}

const initialLang = () => {
  try { const l = localStorage.getItem('tareco_lang'); if (l) return l } catch { /* ignore */ }
  return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function SiteProvider({ children }) {
  const [base, setBase] = useState(null)
  const [cfg, setCfg] = useState(null)
  const [lang, setLang] = useState(initialLang)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}config.json`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((b) => { setBase(b); setCfg(applyOverride(b)) })
      .catch(() => setFailed(true))
  }, [])

  useEffect(() => { document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en' }, [lang])

  const toggleLang = useCallback(() => {
    setLang((l) => {
      const n = l === 'pt' ? 'en' : 'pt'
      try { localStorage.setItem('tareco_lang', n) } catch { /* ignore */ }
      return n
    })
  }, [])

  const update = useCallback((fn) => {
    setCfg((prev) => { const next = fn(structuredClone(prev)); saveOverride(next); return next })
  }, [])

  const reset = useCallback(() => {
    try { localStorage.removeItem(STORE) } catch { /* ignore */ }
    setCfg(structuredClone(base))
  }, [base])

  const value = useMemo(() => {
    if (!cfg) return null
    const t = STR[lang]
    const money = (n) => `R$ ${n}`
    const deadline = (ty) => {
      const { min, max } = ty
      if (min && max) return min === max ? `${min} ${t.days}` : `${min}–${max} ${t.days}`
      if (min || max) return `~${min || max} ${t.days}`
      return t.tbd
    }
    const art = (id) => cfg.gallery.find((g) => g.id === id) || cfg.gallery[0]
    return { cfg, lang, t, money, deadline, art, toggleLang, update, reset }
  }, [cfg, lang, toggleLang, update, reset])

  if (failed) return <p style={{ padding: 32, color: '#fff' }}>Não foi possível carregar config.json</p>
  if (!value) return null
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
