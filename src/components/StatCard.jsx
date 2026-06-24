import useFetch, { extractList } from '../api/useFetch'
import Icon from './Icon'

export default function StatCard({ label, endpoint, icon, color }) {
  // Backend umumiy sonni (count) bermaydi, shuning uchun katta sahifa so'rab
  // qaytgan yozuvlar sonini ko'rsatamiz. count meta bo'lsa — o'shani.
  const { data, loading, error } = useFetch(endpoint, { page_size: 1000 })
  const { count, totalKnown, rows } = extractList(data)
  const value = totalKnown ? count : rows.length

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color + '22', color }}>
        <Icon name={icon} size={22} />
      </div>
      <div className="stat-body">
        <div className="stat-value">
          {loading ? '…' : error ? '—' : value.toLocaleString('uz-UZ')}
          {!loading && !error && !totalKnown && rows.length >= 1000 ? '+' : ''}
        </div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}
