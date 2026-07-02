import { createContext, useContext, useState } from 'react'
import { getToken, logout as doLogout } from '../api/labAuth'

const LabAuthContext = createContext(null)

export function LabAuthProvider({ children }) {
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

  return <LabAuthContext.Provider value={value}>{children}</LabAuthContext.Provider>
}

export function useLabAuth() {
  return useContext(LabAuthContext)
}
