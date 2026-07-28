import { useCallback, useEffect, useRef, useState } from 'react'
import { SCENARIOS, SCENARIO_MAP, BRIEFING_ORDER, WRAPUP, WRAPUP_ID } from '../data/scenarios'

// Tweaks: Briefing Pace — multiplier applied to every phase-transition delay.
const PACE_MULTIPLIER = { quick: 0.8, normal: 1.5, slow: 2.4 }

const LISTEN_MS = 1100
const PROCESS_MS = 900
const MIN_READ_MS = 1400
const WRAPUP_READ_MS = 1800
const BRIEFING_GAP_MS = 300
const AUTO_START_DELAY_MS = 1200
const SPEECH_SAFETY_CAP_MS = 6000

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

  // cancelledRef + runIdRef give dismiss() an immediate, hard stop: every
  // pending timer checks both before it's allowed to touch state or speech,
  // so a queued briefing step can never fire after the user has backed out.
  const cancelledRef = useRef(false)
  const runIdRef = useRef(0)
  const timeoutsRef = useRef([])

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel() } catch { /* noop */ }
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
    setPhase('idle')
    setBriefing(false)
    setBriefingIndex(-1)
    setActiveId(null)
  }, [])

  const runScenario = useCallback(async (scenario, runId) => {
    setActiveId(scenario.id)
    setPhase('listening')
    await wait(LISTEN_MS * PACE_MULTIPLIER[pace], runId)

    setPhase('processing')
    await wait(PROCESS_MS * PACE_MULTIPLIER[pace], runId)

    const text = scenario.responses[persona]
    setPhase('result')
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

      setActiveId(WRAPUP_ID)
      setPhase('result')
      await Promise.all([
        speak(WRAPUP[persona], runId),
        wait(WRAPUP_READ_MS * PACE_MULTIPLIER[pace], runId),
      ])
      if (cancelledRef.current || runId !== runIdRef.current) return

      setBriefing(false)
      setBriefingIndex(-1)
      setPhase('idle')
      setActiveId(null)
    } catch {
      // Cancelled mid-flight — dismiss() already reset visible state.
    }
  }, [pace, persona, runScenario, speak, wait])

  const startBriefing = useCallback(() => {
    clearAllTimeouts()
    stopSpeech()
    runBriefing()
  }, [runBriefing])

  const triggerScenario = useCallback(async (id) => {
    const scenario = SCENARIO_MAP[id]
    if (!scenario) return
    clearAllTimeouts()
    stopSpeech()
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

  const triggerRandom = useCallback(() => {
    const pick = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
    triggerScenario(pick.id)
  }, [triggerScenario])

  useEffect(() => {
    const id = setTimeout(() => { startBriefing() }, AUTO_START_DELAY_MS)
    timeoutsRef.current.push(id)
    return () => {
      cancelledRef.current = true
      runIdRef.current += 1
      clearAllTimeouts()
      stopSpeech()
    }
    // Auto-briefing should fire exactly once, on mount, with whatever
    // persona/pace are current at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    phase,
    activeId,
    activeTab,
    setActiveTab,
    briefing,
    briefingIndex,
    counts,
    persona,
    setPersona,
    pace,
    setPace,
    theme,
    setTheme,
    triggerScenario,
    triggerRandom,
    startBriefing,
    dismiss,
  }
}
