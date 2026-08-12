import { useCallback, useEffect, useRef, useState } from 'react'
import { useBootSound } from './useBootSound'
import { BOOT_MS, LINES, visibleCount, barBlocks } from '../components/ui/bootLines'

export const BOOT_SECONDS = BOOT_MS / 1000
export const CAMERA_SECONDS = 2.7
export const PLUNGE_AT = 1.8 // seconds into the camera leg
export const SKIP_RATE = 8

// gsap is only needed for the full intro, and the full intro always passes
// through the user-gated splash — so it loads during that wait rather than
// blocking first paint. The short path never touches it.
export const loadGsap = () => import('gsap')

/**
 * One clock for the whole intro.
 *
 * The boot text, the camera move and the bloom ramp used to be three separate
 * timing systems — a setTimeout array, a private GSAP timeline, and CSS
 * durations — negotiating handoffs with callbacks. They are now keyframes on a
 * single timeline, which is what makes the sequence read as one move.
 *
 * The timeline holds at `awaitScene` until the lazy 3D chunk and the .glb have
 * both resolved, so the camera can never animate over an empty room. If they
 * are already loaded — which they will be after ~2.8s of boot text — the hold
 * costs nothing.
 */
export function useIntroTimeline({ runId, enabled, onCameraStart, onReveal }) {
  const [boot, setBoot] = useState({ line: 0, blocks: 0 })
  // The 3D scene must not mount before the timeline exists, or CameraRig would
  // have nothing to attach to and the hold would never be released.
  const [built, setBuilt] = useState(false)
  const tlRef = useRef(null)
  const readyRef = useRef(false)
  const { playTick, playProgress, playReady, once } = useBootSound()

  // Latest callbacks without rebuilding the timeline on every render.
  const cbs = useRef({ onCameraStart, onReveal })
  cbs.current = { onCameraStart, onReveal }

  useEffect(() => {
    if (!enabled) {
      setBuilt(false)
      return
    }

    readyRef.current = false
    let cancelled = false
    let tl = null

    loadGsap().then(({ default: gsap }) => {
      if (cancelled) return

      const state = { p: 0 }
      const last = { line: -1, blocks: -1 }

      tl = gsap.timeline({ paused: true })
      tlRef.current = tl

      tl.to(state, {
        p: 1,
        duration: BOOT_SECONDS,
        ease: 'none',
        onUpdate: () => {
          const ms = state.p * BOOT_MS
          const line = visibleCount(ms)
          const blocks = barBlocks(ms)
          if (line === last.line && blocks === last.blocks) return

          // Sound fires on the lines that just became visible, so audio runs off
          // the same clock as the text rather than a parallel set of timers.
          for (let i = Math.max(last.line, 0); i < line; i++) {
            const l = LINES[i]
            if (!l) continue
            if (l.bright) once('ready', playReady)
            else if (l.progress) once('progress', playProgress)
            else if (l.text?.trim()) playTick()
          }

          last.line = line
          last.blocks = blocks
          setBoot({ line, blocks })
        },
      })

      tl.addLabel('awaitScene')

      // A *conditional* pause, not gsap's addPause(). addPause always stops the
      // playhead when it crosses, but in the common case the scene is ready long
      // before the boot text finishes — markSceneReady would then have called
      // play() before the pause existed, and the timeline would stop for good.
      tl.call(() => {
        if (!readyRef.current) tl.pause()
      })

      tl.call(() => cbs.current.onCameraStart?.())
      tl.addLabel('camera')
      // The camera tween and bloom ramp attach themselves at this label when the
      // 3D mounts. The reveal is placed relative to it, so it holds even if the
      // camera leg never attaches.
      tl.call(() => cbs.current.onReveal?.(), null, `camera+=${CAMERA_SECONDS}`)

      setBuilt(true)
      tl.play()
    })

    return () => {
      cancelled = true
      tl?.kill()
      tlRef.current = null
      setBuilt(false)
    }
  }, [runId, enabled, once, playProgress, playReady, playTick])

  // Called once the 3D scene has mounted and attached its tweens. Safe to call
  // before the playhead reaches the hold — play() on a running timeline is a
  // no-op, and the flag stops the hold from engaging later.
  const markSceneReady = useCallback(() => {
    readyRef.current = true
    tlRef.current?.play()
  }, [])

  // Skip fast-forwards rather than cutting, so the transition still resolves
  // visually instead of the sequence being dismissed like a modal.
  const skip = useCallback(() => {
    tlRef.current?.timeScale(SKIP_RATE)
  }, [])

  return { boot, built, timeline: tlRef, markSceneReady, skip }
}
