import { Menu, Search, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Topbar({ onMenuClick }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <button className="icon-btn mobile-only" onClick={onMenuClick} aria-label="Menyu">
        <Menu size={22} />
      </button>

      <div className="search-box">
        <Search size={16} />
        <input placeholder="Qidirish..." />
      </div>

      <div className="topbar-right">
        <div className="user">
          <div className="avatar">SA</div>
          <div className="user-info">
            <div className="user-name">Super Admin</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
        <button className="icon-btn" onClick={handleLogout} title="Chiqish">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
