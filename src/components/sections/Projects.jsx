import { useState } from 'react'

// ── Add your projects here ──────────────────────────────────────────
const PERSONAL = [
  {
    title: 'Old-Computer Portfolio',
    desc: '3D terminal-themed portfolio built with Three.js, React, and GSAP. Features a cinematic camera animation that zooms into a retro CRT monitor.',
    stack: ['React', 'Three.js', 'GSAP', 'Tailwind CSS'],
    year: '2026',
    link: '',
  },

  {
    title: 'Coffee Shop Landing Page',
    desc: 'A Coffee Shop Landing Page using React',
    stack: ['React', 'CSS', 'JavaScript'],
    year: '2025',
    link: '',
  }
]

const SCHOOL = [
  // {
  //   title: 'Project Title',
  //   desc: 'Short description of what the project does.',
  //   stack: ['React', 'Node.js', 'MySQL'],
  //   year: '2024',
  //   link: '',
  // },
]

const FREELANCE = [
  // {
  //   title: 'Client Project',
  //   desc: 'Short description of the work done for the client.',
  //   stack: ['React', 'Node.js'],
  //   year: '2024',
  //   link: '',
  // },
]
// ───────────────────────────────────────────────────────────────────

function Card({ p }) {
  return (
    <div className="border border-[#00ff4120] rounded bg-[#080808] p-4 group hover:border-[#00ff4140] hover:bg-[#0a0f0a] transition-all duration-200">
      <div className="flex justify-between items-start mb-2 gap-2">
        <p className="text-[#00ff41] font-bold text-sm group-hover:glow-sm transition-all">{p.title}</p>
        <span className="text-[#00cc33] text-xs opacity-45 shrink-0">{p.year}</span>
      </div>
      <p className="text-[#00cc33] text-xs leading-relaxed opacity-75 mb-3">{p.desc}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {p.stack.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 bg-[#001800] border border-[#00ff4122] text-[#00ff41] opacity-70 rounded"
          >
            {t}
          </span>
        ))}
      </div>
      {p.link && (
        <a
          href={p.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#6699ff] opacity-55 hover:opacity-90 hover:underline transition-opacity"
        >
          {'>'} view →
        </a>
      )}
    </div>
  )
}

export default function Projects() {
  const [tab, setTab] = useState('personal')
  const list = tab === 'personal' ? PERSONAL : tab === 'school' ? SCHOOL : FREELANCE

  return (
    <div className="p-6 max-w-4xl space-y-5">
      <div>
        <p className="text-xs text-[#ffb000] opacity-60 mb-1">// projects.sys loaded</p>
        <h2 className="font-vt text-4xl text-[#00ff41] glow tracking-widest">PROJECTS</h2>
      </div>

      <p className="text-[#ffb000] text-xs opacity-60">{'>'} ls projects/ --all</p>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {['personal', 'school', 'freelance'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'px-4 py-1.5 text-xs border rounded transition-all duration-150',
              tab === t
                ? 'border-[#00ff41] text-[#00ff41] bg-[#001800] glow-sm'
                : 'border-[#00ff4128] text-[#00ff41] opacity-35 hover:opacity-60',
            ].join(' ')}
          >
            [{t}_projects]
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="border border-[#00ff4118] rounded bg-[#080808] p-8 text-center">
          <p className="text-[#00ff41] opacity-30 text-sm">// No {tab} projects yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((p, i) => (
            <Card key={i} p={p} />
          ))}
        </div>
      )}
    </div>
  )
}
