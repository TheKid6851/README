# Handoff: Jarvis Voice Assistant (Voice HUD concept)

## Overview
A voice-assistant UI ("Jarvis") for mobile and desktop that runs a daily briefing on load — reading out Markets, Quote of the Day, Weather, News, Financials, Email, Calendar & Tasks, and Activities (workouts/hobbies) — and also supports on-demand voice commands via tap-to-trigger chips or an orb. Dark, futuristic "tech HUD" aesthetic.

## About the Design Files
The files in this bundle (`Jarvis Concepts.dc.html`, `ios-frame.jsx`) are **design references built in HTML/React** to show intended look, states, and behavior. They are prototypes, not production code — nothing here is wired to real accounts, APIs, or a text-to-speech backend beyond the browser's built-in `speechSynthesis` (used only to preview the "read aloud" experience). **Recreate this design in the target codebase's existing environment** (React Native, SwiftUI, Electron, native desktop, etc.) using its established patterns, libraries, and real backend integrations — do not ship the HTML directly. If no environment exists yet, choose the framework best suited to "voice assistant app running on both mobile and desktop."

## Fidelity
**High-fidelity.** Colors, typography, spacing, animation timing, and copy are final/intentional. Recreate pixel-close using the target codebase's design system/libraries, substituting the color tokens below if the codebase already has a palette.

## Screens / Views

### 1. Mobile — Idle / Briefing (iPhone frame)
- **Purpose**: Home screen Jarvis lands on. On load, auto-runs the daily briefing item-by-item; otherwise shows tappable suggestion cards grouped by tab.
- **Layout**: Full-height flex column, `padding-top: 88px` (clears status bar), centered content, `gap: 28px` between orb/greeting/list.
- **Components**:
  - **Orb**: 88×88px circle, `radial-gradient(circle at 35% 30%, oklch(0.85 0.1 200), oklch(0.55 0.15 250))` (cyan theme; amber/violet variants swap hues), glowing pulse animation (`orbGlow`, 3s ease-in-out infinite, box-shadow 24px→44px blur). Tappable — triggers a random command.
  - **Greeting**: "Good evening, sir." / "Good evening." — Space Grotesk 600 19px; subtext 13.5px `oklch(0.65 0.02 260)`.
  - **Briefing progress dots**: row of 8 small dots (one per briefing item), each dot fills with that item's category color as the briefing passes it; unfilled = `oklch(0.4 0.01 260)`. Positioned top-center, above greeting.
  - **Tab bar**: 3 segmented pill tabs — "Digest", "Productivity", "Activities" — equal width, active tab `background: oklch(1 0 0 / 0.14)` text `oklch(0.95 0.005 260)`, inactive `oklch(1 0 0 / 0.04)` text `oklch(0.6 0.02 260)`.
  - **Suggestion cards** (per active tab): rounded 16px, `background: oklch(1 0 0 / 0.05)`, `border: 1px solid oklch(1 0 0 / 0.08)`, padding 13×16px. Each shows a category tag (11px uppercase, bold, tab/category color) + quoted prompt text (13.5px). Tap → triggers that scenario.

### 2. Mobile — Listening state
- Full-bleed centered column. 5-bar audio waveform (8px wide bars, 40px tall, cyan `oklch(0.78 0.14 200)`, staggered `waveBar` animation 0.9s ease-in-out infinite, 0.1s stagger per bar, scaleY 0.25↔1). Label "Listening…" 13.5px muted.

### 3. Mobile — Processing state
- Centered 60×60px pulsing orb (same gradient, faster `orbGlow` 0.8s) + "Working on it…" label.

### 4. Mobile — Result state
- Fades in (`fadeUp` 0.35s ease, translateY 10px→0). Category tag (11px uppercase bold, accent color) → response text (Space Grotesk 500, 18px, line-height 1.4) → "Ask something else" link (12.5px muted, underlined) that dismisses.
- Response text varies by **persona tone** (see Design Tokens/Config): formal / casual / minimal — same underlying fact, different phrasing.

### 5. Desktop background scene (700×480 panel, or full desktop background)
- **Purpose**: Ambient "OS-level" Jarvis presence — a live animated background rather than a single window.
- **Layout**: Absolute-positioned layers over a dark base (`oklch(0.08 0.012 260)`), z-index 2 for UI chrome above the graph.
  - **Node graph background**: SVG, ~34 small circles ("nodes", 4–8px radius) connected by thin lines (`oklch(0.55 0.05 150 / 0.3)`, 1px), each node colored by its scenario's category color, gently floating (`float0/1/2` keyframes, 4–6px drift, 5–10s ease-in-out infinite, staggered delays).
  - **Skills panel** (top-right, 190px wide, glass card `oklch(0.14 0.012 260 / 0.85)` + `backdrop-filter: blur(14px)`): mini tab switcher (same 3 tabs, compact) + list of that tab's items with a colored dot, name, and a right-aligned trigger count (increments each time that scenario has fired this session).
  - **JARVIS status ring** (~110–130px, positioned mid-right): dashed circle (`stroke-dasharray: 2 6`) slowly rotating (`spin`, 16s linear infinite) around an inner glass disc showing "J.A.R.V.I.S." label + a colored status dot + status word — STANDBY / LISTENING / PROCESSING / SPEAKING — colored per phase (see tokens). Inner disc has `ringPulse` box-shadow animation (2.4s). Clicking it triggers a random command.
  - **Command bar** (bottom, full width minus margins, glass card): small orb (30px) + live status/response text (mirrors mobile result copy) + a circular ✕ dismiss button (appears only in result state).
  - **Dock** (bottom-center, floating pill row): one small icon per scenario (32×32px rounded-square, 2-letter initials, `oklch(0.24 0.02 260)` bg), hover lifts + scales (`scale(1.15) translateY(-3px)`) and brightens. Click triggers that scenario.
  - **Live clock**: top-left corner, small monospace-feel time label, ticks every second.
  - Two large blurred gradient blobs drift slowly behind everything (`driftOne`/`driftTwo`, 14–18s) for ambient depth — one blue-violet, one magenta, `filter: blur(60px)`.

## Interactions & Behavior

### Auto-briefing (on app open / "log on")
- On mount, after a short delay, Jarvis walks through **all 8 scenarios in order**: Markets → Quote → Weather → News → Financials → Email → Calendar & Tasks → Workouts.
- Per item: `listening` (user-facing "capturing" cue) → `processing` → `result` (spoken + displayed), each phase multiplied by a **pace** setting (see tokens) so it can be sped up or slowed down.
- After the last item, shows a short "Briefing complete" wrap-up line, then returns to idle/tap-to-ask mode.
- **Text-to-speech**: each `result` phase speaks its response aloud via the platform's TTS (prototype uses browser `SpeechSynthesisUtterance`, rate 0.98, pitch 0.9, prefers a male-sounding voice if available). Real implementation should use a proper TTS service/voice matching the "Jarvis" character.
- **Cancel/quit semantics**: tapping the ✕ (or "Ask something else") must **immediately and fully stop** — cancel all pending timers/steps of the briefing AND stop any in-progress speech. It must never let a previously-queued step fire after dismissal. This was a specific bug fix during design — preserve this behavior exactly.

### On-demand commands
- Tapping the orb (mobile or desktop) fires a **random** scenario from the full list (simulates "listening for a command").
- Tapping a suggestion card, dock icon, or Skills-panel row triggers that **specific** scenario directly.
- Each trigger runs the same listening → processing → result cycle and increments that scenario's trigger count (shown in the Skills panel).

### Tabs
- 3 tabs: **Digest** (Markets, Quote, Weather, News), **Productivity** (Financials, Email, Calendar & Tasks, Apps), **Activities** (Workouts — intended to hold any user-added hobbies/activities, not just gym).
- Tab selection filters the mobile suggestion list and the desktop Skills panel simultaneously (shared state).

### Loading / Error states
- Not deeply specified in this prototype (it's a scripted demo, so "loading" = the listening/processing phases). Real implementation needs actual loading and error/failure states per integration (e.g., "Couldn't reach your calendar — try again").

## State Management
Core state needed:
- `phase`: `'idle' | 'listening' | 'processing' | 'result'`
- `activeId`: which scenario is currently active/being read (or `'__wrapup__'` for the end-of-briefing line)
- `activeTab`: `'digest' | 'productivity' | 'activities'`
- `briefing`: boolean — true while the auto-briefing sequence is running
- `briefingIndex`: which briefing item is currently active (drives the progress dots)
- `counts`: map of scenarioId → number of times triggered this session (Skills panel counters)
- Persona/config (see tokens) — likely user-level settings rather than per-session state in a real app.

## Design Tokens

**Colors** (OKLCH; convert to your system's format as needed):
- Background base: `oklch(0.14 0.014 260)` (page), `oklch(0.08 0.012 260)` (desktop panel)
- Text primary: `oklch(0.95 0.005 260)`; muted: `oklch(0.65 0.02 260)`; dim: `oklch(0.5–0.6 0.02 260)`
- Category colors: Markets `oklch(0.72 0.15 145)` (green), Quote `oklch(0.75 0.15 70)` (amber), Weather `oklch(0.72 0.15 200)` (cyan), News `oklch(0.72 0.15 25)` (red-orange), Financials `oklch(0.72 0.15 300)` (violet), Email `oklch(0.72 0.15 350)` (pink), Calendar & Tasks `oklch(0.72 0.15 230)` (blue), Workouts `oklch(0.72 0.15 170)` (teal), Apps `oklch(0.72 0.15 255)` (indigo)
- Status ring colors: Standby `oklch(0.6 0.015 260)` (gray), Listening `oklch(0.72 0.15 200)` (cyan), Processing `oklch(0.75 0.15 70)` (amber), Speaking `oklch(0.72 0.15 145)` (green)
- Accent theme options (Tweaks): Cyan `#5fd4e0` (default), Amber `#f0a63c`, Violet `#c084fc` — reskins the orb, waveform, and glow accents together

**Typography**: Space Grotesk (500/600/700) for headings/labels/branding; Inter (400–700) for body text. Google Fonts, or bundle equivalents.

**Radii**: cards 16–20px, pills/tabs 999px (full round), dock icons 9–11px, small chips 8px.

**Animation timings**:
- Orb glow pulse: 3s idle / 0.8s processing, ease-in-out infinite
- Waveform bars: 0.9s ease-in-out infinite, 0.1s stagger
- Result fade-in: 0.35s ease, translateY 10px→0
- Ring rotation: 16s linear infinite; ring pulse: 2.4s ease-in-out infinite
- Background blob drift: 14–18s ease-in-out infinite
- Node float: 5–10s ease-in-out infinite, per-node stagger 0.2–1.8s
- Dock hover: 0.15s ease (scale 1.15, lift 3–4px)

**Pace multiplier (Tweaks: Briefing Pace)**: quick ×0.8, normal ×1.5, slow ×2.4 — applied to all phase-transition delays during the briefing and manual triggers.

**Persona tone (Tweaks: Voice & Persona)**: `formal | casual | minimal` — three parallel copy variants per scenario (see scenario data below); switches which string is spoken/displayed.

## Assets
No external image assets — all visuals are CSS gradients, SVG (node graph, status ring), and system fonts. iPhone device frame comes from a generic starter component (`ios-frame.jsx`), not a real asset library; recreate using the target platform's native device chrome or omit if building for real hardware.

## Scenario / Copy Data (source of truth for real content)
Each scenario has: `id`, `tag` (display name), `category` (tab), `color`, `prompt` (sample voice command), and three response variants (`formal`, `casual`, `minimal`):

1. **Markets** — "How are my stocks doing?" — placeholder portfolio performance copy. **Needs real brokerage/portfolio API.**
2. **Quote** — "What's today's quote?" — placeholder historian-style quote. **Needs a real quote source/API.**
3. **Weather** — "What's the weather like today?" — placeholder forecast. **Needs a real weather API + user location.**
4. **News** — "What's in the news today?" — placeholder headlines. **Needs a real news API.**
5. **Financials** — "Give me my financial update" — placeholder account balances. **Needs real bank/account integration (e.g. Plaid) — user said they'll provide real accounts.**
6. **Email** — "Summarize my unread emails" — placeholder inbox summary. **Needs real email API (Gmail/Outlook) + summarization.**
7. **Calendar & Tasks** — "What's on my plate today?" — placeholder agenda + to-dos. **Needs real calendar (Google/Outlook) + task-manager API.**
8. **Workouts** (Activities tab) — "What's my workout today?" — placeholder gym routine; **user wants this generalized to any hobby/activity they add**, not gym-only.
9. **Apps** (Productivity tab) — "Open Spotify and Slack" — placeholder app-launch confirmation. **Needs real OS-level app-launch / system automation permissions (mobile and desktop).**

All response text currently in the file is placeholder/sample data — replace with real data sources per integration before shipping.

## Explicitly Out of Scope (per user's own conclusion in this conversation)
This prototype is a **design reference only**. It does **not** and **cannot**:
- Connect to real bank/brokerage accounts, email, calendar, task managers, Spotify/Slack, or any live API
- Perform real OAuth/authentication
- Run as a background/always-on assistant on a real phone or desktop
Building the live-connected product requires real app development: a backend, OAuth integrations per provider (Plaid for banking, Google/Microsoft Graph for calendar & email, Spotify Web API, Slack API, a news API, a weather API, real TTS/ASR services), and native mobile/desktop app shells with system permissions (microphone, app-launching, notifications). Use this document as the target spec for that build.

## Files
- `Jarvis Concepts.dc.html` — full prototype (template + logic), mobile + desktop views, all states and Tweaks
- `ios-frame.jsx` — generic iPhone device-frame starter used to preview the mobile view (not a required dependency for the real build)
