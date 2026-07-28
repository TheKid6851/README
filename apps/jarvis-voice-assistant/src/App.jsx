import './jarvis.css'
import { useJarvis } from './hooks/useJarvis'
import MobileView from './components/MobileView'
import DesktopView from './components/DesktopView'
import TweaksPanel from './components/TweaksPanel'

export default function App() {
  const jarvis = useJarvis()

  return (
    <div className="app-root" data-theme={jarvis.theme}>
      <TweaksPanel
        persona={jarvis.persona}
        setPersona={jarvis.setPersona}
        pace={jarvis.pace}
        setPace={jarvis.setPace}
        theme={jarvis.theme}
        setTheme={jarvis.setTheme}
      />
      <MobileView jarvis={jarvis} />
      <DesktopView jarvis={jarvis} />
    </div>
  )
}
