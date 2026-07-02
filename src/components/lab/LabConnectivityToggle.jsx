import { useState } from 'react'
import { Circle } from 'lucide-react'
import useFetch, { unwrapData } from '../../api/useFetch'
import labClient from '../../api/labClient'
import { patchItem } from '../../api/crud'
import { CONNECTIVITY_MAIN, CONNECTIVITY_CHANGE } from '../../config/labConfig'

// Xodimning online/offline holatini ko'rsatadi va bosilganda almashtiradi.
export default function LabConnectivityToggle() {
  const { data, reload } = useFetch(CONNECTIVITY_MAIN, undefined, labClient)
  const [saving, setSaving] = useState(false)

  const status = unwrapData(data)?.status
  const isOnline = status === 'online'

  const toggle = async () => {
    setSaving(true)
    try {
      await patchItem(CONNECTIVITY_CHANGE, { status: isOnline ? 'offline' : 'online' }, labClient)
      reload()
    } catch {
      // Jim o'tkazamiz — status keyingi "Yangilash"da o'zi to'g'rilanadi
    } finally {
      setSaving(false)
    }
  }

  if (!status) return null

  return (
    <button className="btn-ghost slim connectivity-toggle" onClick={toggle} disabled={saving}>
      <Circle size={10} fill={isOnline ? '#22c55e' : '#94a3b8'} stroke="none" />
      {isOnline ? 'Online' : 'Offline'}
    </button>
  )
}
