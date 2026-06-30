import { useState, useEffect } from 'react'
import Navbar from './ui/Navbar'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return <span>{t.toLocaleTimeString()}</span>
}

const SECTION = { about: About, experience: Experience, projects: Projects, contact: Contact }

export default function Portfolio() {
  const [active, setActive] = useState('about')
  const Section = SECTION[active]

  return (
    <div className="fixed inset-0 flex flex-col text-[#00ff41] font-mono">
      {/* ── Title bar ── */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0a0a0a] border-b border-[#00ff4118] shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs opacity-65 glow-sm tracking-widest">
          PORTFOLIO.SYS — [running]
        </span>
        <span className="text-xs opacity-45">v1.0</span>
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
