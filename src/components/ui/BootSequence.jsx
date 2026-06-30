import { useEffect, useState, useCallback } from 'react'
import { useBootSound } from '../../hooks/useBootSound'

const TOTAL_BLOCKS = 36
const BAR_MS = 580 // fills in 580ms — finishes before the 'ready' line at t=2600

const LINES = [
  { text: '─────────────────────────────────────────────────', t: 0,    dim: true },
  { text: '  PORTFOLIO BIOS  v2.0    Copyright (C) 2024 DW ', t: 80,   amber: true },
  { text: '─────────────────────────────────────────────────', t: 160,  dim: true },
  { text: '',                                                   t: 280 },
  { text: 'CPU Check  ........... Intel Creative Core™  OK',   t: 380 },
  { text: 'RAM Test   ........... 8192 KB Extended      OK',   t: 680 },
  { text: 'HDD Scan   ........... Projects Found        OK',   t: 980 },
  { text: 'Skills     ........... Loaded Successfully   OK',   t: 1280 },
  { text: '',                                                   t: 1500 },
  { text: 'Initialising  PORTFOLIO.SYS ...',                   t: 1600, amber: true },
  { text: '',                                                   t: 1750 },
  { progress: true,                                             t: 2300 },
  { text: '',                                                   t: 2450 },
  { text: ' PORTFOLIO OS  ready.',                              t: 2600, bright: true },
  { text: '',                                                   t: 2750 },
  { text: ' Press any key or wait…',                           t: 2900, blink: true },
]

function ProgressBar({ onDone }) {
  const [blocks, setBlocks] = useState(0)

  useEffect(() => {
    const step = BAR_MS / TOTAL_BLOCKS
    const id = setInterval(() => {
      setBlocks((b) => {
        const next = b + 1
        if (next >= TOTAL_BLOCKS) {
          clearInterval(id)
          onDone?.()
          return TOTAL_BLOCKS
        }
        return next
      })
    }, step)
    return () => clearInterval(id)
  }, [onDone])

  const pct = Math.round((blocks / TOTAL_BLOCKS) * 100)
  return (
    <span className="text-[#00ff41]">
      {' ['}
      <span className="text-[#00ff41]">{'█'.repeat(blocks)}</span>
      <span className="text-[#00ff41] opacity-20">{'░'.repeat(TOTAL_BLOCKS - blocks)}</span>
      {']  '}{String(pct).padStart(3, ' ')}%
    </span>
  )
}

export default function BootSequence({ onComplete }) {
  const [visible, setVisible] = useState([])
  const [ready, setReady] = useState(false)
  const { unlock, playTick, playProgress, playReady, once } = useBootSound()

  const handleBarDone = useCallback(() => {
    once('progress', playProgress)
  }, [once, playProgress])

  useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => {
        setVisible((p) => [...p, line])
        if (i === LINES.length - 1) {
          setReady(true)
        } else if (line.bright) {
          once('ready', playReady)
        } else if (line.progress) {
          once('progress-start', playProgress)
        } else if (line.text?.trim()) {
          playTick()
        }
      }, line.t)
    )
    return () => timers.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Skip is available the whole time the boot sequence is on screen, not just once 'ready'.
  useEffect(() => {
    const onSkip = () => { unlock(); onComplete?.() }
    window.addEventListener('keydown', onSkip)
    window.addEventListener('click', onSkip)
    return () => {
      window.removeEventListener('keydown', onSkip)
      window.removeEventListener('click', onSkip)
    }
  }, [onComplete, unlock])

  useEffect(() => {
    if (!ready) return
    const auto = setTimeout(() => onComplete?.(), 1800)
    return () => clearTimeout(auto)
  }, [ready, onComplete])

  const cls = (l) => {
    if (l.bright) return 'text-white glow font-vt text-2xl tracking-widest'
    if (l.amber)  return 'text-[#ffb000] glow-amber'
    if (l.blink)  return 'text-[#00ff41] animate-pulse'
    if (l.dim)    return 'text-[#00ff41] opacity-55'
    return 'text-[#00ff41]'
  }

  return (
    <div className="fixed inset-0 bg-[#050505] flex items-start justify-center z-50 pt-12 sm:pt-16 px-4 sm:px-8 overflow-hidden">
      <div className="w-full max-w-xl">
        {/* Big header */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="font-vt text-4xl sm:text-5xl text-[#00ff41] glow tracking-[0.3em]">TERMINAL</p>
          <p className="font-vt text-base sm:text-xl text-[#ffb000] glow-amber tracking-[0.6em] mt-1">OS v1.0</p>
        </div>

        {/* Boot lines */}
        <div className="space-y-[2px] text-sm font-mono overflow-hidden">
          {visible.map((line, i) =>
            line.progress ? (
              <div key={i} className="leading-relaxed">
                <ProgressBar onDone={handleBarDone} />
              </div>
            ) : (
              <div key={i} className={`leading-relaxed whitespace-pre-wrap break-all ${cls(line)}`}>
                {line.text || ' '}
              </div>
            )
          )}
        </div>

        {ready && <div className="mt-3 text-[#00ff41] text-sm cursor" />}
      </div>

      {!ready && (
        <p className="absolute bottom-4 right-4 text-[#00ff41] text-xs opacity-60 tracking-wide">
          [ press any key to skip ]
        </p>
      )}
    </div>
  )
}
