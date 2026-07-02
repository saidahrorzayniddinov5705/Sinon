import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import useFetch, { extractList } from '../../api/useFetch'
import labClient from '../../api/labClient'
import { patchItem } from '../../api/crud'
import { LAB_STAFF_LIST, labOrderAssignStaff } from '../../config/labConfig'

// Buyurtmani laborantga (o'z xodimiga) biriktiradi.
export default function LabAssignStaffModal({ orderId, onClose, onSaved }) {
  const { data, loading, error } = useFetch(LAB_STAFF_LIST, { page_size: 200 }, labClient)
  const { rows: staffList } = extractList(data)

  const [staffId, setStaffId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveErr('')
    if (!staffId) {
      setSaveErr('Labarantni tanlang')
      return
    }
    setSaving(true)
    try {
      await patchItem(labOrderAssignStaff(orderId), { staff_id: Number(staffId) }, labClient)
      onSaved?.()
      onClose()
    } catch (err) {
      const d = err.response?.data
      setSaveErr(typeof d === 'string' ? d : d?.message || (d ? JSON.stringify(d) : err.message || 'Saqlashda xatolik'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Buyurtma #{orderId} — labarantga biriktirish</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading && <div className="empty">Yuklanmoqda...</div>}
          {error && <div className="error-box">Xatolik: {error}</div>}

          {!loading && !error && (
            <form className="edit-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Labarant <span className="req"> *</span></label>
                <select value={staffId} onChange={(e) => setStaffId(e.target.value)} required>
                  <option value="">— tanlang —</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.full_name} ({s.contact})</option>
                  ))}
                </select>
              </div>

              {saveErr && <div className="login-error">{saveErr}</div>}

              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary slim" disabled={saving}>
                  {saving ? 'Saqlanmoqda...' : 'Biriktirish'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
