import { LINES, TOTAL_BLOCKS } from './bootLines'

function ProgressBar({ blocks }) {
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

const cls = (l) => {
  if (l.bright) return 'text-white glow font-vt text-2xl tracking-widest'
  if (l.amber)  return 'text-[#ffb000] glow-amber'
  if (l.blink)  return 'text-[#00ff41] animate-pulse'
  if (l.dim)    return 'text-[#00ff41] opacity-55'
  return 'text-[#00ff41]'
}

/**
 * Presentational only. How far the boot has progressed is decided by the master
 * timeline — this just draws `line` lines and a bar filled to `blocks`, so the
 * text shares a clock with the camera move instead of running its own timers.
 */
export default function BootSequence({ line, blocks, exiting = false, showSkipHint = true }) {
  const visible = LINES.slice(0, line)
  const ready = line >= LINES.length

  return (
    <div
      className={`fixed inset-0 bg-[#050505] flex items-start justify-center z-50 pt-12 sm:pt-16 px-4 sm:px-8 overflow-hidden transition-opacity duration-500 ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-xl">
        {/* Big header */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="font-vt text-4xl sm:text-5xl text-[#00ff41] glow tracking-[0.3em]">TERMINAL</p>
          <p className="font-vt text-base sm:text-xl text-[#ffb000] glow-amber tracking-[0.6em] mt-1">OS v1.0</p>
        </div>

        {/* Boot lines */}
        <div className="space-y-[2px] text-sm font-mono overflow-hidden">
          {visible.map((l, i) =>
            l.progress ? (
              <div key={i} className="leading-relaxed">
                <ProgressBar blocks={blocks} />
              </div>
            ) : (
              <div key={i} className={`leading-relaxed whitespace-pre-wrap break-all ${cls(l)}`}>
                {l.text || ' '}
              </div>
            )
          )}
        </div>

        {ready && <div className="mt-3 text-[#00ff41] text-sm cursor" />}
      </div>

      {showSkipHint && !ready && (
        <p className="absolute bottom-4 right-4 text-[#00ff41] text-xs opacity-60 tracking-wide">
          [ press any key to skip ]
        </p>
      )}
    </div>
  )
}
