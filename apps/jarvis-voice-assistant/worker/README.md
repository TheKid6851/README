## Jarvis AI proxy (Cloudflare Worker)

Holds AI provider keys server-side and answers open-ended questions the
built-in scenarios don't cover. Tries **Gemini** first (free tier, with live
Google Search grounding for time-sensitive questions); if Gemini errors or
its free quota runs out, it automatically falls back to **Groq** (also free)
so the app keeps answering instead of going dark. Both providers are free
tiers — no credit card required for either — so running this costs nothing
for personal use.

### 1. Get free API keys

- **Gemini** (primary, has live web search): https://aistudio.google.com/apikey
  — sign in with a Google account, create a key.
- **Groq** (fallback, optional but recommended): https://console.groq.com/keys
  — sign in, create a key. Skip this if you're fine with the app going quiet
  when Gemini's daily free quota runs out.

### 2. Deploy the worker

```bash
cd apps/jarvis-voice-assistant/worker
npx wrangler login
npx wrangler secret put GEMINI_API_KEY
# paste the Gemini key when prompted
npx wrangler secret put GROQ_API_KEY
# paste the Groq key when prompted (skip this command to run Gemini-only)
npx wrangler deploy
```

`wrangler deploy` prints a URL like:

```
https://jarvis-ai-proxy.<your-subdomain>.workers.dev
```

That's the endpoint the frontend needs.

### 3. Point the app at it

In `apps/jarvis-voice-assistant/`, create `.env` (copy `.env.example`) and
set:

```
VITE_AI_ENDPOINT=https://jarvis-ai-proxy.<your-subdomain>.workers.dev
```

Then `npm run build` (or `npm run dev`). With `VITE_AI_ENDPOINT` unset, the
app runs exactly as before — fully offline, canned scenario responses only.

### Notes

- CORS is wide open (`Access-Control-Allow-Origin: *`) by default. If you
  want to lock the worker to only your deployed app's domain, set an
  `ALLOWED_ORIGIN` var (`wrangler secret put ALLOWED_ORIGIN` or add it to
  `wrangler.toml` under `[vars]`).
- `GEMINI_MODEL` defaults to `gemini-2.5-flash`, `GROQ_MODEL` defaults to
  `llama-3.3-70b-versatile`. Override either the same way (`wrangler secret
  put`) if a provider renames/retires a model.
- The Groq fallback has no live web search — it answers from what the model
  already knows, so very recent events may be stale until Gemini's quota
  resets.
- This proxy only works from a real deployment (Cloudflare Pages, Vercel,
  etc.) reachable over the network — it will not work from the
  self-contained single-file "Artifact" preview, which is not allowed to
  make outbound network requests.
