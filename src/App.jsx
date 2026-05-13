import { useState, useCallback } from 'react'
import SplashScreen from './components/ui/SplashScreen'
import BootSequence from './components/ui/BootSequence'
import Scene from './components/3d/Scene'
import Portfolio from './components/Portfolio'

// phase flow: 'splash' → 'boot' → 'scene' → 'portfolio'
export default function App() {
  const [phase, setPhase] = useState('splash')
  const [flickering, setFlickering] = useState(false)

  const handleSplashStart = useCallback(() => setPhase('boot'), [])
  const handleBootComplete = useCallback(() => setPhase('scene'), [])

  const handleZoomComplete = useCallback(() => {
    // Brief CRT screen flicker before portfolio appears
    setFlickering(true)
    setTimeout(() => {
      setFlickering(false)
      setPhase('portfolio')
    }, 500)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050505] font-mono crt">
      {/* CRT moving beam always visible */}
      <div className="scanbeam" />

      {/* Splash phase */}
      {phase === 'splash' && <SplashScreen onStart={handleSplashStart} />}

      {/* Boot phase */}
      {phase === 'boot' && <BootSequence onComplete={handleBootComplete} />}

      {/* 3-D scene — visible during 'scene', fades behind portfolio */}
      {(phase === 'scene' || phase === 'portfolio') && (
        <div
          className="fixed inset-0 transition-opacity duration-1000"
          style={{ opacity: phase === 'portfolio' ? 0.08 : 1 }}
        >
          <Scene onZoomComplete={handleZoomComplete} />
        </div>
      )}

      {/* Flicker overlay on transition */}
      {flickering && (
        <div className="fixed inset-0 bg-[#00ff41] z-50 animate-flicker pointer-events-none" />
      )}

      {/* Portfolio UI */}
      {phase === 'portfolio' && (
        <div className="relative z-10 animate-fade-in w-full h-full">
          <Portfolio />
        </div>
      )}
    </div>
  )
}
