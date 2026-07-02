import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Lock, Eye, EyeOff, FlaskConical, KeyRound } from 'lucide-react'
import { sendLoginCode, verifyCode } from '../../api/labAuth'
import { useLabAuth } from '../../context/LabAuthContext'
import RoleSwitch from '../../components/RoleSwitch'

export default function LabLogin() {
  const [step, setStep] = useState(1) // 1 = kontakt+parol, 2 = SMS kod
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { refresh } = useLabAuth()

  const extractMsg = (err, fallback) => {
    const msg = err.response?.data?.detail || err.response?.data?.message || err.message || fallback
    return typeof msg === 'string' ? msg : JSON.stringify(msg)
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await sendLoginCode(contact, password)
      if (result.loggedIn) {
        refresh()
        navigate('/lab')
      } else {
        setStep(2)
      }
    } catch (err) {
      setError(extractMsg(err, 'Login amalga oshmadi'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyCode(contact, code)
      refresh()
      navigate('/lab')
    } catch (err) {
      setError(extractMsg(err, 'Kod tasdiqlanmadi'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <div className="login-brand">
          <div className="brand-glow" />
          <div className="logo">
            Logo<span>Here</span>
          </div>
          <h1>Laboratoriya kabineti</h1>
          <p>Profilingiz, xizmatlaringiz, labarantlaringiz va buyurtmalaringizni shu yerdan boshqaring.</p>
          <ul className="brand-features">
            <li><FlaskConical size={18} /> Laboratoriya profili va xizmatlar</li>
            <li><KeyRound size={18} /> SMS kod bilan xavfsiz kirish</li>
          </ul>
        </div>

        <form className="login-form" onSubmit={step === 1 ? handleSendCode : handleVerify}>
          <div className="logo mobile-logo">
            Logo<span>Here</span>
          </div>
          <RoleSwitch active="lab" />

          <h2>Xush kelibsiz 👋</h2>
          <p className="login-sub">
            {step === 1 ? 'Laboratoriya xodimi hisobingizga kiring' : `${contact} raqamiga yuborilgan kodni kiriting`}
          </p>

          {step === 1 ? (
            <>
              <label>Kontakt (telefon)</label>
              <div className="input-wrap">
                <Phone size={18} className="input-icon" />
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+998901112233"
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
            </>
          ) : (
            <>
              <label>SMS kod</label>
              <div className="input-wrap">
                <KeyRound size={18} className="input-icon" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  required
                />
              </div>
              <button type="button" className="btn-ghost slim" onClick={() => setStep(1)}>
                Orqaga
              </button>
            </>
          )}

          {error && <div className="login-error">{error}</div>}

          <button className="btn-primary" disabled={loading}>
            {loading ? 'Yuklanmoqda...' : step === 1 ? 'Kod yuborish' : 'Tasdiqlash'}
          </button>

          <p className="login-foot">© 2026 Sinon. Barcha huquqlar himoyalangan.</p>
        </form>
      </div>
    </div>
  )
}
