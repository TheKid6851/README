import { useEffect, useMemo, useRef, useState } from 'react'
import { SCENARIOS, TABS } from '../data/scenarios'
import { useDraggableOrb } from '../hooks/useDraggableOrb'
import { useSwipeDismiss } from '../hooks/useSwipeDismiss'
import { useNodeRepel } from '../hooks/useNodeRepel'

const CATEGORY_CYCLE = SCENARIOS.map((s) => s.color)

const STATUS_BY_PHASE = {
  idle: { word: 'STANDBY', color: 'var(--status-standby)' },
  listening: { word: 'LISTENING', color: 'var(--status-listening)' },
  processing: { word: 'PROCESSING', color: 'var(--status-processing)' },
  result: { word: 'SPEAKING', color: 'var(--status-speaking)' },
}

function initials(tag) {
  return tag.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase()
}

function useNodeGraph(count = 34) {
  return useMemo(() => {
    const nodes = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: 4 + Math.random() * 4,
      color: CATEGORY_CYCLE[i % CATEGORY_CYCLE.length],
      floatClass: `f${i % 3}`,
      duration: 5 + Math.random() * 5,
      delay: 0.2 + Math.random() * 1.6,
    }))
    const lines = []
    nodes.forEach((n, i) => {
      const a = nodes[(i + 1) % nodes.length]
      const b = nodes[(i + 7) % nodes.length]
      lines.push([n, a])
      lines.push([n, b])
    })
    return { nodes, lines }
  }, [count])
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
    counts, resultDisplay, triggerScenario, startListening, dismiss,
  } = jarvis
  const { nodes, lines } = useNodeGraph()
  const clock = useClock()

  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const ringRef = useRef(null)
  const { influence, displace, handlers: repelHandlers } = useNodeRepel(svgRef)
  const { dragStyle, dragHandlers, didDragRef } = useDraggableOrb({
    containerRef, elementRef: ringRef,
  })
  const { swipeStyle, swipeHandlers } = useSwipeDismiss(dismiss, phase === 'result')

  const status = STATUS_BY_PHASE[phase]
  const tabScenarios = SCENARIOS.filter((s) => s.tab === activeTab)
  const nodeTransition = influence ? 'none' : 'cx 0.5s cubic-bezier(.2,.8,.2,1), cy 0.5s cubic-bezier(.2,.8,.2,1)'
  const lineTransition = influence ? 'none' : 'x1 0.5s cubic-bezier(.2,.8,.2,1), y1 0.5s cubic-bezier(.2,.8,.2,1), x2 0.5s cubic-bezier(.2,.8,.2,1), y2 0.5s cubic-bezier(.2,.8,.2,1)'

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

      <svg
        ref={svgRef}
        className="node-graph"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        {...repelHandlers}
      >
        {lines.map(([a, b], i) => {
          const pa = displace(a.x, a.y)
          const pb = displace(b.x, b.y)
          return (
            <line
              key={i}
              x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke="oklch(0.55 0.05 150 / 0.3)"
              strokeWidth="0.15"
              style={{ transition: lineTransition }}
            />
          )
        })}
        {nodes.map((n) => {
          const p = displace(n.x, n.y)
          return (
            <circle
              key={n.id}
              className={`node ${n.floatClass}`}
              cx={p.x} cy={p.y} r={n.r / 20}
              fill={n.color}
              style={{ animationDuration: `${n.duration}s`, animationDelay: `${n.delay}s`, transition: nodeTransition }}
            />
          )
        })}
      </svg>

      <div className="clock">{clock}</div>

      <div className="skills-panel">
        <div className="mini-tabs">
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
        {tabScenarios.map((s) => (
          <button key={s.id} className="skill-row" onClick={() => triggerScenario(s.id)}>
            <span className="skill-dot" style={{ background: s.color }} />
            <span className="skill-name">{s.tag}</span>
            <span className="skill-count">{counts[s.id] || 0}</span>
          </button>
        ))}
      </div>

      <div
        ref={ringRef}
        className="status-ring-wrap"
        style={{ '--ring-color': status.color, ...dragStyle }}
        {...dragHandlers}
      >
        <svg className="ring" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r="56"
            fill="none"
            stroke={status.color}
            strokeOpacity="0.6"
            strokeWidth="1.5"
            strokeDasharray="2 6"
          />
        </svg>
        <button
          className="inner-disc"
          onClick={() => { if (!didDragRef.current) startListening() }}
          aria-label="Ask Jarvis — click, flick up, or drag to move"
        >
          <span className="jarvis-label">J.A.R.V.I.S.</span>
          <span className="status-dot" />
          <span className="status-word">{status.word}</span>
        </button>
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

      <div className="dock">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            className="dock-icon"
            style={{ color: s.color }}
            onClick={() => triggerScenario(s.id)}
            aria-label={s.tag}
            title={s.tag}
          >
            {initials(s.tag)}
          </button>
        ))}
      </div>
    </div>
  )
}
