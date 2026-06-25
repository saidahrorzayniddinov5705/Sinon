import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, RotateCw } from 'lucide-react'
import { findSection, detailMap, getDeleteTemplate } from '../config/sections'
import { getEditConfig } from '../config/editForms'
import { deleteItem } from '../api/crud'
import useFetch, { unwrapData } from '../api/useFetch'
import { FieldList } from '../components/DetailModal'
import EditModal from '../components/EditModal'
import ConfirmModal from '../components/ConfirmModal'

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

  const [edit, setEdit] = useState(false)
  const [del, setDel] = useState(false)

  if (!section || !detailEndpoint) {
    return <div className="empty">Yozuv topilmadi</div>
  }

  const editConfig = getEditConfig(ep)
  const deleteTemplate = getDeleteTemplate(ep)

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
        </div>
      </div>

      <div className="card">
        {loading && <div className="empty">Yuklanmoqda...</div>}
        {error && <div className="error-box">Xatolik: {error}</div>}
        {!loading && !error && data && <FieldList obj={unwrapData(data)} />}
      </div>

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
    </div>
  )
}
