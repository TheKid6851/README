// Cloudflare Worker: holds the Gemini API key server-side and proxies
// open-ended questions from the Jarvis app to Google's free-tier Gemini
// API, with Google Search grounding for time-sensitive questions.
//
// The key never reaches the browser — set it with:
//   wrangler secret put GEMINI_API_KEY

const SYSTEM_PROMPT = 'You are J.A.R.V.I.S., a concise voice assistant. '
  + 'Answer in a natural, spoken style: a few sentences unless the question '
  + 'truly requires more detail. No markdown, no bullet lists, no headers — '
  + 'this text is read aloud. If the question is about current events, '
  + 'prices, scores, or anything else time-sensitive, use search to check '
  + 'before answering. Never say you are Gemini or a Google model — you are Jarvis.'

const PERSONA_HINTS = {
  formal: 'Speak formally and precisely, like a professional aide.',
  casual: 'Speak casually and warmly, like a friend.',
  minimal: 'Be extremely terse — one short sentence, no fluff.',
}

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function json(env, obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) })
    }
    if (request.method !== 'POST') {
      return json(env, { error: 'Method not allowed' }, 405)
    }
    if (!env.GEMINI_API_KEY) {
      return json(env, { error: 'Server missing GEMINI_API_KEY' }, 500)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json(env, { error: 'Invalid JSON body' }, 400)
    }

    const message = String(body?.message || '').trim().slice(0, 2000)
    if (!message) return json(env, { error: 'Missing "message"' }, 400)
    const persona = PERSONA_HINTS[body?.persona] ? body.persona : 'formal'

    const model = env.GEMINI_MODEL || 'gemini-2.5-flash'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

    const payload = {
      systemInstruction: {
        parts: [{ text: `${SYSTEM_PROMPT} ${PERSONA_HINTS[persona]}` }],
      },
      contents: [{ role: 'user', parts: [{ text: message }] }],
      tools: [{ google_search: {} }],
      generationConfig: { maxOutputTokens: 400 },
    }

    let upstream
    try {
      upstream = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      })
    } catch {
      return json(env, { error: 'Could not reach Gemini' }, 502)
    }

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '')
      return json(env, { error: 'Gemini request failed', detail: detail.slice(0, 500) }, 502)
    }

    const data = await upstream.json()
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text)
      .filter(Boolean)
      .join(' ')
      .trim()

    return json(env, { text: text || "I couldn't come up with an answer for that." })
  },
}
