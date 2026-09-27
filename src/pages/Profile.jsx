import { useContext } from 'react'
import { AppContext } from '../App'
import { MOCK_STUDENT } from '../data/mockData'
import './Profile.css'

export default function Profile() {
  const { lang, addToast } = useContext(AppContext)
  const hi = lang === 'hi'
  const s = MOCK_STUDENT

  const rows = [
    { label: hi?'APAAR ID':'APAAR ID', value: s.apaarId, icon: '🎓' },
    { label: hi?'OTR ID':'OTR ID', value: s.otrId, icon: '📋' },
    { label: hi?'Aadhaar':'Aadhaar', value: s.aadhaar, icon: '🪪' },
    { label: hi?'ST प्रमाण पत्र':'ST Certificate', value: s.stCertificate, icon: '📜' },
    { label: hi?'जनजाति':'Tribe', value: s.tribe, icon: '🪶' },
    { label: hi?'राज्य':'State', value: `${s.district}, ${s.state}`, icon: '📍' },
    { label: hi?'वार्षिक आय':'Annual Income', value: s.income, icon: '💰' },
    { label: hi?'संस्थान':'Institution', value: s.institution, icon: '🏛️' },
    { label: hi?'कोर्स':'Course', value: `${s.course} · ${s.year}`, icon: '📚' },
  ]

  return (
    <div className="profile-page fade-in">
      {/* Avatar */}
      <div className="profile-header">
        <div className="profile-avatar">
          {s.name.split(' ').map(n=>n[0]).join('')}
        </div>
        <div className="profile-name">{hi ? s.nameHi : s.name}</div>
        <div className="profile-id">ID: {s.id}</div>
        <div className="profile-badges">
          <span className="badge badge-purple">ST · {s.tribe}</span>
          <span className="badge badge-success">✅ DigiLocker</span>
          <span className="badge badge-info">APAAR Linked</span>
        </div>
      </div>

      {/* Info Rows */}
      <div className="card profile-info">
        {rows.map((r, i) => (
          <div key={i} className="profile-row">
            <span className="profile-row-icon">{r.icon}</span>
            <div className="profile-row-content">
              <div className="profile-row-label">{r.label}</div>
              <div className="profile-row-value">{r.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Status */}
      <div className="card verify-card">
        <div className="verify-title">🔐 {hi?'सत्यापन स्थिति':'Verification Status'}</div>
        {[
          { label: 'DigiLocker', status: true },
          { label: 'Aadhaar (UIDAI)', status: true },
          { label: 'ST Certificate (e-District)', status: true },
          { label: 'APAAR Academic ID', status: true },
          { label: 'OTR (NSP)', status: true },
          { label: 'Income Certificate', status: false, note: 'Pending re-upload' },
        ].map((v, i) => (
          <div key={i} className="verify-row">
            <span>{v.label}</span>
            <div>
              {v.status
                ? <span className="badge badge-success">✅ Verified</span>
                : <span className="badge badge-warning">⚠️ {v.note}</span>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <button className="btn btn-outline btn-full" onClick={() => addToast('Profile updated!', 'success')}>
        ✏️ {hi?'प्रोफ़ाइल अपडेट करें':'Update Profile'}
      </button>
      <button className="btn btn-full" style={{background:'#fee2e2',color:'#dc2626',border:'1px solid #fca5a5'}} onClick={() => addToast('Logged out', 'info')}>
        🚪 {hi?'लॉगआउट':'Logout'}
      </button>
    </div>
  )
}
