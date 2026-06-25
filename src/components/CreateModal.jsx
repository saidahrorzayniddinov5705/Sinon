import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createItem } from '../api/crud'

// datetime-local -> ISO
function toISO(val) {
  if (val === '' || val == null) return null
  const d = new Date(val)
  return isNaN(d) ? val : d.toISOString()
}

function convertVal(f, val) {
  if (f.type === 'bool') return !!val
  if (f.type === 'number') return val === '' || val == null ? null : Number(val)
  if (f.type === 'decimal') return val === '' || val == null ? null : String(val)
  if (f.type === 'datetime') return toISO(val)
  return val
}

export default function CreateModal({ url, fields, title, onClose, onSaved }) {
  const [form, setForm] = useState(() => {
    const init = {}
    fields.forEach((f) => {
      init[f.name] = f.type === 'bool' ? false : f.type === 'file' || f.type === 'files' ? null : ''
    })
    return init
  })
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  const hasFiles = fields.some((f) => f.type === 'file' || f.type === 'files')

  const buildPayload = () => {
    if (hasFiles) {
      const fd = new FormData()
      fields.forEach((f) => {
        const val = form[f.name]
        if (f.type === 'file') {
          if (val instanceof File) fd.append(f.name, val)
          return
        }
        if (f.type === 'files') {
          if (val && val.length) Array.from(val).forEach((file) => fd.append(f.name, file))
          return
        }
        if (f.type === 'bool') {
          fd.append(f.name, String(!!val))
          return
        }
        if (val === '' || val == null) return
        fd.append(f.name, val)
      })
      return fd
    }
    // JSON
    const payload = {}
    fields.forEach((f) => {
      const val = form[f.name]
      if (f.type === 'bool') {
        payload[f.name] = !!val
        return
      }
      if (val === '' || val == null) {
        if (f.required) payload[f.name] = convertVal(f, val)
        return
      }
      payload[f.name] = convertVal(f, val)
    })
    return payload
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveErr('')
    setSaving(true)
    try {
      await createItem(url, buildPayload())
      onSaved?.()
      onClose()
    } catch (err) {
      const d = err.response?.data
      setSaveErr(
        typeof d === 'string'
          ? d
          : d?.message || (d ? JSON.stringify(d) : err.message || 'Saqlashda xatolik')
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title || 'Yangi yozuv'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form className="edit-form" onSubmit={handleSubmit}>
            <p className="form-note">Yangi yozuv qo'shilmoqda. (*) — majburiy maydon.</p>
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
                ) : f.type === 'file' ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setField(f.name, e.target.files[0] || null)}
                    required={f.required}
                  />
                ) : f.type === 'files' ? (
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setField(f.name, e.target.files)}
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
                {saving ? "Qo'shilmoqda..." : "Qo'shish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
