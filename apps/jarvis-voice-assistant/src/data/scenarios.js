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
    prompt: "How are my stocks doing?",
    responses: {
      formal: "Your portfolio is up 1.4% today, led by gains in technology holdings. The S&P 500 closed up 0.8%.",
      casual: "Stocks are looking good today — you're up about 1.4%, tech's carrying you.",
      minimal: "Portfolio +1.4% today.",
    },
  },
  {
    id: 'quote',
    tag: 'Quote',
    tab: 'digest',
    color: CATEGORY_COLORS.quote,
    prompt: "What's today's quote?",
    responses: {
      formal: "“The obstacle is the way.” — a reflection often attributed to Marcus Aurelius.",
      casual: "Here's one for you: “The obstacle is the way.” — Marcus Aurelius.",
      minimal: "“The obstacle is the way.” — Marcus Aurelius.",
    },
  },
  {
    id: 'weather',
    tag: 'Weather',
    tab: 'digest',
    color: CATEGORY_COLORS.weather,
    prompt: "What's the weather like today?",
    responses: {
      formal: "Expect partly cloudy skies with a high of 72°F and a light breeze from the northwest.",
      casual: "Partly cloudy, high of 72 — pretty nice out.",
      minimal: "72°F, partly cloudy.",
    },
  },
  {
    id: 'news',
    tag: 'News',
    tab: 'digest',
    color: CATEGORY_COLORS.news,
    prompt: "What's in the news today?",
    responses: {
      formal: "Top story: markets rallied on cooling inflation data. Also developing: a major technology announcement expected later today.",
      casual: "Big one: markets rallied on cooler inflation numbers. Also, a big tech announcement's dropping later.",
      minimal: "Top story: markets rally on inflation data.",
    },
  },
  {
    id: 'financials',
    tag: 'Financials',
    tab: 'productivity',
    color: CATEGORY_COLORS.financials,
    prompt: "Give me my financial update",
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

export const WRAPUP_ID = '__wrapup__'
