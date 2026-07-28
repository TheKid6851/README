// Cloudflare Worker: holds AI provider keys server-side and proxies
// open-ended questions from the Jarvis app to them. Tries Gemini first
// (free tier, with Google Search grounding for time-sensitive questions);
// if Gemini errors or its free quota is exhausted, falls back to Groq
// (also free tier) so the app keeps answering instead of going dark.
//
// Keys never reach the browser — set them with:
//   wrangler secret put GEMINI_API_KEY
//   wrangler secret put GROQ_API_KEY   (optional, enables the fallback)

const SYSTEM_PROMPT = 'You are J.A.R.V.I.S., a concise voice assistant. '
  + 'Answer in a natural, spoken style: a few sentences unless the question '
  + 'truly requires more detail. No markdown, no bullet lists, no headers — '
  + 'this text is read aloud. If the question is about current events, '
  + 'prices, scores, or anything else time-sensitive, use search to check '
  + 'before answering. Never say what model or company you are — you are Jarvis.'

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

// Google Search grounding — real, live web lookups for time-sensitive
// questions. This is Jarvis's primary provider.
async function callGemini(env, message, systemText) {
  const model = env.GEMINI_MODEL || 'gemini-2.5-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  const payload = {
    systemInstruction: { parts: [{ text: systemText }] },
    contents: [{ role: 'user', parts: [{ text: message }] }],
    tools: [{ google_search: {} }],
    generationConfig: { maxOutputTokens: 400 },
  }

  const upstream = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': env.GEMINI_API_KEY,
    },
    body: JSON.stringify(payload),
  })

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '')
    throw new Error(`Gemini ${upstream.status}: ${detail.slice(0, 300)}`)
  }

  const data = await upstream.json()
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .filter(Boolean)
    .join(' ')
    .trim()
  if (!text) throw new Error('Gemini returned no text')
  return text
}

// No live web access, but a solid free fallback so the app keeps working
// when Gemini's free quota is exhausted or briefly down.
async function callGroq(env, message, systemText) {
  const model = env.GROQ_MODEL || 'llama-3.3-70b-versatile'
  const url = 'https://api.groq.com/openai/v1/chat/completions'

  const upstream = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemText },
        { role: 'user', content: message },
      ],
      max_tokens: 400,
    }),
  })

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '')
    throw new Error(`Groq ${upstream.status}: ${detail.slice(0, 300)}`)
  }

  const data = await upstream.json()
  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('Groq returned no text')
  return text
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) })
    }
    if (request.method !== 'POST') {
      return json(env, { error: 'Method not allowed' }, 405)
    }
    if (!env.GEMINI_API_KEY && !env.GROQ_API_KEY) {
      return json(env, { error: 'Server missing GEMINI_API_KEY / GROQ_API_KEY' }, 500)
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
    const systemText = `${SYSTEM_PROMPT} ${PERSONA_HINTS[persona]}`

    const errors = []

    if (env.GEMINI_API_KEY) {
      try {
        const text = await callGemini(env, message, systemText)
        return json(env, { text, provider: 'gemini' })
      } catch (err) {
        errors.push(String(err?.message || err))
      }
    }

    if (env.GROQ_API_KEY) {
      try {
        const text = await callGroq(env, message, systemText)
        return json(env, { text, provider: 'groq' })
      } catch (err) {
        errors.push(String(err?.message || err))
      }
    }

    return json(env, { error: 'All providers failed', detail: errors.join(' | ') }, 502)
  },
}
