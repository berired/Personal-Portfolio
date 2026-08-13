import { useEffect, useState } from 'react'
import {
  VSCodeGlyph,
  ValorantGlyph,
  SteamGlyph,
  SpotifyGlyph,
  DiscordGlyph,
  ChromeGlyph,
} from './icons'

const DOCK_APPS = [
  { key: 'vscode', Glyph: VSCodeGlyph, label: 'VS Code' },
  { key: 'valorant', Glyph: ValorantGlyph, label: 'Valorant' },
  { key: 'steam', Glyph: SteamGlyph, label: 'Steam' },
  { key: 'spotify', Glyph: SpotifyGlyph, label: 'Spotify' },
  { key: 'discord', Glyph: DiscordGlyph, label: 'Discord' },
  { key: 'chrome', Glyph: ChromeGlyph, label: 'Chrome' },
]

function useClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function Taskbar({ apps, windows, onToggleApp, trayControls }) {
  const t = useClock()
  const time = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const date = t.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex items-center gap-1 sm:gap-2 h-14 px-2 sm:px-3 bg-[#0a0a0a] border-t border-[#00ff4118] shrink-0 font-mono">
      {/* ── Decorative dock icons (aesthetic only) ── */}
      <div className="hidden sm:flex items-center gap-1 pr-2 sm:pr-3 border-r border-[#00ff4118]">
        {DOCK_APPS.map(({ key, Glyph, label }) => (
          <span
            key={key}
            title={label}
            aria-hidden="true"
            className="flex items-center justify-center w-9 h-9 rounded-md cursor-default opacity-90 hover:opacity-100 hover:bg-[#0d1a0d] transition-colors duration-150"
          >
            <Glyph />
          </span>
        ))}
      </div>

      {/* ── Open-window entries ── */}
      <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-none">
        {apps.map((app) => {
          const w = windows[app.id]
          if (!w?.open) return null
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => onToggleApp(app.id)}
              className={[
                'flex items-center gap-1.5 px-2 sm:px-3 h-9 border text-xs shrink-0 transition-colors duration-150',
                w.active && !w.minimized
                  ? 'bg-[#0d1a0d] border-[#00ff4160] text-[#00ff41] glow-sm'
                  : 'bg-[#050505] border-[#00ff4120] text-[#00ff41] opacity-70 hover:opacity-100',
              ].join(' ')}
            >
              <app.Icon width={13} height={13} />
              <span className="hidden sm:inline">{app.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── System tray ── */}
      <div className="flex items-center gap-0.5 shrink-0">
        {trayControls}
        <div className="ml-1 sm:ml-2 pl-2 sm:pl-3 border-l border-[#00ff4118] text-right leading-tight">
          <div className="text-xs sm:text-sm text-[#00ff41] glow-sm tabular-nums">{time}</div>
          <div className="text-[9px] sm:text-[10px] opacity-55 tabular-nums">{date}</div>
        </div>
      </div>
    </div>
  )
}
