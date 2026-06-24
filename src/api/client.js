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

// 401 bo'lsa — tokenni tozalab login sahifasiga qaytaramiz
client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401 && !localStorage.getItem('__preview_no_redirect')) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
