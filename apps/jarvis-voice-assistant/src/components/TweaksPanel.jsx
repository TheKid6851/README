import { useState } from 'react'

const PACE_OPTIONS = [
  { id: 'quick', label: 'Quick' },
  { id: 'normal', label: 'Normal' },
  { id: 'slow', label: 'Slow' },
]

const PERSONA_OPTIONS = [
  { id: 'formal', label: 'Formal' },
  { id: 'casual', label: 'Casual' },
  { id: 'minimal', label: 'Minimal' },
]

const THEME_OPTIONS = [
  { id: 'cyan', hex: '#5fd4e0' },
  { id: 'amber', hex: '#f0a63c' },
  { id: 'violet', hex: '#c084fc' },
]

export default function TweaksPanel({ persona, setPersona, pace, setPace, theme, setTheme }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="tweaks-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="Tweaks"
        aria-expanded={open}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1v2M8 13v2M2.2 2.2l1.4 1.4M12.4 12.4l1.4 1.4M1 8h2M13 8h2M2.2 13.8l1.4-1.4M12.4 3.6l1.4-1.4"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
          />
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      {open && (
        <div className="tweaks-panel">
          <div className="tweaks-group">
            <label className="group-label">Briefing pace</label>
            <div className="options">
              {PACE_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  className={o.id === pace ? 'active' : ''}
                  onClick={() => setPace(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tweaks-group">
            <label className="group-label">Voice &amp; persona</label>
            <div className="options">
              {PERSONA_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  className={o.id === persona ? 'active' : ''}
                  onClick={() => setPersona(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tweaks-group">
            <label className="group-label">Accent theme</label>
            <div className="theme-swatches">
              {THEME_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  className={o.id === theme ? 'active' : ''}
                  style={{ background: o.hex }}
                  aria-label={o.id}
                  onClick={() => setTheme(o.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
