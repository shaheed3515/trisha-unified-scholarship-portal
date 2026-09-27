import { useState, useEffect } from 'react'
import { 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  AlertTriangle, 
  Building2, 
  Lock, 
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import './ConflictModal.css'

export default function ConflictModal({ 
  conflictData, 
  targetScheme, 
  student, 
  onClose, 
  onRelinquishAndProceed 
}) {
  const [analyzing, setAnalyzing] = useState(true)
  const [step, setStep] = useState('audit') // 'audit' | 'relinquish_form' | 'success'
  const [relinquishConfirmed, setRelinquishConfirmed] = useState(false)

  useEffect(() => {
    // Simulate real-time API federation audit across NSP, SFMP, and NOS databases
    const timer = setTimeout(() => {
      setAnalyzing(false)
    }, 1100)
    return () => clearTimeout(timer)
  }, [])

  if (!conflictData) return null

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content gov-card">
        {/* Modal Top Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="audit-icon-wrap">
              <ShieldAlert size={22} className="audit-icon" />
            </div>
            <div>
              <div className="audit-badge-row">
                <span className="badge badge-danger">MoTA Central Anti-Duplication Engine</span>
                <span className="badge badge-neutral">Rule 11 / GFR 2017</span>
              </div>
              <h2 className="modal-heading">Cross-Portal Scheme Conflict Detected</h2>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} title="Dismiss">
            <X size={18} />
          </button>
        </div>

        {analyzing ? (
          <div className="scanning-container">
            <RefreshCw size={36} className="scanning-spinner" />
            <div className="scanning-text">
              <strong>Querying Unified Central Scholarship Registry...</strong>
              <span>Correlating Aadhaar {student.aadhaarMasked} across NSP (Pre/Post-Matric), SFMP (Canara Bank NFST), & NOS</span>
            </div>
            <div className="registry-pills">
              <span className="reg-pill active">NSP Database [Connected]</span>
              <span className="reg-pill active">SFMP Canara Bank [Connected]</span>
              <span className="reg-pill active">NOS Overseas Registry [Connected]</span>
              <span className="reg-pill active">PFMS Direct Benefit Transfer [Linked]</span>
            </div>
          </div>
        ) : step === 'audit' ? (
          <div className="audit-body fade-in">
            {/* Alert Summary Box */}
            <div className="conflict-summary-box">
              <div className="conflict-summary-title">
                <AlertTriangle size={18} />
                <span>Simultaneous Availing Barred by Government Regulations</span>
              </div>
              <p className="conflict-summary-desc">{conflictData.reason}</p>
            </div>

            {/* Side-by-Side Scheme Comparison */}
            <div className="comparison-grid">
              {/* Existing Active Scheme */}
              <div className="scheme-audit-card existing-card">
                <div className="scheme-audit-tag">Current Active Scheme (Locked)</div>
                <div className="scheme-audit-name">{conflictData.existingApp?.schemeId?.toUpperCase()}</div>
                <div className="scheme-audit-meta">
                  <span>Portal: <strong>{conflictData.existingApp?.portal}</strong></span>
                  <span>App ID: <strong>{conflictData.existingApp?.id}</strong></span>
                  <span>DBT Status: <strong>{conflictData.existingApp?.statusText}</strong></span>
                  <span>Annual Grant: <strong>{conflictData.existingApp?.sanctionAmount}</strong></span>
                </div>
              </div>

              {/* Target Requested Scheme */}
              <div className="scheme-audit-card target-card">
                <div className="scheme-audit-tag">Target Requested Scheme</div>
                <div className="scheme-audit-name">{targetScheme.name}</div>
                <div className="scheme-audit-meta">
                  <span>Target Portal: <strong>{targetScheme.portal}</strong></span>
                  <span>Target Amount: <strong>{targetScheme.amountRange}</strong></span>
                  <span>Category: <strong>{targetScheme.category}</strong></span>
                  <span>Eligibility Check: <strong style={{color:'var(--success-600)'}}>Academic Criteria Passed</strong></span>
                </div>
              </div>
            </div>

            {/* Policy & Legal Citation */}
            <div className="policy-citation-card">
              <div className="citation-header">
                <FileText size={16} />
                <span>Official MoTA Guideline Clause</span>
              </div>
              <p className="citation-text">"{conflictData.policyClause}"</p>
              {conflictData.recommendation && (
                <div className="recommendation-text">
                  <strong>Ministry Recommendation:</strong> {conflictData.recommendation}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="modal-actions-row">
              <button className="btn btn-secondary" onClick={onClose}>
                Keep Existing Scholarship & Exit
              </button>
              
              {conflictData.canRelinquish && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setStep('relinquish_form')}
                >
                  <span>Initiate Transition / Surrender NOC</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        ) : step === 'relinquish_form' ? (
          <div className="relinquish-body fade-in">
            <div className="relinquish-instructions">
              <h3 className="section-subheading">MoTA Form 4B: Automated Scheme Transition Declaration</h3>
              <p className="section-para">
                By submitting this digital declaration via Aadhaar e-Sign, you authorize the Ministry of Tribal Affairs 
                to place a provisional hold on your existing Post-Matric allocation in the event your 
                application for <strong>{targetScheme.name}</strong> is selected on merit.
              </p>
            </div>

            <div className="declaration-checkbox-card">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={relinquishConfirmed}
                  onChange={(e) => setRelinquishConfirmed(e.target.checked)}
                />
                <span className="checkbox-text">
                  I, <strong>{student.name}</strong> (Aadhaar {student.aadhaarMasked}), declare that I understand 
                  I cannot receive dual scholarship disbursements. I request the State Nodal Officer to issue an automated 
                  No-Objection Certificate (NOC) and transfer my beneficiary profile to <strong>{targetScheme.shortName}</strong> upon sanction.
                </span>
              </label>
            </div>

            <div className="modal-actions-row">
              <button className="btn btn-secondary" onClick={() => setStep('audit')}>
                Back to Conflict Audit
              </button>
              <button 
                className="btn btn-primary"
                disabled={!relinquishConfirmed}
                onClick={() => {
                  setStep('success')
                  setTimeout(() => {
                    onRelinquishAndProceed()
                  }, 2200)
                }}
              >
                <CheckCircle2 size={16} />
                <span>Digitally Sign & Proceed with Application</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="success-body fade-in">
            <CheckCircle2 size={54} className="success-check-icon" />
            <h3 className="success-title">Automated Transition Request Generated</h3>
            <p className="success-para">
              MoTA Conflict Clearance Reference: <strong>NOC-MOTA-2026-JH9182</strong>
            </p>
            <p className="success-sub">
              Your provisional application for <strong>{targetScheme.name}</strong> has been registered. 
              Dual-disbursement locks have been placed on your profile in accordance with Ministry guidelines.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
