import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, ShieldCheck, BarChart3, Database } from 'lucide-react'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      refresh()
      navigate('/')
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Login amalga oshmadi'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        {/* Chap tomon — brending */}
        <div className="login-brand">
          <div className="brand-glow" />
          <div className="logo">
            Logo<span>Here</span>
          </div>
          <h1>Sinon boshqaruv paneli</h1>
          <p>Tizimni bitta joydan boshqaring — foydalanuvchilar, buyurtmalar, shifokorlar va laboratoriyalar.</p>
          <ul className="brand-features">
            <li><ShieldCheck size={18} /> Xavfsiz JWT avtorizatsiya</li>
            <li><BarChart3 size={18} /> Jonli statistika va grafiklar</li>
            <li><Database size={18} /> Barcha ma'lumotlar bir panelda</li>
          </ul>
        </div>

        {/* O'ng tomon — forma */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="logo mobile-logo">
            Logo<span>Here</span>
          </div>
          <h2>Xush kelibsiz 👋</h2>
          <p className="login-sub">Davom etish uchun Super Admin hisobingizga kiring</p>

          <label>Foydalanuvchi nomi</label>
          <div className="input-wrap">
            <User size={18} className="input-icon" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="username"
              required
            />
          </div>

          <label>Parol</label>
          <div className="input-wrap">
            <Lock size={18} className="input-icon" />
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="pass-toggle"
              onClick={() => setShowPass((s) => !s)}
              tabIndex={-1}
              aria-label="Parolni ko'rsatish"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="btn-primary" disabled={loading}>
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>

          <p className="login-foot">© 2026 Sinon. Barcha huquqlar himoyalangan.</p>
        </form>
      </div>
    </div>
  )
}
