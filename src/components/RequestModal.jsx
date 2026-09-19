import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSite } from '../SiteContext'
import useFocusTrap from '../useFocusTrap'

export default function RequestModal({ open, onClose, initialType, initialOpt }) {
  return (
    <AnimatePresence>
      {open && <Dialog onClose={onClose} initialType={initialType} initialOpt={initialOpt} />}
    </AnimatePresence>
  )
}

function Dialog({ onClose, initialType, initialOpt }) {
  const { t, cfg, lang, money } = useSite()
  const id = useId()
  const ref = useFocusTrap(true, onClose)
  const [typeId, setTypeId] = useState(initialType)
  const [optId, setOptId] = useState(initialOpt)
  const [user, setUser] = useState('')
  const [desc, setDesc] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('') // '', 'ok', 'fail'

  useEffect(() => {
    if (!status) return
    const tm = setTimeout(() => setStatus(''), 4000)
    return () => clearTimeout(tm)
  }, [status])

  const ty = cfg.types.find((x) => x.id === typeId)
  const op = ty.options.find((o) => o.id === optId) || ty.options[0]

  const message = () => [
    t.msgHello,
    `${t.msgType}: ${ty.name[lang]}`,
    `${t.msgOpt}: ${op.label[lang]}`,
    `${t.msgPrice}: ${money(op.price)}`,
    `${t.msgUser}: ${user.trim()}`,
    `${t.msgDesc}: ${desc.trim()}`,
  ].join('\n')

  const validate = () => {
    const e = {}
    if (!user.trim()) e.user = t.errUser
    if (!desc.trim()) e.desc = t.errDesc
    setErrors(e)
    if (e.user) document.getElementById(`${id}-user`).focus()
    else if (e.desc) document.getElementById(`${id}-desc`).focus()
    return !Object.keys(e).length
  }

  const copy = async () => {
    if (!validate()) return false
    try { await navigator.clipboard.writeText(message()); setStatus('ok'); return true } catch { setStatus('fail'); return false }
  }
  const send = async () => {
    if (await copy()) window.open(`https://t.me/${cfg.telegram}`, '_blank', 'noopener')
  }

  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div ref={ref} className="modal" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} tabIndex={-1} initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}>
        <button className="modal-x" onClick={onClose} aria-label={t.close}>×</button>
        <h3 id={`${id}-title`}>{t.mTitle}</h3>
        <p className="req-note">{t.requiredNote}</p>

        <label htmlFor={`${id}-type`}>{t.mType}</label>
        <select id={`${id}-type`} value={typeId} onChange={(e) => { setTypeId(e.target.value); setOptId(null) }}>
          {cfg.types.map((x) => <option key={x.id} value={x.id}>{x.name[lang]}</option>)}
        </select>

        <span className="label" id={`${id}-opt`}>{t.mOpt}</span>
        <div className="opt-row" role="group" aria-labelledby={`${id}-opt`}>
          {ty.options.map((o) => (
            <button key={o.id} aria-pressed={o.id === op.id} onClick={() => setOptId(o.id)}>
              {o.label[lang]} · {money(o.price)}
            </button>
          ))}
        </div>

        <label htmlFor={`${id}-user`}>{t.mUser} <span aria-hidden="true">*</span></label>
        <input id={`${id}-user`} value={user} onChange={(e) => setUser(e.target.value)} autoComplete="off" required aria-required="true" aria-invalid={!!errors.user} aria-describedby={errors.user ? `${id}-user-err` : undefined} />
        {errors.user && <p className="err" id={`${id}-user-err`} role="alert">{errors.user}</p>}

        <label htmlFor={`${id}-desc`}>{t.mDesc} <span aria-hidden="true">*</span></label>
        <textarea id={`${id}-desc`} rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} required aria-required="true" aria-invalid={!!errors.desc} aria-describedby={errors.desc ? `${id}-desc-err` : undefined} />
        {errors.desc && <p className="err" id={`${id}-desc-err`} role="alert">{errors.desc}</p>}

        <p className="estimate"><span>{t.mEst}</span><strong>{money(op.price)}</strong></p>
        <button className="btn primary block" onClick={send}>{t.send}</button>
        <div className="modal-sec">
          <button className="btn ghost" onClick={copy}>{t.copy}</button>
          <a className="btn ghost" href={`https://x.com/${cfg.twitter}`} target="_blank" rel="noopener">{t.x}</a>
        </div>
        <p className={`toast ${status}`} role="status" aria-live="polite">
          {status === 'ok' ? `✓ ${t.copiedMsg}` : status === 'fail' ? t.copyFail : ''}
        </p>
        <p className="hint">{t.hint}</p>
      </motion.div>
    </motion.div>
  )
}
