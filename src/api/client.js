import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'https://api.sinon.uz'

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

// Har bir so'rovga saqlangan tokenni qo'shamiz
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Token yangilash (refresh) mexanizmi ---
let isRefreshing = false
let waiters = [] // refresh tugashini kutayotgan so'rovlar

function notifyWaiters(token) {
  waiters.forEach((cb) => cb(token))
  waiters = []
}

function forceLogout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const status = error.response?.status

    // 401 emas yoki allaqachon qayta urinilgan bo'lsa — xatoni qaytaramiz
    if (status !== 401 || !original || original._retry) {
      return Promise.reject(error)
    }

    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) {
      forceLogout()
      return Promise.reject(error)
    }

    // Boshqa so'rov refresh qilayotgan bo'lsa — navbatga qo'shamiz
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waiters.push((token) => {
          if (!token) return reject(error)
          original._retry = true
          original.headers.Authorization = `Bearer ${token}`
          resolve(client(original))
        })
      })
    }

    original._retry = true
    isRefreshing = true
    try {
      // Interceptor rekursiyasini oldini olish uchun toza axios ishlatamiz
      const { data } = await axios.post(`${baseURL}/api/token/refresh/`, { refresh })
      const newAccess = data.access || data.data?.access || data.token
      if (!newAccess) throw new Error('Yangi token topilmadi')

      localStorage.setItem('access_token', newAccess)
      isRefreshing = false
      notifyWaiters(newAccess)

      original.headers.Authorization = `Bearer ${newAccess}`
      return client(original)
    } catch (e) {
      isRefreshing = false
      notifyWaiters(null)
      forceLogout()
      return Promise.reject(error)
    }
  }
)

export default client
