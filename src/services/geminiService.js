// TRISHA Gemini AI Client Service
// Calls the Vercel serverless /api/chat endpoint (API key is server-side only, never exposed to users)

export async function askGemini({ query, lang = 'en', activeStudent }) {
  // Call backend serverless function /api/chat — key is stored server-side only
  try {
    const apiRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        language: lang,
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
    }

    // Parse error details
    const errData = await apiRes.json().catch(() => ({}))
    return {
      success: false,
      error: errData.error || 'API_ERROR',
      message: errData.message || errData.detail || 'AI service temporarily unavailable.'
    }
  } catch (err) {
    console.warn('[GeminiService] Network error:', err.message)
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Unable to reach AI server. Please check your internet connection.'
    }
  }
}
