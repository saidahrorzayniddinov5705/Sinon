import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import useFetch, { extractList } from '../../api/useFetch'
import labClient from '../../api/labClient'
import { createItem } from '../../api/crud'
import { LAB_SERVICE_CATALOG, LAB_SERVICE_CHOICE_CREATE } from '../../config/labConfig'

// Umumiy katalogdagi xizmatni tanlab, o'z narxini belgilaydi.
export default function LabServiceChoiceModal({ onClose, onSaved }) {
  const { data, loading, error } = useFetch(LAB_SERVICE_CATALOG, { page_size: 200 }, labClient)
  const { rows: catalog } = extractList(data)

  const [serviceId, setServiceId] = useState('')
  const [summa, setSumma] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const selected = catalog.find((s) => String(s.id) === String(serviceId))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveErr('')
    if (!serviceId || summa === '') {
      setSaveErr('Xizmat va summani tanlang')
      return
    }
    setSaving(true)
    try {
      await createItem(
        LAB_SERVICE_CHOICE_CREATE,
        { laboratory_service_id: Number(serviceId), summa: Number(summa) },
        labClient
      )
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
          <h3>Xizmat qo'shish</h3>
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
                <label>Xizmat <span className="req"> *</span></label>
                <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} required>
                  <option value="">— tanlang —</option>
                  {catalog.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({Number(s.min_price).toLocaleString('uz-UZ')}–{Number(s.max_price).toLocaleString('uz-UZ')} so'm)
                    </option>
                  ))}
                </select>
              </div>

              {selected && (
                <p className="form-note">
                  Narx oralig'i: {Number(selected.min_price).toLocaleString('uz-UZ')} — {Number(selected.max_price).toLocaleString('uz-UZ')} so'm
                </p>
              )}

              <div className="form-field">
                <label>Sizning narxingiz (summa) <span className="req"> *</span></label>
                <input
                  type="number"
                  step="any"
                  value={summa}
                  onChange={(e) => setSumma(e.target.value)}
                  required
                />
              </div>

              {saveErr && <div className="login-error">{saveErr}</div>}

              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary slim" disabled={saving}>
                  {saving ? "Qo'shilmoqda..." : "Qo'shish"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
