import labClient from './labClient'

// Backend har xil shaklda token qaytarishi mumkin — jumladan
// {data: {token: {access, refresh}}} (Laboratory Staff login/change-role shu ko'rinishda).
function extractTokens(data) {
  const payload = data?.data ?? data
  const tokenObj = payload?.token

  const access =
    (tokenObj && typeof tokenObj === 'object' && tokenObj.access) ||
    (typeof tokenObj === 'string' ? tokenObj : null) ||
    payload?.access ||
    payload?.access_token ||
    payload?.tokens?.access ||
    null

  const refresh =
    (tokenObj && typeof tokenObj === 'object' && tokenObj.refresh) ||
    payload?.refresh ||
    payload?.refresh_token ||
    payload?.tokens?.refresh ||
    null

  return { access, refresh }
}

function saveTokens({ access, refresh }) {
  localStorage.setItem('lab_access_token', access)
  if (refresh) localStorage.setItem('lab_refresh_token', refresh)
}

// Token ichida "role" bo'sh (null) bo'lishi mumkin — ba'zi endpointlar
// (masalan buyurtmalar ro'yxati) buni talab qiladi. Shuning uchun login'dan
// so'ng "Laboratory" rolini tanlab, rol yozilgan yangi tokenni saqlaymiz.
async function ensureLaboratoryRole() {
  try {
    const { data } = await labClient.post('/api/v1/staff/auth/change-role/', {
      role: 'Laboratory',
    })
    const tokens = extractTokens(data)
    if (tokens.access) saveTokens(tokens)
  } catch {
    // Rol allaqachon tanlangan yoki endpoint mavjud bo'lmasa — jim o'tkazamiz,
    // asosiy token baribir ishlaydi (faqat rol talab qiladigan joylar ishlamasligi mumkin).
  }
}

// Kontakt+parol yuboriladi. Ba'zi hisoblarda backend tokenni shu yerning o'zida
// qaytaradi (SMS shart emas), ba'zilarida esa avval tasdiqlash kodi yuboradi —
// shuning uchun javobni tekshirib, token bo'lsa darhol login qilamiz.
export async function sendLoginCode(contact, password) {
  const { data } = await labClient.post('/api/v1/staff/auth/login/', {
    contact,
    password,
    fcm_token: 'web-admin-panel',
    device_type: 'android',
  })

  const tokens = extractTokens(data)
  if (tokens.access) {
    saveTokens(tokens)
    await ensureLaboratoryRole()
    return { loggedIn: true, data }
  }
  return { loggedIn: false, data }
}

// 2-bosqich (faqat SMS kod so'ralgan hollarda): kod tasdiqlanadi, javobda token qaytadi.
export async function verifyCode(contact, code) {
  const { data } = await labClient.post('/api/v1/staff/auth/verify-code/', {
    contact,
    code,
  })

  const tokens = extractTokens(data)
  if (!tokens.access) {
    throw new Error('Token javobda topilmadi. Javob: ' + JSON.stringify(data))
  }
  saveTokens(tokens)
  await ensureLaboratoryRole()
  return data
}

export function logout() {
  localStorage.removeItem('lab_access_token')
  localStorage.removeItem('lab_refresh_token')
}

export function getToken() {
  return localStorage.getItem('lab_access_token')
}
