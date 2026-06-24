import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import useFetch, { unwrapData } from '../api/useFetch'
import { patchItem } from '../api/crud'

// datetime-local input uchun ISO sanani qisqartiradi
function toLocalInput(v) {
  if (!v) return ''
  const d = new Date(v)
  if (isNaN(d)) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// Maydon qiymatini forma uchun tayyorlaydi
function initValue(field, raw) {
  const v = raw?.[field.name]
  if (field.type === 'bool') return !!v
  if (field.type === 'datetime') return toLocalInput(v)
  if (field.type === 'date') return v ? String(v).slice(0, 10) : ''
  if (v === null || v === undefined) return ''
  if (typeof v === 'object') return '' // FK obyekt bo'lsa bo'sh
  return v
}

export default function EditModal({ endpoint, patchEndpoint, fields, title, onClose, onSaved }) {
  const { data, loading, error } = useFetch(endpoint)
  const [form, setForm] = useState(null)
  const [initial, setInitial] = useState(null) // boshlang'ich qiymatlar (o'zgarishni aniqlash uchun)
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  // Detail kelganda formani to'ldiramiz (envelope ochiladi)
  useEffect(() => {
    if (data && !form) {
      const obj = unwrapData(data)
      const init = {}
      fields.forEach((f) => (init[f.name] = initValue(f, obj)))
      setForm(init)
      setInitial(init)
    }
  }, [data, fields, form])

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveErr('')

    // PATCH — faqat O'ZGARGAN maydonlarni yuboramiz
    const payload = {}
    fields.forEach((f) => {
      const val = form[f.name]
      if (val === initial[f.name]) return // o'zgarmagan — yubormaymiz

      if (f.type === 'bool') {
        payload[f.name] = !!val
        return
      }
      if (f.type === 'number' || f.type === 'decimal') {
        if (val === '' || val == null) {
          payload[f.name] = null // tozalandi
        } else {
          payload[f.name] = f.type === 'number' ? Number(val) : String(val)
        }
        return
      }
      if (f.type === 'datetime') {
        if (val === '' || val == null) {
          payload[f.name] = null
        } else {
          const d = new Date(val)
          payload[f.name] = isNaN(d) ? val : d.toISOString()
        }
        return
      }
      payload[f.name] = val
    })

    if (Object.keys(payload).length === 0) {
      setSaveErr("Hech qanday o'zgartirish kiritilmadi")
      return
    }

    setSaving(true)
    try {
      await patchItem(patchEndpoint || endpoint, payload)
      onSaved?.()
      onClose()
    } catch (err) {
      const d = err.response?.data
      setSaveErr(
        typeof d === 'string'
          ? d
          : d
          ? JSON.stringify(d)
          : err.message || 'Saqlashda xatolik'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title || 'Tahrirlash'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading && <div className="empty">Yuklanmoqda...</div>}
          {error && <div className="error-box">Xatolik: {error}</div>}

          {!loading && !error && form && (
            <form className="edit-form" onSubmit={handleSubmit}>
              <p className="form-note">Faqat o'zgartirilgan maydonlar saqlanadi (PATCH).</p>
              {fields.map((f) => (
                <div className="form-field" key={f.name}>
                  <label>
                    {f.label}
                    {f.required && <span className="req"> *</span>}
                  </label>

                  {f.type === 'bool' ? (
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!!form[f.name]}
                        onChange={(e) => setField(f.name, e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  ) : f.type === 'select' ? (
                    <select
                      value={form[f.name] ?? ''}
                      onChange={(e) => setField(f.name, e.target.value)}
                      required={f.required}
                    >
                      <option value="">— tanlang —</option>
                      {f.options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={form[f.name] ?? ''}
                      onChange={(e) => setField(f.name, e.target.value)}
                      required={f.required}
                    />
                  ) : (
                    <input
                      type={
                        f.type === 'number' || f.type === 'decimal'
                          ? 'number'
                          : f.type === 'date'
                          ? 'date'
                          : f.type === 'datetime'
                          ? 'datetime-local'
                          : 'text'
                      }
                      step={f.type === 'decimal' ? 'any' : undefined}
                      value={form[f.name] ?? ''}
                      onChange={(e) => setField(f.name, e.target.value)}
                      required={f.required}
                    />
                  )}
                </div>
              ))}

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
