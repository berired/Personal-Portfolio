import { useRef, useCallback, useState, useEffect } from 'react'

const MUTE_KEY = 'portfolio-muted'

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!window.__bootAudioCtx) {
    window.__bootAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return window.__bootAudioCtx
}

export function readMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

// Every generator connects here instead of straight to the destination, so a
// single gain stage silences all eight of them rather than each one needing to
// check a flag.
let masterGain = null
function getOut(ctx) {
  if (!masterGain || masterGain.context !== ctx) {
    masterGain = ctx.createGain()
    masterGain.gain.value = readMuted() ? 0 : 1
    masterGain.connect(ctx.destination)
  }
  return masterGain
}

const muteListeners = new Set()

export function setMuted(muted) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  } catch {
    /* ignore — the toggle still works for this session */
  }
  if (masterGain) masterGain.gain.value = muted ? 0 : 1
  muteListeners.forEach((fn) => fn(muted))
}

/** Subscribe a component to the shared mute state. */
export function useMuted() {
  const [muted, setLocal] = useState(readMuted)
  useEffect(() => {
    muteListeners.add(setLocal)
    return () => muteListeners.delete(setLocal)
  }, [])
  const toggle = useCallback(() => setMuted(!readMuted()), [])
  return [muted, toggle]
}

function beep(ctx, freq, duration, gain = 0.18, type = 'square', startTime = 0) {
  const osc = ctx.createOscillator()
  const env = ctx.createGain()
  osc.connect(env)
  env.connect(getOut(ctx))
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
  env.connect(getOut(ctx))
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
    env.connect(getOut(ctx))
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

  // Power-up: a CRT/PC coming online — a brief low thunk, a degaussing buzz
  // that sweeps and settles, and a hum that rises and holds — rather than a
  // cinematic whoosh scoring the camera move. Duration is passed in by the
  // rig so it always matches the length of the move it scores.
  const playPowerUp = useCallback((seconds = 0.9) => {
    const ctx = getCtx()
    if (!ctx) return
    const duration = seconds
    const t0 = ctx.currentTime

    // Thunk — the relay-click moment of switching on.
    const thunk = ctx.createOscillator()
    const thunkEnv = ctx.createGain()
    thunk.connect(thunkEnv)
    thunkEnv.connect(getOut(ctx))
    thunk.type = 'sine'
    thunk.frequency.setValueAtTime(90, t0)
    thunk.frequency.exponentialRampToValueAtTime(45, t0 + 0.09)
    thunkEnv.gain.setValueAtTime(0.3, t0)
    thunkEnv.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1)
    thunk.start(t0)
    thunk.stop(t0 + 0.12)

    // Degauss buzz — filtered noise sweeping down and fading, the coil-whine
    // beat of a CRT clearing itself on power-on.
    const buzzDur = Math.min(duration * 0.7, 0.55)
    const bufSize = Math.max(1, Math.floor(ctx.sampleRate * buzzDur))
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 3
    filter.frequency.setValueAtTime(220, t0 + 0.02)
    filter.frequency.exponentialRampToValueAtTime(70, t0 + buzzDur)
    const buzzEnv = ctx.createGain()
    buzzEnv.gain.setValueAtTime(0, t0)
    buzzEnv.gain.linearRampToValueAtTime(0.16, t0 + 0.06)
    buzzEnv.gain.exponentialRampToValueAtTime(0.0001, t0 + buzzDur)
    src.connect(filter)
    filter.connect(buzzEnv)
    buzzEnv.connect(getOut(ctx))
    src.start(t0 + 0.02)
    src.stop(t0 + buzzDur + 0.05)

    // Power hum — rises in and holds through the rest of the move, the
    // "systems now running" tone.
    const hum = ctx.createOscillator()
    const hum2 = ctx.createOscillator()
    const humEnv = ctx.createGain()
    hum.connect(humEnv)
    hum2.connect(humEnv)
    humEnv.connect(getOut(ctx))
    hum.type = 'sine'
    hum2.type = 'sine'
    hum.frequency.value = 60
    hum2.frequency.value = 120.5 // slightly detuned octave for an electrical beat
    humEnv.gain.setValueAtTime(0, t0)
    humEnv.gain.linearRampToValueAtTime(0.05, t0 + duration * 0.5)
    humEnv.gain.setValueAtTime(0.05, t0 + duration - 0.15)
    humEnv.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
    hum.start(t0)
    hum2.start(t0)
    hum.stop(t0 + duration + 0.05)
    hum2.stop(t0 + duration + 0.05)
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
    env.connect(getOut(ctx))
    src.start(ctx.currentTime)
    src.stop(ctx.currentTime + 0.03)
  }, [])

  // Gate: play a sound only once per key (prevents double-fire in StrictMode)
  const once = useCallback((key, fn) => {
    if (playedRef.current.has(key)) return
    playedRef.current.add(key)
    fn()
  }, [])

  return { unlock, playPost, playTick, playProgress, playReady, playPowerUp, playTypeKey, once }
}

// Ambient office bed: a faint fan hum, a hushed room hiss, and sparse
// distant-murmur bursts standing in for muffled conversation. One shared
// instance rather than a hook — it needs to keep running across whatever
// component tree is mounted for free-look, not tied to one component's
// lifetime, and starting it twice would double every layer.
let ambience = null

export function startOfficeAmbience() {
  const ctx = getCtx()
  if (!ctx || ambience) return
  ctx.resume()

  const bed = ctx.createGain()
  bed.gain.setValueAtTime(0, ctx.currentTime)
  bed.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.2)
  bed.connect(getOut(ctx))

  // Fan hum — two detuned low tones with a slow tremolo, the whir of a PC
  // or HVAC running somewhere in the room.
  const fan1 = ctx.createOscillator()
  fan1.type = 'triangle'
  fan1.frequency.value = 84
  const fan2 = ctx.createOscillator()
  fan2.type = 'sine'
  fan2.frequency.value = 121
  const fanGain = ctx.createGain()
  fanGain.gain.value = 0.5
  const tremolo = ctx.createOscillator()
  tremolo.frequency.value = 0.55
  const tremoloGain = ctx.createGain()
  tremoloGain.gain.value = 0.12
  tremolo.connect(tremoloGain)
  tremoloGain.connect(fanGain.gain)
  fan1.connect(fanGain)
  fan2.connect(fanGain)
  fanGain.connect(bed)

  // Room hiss — broadband noise, heavily low-passed so it reads as hushed
  // air rather than static.
  const hissBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const hissData = hissBuf.getChannelData(0)
  for (let i = 0; i < hissData.length; i++) hissData[i] = Math.random() * 2 - 1
  const hiss = ctx.createBufferSource()
  hiss.buffer = hissBuf
  hiss.loop = true
  const hissFilter = ctx.createBiquadFilter()
  hissFilter.type = 'lowpass'
  hissFilter.frequency.value = 850
  const hissGain = ctx.createGain()
  hissGain.gain.value = 0.22
  hiss.connect(hissFilter)
  hissFilter.connect(hissGain)
  hissGain.connect(bed)

  fan1.start()
  fan2.start()
  tremolo.start()
  hiss.start()

  // Distant murmur — sparse, randomly-timed bandpassed noise bursts in a
  // vocal-formant range. Vague on purpose: an impression of people talking
  // two cubicles over, never intelligible.
  const murmurGain = ctx.createGain()
  murmurGain.gain.value = 0.4
  murmurGain.connect(bed)
  let murmurTimer = null
  const scheduleMurmur = () => {
    const c = getCtx()
    if (!c) return
    const dur = 0.4 + Math.random() * 0.9
    const size = Math.max(1, Math.floor(c.sampleRate * dur))
    const buf = c.createBuffer(1, size, c.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1
    const src = c.createBufferSource()
    src.buffer = buf
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 280 + Math.random() * 500
    bp.Q.value = 1.4
    const env = c.createGain()
    env.gain.setValueAtTime(0, c.currentTime)
    env.gain.linearRampToValueAtTime(0.06 + Math.random() * 0.05, c.currentTime + 0.12)
    env.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
    src.connect(bp)
    bp.connect(env)
    env.connect(murmurGain)
    src.start()
    src.stop(c.currentTime + dur + 0.05)
    murmurTimer = setTimeout(scheduleMurmur, 1800 + Math.random() * 4200)
  }
  scheduleMurmur()

  ambience = { bed, fan1, fan2, tremolo, hiss, getMurmurTimer: () => murmurTimer }
}

export function stopOfficeAmbience() {
  if (!ambience) return
  const { bed, fan1, fan2, tremolo, hiss } = ambience
  const ctx = getCtx()
  clearTimeout(ambience.getMurmurTimer())
  if (ctx) {
    const now = ctx.currentTime
    bed.gain.cancelScheduledValues(now)
    bed.gain.setValueAtTime(bed.gain.value, now)
    bed.gain.linearRampToValueAtTime(0, now + 0.5)
  }
  setTimeout(() => {
    try {
      fan1.stop()
      fan2.stop()
      tremolo.stop()
      hiss.stop()
    } catch {
      /* already stopped */
    }
  }, 600)
  ambience = null
}

// CRT monitor hum for the desktop UI: an almost-subliminal 60Hz mains buzz
// with the faintest trace of flyback-transformer whine riding on top.
// Mixed well under the noise floor — background presence, not a texture
// anyone should consciously notice.
let crtHum = null

export function startCrtHum() {
  const ctx = getCtx()
  if (!ctx || crtHum) return
  ctx.resume()

  const bed = ctx.createGain()
  bed.gain.setValueAtTime(0, ctx.currentTime)
  bed.gain.linearRampToValueAtTime(0.0005, ctx.currentTime + 1.5)
  bed.connect(getOut(ctx))

  // Mains hum — two detuned low tones, the classic 60Hz + octave beat of a
  // transformer under load. Carries almost all of the level.
  const hum1 = ctx.createOscillator()
  hum1.type = 'sine'
  hum1.frequency.value = 60
  const hum2 = ctx.createOscillator()
  hum2.type = 'sine'
  hum2.frequency.value = 120.6
  const humGain = ctx.createGain()
  humGain.gain.value = 0.6
  hum1.connect(humGain)
  hum2.connect(humGain)
  humGain.connect(bed)

  // Flyback whine — a thin, high-pitched tone from the horizontal deflection
  // coil, with a very slow wobble so it doesn't sit dead-still. Kept far
  // quieter than the low buzz — a trace, not a second voice.
  const whine = ctx.createOscillator()
  whine.type = 'sine'
  whine.frequency.value = 15734
  const wobble = ctx.createOscillator()
  wobble.frequency.value = 0.13
  const wobbleGain = ctx.createGain()
  wobbleGain.gain.value = 12
  wobble.connect(wobbleGain)
  wobbleGain.connect(whine.frequency)
  const whineGain = ctx.createGain()
  whineGain.gain.value = 0.08
  whine.connect(whineGain)
  whineGain.connect(bed)

  hum1.start()
  hum2.start()
  whine.start()
  wobble.start()

  crtHum = { bed, hum1, hum2, whine, wobble }
}

export function stopCrtHum() {
  if (!crtHum) return
  const { bed, hum1, hum2, whine, wobble } = crtHum
  const ctx = getCtx()
  if (ctx) {
    const now = ctx.currentTime
    bed.gain.cancelScheduledValues(now)
    bed.gain.setValueAtTime(bed.gain.value, now)
    bed.gain.linearRampToValueAtTime(0, now + 0.4)
  }
  setTimeout(() => {
    try {
      hum1.stop()
      hum2.stop()
      whine.stop()
      wobble.stop()
    } catch {
      /* already stopped */
    }
  }, 500)
  crtHum = null
}
