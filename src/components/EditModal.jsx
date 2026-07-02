import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import useFetch, { unwrapData } from '../api/useFetch'
import { patchItem } from '../api/crud'
import MapPicker from './MapPicker'

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
  if (field.type === 'file' || field.type === 'files') return null // fayllarni oldindan to'ldirib bo'lmaydi
  const v = raw?.[field.name]
  if (field.type === 'bool') return !!v
  if (field.type === 'datetime') return toLocalInput(v)
  if (field.type === 'date') return v ? String(v).slice(0, 10) : ''
  if (v === null || v === undefined) return ''
  if (typeof v === 'object') return '' // FK obyekt bo'lsa bo'sh
  return v
}

// Maydon qiymatini API uchun konvertatsiya qiladi
function convertVal(f, val) {
  if (f.type === 'bool') return !!val
  if (f.type === 'number') return val === '' || val == null ? null : Number(val)
  if (f.type === 'decimal') return val === '' || val == null ? null : String(val)
  if (f.type === 'datetime') {
    if (val === '' || val == null) return null
    const d = new Date(val)
    return isNaN(d) ? val : d.toISOString()
  }
  return val // text / select / date / textarea
}

export default function EditModal({ endpoint, targets, title, onClose, onSaved, client }) {
  const { data, loading, error } = useFetch(endpoint, undefined, client)
  const [form, setForm] = useState(null)
  const [initial, setInitial] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')

  // Barcha nishonlardagi maydonlarni bitta ro'yxatga yig'amiz
  const allFields = useMemo(() => targets.flatMap((t) => t.fields), [targets])

  // Detail kelganda formani to'ldiramiz (envelope ochiladi)
  useEffect(() => {
    if (data && !form) {
      const obj = unwrapData(data)
      const init = {}
      allFields.forEach((f) => {
        if (f.type === 'latlng') {
          init[f.latName] = obj?.[f.latName] ?? ''
          init[f.lngName] = obj?.[f.lngName] ?? ''
          return
        }
        init[f.name] = initValue(f, obj)
      })
      setForm(init)
      setInitial(init)
    }
  }, [data, allFields, form])

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }))

  // Bitta nishon uchun yuboriladigan ma'lumotni quradi (faqat o'zgargan + tanlangan fayllar)
  function buildPayload(target) {
    const changed = {}
    const fileEntries = []
    target.fields.forEach((f) => {
      if (f.type === 'latlng') {
        if (form[f.latName] !== initial[f.latName]) changed[f.latName] = form[f.latName]
        if (form[f.lngName] !== initial[f.lngName]) changed[f.lngName] = form[f.lngName]
        return
      }
      const val = form[f.name]
      if (f.type === 'file') {
        if (val instanceof File) fileEntries.push([f.name, [val]])
        return
      }
      if (f.type === 'files') {
        if (val && val.length) fileEntries.push([f.name, Array.from(val)])
        return
      }
      if (val === initial[f.name]) return // o'zgarmagan
      changed[f.name] = convertVal(f, val)
    })

    if (!Object.keys(changed).length && !fileEntries.length) return null

    if (fileEntries.length) {
      // Fayl bor — multipart/form-data
      const fd = new FormData()
      Object.entries(changed).forEach(([k, v]) => {
        if (v === null) fd.append(k, '')
        else if (typeof v === 'boolean') fd.append(k, String(v))
        else fd.append(k, v)
      })
      fileEntries.forEach(([k, files]) => files.forEach((file) => fd.append(k, file)))
      return fd
    }
    return changed // oddiy JSON
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveErr('')

    const jobs = targets
      .map((t) => ({ patch: t.patch, payload: buildPayload(t) }))
      .filter((j) => j.payload !== null)

    if (!jobs.length) {
      setSaveErr("Hech qanday o'zgartirish kiritilmadi")
      return
    }

    setSaving(true)
    try {
      for (const job of jobs) {
        await patchItem(job.patch, job.payload, client)
      }
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
              <p className="form-note">Faqat o'zgartirgan maydonlaringiz saqlanadi.</p>
              {allFields.map((f) => (
                <div className="form-field" key={f.name || f.latName}>
                  <label>
                    {f.label}
                    {f.required && <span className="req"> *</span>}
                  </label>

                  {f.type === 'latlng' ? (
                    <MapPicker
                      latitude={form[f.latName]}
                      longitude={form[f.lngName]}
                      onChange={({ lat, lng }) => {
                        setField(f.latName, lat)
                        setField(f.lngName, lng)
                      }}
                    />
                  ) : f.type === 'bool' ? (
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
                    />
                  ) : f.type === 'files' ? (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setField(f.name, e.target.files)}
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
