import { GoogleGenerativeAI } from '@google/generative-ai'

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest']

const SYSTEM_INSTRUCTION = `You are "TRISHA Tribal AI Sahayak" (जनजातीय छात्रवृत्ति एवं मार्गदर्शन सहायक), the official AI assistant for the Ministry of Tribal Affairs (MoTA), Government of India.

Core Responsibilities & Knowledge:
1. MOTA 5 SCHEMES:
   - Pre-Matric ST (Classes IX-X, drop-out prevention, state-shared 75:25).
   - Post-Matric ST (Classes XI, XII, ITI, Diploma, UG & PG. Tuition + monthly living stipend via PFMS DBT).
   - Top Class Education for ST (Full tuition fee + ₹36,000/yr living expenses across 265+ premier notified institutes: IITs, NITs, IIMs, AIIMS, NLUs. 100% Central Sector).
   - National Fellowship for ST (NFST) (M.Phil & Ph.D regular research scholars. ₹37,000/month (JRF) & ₹42,000/month (SRF) via Canara Bank SFMP. 750 national slots).
   - National Overseas Scholarship (NOS) (Masters & Ph.D degrees at QS Top 500 foreign universities. 100% tuition + living stipends).
2. ANTI-DUPLICATION & GFR 2017 RULE 11:
   - Simultaneous availing of two central/state government scholarships is prohibited.
   - TRISHA features an automated Scheme Transition / Relinquishment NOC wizard allowing students to safely relinquish previous allocations when upgraded to higher schemes.
3. DIGILOCKER & DBT:
   - Aadhaar-linked verification, APAAR ID, paperless e-District caste certificates, PFMS Aadhaar Payment Bridge.
4. GENERAL KNOWLEDGE & REAL WORLD ASSISTANCE:
   - You can answer ANY real-world question with rich knowledge, including Indian history, cultural specialties, states and heritage, science, careers, and higher education.
   - Maintain a warm, encouraging, respectful tone (Johar / Namaste / जय जोहार).
   - If queried in Hindi, reply in clear, natural Hindi. If queried in a tribal dialect, answer respectfully in that language or bilingual.
   - Keep responses concise, structured, encouraging, and actionable (maximum 2-3 clear paragraphs or bullet points).`

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' })

  try {
    const { message, language = 'en', studentProfile } = req.body || {}
    const trimmed = (message || '').trim()

    if (!trimmed) {
      return res.status(400).json({ success: false, error: 'Query message is required.' })
    }

    // API key is server-side only — never exposed to users
    const apiKey = (process.env.GEMINI_API_KEY || '').trim()
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'SERVICE_UNAVAILABLE',
        message: 'AI service is temporarily unavailable. Our team is working on it.'
      })
    }

    let contextualPrompt = SYSTEM_INSTRUCTION
    if (studentProfile) {
      contextualPrompt += `\n\nACTIVE STUDENT CONTEXT:\nName: ${studentProfile.name || 'Student'}\nCategory: ${studentProfile.category || 'Scheduled Tribe'}\nInstitution: ${studentProfile.institution || 'Recognized Institute'}\nActive Scheme: ${studentProfile.currentScheme || 'Post-Matric ST'}`
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    let replyText = null
    let usedModel = null
    let lastError = null

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: contextualPrompt
        })
        const result = await model.generateContent(trimmed)
        const response = await result.response
        replyText = response.text()
        if (replyText) {
          usedModel = modelName
          break
        }
      } catch (err) {
        lastError = err
        console.warn(`[Vercel /api/chat] Model ${modelName} failed:`, err.message)
      }
    }

    if (!replyText) {
      const isLeaked = lastError?.message?.includes('leaked')
      return res.status(500).json({
        success: false,
        error: isLeaked ? 'KEY_REVOKED' : 'GENERATION_FAILED',
        message: 'AI service encountered an issue. Please try again shortly.'
      })
    }

    return res.status(200).json({
      success: true,
      reply: replyText,
      model: usedModel,
      citation: 'MoTA Central Guidelines & Google Gemini AI'
    })
  } catch (err) {
    console.error('[API /api/chat Error]:', err)
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'AI service temporarily unavailable.'
    })
  }
}
