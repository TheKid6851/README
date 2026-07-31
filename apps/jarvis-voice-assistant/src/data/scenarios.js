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

// Situational CFB 27 cheat sheet — sourced from pro/competitive players and
// creators (X, YouTube, Madden Prodigy, MMOexp, EA's CFB27 wiki, CFB.FAN,
// Civil.gg) as of July 2026. Kept deliberately terse: 1-2 lines, no padding
// — this is meant to be queried mid-game, not read like an article. Game
// gets patched — if something stops working, it may have been tuned since.
export const CFB_TOPICS = [
  {
    id: 'stunts',
    keywords: ['stunt', 'stunts', 'tex', 'el paso', 'pirate', 'tempe', 'exit', 'twist', 'pass rush'],
    formal: "Tex (DE loops inside) is the all-around best pass-rush stunt — run it from Nickel 2-4 Single Mug. El Paso (DTs loop outside) counters once they slide protection toward your Tex. Pirate is a good change-up once those two get picked up. Mix them — don't spam one.",
    casual: "Tex — DE loops inside, all-around best, run from Nickel 2-4 Single Mug. El Paso counters if they start sliding protection your way. Pirate's a solid change-up once they've seen Tex/El Paso. Don't just spam one.",
    minimal: "Tex = best all-around. El Paso counters slide protection. Pirate as a change-up.",
  },
  {
    id: 'run-defense',
    keywords: ['stop the run', 'run defense', 'run d', 'stopping the run', 'inside zone', 'gap integrity', 'gashed'],
    formal: "Set Gap Integrity to Conservative and trust your fit — don't crash down early on inside zone. If they're gashing you inside, shift a linebacker up a step. Cover 4 is the strongest shell against run-heavy opponents since the safeties become primary run defenders.",
    casual: "Gap Integrity: Conservative, trust your fit, don't jump inside zone early. Getting gashed inside? Shift a backer up a step. Cover 4's your best shell vs. run-heavy teams.",
    minimal: "Gap Integrity: Conservative. Trust the fit. Cover 4 vs. run-heavy teams.",
  },
  {
    id: 'power-i',
    keywords: ['power i', 'power i hulk', 'hulk', 'heavy run', 'heavy formation'],
    formal: "Against Power I Hulk: go ultra-aggressive, back the play-side linebacker up a step, hard flat and a five-yard curl-flat to the play side, and send a defensive-end blitz to disrupt the lead blocker. Nickel Wide, Cover 4 Quarters with an El Paso stunt and a strongside corner blitz is also a proven answer.",
    casual: "Power I Hulk: ultra-aggressive, back the play-side LB up a step, hard flat + 5-yd curl-flat to that side, DE blitz to blow up the lead blocker. Nickel Wide Cover 4 Quarters + El Paso + strongside CB blitz also works well.",
    minimal: "Ultra-aggressive, back LB up a step, DE blitz the lead blocker. Or Nickel Wide Cover 4 Quarters + El Paso + CB blitz.",
  },
  {
    id: 'base-defense',
    keywords: ['base defense', 'coverage shell', 'disguise', 'single mug', 'go-to defense', 'best defense'],
    formal: "Single Mug / 4-2-5 Man Pressure is the most underrated base defense right now — frequent stunts, real five-man pressure, and it carries Cover 6, Cover 9, Cover 4 Quarters, and a built-in Cover 3 Cloud. Use the right stick pre-snap to fake the shell.",
    casual: "Single Mug / 4-2-5 Man Pressure is underrated right now — good stunts, real pressure, has Cover 6/9/4 Quarters plus a built-in Cover 3 Cloud. Flash the shell pre-snap with the right stick.",
    minimal: "Single Mug / 4-2-5 Man Pressure. Disguise with right stick pre-snap.",
  },
  {
    id: 'trips',
    keywords: ['trips', 'bunch', 'stack formation', 'triple stack'],
    formal: "Against trips, use the built-in checks rather than freelancing: Box (default — each defender owns a zone around the bunch), Bingo (corner locks man on #1 if he releases outside), Triangle (3-over-2 shell with a safety bracket on the deep threat), or Stubbie (true man on #1). If they add a tight end to the trips side, run Cover 4 Palms with a Texas or El Paso stunt.",
    casual: "Vs. trips, use the built-in checks — Box (default zone-per-guy), Bingo (corner locks #1 outside), Triangle (3-over-2 + safety bracket), or Stubbie (true man on #1). Trips with a TE attached? Cover 4 Palms plus a Tex or El Paso stunt.",
    minimal: "Box (default), Bingo, Triangle, or Stubbie. Trips+TE: Cover 4 Palms + Tex/El Paso.",
  },
  {
    id: 'offense-coverage-beaters',
    keywords: [
      'cover 3', 'cover 2', 'cover 4', 'quarters', 'man coverage', 'press', 'cover 0',
      'beat cover', 'beat man', 'beat zone',
    ],
    formal: "Cover 3: read the flat defender — if he drops under, throw short; if he attacks the flat, throw behind him; if he widens, the seam or an inside crosser is open. Cover 4 / Quarters: attack underneath first — flats, drags, curls — and only push it vertical once a safety or corner commits. Cover 2: the window is behind the corner and in front of the safety — a corner route or deep out. Man or press coverage: speed outs win fast, and a tight end slant or drag is hard to press. Have a fast answer ready for Cover 0.",
    casual: "Cover 3: watch the flat defender — drops under, throw short; attacks the flat, throw behind him; widens, hit the seam. Cover 4/Quarters: underneath first, go vertical once a safety commits. Cover 2: throw behind the corner, in front of the safety. Man/press: speed outs win fast, TE slants are hard to press. Have something ready for Cover 0.",
    minimal: "Cover 3: read the flat defender. Cover 4: underneath first. Cover 2: window behind CB, in front of S. Man: speed outs, TE slants.",
  },
  {
    id: 'rpo',
    keywords: ['rpo', 'rpos', 'read option', 'peek read', 'alert read'],
    formal: "Know your RPO type — Read, Peek, or Alert — and identify the conflict defender before the snap. Use the Untarget Menu to protect that read, and don't abandon the run too early.",
    casual: "Know which RPO type you're running — Read, Peek, Alert — and ID the conflict defender pre-snap. Untarget Menu protects that read. Don't bail on the run too fast.",
    minimal: "ID the RPO type and conflict defender pre-snap. Don't abandon the run early.",
  },
  {
    id: 'protection',
    keywords: ['stunt protection', 'pass protection', 'max protect', 'pocket', 'blocking'],
    formal: "Facing a four-man stunt, Max Protect gives full protection but only three routes out. Use the pre-snap Untarget Menu to redirect a blocker onto the free rusher, and step up into the pocket rather than backpedaling.",
    casual: "Vs. a 4-man stunt, Max Protect = full protection but only 3 routes out. Untarget Menu redirects a blocker to the free rusher. Step up in the pocket, don't backpedal.",
    minimal: "Max Protect vs. 4-man stunts. Untarget Menu for the free rusher. Step up, don't backpedal.",
  },
  {
    id: 'settings',
    keywords: ['competitive settings', 'settings', 'pass lead', 'kick control', 'passing settings'],
    formal: "Recommended competitive settings: Passing on Placement & Accuracy, Pass Lead Increase set to Small, Man Combo and Point Combo set to Lock, Match Coverage on Zone It or Default, and Kick Control set to Tap and Hold.",
    casual: "Settings: Placement & Accuracy passing, Pass Lead Increase on Small, Man/Point Combo locked, Match Coverage Zone It or Default, Kick Control Tap and Hold.",
    minimal: "Placement & Accuracy. Pass Lead: Small. Combo: Lock. Kick: Tap and Hold.",
  },
  {
    id: 'playbooks',
    keywords: ['playbook', 'playbooks', 'best playbook', 'money play', 'money plays'],
    formal: "Strong playbooks right now include Ohio State, Virginia, Indiana, California, UL Monroe, and Washington State. Reliable money plays: play-action Flood, play-action vertical-and-comeback, and Dagger.",
    casual: "Good playbooks right now: Ohio State, Virginia, Indiana, California, UL Monroe, Washington State. Money plays: play-action Flood, play-action vert+comeback, Dagger.",
    minimal: "Playbooks: Ohio St, Virginia, Indiana, Cal, UL Monroe, Wash St. Money plays: PA Flood, PA vert+comeback, Dagger.",
  },
]

export function matchCfbTopic(said) {
  const lower = said.toLowerCase()
  return CFB_TOPICS.find((t) => t.keywords.some((k) => lower.includes(k)))
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
    keywords: ['workout', 'workouts', 'gym', 'exercise', 'training', 'go for a run', 'jog', 'yoga', 'routine'],
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
    prompt: "How do I stop this stunt, and what's the best defense vs. trips?",
    // Broad gate keywords, plus every trigger word from CFB_TOPICS so any
    // situational question lands here first — respondTo() then routes to
    // the specific topic below via matchCfbTopic().
    keywords: [
      'cfb', 'cfb 27', 'cfb27', 'college football',
      ...CFB_TOPICS.flatMap((t) => t.keywords),
    ],
    responses: {
      formal: "Ask me something specific, sir — stunts, run defense, trips, coverage beaters, RPOs, protection, base defense, playbooks, or competitive settings.",
      casual: "Ask me something specific — stunts, run D, trips, beating a coverage, RPOs, protection, base defense, playbooks, or settings.",
      minimal: "Ask about: stunts, run D, trips, coverages, RPOs, protection, playbooks, settings.",
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
