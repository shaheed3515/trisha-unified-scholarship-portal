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
  Globe,
  BookOpen,
  Microscope,
  Compass
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
  const [studyAbroad, setStudyAbroad] = useState(false)

  // Quick Preset Scenarios for Hackathon Demo
  const applyPreset = (type) => {
    if (type === 'premier') {
      setEduLevel('ug_premier')
      setIncomeBand('below_2_5l')
      setInstType('premier')
      setHasNetJrf('none')
      setStudyAbroad(false)
      onToast?.('Loaded Scenario: ST Student in Premier Institute (NIT/IIT)', 'info')
    } else if (type === 'phd') {
      setEduLevel('phd')
      setIncomeBand('below_6l')
      setInstType('central_univ')
      setHasNetJrf('jrf_qualified')
      setStudyAbroad(false)
      onToast?.('Loaded Scenario: Research Scholar with UGC-NET JRF', 'info')
    } else if (type === 'abroad') {
      setEduLevel('overseas')
      setIncomeBand('below_6l')
      setInstType('foreign')
      setHasNetJrf('none')
      setStudyAbroad(true)
      onToast?.('Loaded Scenario: ST Student with Foreign University Offer', 'info')
    } else if (type === 'school') {
      setEduLevel('school_9_10')
      setIncomeBand('below_2_5l')
      setInstType('school')
      setHasNetJrf('none')
      setStudyAbroad(false)
      onToast?.('Loaded Scenario: High School Student (Class 9-10)', 'info')
    }
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
    <div className="eligibility-page fade-in">
      {/* Top Banner */}
      <section className="gov-card eligibility-hero-card">
        <div className="hero-top-row">
          <div className="badge-group">
            <span className="badge badge-primary">MoTA Smart Rule Engine</span>
            <span className="badge badge-warning">Problem Statement 26238</span>
          </div>
          <button className="reset-btn" onClick={() => applyPreset('premier')}>
            <RotateCcw size={14} /> Reset Filters
          </button>
        </div>

        <h1 className="hero-heading">
          <Sparkles size={22} className="sparkle-icon" />
          Smart Eligibility & One-Scholarship Conflict Engine
        </h1>
        
        <p className="hero-subtext">
          Evaluate eligibility across all 5 MoTA scholarship schemes, compute maximum financial allowances, and ensure compliance with the <strong>One-Active-Scholarship Rule</strong>.
        </p>

        {/* 1-Click Demo Scenarios */}
        <div className="preset-container">
          <span className="preset-title"><Zap size={14} /> Quick Demo Scenarios:</span>
          <div className="preset-buttons">
            <button 
              className={`preset-btn ${eduLevel === 'ug_premier' && !studyAbroad ? 'active' : ''}`} 
              onClick={() => applyPreset('premier')}
            >
              <GraduationCap size={14} /> NIT/IIT Student (Top Class)
            </button>
            <button 
              className={`preset-btn ${eduLevel === 'phd' ? 'active' : ''}`} 
              onClick={() => applyPreset('phd')}
            >
              <Microscope size={14} /> Ph.D. Scholar (NFST)
            </button>
            <button 
              className={`preset-btn ${studyAbroad ? 'active' : ''}`} 
              onClick={() => applyPreset('abroad')}
            >
              <Globe size={14} /> Study Abroad (NOS)
            </button>
            <button 
              className={`preset-btn ${eduLevel === 'school_9_10' ? 'active' : ''}`} 
              onClick={() => applyPreset('school')}
            >
              <BookOpen size={14} /> Class 9–10 (Pre-Matric)
            </button>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="eligibility-main-grid">
        {/* Left Column: Interactive Questions */}
        <div className="gov-card criteria-card">
          <div className="criteria-header">
            <h2><FileText size={18} /> Student Eligibility Criteria</h2>
            <span className="criteria-count">3 Evaluation Factors</span>
          </div>

          <form className="criteria-form" onSubmit={(e) => e.preventDefault()}>
            {/* Question 1: Education Level */}
            <div className="criteria-group">
              <label className="criteria-label">
                1. Level of Study
                <span className="req-star">*</span>
              </label>
              <div className="options-stack">
                <label className={`option-tile ${eduLevel === 'school_9_10' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="eduLevel" 
                    value="school_9_10" 
                    checked={eduLevel === 'school_9_10'}
                    onChange={() => { setEduLevel('school_9_10'); setStudyAbroad(false); }} 
                  />
                  <div className="option-info">
                    <span className="option-title">Class 9 – 10 (Secondary School)</span>
                    <span className="option-desc">EMRS, Govt or State-Recognized School</span>
                  </div>
                </label>

                <label className={`option-tile ${eduLevel === 'ug_college' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="eduLevel" 
                    value="ug_college" 
                    checked={eduLevel === 'ug_college'}
                    onChange={() => { setEduLevel('ug_college'); setStudyAbroad(false); }} 
                  />
                  <div className="option-info">
                    <span className="option-title">College / Degree / Diploma</span>
                    <span className="option-desc">General Post-Matriculation Study after Class 10</span>
                  </div>
                </label>

                <label className={`option-tile ${eduLevel === 'ug_premier' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="eduLevel" 
                    value="ug_premier" 
                    checked={eduLevel === 'ug_premier'}
                    onChange={() => { setEduLevel('ug_premier'); setStudyAbroad(false); }} 
                  />
                  <div className="option-info">
                    <span className="option-title">Premier Institute (IIT, NIT, AIIMS, IIM)</span>
                    <span className="option-desc">Notified Top-Class Institutions across India</span>
                  </div>
                </label>

                <label className={`option-tile ${eduLevel === 'phd' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="eduLevel" 
                    value="phd" 
                    checked={eduLevel === 'phd'}
                    onChange={() => { setEduLevel('phd'); setStudyAbroad(false); }} 
                  />
                  <div className="option-info">
                    <span className="option-title">M.Phil / Ph.D. Research</span>
                    <span className="option-desc">Doctoral Research Fellowship Program</span>
                  </div>
                </label>

                <label className={`option-tile ${eduLevel === 'overseas' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="eduLevel" 
                    value="overseas" 
                    checked={eduLevel === 'overseas'}
                    onChange={() => { setEduLevel('overseas'); setStudyAbroad(true); }} 
                  />
                  <div className="option-info">
                    <span className="option-title">Foreign / Overseas University</span>
                    <span className="option-desc">Master's or Ph.D. abroad (QS Top 500 ranked)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Question 2: Family Income */}
            <div className="criteria-group">
              <label className="criteria-label">
                2. Annual Family Parental Income
                <span className="req-star">*</span>
              </label>
              <div className="pill-group">
                <button 
                  type="button"
                  className={`pill-option ${incomeBand === 'below_2_5l' ? 'selected' : ''}`}
                  onClick={() => setIncomeBand('below_2_5l')}
                >
                  Under ₹2.50 Lakhs / year <span className="pill-tag">Pre/Post & Top Class</span>
                </button>
                <button 
                  type="button"
                  className={`pill-option ${incomeBand === 'below_6l' ? 'selected' : ''}`}
                  onClick={() => setIncomeBand('below_6l')}
                >
                  ₹2.50 Lakhs – ₹6.00 Lakhs / year <span className="pill-tag">NOS Eligible</span>
                </button>
                <button 
                  type="button"
                  className={`pill-option ${incomeBand === 'above_6l' ? 'selected' : ''}`}
                  onClick={() => setIncomeBand('above_6l')}
                >
                  Above ₹6.00 Lakhs / year
                </button>
              </div>
            </div>

            {/* Question 3: Competitive Exam */}
            <div className="criteria-group">
              <label className="criteria-label">
                3. Qualifying Exam Status
              </label>
              <div className="pill-group">
                <button 
                  type="button"
                  className={`pill-option ${hasNetJrf === 'none' ? 'selected' : ''}`}
                  onClick={() => setHasNetJrf('none')}
                >
                  Standard Institutional Merit / Entrance
                </button>
                <button 
                  type="button"
                  className={`pill-option ${hasNetJrf === 'jrf_qualified' ? 'selected' : ''}`}
                  onClick={() => { setHasNetJrf('jrf_qualified'); setEduLevel('phd'); }}
                >
                  UGC-NET / CSIR-NET (JRF Qualified)
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Engine Verdict & Conflict Analysis */}
        <div className="verdict-column">
          {/* Main Recommended Scheme Card */}
          <div className="gov-card result-card">
            <div className="result-tags-row">
              <span className="badge badge-success">
                <CheckCircle2 size={13} /> Recommended Scheme
              </span>
              <span className="badge badge-neutral">
                Source Portal: {verdict.scheme.portal}
              </span>
            </div>

            <div className="result-header">
              <div className="result-scheme-badge-icon">
                <Award size={28} className="award-icon" />
              </div>
              <div className="result-title-group">
                <h3 className="result-name">{verdict.scheme.name}</h3>
                <span className="result-name-hi">{verdict.scheme.nameHi}</span>
              </div>
            </div>

            <div className="entitlement-box">
              <div className="entitlement-tag">Estimated Financial Entitlement</div>
              <div className="entitlement-val">{verdict.scheme.amountRange}</div>
              <div className="entitlement-note">{verdict.scheme.description}</div>
            </div>

            <div className="analysis-section">
              <h4 className="analysis-title">Rule Engine Assessment:</h4>
              <ul className="analysis-list">
                {verdict.reasons.map((r, i) => (
                  <li key={i}>
                    <Check size={15} className="check-icon" /> 
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ONE-ACTIVE-SCHOLARSHIP CONFLICT ALERT */}
            {verdict.hasActiveConflict && (
              <div className="conflict-box">
                <div className="conflict-header">
                  <AlertTriangle size={18} className="conflict-icon" />
                  <span>MoTA One-Active-Scholarship Rule Conflict</span>
                </div>
                <p className="conflict-body">
                  Student <strong>{activeStudent?.name}</strong> currently holds an active grant for{' '}
                  <strong>{verdict.activeSchemeObj?.name}</strong> (App ID: {verdict.activeApp?.id}). 
                  MoTA guidelines prohibit simultaneous active scholarships.
                </p>
                <button 
                  className="btn btn-warning btn-sm conflict-btn"
                  onClick={() => onTriggerConflict(verdict.scheme.id)}
                >
                  <span>Open Automated NOC & Switch Wizard</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {!verdict.hasActiveConflict && (
              <div className="no-conflict-badge">
                <ShieldCheck size={18} className="shield-icon" />
                <span>Zero Conflict: Student is clear to apply with no active overlapping grants.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="result-actions-row">
              <button 
                className="btn btn-primary btn-full"
                onClick={() => onTriggerConflict(verdict.scheme.id)}
              >
                <span>Apply with DigiLocker Pre-filled Data</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Verification Readiness Wallet */}
          <div className="gov-card readiness-card">
            <h4 className="readiness-title">
              <ShieldCheck size={16} /> DigiLocker & APAAR Wallet Readiness
            </h4>
            <p className="readiness-text">
              Verified digital credentials stored in TRISHA will be automatically linked to this application:
            </p>
            <div className="readiness-grid">
              <div className="readiness-item"><CheckCircle2 size={13} className="item-chk" /> Aadhaar (UIDAI e-KYC)</div>
              <div className="readiness-item"><CheckCircle2 size={13} className="item-chk" /> ST Certificate (e-District)</div>
              <div className="readiness-item"><CheckCircle2 size={13} className="item-chk" /> APAAR Academic Record</div>
              <div className="readiness-item"><CheckCircle2 size={13} className="item-chk" /> Bank Account (PFMS DBT)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
