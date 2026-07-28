import { useEffect, useMemo, useRef, useState } from 'react'
import { SCENARIOS, TABS } from '../data/scenarios'
import { useSwipeDismiss } from '../hooks/useSwipeDismiss'
import { useSceneInteraction } from '../hooks/useSceneInteraction'
import CommandInput from './CommandInput'

const STATUS_BY_PHASE = {
  idle: { word: 'STANDBY', color: 'var(--status-standby)' },
  listening: { word: 'LISTENING', color: 'var(--status-listening)' },
  processing: { word: 'PROCESSING', color: 'var(--status-processing)' },
  result: { word: 'SPEAKING', color: 'var(--status-speaking)' },
}

function initials(tag) {
  return tag.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
}

// Angle 0 = straight up, clockwise — standard clock-face convention.
function polar(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function hexPoints(cx, cy, hr) {
  return Array.from({ length: 6 }, (_, i) => {
    const rad = ((60 * i - 90) * Math.PI) / 180
    return `${cx + hr * Math.cos(rad)},${cy + hr * Math.sin(rad)}`
  }).join(' ')
}

// The diagram's own center — shifted up from the viewBox's true center
// (50,50) so the full ring clears the command bar/input pinned to the
// bottom of the screen.
const CENTER = { x: 50, y: 44 }
const HEX_RADIUS = 34

// Every scenario gets an evenly-spaced spot on the outer ring; a loose
// cloud of small "memory" particles drifts near each one, colored to match.
function useOrbitalLayout() {
  return useMemo(() => {
    const n = SCENARIOS.length
    const hexes = SCENARIOS.map((s, i) => {
      const angle = (360 / n) * i
      const { x, y } = polar(CENTER.x, CENTER.y, HEX_RADIUS, angle)
      return { ...s, angle, x, y }
    })

    const particles = []
    let pid = 0
    hexes.forEach((h) => {
      const count = 5 + Math.floor(Math.random() * 4)
      for (let k = 0; k < count; k++) {
        const angle = h.angle + (Math.random() - 0.5) * 26
        const radius = 7 + Math.random() * 18
        const { x, y } = polar(CENTER.x, CENTER.y, radius, angle)
        particles.push({
          id: pid,
          x, y,
          r: 0.5 + Math.random() * 0.55,
          color: h.color,
          tab: h.tab,
          floatClass: `f${pid % 3}`,
          duration: 5 + Math.random() * 5,
          delay: 0.2 + Math.random() * 1.6,
        })
        pid += 1
      }
    })

    return { hexes, particles }
  }, [])
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function DesktopView({ jarvis }) {
  const {
    phase, activeTab, setActiveTab,
    counts, resultDisplay, triggerScenario, startListening, askText, dismiss,
  } = jarvis
  const { hexes, particles } = useOrbitalLayout()
  const clock = useClock()

  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const {
    scale, influence, displace, interacting,
    canvasStyle, handlers: sceneHandlers, zoomBy, reset: resetScene,
  } = useSceneInteraction({ containerRef, svgRef })
  const { swipeStyle, swipeHandlers } = useSwipeDismiss(dismiss, phase === 'result')

  const status = STATUS_BY_PHASE[phase]
  const particleTransition = influence
    ? 'none'
    : 'cx 0.5s cubic-bezier(.2,.8,.2,1), cy 0.5s cubic-bezier(.2,.8,.2,1)'

  const cmdText = phase === 'idle'
    ? 'Standby — say something, or pick a skill.'
    : phase === 'listening'
      ? 'Listening…'
      : phase === 'processing'
        ? 'Working on it…'
        : resultDisplay?.text

  return (
    <div className="desktop-view" ref={containerRef}>
      <div className="blob one" />
      <div className="blob two" />

      <div
        className={`orbital-layer ${interacting ? 'interacting' : ''}`}
        style={canvasStyle}
        {...sceneHandlers}
      >
        <svg
          ref={svgRef}
          className="node-graph"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
        <circle className="orbit-ring dashed spin-a" cx={CENTER.x} cy={CENTER.y} r="14" />
        <circle className="orbit-ring spin-b" cx={CENTER.x} cy={CENTER.y} r="23" />
        <circle className="orbit-ring dashed spin-c" cx={CENTER.x} cy={CENTER.y} r="32" />

        {hexes.map((h) => {
          const dimmed = activeTab && h.tab !== activeTab
          return (
            <line
              key={`spoke-${h.id}`}
              className="spoke"
              x1={CENTER.x} y1={CENTER.y} x2={h.x} y2={h.y}
              stroke={h.color}
              style={{ opacity: dimmed ? 0.08 : 0.3 }}
            />
          )
        })}

        {particles.map((p) => {
          const d = displace(p.x, p.y)
          const dimmed = activeTab && p.tab !== activeTab
          return (
            <circle
              key={p.id}
              className={`node ${p.floatClass}`}
              cx={d.x} cy={d.y} r={p.r}
              fill={p.color}
              style={{
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                transition: `${particleTransition}, opacity 0.3s ease`,
                opacity: dimmed ? 0.15 : 0.85,
              }}
            />
          )
        })}

        {hexes.map((h) => {
          const dimmed = activeTab && h.tab !== activeTab
          const count = counts[h.id] || 0
          return (
            <g
              key={h.id}
              className="hex-icon"
              style={{ opacity: dimmed ? 0.3 : 1 }}
              role="button"
              tabIndex={0}
              aria-label={h.tag}
              onClick={() => triggerScenario(h.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  triggerScenario(h.id)
                }
              }}
            >
              <polygon points={hexPoints(h.x, h.y, 4.4)} fill="oklch(0.2 0.02 260)" stroke={h.color} strokeWidth="0.45" />
              <text className="hex-label" x={h.x} y={h.y + 1.1} fontSize="3.1" fill={h.color}>
                {initials(h.tag)}
              </text>
              {count > 0 && (
                <g className="hex-count">
                  <circle cx={h.x + 3.4} cy={h.y - 3.4} r="1.7" fill={h.color} />
                  <text x={h.x + 3.4} y={h.y - 3.4 + 0.65} fontSize="1.9" fill="oklch(0.12 0.01 260)">
                    {count}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        </svg>

        <div className="hub" style={{ '--ring-color': status.color }}>
          <div className="hub-ring" />
          <button className="hub-button" onClick={startListening} aria-label="Ask Jarvis">
            <span className="jarvis-label">J.A.R.V.I.S.</span>
            <span className="status-dot" />
            <span className="status-word">{status.word}</span>
          </button>
        </div>
      </div>

      <div className="clock">{clock}</div>

      <div className="zoom-controls">
        <button onClick={() => zoomBy(1 / 1.3)} aria-label="Zoom out">−</button>
        <button className="zoom-readout" onClick={resetScene} aria-label="Reset view">
          {Math.round(scale * 100)}%
        </button>
        <button onClick={() => zoomBy(1.3)} aria-label="Zoom in">+</button>
      </div>

      <div className="tab-bar desktop-tab-bar">
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

      <div className="command-bar" style={swipeStyle} {...(phase === 'result' ? swipeHandlers : {})}>
        <div className={`orb cmd-orb ${phase === 'processing' ? 'processing' : ''}`} />
        <div className="cmd-text">
          {phase === 'result' && resultDisplay && (
            <span className="cmd-tag" style={{ '--tag-color': resultDisplay.color }}>{resultDisplay.tag}</span>
          )}
          {cmdText}
        </div>
        {phase === 'result' && (
          <button className="dismiss-x" onClick={dismiss} aria-label="Dismiss">
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <CommandInput onSubmit={askText} className="desktop-command-input" />
    </div>
  )
}
