import client from './client'

// PUT — yozuvni to'liq yangilash (hamma maydon)
export function updateItem(endpoint, data) {
  return client.put(endpoint, data)
}

// PATCH — qisman yangilash (faqat o'zgargan maydonlar).
// FormData bo'lsa (fayl yuklash) — multipart sifatida yuboradi.
export function patchItem(endpoint, data) {
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData
  return client.patch(endpoint, data, isForm ? { headers: { 'Content-Type': undefined } } : undefined)
}

// DELETE — yozuvni o'chirish
export function deleteItem(endpoint) {
  return client.delete(endpoint)
}

// POST — yangi yozuv yaratish. FormData bo'lsa (fayl) — multipart.
export function createItem(endpoint, data) {
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData
  return client.post(endpoint, data, isForm ? { headers: { 'Content-Type': undefined } } : undefined)
}
