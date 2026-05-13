import { useRef, useCallback } from 'react'

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!window.__bootAudioCtx) {
    window.__bootAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return window.__bootAudioCtx
}

function beep(ctx, freq, duration, gain = 0.18, type = 'square', startTime = 0) {
  const osc = ctx.createOscillator()
  const env = ctx.createGain()
  osc.connect(env)
  env.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime)
  env.gain.setValueAtTime(0, ctx.currentTime + startTime)
  env.gain.linearRampToValueAtTime(gain, ctx.currentTime + startTime + 0.005)
  env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration)
  osc.start(ctx.currentTime + startTime)
  osc.stop(ctx.currentTime + startTime + duration + 0.01)
}

function noise(ctx, duration, gain = 0.04, startTime = 0) {
  const bufSize = ctx.sampleRate * duration
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1200
  filter.Q.value = 0.5
  const env = ctx.createGain()
  src.connect(filter)
  filter.connect(env)
  env.connect(ctx.destination)
  env.gain.setValueAtTime(gain, ctx.currentTime + startTime)
  env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration)
  src.start(ctx.currentTime + startTime)
  src.stop(ctx.currentTime + startTime + duration + 0.01)
}

export function useBootSound() {
  const playedRef = useRef(new Set())

  // Unlock AudioContext on first user gesture (browsers block autoplay)
  const unlock = useCallback(() => {
    const ctx = getCtx()
    if (ctx && ctx.state === 'suspended') ctx.resume()
  }, [])

  // POST beep — classic single beep at power-on
  const playPost = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    ctx.resume()
    beep(ctx, 880, 0.18, 0.22, 'square')
  }, [])

  // HDD activity tick — short noise burst for each boot line
  const playTick = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    noise(ctx, 0.04, 0.05)
  }, [])

  // Progress bar fill — rising sweep
  const playProgress = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.connect(env)
    env.connect(ctx.destination)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.55)
    env.gain.setValueAtTime(0.08, ctx.currentTime)
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.65)
  }, [])

  // Ready chime — 3-note ascending fanfare
  const playReady = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const notes = [523.25, 659.25, 783.99] // C5 E5 G5
    notes.forEach((freq, i) => {
      beep(ctx, freq, 0.25, 0.15, 'triangle', i * 0.14)
    })
    // Sustain the last note slightly longer
    beep(ctx, 1046.5, 0.4, 0.1, 'triangle', 0.52)
  }, [])

  // Camera arc whoosh — airy sweep matching the 3.6s orbit
  const playWhoosh = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const duration = 3.4

    // Noise layer: bandpass sweeping from 2400 Hz → 300 Hz
    const bufSize = ctx.sampleRate * duration
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 1.2
    filter.frequency.setValueAtTime(2400, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + duration)

    const env = ctx.createGain()
    env.gain.setValueAtTime(0, ctx.currentTime)
    env.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3)
    env.gain.setValueAtTime(0.18, ctx.currentTime + duration - 0.6)
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

    src.connect(filter)
    filter.connect(env)
    env.connect(ctx.destination)
    src.start(ctx.currentTime)
    src.stop(ctx.currentTime + duration + 0.05)

    // Subtle pitch tail — low rumble of motion
    const rumble = ctx.createOscillator()
    const rEnv = ctx.createGain()
    rumble.connect(rEnv)
    rEnv.connect(ctx.destination)
    rumble.type = 'sine'
    rumble.frequency.setValueAtTime(80, ctx.currentTime)
    rumble.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + duration)
    rEnv.gain.setValueAtTime(0, ctx.currentTime)
    rEnv.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.5)
    rEnv.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    rumble.start(ctx.currentTime)
    rumble.stop(ctx.currentTime + duration + 0.05)
  }, [])

  // Final zoom-in plunge — reverse whoosh building to an impact
  const playZoomIn = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const duration = 1.5

    // Noise layer: bandpass sweeping from 200 Hz → 3500 Hz (reverse whoosh)
    const bufSize = ctx.sampleRate * duration
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 0.9
    filter.frequency.setValueAtTime(200, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(3500, ctx.currentTime + duration * 0.85)

    const env = ctx.createGain()
    env.gain.setValueAtTime(0.05, ctx.currentTime)
    env.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + duration * 0.85)
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)

    src.connect(filter)
    filter.connect(env)
    env.connect(ctx.destination)
    src.start(ctx.currentTime)
    src.stop(ctx.currentTime + duration + 0.05)

    // Rising tone for the "locking-on" sensation
    const osc = ctx.createOscillator()
    const oEnv = ctx.createGain()
    osc.connect(oEnv)
    oEnv.connect(ctx.destination)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(55, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + duration * 0.8)
    oEnv.gain.setValueAtTime(0.0, ctx.currentTime)
    oEnv.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1)
    oEnv.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration + 0.05)

    // Impact thud at the end
    const thud = ctx.createOscillator()
    const tEnv = ctx.createGain()
    thud.connect(tEnv)
    tEnv.connect(ctx.destination)
    thud.type = 'sine'
    thud.frequency.setValueAtTime(120, ctx.currentTime + duration * 0.82)
    thud.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + duration)
    tEnv.gain.setValueAtTime(0, ctx.currentTime + duration * 0.82)
    tEnv.gain.linearRampToValueAtTime(0.5, ctx.currentTime + duration * 0.84)
    tEnv.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration + 0.1)
    thud.start(ctx.currentTime + duration * 0.82)
    thud.stop(ctx.currentTime + duration + 0.15)
  }, [])

  // Typewriter key click — soft mechanical tap per character
  const playTypeKey = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const bufSize = Math.floor(ctx.sampleRate * 0.025)
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf

    const hiPass = ctx.createBiquadFilter()
    hiPass.type = 'highpass'
    hiPass.frequency.value = 2000

    const env = ctx.createGain()
    env.gain.setValueAtTime(0.055, ctx.currentTime)
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.022)

    src.connect(hiPass)
    hiPass.connect(env)
    env.connect(ctx.destination)
    src.start(ctx.currentTime)
    src.stop(ctx.currentTime + 0.03)
  }, [])

  // Gate: play a sound only once per key (prevents double-fire in StrictMode)
  const once = useCallback((key, fn) => {
    if (playedRef.current.has(key)) return
    playedRef.current.add(key)
    fn()
  }, [])

  return { unlock, playPost, playTick, playProgress, playReady, playWhoosh, playZoomIn, playTypeKey, once }
}
