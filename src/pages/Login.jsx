import { useState, useContext } from 'react'
import { AppContext } from '../App'
import './Login.css'

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1=phone, 2=otp, 3=digilocker
  const [loading, setLoading] = useState(false)
  const { addToast } = useContext(AppContext)

  const sendOtp = () => {
    if (phone.length < 10) return addToast('Enter valid 10-digit mobile number', 'warning')
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(2); addToast('OTP sent: 123456 (demo)', 'success') }, 1200)
  }

  const verifyOtp = () => {
    if (otp !== '123456') return addToast('Wrong OTP. Use 123456 for demo', 'warning')
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(3) }, 1000)
  }

  const linkDigilocker = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); addToast('DigiLocker linked successfully!', 'success'); setTimeout(onLogin, 800) }, 1500)
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-logo">🪶</div>
          <h1>JAGO</h1>
          <p>MoTA Unified Scholarship Portal</p>
          <div className="login-subtitle">Unified access to all 5 Scheduled Tribe scholarship schemes</div>
        </div>

        <div className="login-steps">
          {[1,2,3].map(s => (
            <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="login-form fade-in">
            <div className="login-step-title">📱 Mobile Login</div>
            <label className="input-label">Mobile Number / Aadhaar-linked</label>
            <div className="phone-input-wrap">
              <span className="phone-prefix">+91</span>
              <input
                className="input phone-input"
                type="tel" maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g,''))}
              />
            </div>
            <button className="btn btn-primary btn-full" onClick={sendOtp} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Send OTP'}
            </button>
            <div className="login-hint">OTP will be sent to Aadhaar-registered mobile</div>
          </div>
        )}

        {step === 2 && (
          <div className="login-form fade-in">
            <div className="login-step-title">🔐 Enter OTP</div>
            <label className="input-label">6-digit OTP sent to +91 {phone}</label>
            <input
              className="input otp-input"
              type="tel" maxLength={6}
              placeholder="1 2 3 4 5 6"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
            />
            <button className="btn btn-primary btn-full" onClick={verifyOtp} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Verify OTP'}
            </button>
            <button className="btn-text" onClick={() => setStep(1)}>← Change number</button>
            <div className="login-hint">Demo OTP: <strong>123456</strong></div>
          </div>
        )}

        {step === 3 && (
          <div className="login-form fade-in">
            <div className="login-step-title">📂 Link DigiLocker</div>
            <div className="digilocker-info">
              <div className="dl-icon">🏛️</div>
              <div>
                <div style={{fontWeight:600,marginBottom:4}}>Connect DigiLocker</div>
                <div style={{fontSize:12,color:'var(--text2)'}}>
                  Auto-fetch your ST Certificate, Aadhaar & academic documents. No re-uploading needed.
                </div>
              </div>
            </div>
            <div className="dl-perms">
              {['ST / Caste Certificate', 'Aadhaar Card', 'Marksheets & Degrees', 'Income Certificate'].map(p => (
                <div key={p} className="dl-perm-item">✅ {p}</div>
              ))}
            </div>
            <button className="btn btn-primary btn-full" onClick={linkDigilocker} disabled={loading}>
              {loading ? <span className="spinner" /> : '🔗 Link DigiLocker & Continue'}
            </button>
            <button className="btn-text" onClick={onLogin}>Skip for now</button>
          </div>
        )}

        <div className="login-footer">
          <span>Ministry of Tribal Affairs | Govt. of India</span>
          <div className="login-logos">
            <span>🇮🇳</span> <span>GoI</span> <span>·</span> <span>MoTA</span>
          </div>
        </div>
      </div>
    </div>
  )
}
