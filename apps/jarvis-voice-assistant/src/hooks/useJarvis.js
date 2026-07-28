import { useCallback, useEffect, useRef, useState } from 'react'
import { SCENARIOS, SCENARIO_MAP, BRIEFING_ORDER, WRAPUP } from '../data/scenarios'

// Tweaks: Briefing Pace — multiplier applied to every phase-transition delay.
const PACE_MULTIPLIER = { quick: 0.8, normal: 1.5, slow: 2.4 }

const LISTEN_MS = 1100
const PROCESS_MS = 900
const MIN_READ_MS = 1400
const WRAPUP_READ_MS = 1800
const BRIEFING_GAP_MS = 300
const AUTO_START_DELAY_MS = 1200
const SPEECH_SAFETY_CAP_MS = 6000

const JARVIS_TAG = { tag: 'Jarvis', color: 'var(--accent)' }

function matchScenario(said) {
  const lower = said.toLowerCase()
  return SCENARIOS.find((s) => s.keywords.some((k) => lower.includes(k)))
}

// Drives the mobile + desktop views from one shared engine: current phase,
// which scenario is active, the auto-briefing sequence, trigger counts, and
// Tweaks (persona / pace / accent theme). Both views subscribe to the same
// instance so triggering from either surface stays in sync.
export function useJarvis() {
  const [phase, setPhase] = useState('idle') // 'idle' | 'listening' | 'processing' | 'result'
  const [activeId, setActiveId] = useState(null)
  const [activeTab, setActiveTab] = useState('digest')
  const [briefing, setBriefing] = useState(false)
  const [briefingIndex, setBriefingIndex] = useState(-1)
  const [counts, setCounts] = useState({})
  const [persona, setPersona] = useState('formal')
  const [pace, setPace] = useState('normal')
  const [theme, setTheme] = useState('cyan')
  // What the result screen shows — {tag, color, text}. Set by scenario runs,
  // the briefing wrap-up, and live voice matches/fallbacks alike, so views
  // never have to re-derive it from activeId.
  const [resultDisplay, setResultDisplay] = useState(null)

  // cancelledRef + runIdRef give dismiss() an immediate, hard stop: every
  // pending timer (and the speech-recognition callbacks) checks both before
  // it's allowed to touch state or speech, so a queued step can never fire
  // after the user has backed out.
  const cancelledRef = useRef(false)
  const runIdRef = useRef(0)
  const timeoutsRef = useRef([])
  const recognitionRef = useRef(null)

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel() } catch { /* noop */ }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch { /* noop */ }
      recognitionRef.current = null
    }
  }

  const beginRun = () => {
    cancelledRef.current = false
    runIdRef.current += 1
    return runIdRef.current
  }

  const wait = useCallback((ms, runId) => new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      if (cancelledRef.current || runId !== runIdRef.current) reject(new Error('cancelled'))
      else resolve()
    }, ms)
    timeoutsRef.current.push(id)
  }), [])

  const speak = useCallback((text, runId) => new Promise((resolve) => {
    if (cancelledRef.current || runId !== runIdRef.current) { resolve(); return }
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      resolve(); return
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.98
    utter.pitch = 0.9
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find((v) => /male|david|alex|daniel|fred/i.test(v.name))
    if (preferred) utter.voice = preferred

    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(fallback)
      resolve()
    }
    utter.onend = finish
    utter.onerror = finish
    // Some browsers occasionally never fire onend — cap the wait so the UI
    // can't get stuck on a result screen forever.
    const fallback = setTimeout(finish, Math.min(SPEECH_SAFETY_CAP_MS, Math.max(1200, text.length * 55)))
    timeoutsRef.current.push(fallback)
    try {
      window.speechSynthesis.speak(utter)
    } catch {
      finish()
    }
  }), [])

  const dismiss = useCallback(() => {
    cancelledRef.current = true
    runIdRef.current += 1
    clearAllTimeouts()
    stopSpeech()
    stopListening()
    setPhase('idle')
    setBriefing(false)
    setBriefingIndex(-1)
    setActiveId(null)
    setResultDisplay(null)
  }, [])

  const runScenario = useCallback(async (scenario, runId) => {
    setActiveId(scenario.id)
    setPhase('listening')
    await wait(LISTEN_MS * PACE_MULTIPLIER[pace], runId)

    setPhase('processing')
    await wait(PROCESS_MS * PACE_MULTIPLIER[pace], runId)

    const text = scenario.responses[persona]
    setPhase('result')
    setResultDisplay({ tag: scenario.tag, color: scenario.color, text })
    setCounts((c) => ({ ...c, [scenario.id]: (c[scenario.id] || 0) + 1 }))
    await Promise.all([
      speak(text, runId),
      wait(MIN_READ_MS * PACE_MULTIPLIER[pace], runId),
    ])
  }, [pace, persona, speak, wait])

  const runBriefing = useCallback(async () => {
    const runId = beginRun()
    setBriefing(true)
    try {
      for (let i = 0; i < BRIEFING_ORDER.length; i++) {
        if (cancelledRef.current || runId !== runIdRef.current) return
        setBriefingIndex(i)
        await runScenario(SCENARIO_MAP[BRIEFING_ORDER[i]], runId)
        if (cancelledRef.current || runId !== runIdRef.current) return
        await wait(BRIEFING_GAP_MS, runId)
      }
      if (cancelledRef.current || runId !== runIdRef.current) return

      setActiveId(null)
      setPhase('result')
      setResultDisplay({ tag: 'Briefing', color: 'var(--accent)', text: WRAPUP[persona] })
      await Promise.all([
        speak(WRAPUP[persona], runId),
        wait(WRAPUP_READ_MS * PACE_MULTIPLIER[pace], runId),
      ])
      if (cancelledRef.current || runId !== runIdRef.current) return

      setBriefing(false)
      setBriefingIndex(-1)
      setPhase('idle')
      setActiveId(null)
      setResultDisplay(null)
    } catch {
      // Cancelled mid-flight — dismiss() already reset visible state.
    }
  }, [pace, persona, runScenario, speak, wait])

  const startBriefing = useCallback(() => {
    clearAllTimeouts()
    stopSpeech()
    stopListening()
    runBriefing()
  }, [runBriefing])

  const triggerScenario = useCallback(async (id) => {
    const scenario = SCENARIO_MAP[id]
    if (!scenario) return
    clearAllTimeouts()
    stopSpeech()
    stopListening()
    const runId = beginRun()
    setBriefing(false)
    setBriefingIndex(-1)
    try {
      // Manual triggers stop and hold on the result screen — the caller
      // dismisses explicitly, unlike the auto-briefing which self-advances.
      await runScenario(scenario, runId)
    } catch {
      // Cancelled — dismiss() already reset visible state.
    }
  }, [runScenario])

  // Runs the processing -> result tail for a voice command we've already
  // heard (real listening already happened via SpeechRecognition, so this
  // skips straight to "thinking about it").
  const presentVoiceResult = useCallback(async (runId, display, scenarioId) => {
    if (cancelledRef.current || runId !== runIdRef.current) return
    setPhase('processing')
    try {
      await wait(PROCESS_MS * PACE_MULTIPLIER[pace], runId)
    } catch {
      return
    }
    if (cancelledRef.current || runId !== runIdRef.current) return
    setActiveId(scenarioId ?? null)
    setPhase('result')
    setResultDisplay(display)
    if (scenarioId) setCounts((c) => ({ ...c, [scenarioId]: (c[scenarioId] || 0) + 1 }))
    await speak(display.text, runId)
  }, [pace, speak, wait])

  // Tapping the orb / J.A.R.V.I.S. ring now genuinely listens for a spoken
  // command via the Web Speech API, matches it against known skills by
  // keyword, and falls back gracefully if the browser can't listen, no
  // speech is heard, or nothing matches.
  const startListening = useCallback(() => {
    clearAllTimeouts()
    stopSpeech()
    stopListening()
    const runId = beginRun()
    setBriefing(false)
    setBriefingIndex(-1)
    setActiveId(null)
    setResultDisplay(null)
    setPhase('listening')

    const SpeechRecognitionImpl = typeof window !== 'undefined'
      && (window.SpeechRecognition || window.webkitSpeechRecognition)

    if (!SpeechRecognitionImpl) {
      presentVoiceResult(runId, {
        ...JARVIS_TAG,
        text: "Voice input isn't supported in this browser — try Chrome, Edge, or Safari, or tap a card instead.",
      }, null)
      return
    }

    const recognition = new SpeechRecognitionImpl()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    let settled = false

    recognition.onresult = (event) => {
      settled = true
      if (cancelledRef.current || runId !== runIdRef.current) return
      const said = event.results[0][0].transcript
      const scenario = matchScenario(said)
      if (scenario) {
        presentVoiceResult(runId, { tag: scenario.tag, color: scenario.color, text: scenario.responses[persona] }, scenario.id)
      } else {
        presentVoiceResult(runId, {
          ...JARVIS_TAG,
          text: `I heard "${said}" — I don't have a skill for that yet.`,
        }, null)
      }
    }

    recognition.onerror = (event) => {
      settled = true
      if (cancelledRef.current || runId !== runIdRef.current) return
      const text = event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? "I need microphone access to listen — check your browser's permission settings."
        : event.error === 'no-speech'
          ? "I didn't hear anything — tap the orb and try again."
          : "I couldn't hear that clearly — try again."
      presentVoiceResult(runId, { ...JARVIS_TAG, text }, null)
    }

    recognition.onend = () => {
      recognitionRef.current = null
      if (!settled && !cancelledRef.current && runId === runIdRef.current) {
        presentVoiceResult(runId, {
          ...JARVIS_TAG,
          text: "I didn't hear anything — tap the orb and try again.",
        }, null)
      }
    }

    try {
      recognition.start()
    } catch {
      presentVoiceResult(runId, { ...JARVIS_TAG, text: "I couldn't start listening — try again." }, null)
    }
  }, [persona, presentVoiceResult])

  useEffect(() => {
    const id = setTimeout(() => { startBriefing() }, AUTO_START_DELAY_MS)
    timeoutsRef.current.push(id)
    return () => {
      cancelledRef.current = true
      runIdRef.current += 1
      clearAllTimeouts()
      stopSpeech()
      stopListening()
    }
    // Auto-briefing should fire exactly once, on mount, with whatever
    // persona/pace are current at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    phase,
    activeTab,
    setActiveTab,
    briefing,
    briefingIndex,
    counts,
    resultDisplay,
    persona,
    setPersona,
    pace,
    setPace,
    theme,
    setTheme,
    triggerScenario,
    startListening,
    startBriefing,
    dismiss,
  }
}
