import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, RotateCw, Ban, ShieldCheck } from 'lucide-react'
import { findSection, detailMap, getDeleteTemplate, getBlockTemplate, getOrderHistoryConfig } from '../config/sections'
import { getEditConfig } from '../config/editForms'
import { deleteItem, patchItem } from '../api/crud'
import useFetch, { unwrapData, extractList } from '../api/useFetch'
import { FieldList } from '../components/DetailModal'
import EditModal from '../components/EditModal'
import ConfirmModal from '../components/ConfirmModal'
import DataTable from '../components/DataTable'

const historyColumns = [
  { key: 'order_id', label: 'Buyurtma №' },
  { key: 'patient_name', label: 'Bemor' },
  { key: 'doctor_name', label: 'Shifokor' },
  { key: 'address', label: 'Manzil' },
  { key: 'payment_type', label: "To'lov", type: 'badge' },
  { key: 'summa', label: 'Summa', type: 'money' },
  { key: 'status', label: 'Holat', type: 'badge' },
  { key: 'planned_at', label: 'Rejalashtirilgan', type: 'date' },
  { key: 'created_at', label: 'Yaratilgan', type: 'date' },
]

export default function DetailPage() {
  const { key, id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const section = findSection(key)
  // Qaysi view (tab) ekanini ?ep= dan olamiz, bo'lmasa birinchisi
  const ep = searchParams.get('ep') || section?.views[0]?.endpoint
  const view = section?.views.find((v) => v.endpoint === ep) || section?.views[0]

  const detailTemplate = ep ? detailMap[ep] : null
  const detailEndpoint = detailTemplate ? detailTemplate.replace('{id}', id) : null

  const { data, loading, error, reload } = useFetch(detailEndpoint)

  const orderHistoryConfig = ep ? getOrderHistoryConfig(ep) : null
  const historyEndpoint = orderHistoryConfig ? orderHistoryConfig.template.replace('{id}', id) : null
  const { data: historyData, loading: historyLoading, error: historyError } = useFetch(historyEndpoint)

  const [edit, setEdit] = useState(false)
  const [del, setDel] = useState(false)
  const [blockAction, setBlockAction] = useState(null) // null | 'block' | 'unblock'

  if (!section || !detailEndpoint) {
    return <div className="empty">Yozuv topilmadi</div>
  }

  const editConfig = getEditConfig(ep)
  const deleteTemplate = getDeleteTemplate(ep)
  const blockTemplate = ep ? getBlockTemplate(ep) : null
  const userId = unwrapData(data)?.user?.id
  const { rows: historyRows } = extractList(historyData)

  const editTargets =
    editConfig &&
    editConfig.targets.map((t) => ({
      patch: (t.patch || detailTemplate).replace('{id}', id),
      fields: t.fields,
    }))

  const backToList = () => navigate(`/section/${key}`)

  return (
    <div className="page">
      <div className="page-head">
        <div className="detail-head-left">
          <button className="icon-btn" onClick={backToList} title="Orqaga">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{view?.label || section.title} #{id}</h1>
            <p className="breadcrumb">Super Admin / {section.title} / #{id}</p>
          </div>
        </div>

        {/* Tepa o'ng burchak — tahrirlash / o'chirish */}
        <div className="corner-actions">
          <button className="btn-ghost" onClick={reload} title="Yangilash">
            <RotateCw size={16} />
          </button>
          {editConfig && (
            <button className="btn-edit-lg" onClick={() => setEdit(true)}>
              <Pencil size={16} /> Tahrirlash
            </button>
          )}
          {deleteTemplate && (
            <button className="btn-danger" onClick={() => setDel(true)}>
              <Trash2 size={16} /> O'chirish
            </button>
          )}
          {blockTemplate && userId && (
            <>
              <button className="btn-danger" onClick={() => setBlockAction('block')}>
                <Ban size={16} /> Bloklash
              </button>
              <button className="btn-edit-lg" onClick={() => setBlockAction('unblock')}>
                <ShieldCheck size={16} /> Blokdan chiqarish
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card">
        {loading && <div className="empty">Yuklanmoqda...</div>}
        {error && <div className="error-box">Xatolik: {error}</div>}
        {!loading && !error && data && <FieldList obj={unwrapData(data)} />}
      </div>

      {orderHistoryConfig && (
        <div className="card">
          <div className="card-head">
            <h3>{orderHistoryConfig.label}</h3>
          </div>
          {historyLoading && <div className="empty">Yuklanmoqda...</div>}
          {historyError && <div className="error-box">Xatolik: {historyError}</div>}
          {!historyLoading && !historyError && <DataTable columns={historyColumns} rows={historyRows} />}
        </div>
      )}

      {edit && editTargets && (
        <EditModal
          endpoint={detailEndpoint}
          targets={editTargets}
          title={`${view?.label || section.title} — tahrirlash #${id}`}
          onClose={() => setEdit(false)}
          onSaved={reload}
        />
      )}

      {del && (
        <ConfirmModal
          title={`#${id} — o'chirish`}
          message="Bu yozuvni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi."
          onConfirm={async () => {
            await deleteItem(deleteTemplate.replace('{id}', id))
          }}
          onClose={() => setDel(false)}
          onDone={backToList}
        />
      )}

      {blockAction && (
        <ConfirmModal
          title={blockAction === 'block' ? 'Foydalanuvchini bloklash' : 'Blokdan chiqarish'}
          message={
            blockAction === 'block'
              ? 'Bu foydalanuvchi tizimga kira olmay qoladi. Davom etasizmi?'
              : "Bu foydalanuvchi qaytadan tizimga kira oladi. Davom etasizmi?"
          }
          confirmText={blockAction === 'block' ? 'Bloklash' : 'Blokdan chiqarish'}
          onConfirm={async () => {
            await patchItem(blockTemplate.replace('{user_id}', userId), { block: blockAction === 'block' })
          }}
          onClose={() => setBlockAction(null)}
          onDone={() => {
            setBlockAction(null)
            reload()
          }}
        />
      )}
    </div>
  )
}
