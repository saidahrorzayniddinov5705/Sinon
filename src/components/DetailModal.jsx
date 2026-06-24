import { useEffect } from 'react'
import { X } from 'lucide-react'
import useFetch, { unwrapData } from '../api/useFetch'

// Bitta yozuvning to'liq ma'lumotini DETAIL endpointdan olib ko'rsatadi.
export default function DetailModal({ endpoint, title, onClose }) {
  const { data, loading, error } = useFetch(endpoint)

  // Esc tugmasi bilan yopish
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title || 'Batafsil'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading && <div className="empty">Yuklanmoqda...</div>}
          {error && <div className="error-box">Xatolik: {error}</div>}
          {!loading && !error && data && <FieldList obj={unwrapData(data)} />}
        </div>
      </div>
    </div>
  )
}

function renderValue(v) {
  if (v === null || v === undefined || v === '') return <span className="muted">—</span>
  if (typeof v === 'boolean') return <span className={`badge ${v ? 'badge-green' : 'badge-red'}`}>{v ? 'Ha' : "Yo'q"}</span>
  if (typeof v === 'string' && /\.(png|jpe?g|gif|webp|svg)$/i.test(v))
    return <img className="detail-img" src={v} alt="" onError={(e) => (e.target.style.display = 'none')} />
  if (typeof v === 'string' && /^https?:\/\//i.test(v))
    return <a href={v} target="_blank" rel="noreferrer" className="detail-link">{v}</a>
  if (Array.isArray(v)) {
    if (v.length === 0) return <span className="muted">—</span>
    return <pre className="detail-json">{JSON.stringify(v, null, 2)}</pre>
  }
  if (typeof v === 'object') return <pre className="detail-json">{JSON.stringify(v, null, 2)}</pre>
  return String(v)
}

function FieldList({ obj }) {
  const entries = obj && typeof obj === 'object' && !Array.isArray(obj) ? Object.entries(obj) : [['data', obj]]
  return (
    <div className="detail-grid">
      {entries.map(([k, v]) => (
        <div className="detail-row" key={k}>
          <div className="detail-key">{k}</div>
          <div className="detail-val">{renderValue(v)}</div>
        </div>
      ))}
    </div>
  )
}
