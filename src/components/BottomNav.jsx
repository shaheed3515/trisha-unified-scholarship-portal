import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../App'
import { TRANSLATIONS } from '../data/mockData'

const NAV = [
  { path: '/', icon: '🏠', labelEn: 'Home', labelHi: 'होम' },
  { path: '/schemes', icon: '📋', labelEn: 'Schemes', labelHi: 'योजनाएं' },
  { path: '/documents', icon: '📂', labelEn: 'Documents', labelHi: 'दस्तावेज़' },
  { path: '/chatbot', icon: '🤖', labelEn: 'JAGO AI', labelHi: 'JAGO AI' },
  { path: '/profile', icon: '👤', labelEn: 'Profile', labelHi: 'प्रोफ़ाइल' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { lang } = useContext(AppContext)

  return (
    <nav className="bottom-nav">
      {NAV.map(n => (
        <button
          key={n.path}
          className={`nav-item ${pathname === n.path ? 'active' : ''}`}
          onClick={() => navigate(n.path)}
        >
          <span className="nav-icon">{n.icon}</span>
          <span>{lang === 'hi' ? n.labelHi : n.labelEn}</span>
        </button>
      ))}
    </nav>
  )
}
