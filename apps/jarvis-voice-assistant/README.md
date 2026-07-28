# Jarvis Voice Assistant — interactive prototype

A React recreation of the `design_handoff_jarvis_voice_assistant` concept: a dark
"tech HUD" voice assistant that runs an 8-item daily briefing on load (Markets,
Quote, Weather, News, Financials, Email, Calendar & Tasks, Workouts) and
supports on-demand voice-style commands via tap.

This is a **working front-end prototype**, not a production build: the 12
built-in scenarios (see `src/data/scenarios.js`) are placeholder copy, and
there are no real backend integrations (banking, calendar, email, etc.) —
see the original handoff's `README.md` in the repo root's
`design_handoff_jarvis_voice_assistant/` folder for what a real build would
need (Plaid, Google/Microsoft Graph, a weather/news API, native app shells
with system permissions). Speech input/output is real: actual browser
speech recognition (`SpeechRecognition`) and TTS (`speechSynthesis`).

**Open-ended questions** (anything that doesn't match a built-in scenario)
can be answered by a real AI model instead of a canned "I don't have that
skill" message — see `worker/README.md` to deploy the free Cloudflare
Worker + Gemini backend and set `VITE_AI_ENDPOINT`. Without that set up,
the app runs fully offline on the 12 built-in scenarios only.

## Layout

- **Mobile viewport** (< 861px): orb, greeting, briefing progress dots, tab
  bar (Digest / Productivity / Activities), suggestion cards, and full-screen
  listening / processing / result states.
- **Desktop viewport** (≥ 861px): an ambient "OS-level" background scene —
  animated node graph, a Skills panel with per-scenario trigger counts, a
  rotating J.A.R.V.I.S. status ring, a command bar, and a dock of scenario
  shortcuts.

Both share one state engine (`src/hooks/useJarvis.js`), so triggering a
scenario from either surface stays in sync. Resize the browser window to see
both.

## Tweaks

The gear icon (top-right) opens a panel to change:
- **Briefing pace** — quick / normal / slow (scales every phase delay)
- **Voice & persona** — formal / casual / minimal response phrasing
- **Accent theme** — cyan / amber / violet

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static
production build in `dist/`.
