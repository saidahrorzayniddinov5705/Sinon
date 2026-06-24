import { createContext, useContext, useState } from 'react'
import { getToken, logout as doLogout } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken())

  const value = {
    token,
    isAuthenticated: !!token,
    refresh: () => setToken(getToken()),
    logout: () => {
      doLogout()
      setToken(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
