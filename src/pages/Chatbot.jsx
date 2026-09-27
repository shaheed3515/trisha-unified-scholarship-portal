import { useContext, useState, useRef, useEffect } from 'react'
import { AppContext } from '../App'
import './Chatbot.css'

// ── GEMINI API KEY — Replace with your key from aistudio.google.com ──
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'

const SYSTEM_PROMPT = `You are JAGO, the official AI assistant for India's Ministry of Tribal Affairs (MoTA) Scholarship Portal. 
You help Scheduled Tribe (ST) students with:
1. All 5 MoTA scholarship schemes:
   - Pre-Matric Scholarship (NSP, Class 9-10, ₹150-750/month)
   - Post-Matric Scholarship (NSP, after Class 10, ₹230-1200/month)
   - Top Class Scholarship (NSP, IIT/NIT/AIIMS, full fees + ₹2000/month)
   - NFST - National Fellowship for ST (SFMP Canara Bank, MPhil/PhD, ₹37000-42000/month)
   - NOS - National Overseas Scholarship (NOS Portal, Masters/PhD abroad, full fees + allowance)
2. DigiLocker integration for document verification
3. DBT payment tracking
4. Eligibility criteria, documents needed, deadlines
5. APAAR, OTR, UDISE+ verification processes
Always be helpful, supportive, and respond in simple language. If asked in Hindi, reply in Hindi. Keep answers concise (3-5 sentences max). Start with "Namaste! I'm JAGO 🙏" on first message only.`

const QUICK_QUESTIONS = [
  'Which scholarship am I eligible for?',
  'What documents do I need?',
  'How do I check DBT status?',
  'Difference between NFST and NOS?',
  'Top Class scholarship eligibility?',
]

const QUICK_HI = [
  'मैं किस छात्रवृत्ति के योग्य हूं?',
  'कौन से दस्तावेज़ चाहिए?',
  'DBT स्थिति कैसे जांचें?',
  'NFST और NOS में क्या अंतर है?',
]

async function callGemini(messages, lang) {
  // Fallback responses if no API key
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    return getFallbackResponse(messages[messages.length-1].content, lang)
  }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          { role: 'model', parts: [{ text: 'Namaste! I am JAGO 🙏 How can I help you with your MoTA scholarship today?' }] },
          ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }))
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
      })
    })
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse(messages[messages.length-1].content, lang)
  } catch {
    return getFallbackResponse(messages[messages.length-1].content, lang)
  }
}

function getFallbackResponse(query, lang) {
  const q = query.toLowerCase()
  const hi = lang === 'hi'
  if (q.includes('eligib') || q.includes('योग्य')) return hi
    ? 'MoTA की 5 योजनाएं हैं: Pre-Matric (Class 9-10), Post-Matric (Class 10 के बाद), Top Class (IIT/NIT/AIIMS), NFST (M.Phil/Ph.D), NOS (विदेश में पढ़ाई)। आपकी शिक्षा के स्तर के अनुसार योजना चुनें।'
    : 'MoTA has 5 schemes: Pre-Matric (Class 9-10), Post-Matric (after Class 10), Top Class (IIT/NIT/AIIMS), NFST (MPhil/PhD), NOS (studying abroad). Choose based on your study level.'
  if (q.includes('document') || q.includes('दस्तावेज़')) return hi
    ? 'सभी योजनाओं के लिए आवश्यक: आधार कार्ड, ST प्रमाण पत्र, आय प्रमाण पत्र, पिछली मार्कशीट, बैंक पासबुक। DigiLocker से इन्हें स्वचालित रूप से प्राप्त किया जा सकता है।'
    : 'Common documents for all schemes: Aadhaar, ST Certificate, Income Certificate (< ₹2.5L/year), Previous marksheet, Bank passbook. DigiLocker can auto-fetch most of these.'
  if (q.includes('dbt') || q.includes('payment') || q.includes('भुगतान')) return hi
    ? 'DBT स्थिति देखने के लिए "My Applications" → scheme → Status tab पर जाएं। UTR नंबर से बैंक में भी जांच सकते हैं। सामान्यतः sanction के 7-10 दिन बाद transfer होता है।'
    : 'To check DBT status, go to My Applications → select scheme → Status tab. The UTR number is shown once transferred. DBT usually happens 7-10 days after sanction.'
  if (q.includes('nfst') || q.includes('nos') || q.includes('fellowship')) return hi
    ? 'NFST भारत में M.Phil/Ph.D के लिए है (₹37,000-42,000/माह, SFMP/Canara Bank portal)। NOS विदेश में Master\'s/Ph.D के लिए है (पूरी फीस + भत्ता, NOS Portal)। दोनों एक साथ नहीं लिए जा सकते।'
    : 'NFST is for MPhil/PhD in India (₹37,000-42,000/month via SFMP Canara Bank). NOS is for Masters/PhD abroad (full fees + allowance via NOS Portal). You cannot avail both simultaneously.'
  if (q.includes('top class') || q.includes('iit') || q.includes('nit')) return hi
    ? 'Top Class Scholarship IIT, NIT, AIIMS, IIM जैसे शीर्ष संस्थानों में ST छात्रों के लिए है। पूरी ट्यूशन फीस + ₹2,000/माह + ₹45,000/वर्ष (किताबें) मिलते हैं। NSP portal पर आवेदन करें।'
    : 'Top Class Scholarship covers ST students in premier institutes like IIT, NIT, AIIMS, IIM. Benefits: Full tuition fee + ₹2,000/month maintenance + ₹45,000/year for books. Apply on NSP portal.'
  return hi
    ? 'नमस्ते! मैं JAGO हूं 🙏 मैं MoTA छात्रवृत्ति योजनाओं, पात्रता, दस्तावेज़ और भुगतान स्थिति में मदद कर सकता हूं। आप क्या जानना चाहते हैं?'
    : 'Namaste! I\'m JAGO 🙏 I can help you with MoTA scholarship schemes, eligibility, documents, and payment status. What would you like to know?'
}

export default function Chatbot() {
  const { lang } = useContext(AppContext)
  const hi = lang === 'hi'
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Namaste! I'm JAGO 🙏\n\nI'm your official MoTA scholarship assistant. I can help you with:\n• Eligibility for all 5 schemes\n• Required documents\n• Application status\n• DBT payment tracking\n\nHow can I help you today?` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setLoading(true)
    const reply = await callGemini(newMessages.filter(m => m.role !== 'system'), lang)
    setMessages(m => [...m, { role: 'assistant', content: reply }])
    setLoading(false)
  }

  return (
    <div className="chatbot-page fade-in">
      <div className="chatbot-header">
        <div className="chatbot-avatar">🤖</div>
        <div>
          <div className="chatbot-name">JAGO Assistant</div>
          <div className="chatbot-status">● {hi?'ऑनलाइन':'Online'} · MoTA Official AI</div>
        </div>
        <div className="chatbot-lang-note">{hi?'हिंदी में पूछें':'Ask in Hindi too!'}</div>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            {m.role === 'assistant' && <div className="msg-avatar">🤖</div>}
            <div className={`msg-bubble ${m.role}`}>
              {m.content.split('\n').map((line, j) => (
                <span key={j}>{line}{j < m.content.split('\n').length-1 && <br/>}</span>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg assistant">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble assistant typing">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Questions */}
      <div className="quick-questions">
        {(hi ? QUICK_HI : QUICK_QUESTIONS).map((q, i) => (
          <button key={i} className="quick-q" onClick={() => send(q)}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder={hi?'संदेश लिखें...':'Type a message...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          disabled={loading}
        />
        <button className="send-btn" onClick={() => send()} disabled={loading || !input.trim()}>
          ➤
        </button>
      </div>

      {!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE' ? (
        <div className="api-note">
          ⚙️ Add your Gemini API key in <code>Chatbot.jsx</code> for full AI responses. Get free key at <a href="https://aistudio.google.com" target="_blank">aistudio.google.com</a>
        </div>
      ) : null}
    </div>
  )
}
