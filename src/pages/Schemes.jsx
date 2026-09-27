import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App'
import { SCHEMES, MOCK_APPLICATIONS } from '../data/mockData'
import './Schemes.css'

export default function Schemes() {
  const { lang } = useContext(AppContext)
  const navigate = useNavigate()
  const hi = lang === 'hi'

  return (
    <div className="schemes-page fade-in">
      <h2 className="page-title">{hi ? 'सभी 5 MoTA योजनाएं' : 'All 5 MoTA Schemes'}</h2>
      <p className="page-sub">{hi ? 'एक ही प्लेटफॉर्म पर सभी अनुसूचित जनजाति छात्रवृत्ति' : 'All Scheduled Tribe scholarships on one platform'}</p>

      <div className="portal-map">
        <div className="portal-item">
          <span className="portal-dot" style={{background:'#7c3aed'}} />
          NSP → Pre-Matric, Post-Matric, Top Class
        </div>
        <div className="portal-item">
          <span className="portal-dot" style={{background:'#d97706'}} />
          SFMP → NFST (Canara Bank)
        </div>
        <div className="portal-item">
          <span className="portal-dot" style={{background:'#dc2626'}} />
          NOS Portal → Overseas Scholarship
        </div>
        <div className="portal-unified">
          🪶 JAGO unifies all 3 portals → 1 view
        </div>
      </div>

      <div className="schemes-list">
        {SCHEMES.map(s => {
          const app = MOCK_APPLICATIONS.find(a => a.schemeId === s.id)
          return (
            <div key={s.id} className="scheme-full-card card" style={{borderLeft:`4px solid ${s.color}`}} onClick={() => navigate(`/schemes/${s.id}`)}>
              <div className="sfc-top">
                <div className="sfc-icon" style={{background:s.lightColor}}>{s.icon}</div>
                <div className="sfc-info">
                  <div className="sfc-name">{hi ? s.nameHi : s.name}</div>
                  <div className="sfc-portal">via {s.portal}</div>
                </div>
                {app ? (
                  <span className={`badge badge-${app.status==='disbursed'?'success':app.status==='under-review'?'warning':'info'}`}>
                    {app.status === 'disbursed' ? '✅' : '🔄'} {app.status === 'disbursed' ? (hi?'वितरित':'Disbursed') : (hi?'समीक्षाधीन':'Under Review')}
                  </span>
                ) : (
                  <span className="badge badge-purple">{hi?'आवेदन करें':'Apply'}</span>
                )}
              </div>
              <div className="sfc-meta">
                <div className="sfc-meta-item">💰 {s.amount}</div>
                <div className="sfc-meta-item">📅 {hi?'अंतिम तिथि':'Deadline'}: {s.deadline}</div>
              </div>
              <div className="sfc-eligibility">{s.eligibility}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
