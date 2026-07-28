import { useState } from 'react'
import './jarvis.css'
import { useJarvis } from './hooks/useJarvis'
import MobileView from './components/MobileView'
import DesktopView from './components/DesktopView'
import TweaksPanel from './components/TweaksPanel'

// The mobile/desktop split is normally driven by a CSS media query on the
// window width — but an embedded preview (an iframe in a side panel, say)
// can be narrower than the breakpoint even on a wide monitor. This lets
// the layout be pinned regardless of the container's actual size:
// ?view=desktop or ?view=mobile in the URL, or the Tweaks panel toggle.
function initialViewMode() {
  if (typeof window === 'undefined') return 'auto'
  const param = new URLSearchParams(window.location.search).get('view')
  return param === 'desktop' || param === 'mobile' ? param : 'auto'
}

export default function App() {
  const jarvis = useJarvis()
  const [viewMode, setViewMode] = useState(initialViewMode)

  return (
    <div className={`app-root force-${viewMode}`} data-theme={jarvis.theme}>
      <TweaksPanel
        persona={jarvis.persona}
        setPersona={jarvis.setPersona}
        pace={jarvis.pace}
        setPace={jarvis.setPace}
        theme={jarvis.theme}
        setTheme={jarvis.setTheme}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <MobileView jarvis={jarvis} />
      <DesktopView jarvis={jarvis} />
    </div>
  )
}
