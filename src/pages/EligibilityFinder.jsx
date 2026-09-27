import { useState } from 'react'
import { 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Banknote, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  FileText, 
  HelpCircle,
  Award,
  Zap,
  Check,
  AlertCircle
} from 'lucide-react'
import { SCHEMES, CONFLICT_RULES } from '../data/scholarshipData'
import './EligibilityFinder.css'

export default function EligibilityFinder({ 
  activeStudent, 
  onTriggerConflict, 
  onNavigate,
  onToast 
}) {
  const [eduLevel, setEduLevel] = useState('ug_premier')
  const [incomeBand, setIncomeBand] = useState('below_2_5l')
  const [instType, setInstType] = useState('premier')
  const [hasNetJrf, setHasNetJrf] = useState('none')
  const [foreignAdmission, setForeignAdmission] = useState(false)
  const [studyAbroad, setStudyAbroad] = useState(false)
  const [calculated, setCalculated] = useState(true)

  // Quick Preset Scenarios for Hackathon Demo
  const applyPreset = (type) => {
    if (type === 'premier') {
      setEduLevel('ug_premier')
      setIncomeBand('below_2_5l')
      setInstType('premier')
      setHasNetJrf('none')
      setStudyAbroad(false)
      onToast('Loaded Scenario: ST Student in Premier Institute (NIT/IIT)', 'info')
    } else if (type === 'phd') {
      setEduLevel('phd')
      setIncomeBand('below_6l')
      setInstType('central_univ')
      setHasNetJrf('jrf_qualified')
      setStudyAbroad(false)
      onToast('Loaded Scenario: Research Scholar with UGC-NET JRF', 'info')
    } else if (type === 'abroad') {
      setEduLevel('overseas')
      setIncomeBand('below_6l')
      setInstType('foreign')
      setHasNetJrf('none')
      setStudyAbroad(true)
      onToast('Loaded Scenario: ST Student with Foreign University Offer', 'info')
    } else if (type === 'school') {
      setEduLevel('school_9_10')
      setIncomeBand('below_2_5l')
      setInstType('school')
      setHasNetJrf('none')
      setStudyAbroad(false)
      onToast('Loaded Scenario: High School Student (Class 9-10)', 'info')
    }
    setCalculated(true)
  }

  // Determine eligible schemes based on answers
  const getEligibilityVerdict = () => {
    let matchedSchemeId = 'post-matric'
    let reasons = []
    let warnings = []

    if (studyAbroad || eduLevel === 'overseas') {
      matchedSchemeId = 'nos'
      reasons.push('Candidate pursuing Masters / Ph.D. abroad in QS World Ranked University.')
      if (incomeBand === 'above_6l') {
        warnings.push('Annual family income exceeds ₹6.00 Lakhs cap for MoTA Overseas grant.')
      } else {
        reasons.push('Family income within ₹6.00 Lakhs per annum limit.')
      }
    } else if (eduLevel === 'phd' || hasNetJrf === 'jrf_qualified') {
      matchedSchemeId = 'nfst'
      reasons.push('Candidate enrolled in M.Phil / Ph.D. research programme with UGC-NET/JRF qualification.')
      reasons.push('Direct stipend of ₹37,000/month (JRF) via Canara Bank SFMP.')
    } else if (instType === 'premier' || eduLevel === 'ug_premier') {
      matchedSchemeId = 'top-class'
      reasons.push('Enrolled in Notified Premier Institution (IIT, NIT, AIIMS, IIM, NLU).')
      reasons.push('Covers full tuition + ₹2,000/month maintenance allowance + ₹45,000/yr books.')
    } else if (eduLevel === 'school_9_10') {
      matchedSchemeId = 'pre-matric'
      reasons.push('ST Student studying in Class 9 or 10 in recognized school/EMRS.')
      reasons.push('Monthly maintenance of ₹150 - ₹750 + annual book grant.')
    } else {
      matchedSchemeId = 'post-matric'
      reasons.push('Pursuing post-matriculation study after Class 10 (Degree/Diploma/PG).')
      reasons.push('Allowance of ₹230 - ₹1,200/month based on hostel/day-scholar status.')
    }

    const scheme = SCHEMES.find(s => s.id === matchedSchemeId) || SCHEMES[1]
    
    // Check for conflict against current student active scheme
    const activeApp = activeStudent?.applications?.find(a => a.status === 'disbursed' || a.status === 'sanctioned' || a.status === 'under_review')
    const hasActiveConflict = activeApp && activeApp.schemeId !== matchedSchemeId
    const activeSchemeObj = hasActiveConflict ? SCHEMES.find(s => s.id === activeApp.schemeId) : null

    return {
      scheme,
      reasons,
      warnings,
      hasActiveConflict,
      activeApp,
      activeSchemeObj
    }
  }

  const verdict = getEligibilityVerdict()

  return (
    <div className="eligibility-container fade-in">
      {/* Top Banner */}
      <section className="gov-card eligibility-header-card">
        <div className="eligibility-title-group">
          <div className="badge-row">
            <span className="badge badge-primary">MoTA Smart Rule Engine</span>
            <span className="badge badge-warning">SIH 2026 Problem 26238</span>
          </div>
          <h1 className="eligibility-main-title">
            <Sparkles size={24} className="sparkle-icon" />
            Smart Scholarship Eligibility & Conflict Engine
          </h1>
          <p className="eligibility-desc">
            Instantly evaluate eligibility across all 5 MoTA ST scholarship schemes, compute entitlements, and verify compliance with the <strong>MoTA One-Active-Scholarship Rule</strong>.
          </p>
        </div>

        {/* 1-Click Demo Scenarios */}
        <div className="preset-bar">
          <span className="preset-label"><Zap size={14} /> Quick Demo Scenarios:</span>
          <div className="preset-buttons">
            <button className={`preset-btn ${eduLevel === 'ug_premier' && !studyAbroad ? 'active' : ''}`} onClick={() => applyPreset('premier')}>
              🎓 NIT/IIT Student (Top Class)
            </button>
            <button className={`preset-btn ${eduLevel === 'phd' ? 'active' : ''}`} onClick={() => applyPreset('phd')}>
              🔬 Ph.D. Scholar (NFST)
            </button>
            <button className={`preset-btn ${studyAbroad ? 'active' : ''}`} onClick={() => applyPreset('abroad')}>
              ✈️ Abroad Study (NOS)
            </button>
            <button className={`preset-btn ${eduLevel === 'school_9_10' ? 'active' : ''}`} onClick={() => applyPreset('school')}>
              📚 Class 9-10 (Pre-Matric)
            </button>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="eligibility-grid">
        {/* Left Column: Interactive Questions */}
        <div className="gov-card questionnaire-card">
          <div className="card-header-bar">
            <h2><FileText size={18} /> Student Eligibility Criteria</h2>
            <button className="reset-btn" onClick={() => applyPreset('premier')} title="Reset Criteria">
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <form className="eligibility-form" onSubmit={(e) => e.preventDefault()}>
            {/* Question 1: Education Level */}
            <div className="form-group">
              <label className="form-label">
                1. Current Level of Study
                <span className="req">*</span>
              </label>
              <div className="radio-tile-grid">
                <label className={`radio-tile ${eduLevel === 'school_9_10' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="eduLevel" 
                    value="school_9_10" 
                    checked={eduLevel === 'school_9_10'}
                    onChange={() => { setEduLevel('school_9_10'); setStudyAbroad(false); }} 
                  />
                  <div className="tile-content">
                    <span className="tile-title">Class 9 – 10 (Secondary)</span>
                    <span className="tile-sub">EMRS, Govt or Recognized School</span>
                  </div>
                </label>

                <label className={`radio-tile ${eduLevel === 'ug_college' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="eduLevel" 
                    value="ug_college" 
                    checked={eduLevel === 'ug_college'}
                    onChange={() => { setEduLevel('ug_college'); setStudyAbroad(false); }} 
                  />
                  <div className="tile-content">
                    <span className="tile-title">College / Degree / Diploma</span>
                    <span className="tile-sub">General Post-Matriculation Study</span>
                  </div>
                </label>

                <label className={`radio-tile ${eduLevel === 'ug_premier' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="eduLevel" 
                    value="ug_premier" 
                    checked={eduLevel === 'ug_premier'}
                    onChange={() => { setEduLevel('ug_premier'); setStudyAbroad(false); }} 
                  />
                  <div className="tile-content">
                    <span className="tile-title">Premier Institute (IIT/NIT/AIIMS)</span>
                    <span className="tile-sub">Notified Top-Class Institutions</span>
                  </div>
                </label>

                <label className={`radio-tile ${eduLevel === 'phd' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="eduLevel" 
                    value="phd" 
                    checked={eduLevel === 'phd'}
                    onChange={() => { setEduLevel('phd'); setStudyAbroad(false); }} 
                  />
                  <div className="tile-content">
                    <span className="tile-title">M.Phil / Ph.D. Research</span>
                    <span className="tile-sub">Doctoral Fellowship Programs</span>
                  </div>
                </label>

                <label className={`radio-tile ${eduLevel === 'overseas' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="eduLevel" 
                    value="overseas" 
                    checked={eduLevel === 'overseas'}
                    onChange={() => { setEduLevel('overseas'); setStudyAbroad(true); }} 
                  />
                  <div className="tile-content">
                    <span className="tile-title">Overseas / Foreign University</span>
                    <span className="tile-sub">Master's / Ph.D. abroad (QS Top 500)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Question 2: Family Income */}
            <div className="form-group">
              <label className="form-label">
                2. Annual Family Income
                <span className="req">*</span>
              </label>
              <div className="select-pill-group">
                <button 
                  type="button"
                  className={`pill-btn ${incomeBand === 'below_2_5l' ? 'selected' : ''}`}
                  onClick={() => setIncomeBand('below_2_5l')}
                >
                  Under ₹2.50 Lakhs / yr (Pre/Post Matric & Top Class eligible)
                </button>
                <button 
                  type="button"
                  className={`pill-btn ${incomeBand === 'below_6l' ? 'selected' : ''}`}
                  onClick={() => setIncomeBand('below_6l')}
                >
                  ₹2.50 Lakhs – ₹6.00 Lakhs / yr (NOS eligible)
                </button>
                <button 
                  type="button"
                  className={`pill-btn ${incomeBand === 'above_6l' ? 'selected' : ''}`}
                  onClick={() => setIncomeBand('above_6l')}
                >
                  Above ₹6.00 Lakhs / yr
                </button>
              </div>
            </div>

            {/* Question 3: National Exam Qualification */}
            <div className="form-group">
              <label className="form-label">
                3. National Qualifications & Entrance
              </label>
              <div className="select-pill-group">
                <button 
                  type="button"
                  className={`pill-btn ${hasNetJrf === 'none' ? 'selected' : ''}`}
                  onClick={() => setHasNetJrf('none')}
                >
                  Standard College Entrance / Merit
                </button>
                <button 
                  type="button"
                  className={`pill-btn ${hasNetJrf === 'jrf_qualified' ? 'selected' : ''}`}
                  onClick={() => { setHasNetJrf('jrf_qualified'); setEduLevel('phd'); }}
                >
                  UGC-NET / CSIR-NET (JRF Qualified)
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Engine Verdict & Conflict Analysis */}
        <div className="verdict-col">
          {/* Main Recommended Scheme Card */}
          <div className="gov-card result-scheme-card">
            <div className="result-badge-row">
              <span className="badge badge-success">
                <CheckCircle2 size={13} /> Recommended Scheme
              </span>
              <span className="badge badge-neutral">
                Source Portal: {verdict.scheme.portal}
              </span>
            </div>

            <div className="result-main-head">
              <div className="result-scheme-icon">{verdict.scheme.icon}</div>
              <div>
                <h3 className="result-scheme-name">{verdict.scheme.name}</h3>
                <span className="result-scheme-hi">{verdict.scheme.nameHi}</span>
              </div>
            </div>

            <div className="entitlement-highlight">
              <div className="entitlement-label">Estimated Financial Entitlement:</div>
              <div className="entitlement-value">{verdict.scheme.amountRange}</div>
              <div className="entitlement-desc">{verdict.scheme.description}</div>
            </div>

            <div className="eligibility-points">
              <h4>Eligibility Match Analysis:</h4>
              <ul>
                {verdict.reasons.map((r, i) => (
                  <li key={i}><Check size={14} className="green-chk" /> {r}</li>
                ))}
              </ul>
            </div>

            {/* ONE-ACTIVE-SCHOLARSHIP CONFLICT ALERT */}
            {verdict.hasActiveConflict && (
              <div className="conflict-alert-box">
                <div className="conflict-alert-title">
                  <AlertTriangle size={18} className="amber-alert-icon" />
                  <span>MoTA One-Active-Scholarship Conflict Detected</span>
                </div>
                <p className="conflict-alert-text">
                  Student <strong>{activeStudent.name}</strong> currently holds an active grant for{' '}
                  <strong>{verdict.activeSchemeObj?.name}</strong> (App ID: {verdict.activeApp?.id}). 
                  Under Central MoTA Guidelines, duplicate simultaneous scholarships are prohibited.
                </p>
                <div className="conflict-resolution-action">
                  <button 
                    className="btn btn-warning btn-sm"
                    onClick={() => onTriggerConflict(verdict.scheme.id)}
                  >
                    Open Automated NOC & Switch Wizard <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {!verdict.hasActiveConflict && (
              <div className="no-conflict-box">
                <ShieldCheck size={18} className="green-chk" />
                <span>Zero Conflict: Student has no conflicting active grants. Eligible to apply directly.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="result-actions">
              <button 
                className="btn btn-primary btn-full"
                onClick={() => onTriggerConflict(verdict.scheme.id)}
              >
                Proceed with DigiLocker Pre-filled Application <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Verification Readiness Wallet */}
          <div className="gov-card auto-verify-readiness">
            <h4><ShieldCheck size={16} /> Digital Document Wallet Readiness</h4>
            <p className="readiness-sub">
              Your verified credentials stored in TRISHA will be auto-attached:
            </p>
            <div className="readiness-chips">
              <span className="ready-chip"><CheckCircle2 size={12} /> Aadhaar (UIDAI e-KYC)</span>
              <span className="ready-chip"><CheckCircle2 size={12} /> ST Certificate (State e-District)</span>
              <span className="ready-chip"><CheckCircle2 size={12} /> APAAR Academic Credit Record</span>
              <span className="ready-chip"><CheckCircle2 size={12} /> Bank Passbook (PFMS DBT Linked)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
