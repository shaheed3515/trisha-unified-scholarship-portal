import { useState } from 'react'
import { 
  Languages, 
  Users, 
  Wifi, 
  WifiOff, 
  Bell, 
  ShieldCheck, 
  ChevronDown, 
  CheckCircle2,
  Search,
  X
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './Header.css'

export default function Header({ 
  lang, 
  setLang, 
  activeStudent, 
  setActiveStudent, 
  household, 
  offlineMode, 
  setOfflineMode, 
  notifications,
  onOpenNotifications,
  activeTabLabel
}) {
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showMemberMenu, setShowMemberMenu] = useState(false)
  const t = I18N[lang] || I18N.en
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="top-header">
      {/* Tricolor Government Strip */}
      <div className="gov-tricolor-bar" />

      <div className="header-inner">
        {/* Left: Current Page Title + Ministry Tag */}
        <div className="header-left-section">
          {/* Mobile-only logo */}
          <div className="mobile-header-brand" aria-label="TRISHA Ministry of Tribal Affairs">
            <div className="brand-emblem-mini">
              <svg className="emblem-svg" viewBox="0 0 100 100" fill="none" role="img" aria-label="TRISHA emblem">
                <circle cx="50" cy="50" r="46" stroke="#d97706" strokeWidth="2.5" strokeDasharray="3 3"/>
                <circle cx="50" cy="50" r="38" fill="#1e293b" />
                <path d="M50 20 L58 36 L76 36 L62 48 L67 66 L50 54 L33 66 L38 48 L24 36 L42 36 Z" fill="#ff9933" opacity="0.9"/>
                <circle cx="50" cy="50" r="10" fill="#ffffff" />
                <circle cx="50" cy="50" r="6" stroke="#1e293b" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="mobile-brand-name">TRISHA</span>
          </div>

          <div className="page-context">
            <h2 className="current-page-title">{activeTabLabel}</h2>
            <span className="ministry-micro-tag">{t.ministry}</span>
          </div>
        </div>

        {/* Right: Global Controls */}
        <div className="header-controls">
          {/* Offline Toggle */}
          <button 
            className={`header-pill ${offlineMode ? 'pill-offline' : ''}`}
            onClick={() => setOfflineMode(!offlineMode)}
            aria-label={offlineMode ? "Offline low-connectivity mode is active. Click to switch to online mode" : "Online mode is active. Click to switch to offline low-connectivity mode"}
            title={offlineMode ? "Offline Mode (Forest / Low Signal)" : "Online Mode (Full Connectivity)"}
          >
            {offlineMode ? <WifiOff size={15} aria-hidden="true" /> : <Wifi size={15} aria-hidden="true" />}
            <span className="pill-label">{offlineMode ? 'Offline' : 'Online'}</span>
            <span className={`dot ${offlineMode ? 'dot-warn' : 'dot-ok'}`} aria-hidden="true" />
          </button>

          {/* Language Selector */}
          <div className="dropdown-wrap">
            <button 
              className="header-pill"
              onClick={() => { setShowLangMenu(!showLangMenu); setShowMemberMenu(false); }}
              aria-haspopup="true"
              aria-expanded={showLangMenu}
              aria-label={`Language selector, current language is ${lang.toUpperCase()}`}
            >
              <Languages size={15} aria-hidden="true" />
              <span className="pill-label">
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : lang === 'santhali' ? 'ᱥᱟᱱ' : 'गों'}
              </span>
              <ChevronDown size={13} className={showLangMenu ? 'arrow-flipped' : ''} aria-hidden="true" />
            </button>

            {showLangMenu && (
              <div className="dropdown-panel lang-panel fade-in" role="menu" aria-label="Available Languages">
                {[
                  { code: 'en', label: 'English', sub: 'Official Portal Language' },
                  { code: 'hi', label: 'हिंदी (Hindi)', sub: 'राजभाषा' },
                  { code: 'santhali', label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)', sub: 'Ol Chiki Script' },
                  { code: 'gondi', label: 'गोंडी (Gondi)', sub: 'Central Tribal Dialect' }
                ].map(l => (
                  <button 
                    key={l.code}
                    className={`dropdown-option ${lang === l.code ? 'option-active' : ''}`}
                    onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                    role="menuitem"
                    aria-label={`Switch language to ${l.label}`}
                  >
                    <span className="option-main">{l.label}</span>
                    <span className="option-sub">{l.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sibling Switcher */}
          <div className="dropdown-wrap">
            <button 
              className="header-pill member-switch-pill"
              onClick={() => { setShowMemberMenu(!showMemberMenu); setShowLangMenu(false); }}
              aria-haspopup="true"
              aria-expanded={showMemberMenu}
              aria-label={`Switch family member profile. Currently viewing ${activeStudent.name}`}
            >
              <div className="mini-avatar" aria-hidden="true">{activeStudent.avatarInitials}</div>
              <span className="pill-label member-pill-name">{activeStudent.name}</span>
              <ChevronDown size={13} className={showMemberMenu ? 'arrow-flipped' : ''} aria-hidden="true" />
            </button>

            {showMemberMenu && (
              <div className="dropdown-panel member-panel fade-in" role="menu" aria-label="Select Family Member">
                <div className="panel-header">
                  <Users size={14} aria-hidden="true" />
                  <span>Switch Family Member</span>
                  <span className="hh-id-badge">{household.householdId}</span>
                </div>
                {household.members.map(member => (
                  <button 
                    key={member.id} 
                    className={`dropdown-option member-option ${member.id === activeStudent.id ? 'option-active' : ''}`}
                    onClick={() => { setActiveStudent(member); setShowMemberMenu(false); }}
                    role="menuitem"
                    aria-label={`Switch view to ${member.name} (${member.relation})`}
                  >
                    <div className="member-opt-avatar" aria-hidden="true">{member.avatarInitials}</div>
                    <div className="member-opt-info">
                      <div className="member-opt-name">
                        {member.name}
                        {member.isPrimary && <span className="primary-tag">Primary</span>}
                      </div>
                      <div className="member-opt-inst">{member.institution}</div>
                    </div>
                    {member.id === activeStudent.id && <CheckCircle2 size={15} className="check-active" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <button 
            className="icon-btn notif-btn"
            onClick={onOpenNotifications}
            aria-label={`Notifications, ${unreadCount} unread`}
            title="Stage Notifications"
          >
            <Bell size={18} aria-hidden="true" />
            {unreadCount > 0 && <span className="notif-count" aria-hidden="true">{unreadCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
