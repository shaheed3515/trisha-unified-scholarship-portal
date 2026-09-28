import { useState } from 'react'
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Banknote, 
  Building2, 
  Download, 
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { SCHEMES, I18N } from '../data/scholarshipData'
import { getLocalizedSchemes } from '../data/localizationEngine'
import './ApplicationTracker.css'

export default function ApplicationTracker({ 
  activeStudent, 
  lang,
  onResolveDeficiency,
  onDownloadSlip 
}) {
  const t = I18N[lang] || I18N.en
  const localizedSchemes = getLocalizedSchemes(SCHEMES, lang)
  const applications = activeStudent.applications || []
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || null)

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0]
  const schemeMeta = localizedSchemes.find(s => s.id === selectedApp?.schemeId) || {}

  const studentDisplayName = activeStudent.name

  if (!selectedApp) {
    return (
      <div className="gov-card empty-tracker-card">
        <Clock size={32} className="empty-icon" />
        <h3>{studentDisplayName} {t.noActiveApp || 'No Active Applications Found'}</h3>
        <p>{t.switchMemberOrExplore || 'Switch to another household member or explore all 5 schemes to apply.'}</p>
      </div>
    )
  }

  return (
    <div className="tracker-view fade-in">
      <div className="tracker-header">
        <div>
          <h1 className="tracker-title">{t.trackerTitle || 'End-to-End Application & Verification Tracker'}</h1>
          <p className="tracker-sub">
            {t.trackerSub || 'Real-time synchronization across Institute, State Tribal Welfare Directorate, MoTA, and PFMS'}
          </p>
        </div>

        {/* Multi-Application Selector Tabs */}
        {applications.length > 1 && (
          <div className="app-select-pills">
            {applications.map(app => (
              <button 
                key={app.id}
                className={`app-pill-btn ${selectedApp.id === app.id ? 'active-app-pill' : ''}`}
                onClick={() => setSelectedAppId(app.id)}
              >
                <span>{app.portal}: {app.id}</span>
                <span className={`pill-dot ${app.status === 'disbursed' ? 'dot-success' : 'dot-warning'}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="tracker-layout-grid">
        {/* Left Column: Stage-by-Stage Verification Timeline */}
        <div className="tracker-main-col">
          <div className="gov-card timeline-card">
            <div className="timeline-header-row">
              <div>
                <span className="badge badge-primary">{selectedApp.portal}</span>
                <h2 className="timeline-scheme-title">{schemeMeta.name || selectedApp.schemeId}</h2>
                <div className="app-meta-code">{t.appId || 'Application ID:'} <strong>{selectedApp.id}</strong> ({t.session || 'Session'} {selectedApp.academicSession})</div>
              </div>
              <div className="timeline-status-tag">
                <span className={`badge ${selectedApp.status === 'disbursed' ? 'badge-success' : 'badge-warning'}`}>
                  {selectedApp.statusText}
                </span>
              </div>
            </div>

            {/* Stages Stack */}
            <div className="timeline-stages-stack">
              {selectedApp.stages.map((stage, idx) => {
                const isPassed = stage.done
                const isActive = stage.active
                const isPending = !stage.done && !stage.active

                return (
                  <div key={stage.id} className={`timeline-stage-item ${isPassed ? 'stage-passed' : isActive ? 'stage-active' : 'stage-pending'}`}>
                    <div className="stage-marker-col">
                      <div className="stage-node-circle">
                        {isPassed ? (
                          <CheckCircle2 size={16} />
                        ) : isActive ? (
                          <Clock size={16} />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      {idx < selectedApp.stages.length - 1 && <div className="stage-connector-line" />}
                    </div>

                    <div className="stage-content-col">
                      <div className="stage-title-row">
                        <h3 className="stage-name">{stage.title}</h3>
                        {stage.date && <span className="stage-date-text">{stage.date}</span>}
                      </div>

                      {stage.remarks && (
                        <p className="stage-remarks-text">{stage.remarks}</p>
                      )}

                      {isActive && (
                        <div className="active-stage-indicator">
                          <span className="pulse-ping" />
                          <span>{t.currentlyUnderProcess || 'Currently Under Process by State Nodal Verification Officers'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Deficiencies Notice Card if Any */}
          {selectedApp.deficiencies?.length > 0 && (
            <div className="gov-card deficiency-resolution-card">
              <div className="def-card-top">
                <AlertTriangle size={20} className="def-warning-icon" />
                <div>
                  <h3 className="def-card-title">{t.stateNodalQuery || 'State Nodal Officer Query / Deficiency'}</h3>
                  <p className="def-card-desc">{selectedApp.deficiencies[0]?.detail}</p>
                </div>
              </div>

              <div className="def-resolution-action">
                <button 
                  className="btn btn-warning"
                  onClick={() => onResolveDeficiency(selectedApp.id)}
                >
                  <ShieldCheck size={16} />
                  <span>{t.reverifyDigilocker || 'Re-verify via DigiLocker Live Sync'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: PFMS DBT Payment Information & Sanction Order */}
        <div className="tracker-side-col">
          {/* DBT Disbursement Slip Card */}
          {selectedApp.dbtDetails ? (
            <div className="gov-card dbt-slip-card">
              <div className="slip-top-badge">
                <ShieldCheck size={16} />
                <span>{t.pfmsFull || 'Public Financial Management System'}</span>
              </div>

              <div className="slip-amount-box">
                <div className="slip-amount-label">{t.directBenefitTransfer || 'Direct Benefit Transfer'}</div>
                <div className="slip-amount-value">{selectedApp.dbtDetails.amountCredited}</div>
                <div className="slip-credit-date">{t.creditedOn || 'Credited on'} {selectedApp.dbtDetails.creditDate}</div>
              </div>

              <div className="slip-details-list">
                <div className="slip-row">
                  <span className="slip-label">{t.beneficiary || 'Beneficiary'}</span>
                  <span className="slip-val">{studentDisplayName}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-label">Aadhaar (NPCI)</span>
                  <span className="slip-val">{activeStudent.aadhaarMasked}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-label">{t.creditedBank || 'Credited Bank'}</span>
                  <span className="slip-val">{selectedApp.dbtDetails.bankName}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-label">Account No.</span>
                  <span className="slip-val">{selectedApp.dbtDetails.accountMasked}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-label">{t.utrRef || 'RBI / UTR Ref'}</span>
                  <span className="slip-val code-text">{selectedApp.dbtDetails.utrNumber}</span>
                </div>
                <div className="slip-row">
                  <span className="slip-label">MoTA Sanction</span>
                  <span className="slip-val code-text">{selectedApp.dbtDetails.pfmsSanctionId}</span>
                </div>
              </div>

              <button className="btn btn-secondary btn-full slip-download-btn" onClick={onDownloadSlip}>
                <Download size={15} />
                <span>{t.downloadSanctionSlip || 'Download Official DBT Receipt (PDF)'}</span>
              </button>
            </div>
          ) : (
            <div className="gov-card dbt-pending-card">
              <Banknote size={28} className="dbt-pending-icon" />
              <h3>{t.directBenefitTransfer || 'Direct Benefit Transfer (DBT)'} Pending</h3>
              <p>
                Sanction amount of <strong>{selectedApp.sanctionAmount}</strong> will be 
                credited directly into Aadhaar-seeded Bank Account via PFMS once State Tribal Welfare clearance completes.
              </p>
            </div>
          )}

          {/* Quick Help Box */}
          <div className="gov-card nodal-help-card">
            <h3 className="help-card-title">{t.helpSupport || 'Need Help with this Stage?'}</h3>
            <p className="help-card-text">
              {t.allRecordsSecured || 'If your application has been at the same stage for more than 15 days, use the Tribal AI Sahayak to automatically register an expedited grievance ticket.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
