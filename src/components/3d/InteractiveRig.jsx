import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useOfficeMetrics } from './useOfficeMetrics'
import { getSeatView } from './homeView'

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// How far the head can turn/tilt from the way it's initially facing.
const HEAD_TURN = Math.PI * 0.4
const HEAD_TILT = Math.PI * 0.12
const LOOK_SPEED = 0.0035

// Scroll zooms the lens, not the position — dollying in would mean moving
// the "head" toward whatever's under the cursor, which is exactly the
// locked-onto-one-thing feeling this is meant to avoid.
const FOV_DEFAULT = 50
const FOV_MIN = 32
const FOV_MAX = 62
const ZOOM_SPEED = 0.04

// Narrowing the lens on top of the position/rotation move sells the
// "pushing into the screen" feeling — a dolly alone reads as a camera move,
// this reads as a zoom.
const DOCK_FOV = 24

// Free-look mode: the eye stays fixed at the seat, only turning — a person
// looking around a desk, not a camera orbiting some object it's tethered to.
// `apiRef` (a plain ref object, not a forwarded one — this sits inside
// Scene's Suspense boundary) is how the parent flies the camera into the
// monitor when the visitor clicks it.
export default function InteractiveRig({ active, apiRef }) {
  const { camera, gl } = useThree()
  const metrics = useOfficeMetrics()
  const seat = useMemo(() => getSeatView(metrics), [metrics])

  const yaw = useRef(0)
  const pitch = useRef(0)
  const baseYaw = useRef(0)
  const basePitch = useRef(0)
  const drag = useRef(null)
  const flying = useRef(false)

  const applyLook = () => {
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')
  }

  const snapTo = (view) => {
    camera.position.copy(view.position)
    camera.fov = FOV_DEFAULT
    camera.updateProjectionMatrix()
    // camera.rotation is a live Euler kept in sync with the quaternion
    // lookAt sets — reading it back (order fixed to 'YXZ' first) gives the
    // correct initial yaw/pitch with no separate conversion to get wrong.
    camera.rotation.order = 'YXZ'
    camera.lookAt(view.lookAt)
    baseYaw.current = camera.rotation.y
    basePitch.current = camera.rotation.x
    yaw.current = camera.rotation.y
    pitch.current = camera.rotation.x
  }

  // Flies from the seat toward the monitor for the click-to-enter transition
  // — a straight dolly-in with a narrowing lens, holding whatever direction
  // the visitor was already looking (they can only click the monitor if
  // they're roughly facing it already). No rotation: swinging the view to
  // square up on the dock's exact facing on top of the dolly read as an
  // unwanted spin.
  const flyToMonitor = (gsap, duration, dockPosition) => {
    flying.current = true
    drag.current = null

    const startPos = camera.position.clone()
    const startFov = camera.fov
    const proxy = { t: 0 }

    gsap.to(proxy, {
      t: 1,
      duration,
      ease: 'power2.in',
      onUpdate: () => {
        camera.position.lerpVectors(startPos, dockPosition, proxy.t)
        camera.fov = THREE.MathUtils.lerp(startFov, DOCK_FOV, proxy.t * proxy.t)
        camera.updateProjectionMatrix()
      },
    })
  }

  useEffect(() => {
    if (!apiRef) return
    apiRef.current = { flyToMonitor }
    return () => {
      apiRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef, seat])

  // Snap to the seat on entry — a no-op-ish reframe if the boot glide just
  // left the camera here, the only positioning step at all if the intro
  // never ran (short path, or returning from the portfolio).
  useEffect(() => {
    if (active) {
      flying.current = false
      snapTo(seat)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useEffect(() => {
    if (!active) return
    const el = gl.domElement

    const onDown = (e) => {
      if (flying.current) return
      drag.current = { x: e.clientX, y: e.clientY, yaw: yaw.current, pitch: pitch.current }
    }
    const onMove = (e) => {
      if (!drag.current || flying.current) return
      const dx = e.clientX - drag.current.x
      const dy = e.clientY - drag.current.y
      yaw.current = clamp(drag.current.yaw - dx * LOOK_SPEED, baseYaw.current - HEAD_TURN, baseYaw.current + HEAD_TURN)
      pitch.current = clamp(drag.current.pitch - dy * LOOK_SPEED, basePitch.current - HEAD_TILT, basePitch.current + HEAD_TILT)
      applyLook()
    }
    const onUp = () => {
      drag.current = null
    }
    const onWheel = (e) => {
      if (flying.current) return
      e.preventDefault()
      camera.fov = clamp(camera.fov + e.deltaY * ZOOM_SPEED, FOV_MIN, FOV_MAX)
      camera.updateProjectionMatrix()
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('wheel', onWheel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, gl])

  return null
}
