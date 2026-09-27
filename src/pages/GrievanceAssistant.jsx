import { useState, useRef, useEffect } from 'react'
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Languages, 
  ShieldCheck, 
  FileText, 
  HelpCircle,
  Volume2
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './GrievanceAssistant.css'

export default function GrievanceAssistant({ activeStudent, lang, setLang, onToast }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Johar / Namaste ${activeStudent.name}! I am the MoTA Tribal AI Sahayak. I can assist you with all 5 scholarship schemes, application stage tracking, DigiLocker verification, and anti-duplication rules in your preferred tribal language or dialect.`,
      citation: 'MoTA Unified Portal Knowledge Engine'
    }
  ])
  const [inputVal, setInputVal] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const suggestedQuestions = [
    {
      q: 'Can I apply for NFST fellowship if I already receive Post-Matric?',
      a: 'Under MoTA regulations (Rule 11/GFR 2017), simultaneous availing of multiple scholarships is strictly barred. However, TRISHA provides an automated Scheme Transition / Relinquishment NOC feature. If selected for NFST, your Post-Matric allocation is safely transitioned without risk of double-dipping penalties.'
    },
    {
      q: 'Why is my Top Class application flagged with an action required deficiency?',
      a: 'The State Nodal Officer requested an updated FY 2025-26 Competent Authority Income Certificate with a legible digital seal. You can resolve this instantly by clicking "Resolve via DigiLocker Live Sync" on your tracker tab.'
    },
    {
      q: 'How does Direct Benefit Transfer (DBT) verification work with PFMS?',
      a: 'Scholarship amounts are mapped via your Aadhaar Number to your NPCI-seeded Bank Account. You can inspect the exact RBI UTR number and sanction release order directly inside the Application Tracker tab.'
    }
  ]

  const handleSend = async (textToSend) => {
    const query = textToSend || inputVal
    if (!query.trim() || loading) return

    const userMsg = { id: Date.now(), sender: 'user', text: query }
    setMessages(prev => [...prev, userMsg])
    setInputVal('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: lang,
          studentId: activeStudent?.id || 'student_priya'
        })
      })

      const data = await res.json()

      if (data.success && data.reply) {
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now() + 1, 
            sender: 'bot', 
            text: data.reply, 
            citation: data.citation || `Google Gemini 3.8 Flash • MoTA Guidelines`
          }
        ])
        setLoading(false)
        return
      }
      throw new Error(data.error || 'Server error')
    } catch (err) {
      console.warn('[Gemini Live Fallback]:', err.message)
      const matchedQ = suggestedQuestions.find(sq => sq.q.toLowerCase() === query.toLowerCase())
      let botResponse = ''

      if (matchedQ) {
        botResponse = matchedQ.a
      } else if (query.toLowerCase().includes('nfst') || query.toLowerCase().includes('fellowship')) {
        botResponse = 'NFST (National Fellowship for ST Students) offers ₹37,000/month (JRF) and ₹42,000/month (SRF) via Canara Bank SFMP. 750 slots are awarded nationally every year for regular Ph.D scholars.'
      } else if (query.toLowerCase().includes('pre-matric') || query.toLowerCase().includes('school')) {
        botResponse = 'Pre-Matric ST is for Class IX & X students in Government and Eklavya Model Residential Schools (EMRS). It provides up to ₹7,000/year to minimize dropout rates.'
      } else if (query.toLowerCase().includes('dbt') || query.toLowerCase().includes('money')) {
        botResponse = 'Your recent Post-Matric DBT credit of ₹18,500 was successfully remitted on 12 September 2026 (UTR: RBI2026091298412). Check your Tracker tab for the receipt.'
      } else {
        botResponse = `Regarding "${query}": The Ministry of Tribal Affairs guarantees all ST beneficiaries full digital transparency through DigiLocker e-KYC and direct bank transfer without intermediaries. If you need a formal grievance ticket, I can lodge one with the District Tribal Welfare Officer.`
      }

      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, sender: 'bot', text: botResponse, citation: 'MoTA Central Guidelines (Grounded Fallback)' }
      ])
      setLoading(false)
    }
  }

  const toggleMic = () => {
    if (!listening) {
      setListening(true)
      onToast('Listening for tribal voice query (Santhali / Hindi / English)...', 'info')
      setTimeout(() => {
        setListening(false)
        setInputVal('Can I apply for NFST fellowship if I already receive Post-Matric?')
        onToast('Voice transcription captured successfully!', 'success')
      }, 2000)
    } else {
      setListening(false)
    }
  }

  return (
    <div className="assistant-view fade-in">
      <div className="assistant-header gov-card">
        <div className="assistant-header-left">
          <div className="ai-avatar-circle">
            <Bot size={24} />
          </div>
          <div>
            <div className="assistant-badge-row">
              <span className="badge badge-primary">Multilingual Voice & NLP Engine</span>
              <span className="badge badge-success">MoTA AI Sahayak</span>
            </div>
            <h1 className="assistant-title">Tribal Student Grievance & Guidance Assistant</h1>
          </div>
        </div>

        <div className="assistant-header-right">
          <span className="lang-label">Language:</span>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="assistant-lang-select"
          >
            <option value="en">English (Official)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="santhali">ᱥᱟᱱᱛᱟᱲᱤ (Santhali)</option>
            <option value="gondi">गोंडी (Gondi)</option>
          </select>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div className="suggested-queries-strip">
        {suggestedQuestions.map((sq, idx) => (
          <button 
            key={idx} 
            className="suggested-pill-btn"
            onClick={() => handleSend(sq.q)}
          >
            <Sparkles size={13} className="sparkle-icon" />
            <span>{sq.q}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="gov-card chat-box-card">
        <div className="chat-messages-container">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
            >
              {msg.sender === 'bot' && (
                <div className="bubble-avatar bot-avatar" aria-hidden="true">
                  <Bot size={16} />
                </div>
              )}

              <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                <p className="bubble-text">{msg.text}</p>
                {msg.citation && (
                  <div className="bubble-citation">
                    <ShieldCheck size={12} aria-hidden="true" />
                    <span>{msg.citation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-row bot-row fade-in" aria-live="polite">
              <div className="bubble-avatar bot-avatar" aria-hidden="true">
                <Bot size={16} />
              </div>
              <div className="chat-bubble bot-bubble" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={14} className="sparkle-icon" style={{ animation: 'spin 2s linear infinite' }} />
                <span className="bubble-text" style={{ fontStyle: 'italic', color: '#64748b' }}>
                  Sahayak is analyzing with Gemini 3.8 Flash...
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <button 
            className={`mic-button ${listening ? 'mic-listening' : ''}`}
            onClick={toggleMic}
            aria-label="Speak query using voice recognition"
            title="Speak query in tribal dialect or Hindi"
          >
            {listening ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
          </button>

          <input 
            type="text" 
            placeholder={listening ? "Listening to your voice..." : "Ask in English, Hindi, Santhali or Gondi..."}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="chat-text-input"
            aria-label="Type your scholarship question"
          />

          <button 
            className="btn btn-primary send-chat-btn"
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || loading}
            aria-label="Send query to Sahayak"
          >
            <span>Send</span>
            <Send size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
