import { 
  LayoutDashboard, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Users, 
  Sparkles,
  Bot
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './Navigation.css'

export default function Navigation({ activeTab, setActiveTab, lang, deficiencyCount }) {
  const t = I18N[lang] || I18N.en

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'schemes', label: t.schemes, icon: GraduationCap },
    { id: 'tracker', label: t.applications, icon: Clock, badge: deficiencyCount > 0 ? deficiencyCount : null },
    { id: 'documents', label: t.documents, icon: ShieldCheck },
    { id: 'family', label: t.family, icon: Users },
    { id: 'assistant', label: t.assistant, icon: Bot, isSpecial: true }
  ]

  return (
    <nav className="main-nav-bar">
      <div className="container nav-container">
        <ul className="nav-list">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <li key={item.id} className="nav-item-wrapper">
                <button
                  className={`nav-button ${isActive ? 'active-nav-button' : ''} ${item.isSpecial ? 'special-ai-nav' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={18} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge-pill">{item.badge}</span>}
                  {item.isSpecial && <Sparkles size={12} className="ai-sparkle" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
