// Talks to the optional Cloudflare Worker backend (worker/index.js) for
// genuinely open-ended questions the built-in scenarios don't cover. The
// worker holds the real API key server-side — nothing secret ever ships to
// the browser. If VITE_AI_ENDPOINT isn't set, the app just stays fully
// offline and falls back to the canned "I don't have a skill for that" copy.

const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT?.replace(/\/$/, '')

export const AI_ENABLED = Boolean(ENDPOINT)

export async function askAI(message, persona) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, persona }),
  })
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`)
  const data = await res.json()
  if (!data.text) throw new Error('AI response missing text')
  return data.text
}
