import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import { dashboardCounts, sections } from '../config/sections'
import useFetch, { extractList } from '../api/useFetch'
import DataTable from '../components/DataTable'
import Icon from './../components/Icon'

const DONUT = [
  { name: 'Foydalanuvchilar', value: 41, color: '#6366f1' },
  { name: 'Buyurtmalar', value: 25, color: '#a855f7' },
  { name: 'Shifokorlar', value: 22, color: '#f59e0b' },
  { name: 'Laboratoriya', value: 12, color: '#3b82f6' },
]

const TREND = [
  { m: 'Yan', income: 45, profit: 30 },
  { m: 'Fev', income: 52, profit: 35 },
  { m: 'Mar', income: 48, profit: 40 },
  { m: 'Apr', income: 61, profit: 38 },
  { m: 'May', income: 75, profit: 45 },
  { m: 'Iyn', income: 68, profit: 60 },
  { m: 'Iyl', income: 80, profit: 72 },
  { m: 'Avg', income: 72, profit: 65 },
  { m: 'Sen', income: 78, profit: 70 },
  { m: 'Okt', income: 85, profit: 58 },
  { m: 'Noy', income: 79, profit: 50 },
  { m: 'Dek', income: 90, profit: 42 },
]

// Buyurtmalar jadvalining ustunlari (Project Summary o'rnida)
const orderCols = [
  { key: 'order_id', label: 'Buyurtma №' },
  { key: 'created_at', label: 'Sana', type: 'date' },
  { key: 'payment_type', label: "To'lov", type: 'badge' },
  { key: 'summa', label: 'Summa', type: 'money' },
  { key: 'status', label: 'Holat', type: 'badge' },
]

export default function Dashboard() {
  const { data, loading, error } = useFetch('/api/v1/super-admin/orders/list/', { page_size: 6 })
  const { rows } = extractList(data)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="breadcrumb">Umumiy ko'rinish</p>
        </div>
      </div>

      {/* Stat kartalar */}
      <div className="stat-grid">
        {dashboardCounts.map((c) => (
          <StatCard key={c.endpoint} {...c} />
        ))}
      </div>

      {/* O'rta qator: jadval + donut */}
      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3>So'nggi buyurtmalar</h3>
          </div>
          {loading && <div className="empty">Yuklanmoqda...</div>}
          {!loading && (error ? <div className="empty">Buyurtmalar topilmadi</div> : <DataTable columns={orderCols} rows={rows} />)}
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Taqsimot</h3>
          </div>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={DONUT}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {DONUT.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend">
            {DONUT.map((d) => (
              <div key={d.name} className="legend-row">
                <span className="dot" style={{ background: d.color }} />
                <span>{d.name}</span>
                <b>{d.value}%</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pastki qator: line chart + summary */}
      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3>Daromad & Foyda</h3>
            <span className="muted small">Yillik</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} dot={false} name="Daromad" />
              <Line type="monotone" dataKey="profit" stroke="#f59e0b" strokeWidth={3} dot={false} name="Foyda" />
            </LineChart>
          </ResponsiveContainer>
          <div className="legend inline">
            <div className="legend-row"><span className="dot" style={{ background: '#22c55e' }} /> Daromad</div>
            <div className="legend-row"><span className="dot" style={{ background: '#f59e0b' }} /> Foyda</div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Bo'limlar</h3>
          </div>
          <div className="summary-list">
            {sections.slice(0, 8).map((s) => (
              <Link key={s.key} to={`/section/${s.key}`} className="summary-row">
                <span className="summary-icon"><Icon name={s.icon} size={16} /></span>
                <span className="summary-name">{s.title}</span>
                <Icon name="ChevronRight" size={16} className="muted" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
