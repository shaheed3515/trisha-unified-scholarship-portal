import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import OfflineBanner from './components/OfflineBanner'
import ConflictModal from './components/ConflictModal'
import Dashboard from './pages/Dashboard'
import SchemesPage from './pages/SchemesPage'
import ApplicationTracker from './pages/ApplicationTracker'
import DocumentVault from './pages/DocumentVault'
import FamilyOverview from './pages/FamilyOverview'
import GrievanceAssistant from './pages/GrievanceAssistant'
import { HOUSEHOLD_DATA, SCHEMES, CONFLICT_RULES, I18N } from './data/scholarshipData'
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  Bell, 
  Users, 
  ShieldCheck
} from 'lucide-react'
import './App.css'

const TAB_LABELS = {
  dashboard: 'Dashboard',
  schemes: 'All Scholarship Schemes',
  tracker: 'Application & Verification Tracker',
  documents: 'DigiLocker Document Vault',
  family: 'Household & Sibling View',
  assistant: 'Tribal AI Sahayak'
}

export default function App() {
  const [household, setHousehold] = useState(HOUSEHOLD_DATA)
  const [activeStudent, setActiveStudent] = useState(HOUSEHOLD_DATA.members[0])
  const [lang, setLang] = useState('en')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [offlineMode, setOfflineMode] = useState(false)
  const [toasts, setToasts] = useState([])
  const [conflictTargetScheme, setConflictTargetScheme] = useState(null)
  const [conflictData, setConflictData] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false)

  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'PFMS DBT Remittance Released', body: 'Post-Matric ST allowance ₹18,500 credited to SBI account (UTR: RBI2026091298412).', time: '12 Sep 2026', read: false, type: 'success' },
    { id: 'n2', title: 'Action Required: Income Certificate', body: 'State Nodal Officer flagged income certificate format for Top Class application.', time: '20 Sep 2026', read: false, type: 'warning' },
    { id: 'n3', title: 'National Overseas Scholarship Notice', body: 'Round 2 Overseas Scholarship applications open for QS Top 500 universities.', time: '18 Sep 2026', read: true, type: 'info' },
  ])

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const handleTriggerConflict = (targetSchemeId) => {
    const targetScheme = SCHEMES.find(s => s.id === targetSchemeId)
    const auditResult = CONFLICT_RULES.evaluateApplicationConflict(activeStudent, targetSchemeId)
    if (auditResult.hasConflict) {
      setConflictTargetScheme(targetScheme)
      setConflictData(auditResult)
    } else {
      addToast(`Eligibility verified for ${targetScheme.name}. You may proceed!`, 'success')
      setActiveTab('tracker')
    }
  }

  const handleRelinquishAndProceed = () => {
    if (!conflictTargetScheme) return
    const newApp = {
      id: `APP-MOTA-2026-${conflictTargetScheme.shortName.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      schemeId: conflictTargetScheme.id,
      portal: conflictTargetScheme.portal,
      appliedDate: '2026-09-27',
      academicSession: '2026-27',
      sanctionAmount: conflictTargetScheme.amountRange,
      currentStageIndex: 1,
      status: 'under_review',
      statusText: 'Provisional Application Registered (NOC Pending)',
      statusType: 'primary',
      lastActionDate: '2026-09-27',
      stages: [
        { id: 1, title: 'DigiLocker Identity & ST Verification', date: '2026-09-27', done: true, remarks: 'Verified via MoTA Central Registry' },
        { id: 2, title: 'Institution Bonafide & Ranking Verification', date: null, done: false, active: true },
        { id: 3, title: 'State Tribal Welfare Directorate Clearance', date: null, done: false },
        { id: 4, title: 'MoTA National Central Committee Sanction', date: null, done: false },
        { id: 5, title: 'PFMS Direct Benefit Transfer', date: null, done: false }
      ],
      dbtDetails: null,
      deficiencies: []
    }
    const updatedMembers = household.members.map(m => m.id === activeStudent.id ? { ...m, applications: [newApp, ...m.applications] } : m)
    setHousehold(prev => ({ ...prev, members: updatedMembers }))
    setActiveStudent(prev => ({ ...prev, applications: [newApp, ...prev.applications] }))
    setConflictData(null)
    setConflictTargetScheme(null)
    addToast(`Provisional application ${newApp.id} for ${conflictTargetScheme.name} submitted with Automated NOC!`, 'success')
    setActiveTab('tracker')
  }

  const handleResolveDeficiency = (appId) => {
    addToast('Contacting State Nodal Verification Server...', 'info')
    setTimeout(() => {
      const resolveInApps = (apps) => apps.map(app => app.id === appId ? {
        ...app,
        status: 'under_review',
        statusText: 'Deficiency Cleared: State Review Resumed',
        deficiencies: [],
        stages: app.stages.map(st => st.id === 3 ? { ...st, done: true, active: false, remarks: 'Income certificate e-verified via DigiLocker' } : st.id === 4 ? { ...st, active: true } : st)
      } : app)
      setHousehold(prev => ({ ...prev, members: prev.members.map(m => m.id === activeStudent.id ? { ...m, applications: resolveInApps(m.applications) } : m) }))
      setActiveStudent(prev => ({ ...prev, applications: resolveInApps(prev.applications) }))
      addToast('Deficiency resolved! Income certificate e-verified via DigiLocker.', 'success')
    }, 1200)
  }

  const handleDownloadSlip = () => {
    addToast('Generating certified PFMS DBT statement (PDF)...', 'info')
    setTimeout(() => addToast('PFMS Receipt saved to Downloads.', 'success'), 1200)
  }

  const handleOfflineSync = () => {
    addToast('Synchronizing offline queue with MoTA Central Cluster...', 'info')
    setTimeout(() => { setOfflineMode(false); addToast('Offline sync complete! Records reconciled.', 'success'); }, 1400)
  }

  const deficiencyCount = activeStudent.applications?.reduce((acc, a) => acc + (a.deficiencies?.length || 0), 0) || 0
  const t = I18N[lang] || I18N.en

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        deficiencyCount={deficiencyCount}
        activeStudent={activeStudent}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Right Content Area */}
      <div className={`app-main-panel ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Top Header Bar */}
        <Header
          lang={lang}
          setLang={setLang}
          activeStudent={activeStudent}
          setActiveStudent={setActiveStudent}
          household={household}
          offlineMode={offlineMode}
          setOfflineMode={setOfflineMode}
          notifications={notifications}
          onOpenNotifications={() => setShowNotificationsDrawer(true)}
          activeTabLabel={TAB_LABELS[activeTab] || 'Dashboard'}
        />

        {/* Offline Banner */}
        <OfflineBanner offlineMode={offlineMode} lang={lang} onSync={handleOfflineSync} />

        {/* Page Content */}
        <main className="page-viewport">
          {activeTab === 'dashboard' && (
            <Dashboard
              activeStudent={activeStudent}
              household={household}
              lang={lang}
              onNavigate={setActiveTab}
              onTriggerConflict={handleTriggerConflict}
              onResolveDeficiency={handleResolveDeficiency}
            />
          )}
          {activeTab === 'schemes' && (
            <SchemesPage
              activeStudent={activeStudent}
              lang={lang}
              onTriggerConflict={handleTriggerConflict}
              onDirectApply={(scheme) => handleTriggerConflict(scheme.id)}
            />
          )}
          {activeTab === 'tracker' && (
            <ApplicationTracker
              activeStudent={activeStudent}
              onResolveDeficiency={handleResolveDeficiency}
              onDownloadSlip={handleDownloadSlip}
            />
          )}
          {activeTab === 'documents' && (
            <DocumentVault activeStudent={activeStudent} onToast={addToast} />
          )}
          {activeTab === 'family' && (
            <FamilyOverview
              household={household}
              activeStudent={activeStudent}
              onSelectStudent={(member) => { setActiveStudent(member); addToast(`Switched to ${member.name}`, 'info'); }}
              onToast={addToast}
            />
          )}
          {activeTab === 'assistant' && (
            <GrievanceAssistant activeStudent={activeStudent} lang={lang} setLang={setLang} onToast={addToast} />
          )}
        </main>
      </div>

      {/* Conflict Modal */}
      {conflictData && conflictTargetScheme && (
        <ConflictModal
          conflictData={conflictData}
          targetScheme={conflictTargetScheme}
          student={activeStudent}
          onClose={() => { setConflictData(null); setConflictTargetScheme(null); }}
          onRelinquishAndProceed={handleRelinquishAndProceed}
        />
      )}

      {/* Notifications Drawer */}
      {showNotificationsDrawer && (
        <div className="modal-overlay fade-in" onClick={() => setShowNotificationsDrawer(false)}>
          <div className="notifications-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title-row">
                <Bell size={18} />
                <h2>MoTA Notifications</h2>
              </div>
              <button className="close-btn" onClick={() => setShowNotificationsDrawer(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="drawer-list">
              {notifications.map(n => (
                <div key={n.id} className={`drawer-notif notif-${n.type}`}>
                  <div className="notif-head">
                    <span className="notif-title">{n.title}</span>
                    <span className="notif-time">{n.time}</span>
                  </div>
                  <p className="notif-body">{n.body}</p>
                </div>
              ))}
            </div>
            <button
              className="btn btn-secondary btn-full"
              onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); setShowNotificationsDrawer(false); addToast('All read', 'info'); }}
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}

      {/* Toast Stack */}
      <div className="toast-stack" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-item toast-${toast.type} fade-in`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : toast.type === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
            <span className="toast-msg">{toast.message}</span>
            <button className="toast-x" onClick={() => setToasts(t => t.filter(x => x.id !== toast.id))}><X size={13} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
