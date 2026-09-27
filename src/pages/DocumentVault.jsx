import { useState } from 'react'
import { 
  ShieldCheck, 
  RefreshCw, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle2, 
  Building2, 
  QrCode,
  Calendar,
  Lock,
  X
} from 'lucide-react'
import { DIGILOCKER_VAULT } from '../data/scholarshipData'
import './DocumentVault.css'

export default function DocumentVault({ activeStudent, onToast }) {
  const [syncing, setSyncing] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)

  const handleSyncDigiLocker = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      onToast('DigiLocker Records re-synced and digitally verified with Jharkhand e-District & UIDAI!', 'success')
    }, 1500)
  }

  return (
    <div className="vault-view fade-in">
      <div className="vault-header-section">
        <div>
          <div className="vault-badge-row">
            <span className="badge badge-success">
              <ShieldCheck size={13} /> DigiLocker Certified Vault
            </span>
            <span className="badge badge-primary">Zero Manual Paper Submissions</span>
          </div>
          <h1 className="vault-heading">Tribal Student Digital Document Vault</h1>
          <p className="vault-sub">
            Verified authentic records pulled from UIDAI, State e-District, UDISE+, and National Academic Depository (NAD)
          </p>
        </div>

        <button 
          className="btn btn-secondary sync-digilocker-btn"
          onClick={handleSyncDigiLocker}
          disabled={syncing}
        >
          <RefreshCw size={16} className={syncing ? 'spinning-sync' : ''} />
          <span>{syncing ? 'Fetching from DigiLocker...' : 'Refresh DigiLocker Sync'}</span>
        </button>
      </div>

      {/* Grid of Verified Documents */}
      <div className="vault-cards-grid">
        {DIGILOCKER_VAULT.map(doc => (
          <div key={doc.id} className="gov-card doc-vault-card">
            <div className="doc-card-top">
              <div className="doc-icon-wrap">
                <FileText size={22} />
              </div>
              <div className="doc-meta-col">
                <div className="doc-category-tag">{doc.category}</div>
                <h2 className="doc-title">{doc.title}</h2>
                <div className="doc-issuer">{doc.issuer}</div>
              </div>
            </div>

            <div className="doc-details-box">
              <div className="doc-row">
                <span className="doc-label">Certificate No.</span>
                <span className="doc-val mono-val">{doc.certNumber}</span>
              </div>
              <div className="doc-row">
                <span className="doc-label">Issued / Verified</span>
                <span className="doc-val">{doc.issueDate}</span>
              </div>
              <div className="doc-row">
                <span className="doc-label">Authenticity Status</span>
                <span className="doc-val verified-text">
                  <CheckCircle2 size={13} /> Digitally Signed
                </span>
              </div>
              <div className="doc-row">
                <span className="doc-label">File Size / Format</span>
                <span className="doc-val">{doc.fileSize} (PDF/A)</span>
              </div>
            </div>

            <div className="doc-card-actions">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedDoc(doc)}
              >
                <Eye size={14} />
                <span>View Certificate</span>
              </button>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onToast(`Downloading certified copy: ${doc.title}`, 'info')}
              >
                <Download size={14} />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="modal-overlay fade-in">
          <div className="modal-content doc-preview-modal gov-card">
            <div className="preview-modal-header">
              <div className="preview-title-col">
                <span className="badge badge-success">DigiLocker Authentic</span>
                <h3 className="preview-heading">{selectedDoc.title}</h3>
                <div className="preview-sub">{selectedDoc.issuer}</div>
              </div>
              <button className="close-btn" onClick={() => setSelectedDoc(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="simulated-cert-sheet">
              <div className="cert-watermark">GOVERNMENT OF INDIA</div>
              
              <div className="cert-top-crest">
                <Building2 size={36} color="var(--primary-800)" />
                <div className="cert-state-name">{selectedDoc.issuer}</div>
                <div className="cert-order-name">OFFICIAL DIGITAL CERTIFICATE</div>
              </div>

              <div className="cert-body-content">
                <p>This is to certify that according to government administrative records:</p>
                <div className="cert-info-table">
                  <div className="cert-table-row">
                    <span>Beneficiary Name:</span>
                    <strong>{activeStudent.name}</strong>
                  </div>
                  <div className="cert-table-row">
                    <span>Document Number:</span>
                    <strong>{selectedDoc.certNumber}</strong>
                  </div>
                  <div className="cert-table-row">
                    <span>Issued Authority:</span>
                    <strong>{selectedDoc.issuer}</strong>
                  </div>
                  <div className="cert-table-row">
                    <span>Validity / Scope:</span>
                    <strong>{selectedDoc.validity}</strong>
                  </div>
                  <div className="cert-table-row">
                    <span>Aadhaar Linkage:</span>
                    <strong>Verified (Linked with NPCI DBT Mapper)</strong>
                  </div>
                </div>
              </div>

              <div className="cert-footer-stamp">
                <div className="qr-simulated-box">
                  <QrCode size={52} />
                  <span>Scan to verify on National DigiLocker API</span>
                </div>
                <div className="digi-signature-box">
                  <ShieldCheck size={20} color="var(--success-600)" />
                  <div>
                    <strong>Digitally Signed via NeGD</strong>
                    <div>Hash: {selectedDoc.qrHash}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="preview-modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedDoc(null)}>
                Close Preview
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSelectedDoc(null)
                  onToast(`Downloaded official PDF for ${selectedDoc.title}`, 'success')
                }}
              >
                <Download size={16} />
                <span>Save Certified PDF Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
