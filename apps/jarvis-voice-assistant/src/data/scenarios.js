// All copy below is placeholder/sample content, per the design handoff —
// swap for real data once each integration (brokerage, calendar, etc.) exists.

export const CATEGORY_COLORS = {
  markets: 'var(--cat-markets)',
  quote: 'var(--cat-quote)',
  weather: 'var(--cat-weather)',
  news: 'var(--cat-news)',
  financials: 'var(--cat-financials)',
  email: 'var(--cat-email)',
  calendar: 'var(--cat-calendar)',
  workouts: 'var(--cat-workouts)',
  apps: 'var(--cat-apps)',
  diet: 'var(--cat-diet)',
  cfb: 'var(--cat-cfb)',
  vending: 'var(--cat-vending)',
}

export const TABS = [
  { id: 'digest', label: 'Digest' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'activities', label: 'Activities' },
]

// Order Jarvis reads scenarios in during the auto-briefing.
export const BRIEFING_ORDER = [
  'markets', 'quote', 'weather', 'news', 'financials', 'email', 'calendar', 'workouts',
]

export const SCENARIOS = [
  {
    id: 'markets',
    tag: 'Markets',
    tab: 'digest',
    color: CATEGORY_COLORS.markets,
    prompt: "How are my Fidelity accounts doing?",
    keywords: ['stock', 'stocks', 'market', 'markets', 'portfolio', 'shares', 'invest', 'fidelity'],
    responses: {
      formal: "Your Fidelity accounts are up 1.4% today, led by technology holdings — illustrative numbers until a real brokerage connection is linked. Near-term outlook: momentum favors continued upside if inflation data stays cool. Pro: diversified tech exposure is paying off. Con: concentration risk if tech pulls back. Suggestion: consider trimming into strength and reviewing allocation this week.",
      casual: "Fidelity's looking good today — up about 1.4%, tech's carrying you (still placeholder numbers till a real account's linked). Outlook's positive short-term, but you're pretty concentrated in tech, so keep an eye on that. Might be worth trimming a bit into the rally.",
      minimal: "Fidelity +1.4% today. Outlook: positive, near-term. Watch: tech concentration.",
    },
  },
  {
    id: 'quote',
    tag: 'Quote',
    tab: 'digest',
    color: CATEGORY_COLORS.quote,
    prompt: "What's today's quote?",
    keywords: ['quote', 'inspire', 'inspiration', 'inspirational'],
    responses: {
      formal: "“The obstacle is the way.” — a reflection often attributed to Marcus Aurelius. Meaning: the very thing blocking your path can become the way through it — treat the setback as the work itself, not an interruption to it.",
      casual: "Here's one for you: “The obstacle is the way.” — Marcus Aurelius. Basically: whatever's in your way right now isn't stopping the path — it is the path. Lean into it instead of around it.",
      minimal: "“The obstacle is the way.” — Marcus Aurelius. Meaning: turn the setback into the path forward.",
    },
  },
  {
    id: 'weather',
    tag: 'Weather',
    tab: 'digest',
    color: CATEGORY_COLORS.weather,
    prompt: "What's the weather like in Mars and Brookville today?",
    keywords: ['weather', 'forecast', 'rain', 'snow', 'temperature', 'outside', 'sunny', 'cloudy', 'mars', 'brookville'],
    responses: {
      formal: "In Mars, expect partly cloudy skies with a high of 72°F and a light breeze from the northwest. In Brookville, expect a cooler high of 66°F with mostly sunny skies.",
      casual: "Mars is looking partly cloudy, high of 72. Brookville's a bit cooler and sunnier — high of 66.",
      minimal: "Mars: 72°F, partly cloudy. Brookville: 66°F, sunny.",
    },
  },
  {
    id: 'news',
    tag: 'News',
    tab: 'digest',
    color: CATEGORY_COLORS.news,
    prompt: "What's happening in the world today?",
    keywords: ['news', 'headline', 'headlines', 'world', 'trump', 'war', 'politics'],
    responses: {
      formal: "Top world stories this hour — Markets: cooling inflation data lifts major indices (Reuters, reuters.com/markets). Washington: the White House detailed a policy update today (AP, apnews.com/politics). Overseas: ceasefire talks continue amid mixed signals (BBC, bbc.com/world). Illustrative headlines until a real news source is connected — is that what you were looking for, sir?",
      casual: "Quick world roundup — markets are up on cooler inflation data (Reuters). White House dropped a policy update today (AP). Ceasefire talks overseas are still going, mixed signals so far (BBC). Still placeholder headlines for now — is that what you were looking for?",
      minimal: "Markets up (Reuters). Policy update (AP). Ceasefire talks ongoing (BBC). That what you needed, sir?",
    },
  },
  {
    id: 'financials',
    tag: 'Financials',
    tab: 'productivity',
    color: CATEGORY_COLORS.financials,
    prompt: "Give me my financial update",
    keywords: ['financial', 'finances', 'account', 'balance', 'bank', 'checking', 'savings'],
    responses: {
      formal: "Checking is at $4,286.12, savings at $12,940.55. No unusual activity since yesterday.",
      casual: "You've got $4,286 in checking, $12,940 in savings. Nothing weird going on.",
      minimal: "Checking $4,286 · Savings $12,940.",
    },
  },
  {
    id: 'email',
    tag: 'Email',
    tab: 'productivity',
    color: CATEGORY_COLORS.email,
    prompt: "Summarize my unread emails",
    keywords: ['email', 'emails', 'inbox', 'mail', 'unread'],
    responses: {
      formal: "You have 6 unread messages. Two require a response today — one from your manager regarding Friday's review, another confirming a client call.",
      casual: "6 unread — two are kind of urgent: your manager about Friday's review, and a client call to confirm.",
      minimal: "6 unread, 2 need replies.",
    },
  },
  {
    id: 'calendar',
    tag: 'Calendar & Tasks',
    tab: 'productivity',
    color: CATEGORY_COLORS.calendar,
    prompt: "What's on my plate today?",
    keywords: ['calendar', 'schedule', 'agenda', 'meeting', 'meetings', 'task', 'tasks', 'plate'],
    responses: {
      formal: "You have three meetings today, starting at 10 AM with the design sync, and two tasks due: finalize the deck and send the invoice.",
      casual: "3 meetings today, first one's the design sync at 10. Also gotta finish the deck and send that invoice.",
      minimal: "3 meetings, 2 tasks due.",
    },
  },
  {
    id: 'workouts',
    tag: 'Workouts',
    tab: 'activities',
    color: CATEGORY_COLORS.workouts,
    prompt: "What's my workout today?",
    keywords: ['workout', 'workouts', 'gym', 'exercise', 'training', 'run', 'yoga', 'routine'],
    responses: {
      formal: "Today's session is scheduled as an upper-body strength routine, followed by twenty minutes of light cardio. Illustrative placeholder — send your real routine and I'll swap this in.",
      casual: "Upper body day, then a light 20-minute cardio finisher. Still a placeholder — send your actual routine whenever you're ready.",
      minimal: "Upper body + 20 min cardio. (Placeholder — awaiting your real routine.)",
    },
  },
  {
    id: 'diet',
    tag: 'Diet Plan',
    tab: 'activities',
    color: CATEGORY_COLORS.diet,
    prompt: "What's my diet plan look like today?",
    keywords: ['diet', 'meal', 'meals', 'macros', 'nutrition', 'calories', 'food plan'],
    responses: {
      formal: "Today's illustrative plan: ~2,400 calories, roughly 180g protein / 250g carbs / 70g fat across four meals. This is placeholder structure — send your real diet plan and I'll use your actual targets and meals.",
      casual: "Placeholder day: about 2,400 calories, 180g protein, spread over four meals. Send me your real plan whenever and I'll swap this out for the real thing.",
      minimal: "~2,400 kcal / 180g protein (placeholder — awaiting your real plan).",
    },
  },
  {
    id: 'cfb',
    tag: 'CFB',
    tab: 'activities',
    color: CATEGORY_COLORS.cfb,
    prompt: "How do I beat Cover 3, and how do I stop shotgun spread?",
    keywords: ['cfb', 'college football', 'coverage', 'coverages', 'formation', 'formations', 'cover 3', 'blitz', 'zone defense', 'route concept'],
    responses: {
      formal: "On offense against Cover 3: attack the flat-to-corner seam with a flood concept, or hit a skinny post up the middle — the single-high safety can't get there in time. On defense against shotgun spread: generate pressure with your standard four-man rush so you stay sound in coverage, and keep a spy or nickel defender on the mesh point to take away RPOs.",
      casual: "Cover 3? Flood the strong side — flat plus a corner route stretches that one deep-third defender thin. Or hit a skinny post right up the middle where the safety can't get there. Against shotgun spread, get home with just a four-man rush so you're not outnumbered elsewhere, and spy the mesh point so RPOs don't gash you.",
      minimal: "Cover 3: flood routes or skinny post. Spread: 4-man rush + mesh spy.",
    },
  },
  {
    id: 'vending',
    tag: 'Red Hot Vending LLC',
    tab: 'activities',
    color: CATEGORY_COLORS.vending,
    prompt: "How's Red Hot Vending looking?",
    keywords: ['vending', 'red hot vending', 'machine', 'machines', 'restock'],
    responses: {
      formal: "Red Hot Vending: 14 of 15 machines reporting online — Machine #7 at the Main St location has been offline since yesterday and needs a service call. Daily sales are trending at $312, up 8% week over week. Two machines are under 20% inventory and due for a restock this week. Illustrative snapshot until a real ops connection is linked.",
      casual: "Vending's mostly good — 14 of 15 machines online, just #7 on Main St's been down since yesterday, might want to get that looked at. Sales are up 8% from last week, averaging $312 a day. A couple machines are getting low on stock, worth restocking soon. Still placeholder numbers for now.",
      minimal: "14/15 machines online. #7 (Main St) down. Sales $312/day, +8% WoW. 2 machines low stock.",
    },
  },
  {
    id: 'apps',
    tag: 'Apps',
    tab: 'productivity',
    color: CATEGORY_COLORS.apps,
    prompt: "Open Spotify and Slack",
    keywords: ['spotify', 'slack', 'open', 'app', 'apps', 'music', 'launch'],
    responses: {
      formal: "Opening Spotify and Slack now.",
      casual: "On it — Spotify and Slack coming right up.",
      minimal: "Opening Spotify, Slack.",
    },
  },
]

export const SCENARIO_MAP = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]))

export const WRAPUP = {
  formal: "That concludes your briefing, sir. Have a productive day.",
  casual: "That's your briefing! Have a good one.",
  minimal: "Briefing complete.",
}
