import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useMemo } from 'react'
import computerUrl from '@asset/old_computer.glb'
import { useComputerMetrics } from './useComputerMetrics'
import { screenMaskTexture } from './screenMask'

// Screen size as a fraction of the model, measured against the render. The
// monitor body is 1.03 wide × 0.90 tall in normalized units; the glass inside
// the bezel is a little under three quarters of that. Kept a little inside
// the bezel opening (rather than filling it edge-to-edge) so the mask's
// feathered border sits on the dark case, not exactly on its curved lip.
const SCREEN_W = 0.68
const SCREEN_H = 0.56

export default function Computer({ screenRef }) {
  const { scene } = useGLTF(computerUrl)
  const { scale, offset, size, screen } = useComputerMetrics()
  const localRef = useRef()
  const ref = screenRef ?? localRef
  const mask = useMemo(() => screenMaskTexture(), [])

  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
    })
    if (import.meta.env.DEV) window.__model = { scene, scale, offset, size, screen }
  }, [scene, scale, offset, size, screen])

  return (
    <group>
      {/* Desk surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#080808" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Normalized model — centred on X/Z with its base on the desk */}
      <group scale={scale} position={offset}>
        <primitive object={scene} />
      </group>

      {/* The glass. The .glb has no screen mesh at all — a single 180-vertex
          blob with one material — so the lit screen is our own plane sitting
          just proud of the monitor face. Rotated to face +X, which is the
          direction the machine actually points. Its colour is driven above 1.0
          so it crosses the bloom threshold; the timeline ramps it to a blowout
          at the climax.

          A flat, hard-edged rectangle here visibly clips against the case's
          curved/beveled front — the plane's corners get unevenly occluded by
          the bezel, so the glow reads as a flat sticker instead of glass set
          into a curved surface. The alpha mask feathers the edge and pulls the
          shape in from the corners so it fades out before it can collide with
          that curve, and a moved-further-off offset avoids z-fighting with the
          model's own coplanar screen face. */}
      <mesh
        position={[screen.x + size.x * 0.02, screen.y, screen.z]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial
          ref={ref}
          color="#00ff41"
          alphaMap={mask}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Monitor glow spilling onto the bezel, keyboard and desk. Must sit in
          front of the glass: everything on the front of the monitor faces +X,
          so a light behind the screen plane leaves the whole bezel unlit.
          Kept well below the spotlight so it reads as an accent near the
          screen rather than washing the whole case green. */}
      <pointLight
        position={[screen.x + size.x * 0.3, screen.y, screen.z]}
        intensity={0.25}
        color="#00ff41"
        distance={size.x * 1.3}
        decay={2}
      />
    </group>
  )
}
