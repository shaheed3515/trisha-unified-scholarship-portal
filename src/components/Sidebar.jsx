import { useState } from 'react'
import { 
  LayoutDashboard, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Users, 
  Bot,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  Building2
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './Sidebar.css'

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  lang, 
  deficiencyCount, 
  activeStudent,
  collapsed: externalCollapsed,
  setCollapsed: externalSetCollapsed
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed
  const setCollapsed = externalSetCollapsed || setInternalCollapsed
  const t = I18N[lang] || I18N.en

  const mainNavItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'schemes', label: t.schemes, icon: GraduationCap },
    { id: 'tracker', label: t.applications, icon: Clock, badge: deficiencyCount > 0 ? deficiencyCount : null },
    { id: 'documents', label: t.documents, icon: ShieldCheck },
    { id: 'family', label: t.family, icon: Users },
  ]

  const toolNavItems = [
    { id: 'eligibility', label: t.eligibility || 'Eligibility Engine', icon: Sparkles, isAI: true },
    { id: 'assistant', label: t.assistant, icon: Bot, isAI: true },
  ]

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Brand */}
      <div className="sidebar-brand">
        <div className="brand-emblem">
          <svg className="emblem-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" stroke="#d97706" strokeWidth="2.5" strokeDasharray="3 3"/>
            <circle cx="50" cy="50" r="38" fill="#16406c" />
            <path d="M50 20 L58 36 L76 36 L62 48 L67 66 L50 54 L33 66 L38 48 L24 36 L42 36 Z" fill="#ff9933" opacity="0.9"/>
            <circle cx="50" cy="50" r="10" fill="#ffffff" />
            <circle cx="50" cy="50" r="6" stroke="#000080" strokeWidth="1.5" />
          </svg>
        </div>
        {!collapsed && (
          <div className="brand-text">
            <div className="brand-name">TRISHA</div>
            <div className="brand-tagline">MoTA Scholarship Portal</div>
          </div>
        )}
      </div>

      {/* Active Student Mini Profile */}
      {!collapsed && (
        <div className="sidebar-student-card">
          <div className="sidebar-avatar">{activeStudent.avatarInitials}</div>
          <div className="sidebar-student-info">
            <div className="sidebar-student-name">{activeStudent.name}</div>
            <div className="sidebar-student-level">{activeStudent.educationLevel}</div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">{!collapsed && (t.mainMenu || 'Main Menu')}</div>
        {mainNavItems.map(item => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              className={`sidebar-nav-btn ${isActive ? 'active-sidebar-btn' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="sidebar-nav-icon" />
              {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </button>
          )
        })}

        <div className="nav-divider" />
        <div className="nav-section-label">{!collapsed && (t.aiTools || 'AI Tools')}</div>

        {toolNavItems.map(item => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              className={`sidebar-nav-btn ai-nav-btn ${isActive ? 'active-sidebar-btn' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="sidebar-nav-icon" />
              {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
              {item.isAI && !collapsed && <Sparkles size={13} className="ai-sparkle-sidebar" />}
            </button>
          )
        })}
      </nav>

      {/* Sidebar Footer Actions */}
      <div className="sidebar-footer">
        <button className="sidebar-nav-btn footer-btn" title={collapsed ? (t.helpSupport || 'Help & Support') : undefined}>
          <HelpCircle size={18} className="sidebar-nav-icon" />
          {!collapsed && <span className="sidebar-nav-label">{t.helpSupport || 'Help & Support'}</span>}
        </button>

        <button 
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? (t.expand || 'Expand Sidebar') : (t.collapse || 'Collapse Sidebar')}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>{t.collapse || 'Collapse'}</span>}
        </button>
      </div>
    </aside>
  )
}
