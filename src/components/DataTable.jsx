// Universal jadval. Ustun turlariga qarab katakni chiroyli ko'rsatadi.

function formatDate(v) {
  if (!v) return '—'
  const d = new Date(v)
  if (isNaN(d)) return String(v)
  return d.toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function formatMoney(v) {
  if (v === null || v === undefined || v === '') return '—'
  const n = Number(v)
  if (isNaN(n)) return String(v)
  return n.toLocaleString('uz-UZ') + " so'm"
}

// Matn ichidagi pul summalarini chiroyli qiladi: "10000.00" -> "10 000".
// Faqat 2 xonali kasrli sonlar (pul) o'zgartiriladi — buyurtma raqami kabi
// butun sonlarga tegilmaydi.
export function humanizeAmounts(text) {
  return String(text).replace(/\d+\.\d{2}(?!\d)/g, (m) => {
    const n = Number(m)
    if (isNaN(n)) return m
    return Number.isInteger(n)
      ? n.toLocaleString('uz-UZ')
      : n.toLocaleString('uz-UZ', { minimumFractionDigits: 2 })
  })
}

function Badge({ value }) {
  if (value === null || value === undefined || value === '') return <span className="muted">—</span>
  const text = String(value)
  const key = text.toLowerCase()
  let cls = 'badge'
  if (['active', 'approved', 'completed', 'success', 'paid', 'true'].includes(key)) cls += ' badge-green'
  else if (['pending', 'in_progress', 'processing', 'waiting'].includes(key)) cls += ' badge-amber'
  else if (['rejected', 'cancelled', 'failed', 'blocked', 'inactive', 'false'].includes(key)) cls += ' badge-red'
  else cls += ' badge-blue'
  return <span className={cls}>{text}</span>
}

function Cell({ col, row }) {
  const value = row[col.key]

  switch (col.type) {
    case 'image':
      return value ? (
        <img className="cell-img" src={value} alt="" onError={(e) => (e.target.style.display = 'none')} />
      ) : (
        <div className="cell-img placeholder" />
      )
    case 'date':
      return <span className="muted">{formatDate(value)}</span>
    case 'money':
      return formatMoney(value)
    case 'bool':
      return value ? <Badge value="true" /> : <Badge value="false" />
    case 'badge':
      return <Badge value={value} />
    case 'roles': {
      const arr = Array.isArray(value) ? value : value ? [value] : []
      if (!arr.length) return <span className="muted">—</span>
      return (
        <div className="roles">
          {arr.map((r, i) => (
            <span key={i} className="badge badge-blue">{typeof r === 'object' ? r.name || r.role || JSON.stringify(r) : r}</span>
          ))}
        </div>
      )
    }
    default: {
      if (value === null || value === undefined || value === '') return <span className="muted">—</span>
      // Ichki obyekt (FK) bo'lsa — o'qiladigan nom/ism ko'rsatamiz, xom JSON emas
      if (Array.isArray(value)) {
        const labels = value.map(objLabel).filter(Boolean)
        return labels.length ? labels.join(', ') : <span className="muted">—</span>
      }
      if (typeof value === 'object') {
        const lbl = objLabel(value)
        return lbl !== null ? <span title={String(lbl)}>{truncate(String(lbl))}</span> : <span className="muted">—</span>
      }
      const text = humanizeAmounts(String(value))
      return text.length > 45 ? <span title={text}>{text.slice(0, 45)}…</span> : text
    }
  }
}

// Obyektdan o'qiladigan yorliqni tanlaydi (FK maydonlar uchun)
function objLabel(o) {
  if (o === null || o === undefined) return null
  if (typeof o !== 'object') return String(o)
  const v =
    o.full_name ?? o.name ?? o.title ?? o.lab_name ?? o.username ?? o.role ??
    o.label ?? o.order_id ?? o.patient_data?.full_name ?? o.phone ?? o.contact ?? o.id
  return v === undefined ? null : v
}

function truncate(text, n = 45) {
  return text.length > n ? text.slice(0, n) + '…' : text
}

export default function DataTable({ columns, rows, onView, onEdit, onDelete }) {
  if (!rows || rows.length === 0) {
    return <div className="empty">Ma'lumot topilmadi</div>
  }
  const hasActions = onView || onEdit || onDelete
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            {hasActions && <th>Amallar</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((c) => (
                <td key={c.key} data-label={c.label}>
                  <Cell col={c} row={row} />
                </td>
              ))}
              {hasActions && (
                <td data-label="Amallar">
                  <div className="row-actions">
                    {onView && (
                      <button className="btn-mini" onClick={() => onView(row)}>
                        Ko'rish
                      </button>
                    )}
                    {onEdit && (
                      <button className="btn-mini edit" onClick={() => onEdit(row)}>
                        Tahrirlash
                      </button>
                    )}
                    {onDelete && (
                      <button className="btn-mini delete" onClick={() => onDelete(row)}>
                        O'chirish
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
