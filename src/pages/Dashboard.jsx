import { useState } from 'react'
import { 
  GraduationCap, 
  Banknote, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  FileText, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react'
import { SCHEMES, I18N } from '../data/scholarshipData'
import { getLocalizedSchemes } from '../data/localizationEngine'
import './Dashboard.css'

export default function Dashboard({ 
  activeStudent, 
  household, 
  lang, 
  onNavigate, 
  onTriggerConflict, 
  onResolveDeficiency 
}) {
  const t = I18N[lang] || I18N.en
  const localizedSchemes = getLocalizedSchemes(SCHEMES, lang)

  const applications = activeStudent.applications || []
  const activeCount = applications.filter(a => a.status === 'disbursed' || a.status === 'in_progress').length
  const totalDisbursed = applications.reduce((acc, app) => {
    if (app.dbtDetails?.amountCredited) {
      const num = parseInt(app.dbtDetails.amountCredited.replace(/[^0-9]/g, '')) || 0
      return acc + num
    }
    return acc
  }, 0)

  // Find if there is any pending action/deficiency
  const actionRequiredApp = applications.find(a => a.status === 'action_required' || a.deficiencies?.length > 0)

  return (
    <div className="dashboard-view fade-in">
      {/* Top Banner: Smart Eligibility Finder Banner */}
      <div 
        className="gov-card eligibility-cta-banner card-interactive" 
        onClick={() => onNavigate('eligibility')}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          background: 'linear-gradient(135deg, #16406c 0%, #1e4d82 100%)',
          color: '#ffffff',
          cursor: 'pointer',
          border: '1.5px solid rgba(255,153,51,0.4)',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '750px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff9933', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Sparkles size={15} /> {t.ruleEngineBadge || 'MoTA Smart Rule Engine · Problem 26238'}
          </div>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#ffffff' }}>
            {t.eligibilityBannerTitle || 'Not sure which scholarship matches your education & family income?'}
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4' }}>
            {t.eligibilityBannerDesc || 'Run the 1-minute Eligibility & Conflict Calculator to find your maximum monthly allowance and verify compliance with the MoTA One-Active-Scholarship rule.'}
          </p>
        </div>
        <button className="btn btn-warning" style={{ fontWeight: '700', gap: '6px', whiteSpace: 'nowrap' }}>
          <span>{t.launchEligibility || 'Launch Eligibility Engine'}</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Student Demographic Profile & National Identity */}
      <section className="student-hero-banner" aria-label="Student Profile Banner">
        <div className="banner-grid">
          <div className="hero-left">
            <div className="student-badge-row">
              <span className="badge badge-primary">{t.stCategory} ({household.tribalGroup})</span>
              <span className="badge badge-success">
                <ShieldCheck size={13} /> {t.digilockerVerified}
              </span>
              <span className="badge badge-neutral">APAAR: {activeStudent.apaarId}</span>
            </div>

            <h1 className="hero-student-name">
              {activeStudent.name}
            </h1>

            <p className="hero-student-institution">
              <Building2 size={15} />
              <span>{activeStudent.institution}</span>
              <span className="bullet-sep">•</span>
              <span>{activeStudent.academicProgram} ({activeStudent.yearOfStudy})</span>
            </p>

            <div className="hero-household-meta">
              <span>{t.village} <strong>{household.village}, {household.district}</strong></span>
              <span className="bullet-sep">•</span>
              <span>{t.annualIncome} <strong>{household.annualFamilyIncome}</strong></span>
            </div>
          </div>

          <div className="hero-right">
            <div className="family-aggregate-box">
              <div className="aggregate-label">{t.householdDbtPool}</div>
              <div className="aggregate-value">{household.totalDisbursedToHousehold}</div>
              <div className="aggregate-sub">{household.members.length} {t.acrossChildren}</div>
              <button 
                className="btn btn-sm btn-secondary aggregate-btn"
                onClick={() => onNavigate('family')}
              >
                <span>{t.householdViewBtn}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Action / Deficiency Banner if flagged by State Nodal Officer */}
      {actionRequiredApp && (
        <aside className="deficiency-banner card-interactive" aria-label="Action Required Notification">
          <div className="def-icon-wrap">
            <AlertTriangle size={24} />
          </div>
          <div className="def-info">
            <div className="def-header-row">
              <span className="badge badge-warning">{t.actionRequiredBadge}</span>
              <span className="def-app-code">{actionRequiredApp.id} ({actionRequiredApp.portal})</span>
            </div>
            <div className="def-title">{actionRequiredApp.deficiencies[0]?.title || t.incomeCertRequired}</div>
            <div className="def-detail">{actionRequiredApp.deficiencies[0]?.detail || t.deficiencyDetail}</div>
          </div>
          <button 
            className="btn btn-warning def-action-btn"
            onClick={() => onResolveDeficiency(actionRequiredApp.id)}
          >
            <ShieldCheck size={16} />
            <span>{t.resolveDigilocker}</span>
          </button>
        </aside>
      )}

      {/* Key Stats Row */}
      <section className="stats-metric-grid" aria-label="Scholarship Statistics">
        <div className="stat-card">
          <div className="stat-icon-wrap icon-primary">
            <GraduationCap size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-num">{activeCount}</div>
            <div className="stat-title">{t.activeSchemes}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap icon-success">
            <Banknote size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-num">₹{totalDisbursed.toLocaleString('en-IN')}</div>
            <div className="stat-title">{t.totalDisbursed} ({t.directDbt})</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap icon-warning">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-num">{applications.length}</div>
            <div className="stat-title">{t.pendingVerification}</div>
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigate('documents')} style={{cursor:'pointer'}}>
          <div className="stat-icon-wrap icon-info">
            <ShieldCheck size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-num">5 / 5</div>
            <div className="stat-title">{t.digilockerRecordsVerified}</div>
          </div>
        </div>
      </section>

      {/* Main Unified MoTA Portfolio Section */}
      <section className="portfolio-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">{t.portfolioTitle}</h2>
            <p className="section-sub">{t.portfolioSub}</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('schemes')}>
            <span>{t.exploreAllSchemes}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="applications-stack">
          {applications.map(app => {
            const schemeMeta = localizedSchemes.find(s => s.id === app.schemeId) || {}
            return (
              <div key={app.id} className="gov-card app-portfolio-card">
                <div className="app-card-header">
                  <div className="app-main-info">
                    <div className="portal-pill-row">
                      <span className="badge badge-primary">{app.portal}</span>
                      <span className="badge badge-neutral">{t.session} {app.academicSession}</span>
                      <span className="app-id-text">{t.ref} {app.id}</span>
                    </div>
                    <h3 className="app-scheme-title">{schemeMeta.name || app.schemeId}</h3>
                    <div className="app-sub-text">{schemeMeta.portalFullName}</div>
                  </div>

                  <div className="app-status-badge-wrap">
                    <span className={`badge ${app.status === 'disbursed' ? 'badge-success' : app.status === 'action_required' ? 'badge-warning' : 'badge-primary'}`}>
                      {app.status === 'disbursed' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                      {app.statusText}
                    </span>
                    <div className="sanction-amount-pill">{app.sanctionAmount}</div>
                  </div>
                </div>

                {/* Progress Stages Bar */}
                <div className="stages-progress-wrap">
                  <div className="progress-labels-row">
                    <span className="progress-label-text">
                      {t.verificationMilestones} ({t.stage} {app.stages.filter(s => s.done).length} {t.of} {app.stages.length})
                    </span>
                    <span className="progress-pct-text">
                      {Math.round((app.stages.filter(s => s.done).length / app.stages.length) * 100)}% {t.completed}
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{
                        width: `${(app.stages.filter(s => s.done).length / app.stages.length) * 100}%`,
                        background: app.status === 'disbursed' ? 'var(--success-500)' : 'var(--primary-600)'
                      }} 
                    />
                  </div>
                </div>

                {/* Direct Benefit Transfer (DBT) Receipt Box if Disbursed */}
                {app.dbtDetails && (
                  <div className="dbt-receipt-card">
                    <div className="dbt-card-header">
                      <div className="dbt-header-title">
                        <Banknote size={16} />
                        <span>{t.pfmsConfirmation}</span>
                      </div>
                      <span className="badge badge-success">{t.pfmsValidated}</span>
                    </div>

                    <div className="dbt-meta-grid">
                      <div className="dbt-meta-item">
                        <span className="meta-label">{t.disbursedAmount}</span>
                        <span className="meta-val highlight-val">{app.dbtDetails.amountCredited}</span>
                      </div>
                      <div className="dbt-meta-item">
                        <span className="meta-label">{t.creditDate}</span>
                        <span className="meta-val">{app.dbtDetails.creditDate}</span>
                      </div>
                      <div className="dbt-meta-item">
                        <span className="meta-label">{t.bankBranch}</span>
                        <span className="meta-val">{app.dbtDetails.bankName}</span>
                      </div>
                      <div className="dbt-meta-item">
                        <span className="meta-label">{t.utrNumber}</span>
                        <span className="meta-val code-val">{app.dbtDetails.utrNumber}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Action Footer */}
                <div className="app-card-footer">
                  <div className="footer-left-meta">
                    {t.lastNodalAction} <strong>{app.lastActionDate}</strong>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onNavigate('tracker')}
                  >
                    <span>{t.fullTimeline}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Cross-Scheme Eligibility & Anti-Double Dipping Demonstration Box */}
      <section className="conflict-demo-section gov-card">
        <div className="conflict-demo-header">
          <div className="conflict-demo-title-group">
            <div className="conflict-icon-wrap">
              <Award size={22} />
            </div>
            <div>
              <h3 className="conflict-demo-heading">{t.conflictDemoHeading}</h3>
              <p className="conflict-demo-sub">
                {t.conflictDemoSub}
              </p>
            </div>
          </div>
        </div>

        <div className="conflict-interactive-actions">
          <button 
            className="btn btn-saffron"
            onClick={() => onTriggerConflict('nfst')}
          >
            <AlertTriangle size={16} />
            <span>{t.simulateNfst}</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => onTriggerConflict('top-class')}
          >
            <ShieldCheck size={16} />
            <span>{t.simulateTopClass}</span>
          </button>
        </div>
      </section>
    </div>
  )
}
