import { useState, useEffect } from 'react'
import Navbar from './ui/Navbar'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import { useMuted } from '../hooks/useBootSound'

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const SpeakerOn = () => (
  <svg {...iconProps}>
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
)

const SpeakerOff = () => (
  <svg {...iconProps}>
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="m22 9-6 6" />
    <path d="m16 9 6 6" />
  </svg>
)

const ReplayIcon = () => (
  <svg {...iconProps}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
)

const controlCls =
  'inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-2 text-[#00ff41] ' +
  'opacity-60 hover:opacity-100 hover:bg-[#0d1a0d] transition-opacity duration-150 rounded-sm'

function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return <span>{t.toLocaleTimeString()}</span>
}

const SECTION = { about: About, experience: Experience, projects: Projects, contact: Contact }

export default function Portfolio({ onReplay }) {
  const [active, setActive] = useState('about')
  const [muted, toggleMuted] = useMuted()
  const Section = SECTION[active]

  return (
    <div className="fixed inset-0 flex flex-col text-[#00ff41] font-mono bg-[#050505]">
      {/* ── Title bar ── */}
      <div className="flex items-center justify-between pl-4 pr-1 bg-[#0a0a0a] border-b border-[#00ff4118] shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs opacity-65 glow-sm tracking-widest truncate min-w-0 px-2">
          PORTFOLIO.SYS — [running]
        </span>
        <div className="flex items-center gap-0.5">
          <span className="text-xs opacity-45 hidden sm:inline mr-1">v1.0</span>
          <button
            type="button"
            onClick={toggleMuted}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            title={muted ? 'Sound off' : 'Sound on'}
            className={controlCls}
          >
            {muted ? <SpeakerOff /> : <SpeakerOn />}
          </button>
          <button
            type="button"
            onClick={onReplay}
            aria-label="Replay the intro sequence"
            title="Replay intro"
            className={controlCls}
          >
            <ReplayIcon />
          </button>
        </div>
      </div>

      {/* ── Navigation tabs ── */}
      <Navbar active={active} onNav={(id) => setActive(id)} />

      {/* ── Prompt line ── */}
      <div className="px-4 sm:px-6 py-2 bg-[#070707] border-b border-[#00ff4110] text-xs opacity-50 shrink-0 overflow-hidden whitespace-nowrap">
        <span className="text-[#ffb000]">user@portfolio</span>
        <span className="text-white">:</span>
        <span className="text-[#6699ff]">~/{active}</span>
        <span className="text-white">$ </span>
        <span className="hidden sm:inline">cat README.md</span>
      </div>

      {/* ── Scrollable content ── */}
      <div key={active} className="flex-1 overflow-y-auto overflow-x-hidden animate-fade-in">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-2">
          <Section />
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#0a0a0a] border-t border-[#00ff4118] text-xs opacity-55 shrink-0">
        <span>TERMINAL MODE</span>
        <span className="animate-pulse">●</span>
        <Clock />
      </div>
    </div>
  )
}
