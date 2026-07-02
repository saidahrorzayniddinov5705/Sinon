import { useState } from 'react'
import { RotateCw, ChevronLeft, ChevronRight } from 'lucide-react'
import useFetch, { extractList } from '../../api/useFetch'
import labClient from '../../api/labClient'
import { patchItem } from '../../api/crud'
import DataTable from '../../components/DataTable'
import LabAssignStaffModal from '../../components/lab/LabAssignStaffModal'
import { LAB_ORDER_LIST, labOrderAction, labOrderUpdateStatus, ORDER_STATUS_OPTIONS } from '../../config/labConfig'

// Holat bosqichlari: faqat shu buyurtmaga biriktirilgan xodimning o'zi o'zgartira oladi (backend tekshiradi).
const NEXT_STATUS = {
  ACCEPTED: { next: 'ON_THE_WAY', label: "Yo'lga chiqish" },
  ON_THE_WAY: { next: 'ARRIVED', label: 'Yetib keldim' },
  ARRIVED: { next: 'FINISHED', label: 'Yakunlash' },
}

const columns = [
  { key: 'order_id', label: 'Buyurtma №' },
  { key: 'patient', label: 'Bemor' },
  { key: 'address', label: 'Manzil' },
  { key: 'payment_type', label: "To'lov", type: 'badge' },
  { key: 'summa', label: 'Summa', type: 'money' },
  { key: 'status', label: 'Holat', type: 'badge' },
  { key: 'planned_at', label: 'Rejalashtirilgan', type: 'date' },
  { key: 'created_at', label: 'Yaratilgan', type: 'date' },
]

export default function LabOrders() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [acting, setActing] = useState(null)
  const [assignFor, setAssignFor] = useState(null)

  const params = { page, page_size: 20, ...(status ? { status } : {}) }
  const { data, loading, error, reload } = useFetch(LAB_ORDER_LIST, params, labClient)
  const { rows, count, totalKnown } = extractList(data)
  const totalPages = totalKnown ? Math.max(1, Math.ceil(count / 20)) : null

  const doAction = async (row, action) => {
    setActing(row.order_id)
    try {
      await patchItem(labOrderAction(row.order_id), { action }, labClient)
      reload()
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Amalda xatolik')
    } finally {
      setActing(null)
    }
  }

  const doStatusUpdate = async (row, nextStatus) => {
    setActing(row.order_id)
    try {
      await patchItem(labOrderUpdateStatus(row.order_id), { status: nextStatus }, labClient)
      reload()
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Holatni o\'zgartirishda xatolik')
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Buyurtmalar</h1>
          <p className="breadcrumb">Laboratoriya kabineti / Buyurtmalar</p>
        </div>
        <button className="btn-ghost" onClick={reload}>
          <RotateCw size={16} /> Yangilash
        </button>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            style={{ maxWidth: 220 }}
          >
            <option value="">— barcha holatlar —</option>
            {ORDER_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="toolbar-right" style={{ marginLeft: 'auto' }}>
            <span className="count-pill">{count || 0} ta buyurtma</span>
          </div>
        </div>

        {loading && <div className="empty">Yuklanmoqda...</div>}
        {error && <div className="error-box">Xatolik: {error}</div>}
        {!loading && !error && (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.order_id}
            renderExtraActions={(row) => (
              <>
                {row.status === 'WAITING' && (
                  <>
                    <button className="btn-mini" disabled={acting === row.order_id} onClick={() => doAction(row, 'accept')}>
                      Qabul qilish
                    </button>
                    <button className="btn-mini delete" disabled={acting === row.order_id} onClick={() => doAction(row, 'cancel')}>
                      Bekor qilish
                    </button>
                  </>
                )}
                {row.status === 'ACCEPTED' && (
                  <button className="btn-mini edit" onClick={() => setAssignFor(row.order_id)}>
                    Labarantga biriktirish
                  </button>
                )}
                {NEXT_STATUS[row.status] && (
                  <button
                    className="btn-mini edit"
                    disabled={acting === row.order_id}
                    onClick={() => doStatusUpdate(row, NEXT_STATUS[row.status].next)}
                  >
                    {NEXT_STATUS[row.status].label}
                  </button>
                )}
              </>
            )}
          />
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="btn-mini" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={16} /> Oldingi
            </button>
            <span>{page} / {totalPages}</span>
            <button className="btn-mini" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Keyingi <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {assignFor && (
        <LabAssignStaffModal orderId={assignFor} onClose={() => setAssignFor(null)} onSaved={reload} />
      )}
    </div>
  )
}
