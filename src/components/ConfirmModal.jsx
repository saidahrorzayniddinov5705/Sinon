import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

// O'chirishni tasdiqlash oynasi. onConfirm async funksiya bo'lishi mumkin.
export default function ConfirmModal({ title, message, confirmText = "O'chirish", onConfirm, onClose }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const handle = async () => {
    setBusy(true)
    setErr('')
    try {
      await onConfirm()
      onClose()
    } catch (e) {
      const d = e.response?.data
      setErr(
        typeof d === 'string'
          ? d
          : d?.message || (d ? JSON.stringify(d) : e.message || 'Xatolik')
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={busy ? undefined : onClose}>
      <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <AlertTriangle size={28} />
        </div>
        <h3>{title || "O'chirishni tasdiqlang"}</h3>
        <p className="confirm-msg">{message || "Bu yozuvni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi."}</p>

        {err && <div className="error-box">{err}</div>}

        <div className="form-actions center">
          <button className="btn-ghost" onClick={onClose} disabled={busy}>
            Bekor qilish
          </button>
          <button className="btn-danger" onClick={handle} disabled={busy}>
            {busy ? "O'chirilmoqda..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
