import client from './client'

// Super Admin login. Javobdagi token maydoni har xil bo'lishi mumkin,
// shuning uchun bir nechta variantni tekshiramiz.
export async function login(username, password) {
  const { data } = await client.post('/api/v1/super-admin/login/', {
    username,
    password,
  })

  const access =
    data.access ||
    data.token ||
    data.access_token ||
    (data.data && (data.data.access || data.data.token)) ||
    (data.tokens && data.tokens.access)

  const refresh =
    data.refresh ||
    data.refresh_token ||
    (data.data && data.data.refresh) ||
    (data.tokens && data.tokens.refresh)

  if (!access) {
    throw new Error('Token javobda topilmadi. Javob: ' + JSON.stringify(data))
  }

  localStorage.setItem('access_token', access)
  if (refresh) localStorage.setItem('refresh_token', refresh)
  return data
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export function getToken() {
  return localStorage.getItem('access_token')
}
