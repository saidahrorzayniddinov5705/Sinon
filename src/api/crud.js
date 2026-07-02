import defaultClient from './client'

// Faqat multipart/form-data qabul qiladigan endpointlar (Swagger schema'dan).
// Bularga JSON yuborilsa "Unsupported media type" xatosi chiqadi.
const MULTIPART_PATTERNS = [
  /\/users\/detail\/\d+\/update\/$/,
  /\/users\/create\/$/,
  /\/doctor-application\/detail\/\d+\/update\/$/,
  /\/doctor-application\/create\/$/,
  /\/home\/banner\/(\d+\/)?$/,
  /\/home\/contact-us\/(\d+\/)?$/,
  /\/home\/service\/(\d+\/)?$/,
  /\/home\/social-network\/(\d+\/)?$/,
  /\/my-laboratory\/update\/$/,
]

function needsMultipart(url) {
  return MULTIPART_PATTERNS.some((re) => re.test(url))
}

// Oddiy obyektni FormData'ga aylantiradi (bool -> 'true'/'false')
function toFormData(obj) {
  const fd = new FormData()
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v === null || v === undefined) return
    if (typeof v === 'boolean') fd.append(k, String(v))
    else fd.append(k, v)
  })
  return fd
}

// So'rov tanasini tayyorlaydi: multipart kerak bo'lsa FormData, aks holda JSON
function prepare(endpoint, data) {
  const isForm = typeof FormData !== 'undefined' && data instanceof FormData
  if (isForm) return { body: data, config: { headers: { 'Content-Type': undefined } } }
  if (needsMultipart(endpoint)) {
    return { body: toFormData(data), config: { headers: { 'Content-Type': undefined } } }
  }
  return { body: data, config: undefined }
}

// PUT — to'liq yangilash
export function updateItem(endpoint, data, client = defaultClient) {
  const { body, config } = prepare(endpoint, data)
  return client.put(endpoint, body, config)
}

// PATCH — qisman yangilash (faqat o'zgargan maydonlar)
export function patchItem(endpoint, data, client = defaultClient) {
  const { body, config } = prepare(endpoint, data)
  return client.patch(endpoint, body, config)
}

// DELETE — yozuvni o'chirish
export function deleteItem(endpoint, client = defaultClient) {
  return client.delete(endpoint)
}

// POST — yangi yozuv yaratish
export function createItem(endpoint, data, client = defaultClient) {
  const { body, config } = prepare(endpoint, data)
  return client.post(endpoint, body, config)
}
