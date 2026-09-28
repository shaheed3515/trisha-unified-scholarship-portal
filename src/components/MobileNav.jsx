import { useState } from 'react'
import { 
  LayoutDashboard, 
  GraduationCap, 
  Clock, 
  ShieldCheck, 
  Users, 
  Bot,
  Sparkles,
  MoreHorizontal,
  X,
  Languages,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './MobileNav.css'

export default function MobileNav({ activeTab, setActiveTab, lang, setLang, deficiencyCount }) {
  const [showMoreSheet, setShowMoreSheet] = useState(false)
  const t = I18N[lang] || I18N.en

  // Short, clean labels for mobile to completely prevent text wrapping or overlapping
  const LABELS = {
    en: { home: 'Home', schemes: 'Schemes', eligibility: 'Eligibility', tracker: 'Tracker', sahayak: 'Sahayak', more: 'More', vault: 'Document Vault', family: 'Household', services: 'Additional MoTA Services' },
    hi: { home: 'होम', schemes: 'योजनाएं', eligibility: 'पात्रता', tracker: 'ट्रैकर', sahayak: 'सहायक', more: 'अन्य', vault: 'दस्तावेज़ वॉल्ट', family: 'परिवार', services: 'अतिरिक्त सेवाएं' },
    santhali: { home: 'ᱢᱩᱬᱩᱛ', schemes: 'ᱟᱸᱪᱚᱱ', eligibility: 'ᱞᱟᱭᱚᱠ', tracker: 'ᱦᱟᱞᱚᱛ', sahayak: 'ᱜᱚᱲᱚ', more: 'ᱮᱴᱟᱜ', vault: 'ᱰᱤᱡᱤᱞᱚᱠᱟᱨ', family: 'ᱜᱷᱟᱨᱚᱸᱡᱽ', services: 'ᱮᱴᱟᱜ ᱥᱮᱵᱟ' },
    gondi: { home: 'मुखड़ा', schemes: 'योजना', eligibility: 'जांच', tracker: 'हाल', sahayak: 'संगी', more: 'अउर', vault: 'कागद पत्र', family: 'कुटुम', services: 'अउर सेवा' },
    ho: { home: 'ᱢᱩᱬ', schemes: 'ᱥᱠᱤᱢ', eligibility: 'ᱯᱟᱸᱡᱟ', tracker: 'ᱛᱩᱞᱟᱹ', sahayak: 'ᱜᱚᱲᱚ', more: 'ᱮᱴᱟᱜ', vault: 'ᱰᱤᱡᱤᱞᱚᱠᱟᱨ', family: 'ᱚᱲᱟᱜ', services: 'ᱮᱴᱟᱜ ᱥᱮᱵᱟ' },
    bodo: { home: 'गाहाय', schemes: 'अनसुंथाइ', eligibility: 'पात्रता', tracker: 'नायगिर', sahayak: 'मदद', more: 'गुबुन', vault: 'लेखा', family: 'नखर', services: 'गुबुन सेवा' },
    kui: { home: 'ମୁଖ୍ୟ', schemes: 'ଯୋଜନା', eligibility: 'ଯୋଗ୍ୟତା', tracker: 'ସ୍ଥିତି', sahayak: 'ସହାୟକ', more: 'ଅନ୍ୟ', vault: 'ଡିଜିଲକର', family: 'କୁଟୁମ୍ବ', services: 'ଅନ୍ୟ ସେବା' }
  }

  const l = LABELS[lang] || LABELS.en

  // 5 Core Primary Tabs fitting perfectly without squishing
  const primaryTabs = [
    { id: 'dashboard', label: l.home, icon: LayoutDashboard },
    { id: 'schemes', label: l.schemes, icon: GraduationCap },
    { id: 'eligibility', label: l.eligibility, icon: Sparkles, isAI: true },
    { id: 'tracker', label: l.tracker, icon: Clock, badge: deficiencyCount > 0 ? deficiencyCount : null },
    { id: 'assistant', label: l.sahayak, icon: Bot, isAI: true }
  ]

  // Extra features inside "More" Sheet
  const secondaryTabs = [
    { id: 'documents', label: l.vault, sub: t.vaultSub || 'Verified Credentials & Academic Records', icon: ShieldCheck },
    { id: 'family', label: l.family, sub: t.portfolioSub || 'Track Multi-Child Family Grants', icon: Users }
  ]

  const isMoreActive = activeTab === 'documents' || activeTab === 'family'

  return (
    <>
      <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        <div className="mobile-nav-track">
          {primaryTabs.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                className={`mobile-nav-btn ${isActive ? 'active-mobile-btn' : ''}`}
                onClick={() => {
                  setActiveTab(item.id)
                  setShowMoreSheet(false)
                }}
                aria-label={item.label}
              >
                <div className="mobile-icon-wrap">
                  <Icon size={20} />
                  {item.badge && (
                    <span className="mobile-nav-badge">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="mobile-nav-text">{item.label}</span>
              </button>
            )
          })}

          {/* 6th "More" Tab to access Document Vault & Family without cluttering */}
          <button
            className={`mobile-nav-btn ${isMoreActive || showMoreSheet ? 'active-mobile-btn' : ''}`}
            onClick={() => setShowMoreSheet(!showMoreSheet)}
            aria-label="More Features"
          >
            <div className="mobile-icon-wrap">
              <MoreHorizontal size={20} />
              {isMoreActive && <span className="active-dot-more" />}
            </div>
            <span className="mobile-nav-text">{l.more}</span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Bottom Sheet for Secondary Features */}
      {showMoreSheet && (
        <div className="more-sheet-overlay fade-in" onClick={() => setShowMoreSheet(false)}>
          <div className="more-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-drag-handle" />
            <div className="sheet-header">
              <h3>{l.services}</h3>
              <button className="sheet-close-btn" onClick={() => setShowMoreSheet(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="sheet-items-list">
              {secondaryTabs.map(item => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <div
                    key={item.id}
                    className={`sheet-item-row ${isActive ? 'active-sheet-item' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id)
                      setShowMoreSheet(false)
                    }}
                  >
                    <div className="sheet-item-icon">
                      <Icon size={20} />
                    </div>
                    <div className="sheet-item-info">
                      <div className="sheet-item-title">{item.label}</div>
                      <div className="sheet-item-sub">{item.sub}</div>
                    </div>
                    <ChevronRight size={16} className="sheet-arrow" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
