import { useEffect, useState } from 'react'
import { useBootSound } from '../../hooks/useBootSound'

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
  { text: ' [████████████████████████████████████]  100%',     t: 2300 },
  { text: '',                                                   t: 2450 },
  { text: ' PORTFOLIO OS  ready.',                              t: 2600, bright: true },
  { text: '',                                                   t: 2750 },
  { text: ' Press any key or wait…',                           t: 2900, blink: true },
]

export default function BootSequence({ onComplete }) {
  const [visible, setVisible] = useState([])
  const [ready, setReady] = useState(false)
  const { unlock, playTick, playProgress, playReady, once } = useBootSound()

  useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => {
        setVisible((p) => [...p, line])
        if (i === LINES.length - 1) {
          setReady(true)
        } else if (line.bright) {
          once('ready', playReady)
        } else if (line.text.includes('█')) {
          once('progress', playProgress)
        } else if (line.text.trim()) {
          playTick()
        }
      }, line.t)
    )
    return () => timers.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ready) return
    const auto = setTimeout(() => onComplete?.(), 1800)
    const onKey = () => { unlock(); onComplete?.() }
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onKey)
    return () => {
      clearTimeout(auto)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onKey)
    }
  }, [ready, onComplete, unlock])

  const cls = (l) => {
    if (l.bright) return 'text-white glow font-vt text-2xl tracking-widest'
    if (l.amber)  return 'text-[#ffb000] glow-amber'
    if (l.blink)  return 'text-[#00ff41] animate-pulse'
    if (l.dim)    return 'text-[#00ff41] opacity-30'
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
          {visible.map((line, i) => (
            <div key={i} className={`leading-relaxed whitespace-pre-wrap break-all ${cls(line)}`}>
              {line.text || ' '}
            </div>
          ))}
        </div>

        {ready && <div className="mt-3 text-[#00ff41] text-sm cursor" />}
      </div>
    </div>
  )
}
