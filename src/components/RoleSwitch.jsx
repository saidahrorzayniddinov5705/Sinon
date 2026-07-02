import { Link } from 'react-router-dom'
import { ShieldCheck, FlaskConical } from 'lucide-react'

// Login sahifalari o'rtasida almashish uchun segmentli tugma.
export default function RoleSwitch({ active }) {
  return (
    <div className="role-switch">
      <Link to="/login" className={`role-switch-btn ${active === 'admin' ? 'active' : ''}`}>
        <ShieldCheck size={16} /> Super Admin
      </Link>
      <Link to="/lab/login" className={`role-switch-btn ${active === 'lab' ? 'active' : ''}`}>
        <FlaskConical size={16} /> Laborant
      </Link>
    </div>
  )
}
