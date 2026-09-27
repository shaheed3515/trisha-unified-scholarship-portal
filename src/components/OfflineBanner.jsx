import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './OfflineBanner.css'

export default function OfflineBanner({ offlineMode, lang, onSync }) {
  if (!offlineMode) return null
  const t = I18N[lang] || I18N.en

  return (
    <aside className="offline-banner-alert" aria-label="Offline Mode Active">
      <div className="container offline-banner-container">
        <div className="offline-icon-wrap">
          <WifiOff size={18} />
        </div>
        <div className="offline-text-content">
          <strong className="offline-title">{t.offlineMode}</strong>
          <span className="offline-desc">{t.offlineActiveMsg}</span>
        </div>
        <button className="btn btn-sm btn-secondary offline-sync-btn" onClick={onSync}>
          <RefreshCw size={14} />
          <span>Simulate Village Network Sync</span>
        </button>
      </div>
    </aside>
  )
}
