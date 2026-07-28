import { SCENARIOS, TABS, BRIEFING_ORDER } from '../data/scenarios'

function greetingCopy() {
  const hour = new Date().getHours()
  if (hour < 5) return { title: 'Still up, sir.', sub: "Here's a quick look at things." }
  if (hour < 12) return { title: 'Good morning, sir.', sub: "Here's what's ahead today." }
  if (hour < 18) return { title: 'Good afternoon, sir.', sub: "Here's where things stand." }
  return { title: 'Good evening, sir.', sub: "Here's your evening briefing." }
}

export default function MobileView({ jarvis }) {
  const {
    phase, activeTab, setActiveTab,
    briefing, briefingIndex, resultDisplay,
    triggerScenario, startListening, dismiss,
  } = jarvis

  const greeting = greetingCopy()
  const tabScenarios = SCENARIOS.filter((s) => s.tab === activeTab)
  const showOverlay = phase !== 'idle'

  return (
    <div className="mobile-view">
      <div className="progress-dots" aria-hidden={!briefing}>
        {BRIEFING_ORDER.map((id, i) => {
          const scenario = SCENARIOS.find((s) => s.id === id)
          const passed = briefing && (i < briefingIndex || (i === briefingIndex && phase === 'result'))
          return (
            <span
              key={id}
              className="dot"
              style={passed ? { background: scenario.color } : undefined}
            />
          )
        })}
      </div>

      {!showOverlay && (
        <>
          <button
            className="orb mobile-orb"
            onClick={startListening}
            aria-label="Ask Jarvis"
          />
          <div className="greeting">
            <h1>{greeting.title}</h1>
            <p>{greeting.sub}</p>
          </div>
          <div className="tab-bar">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={t.id === activeTab ? 'active' : ''}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="suggestion-list">
            {tabScenarios.map((s) => (
              <button
                key={s.id}
                className="suggestion-card"
                style={{ '--tag-color': s.color }}
                onClick={() => triggerScenario(s.id)}
              >
                <span className="tag">{s.tag}</span>
                <span className="prompt">&ldquo;{s.prompt}&rdquo;</span>
              </button>
            ))}
          </div>
        </>
      )}

      {showOverlay && phase === 'listening' && (
        <div className="mobile-overlay">
          <div className="waveform">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <p className="state-label">Listening…</p>
        </div>
      )}

      {showOverlay && phase === 'processing' && (
        <div className="mobile-overlay">
          <div className="orb processing processing-orb" />
          <p className="state-label">Working on it…</p>
        </div>
      )}

      {showOverlay && phase === 'result' && resultDisplay && (
        <div className="mobile-overlay">
          <div className="result-block" style={{ '--tag-color': resultDisplay.color }}>
            <div className="tag">{resultDisplay.tag}</div>
            <div className="response">{resultDisplay.text}</div>
          </div>
          <button className="dismiss-link" onClick={dismiss}>
            Ask something else
          </button>
        </div>
      )}
    </div>
  )
}
