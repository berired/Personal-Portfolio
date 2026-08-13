import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import officeUrl from '@asset/low-poly_office.glb'
import { useOfficeMetrics } from './useOfficeMetrics'

// Screen glass size as a fraction of the CRT monitor's own bounding box —
// eyeballed against the render the same way the old single-computer scene's
// screen fractions were: a little inside the bezel opening so the mask's
// feathered edge lands on the case, not the curved lip.
const SCREEN_W = 0.62
const SCREEN_H = 0.5

// OrbitControls calls preventDefault() on pointerdown, which suppresses the
// native "click" event a mesh's onClick relies on — so a plain onClick here
// never fires while free-look is active. down/up position is compared
// instead, the same workaround the old single-computer scene used for its
// click-to-exit: a near-stationary press counts as a click, anything that
// moved further counts as a drag and is left to OrbitControls.
const CLICK_DRAG_TOLERANCE = 6

export default function Office({ onMonitorClick }) {
  const { scene } = useGLTF(officeUrl)
  const { offset, monitor } = useOfficeMetrics()
  const down = useRef(null)

  const handleDown = (e) => {
    down.current = { x: e.clientX, y: e.clientY }
  }
  const handleUp = (e) => {
    const start = down.current
    down.current = null
    if (!start) return
    const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y)
    if (dist < CLICK_DRAG_TOLERANCE) onMonitorClick?.(e)
  }

  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
    })
  }, [scene])

  return (
    <>
      {/* The raw model's own coordinates are ungrounded, so it's the only
          thing that needs the group's floor-grounding offset applied. */}
      <group position={offset}>
        <primitive object={scene} />
      </group>

      {/* An unlit hit-target over the CRT's own screen mesh — no light or
          color of its own, just the clickable surface. Facing -z, the
          direction the monitor actually points (toward the chair).
          `monitor.*` is already grounded, so this is placed in world space,
          not nested under the offset group above. */}
      <mesh
        position={[
          monitor.center.x,
          monitor.center.y,
          monitor.frontZ - 0.01,
        ]}
        rotation={[0, Math.PI, 0]}
        onPointerDown={onMonitorClick ? handleDown : undefined}
        onPointerUp={onMonitorClick ? handleUp : undefined}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <planeGeometry args={[monitor.size.x * SCREEN_W, monitor.size.y * SCREEN_H]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  )
}

useGLTF.preload(officeUrl)
