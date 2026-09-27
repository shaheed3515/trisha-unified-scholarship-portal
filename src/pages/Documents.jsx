import { useContext, useState } from 'react'
import { AppContext } from '../App'
import { MOCK_DOCUMENTS } from '../data/mockData'
import './Documents.css'

const TYPE_ICONS = { identity:'🪪', caste:'📜', income:'💰', academic:'🎓', bank:'🏦' }
const TYPE_LABELS = { identity:'Identity', caste:'Caste/ST', income:'Income', academic:'Academic', bank:'Bank' }

export default function Documents() {
  const { lang, addToast } = useContext(AppContext)
  const hi = lang === 'hi'
  const [docs, setDocs] = useState(MOCK_DOCUMENTS)
  const [filter, setFilter] = useState('all')
  const [uploading, setUploading] = useState(false)

  const filtered = filter === 'all' ? docs : docs.filter(d => d.type === filter)

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setTimeout(() => {
      const newDoc = {
        id: `doc${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: 'academic',
        source: 'Uploaded',
        verified: false,
        date: new Date().toISOString().split('T')[0],
        size: `${Math.round(file.size/1024)} KB`,
      }
      setDocs(d => [...d, newDoc])
      setUploading(false)
      addToast(`${newDoc.name} uploaded successfully!`, 'success')
    }, 1500)
  }

  const fetchDigilocker = () => {
    addToast('Fetching from DigiLocker...', 'info')
    setTimeout(() => addToast('APAAR Academic record synced!', 'success'), 2000)
  }

  return (
    <div className="documents-page fade-in">
      <h2 className="page-title">{hi?'दस्तावेज़ वॉलेट':'Document Wallet'}</h2>
      <div className="dl-banner">
        <div>
          <div className="dl-banner-title">🔗 {hi?'DigiLocker जुड़ा':'DigiLocker Linked'}</div>
          <div className="dl-banner-sub">{hi?'दस्तावेज़ स्वचालित रूप से प्राप्त होते हैं':'Documents auto-fetched & verified'}</div>
        </div>
        <button className="btn btn-sm" style={{background:'rgba(255,255,255,0.2)',color:'#fff',border:'1px solid rgba(255,255,255,0.3)'}} onClick={fetchDigilocker}>
          🔄 {hi?'सिंक करें':'Sync'}
        </button>
      </div>

      {/* Stats */}
      <div className="doc-stats">
        <div className="doc-stat"><span style={{color:'var(--success)'}}>✅ {docs.filter(d=>d.verified).length}</span><span>{hi?'सत्यापित':'Verified'}</span></div>
        <div className="doc-stat"><span style={{color:'var(--warning)'}}>⏳ {docs.filter(d=>!d.verified).length}</span><span>{hi?'लंबित':'Pending'}</span></div>
        <div className="doc-stat"><span style={{color:'var(--primary)'}}>📂 {docs.length}</span><span>{hi?'कुल':'Total'}</span></div>
      </div>

      {/* Filter Chips */}
      <div className="filter-chips">
        {['all',...Object.keys(TYPE_LABELS)].map(f => (
          <button key={f} className={`chip ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? (hi?'सभी':'All') : `${TYPE_ICONS[f]} ${TYPE_LABELS[f]}`}
          </button>
        ))}
      </div>

      {/* Upload Button */}
      <label className="upload-btn">
        {uploading ? <><span className="spinner-dark" /> {hi?'अपलोड हो रहा है...':'Uploading...'}</> : `📎 ${hi?'दस्तावेज़ अपलोड करें':'Upload Document'}`}
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} style={{display:'none'}} disabled={uploading} />
      </label>

      {/* Documents List */}
      <div className="docs-list">
        {filtered.map(doc => (
          <div key={doc.id} className="doc-card card">
            <div className="doc-icon">{TYPE_ICONS[doc.type] || '📄'}</div>
            <div className="doc-info">
              <div className="doc-name">{doc.name}</div>
              <div className="doc-meta">
                <span className={`badge ${doc.source==='DigiLocker'?'badge-purple':'badge-info'}`}>
                  {doc.source === 'DigiLocker' ? '🏛️ DigiLocker' : '📤 Uploaded'}
                </span>
                <span className="doc-date">{doc.date}</span>
                <span className="doc-size">{doc.size}</span>
              </div>
            </div>
            <div className="doc-actions">
              {doc.verified
                ? <span className="badge badge-success">✅ {hi?'सत्यापित':'Verified'}</span>
                : <span className="badge badge-warning">⏳ {hi?'लंबित':'Pending'}</span>
              }
            </div>
          </div>
        ))}
      </div>

      <div className="doc-note">
        💡 {hi?'DigiLocker से प्राप्त दस्तावेज़ स्वचालित रूप से सत्यापित होते हैं। अपलोड किए गए दस्तावेज़ संस्थान द्वारा सत्यापित किए जाते हैं।' : 'DigiLocker documents are auto-verified. Uploaded documents are verified by your institution or nodal department.'}
      </div>
    </div>
  )
}
