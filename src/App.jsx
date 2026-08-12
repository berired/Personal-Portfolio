import { useState, useCallback, useEffect, useMemo, lazy, Suspense } from 'react'
import SplashScreen from './components/ui/SplashScreen'
import BootSequence from './components/ui/BootSequence'
import Portfolio from './components/Portfolio'
import { LINES, TOTAL_BLOCKS } from './components/ui/bootLines'
import { useIntroTimeline, loadGsap } from './hooks/useIntroTimeline'

// three + drei + gsap + postprocessing are the bulk of the bundle. Splitting
// them out means the splash paints without waiting on them, and they download
// during the splash gate and boot text — a loading window that already exists.
const Scene = lazy(() => import('./components/3d/Scene'))
const loadScene = () => import('./components/3d/Scene')

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const SEEN_KEY = 'portfolio-intro-seen'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.(REDUCED_MOTION_QUERY).matches

const hasSeenIntro = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

const markIntroSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* private mode — the intro just plays again, which is harmless */
  }
}

const BOOT_FADE_MS = 500
const WASH_MS = 540
const FREEZE_MS = 1000
const SHORT_HOLD_MS = 900

export default function App() {
  // One short path serves both returning visitors and reduced-motion users:
  // full boot text, no camera, no 3D chunk requested at all. Fewer branches to
  // keep in sync, and a repeat visitor on mobile data never pays for the model.
  const [runId, setRunId] = useState(0)
  const [short, setShort] = useState(() => prefersReducedMotion() || hasSeenIntro())
  const [phase, setPhase] = useState(() =>
    prefersReducedMotion() || hasSeenIntro() ? 'short' : 'splash'
  )
  const [bootExiting, setBootExiting] = useState(false)
  const [washing, setWashing] = useState(false)
  const [frozen, setFrozen] = useState(false)
  // Latched: once the canvas is up it stays mounted through the portfolio as the
  // frozen backdrop, even after the intro timeline is torn down.
  const [scene3d, setScene3d] = useState(false)

  const runningIntro = !short && (phase === 'boot' || phase === 'scene')

  const handleCameraStart = useCallback(() => {
    setPhase('scene')
    setBootExiting(true)
  }, [])

  const handleReveal = useCallback(() => {
    markIntroSeen()
    setWashing(true)
    setPhase('portfolio')
  }, [])

  const { boot, built, timeline, markSceneReady, skip } = useIntroTimeline({
    runId,
    enabled: runningIntro,
    onCameraStart: handleCameraStart,
    onReveal: handleReveal,
  })

  const handleSplashStart = useCallback(() => {
    setPhase('boot')
    setBootExiting(false)
  }, [])

  const replay = useCallback(() => {
    try {
      sessionStorage.removeItem(SEEN_KEY)
    } catch {
      /* ignore */
    }
    setWashing(false)
    setFrozen(false)
    setBootExiting(false)
    setScene3d(false)
    setRunId((n) => n + 1)
    if (prefersReducedMotion()) {
      setShort(true)
      setPhase('short')
    } else {
      setShort(false)
      setPhase('splash')
    }
  }, [])

  // Read the motion preference live rather than once at module scope, so a user
  // who turns it on mid-session is respected instead of ignored until reload.
  useEffect(() => {
    const mq = window.matchMedia?.(REDUCED_MOTION_QUERY)
    if (!mq) return
    const onChange = (e) => {
      if (!e.matches) return
      setShort(true)
      setPhase((p) => (p === 'portfolio' ? p : 'portfolio'))
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Warm the 3D chunk and gsap while the visitor is occupied with the splash
  // and boot. Deliberately never called on the short path — a returning visitor
  // on mobile data pays for neither.
  useEffect(() => {
    if (short) return
    if (phase === 'splash' || phase === 'boot') {
      loadScene()
      loadGsap()
    }
  }, [phase, short])

  // Skip fast-forwards the whole sequence rather than cutting to the end, so
  // the transition still resolves visually.
  useEffect(() => {
    if (!runningIntro) return
    const onSkip = () => skip()
    window.addEventListener('keydown', onSkip)
    window.addEventListener('click', onSkip)
    return () => {
      window.removeEventListener('keydown', onSkip)
      window.removeEventListener('click', onSkip)
    }
  }, [runningIntro, skip])

  // Mount the canvas once the timeline exists, so CameraRig always has
  // something to attach to and the awaitScene hold is guaranteed a release.
  useEffect(() => {
    if (!short && built && phase === 'boot') setScene3d(true)
  }, [short, built, phase])

  // Boot overlay crossfades out as the camera move begins.
  useEffect(() => {
    if (!bootExiting) return
    const t = setTimeout(() => setBootExiting('done'), BOOT_FADE_MS)
    return () => clearTimeout(t)
  }, [bootExiting])

  // Short path: hold the completed boot text briefly, then a plain fade.
  useEffect(() => {
    if (phase !== 'short') return
    const t = setTimeout(() => setPhase('portfolio'), SHORT_HOLD_MS)
    return () => clearTimeout(t)
  }, [phase, runId])

  // One reveal: the wash covers the swap, then the canvas stops rendering and
  // stays on screen as a static backdrop.
  useEffect(() => {
    if (phase !== 'portfolio') return
    const timers = [
      setTimeout(() => setWashing(false), WASH_MS),
      setTimeout(() => setFrozen(true), FREEZE_MS),
    ]
    return () => timers.forEach(clearTimeout)
  }, [phase])

  const sceneMounted = scene3d
  const showBoot = phase === 'short' || phase === 'boot' || (phase === 'scene' && bootExiting !== 'done')

  const bootProps = useMemo(
    () =>
      phase === 'short'
        ? // Everything except the trailing "Press any key or wait…" — there is
          // nothing to skip on this path, so the prompt would be a lie.
          { line: LINES.length - 1, blocks: TOTAL_BLOCKS, showSkipHint: false }
        : { line: boot.line, blocks: boot.blocks, showSkipHint: true },
    [phase, boot.line, boot.blocks]
  )

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#050505] font-mono crt">
      {/* CRT moving beam always visible */}
      <div className="scanbeam" />

      {phase === 'splash' && <SplashScreen onStart={handleSplashStart} />}

      {showBoot && <BootSequence {...bootProps} exiting={bootExiting === true} />}

      {sceneMounted && (
        <div
          className="fixed inset-0 transition-opacity duration-700"
          style={{ opacity: phase === 'portfolio' ? 0.08 : 1 }}
        >
          <Suspense fallback={null}>
            <Scene timelineRef={timeline} onSceneReady={markSceneReady} frozen={frozen} />
          </Suspense>
        </div>
      )}

      {/* Screen flare carrying the bloom blowout into the portfolio. Resolves
          to clear — it is not a hold. */}
      {washing && (
        <div className="fixed inset-0 bg-[#00ff41] z-50 animate-screen-wash pointer-events-none" />
      )}

      {phase === 'portfolio' && (
        <div className="relative z-10 animate-fade-in w-full h-full">
          <Portfolio onReplay={replay} />
        </div>
      )}
    </div>
  )
}
