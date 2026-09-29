// ─────────────────────────────────────────────────────────────────────────────
// TRISHA API Routes — MongoDB / Mongoose Version
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Scheme, Household, Student, Application, Document, Notification, ConflictLog } from '../models/index.js'

const router = Router()

// ──── GET /api/schemes ────
router.get('/schemes', async (req, res) => {
  try {
    const schemes = await Scheme.find().sort('code').lean()
    res.json({ success: true, data: schemes })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── GET /api/schemes/:id ────
router.get('/schemes/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id).lean()
    if (!scheme) return res.status(404).json({ success: false, error: 'Scheme not found' })
    res.json({ success: true, data: scheme })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── GET /api/household/:id ────
router.get('/household/:id', async (req, res) => {
  try {
    const household = await Household.findById(req.params.id).lean()
    if (!household) return res.status(404).json({ success: false, error: 'Household not found' })
    const members = await Student.find({ householdId: req.params.id }).sort({ isPrimary: -1 }).lean()
    res.json({ success: true, data: { ...household, members } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── GET /api/students/:id ────
router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean()
    if (!student) return res.status(404).json({ success: false, error: 'Student not found' })
    res.json({ success: true, data: student })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── GET /api/students/:id/applications ────
router.get('/students/:id/applications', async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.params.id }).sort({ appliedDate: -1 }).lean()
    res.json({ success: true, data: apps })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── GET /api/students/:id/documents ────
router.get('/students/:id/documents', async (req, res) => {
  try {
    const docs = await Document.find({ studentId: req.params.id }).lean()
    res.json({ success: true, data: docs })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── GET /api/students/:id/notifications ────
router.get('/students/:id/notifications', async (req, res) => {
  try {
    const notifs = await Notification.find({ studentId: req.params.id }).sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: notifs })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── POST /api/conflict-check ────
// Cross-scheme deduplication engine
router.post('/conflict-check', async (req, res) => {
  try {
    const { studentId, targetSchemeId } = req.body

    const activeApp = await Application.findOne({
      studentId,
      status: { $in: ['disbursed', 'action_required', 'in_progress', 'under_review', 'sanctioned'] }
    }).lean()

    if (!activeApp) {
      return res.json({ success: true, hasConflict: false, message: 'No active scholarships detected. Student is clear to apply.' })
    }

    const targetScheme = await Scheme.findById(targetSchemeId).lean()
    if (!targetScheme) return res.status(404).json({ success: false, error: 'Target scheme not found' })

    const existingScheme = await Scheme.findById(activeApp.schemeId).lean()

    // Duplicate Application
    if (activeApp.schemeId === targetSchemeId) {
      return res.json({
        success: true, hasConflict: true,
        type: 'DUPLICATE_APPLICATION',
        title: 'Duplicate Application Detected',
        reason: `Active application ${activeApp._id} already exists for ${targetScheme.name}.`,
        policyClause: 'Section 4.2: Only one active application per scheme per academic cycle.',
        canRelinquish: false
      })
    }

    // Post-Matric → Top Class Superseding
    if (activeApp.schemeId === 'post-matric' && targetSchemeId === 'top-class') {
      return res.json({
        success: true, hasConflict: true,
        type: 'SCHEME_SUPERSEDING',
        title: 'MoTA Cross-Portal Conflict: Post-Matric & Top Class',
        reason: `Active disbursement of ${existingScheme.name} detected via ${activeApp.portal}. Top Class requires surrender of existing Post-Matric allocation.`,
        policyClause: 'MoTA Operational Guidelines Para 7.1: Student must relinquish Post-Matric upon Top Class sanction.',
        canRelinquish: true,
        existingAppId: activeApp._id
      })
    }

    // General Concurrent Conflict
    return res.json({
      success: true, hasConflict: true,
      type: 'SIMULTANEOUS_BENEFIT_BARRED',
      title: 'Concurrent Scholarship/Fellowship Barred',
      reason: `Student is receiving ${existingScheme.name} via ${activeApp.portal}. Simultaneous receipt of ${targetScheme.name} is prohibited.`,
      policyClause: 'Rule 11 (GFR 2017): No scholar shall receive dual financial aid from Central/State Government.',
      canRelinquish: true,
      existingAppId: activeApp._id
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── POST /api/applications ────
router.post('/applications', async (req, res) => {
  try {
    const { studentId, schemeId, portal, sanctionAmount } = req.body
    const appId = `APP-MOTA-2026-${Date.now()}`

    const newApp = await Application.create({
      _id: appId,
      studentId, schemeId, portal,
      appliedDate: new Date().toISOString().split('T')[0],
      academicSession: '2026-27',
      sanctionAmount: sanctionAmount || 'Pending Assessment',
      status: 'submitted',
      statusText: 'Provisional Application Registered (NOC Pending)',
      statusType: 'primary',
      lastActionDate: new Date().toISOString().split('T')[0],
      stages: [
        { stageNumber: 1, title: 'DigiLocker Identity & ST Verification', date: new Date().toISOString().split('T')[0], isDone: true, remarks: 'Auto-verified via MoTA Central Registry' },
        { stageNumber: 2, title: 'Institution Bonafide Verification', isDone: false, isActive: true },
        { stageNumber: 3, title: 'State Tribal Welfare Clearance', isDone: false },
        { stageNumber: 4, title: 'MoTA Central Sanction', isDone: false },
        { stageNumber: 5, title: 'PFMS Direct Benefit Transfer', isDone: false }
      ],
      deficiencies: []
    })

    // Log conflict audit
    await ConflictLog.create({
      studentId, targetSchemeId: schemeId,
      conflictType: 'NEW_APPLICATION',
      resolution: 'SUBMITTED',
      nocReference: `NOC-MOTA-2026-${Math.floor(1000 + Math.random() * 9000)}`
    })

    res.json({ success: true, applicationId: appId, message: `Application ${appId} submitted successfully.` })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── PUT /api/applications/:id/resolve-deficiency ────
router.put('/applications/:id/resolve-deficiency', async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
    if (!app) return res.status(404).json({ success: false, error: 'Application not found' })

    app.deficiencies = []
    app.status = 'under_review'
    app.statusText = 'Deficiency Cleared: State Review Resumed'
    app.stages = app.stages.map(s => {
      if (s.stageNumber === 3) return { ...s.toObject(), isDone: true, isActive: false, remarks: 'Income certificate e-verified via DigiLocker' }
      if (s.stageNumber === 4) return { ...s.toObject(), isActive: true }
      return s
    })
    await app.save()

    res.json({ success: true, message: 'Deficiency resolved and application resumed.' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── PUT /api/notifications/mark-read ────
router.put('/notifications/mark-read', async (req, res) => {
  try {
    const { studentId } = req.body
    await Notification.updateMany({ studentId }, { isRead: true })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── GET /api/stats/dashboard ────
// Aggregated stats for the dashboard
router.get('/stats/dashboard', async (req, res) => {
  try {
    const { studentId } = req.query
    const filter = studentId ? { studentId } : {}

    const totalApps = await Application.countDocuments(filter)
    const disbursed = await Application.countDocuments({ ...filter, status: 'disbursed' })
    const actionRequired = await Application.countDocuments({ ...filter, status: 'action_required' })
    const totalSchemes = await Scheme.countDocuments()

    // Sum of DBT amounts
    const disbursedApps = await Application.find({ ...filter, status: 'disbursed' }).lean()
    let totalDisbursed = 0
    for (const app of disbursedApps) {
      if (app.dbtDetails?.amountCredited) {
        const num = parseInt(app.dbtDetails.amountCredited.replace(/[^0-9]/g, ''), 10)
        if (!isNaN(num)) totalDisbursed += num
      }
    }

    res.json({
      success: true,
      data: {
        totalApplications: totalApps,
        disbursedCount: disbursed,
        actionRequiredCount: actionRequired,
        totalSchemes,
        totalDisbursedAmount: `₹${totalDisbursed.toLocaleString('en-IN')}`,
        verificationCompletionRate: totalApps > 0 ? Math.round((disbursed / totalApps) * 100) : 0
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ──── POST /api/chat — Tribal AI Sahayak (Powered by Google Gemini) ────
router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'en', studentId } = req.body
    const trimmed = (message || '').trim()

    if (!trimmed) {
      return res.status(400).json({ success: false, error: 'Query message is required.' })
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim()
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is not configured on the server.' })
    }

    // Pull student demographic context if provided
    let studentContext = ''
    if (studentId) {
      const student = await Student.findById(studentId).lean()
      if (student) {
        const apps = await Application.find({ studentId }).lean()
        studentContext = `
STUDENT PROFILE:
Name: ${student.name} (${student.nameHi || ''})
Tribal Category: Scheduled Tribe (Munda)
Institution: ${student.institution} (${student.academicProgram}, ${student.yearOfStudy})
APAAR ID: ${student.apaarId}
Active Applications: ${apps.map(a => `${a.schemeId} (${a.portal}) - Status: ${a.statusText}`).join('; ')}
`
      }
    }

    const systemPrompt = `You are "TRISHA Tribal AI Sahayak" (जनजातीय छात्रवृत्ति सहायक), the official AI assistant of the Ministry of Tribal Affairs (MoTA), Government of India.
You provide accurate, empathetic, and clear guidance to Scheduled Tribe (ST) and Particularly Vulnerable Tribal Group (PVTG) students regarding scholarship schemes, verification procedures, DigiLocker documentation, and Direct Benefit Transfer (DBT).

KNOWLEDGE BASE:
1. 5 MoTA SCHEMES:
   - Pre-Matric ST: Classes IX & X, NSP portal, 75:25 funding ratio, prevents school dropouts.
   - Post-Matric ST: Post-secondary up to post-graduate, NSP portal, tuition + living allowance via PFMS DBT.
   - Top Class Education for ST: Premier institutions (IITs, NITs, IIMs, AIIMS, NLUs), full tuition + ₹36,000/year living grant, central sector 100%.
   - National Fellowship for Higher Education of ST Students (NFST): M.Phil & Ph.D scholars, SFMP (Canara Bank) portal, JRF ₹37,000/mo, SRF ₹42,000/mo.
   - National Overseas Scholarship for ST Candidates (NOS): Masters & Ph.D in QS Top 500 foreign universities, standalone NOS portal, 100% ministry sponsorship.

2. ANTI-DUPLICATION & CROSS-SCHEME CONFLICT RULES:
   - Rule 11 (GFR 2017) & MoTA Para 7.1: A student CANNOT simultaneously avail two scholarship/fellowship schemes from Central/State Government.
   - If a student currently receives Post-Matric and gets selected for Top Class or NFST, they must surrender/relinquish the previous grant with an online Relinquishment NOC through TRISHA before receiving funds from the new scheme.

3. VERIFICATION & DEFICIENCIES:
   - Verification stages: (1) DigiLocker Identity/ST Certificate, (2) Institute Nodal Officer, (3) State Tribal Welfare Department, (4) MoTA Central Sanction, (5) PFMS Direct Benefit Transfer to Aadhaar-seeded bank account.
   - If flagged with a deficiency (e.g., illegible income certificate), students can re-sync updated documents directly from DigiLocker without visiting physical offices.

LANGUAGE & TONE INSTRUCTIONS:
- Greet warmly (Johar / Namaste / जय जोहार).
- Current user selected language: "${language}" (en: English, hi: Hindi, santhali: Santhali, gondi: Gondi).
- When language is Hindi or tribal dialect, respond naturally in respectful Hindi / bilingual with Ol Chiki / dialect terms when appropriate.
- Keep responses concise, structured, encouraging, and actionable (maximum 2-3 clear paragraphs or bullet points).
${studentContext}
`

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Try candidate models supported by Google Gemini API
    const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.5-flash']
    let replyText = null
    let usedModel = null

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt
        })
        const result = await model.generateContent(trimmed)
        const response = await result.response
        replyText = response.text()
        if (replyText) {
          usedModel = modelName
          break
        }
      } catch (err) {
        console.warn(`[Gemini model ${modelName} retry]:`, err.message)
      }
    }

    if (!replyText) {
      throw new Error('All Gemini model candidates failed or timed out.')
    }

    res.json({
      success: true,
      reply: replyText,
      model: usedModel,
      citation: 'MoTA Central Guidelines & Live Gemini 2.5'
    })
  } catch (err) {
    console.error('[CHAT API ERROR]:', err)
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI response',
      detail: err.message
    })
  }
})

export default router
