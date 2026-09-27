import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../App'
import { NOTIFICATIONS } from '../data/mockData'

export default function TopNav() {
  const { lang, setLang } = useContext(AppContext)
  const navigate = useNavigate()
  const unread = NOTIFICATIONS.filter(n => !n.read).length

  return (
    <nav className="top-nav">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">🪶</div>
        <div>
          <div className="logo-text">JAGO</div>
          <div className="logo-sub">MoTA Scholarship Portal</div>
        </div>
      </div>
      <div className="top-nav-right">
        <button className="lang-toggle" onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}>
          {lang === 'en' ? 'हिं' : 'EN'}
        </button>
        <button className="notif-btn" onClick={() => navigate('/notifications')}>
          🔔
          {unread > 0 && <span className="notif-badge" />}
        </button>
      </div>
    </nav>
  )
}
