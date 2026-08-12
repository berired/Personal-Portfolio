import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useComputerMetrics } from './useComputerMetrics'
import { getHomeView, getOrbitView } from './homeView'

// Free-look mode: the intro's scripted CameraRig hands off to this once the
// visitor asks to explore the machine. `apiRef` (a plain ref object, not a
// forwarded one — this sits inside Scene's Suspense boundary) is how the
// parent flies the camera back to the docking shot when leaving.
export default function InteractiveRig({ active, apiRef }) {
  const { camera } = useThree()
  const metrics = useComputerMetrics()
  const controlsRef = useRef()
  const orbit = useMemo(
    () => getOrbitView(metrics, camera.fov),
    [metrics, camera.fov]
  )
  const dock = useMemo(
    () => getHomeView(metrics, camera.fov),
    [metrics, camera.fov]
  )

  const snapTo = (view) => {
    camera.position.copy(view.position)
    camera.lookAt(view.lookAt)
    const controls = controlsRef.current
    if (controls) {
      controls.target.copy(view.lookAt)
      controls.update()
    }
  }

  // Flies from wherever free-look left the camera back to the intro's
  // docking shot — the same curve shape CameraRig used to arrive (position
  // lerp, lookAt eased in late), just run in reverse over a short hop instead
  // of the full establishing shot.
  const flyHome = (gsap, duration) => {
    const controls = controlsRef.current
    if (controls) controls.enabled = false

    const startPos = camera.position.clone()
    const startTarget = controls ? controls.target.clone() : dock.lookAt.clone()
    const look = new THREE.Vector3()
    const proxy = { t: 0 }

    gsap.to(proxy, {
      t: 1,
      duration,
      ease: 'power2.in',
      onUpdate: () => {
        camera.position.lerpVectors(startPos, dock.position, proxy.t)
        look.lerpVectors(startTarget, dock.lookAt, proxy.t * proxy.t)
        camera.lookAt(look)
      },
    })
  }

  useEffect(() => {
    if (!apiRef) return
    apiRef.current = { flyHome }
    return () => {
      apiRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef, dock])

  // Pull back to the wide three-quarter view on entry — a no-op-ish reframe
  // if the intro just left the camera docked on the screen, the only
  // positioning step at all if the intro never ran (short path).
  useEffect(() => {
    if (active) snapTo(orbit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (!active) return null

  const dist = orbit.position.distanceTo(orbit.lookAt) || 1

  return (
    <OrbitControls
      ref={controlsRef}
      target={orbit.lookAt}
      enablePan={false}
      enableZoom
      minDistance={dist * 0.55}
      maxDistance={dist * 1.6}
      minPolarAngle={Math.PI * 0.15}
      maxPolarAngle={Math.PI * 0.7}
      rotateSpeed={0.5}
      zoomSpeed={0.6}
      enableDamping
      dampingFactor={0.08}
    />
  )
}
