import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import useFetch, { unwrapData } from '../../api/useFetch'
import labClient from '../../api/labClient'
import { patchItem } from '../../api/crud'
import { labServiceDetail, labServiceUpdate } from '../../config/labConfig'

// Tanlangan xizmatning narxi va faol/nofaol holatini tahrirlaydi.
export default function LabServiceEditModal({ serviceId, onClose, onSaved }) {
  const { data, loading, error } = useFetch(labServiceDetail(serviceId), undefined, labClient)
  const detail = unwrapData(data)

  const [price, setPrice] = useState('')
  const [status, setStatus] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  useEffect(() => {
    if (detail) {
      setPrice(detail.price ?? '')
      setStatus(!!detail.status)
    }
  }, [detail])

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveErr('')
    setSaving(true)
    try {
      await patchItem(labServiceUpdate(serviceId), { price: Number(price), status }, labClient)
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
          <h3>Xizmatni tahrirlash</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading && <div className="empty">Yuklanmoqda...</div>}
          {error && <div className="error-box">Xatolik: {error}</div>}

          {!loading && !error && detail && (
            <form className="edit-form" onSubmit={handleSubmit}>
              <p className="form-note">
                {detail.service_name} — ruxsat etilgan narx oralig'i:{' '}
                {Number(detail.min_price).toLocaleString('uz-UZ')} — {Number(detail.max_price).toLocaleString('uz-UZ')} so'm
              </p>

              <div className="form-field">
                <label>Narx (summa) <span className="req"> *</span></label>
                <input
                  type="number"
                  step="any"
                  min={detail.min_price}
                  max={detail.max_price}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Faol</label>
                <label className="switch">
                  <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
                  <span className="slider" />
                </label>
              </div>

              {saveErr && <div className="login-error">{saveErr}</div>}

              <div className="form-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary slim" disabled={saving}>
                  {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
