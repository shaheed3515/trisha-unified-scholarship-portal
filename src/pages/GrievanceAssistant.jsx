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
  Volume2,
  CheckCircle2,
  RotateCcw
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import './GrievanceAssistant.css'

// Multilingual Knowledge Base for MoTA Tribal AI Sahayak (JAGO)
const KNOWLEDGE_BASE = {
  en: {
    welcome: (name) => `Johar / Namaste ${name}! I am the MoTA Tribal AI Sahayak (JAGO). I can assist you with all 5 scholarship schemes, application stage tracking, DigiLocker verification, DBT payments, and anti-duplication rules in English, Hindi, Santhali, or Gondi.`,
    citation: 'MoTA Unified Guidelines 2026-27',
    inputPlaceholder: 'Ask a question in English, Hindi, Santhali, or Gondi...',
    speakingToast: 'Playing audio explanation in English...',
    questions: [
      {
        q: 'What is my scholarship & DBT payment status?',
        a: 'Your Post-Matric Scholarship allowance (₹18,500) has been fully verified and DBT funds were successfully credited to your State Bank of India account (UTR: RBI2026091298412 on 12 September 2026).'
      },
      {
        q: 'Can I apply for NFST fellowship if I already receive Post-Matric?',
        a: 'Under MoTA regulations (Rule 11/GFR 2017), simultaneous availing of multiple scholarships is strictly barred. However, TRISHA provides an automated Scheme Transition / Relinquishment NOC feature to switch to NFST without any penalty.'
      },
      {
        q: 'Why is my Top Class application flagged with an action required?',
        a: 'The State Nodal Officer requested an updated FY 2025-26 Income Certificate with a clear digital seal. You can resolve this instantly with 1-click DigiLocker sync on your Application Tracker tab.'
      },
      {
        q: 'Which documents are auto-verified via DigiLocker?',
        a: 'Your Aadhaar Card, ST Caste Certificate (Jharkhand e-District), and Class 12 Marksheet are auto-verified with official digital signatures via DigiLocker and APAAR.'
      }
    ],
    generalReply: (query) => `Regarding "${query}": The Ministry of Tribal Affairs guarantees all ST beneficiaries full digital transparency through DigiLocker e-KYC and direct bank transfer without intermediaries. If you need a formal grievance ticket, I can lodge one with the District Tribal Welfare Officer.`
  },
  hi: {
    welcome: (name) => `जोहार / नमस्ते ${name}! मैं जनजातीय कार्य मंत्रालय (MoTA) का 'जनजातीय एआई सहायक (JAGO)' हूँ। मैं सभी 5 छात्रवृत्ति योजनाओं, डीबीटी भुगतान स्थिति, डिजिलॉकर सत्यापन और योजना नियमों में आपकी पूरी सहायता कर सकता हूँ।`,
    citation: 'जनजातीय कार्य मंत्रालय दिशा-निर्देश 2026-27',
    inputPlaceholder: 'हिंदी, संथाली, गोंडी या अंग्रेजी में प्रश्न पूछें...',
    speakingToast: 'हिंदी में ध्वनि संदेश सुनाया जा रहा है...',
    questions: [
      {
        q: 'मेरी छात्रवृत्ति और डीबीटी भुगतान की स्थिति क्या है?',
        a: 'आपकी पोस्ट-मैट्रिक छात्रवृत्ति (₹18,500) पूरी तरह सत्यापित हो चुकी है और डीबीटी राशि 12 सितंबर 2026 को आपके भारतीय स्टेट बैंक (SBI) खाते में सफलतापूर्वक भेज दी गई है (UTR: RBI2026091298412)।'
      },
      {
        q: 'क्या पोस्ट-मैट्रिक के साथ NFST फेलोशिप भी मिल सकती है?',
        a: 'जनजातीय कार्य मंत्रालय के "एक सक्रिय छात्रवृत्ति" नियम के तहत एक साथ दो छात्रवृत्तियां नहीं ली जा सकतीं। हालांकि, TRISHA में स्वचालित अनापत्ति प्रमाण पत्र (NOC) की सुविधा है जिससे आप बिना किसी परेशानी के NFST में स्थानांतरित हो सकते हैं।'
      },
      {
        q: 'मेरे टॉप क्लास आवेदन पर कार्रवाई (Deficiency) क्यों दिखाई दे रही है?',
        a: 'राज्य नोडल अधिकारी द्वारा वर्ष 2025-26 के आय प्रमाण पत्र के पुनः सत्यापन का अनुरोध किया गया है। आप "ट्रैकर" टैब में जाकर डिजिलॉकर लाइव सिंक द्वारा इसे तुरंत ठीक कर सकते हैं।'
      },
      {
        q: 'डिजिलॉकर से कौन से दस्तावेज़ सत्यापित हैं?',
        a: 'आपका आधार कार्ड, एसटी जाति प्रमाण पत्र (ई-डिस्ट्रिक्ट) एवं कक्षा 12 की अंकतालिका डिजिलॉकर और APAAR के माध्यम से डिजिटल रूप से सत्यापित हैं।'
      }
    ],
    generalReply: (query) => `"${query}" के संबंध में: जनजातीय कार्य मंत्रालय सभी एसटी छात्र-छात्राओं को डिजिलॉकर और प्रत्यक्ष बैंक अंतरण (DBT) के माध्यम से बिना किसी बिचौलिए के पारदर्शी सेवाएं प्रदान करता है। यदि आप शिकायत दर्ज करना चाहते हैं, तो मैं जिला जनजातीय कल्याण अधिकारी के पास टिकट दर्ज कर सकता हूँ।`
  },
  santhali: {
    welcome: (name) => `ᱡᱚᱦᱟᱨ ${name}! ᱤᱧ ᱫᱚ ᱡᱚᱱᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ (MoTA) ᱨᱤᱱᱤᱡ 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱮᱟᱭ ᱜᱚᱲᱚᱣᱟᱱ (JAGO)' ᱠᱟᱱᱟᱹᱧ᱾ ᱤᱧ ᱕ ᱜᱚᱴᱟᱝ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ, ᱰᱤᱵᱤᱴᱤ ᱴᱟᱠᱟ, ᱟᱨ ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱡᱟᱸᱪ ᱵᱟᱵᱚᱛ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱜᱚᱲᱚ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜ-ᱟᱹᱧ᱾`,
    citation: 'MoTA ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱱᱤᱭᱟᱹᱢ ᱒᱐᱒᱖-᱒᱗',
    inputPlaceholder: 'ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱠᱩᱞᱤ ᱢᱮ...',
    speakingToast: 'ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱟᱲᱟᱝ ᱥᱟᱰᱮ ᱪᱟᱹᱞᱩ ᱟᱠᱟᱱᱟ...',
    questions: [
      {
        q: 'ᱤᱧᱟᱜ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱟᱨ ᱴᱟᱠᱟ ᱧᱟᱢ ᱨᱮᱱᱟᱜ ᱦᱟᱞᱚᱛ ᱪᱮᱫ ᱠᱟᱱᱟ?',
        a: 'ᱟᱢᱟᱜ ᱯᱳᱥᱴ-ᱢᱮᱴᱨᱤᱠ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ (₹18,500) ᱯᱩᱨᱟᱹ ᱡᱟᱸᱪ ᱦᱩᱭ ᱟᱠᱟᱱᱟ ᱟᱨ SBI ᱵᱮᱸᱠ ᱮᱠᱟᱣᱩᱱᱴ ᱨᱮ ᱴᱟᱠᱟ ᱥᱮᱴᱮᱨ ᱟᱠᱟᱱᱟ (UTR: RBI2026091298412)᱾'
      },
      {
        q: 'ᱯᱳᱥᱴ-ᱢᱮᱴᱨᱤᱠ ᱛᱟᱦᱮᱸᱱ ᱛᱩᱞᱩᱡ NFST ᱯᱷᱮᱞᱳᱥᱤᱯ ᱧᱟᱢᱚᱜ-ᱟ ᱥᱮ ᱵᱟᱝ?',
        a: 'MoTA ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱨᱭᱟ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱢᱤᱫ ᱫᱷᱟᱣ ᱨᱮ ᱵᱟᱝ ᱧᱟᱢᱚᱜ-ᱟ᱾ ᱢᱮᱱᱠᱷᱟᱱ TRISHA ᱨᱮ ᱟᱡ ᱛᱮᱜᱮ NOC ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ NFST ᱨᱮ ᱵᱚᱫᱚᱞ ᱜᱟᱱᱚᱜ-ᱟ᱾'
      },
      {
        q: 'ᱴᱚᱯ ᱠᱞᱟᱥ ᱟᱨᱡᱤ ᱨᱮ ᱪᱮᱫ ᱠᱷᱟᱹᱛᱤᱨ ᱠᱟᱹᱢᱤ ᱵᱟᱹᱠᱤ ᱢᱮᱱᱟᱜ-ᱟ?',
        a: 'ᱨᱟᱡᱽ ᱱᱳᱰᱟᱞ ᱚᱯᱷᱤᱥᱟᱨ ᱱᱟᱣᱟ ᱟᱨᱡᱟᱣ (Income) ᱥᱟᱠᱟᱢ ᱮ ᱠᱷᱚᱡ ᱟᱠᱟᱫ-ᱟ᱾ Tracker ᱥᱟᱦᱴᱟ ᱨᱮ ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱛᱮ ᱱᱚᱣᱟ ᱴᱷᱤᱠ ᱜᱟᱱᱚᱜ-ᱟ᱾'
      }
    ],
    generalReply: (query) => `"${query}" ᱵᱟᱵᱚᱛ: ᱡᱚᱱᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ ᱥᱟᱱᱟᱢ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱟᱨ ᱥᱚᱡᱷᱮ ᱵᱮᱸᱠ ᱴᱨᱟᱱᱥᱯᱷᱟᱨ (DBT) ᱛᱮ ᱥᱩᱵᱤᱫᱷᱟᱭ ᱮᱢᱮᱫ-ᱟ᱾`
  },
  gondi: {
    welcome: (name) => `सेवा जोहार / राम-राम ${name}! नन्ना जनजातीय मंत्रालय (MoTA) ना 'सहायी संगी (JAGO)' आन। नन्ना सब्बों 5 योजनांग, DBT पैसा, अउर DigiLocker जांच बारोत गोंडी ते मदद कीके मंतोन।`,
    citation: 'MoTA गोंडी सेवा नियम 2026-27',
    inputPlaceholder: 'गोंडी ते सवाल कीम...',
    speakingToast: 'गोंडी ते आवाज चालू मंता...',
    questions: [
      {
        q: 'मावा छात्रवृत्ति अउर DBT पैसा ना हाल बोर मंता?',
        a: 'नीवा पोस्ट-मैट्रिक छात्रवृत्ति (₹18,500) जांच पूरो आता अउर SBI बैंक खाता ते पैसा जमा आता (UTR: RBI2026091298412)।'
      },
      {
        q: 'पोस्ट-मैट्रिक कज्या NFST फेलोशिप मिलि की?',
        a: 'MoTA ना नियम मुतालिक एक बेर ते रोंड (2) छात्रवृत्ति मिले वयो। पण TRISHA ते ऑटोमैटिक NOC कीसी NFST ते जासे सुविधा मंता।'
      },
      {
        q: 'टॉप क्लास अर्जी ते काम बोर बाकी मंता?',
        a: 'अफसर ना तरफ ते आय प्रमाण पत्र फेर जांच कीले कह्ता मंता। Tracker ते DigiLocker संगे ठीक कीम।'
      }
    ],
    generalReply: (query) => `"${query}" बारोत: जनजातीय मंत्रालय सब्बों आदिवासी पोरा-पोरी काजे DBT ते सीधा बैंक पैसा पोहचाने कीतो मंता।`
  }
}

export default function GrievanceAssistant({ activeStudent, lang = 'en', setLang, onToast }) {
  const currentLang = KNOWLEDGE_BASE[lang] ? lang : 'en'
  const kb = KNOWLEDGE_BASE[currentLang]

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: kb.welcome(activeStudent?.name || 'Priya'),
      citation: kb.citation
    }
  ])
  const [inputVal, setInputVal] = useState('')
  const [listening, setListening] = useState(false)
  const chatBottomRef = useRef(null)

  // When language changes, update greeting in that language
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: kb.welcome(activeStudent?.name || 'Priya'),
        citation: kb.citation
      }
    ])
  }, [lang, activeStudent])

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (textToSend) => {
    const query = textToSend || inputVal
    if (!query.trim()) return

    const userMsg = { id: Date.now(), sender: 'user', text: query }
    setMessages(prev => [...prev, userMsg])
    setInputVal('')

    // Generate intelligent AI response in current language
    setTimeout(() => {
      let botResponse = ''
      let citation = kb.citation

      // Check if it matches any suggested question in the current language
      const matchedQ = kb.questions.find(sq => sq.q.toLowerCase() === query.toLowerCase())

      if (matchedQ) {
        botResponse = matchedQ.a
      } else if (query.toLowerCase().includes('nfst') || query.toLowerCase().includes('fellowship') || query.toLowerCase().includes('phd')) {
        botResponse = currentLang === 'hi' 
          ? 'NFST (राष्ट्रीय फेलोशिप) एम.फिल और पीएच.डी. छात्रों को केनरा बैंक SFMP के माध्यम से ₹37,000/माह (JRF) और ₹42,000/माह (SRF) प्रदान करती है।'
          : currentLang === 'santhali'
          ? 'NFST ᱯᱷᱮᱞᱳᱥᱤᱯ ᱫᱚ M.Phil ᱟᱨ Ph.D ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ₹37,000/ᱪᱟᱸᱫᱚ (JRF) Canara Bank SFMP ᱛᱮ ᱮᱢᱚᱜ-ᱟ᱾'
          : currentLang === 'gondi'
          ? 'NFST फेलोशिप M.Phil अउर Ph.D पोरा काजे ₹37,000/महीना (JRF) Canara Bank SFMP ते देवे मंता।'
          : 'NFST (National Fellowship for ST Students) offers ₹37,000/month (JRF) and ₹42,000/month (SRF) via Canara Bank SFMP for regular Ph.D scholars.'
      } else if (query.toLowerCase().includes('dbt') || query.toLowerCase().includes('money') || query.toLowerCase().includes('payment') || query.toLowerCase().includes('पैसा') || query.toLowerCase().includes('ᱴᱟᱠᱟ')) {
        botResponse = currentLang === 'hi'
          ? 'आपकी हालिया पोस्ट-मैट्रिक डीबीटी राशि ₹18,500 सफलतापूर्वक 12 सितंबर 2026 को आपके खाते में जमा हो चुकी है (UTR: RBI2026091298412)।'
          : currentLang === 'santhali'
          ? 'ᱟᱢᱟᱜ ₹18,500 ᱰᱤᱵᱤᱴᱤ ᱴᱟᱠᱟ 12 ᱥᱮᱯᱴᱮᱢᱵᱚᱨ 2026 ᱨᱮ ᱵᱮᱸᱠ ᱮᱠᱟᱣᱩᱱᱴ ᱨᱮ ᱡᱚᱢᱟ ᱦᱩᱭ ᱟᱠᱟᱱᱟ (UTR: RBI2026091298412)᱾'
          : currentLang === 'gondi'
          ? 'नीवा ₹18,500 DBT पैसा 12 सितंबर 2026 ते बैंक खाता ते जमा आता (UTR: RBI2026091298412)।'
          : 'Your recent Post-Matric DBT credit of ₹18,500 was successfully remitted on 12 September 2026 (UTR: RBI2026091298412).'
      } else {
        botResponse = kb.generalReply(query)
      }

      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, sender: 'bot', text: botResponse, citation }
      ])
    }, 500)
  }

  const toggleMic = () => {
    if (!listening) {
      setListening(true)
      const langName = lang === 'hi' ? 'हिंदी (Hindi)' : lang === 'santhali' ? 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)' : lang === 'gondi' ? 'गोंडी (Gondi)' : 'English'
      onToast?.(`Listening for voice input in ${langName}...`, 'info')
      
      setTimeout(() => {
        setListening(false)
        const sampleQuery = kb.questions[0]?.q || 'What is my scholarship status?'
        setInputVal(sampleQuery)
        onToast?.('Voice transcribed successfully!', 'success')
      }, 1800)
    } else {
      setListening(false)
    }
  }

  const handleSpeak = (text) => {
    onToast?.(kb.speakingToast, 'info')
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      if (lang === 'hi') utterance.lang = 'hi-IN'
      else utterance.lang = 'en-IN'
      window.speechSynthesis.speak(utterance)
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
              <span className="badge badge-primary">Multilingual Voice & NLP</span>
              <span className="badge badge-success">MoTA AI Sahayak (JAGO)</span>
            </div>
            <h1 className="assistant-title">Tribal Student Grievance & Guidance Assistant</h1>
          </div>
        </div>

        <div className="assistant-header-right">
          <Languages size={16} className="lang-icon-header" />
          <span className="lang-label">Dialect:</span>
          <select 
            value={lang} 
            onChange={(e) => {
              setLang?.(e.target.value)
              onToast?.(`Switched JAGO Assistant to ${e.target.options[e.target.selectedIndex].text}`, 'info')
            }}
            className="assistant-lang-select"
          >
            <option value="en">English (Official)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="santhali">ᱥᱟᱱᱛᱟᱲᱤ (Santhali)</option>
            <option value="gondi">गोंडी (Gondi)</option>
          </select>
        </div>
      </div>

      {/* Suggested Questions Grid in Current Selected Language */}
      <div className="suggested-queries-strip">
        {kb.questions.map((sq, idx) => (
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
                <div className="bubble-avatar bot-avatar">
                  <Bot size={16} />
                </div>
              )}

              <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                <p className="bubble-text">{msg.text}</p>
                <div className="bubble-footer-row">
                  {msg.citation && (
                    <div className="bubble-citation">
                      <ShieldCheck size={12} />
                      <span>{msg.citation}</span>
                    </div>
                  )}
                  {msg.sender === 'bot' && (
                    <button 
                      className="speak-btn" 
                      onClick={() => handleSpeak(msg.text)}
                      title="Listen with Text-to-Speech"
                    >
                      <Volume2 size={13} /> Listen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <button 
            className={`mic-button ${listening ? 'mic-listening' : ''}`}
            onClick={toggleMic}
            title="Speak query in tribal dialect or Hindi"
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input 
            type="text" 
            placeholder={listening ? "Listening to your voice..." : kb.inputPlaceholder}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="chat-text-input"
          />

          <button 
            className="btn btn-primary send-chat-btn"
            onClick={() => handleSend()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
