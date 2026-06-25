import { useState, useEffect, useCallback } from 'react'
import client from './client'

// Xato xabarini backend formatidan ajratib oladi
function extractError(e) {
  const d = e.response?.data
  const msg =
    d?.message || // Sinon envelope: { success:false, message }
    d?.detail || // DRF standart
    (typeof d === 'string' ? d : null) ||
    e.response?.statusText ||
    e.message ||
    "Noma'lum xatolik"
  const text = typeof msg === 'string' ? msg : JSON.stringify(msg)
  return `${e.response?.status || ''} ${text}`.trim()
}

// Berilgan endpointdan GET qiladi. Eski/keraksiz javoblarni e'tiborsiz qoldiradi
// (race condition) va komponent yopilgach setState chaqirmaydi.
export default function useFetch(endpoint, params) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  const paramKey = JSON.stringify(params || {})

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)

    client
      .get(endpoint, { params })
      .then((res) => {
        if (!ignore) setData(res.data)
      })
      .catch((e) => {
        if (ignore) return
        setError(extractError(e))
        setData(null)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, paramKey, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])

  return { data, loading, error, reload }
}

// Backend javob konvertini ochadi: { success, message, data } -> data.
// Ba'zi endpointlar IKKI QAVAT envelope qaytaradi
// ({success, data:{success, message, data:[...]}}), shuning uchun ichma-ich ochamiz.
export function unwrapData(raw) {
  let cur = raw
  while (
    cur &&
    typeof cur === 'object' &&
    !Array.isArray(cur) &&
    'data' in cur &&
    ('success' in cur || 'message' in cur || 'code' in cur)
  ) {
    cur = cur.data
  }
  return cur
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
