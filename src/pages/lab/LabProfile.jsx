import { useState } from 'react'
import { Pencil, RotateCw } from 'lucide-react'
import useFetch, { unwrapData } from '../../api/useFetch'
import labClient from '../../api/labClient'
import { FieldList } from '../../components/DetailModal'
import EditModal from '../../components/EditModal'
import { LAB_PROFILE_GET, LAB_PROFILE_UPDATE, labProfileFields } from '../../config/labConfig'

export default function LabProfile() {
  const { data, loading, error, reload } = useFetch(LAB_PROFILE_GET, undefined, labClient)
  const [edit, setEdit] = useState(false)

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Profil / joylashuv</h1>
          <p className="breadcrumb">Laboratoriya kabineti / Profil</p>
        </div>
        <div className="corner-actions">
          <button className="btn-ghost" onClick={reload} title="Yangilash">
            <RotateCw size={16} />
          </button>
          <button className="btn-edit-lg" onClick={() => setEdit(true)}>
            <Pencil size={16} /> Tahrirlash
          </button>
        </div>
      </div>

      <div className="card">
        {loading && <div className="empty">Yuklanmoqda...</div>}
        {error && <div className="error-box">Xatolik: {error}</div>}
        {!loading && !error && data && <FieldList obj={unwrapData(data)} />}
      </div>

      {edit && (
        <EditModal
          endpoint={LAB_PROFILE_GET}
          targets={[{ patch: LAB_PROFILE_UPDATE, fields: labProfileFields }]}
          title="Profil — tahrirlash"
          client={labClient}
          onClose={() => setEdit(false)}
          onSaved={reload}
        />
      )}
    </div>
  )
}
