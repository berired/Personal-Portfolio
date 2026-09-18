import { Canvas } from '@react-three/fiber'
import { Suspense, forwardRef, useImperativeHandle, useRef } from 'react'
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import Office from './Office'
import CameraRig from './CameraRig'
import InteractiveRig from './InteractiveRig'
import { useOfficeMetrics } from './useOfficeMetrics'
import { getMonitorDockView } from './homeView'
import { loadGsap } from '../../hooks/useIntroTimeline'
import { useBootSound } from '../../hooks/useBootSound'

// How long the click-to-enter zoom takes — a quick push into the screen from
// wherever free-look left the camera, not the full establishing shot the
// intro opens with.
const ENTER_SECONDS = 0.9

// A constant, subtle strength — no monitor light or color to ramp anymore,
// just softens bright edges (the window graphic, the sticky notes) the way a
// cheap lens would.
const BLOOM_INTENSITY = 0.2

// CRT lens artifacts, applied once at a constant, subtle strength. No global
// color grade here: the office reads its own material colors under normal
// daylight, not a green wash.
const CRT_ABERRATION_OFFSET = 0.0006
const CRT_NOISE_OPACITY = 0.04

function Stage({ timelineRef, onSceneReady, interactive, rigApiRef, onMonitorClick }) {
  return (
    <>
      <Office onMonitorClick={interactive ? onMonitorClick : undefined} />
      <CameraRig timelineRef={timelineRef} onReady={onSceneReady} />
      <InteractiveRig active={interactive} apiRef={rigApiRef} />
    </>
  )
}

const Scene = forwardRef(function Scene(
  { timelineRef, onSceneReady, frozen = false, interactive = false, onEnterPortfolio },
  ref
) {
  const rigApiRef = useRef(null)
  const metrics = useOfficeMetrics()
  const { playPowerUp } = useBootSound()

  // Clicking the monitor zooms the camera into the screen, then the wash
  // (App's CSS overlay) covers the swap to the flat portfolio page. The
  // power-up sound (thunk, degauss buzz, rising hum) scores this push in
  // rather than the intro's opening glide.
  useImperativeHandle(ref, () => ({
    enterPortfolio: (onDocked) => {
      loadGsap().then(({ default: gsap }) => {
        const dockPosition = getMonitorDockView(metrics)
        rigApiRef.current?.flyToMonitor?.(gsap, ENTER_SECONDS, dockPosition)
        playPowerUp(ENTER_SECONDS)
        gsap.delayedCall(ENTER_SECONDS, () => onDocked?.())
      })
    },
  }))

  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ fov: 50, near: 0.05, far: 200 }}
      shadows
      dpr={[1, 1.5]}
      // Once the portfolio has taken over, the last frame stays on screen as a
      // static backdrop at zero ongoing cost.
      frameloop={frozen ? 'never' : 'always'}
    >
      <color attach="background" args={['#cfd6de']} />

      {/* Bright daytime office. */}
      <ambientLight intensity={0.9} color="#ffffff" />
      <hemisphereLight args={['#e8edf4', '#9aa1ab', 0.6]} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.1}
        color="#fff8ec"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Everything that depends on the loaded model lives here, so the camera
          can never animate over an empty room. */}
      <Suspense fallback={null}>
        <Stage
          timelineRef={timelineRef}
          onSceneReady={onSceneReady}
          interactive={interactive}
          rigApiRef={rigApiRef}
          onMonitorClick={onEnterPortfolio}
        />
      </Suspense>

      <EffectComposer multisampling={4} disableNormalPass>
        <Bloom
          luminanceThreshold={1.0}
          luminanceSmoothing={0.25}
          intensity={BLOOM_INTENSITY}
          mipmapBlur
          radius={0.35}
        />
        <ChromaticAberration offset={[CRT_ABERRATION_OFFSET, CRT_ABERRATION_OFFSET]} radialModulation={false} modulationOffset={0} />
        <Noise opacity={CRT_NOISE_OPACITY} blendFunction={BlendFunction.OVERLAY} />
      </EffectComposer>
    </Canvas>
  )
})

export default Scene
