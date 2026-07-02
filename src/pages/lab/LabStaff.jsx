import { useState } from 'react'
import { Plus, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react'
import useFetch, { extractList } from '../../api/useFetch'
import labClient from '../../api/labClient'
import { patchItem } from '../../api/crud'
import DataTable from '../../components/DataTable'
import CreateModal from '../../components/CreateModal'
import { LAB_STAFF_LIST, LAB_STAFF_CREATE, labStaffCreateFields, labStaffUpdate } from '../../config/labConfig'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'image', label: 'Rasm', type: 'image' },
  { key: 'full_name', label: 'F.I.O' },
  { key: 'contact', label: 'Kontakt' },
  { key: 'status', label: 'Faol', type: 'bool' },
  { key: 'created_at', label: 'Yaratilgan', type: 'date' },
]

export default function LabStaff() {
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const [toggling, setToggling] = useState(null)

  const { data, loading, error, reload } = useFetch(LAB_STAFF_LIST, { page, page_size: 20 }, labClient)
  const { rows, count, totalKnown } = extractList(data)
  const totalPages = totalKnown ? Math.max(1, Math.ceil(count / 20)) : null

  const toggleStatus = async (row) => {
    setToggling(row.id)
    try {
      await patchItem(labStaffUpdate(row.id), { status: !row.status }, labClient)
      reload()
    } catch (err) {
      alert(err.response?.data?.message || err.message || "O'zgartirishda xatolik")
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Labarantlar</h1>
          <p className="breadcrumb">Laboratoriya kabineti / Labarantlar</p>
        </div>
        <button className="btn-ghost" onClick={reload}>
          <RotateCw size={16} /> Yangilash
        </button>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <div className="toolbar-right" style={{ marginLeft: 'auto' }}>
            <span className="count-pill">{count || 0} ta xodim</span>
            <button className="btn-add" onClick={() => setCreating(true)}>
              <Plus size={16} /> Qo'shish
            </button>
          </div>
        </div>

        {loading && <div className="empty">Yuklanmoqda...</div>}
        {error && <div className="error-box">Xatolik: {error}</div>}
        {!loading && !error && (
          <DataTable
            columns={columns}
            rows={rows}
            renderExtraActions={(row) => (
              <button className="btn-mini" disabled={toggling === row.id} onClick={() => toggleStatus(row)}>
                {row.status ? 'Nofaol qilish' : 'Faol qilish'}
              </button>
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

      {creating && (
        <CreateModal
          url={LAB_STAFF_CREATE}
          fields={labStaffCreateFields}
          title="Labarant qo'shish"
          client={labClient}
          onClose={() => setCreating(false)}
          onSaved={reload}
        />
      )}
    </div>
  )
}
