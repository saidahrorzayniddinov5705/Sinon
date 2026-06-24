import { useState, useEffect, useCallback } from 'react'
import client from './client'

// Berilgan endpointdan GET qiladi. Paginated (results) yoki oddiy massiv/obyektni qaytaradi.
export default function useFetch(endpoint, params) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const paramKey = JSON.stringify(params || {})

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await client.get(endpoint, { params })
      setData(res.data)
    } catch (e) {
      const msg =
        e.response?.data?.detail ||
        e.response?.statusText ||
        e.message ||
        "Noma'lum xatolik"
      setError(`${e.response?.status || ''} ${msg}`.trim())
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, paramKey])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: load }
}

// Backend javob konvertini ochadi: { success, message, data } -> data
export function unwrapData(raw) {
  if (
    raw &&
    typeof raw === 'object' &&
    !Array.isArray(raw) &&
    'data' in raw &&
    ('success' in raw || 'message' in raw || 'code' in raw)
  ) {
    return raw.data
  }
  return raw
}

// Javobdan ro'yxat (rows) va umumiy sonni ajratib oladi.
// Bir nechta formatlarni qo'llab-quvvatlaydi:
//  - { success, message, data: [...] }            (Sinon API)
//  - { success, message, data: { count, results } }
//  - { count, next, previous, results }           (DRF standart)
//  - [...]                                         (oddiy massiv)
export function extractList(raw) {
  if (!raw) return { rows: [], count: 0, totalKnown: false }

  const payload = unwrapData(raw)

  // count'ni mumkin bo'lgan joylardan qidiramiz
  const rawCount =
    (raw && (raw.count ?? raw.total)) ??
    (payload && !Array.isArray(payload) && (payload.count ?? payload.total))

  let rows = []
  if (Array.isArray(payload)) {
    rows = payload
  } else if (payload && Array.isArray(payload.results)) {
    rows = payload.results
  } else if (payload && typeof payload === 'object') {
    rows = [payload]
  }

  const totalKnown = typeof rawCount === 'number'
  return { rows, count: totalKnown ? rawCount : rows.length, totalKnown }
}
