import { useEffect } from 'react'
import { X } from 'lucide-react'
import useFetch, { unwrapData } from '../api/useFetch'
import { humanizeAmounts } from './DataTable'

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

// Pul/narx ko'rinishidagi maydonlar
const MONEY_KEYS = /(^|_)(price|summa|amount|narx|min_price|max_price|balance)($|_)/i

function formatMoney(v) {
  const n = Number(v)
  if (isNaN(n)) return String(v)
  return n.toLocaleString('uz-UZ') + " so'm"
}

// Uzun nollarni tozalaydi: "75235.00000000" -> "75235", "41.310000" -> "41.31"
function trimNum(s) {
  if (!/^-?\d+\.\d+$/.test(s)) return s
  return s.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '')
}

// Maydon butun qatorni egallashi kerakmi (rasm, JSON, uzun matn, massiv)
export function isWideValue(v) {
  if (typeof v === 'string') return /\.(png|jpe?g|gif|webp|svg)$/i.test(v) || v.length > 55
  if (Array.isArray(v)) return v.length > 0
  if (v && typeof v === 'object') {
    const entries = Object.entries(v).filter(([, x]) => x !== null && x !== '' && typeof x !== 'object')
    const hasName =
      v.full_name || v.name || v.title || v.lab_name || v.username ||
      v.order_id || v.region || v.district || v.street || v.address
    return !(hasName || entries.length <= 1)
  }
  return false
}

function renderValue(v, key) {
  if (v === null || v === undefined || v === '') return <span className="muted">—</span>
  if (typeof v === 'boolean') return <span className={`badge ${v ? 'badge-green' : 'badge-red'}`}>{v ? 'Ha' : "Yo'q"}</span>
  // Narx/summa maydonlarini chiroyli formatlaymiz
  if (key && MONEY_KEYS.test(key) && v !== '' && !isNaN(Number(v))) return formatMoney(v)
  if (typeof v === 'string' && /\.(png|jpe?g|gif|webp|svg)$/i.test(v))
    return <img className="detail-img" src={v} alt="" onError={(e) => (e.target.style.display = 'none')} />
  if (typeof v === 'string' && /^https?:\/\//i.test(v))
    return <a href={v} target="_blank" rel="noreferrer" className="detail-link">{v}</a>
  if (typeof v === 'string') {
    if (/^-?\d+\.\d+$/.test(v)) return trimNum(v) // uzun nolli o'nlik son
    return humanizeAmounts(v)
  }
  if (Array.isArray(v)) {
    if (v.length === 0) return <span className="muted">—</span>
    return (
      <div className="chips">
        {v.map((it, i) => (
          <span className="badge badge-blue" key={i}>
            {it && typeof it === 'object' ? objLabel(it) ?? '—' : String(it)}
          </span>
        ))}
      </div>
    )
  }
  if (typeof v === 'object') {
    // Ma'noli oddiy maydonlar (null/obyekt emas)
    const entries = Object.entries(v).filter(
      ([, val]) => val !== null && val !== '' && typeof val !== 'object'
    )
    const hasName =
      v.full_name || v.name || v.title || v.lab_name || v.username ||
      v.order_id || v.region || v.district || v.street || v.address
    // Nom bo'lsa yoki bitta maydon bo'lsa — soddalashtirilgan yorliq (#id ham)
    if (hasName || entries.length <= 1) {
      return <span>{objLabel(v) ?? '—'}</span>
    }
    // Aks holda — toza kalit:qiymat ro'yxati
    if (entries.length === 0) return <span className="muted">—</span>
    return (
      <div className="mini-grid">
        {entries.map(([k, val]) => (
          <div className="mini-row" key={k}>
            <span className="mini-key">{k}</span>
            <span className="mini-val">
              {MONEY_KEYS.test(k) && !isNaN(Number(val)) ? formatMoney(val) : String(val)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return String(v)
}

// Obyektdan o'qiladigan yorliqni tanlaydi
function objLabel(o) {
  if (o === null || o === undefined) return null
  if (typeof o !== 'object') return String(o)
  // Manzil ko'rinishidagi obyekt — viloyat, tuman, ko'cha
  if (o.region || o.district || o.street || o.address) {
    const parts = [o.region, o.district, o.street, o.address].filter(Boolean)
    if (parts.length) return parts.join(', ')
  }
  const v =
    o.full_name ?? o.name ?? o.title ?? o.lab_name ?? o.username ?? o.role ??
    o.label ?? o.order_id ?? o.phone ?? o.contact
  if (v !== undefined && v !== null) return String(v)
  // Faqat id qolsa — #id
  if (o.id !== undefined && o.id !== null) return '#' + o.id
  return null
}

export function FieldList({ obj }) {
  const entries = obj && typeof obj === 'object' && !Array.isArray(obj) ? Object.entries(obj) : [['data', obj]]
  return (
    <div className="detail-grid">
      {entries.map(([k, v]) => (
        <div className={`detail-row ${isWideValue(v) ? 'wide' : ''}`} key={k}>
          <div className="detail-key">{k}</div>
          <div className="detail-val">{renderValue(v, k)}</div>
        </div>
      ))}
    </div>
  )
}
