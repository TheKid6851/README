## Jarvis AI proxy (Cloudflare Worker)

Holds a Gemini API key server-side and answers open-ended questions the
built-in scenarios don't cover — with live Google Search grounding for
anything time-sensitive. Google's Gemini API has a free tier (rate-limited,
no credit card required), so running this costs nothing for personal use.

### 1. Get a free Gemini API key

Go to https://aistudio.google.com/apikey, sign in with a Google account, and
create a key. No billing setup required for the free tier.

### 2. Deploy the worker

```bash
cd apps/jarvis-voice-assistant/worker
npx wrangler login
npx wrangler secret put GEMINI_API_KEY
# paste the key from step 1 when prompted
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
- `GEMINI_MODEL` defaults to `gemini-2.5-flash`. Override it the same way if
  Google renames/retires that model.
- This proxy only works from a real deployment (Cloudflare Pages, Vercel,
  etc.) reachable over the network — it will not work from the
  self-contained single-file "Artifact" preview, which is not allowed to
  make outbound network requests.
