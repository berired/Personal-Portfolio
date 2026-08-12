import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Computer from './Computer'
import CameraRig from './CameraRig'
import { CAMERA_SECONDS } from '../../hooks/useIntroTimeline'

// Threshold sits at 1.0 so only the screen — which is deliberately driven above
// 1.0 — can bloom. Lower values also caught the point-lit bezel, tower and
// keyboard, and the glow flattened the CRT vignette into a green wash.
const BLOOM_THRESHOLD = 1.0
const BLOOM_BASE = 0.35
const BLOOM_PEAK = 2.2
// Screen brightness multiplier. The blowout is what carries the camera into the
// portfolio, so it has to clear the threshold by a wide margin at the end.
const SCREEN_BASE = 1.3
const SCREEN_PEAK = 12
// How far the screen shifts from green toward white as it blows out. Scaling
// only the blue channel turned it cyan on the way up.
const WHITE_SHIFT = 0.8

// Pushes the timeline-driven ramp onto the effect and the material each frame.
// Doing it here rather than through React state keeps a 60fps ramp from
// re-rendering the tree.
function Driver({ state, bloomRef, screenRef }) {
  useFrame(() => {
    const r = state.current.ramp
    if (bloomRef.current) {
      bloomRef.current.intensity = BLOOM_BASE + r * (BLOOM_PEAK - BLOOM_BASE)
    }
    if (screenRef.current) {
      const k = SCREEN_BASE + r * (SCREEN_PEAK - SCREEN_BASE)
      const w = r * WHITE_SHIFT // green → white, not green → cyan
      screenRef.current.color.setRGB(k * w, k, k * (0.05 + w * 0.95))
    }
  })
  return null
}

function Stage({ timelineRef, onSceneReady, screenRef }) {
  return (
    <>
      <Computer screenRef={screenRef} />
      <CameraRig timelineRef={timelineRef} onReady={onSceneReady} />
    </>
  )
}

export default function Scene({ timelineRef, onSceneReady, frozen = false }) {
  const bloomRef = useRef()
  const screenRef = useRef()
  const state = useRef({ ramp: 0 })

  // The bloom ramp is a keyframe on the same timeline as the camera, not a
  // separate animation — the screen overtaking the frame *is* the transition,
  // rather than a flash pasted over the top of it.
  useEffect(() => {
    const tl = timelineRef?.current
    if (!tl) return

    const up = tl.to(
      state.current,
      {
        ramp: 1,
        duration: CAMERA_SECONDS,
        // Steeper than the camera's own ease so the screen stays a readable
        // green for most of the move and only blows out at the very end.
        ease: 'power4.in',
      },
      'camera'
    )

    // The white blowout is a one-frame climax, not a resting state. Without
    // this, the ramp stays pinned at 1 forever, and App's frameloop="never"
    // freeze (~1s after reveal) locks in that peak-white frame as the
    // permanent backdrop behind the portfolio — a white screen that never
    // goes back to looking like a monitor. Settle back to the idle glow
    // before the freeze has a chance to catch it.
    const down = tl.to(
      state.current,
      {
        ramp: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      `camera+=${CAMERA_SECONDS}`
    )

    return () => {
      up.kill()
      down.kill()
    }
  }, [timelineRef])

  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ fov: 50, near: 0.1, far: 200 }}
      shadows
      dpr={[1, 1.5]}
      // Once the portfolio has taken over, the last frame stays on screen as a
      // static backdrop at zero ongoing cost.
      frameloop={frozen ? 'never' : 'always'}
    >
      <color attach="background" args={['#020202']} />
      {/* Scene lives inside ~8 units; the old 18–50 range never took effect.
          This fades the 30×30 desk plane out into the dark. */}
      <fog attach="fog" args={['#020202', 6, 22]} />

      {/* Ambient fill — very dim */}
      <ambientLight intensity={0.04} color="#1a1a2e" />

      {/* Weak desk lamp from upper-right */}
      <spotLight
        position={[4, 6, 4]}
        angle={0.45}
        penumbra={0.8}
        intensity={0.8}
        color="#ffe0b0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Deep background stars */}
      <Stars radius={60} depth={60} count={1200} factor={2} fade speed={0.4} />

      {/* Everything that depends on the loaded model lives here, so the camera
          can never animate over an empty room. */}
      <Suspense fallback={null}>
        <Stage timelineRef={timelineRef} onSceneReady={onSceneReady} screenRef={screenRef} />
      </Suspense>

      <Driver state={state} bloomRef={bloomRef} screenRef={screenRef} />

      <EffectComposer multisampling={4} disableNormalPass>
        <Bloom
          ref={bloomRef}
          luminanceThreshold={BLOOM_THRESHOLD}
          luminanceSmoothing={0.25}
          intensity={BLOOM_BASE}
          mipmapBlur
        />
      </EffectComposer>
                                                                                                                                                                                                                                                                                                                                                                           </Canvas>
  )
}
