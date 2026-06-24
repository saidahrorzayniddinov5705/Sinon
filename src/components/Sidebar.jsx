import { NavLink } from 'react-router-dom'
import { LayoutDashboard, X, Sun, Moon } from 'lucide-react'
import { sections } from '../config/sections'
import { useTheme } from '../context/ThemeContext'
import Icon from './Icon'

export default function Sidebar({ mobileOpen, onClose }) {
  const { theme, setTheme } = useTheme()

  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-head">
        <div className="logo">
          Logo<span>Here</span>
        </div>
        <button className="icon-btn mobile-only" onClick={onClose} aria-label="Yopish">
          <X size={20} />
        </button>
      </div>

      <nav className="nav">
        <NavLink to="/" end className="nav-item" onClick={onClose}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <div className="nav-label">Super Admin</div>

        {sections.map((s) => (
          <NavLink
            key={s.key}
            to={`/section/${s.key}`}
            className="nav-item"
            onClick={onClose}
          >
            <Icon name={s.icon} size={18} />
            <span>{s.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="theme-toggle">
        <button
          className={`theme-opt ${theme === 'light' ? 'active' : ''}`}
          onClick={() => setTheme('light')}
        >
          <Sun size={15} /> Light
        </button>
        <button
          className={`theme-opt ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => setTheme('dark')}
        >
          <Moon size={15} /> Dark
        </button>
      </div>

      <div className="sidebar-foot">© 2026 Sinon Admin</div>
    </aside>
  )
}
