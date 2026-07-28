// Cloudflare Worker: holds AI provider keys server-side and proxies
// open-ended questions from the Jarvis app to them. Tries each configured
// provider in order (best/most-reliable first) until one succeeds:
//   1. Gemini       — free tier, with live Google Search grounding
//   2. Groq         — free tier, fast, large model, no live search
//   3. Cerebras     — free tier, fast, large model, no live search
//   4. SambaNova    — free tier, large model, no live search
//   5. Together AI  — explicitly free-tier model, no live search
//   6. Mistral      — free tier, no live search
//   7. NVIDIA NIM   — free credits, broad model catalog, no live search
//   8. GitHub Models — free (any GitHub account), tight rate limits
//   9. OpenRouter   — free-tier (":free") models, no live search
//  10. Cohere       — free trial key, no live search
//  11. HuggingFace  — free inference router, no live search
// If a provider errors or its free quota is exhausted, the next one in
// the chain is tried automatically, so one provider running dry doesn't
// take the app down. You don't need all of these configured — even
// Gemini + one fallback covers most cases; the rest are just headroom.
//
// Keys never reach the browser — set only the ones you want with:
//   wrangler secret put GEMINI_API_KEY
//   wrangler secret put GROQ_API_KEY
//   wrangler secret put CEREBRAS_API_KEY
//   wrangler secret put SAMBANOVA_API_KEY
//   wrangler secret put TOGETHER_API_KEY
//   wrangler secret put MISTRAL_API_KEY
//   wrangler secret put NVIDIA_API_KEY
//   wrangler secret put GITHUB_MODELS_TOKEN
//   wrangler secret put OPENROUTER_API_KEY
//   wrangler secret put COHERE_API_KEY
//   wrangler secret put HF_API_KEY
// Any provider whose key isn't set is skipped. Add more the same way —
// append an entry to PROVIDERS below for any other OpenAI-compatible
// free-tier API.

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
    throw new Error(`${upstream.status}: ${detail.slice(0, 300)}`)
  }

  const data = await upstream.json()
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text)
    .filter(Boolean)
    .join(' ')
    .trim()
  if (!text) throw new Error('returned no text')
  return text
}

// Every other provider below speaks the same OpenAI-compatible
// chat-completions shape (POST {model, messages}, Bearer auth), so one
// helper covers all of them. None do live web search — they answer from
// what the model already knows.
async function callOpenAICompatible(url, apiKey, model, message, systemText) {
  const upstream = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
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
    throw new Error(`${upstream.status}: ${detail.slice(0, 300)}`)
  }

  const data = await upstream.json()
  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('returned no text')
  return text
}

// Tried in this order (best/most-reliable first). Each is skipped if its
// key isn't configured.
const PROVIDERS = [
  {
    name: 'gemini',
    envKey: 'GEMINI_API_KEY',
    call: (env, message, systemText) => callGemini(env, message, systemText),
  },
  {
    name: 'groq',
    envKey: 'GROQ_API_KEY',
    call: (env, message, systemText) => callOpenAICompatible(
      'https://api.groq.com/openai/v1/chat/completions',
      env.GROQ_API_KEY,
      env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      message, systemText,
    ),
  },
  {
    name: 'cerebras',
    envKey: 'CEREBRAS_API_KEY',
    call: (env, message, systemText) => callOpenAICompatible(
      'https://api.cerebras.ai/v1/chat/completions',
      env.CEREBRAS_API_KEY,
      env.CEREBRAS_MODEL || 'llama-3.3-70b',
      message, systemText,
    ),
  },
  {
    name: 'sambanova',
    envKey: 'SAMBANOVA_API_KEY',
    call: (env, message, systemText) => callOpenAICompatible(
      'https://api.sambanova.ai/v1/chat/completions',
      env.SAMBANOVA_API_KEY,
      env.SAMBANOVA_MODEL || 'Meta-Llama-3.3-70B-Instruct',
      message, systemText,
    ),
  },
  {
    name: 'together',
    envKey: 'TOGETHER_API_KEY',
    call: (env, message, systemText) => callOpenAICompatible(
      'https://api.together.xyz/v1/chat/completions',
      env.TOGETHER_API_KEY,
      env.TOGETHER_MODEL || 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
      message, systemText,
    ),
  },
  {
    name: 'mistral',
    envKey: 'MISTRAL_API_KEY',
    call: (env, message, systemText) => callOpenAICompatible(
      'https://api.mistral.ai/v1/chat/completions',
      env.MISTRAL_API_KEY,
      env.MISTRAL_MODEL || 'mistral-small-latest',
      message, systemText,
    ),
  },
  {
    name: 'nvidia',
    envKey: 'NVIDIA_API_KEY',
    call: (env, message, systemText) => callOpenAICompatible(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      env.NVIDIA_API_KEY,
      env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct',
      message, systemText,
    ),
  },
  {
    name: 'githubmodels',
    envKey: 'GITHUB_MODELS_TOKEN',
    call: (env, message, systemText) => callOpenAICompatible(
      'https://models.github.ai/inference/chat/completions',
      env.GITHUB_MODELS_TOKEN,
      env.GITHUB_MODELS_MODEL || 'openai/gpt-4o-mini',
      message, systemText,
    ),
  },
  {
    name: 'openrouter',
    envKey: 'OPENROUTER_API_KEY',
    call: (env, message, systemText) => callOpenAICompatible(
      'https://openrouter.ai/api/v1/chat/completions',
      env.OPENROUTER_API_KEY,
      env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
      message, systemText,
    ),
  },
  {
    name: 'cohere',
    envKey: 'COHERE_API_KEY',
    call: (env, message, systemText) => callOpenAICompatible(
      'https://api.cohere.ai/compatibility/v1/chat/completions',
      env.COHERE_API_KEY,
      env.COHERE_MODEL || 'command-r-plus',
      message, systemText,
    ),
  },
  {
    name: 'huggingface',
    envKey: 'HF_API_KEY',
    call: (env, message, systemText) => callOpenAICompatible(
      'https://router.huggingface.co/v1/chat/completions',
      env.HF_API_KEY,
      env.HF_MODEL || 'meta-llama/Llama-3.1-8B-Instruct',
      message, systemText,
    ),
  },
]

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) })
    }
    if (request.method !== 'POST') {
      return json(env, { error: 'Method not allowed' }, 405)
    }

    const configured = PROVIDERS.filter((p) => env[p.envKey])
    if (configured.length === 0) {
      return json(env, { error: 'Server has no AI provider keys configured' }, 500)
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
    for (const provider of configured) {
      try {
        const text = await provider.call(env, message, systemText)
        return json(env, { text, provider: provider.name })
      } catch (err) {
        errors.push(`${provider.name}: ${err?.message || err}`)
      }
    }

    return json(env, { error: 'All providers failed', detail: errors.join(' | ') }, 502)
  },
}
