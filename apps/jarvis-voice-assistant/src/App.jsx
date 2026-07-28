import { useState } from 'react'
import './jarvis.css'
import { useJarvis } from './hooks/useJarvis'
import MobileView from './components/MobileView'
import DesktopView from './components/DesktopView'
import TweaksPanel from './components/TweaksPanel'

// The mobile/desktop split is normally driven by a CSS media query on the
// window width — but an embedded preview (an iframe in a side panel, say)
// can be narrower than the breakpoint even on a wide monitor, and there's
// no reliable way to pass a URL query string through every path someone
// might open the preview from. So: default to desktop outright rather
// than gambling on a query param or the container's real width. Mobile
// and Auto are still one tap away in the Tweaks panel.
function initialViewMode() {
  if (typeof window === 'undefined') return 'desktop'
  const param = new URLSearchParams(window.location.search).get('view')
  return param === 'mobile' || param === 'auto' ? param : 'desktop'
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
