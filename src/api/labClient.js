import { createApiClient } from './client'

// Laboratory Staff (lab xodimi) uchun alohida token bilan ishlaydigan klient —
// Super Admin tokenidan mustaqil (bir vaqtda ikkalasiga ham kirish mumkin).
const labClient = createApiClient({
  tokenKey: 'lab_access_token',
  refreshKey: 'lab_refresh_token',
  loginPath: '/lab/login',
})

export default labClient
