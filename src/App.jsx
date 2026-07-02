import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useLabAuth } from './context/LabAuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import LabLayout from './components/lab/LabLayout'
import LabLogin from './pages/lab/LabLogin'
import LabProfile from './pages/lab/LabProfile'
import LabServices from './pages/lab/LabServices'
import LabStaff from './pages/lab/LabStaff'
import LabOrders from './pages/lab/LabOrders'

function ProtectedRoute({ children }) {
  const auth = useAuth()
  if (!auth?.isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function LabProtectedRoute({ children }) {
  const auth = useLabAuth()
  if (!auth?.isAuthenticated) return <Navigate to="/lab/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="section/:key" element={<ListPage />} />
        <Route path="section/:key/:id" element={<DetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      <Route path="/lab/login" element={<LabLogin />} />
      <Route
        path="/lab"
        element={
          <LabProtectedRoute>
            <LabLayout />
          </LabProtectedRoute>
        }
      >
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<LabProfile />} />
        <Route path="services" element={<LabServices />} />
        <Route path="staff" element={<LabStaff />} />
        <Route path="orders" element={<LabOrders />} />
        <Route path="*" element={<Navigate to="/lab/profile" replace />} />
      </Route>
    </Routes>
  )
}
