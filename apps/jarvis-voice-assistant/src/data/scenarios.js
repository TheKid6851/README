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
    tag: 'Activities',
    tab: 'activities',
    color: CATEGORY_COLORS.workouts,
    prompt: "What's my workout today?",
    keywords: ['workout', 'workouts', 'gym', 'exercise', 'training', 'run', 'yoga', 'activity'],
    responses: {
      formal: "Today's session is scheduled as an upper-body strength routine, followed by twenty minutes of light cardio.",
      casual: "Upper body day, then a light 20-minute cardio finisher.",
      minimal: "Upper body + 20 min cardio.",
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
