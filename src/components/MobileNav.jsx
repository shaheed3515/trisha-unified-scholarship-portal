import { 
  LayoutDashboard, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Users, 
  Bot,
  Sparkles 
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './MobileNav.css'

export default function MobileNav({ activeTab, setActiveTab, lang, deficiencyCount }) {
  const t = I18N[lang] || I18N.en

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'schemes', label: t.schemes, icon: GraduationCap },
    { id: 'eligibility', label: 'Eligibility', icon: Sparkles, isAI: true },
    { id: 'tracker', label: t.applications, icon: Clock, badge: deficiencyCount > 0 ? deficiencyCount : null },
    { id: 'documents', label: t.documents, icon: ShieldCheck },
    { id: 'family', label: t.family, icon: Users },
    { id: 'assistant', label: 'Sahayak', icon: Bot, isAI: true }
  ]

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="mobile-nav-track">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              className={`mobile-nav-btn ${isActive ? 'active-mobile-btn' : ''}`}
              onClick={() => setActiveTab(item.id)}
              aria-label={`${item.label} navigation tab${isActive ? ', currently active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="mobile-icon-wrap">
                <Icon size={20} aria-hidden="true" focusable="false" />
                {item.badge && (
                  <span className="mobile-nav-badge" aria-label={`${item.badge} pending actions`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mobile-nav-text">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
