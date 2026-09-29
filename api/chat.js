import { GoogleGenerativeAI } from '@google/generative-ai'

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-flash-latest']

const SYSTEM_INSTRUCTION = `You are "TRISHA Tribal AI Sahayak" (जनजातीय छात्रवृत्ति एवं मार्गदर्शन सहायक), the official AI assistant for the Ministry of Tribal Affairs (MoTA), Government of India.

Core Responsibilities & Knowledge:
1. MOTA 5 SCHEMES:
   - Pre-Matric ST (Classes IX-X, drop-out prevention, state-shared 75:25).
   - Post-Matric ST (Post-secondary, ITI/Diploma/UG/PG, tuition + maintenance via PFMS DBT).
   - Top Class Education for ST (Full tuition + ₹36,000/yr living allowance at 265+ premier institutes: IITs, NITs, IIMs, AIIMS, NLUs).
   - National Fellowship for ST (NFST) (M.Phil & Ph.D regular research, Canara Bank SFMP, JRF ₹37,000/mo, SRF ₹42,000/mo, 750 slots).
   - National Overseas Scholarship (NOS) (Masters & Ph.D abroad at QS Top 500 universities, 100% tuition + living stipends).
2. ANTI-DUPLICATION & GFR 2017 RULE 11:
   - Simultaneous availing of two central/state government scholarships is prohibited.
   - TRISHA provides an automated Scheme Transition / Relinquishment NOC wizard so students selected for higher grants (like NFST) can transition seamlessly without penalties.
3. DIGILOCKER & DBT:
   - Aadhaar-linked verification, APAAR ID, paperless e-District caste certificates, PFMS Aadhaar Payment Bridge.
4. GENERAL KNOWLEDGE & REAL WORLD ASSISTANCE:
   - You can answer ANY real-world question with rich knowledge, including Indian history, cultural specialties, states and heritage, science, careers, and higher education.
   - Maintain a warm, encouraging, respectful tone (Johar / Namaste / जय जोहार).
   - If queried in Hindi, reply in clear, natural Hindi. If queried in a tribal dialect (Santhali, Gondi, etc.), answer respectfully in that language or bilingual Hindi/English with cultural understanding.
   - Keep answers clear, structured, and easy to read with bullet points where appropriate.`

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-gemini-key'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' })
  }

  try {
    const { message, language = 'en', studentProfile, clientApiKey } = req.body || {}
    const trimmed = (message || '').trim()

    if (!trimmed) {
      return res.status(400).json({ success: false, error: 'Query message is required.' })
    }

    // Determine API Key priority: request body/header > environment variable
    const headerKey = req.headers['x-gemini-key']
    const apiKey = (clientApiKey || headerKey || process.env.GEMINI_API_KEY || '').trim()

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'NO_API_KEY',
        message: 'Gemini API key is not configured. Please provide a key in settings or server env.'
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
        console.warn(`[Vercel Serverless /api/chat] Model ${modelName} failed:`, err.message)
      }
    }

    if (!replyText) {
      const isLeaked = lastError?.message?.includes('leaked') || lastError?.message?.includes('reported as leaked')
      return res.status(isLeaked ? 403 : 500).json({
        success: false,
        error: isLeaked ? 'KEY_LEAKED' : 'GENERATION_FAILED',
        message: isLeaked
          ? 'Your Gemini API key was reported as leaked by Google. Please generate a fresh API key from Google AI Studio (aistudio.google.com).'
          : (lastError?.message || 'Failed to generate response from Gemini API.')
      })
    }

    return res.status(200).json({
      success: true,
      reply: replyText,
      model: usedModel,
      citation: 'MoTA Central Guidelines & Google Gemini 3.8 Flash'
    })
  } catch (err) {
    console.error('[API /api/chat Error]:', err)
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: err.message || 'Internal server error while processing query.'
    })
  }
}
