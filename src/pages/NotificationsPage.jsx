import { useContext, useState } from 'react'
import { AppContext } from '../App'
import { NOTIFICATIONS } from '../data/mockData'
import './NotificationsPage.css'

export default function NotificationsPage() {
  const { lang } = useContext(AppContext)
  const hi = lang === 'hi'
  const [notifs, setNotifs] = useState(NOTIFICATIONS)

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const TYPE_CONFIG = {
    success: { icon:'✅', color:'#dcfce7', border:'#bbf7d0', textColor:'#14532d' },
    warning: { icon:'⚠️', color:'#fffbeb', border:'#fde68a', textColor:'#92400e' },
    info:    { icon:'ℹ️', color:'#eff6ff', border:'#bfdbfe', textColor:'#1e40af' },
  }

  return (
    <div className="notifs-page fade-in">
      <div className="notifs-header">
        <h2 className="page-title">{hi?'सूचनाएं':'Notifications'}</h2>
        <button className="section-link" onClick={markAllRead}>{hi?'सभी पढ़ें':'Mark all read'}</button>
      </div>
      <div className="notifs-list">
        {notifs.map(n => {
          const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info
          return (
            <div key={n.id} className={`notif-card ${n.read?'read':''}`} style={{background:cfg.color, border:`1px solid ${cfg.border}`}}>
              <span className="notif-icon">{cfg.icon}</span>
              <div className="notif-content">
                <div className="notif-title" style={{color:cfg.textColor}}>{n.title}</div>
                <div className="notif-body">{n.body}</div>
                <div className="notif-time">{n.time}</div>
              </div>
              {!n.read && <div className="notif-dot" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
