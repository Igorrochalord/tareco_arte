import { useSite } from '../SiteContext'

const toNum = (v) => (v === '' || isNaN(+v) ? null : +v)

export default function AdminPanel({ onClose }) {
  const { cfg, lang, t, update, reset } = useSite()
  const pt = lang === 'pt'

  const setType = (id, fn) => update((c) => { fn(c.types.find((x) => x.id === id)); return c })

  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(cfg, null, 2) + '\n'], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <aside className="admin">
      <h3>{pt ? 'Painel da Tareco' : "Tareco's panel"}</h3>
      <p>
        {pt
          ? 'Preencha prazos (em dias), preços e status. A prévia aparece na hora, só neste navegador. Para publicar, baixe o config.json e substitua o arquivo config.json do site.'
          : 'Set deadlines (in days), prices and status. The preview is instant, in this browser only. To publish, download config.json and replace the site\'s config.json.'}
      </p>

      <h4>Status</h4>
      <select value={cfg.status} onChange={(e) => update((c) => { c.status = e.target.value; return c })}>
        {['open', 'waitlist', 'closed'].map((s) => <option key={s} value={s}>{t[s]}</option>)}
      </select>

      {cfg.types.map((ty) => (
        <div key={ty.id}>
          <h4>{ty.name[lang]}</h4>
          <div className="arow head"><span>{pt ? 'Prazo (dias)' : 'Deadline (days)'}</span><span>min</span><span>max</span></div>
          <div className="arow">
            <span />
            <input type="number" min="0" value={ty.min ?? ''} onChange={(e) => setType(ty.id, (x) => { x.min = toNum(e.target.value) })} />
            <input type="number" min="0" value={ty.max ?? ''} onChange={(e) => setType(ty.id, (x) => { x.max = toNum(e.target.value) })} />
          </div>
          {ty.options.map((op) => (
            <div className="arow opt" key={op.id}>
              <span>{op.label[lang]} (R$)</span>
              <input type="number" min="0" value={op.price} onChange={(e) => setType(ty.id, (x) => { x.options.find((o) => o.id === op.id).price = toNum(e.target.value) ?? 0 })} />
            </div>
          ))}
        </div>
      ))}

      <div className="actions">
        <button className="btn primary" onClick={download}>config.json ↓</button>
        <button className="btn ghost" onClick={reset}>{pt ? 'Restaurar' : 'Reset'}</button>
        <button className="btn ghost" onClick={onClose}>×</button>
      </div>
    </aside>
  )
}
