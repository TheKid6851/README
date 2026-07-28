## Jarvis AI proxy (Cloudflare Worker)

Holds AI provider keys server-side and answers open-ended questions the
built-in scenarios don't cover. Tries providers in order until one
succeeds, so if one is down or its free quota runs out for the day, the
next one picks up the question instead of the app going dark:

1. **Gemini** — free tier, with live Google Search grounding for
   time-sensitive questions
2. **Groq** — free tier, fast
3. **Cerebras** — free tier, fast
4. **Mistral** — free tier
5. **OpenRouter** — free-tier ("`:free`") models
6. **Hugging Face** — free inference router

All six are genuinely free tiers — no credit card required for any of
them — so running this costs nothing for personal use. You don't need all
six; set as many as you want and the rest are just skipped. Even just
Gemini + one fallback covers the vast majority of "one provider is
temporarily rate-limited" situations — more is extra headroom, not a
requirement.

### 1. Get free API keys

- **Gemini** (the only one with live web search): https://aistudio.google.com/apikey
- **Groq**: https://console.groq.com/keys
- **Cerebras**: https://cloud.cerebras.ai (Platform → API Keys)
- **Mistral**: https://console.mistral.ai/api-keys (free "Experiment" plan)
- **OpenRouter**: https://openrouter.ai/keys (use one of the models tagged
  `:free` — those don't require any credits)
- **Hugging Face**: https://huggingface.co/settings/tokens (create a token
  with "Inference" access; the router picks a free-tier backend automatically)

Each just needs sign-in + "create API key" — no billing setup for the free
tier on any of them.

### 2. Deploy the worker

```bash
cd apps/jarvis-voice-assistant/worker
npx wrangler login
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put GROQ_API_KEY
npx wrangler secret put CEREBRAS_API_KEY
npx wrangler secret put MISTRAL_API_KEY
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put HF_API_KEY
# paste each key when prompted; skip any command for a provider you don't want
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

### Adding even more providers

Any other API that speaks the OpenAI-compatible chat-completions shape
(`POST /chat/completions` with `{model, messages}`, `Authorization: Bearer
<key>`) can be added the same way: add an entry to the `PROVIDERS` array in
`index.js` with its URL, an env var name for the key, and a default model,
then `wrangler secret put` that key. Nothing else in the worker needs to
change — the fallback loop and error handling are shared.

### Notes

- CORS is wide open (`Access-Control-Allow-Origin: *`) by default. If you
  want to lock the worker to only your deployed app's domain, set an
  `ALLOWED_ORIGIN` var (`wrangler secret put ALLOWED_ORIGIN` or add it to
  `wrangler.toml` under `[vars]`).
- Each provider's model is overridable via its own `_MODEL` secret
  (`GEMINI_MODEL`, `GROQ_MODEL`, `CEREBRAS_MODEL`, `MISTRAL_MODEL`,
  `OPENROUTER_MODEL`, `HF_MODEL`) if a provider renames or retires the
  default listed in `index.js` — free-tier model names/availability shift
  more often than paid ones.
- Only Gemini does live web search. The rest answer from what the model
  already knows, so if one of those kicks in, very recent events may be a
  bit stale until Gemini's quota resets.
- This proxy only works from a real deployment (Cloudflare Pages, Vercel,
  etc.) reachable over the network — it will not work from the
  self-contained single-file "Artifact" preview, which is not allowed to
  make outbound network requests.
