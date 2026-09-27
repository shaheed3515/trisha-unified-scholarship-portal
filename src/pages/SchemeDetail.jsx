import { useContext, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../App'
import { SCHEMES, MOCK_APPLICATIONS } from '../data/mockData'
import './SchemeDetail.css'

export default function SchemeDetail() {
  const { id } = useParams()
  const { lang, addToast } = useContext(AppContext)
  const navigate = useNavigate()
  const hi = lang === 'hi'
  const scheme = SCHEMES.find(s => s.id === id)
  const app = MOCK_APPLICATIONS.find(a => a.schemeId === id)
  const [applying, setApplying] = useState(false)
  const [tab, setTab] = useState('status')

  if (!scheme) return <div style={{padding:20}}>Scheme not found</div>

  const handleApply = () => {
    setApplying(true)
    setTimeout(() => {
      setApplying(false)
      addToast(`${scheme.shortName} application submitted!`, 'success')
    }, 1800)
  }

  return (
    <div className="scheme-detail fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>← {hi?'वापस':'Back'}</button>

      {/* Header */}
      <div className="sd-header" style={{background:`linear-gradient(135deg, ${scheme.color}, ${scheme.color}99)`}}>
        <div className="sd-icon">{scheme.icon}</div>
        <h2 className="sd-title">{hi ? scheme.nameHi : scheme.name}</h2>
        <div className="sd-portal">via {scheme.portal} · {scheme.ministry}</div>
        <div className="sd-amount-badge">💰 {scheme.amount}</div>
      </div>

      {/* Tabs */}
      {app && (
        <div className="sd-tabs">
          {['status','details','documents'].map(t => (
            <button key={t} className={`sd-tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
              {t === 'status' ? (hi?'स्थिति':'Status') : t === 'details' ? (hi?'विवरण':'Details') : (hi?'दस्तावेज़':'Documents')}
            </button>
          ))}
        </div>
      )}

      {/* Application Status Timeline */}
      {app && tab === 'status' && (
        <div className="sd-section card">
          <div className="sd-section-title">📊 {hi?'आवेदन स्थिति':'Application Status'}</div>
          <div className="app-id-row">
            <span className="app-id-label">{hi?'आवेदन ID':'Application ID'}</span>
            <span className="app-id-val">{app.id}</span>
          </div>
          <div className="timeline">
            {app.stages.map((stage, i) => (
              <div key={i} className={`timeline-item ${stage.done?'done':''} ${stage.active?'active':''}`}>
                <div className="tl-dot">
                  {stage.done ? '✅' : stage.active ? '🔄' : '⭕'}
                </div>
                <div className="tl-content">
                  <div className="tl-label">{stage.label}</div>
                  {stage.date && <div className="tl-date">{stage.date}</div>}
                  {stage.active && <div className="tl-active-label">{hi?'प्रगति में':'In Progress'}</div>}
                </div>
              </div>
            ))}
          </div>

          {app.dbt && (
            <div className="dbt-card">
              <div className="dbt-title">💳 DBT Transfer Details</div>
              <div className="dbt-row"><span>UTR Number</span><span>{app.dbt.utr}</span></div>
              <div className="dbt-row"><span>Bank</span><span>{app.dbt.bank}</span></div>
              <div className="dbt-row"><span>Date</span><span>{app.dbt.date}</span></div>
              <div className="dbt-row"><span>Amount</span><strong style={{color:'var(--success)'}}>{app.dbt.amount}</strong></div>
            </div>
          )}

          {app.deficiencies?.length > 0 && (
            <div className="deficiency-section">
              <div className="def-title">⚠️ {hi?'कमियां / Action Required':'Deficiencies'}</div>
              {app.deficiencies.map((d,i) => (
                <div key={i} className="def-item">{d}</div>
              ))}
              <button className="btn btn-primary btn-sm" style={{marginTop:10}} onClick={() => { addToast('Document re-uploaded!','success') }}>
                📎 {hi?'दस्तावेज़ पुनः अपलोड करें':'Re-upload Document'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Scheme Details Tab */}
      {(tab === 'details' || !app) && (
        <div className="sd-section card">
          <div className="sd-section-title">📋 {hi?'योजना विवरण':'Scheme Details'}</div>
          <p className="sd-desc">{scheme.description}</p>
          <div className="sd-section-title" style={{marginTop:14}}>✅ {hi?'पात्रता':'Eligibility'}</div>
          <p className="sd-desc">{scheme.eligibility}</p>
          <div className="sd-section-title" style={{marginTop:14}}>🎁 {hi?'लाभ':'Benefits'}</div>
          {scheme.benefits.map((b,i) => <div key={i} className="benefit-item">• {b}</div>)}
          <div className="deadline-box">
            📅 {hi?'अंतिम तिथि':'Application Deadline'}: <strong>{scheme.deadline}</strong>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {tab === 'documents' && app && (
        <div className="sd-section card">
          <div className="sd-section-title">📂 {hi?'आवश्यक दस्तावेज़':'Required Documents'}</div>
          {scheme.documents.map((d,i) => (
            <div key={i} className="doc-required-item">
              <span>📄</span>
              <span>{d}</span>
              <span className="badge badge-success">✓</span>
            </div>
          ))}
        </div>
      )}

      {/* Apply Button */}
      {!app && (
        <div className="apply-section">
          <div className="apply-note">
            🔗 DigiLocker linked — documents will be auto-fetched
          </div>
          <button className="btn btn-primary btn-full" onClick={handleApply} disabled={applying}>
            {applying ? <><span className="spinner" style={{borderTopColor:'#fff'}} /> {hi?'आवेदन जमा हो रहा है...':'Submitting...'}</> : `🚀 ${hi?'अभी आवेदन करें':'Apply Now'}`}
          </button>
        </div>
      )}
    </div>
  )
}
