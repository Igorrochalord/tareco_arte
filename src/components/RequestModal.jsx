import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSite } from '../SiteContext'

export default function RequestModal({ open, onClose, initialType }) {
  const { t, cfg, lang, money } = useSite()
  const [typeId, setTypeId] = useState(initialType)
  const [optId, setOptId] = useState(null)
  const [user, setUser] = useState('')
  const [desc, setDesc] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { if (open) setTypeId(initialType) }, [open, initialType])

  const ty = cfg.types.find((x) => x.id === typeId)
  const op = ty.options.find((o) => o.id === optId) || ty.options[0]

  useEffect(() => {
    if (!open) return
    const key = (e) => e.key === 'Escape' && onClose()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', key)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', key) }
  }, [open, onClose])

  const message = () => [
    t.msgHello,
    `${t.msgType}: ${ty.name[lang]}`,
    `${t.msgOpt}: ${op.label[lang]}`,
    `${t.msgPrice}: ${money(op.price)}`,
    user.trim() && `${t.msgUser}: ${user.trim()}`,
    desc.trim() && `${t.msgDesc}: ${desc.trim()}`,
  ].filter(Boolean).join('\n')

  const copy = async () => {
    try { await navigator.clipboard.writeText(message()); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* ignore */ }
  }
  const send = async () => {
    await copy()
    window.open(`https://t.me/${cfg.telegram}`, '_blank', 'noopener')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="modal" role="dialog" aria-modal="true" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={onClose} aria-label={t.close}>×</button>
            <h3>{t.mTitle}</h3>

            <label>{t.mType}</label>
            <select value={typeId} onChange={(e) => { setTypeId(e.target.value); setOptId(null) }}>
              {cfg.types.map((x) => <option key={x.id} value={x.id}>{x.name[lang]}</option>)}
            </select>

            <label>{t.mOpt}</label>
            <div className="opt-row">
              {ty.options.map((o) => (
                <button key={o.id} aria-pressed={o.id === op.id} onClick={() => setOptId(o.id)}>
                  {o.label[lang]} · {money(o.price)}
                </button>
              ))}
            </div>

            <label>{t.mUser}</label>
            <input value={user} onChange={(e) => setUser(e.target.value)} autoComplete="off" />
            <label>{t.mDesc}</label>
            <textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} />

            <p className="estimate"><span>{t.mEst}</span><strong>{money(op.price)}</strong></p>
            <button className="btn primary block" onClick={send}>{t.send}</button>
            <div className="modal-sec">
              <button className="btn ghost" onClick={copy}>{copied ? t.copied : t.copy}</button>
              <a className="btn ghost" href={`https://x.com/${cfg.twitter}`} target="_blank" rel="noopener">{t.x}</a>
            </div>
            <p className="hint">{t.hint}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
