import { useState } from 'react'
import { 
  Users, 
  Banknote, 
  GraduationCap, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react'
import { SCHEMES, I18N } from '../data/scholarshipData'
import { getLocalizedSchemes } from '../data/localizationEngine'
import './FamilyOverview.css'

export default function FamilyOverview({ 
  household, 
  activeStudent, 
  lang,
  onSelectStudent, 
  onToast 
}) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newChildName, setNewChildName] = useState('')
  const [newChildClass, setNewChildClass] = useState('Class IX (EMRS School)')
  const t = I18N[lang] || I18N.en
  const localizedSchemes = getLocalizedSchemes(SCHEMES, lang)

  const handleAddMember = (e) => {
    e.preventDefault()
    if (!newChildName.trim()) return
    setShowAddModal(false)
    onToast(`Added ${newChildName} to Family Registry ${household.householdId}`, 'success')
    setNewChildName('')
  }

  return (
    <div className="family-view fade-in">
      {/* Household Header Card */}
      <section className="gov-card family-head-card">
        <div className="head-info-col">
          <div className="family-badges-row">
            <span className="badge badge-primary">{t.familyRegistry || 'MoTA Unified Tribal Family Registry'}</span>
            <span className="badge badge-neutral">{t.rationCard || 'Ration Card:'} {household.rationCardNumber}</span>
          </div>

          <h1 className="family-household-title">
            {household.headOfHousehold}'s {t.household || 'Household'} ({household.tribalGroup})
          </h1>

          <div className="family-loc-row">
            <MapPin size={15} />
            <span>{household.village}, {t.village || 'District'} {household.district}, {household.state}</span>
          </div>
        </div>

        <div className="family-stat-boxes">
          <div className="stat-pill-box">
            <span className="pill-box-label">{t.totalHouseholdDbt || 'Total Household DBT Received'}</span>
            <span className="pill-box-val">{household.totalDisbursedToHousehold}</span>
            <span className="pill-box-sub">{t.across5Schemes || 'Across 5 MoTA Schemes'}</span>
          </div>

          <button 
            className="btn btn-primary add-child-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>{t.addSiblingBtn || 'Register Child / Sibling'}</span>
          </button>
        </div>
      </section>

      {/* Children Across Schemes Grid */}
      <section className="members-section">
        <div className="section-head-row">
          <div>
            <h2 className="section-heading">{t.registeredChildren || 'Children in Household & Active Scholarships'}</h2>
            <p className="section-desc">
              {t.portfolioSub || 'Track scholarship lifecycle and verification progress for every child in the family from a single dashboard.'}
            </p>
          </div>
        </div>

        <div className="children-cards-grid">
          {household.members.map(member => {
            const isCurrentlySelected = member.id === activeStudent.id
            const activeApp = member.applications?.[0]
            const activeSchemeMeta = localizedSchemes.find(s => s.id === activeApp?.schemeId)
            const memberDisplayName = member.name

            return (
              <div 
                key={member.id} 
                className={`gov-card child-card ${isCurrentlySelected ? 'selected-child-card' : ''}`}
              >
                <div className="child-card-header">
                  <div className="child-avatar-wrap">{member.avatarInitials}</div>
                  <div className="child-meta-wrap">
                    <div className="child-name-row">
                      <h3 className="child-name">{memberDisplayName}</h3>
                      {member.isPrimary && <span className="badge badge-primary">{t.primaryScholar || 'Primary'}</span>}
                    </div>
                    <div className="child-relation">{member.relation} • {member.educationLevel}</div>
                    <div className="child-inst">
                      <Building2 size={13} />
                      <span>{member.institution}</span>
                    </div>
                  </div>
                </div>

                {/* Active Scholarship Status for this Child */}
                <div className="child-scheme-box">
                  {activeApp ? (
                    <>
                      <div className="child-scheme-head">
                        <span className="badge badge-neutral">{activeApp.portal}</span>
                        <span className={`badge ${activeApp.status === 'disbursed' ? 'badge-success' : 'badge-warning'}`}>
                          {activeApp.status === 'disbursed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {activeApp.statusText}
                        </span>
                      </div>
                      <div className="child-scheme-title">{activeSchemeMeta?.name || activeApp.schemeId}</div>
                      <div className="child-dbt-amount">
                        {t.disbursedAmount || 'Sanctioned:'} <strong>{activeApp.sanctionAmount}</strong>
                      </div>
                    </>
                  ) : (
                    <div className="no-active-scheme-notice">
                      <GraduationCap size={20} className="notice-icon" />
                      <div>
                        <strong>{t.currentGrant || 'Eligible for NFST Doctoral Fellowship'}</strong>
                        <p>{t.switchMemberOrExplore || 'No active scholarship currently availed. Student is eligible to apply.'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sibling Card Actions */}
                <div className="child-card-actions">
                  <span className="child-apaar">APAAR: {member.apaarId}</span>
                  <button 
                    className={`btn btn-sm ${isCurrentlySelected ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onSelectStudent(member)}
                  >
                    <span>{isCurrentlySelected ? (t.activeStudentBadge || 'Currently Viewing') : (t.switchStudent || 'Switch Focus to this Child')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Add Sibling Modal */}
      {showAddModal && (
        <div className="modal-overlay fade-in">
          <div className="modal-content add-child-modal gov-card">
            <h2 className="modal-heading">{t.addMemberModalTitle || 'Register Sibling to Household Pool'}</h2>
            <p className="modal-sub">
              {t.rationCard || 'Link another child to Ration Card'} {household.rationCardNumber}
            </p>

            <form onSubmit={handleAddMember} className="add-child-form">
              <div className="form-group">
                <label className="form-label">{t.childFullName || 'Child Full Name (as per Aadhaar)'}</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Mangal Munda"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.currentClassLevel || 'Current Academic Level & School'}</label>
                <select 
                  value={newChildClass}
                  onChange={(e) => setNewChildClass(e.target.value)}
                  className="form-select"
                >
                  <option>Class IX (Eklavya Model Residential School)</option>
                  <option>Class X (Govt. High School)</option>
                  <option>Diploma / Polytechnic 1st Year</option>
                  <option>Undergraduate Degree (College)</option>
                </select>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  {t.cancel || 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary">
                  <ShieldCheck size={16} />
                  <span>{t.addToRegistry || 'Verify via DigiLocker & Add'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
