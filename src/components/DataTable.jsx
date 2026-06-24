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
      if (typeof value === 'object') return <span className="muted">{JSON.stringify(value).slice(0, 40)}…</span>
      const text = String(value)
      return text.length > 45 ? <span title={text}>{text.slice(0, 45)}…</span> : text
    }
  }
}

export default function DataTable({ columns, rows, onView, onEdit }) {
  if (!rows || rows.length === 0) {
    return <div className="empty">Ma'lumot topilmadi</div>
  }
  const hasActions = onView || onEdit
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
