// TRISHA Gemini AI Client Service
// Provides dynamic AI queries via Vercel serverless /api/chat OR direct Google AI Studio API

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest']

export const getStoredApiKey = () => {
  return (
    localStorage.getItem('trisha_gemini_api_key') ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    ''
  ).trim()
}

export const setStoredApiKey = (key) => {
  if (key) {
    localStorage.setItem('trisha_gemini_api_key', key.trim())
  } else {
    localStorage.removeItem('trisha_gemini_api_key')
  }
}

const SYSTEM_PROMPT = `You are "TRISHA Tribal AI Sahayak" (जनजातीय छात्रवृत्ति एवं मार्गदर्शन सहायक), the official AI assistant for the Ministry of Tribal Affairs (MoTA), Government of India.

CORE DIRECTIVES:
1. MOTA 5 SCHEMES EXPERTISE:
   - Pre-Matric ST: Classes IX & X, NSP portal, drop-out prevention, 75:25 central-state funding.
   - Post-Matric ST: Classes XI, XII, ITI, Diploma, Undergraduate & Postgraduate degrees. Tuition + monthly living stipend via PFMS DBT.
   - Top Class Education for ST: Full tuition fee reimbursement + ₹36,000/yr living expenses across 265+ premier notified institutes (IITs, NITs, IIMs, AIIMS, NLUs). 100% Central Sector.
   - National Fellowship for ST (NFST): M.Phil & Ph.D regular research scholars. ₹37,000/month (JRF) & ₹42,000/month (SRF) disbursed via Canara Bank SFMP. 750 national slots.
   - National Overseas Scholarship (NOS): Masters & Ph.D degrees at QS Top 500 foreign universities. 100% tuition + living stipends.

2. ANTI-DUPLICATION & RULE 11 GFR 2017:
   - Simultaneous availing of multiple central or state scholarships is strictly prohibited.
   - TRISHA features an automated Relinquishment / Scheme Transition NOC wizard allowing students to safely relinquish previous allocations when upgraded to higher schemes (e.g., Post-Matric to NFST) without double-dipping penalties.

3. DIGILOCKER & DBT VERIFICATION:
   - Auto-verified credentials: ST Certificate (State e-District), Aadhaar, APAAR ID, Class 10/12 marksheets.
   - If deficiency is marked, students can resolve it in 1-click via DigiLocker live sync without visiting government offices.

4. BROAD REAL-WORLD & GENERAL KNOWLEDGE:
   - You are NOT restricted to MoTA questions. You can answer ANY real-world, cultural, educational, scientific, geographic, or general question asked by the user (such as specialties of India, state cultures, tribal heritage, career guidance, higher education paths, literature, history, and technologies).
   - Answer with enthusiasm, depth, structure, and clarity.
   - Greet warmly with "Johar 🙏 / Namaste / जय जोहार" when appropriate.
   - Respond in the language or dialect used by the user (English, Hindi, Santhali, Gondi, Ho, Bodo, Bengali, Odia, Telugu, or Hinglish).`

export async function askGemini({ query, lang = 'en', activeStudent, customApiKey }) {
  const apiKey = (customApiKey || getStoredApiKey()).trim()

  // 1. First attempt: call backend / Vercel serverless function /api/chat
  try {
    const apiRes = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-gemini-key': apiKey } : {})
      },
      body: JSON.stringify({
        message: query,
        language: lang,
        clientApiKey: apiKey,
        studentProfile: activeStudent ? {
          name: activeStudent.name,
          category: activeStudent.category || 'Scheduled Tribe',
          institution: activeStudent.institution,
          currentScheme: activeStudent.applications?.[0]?.schemeId || 'Post-Matric ST'
        } : null
      })
    })

    if (apiRes.ok) {
      const data = await apiRes.json()
      if (data.success && data.reply) {
        return {
          success: true,
          reply: data.reply,
          model: data.model || 'Gemini 3.8 Flash',
          citation: data.citation || 'MoTA Guidelines & Live Gemini AI'
        }
      }
    } else {
      const errData = await apiRes.json().catch(() => ({}))
      if (errData.error === 'KEY_LEAKED') {
        return {
          success: false,
          error: 'KEY_LEAKED',
          message: errData.message || 'API key reported as leaked by Google.'
        }
      }
    }
  } catch {
    // Backend fetch failed or in offline dev, fall back to direct client API call if key is present
  }

  // 2. Direct client-side Google AI call if an API key is available
  if (apiKey) {
    for (const model of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${query}` }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600
            }
          })
        })

        const data = await res.json()
        if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return {
            success: true,
            reply: data.candidates[0].content.parts[0].text,
            model,
            citation: 'MoTA Central Guidelines & Google Gemini 3.8 Flash'
          }
        }

        if (data.error) {
          const errMsg = data.error.message || ''
          if (errMsg.includes('leaked') || errMsg.includes('reported as leaked')) {
            return {
              success: false,
              error: 'KEY_LEAKED',
              message: 'Your Google Gemini API key was reported as leaked. Please generate a fresh key at aistudio.google.com.'
            }
          }
          if (data.error.code === 400 || data.error.code === 403) {
            return {
              success: false,
              error: 'AUTH_FAILED',
              message: data.error.message
            }
          }
        }
      } catch (e) {
        console.warn(`[Direct Gemini fetch ${model} error]:`, e)
      }
    }
  }

  // 3. Fallback when no active working API key is provided
  return {
    success: false,
    error: apiKey ? 'API_CALL_FAILED' : 'NO_API_KEY',
    message: apiKey 
      ? 'Unable to connect to Google Gemini API with the current key.' 
      : 'No active Gemini API key configured.'
  }
}
