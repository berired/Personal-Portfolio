import { useState } from 'react'

// ── Add your projects here ──────────────────────────────────────────
const PERSONAL = [
  {
    title: 'Old-Computer Portfolio',
    desc: '3D terminal-themed portfolio built with Three.js, React, and GSAP. Features a cinematic camera animation that zooms into a retro CRT monitor.',
    stack: ['React', 'Three.js', 'GSAP', 'Tailwind CSS'],
    year: '2026',
    link: 'https://github.com/berired/Personal-Portfolio',
  },
  {
    title: 'Pomodoro Application',
    desc: 'A Pomodoro timer application to boost productivity using timed work and break intervals.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    year: '2025',
    link: 'https://github.com/berired/Pomodoro-Application',
  },
  {
    title: 'CatModoro',
    desc: 'A Pomodoro timer app with cat theme. Features customizable timer, calendar & to-dos, heatmap, customizable themes, and Spotify integration.',
    stack: ['React', 'JavaScript', 'CSS', 'Firebase'],
    year: '2024',
    link: 'https://catmodoro.vercel.app/',
  },
  {
    title: 'Discord Calendar Bot',
    desc: 'A calendar bot for Discord using Python.',
    stack: ['Python'],
    year: '2026',
    link: 'https://github.com/berired',
  },
  {
    title: 'Coffee Shop Landing Page',
    desc: 'A Coffee Shop Landing Page using React.',
    stack: ['React', 'HTML', 'CSS'],
    year: '2025',
    link: 'https://github.com/berired',
  },
  {
    title: 'Pulse',
    desc: 'Pulse is a full-stack web application designed specifically for nursing students and clinical educators.',
    stack: ['React', 'Node.js', 'Express', 'Supabase'],
    year: '2026',
    link: 'https://github.com/berired/Pulse'
  }
]

const SCHOOL = [
  {
    title: "David's Dream Car Garage",
    desc: 'Web Design Scripting Finals project.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    year: '2023',
    link: 'https://github.com/berired/Web-Des-Scripting-Finals-David-s-Dream-Car-Garage',
  },
  {
    title: 'Product Catalog',
    desc: 'Multi-page Product Catalog for Web Programming Midterms.',
    stack: ['React', 'JavaScript', 'CSS'],
    year: '2024',
    link: 'https://github.com/berired',
  },
  {
    title: 'KamunEats',
    desc: 'A restaurant locator website for STS Finals Project.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    year: '2024',
    link: 'https://github.com/berired',
  },
  {
    title: 'Hibla ng Kasaysayan',
    desc: 'A historical website for RPH Finals Project.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    year: '2024',
    link: 'https://github.com/berired',
  },
  {
    title: 'Tahanan ng mga Kwento',
    desc: "A children's book repository website for Panitikan Finals Project.",
    stack: ['React', 'JavaScript', 'CSS'],
    year: '2025',
    link: 'https://tahananngmgakwento.vercel.app/',
  },
  {
    title: 'Operating Systems - Finals Project',
    desc: 'A parking space car detector using Python and OpenCV. Is made in fulfill the requirements for the Operating Systems course.',
    stack: ['Python', 'OpenCV'],
    year: '2026',
    link: 'https://github.com/berired/Operating-Systems---Finals-Car-Parking-Detection',
  },
  {
    title: 'CIIT Marketplace',
    desc: 'A marketplace website for the CIIT community. It is made in fulfill the requirements for the Software Engineering 2 course.',
    stack: ['React', 'Node.js', 'Express', 'Firebase'],
    year: '2026',
    link: 'https://github.com/berired/CIIT-Marketplace'
  },
  {
    title: 'Atelier',
    desc: 'A e-commerce website. It is made in fulfillment of the requirements for Dynamic Web Programming Finals.',
    stack: ['PHP','Blade', 'SQLite'],
    year: '2026',
    link: 'https://github.com/berired/Atelier'
  },
  {
    title: 'Web Programming Finals Project',
    desc: 'This project is a full-stack web application developed as a finals requirement for Web Programming. It focuses on loan approval prediction using Philippine loan data.',
    stack: ['JavaScript', 'CSS', 'React', 'Python'],
    year: '2026',
    link: 'https://github.com/berired/Web-Programming-Finals'
  }
]

const FREELANCE = [
  {
    title: 'AdTalk Event Solution Inc.',
    desc: 'A landing page for a freelance client.',
    stack: ['React', 'JavaScript', 'CSS'],
    year: '2024',
    link: 'https://adtalk.com.ph/',
  },
  {
    title: 'Glam Innovative Advertising',
    desc: 'A landing page for a freelance client.',
    stack: ['React', 'JavaScript', 'CSS'],
    year: '2025',
    link: 'https://glam-landing.vercel.app/',
  },
]
// ───────────────────────────────────────────────────────────────────

function Card({ p }) {
  return (
    <div className="border border-[#00ff4120] rounded bg-[#080808] group hover:border-[#00ff4140] hover:bg-[#0a0f0a] transition-all duration-200 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      {p.img && (
        <div className="w-full h-36 overflow-hidden border-b border-[#00ff4115]">
          <img
            src={p.img}
            alt={p.title}
            onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-200"
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
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
        {p.link && p.link !== '#' && (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#6699ff] opacity-55 hover:opacity-90 hover:underline transition-opacity mt-auto"
          >
            {'>'} view →
          </a>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const [tab, setTab] = useState('personal')
  const list = tab === 'personal' ? PERSONAL : tab === 'school' ? SCHOOL : FREELANCE

  return (
    <div className="space-y-5 py-6">
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
