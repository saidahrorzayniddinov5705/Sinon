import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { X, Sun, Moon, Menu, LogOut, User2, FlaskConical, Beaker, Users, ClipboardList } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useLabAuth } from '../../context/LabAuthContext'
import LabConnectivityToggle from './LabConnectivityToggle'

const NAV = [
  { to: '/lab/profile', label: 'Profil', icon: FlaskConical },
  { to: '/lab/services', label: 'Servislar', icon: Beaker },
  { to: '/lab/staff', label: 'Labarantlar', icon: Users },
  { to: '/lab/orders', label: 'Buyurtmalar', icon: ClipboardList },
]

export default function LabLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { logout } = useLabAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/lab/login')
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-head">
          <div className="logo">
            Logo<span>Here</span>
          </div>
          <button className="icon-btn mobile-only" onClick={() => setMobileOpen(false)} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <nav className="nav">
          <div className="nav-label">Laboratoriya kabineti</div>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="nav-item" onClick={() => setMobileOpen(false)}>
              <n.icon size={18} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="theme-toggle">
          <button className={`theme-opt ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
            <Sun size={15} /> Light
          </button>
          <button className={`theme-opt ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
            <Moon size={15} /> Dark
          </button>
        </div>

        <div className="sidebar-foot">© 2026 Sinon Admin</div>
      </aside>

      {mobileOpen && <div className="overlay" onClick={() => setMobileOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn mobile-only" onClick={() => setMobileOpen(true)} aria-label="Menyu">
            <Menu size={22} />
          </button>

          <div className="topbar-right">
            <LabConnectivityToggle />
            <div className="user">
              <div className="avatar"><User2 size={18} /></div>
              <div className="user-info">
                <div className="user-name">Laboratoriya</div>
                <div className="user-role">Xodim</div>
              </div>
            </div>
            <button className="icon-btn" onClick={handleLogout} title="Chiqish">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
