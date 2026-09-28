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
  Sparkles,
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
  activeTabLabel,
  onNavigate
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
          <div className="page-context">
            <h2 className="current-page-title">{activeTabLabel}</h2>
            <span className="ministry-micro-tag">{t.ministry}</span>
          </div>
        </div>

        {/* Right: Global Controls */}
        <div className="header-controls">
          {/* Quick Launch Eligibility Engine Button */}
          <button 
            className="header-pill"
            style={{
              background: 'linear-gradient(135deg, #16406c, #1e4d82)',
              color: '#ffffff',
              borderColor: '#ff9933',
              fontWeight: '700'
            }}
            onClick={() => onNavigate?.('eligibility')}
            title="Launch MoTA Smart Eligibility Engine"
          >
            <Sparkles size={14} style={{ color: '#ff9933' }} />
            <span className="pill-label">{t.launchEligibility || 'Launch Eligibility Engine'}</span>
          </button>

          {/* Offline Toggle */}
          <button 
            className={`header-pill ${offlineMode ? 'pill-offline' : ''}`}
            onClick={() => setOfflineMode(!offlineMode)}
            title="Toggle Forest / Low Connectivity Mode"
          >
            {offlineMode ? <WifiOff size={15} /> : <Wifi size={15} />}
            <span className="pill-label">{offlineMode ? (t.offline || 'Offline') : (t.online || 'Online')}</span>
            <span className={`dot ${offlineMode ? 'dot-warn' : 'dot-ok'}`} />
          </button>

          {/* Language Selector */}
          <div className="dropdown-wrap">
            <button 
              className="header-pill"
              onClick={() => { setShowLangMenu(!showLangMenu); setShowMemberMenu(false); }}
            >
              <Languages size={15} />
              <span className="pill-label">
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : lang === 'santhali' ? 'ᱥᱟᱱ' : lang === 'gondi' ? 'गों' : lang === 'ho' ? 'ᱦᱳ' : lang === 'bodo' ? 'बड़ो' : 'କୁଇ'}
              </span>
              <ChevronDown size={13} className={showLangMenu ? 'arrow-flipped' : ''} />
            </button>

            {showLangMenu && (
              <div className="dropdown-panel lang-panel fade-in" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {[
                  { code: 'en', label: 'English', sub: 'Official Portal Language' },
                  { code: 'hi', label: 'हिंदी (Hindi)', sub: 'राजभाषा / Northern ST' },
                  { code: 'santhali', label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)', sub: 'Ol Chiki Script (JH, OD, WB)' },
                  { code: 'gondi', label: 'गोंडी (Gondi)', sub: 'Central Tribal Region (MP, CG, TS)' },
                  { code: 'ho', label: 'ᱦᱳ (Ho)', sub: 'Warang Chiti / Kolhan Region' },
                  { code: 'bodo', label: 'बड़ो (Bodo)', sub: 'Northeast Tribal (Assam)' },
                  { code: 'kui', label: 'କୁଇ (Kui)', sub: 'Kandha Tribal Community (Odisha)' }
                ].map(l => (
                  <div 
                    key={l.code}
                    className={`dropdown-option ${lang === l.code ? 'option-active' : ''}`}
                    onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                  >
                    <span className="option-main">{l.label}</span>
                    <span className="option-sub">{l.sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sibling Switcher */}
          <div className="dropdown-wrap">
            <button 
              className="header-pill member-switch-pill"
              onClick={() => { setShowMemberMenu(!showMemberMenu); setShowLangMenu(false); }}
            >
              <div className="mini-avatar">{activeStudent.avatarInitials}</div>
              <span className="pill-label member-pill-name">{(lang === 'hi' && activeStudent.nameHi) ? activeStudent.nameHi : activeStudent.name}</span>
              <ChevronDown size={13} className={showMemberMenu ? 'arrow-flipped' : ''} />
            </button>

            {showMemberMenu && (
              <div className="dropdown-panel member-panel fade-in">
                <div className="panel-header">
                  <Users size={14} />
                  <span>{t.switchMember || 'Switch Family Member'}</span>
                  <span className="hh-id-badge">{household.householdId}</span>
                </div>
                {household.members.map(member => (
                  <div 
                    key={member.id} 
                    className={`dropdown-option member-option ${member.id === activeStudent.id ? 'option-active' : ''}`}
                    onClick={() => { setActiveStudent(member); setShowMemberMenu(false); }}
                  >
                    <div className="member-opt-avatar">{member.avatarInitials}</div>
                    <div className="member-opt-info">
                      <div className="member-opt-name">
                        {(lang === 'hi' && member.nameHi) ? member.nameHi : member.name}
                        {member.isPrimary && <span className="primary-tag">{lang === 'hi' ? 'प्राथमिक' : 'Primary'}</span>}
                      </div>
                      <div className="member-opt-inst">{member.institution}</div>
                    </div>
                    {member.id === activeStudent.id && <CheckCircle2 size={15} className="check-active" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <button 
            className="icon-btn notif-btn"
            onClick={onOpenNotifications}
            title="Stage Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
