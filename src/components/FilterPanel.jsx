import { useState, useEffect, useRef } from 'react'

// Filtrlardan query params quradi (bo'sh qiymatlarni tashlab)
function buildParams(draft) {
  const out = {}
  Object.entries(draft).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) out[k] = v
  })
  return out
}

export default function FilterPanel({ filters, applied, onApply, onClose }) {
  const [draft, setDraft] = useState(() => ({ ...applied }))
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }))

  // Real-time: draft o'zgarsa, biroz kechikib (350ms) avtomatik qo'llaymiz
  const onApplyRef = useRef(onApply)
  onApplyRef.current = onApply
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return // boshlang'ich holatda qayta yubormaymiz
    }
    const t = setTimeout(() => onApplyRef.current(buildParams(draft)), 350)
    return () => clearTimeout(t)
  }, [draft])

  const reset = () => setDraft({})

  return (
    <div className="filter-panel">
      <div className="filter-grid">
        {filters.map((f, i) => (
          <div className="filter-field" key={i}>
            <label>{f.label}</label>

            {f.type === 'select' ? (
              <select value={draft[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}>
                <option value="">— hammasi —</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : f.type === 'bool' ? (
              <select value={draft[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)}>
                <option value="">— hammasi —</option>
                <option value="true">Ha</option>
                <option value="false">Yo'q</option>
              </select>
            ) : f.type === 'number' ? (
              <input
                type="number"
                value={draft[f.key] ?? ''}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder="..."
              />
            ) : f.type === 'daterange' ? (
              <div className="range-row">
                <input type="date" value={draft[f.after] ?? ''} onChange={(e) => set(f.after, e.target.value)} />
                <span>—</span>
                <input type="date" value={draft[f.before] ?? ''} onChange={(e) => set(f.before, e.target.value)} />
              </div>
            ) : f.type === 'numrange' ? (
              <div className="range-row">
                <input type="number" placeholder="min" value={draft[f.min] ?? ''} onChange={(e) => set(f.min, e.target.value)} disabled={!f.min} />
                <span>—</span>
                <input type="number" placeholder="max" value={draft[f.max] ?? ''} onChange={(e) => set(f.max, e.target.value)} disabled={!f.max} />
              </div>
            ) : (
              <input
                type="text"
                value={draft[f.key] ?? ''}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder="..."
              />
            )}
          </div>
        ))}
      </div>

      <div className="filter-actions">
        <button className="btn-ghost" onClick={reset}>Tozalash</button>
        <button className="btn-ghost" onClick={onClose}>Yopish</button>
      </div>
    </div>
  )
}
