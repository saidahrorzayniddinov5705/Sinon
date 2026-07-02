import { useState } from 'react'
import { Plus, RotateCw } from 'lucide-react'
import useFetch, { extractList } from '../../api/useFetch'
import labClient from '../../api/labClient'
import DataTable from '../../components/DataTable'
import LabServiceChoiceModal from '../../components/lab/LabServiceChoiceModal'
import LabServiceEditModal from '../../components/lab/LabServiceEditModal'
import { LAB_SERVICE_CHOICE_LIST } from '../../config/labConfig'

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'service_name', label: 'Xizmat' },
  { key: 'service_description', label: 'Tavsif' },
  { key: 'price', label: 'Narxingiz', type: 'money' },
]

export default function LabServices() {
  const { data, loading, error, reload } = useFetch(LAB_SERVICE_CHOICE_LIST, undefined, labClient)
  const { rows } = extractList(data)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Servislar</h1>
          <p className="breadcrumb">Laboratoriya kabineti / Servislar</p>
        </div>
        <button className="btn-ghost" onClick={reload}>
          <RotateCw size={16} /> Yangilash
        </button>
      </div>

      <div className="card">
        <div className="card-toolbar">
          <div className="toolbar-right" style={{ marginLeft: 'auto' }}>
            <span className="count-pill">{rows.length} ta xizmat</span>
            <button className="btn-add" onClick={() => setAdding(true)}>
              <Plus size={16} /> Xizmat qo'shish
            </button>
          </div>
        </div>

        {loading && <div className="empty">Yuklanmoqda...</div>}
        {error && <div className="error-box">Xatolik: {error}</div>}
        {!loading && !error && (
          <DataTable columns={columns} rows={rows} onEdit={(row) => setEditingId(row.id)} />
        )}
      </div>

      {adding && <LabServiceChoiceModal onClose={() => setAdding(false)} onSaved={reload} />}
      {editingId && (
        <LabServiceEditModal serviceId={editingId} onClose={() => setEditingId(null)} onSaved={reload} />
      )}
    </div>
  )
}
