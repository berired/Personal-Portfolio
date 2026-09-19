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
    link: 'https://studyterm.vercel.app/',
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
    link: 'https://github.com/berired/Discord-Calendar-Bot',
  },
  {
    title: 'Coffee Shop Landing Page',
    desc: 'A Coffee Shop Landing Page using React.',
    stack: ['React', 'HTML', 'CSS'],
    year: '2025',
    link: 'https://github.com/berired/Coffee-Shop-Landing',
  },
  {
    title: 'Pulse',
    desc: 'Pulse is a full-stack web application designed specifically for nursing students and clinical educators.',
    stack: ['React', 'Node.js', 'Express', 'Supabase'],
    year: '2026',
    link: 'https://github.com/berired/Pulse'
  },
  {
    title: 'Ani-Track',
    desc: 'A Letterboxd-style anime tracker: log episodes with half-star ratings and watch dates, write reviews, build lists, and follow friends.',
    stack: ['Next.js', 'TypeScript', 'Supabase'],
    year: '2026',
    link: 'https://github.com/berired/Ani-Track',
  },
  {
    title: 'Flippr Flashcards',
    desc: 'A flashcard app for studying with spaced repetition.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    year: '2026',
    link: 'https://github.com/berired/flippr-flashcards',
  },
  {
    title: 'Lanesplit',
    desc: 'A fantasy draft app for League of Legends — build your league, draft your roster.',
    stack: ['Next.js', 'TypeScript', 'Prisma'],
    year: '2026',
    link: 'https://github.com/berired/lanesplit',
  },
  {
    title: 'Fishbowl Photobooth',
    desc: 'A kiosk-style photobooth web app: pick a package and frame, take a burst of webcam photos, and the composited image is sent into a new Canva design via the Canva Connect API.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand'],
    year: '2026',
    link: 'https://github.com/berired/fishbowl-photobooth',
  },
  {
    title: 'Stock Market API',
    desc: 'A data science-driven API for stock market data.',
    stack: ['Python'],
    year: '2025',
    link: 'https://github.com/berired/stockmarketapi',
  },
  {
    title: 'Discord Repo Notifier',
    desc: 'A Discord bot that sends real-time notifications to a server whenever commits are pushed to a GitHub repository.',
    stack: ['Python', 'Discord.py'],
    year: '2026',
    link: 'https://github.com/berired/discord-repo-notifier',
  },
  {
    title: 'SmartFinance',
    desc: 'SmartFinance: a personalized financial advisor.',
    stack: ['Python', 'JavaScript'],
    year: '2025',
    link: 'https://github.com/berired/SmartFinance',
  },
  {
    title: 'UnMasked',
    desc: 'A full-stack productivity, wellness, and habit-tracking app built for the Hackers-1 Hackathon — mood and daily log tracking, journaling, planning, reminders, and streaks.',
    stack: ['React', 'JavaScript'],
    year: '2026',
    link: 'https://github.com/berired/UnMasked',
  },
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
    link: 'https://github.com/berired/Web-Programming-Midterms',
  },
  {
    title: 'KamunEats',
    desc: 'A restaurant locator website for STS Finals Project.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    year: '2024',
    link: 'https://github.com/berired/KamunEats',
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
    link: 'https://github.com/berired/panitikan_finals',
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
  },
  {
    title: 'Thesis Repository',
    desc: 'Ongoing thesis web application and documentation.',
    stack: ['Next.js', 'TypeScript'],
    year: '2026',
    link: 'https://github.com/berired/Thesis-Repository',
  },
  {
    title: 'Automata Finals',
    desc: 'Automata Theory Finals project: a credit card transaction validator.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    year: '2025',
    link: 'https://github.com/berired/Automata-Finals',
  },
  {
    title: 'DormieTorium',
    desc: 'A dorm/roommate finder platform for CIITzens. Finals startup project for Technopreneurship.',
    stack: ['JavaScript', 'HTML', 'CSS'],
    year: '2026',
    link: 'https://github.com/berired/DormieTorium',
  },
  {
    title: 'Laravel Login System',
    desc: 'Dynamic Web Programming Activity 5: a login system built with Laravel.',
    stack: ['PHP', 'Blade'],
    year: '2026',
    link: 'https://github.com/berired/Laboratory-Activity-Build-a-Laravel-Login-System',
  },
  {
    title: 'Dynamic Web Midterms',
    desc: 'Midterm laboratory examination for Dynamic Web Programming.',
    stack: ['Next.js', 'TypeScript'],
    year: '2026',
    link: 'https://github.com/berired/dynamic-web-midterms',
  },
  {
    title: 'Advance Routing Lab',
    desc: 'A lab exercise on advanced routing.',
    stack: ['Next.js', 'TypeScript'],
    year: '2026',
    link: 'https://github.com/berired/lab-exerice-advance-routing',
  },
  {
    title: 'CS Elective Laboratory 1',
    desc: 'A laboratory exercise for a CS elective course.',
    stack: ['Next.js', 'TypeScript'],
    year: '2026',
    link: 'https://github.com/berired/CS-ELEC-Laboratory-1',
  },
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

const CATEGORIES = [
  { key: 'personal', items: PERSONAL },
  { key: 'school', items: SCHOOL },
  { key: 'freelance', items: FREELANCE },
]

function slug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '')
}

function extFor(stack) {
  const s = stack.join(' ').toLowerCase()
  if (s.includes('typescript')) return 'tsx'
  if (s.includes('react') || s.includes('next')) return 'jsx'
  if (s.includes('python')) return 'py'
  if (s.includes('php')) return 'php'
  if (s.includes('node') || s.includes('express')) return 'js'
  if (s.includes('javascript')) return 'js'
  if (s.includes('html')) return 'html'
  return 'txt'
}

export default function Projects() {
  const [openFolders, setOpenFolders] = useState({ personal: true, school: false, freelance: false })
  const [selected, setSelected] = useState({ cat: 'personal', index: 0 })

  const toggleFolder = (key) => setOpenFolders((o) => ({ ...o, [key]: !o[key] }))

  const selectedCat = CATEGORIES.find((c) => c.key === selected.cat)
  const selectedProject = selectedCat ? selectedCat.items[selected.index] : null

  return (
    <div className="space-y-5 py-6">
      <div>
        <p className="text-xs text-[#ffb000] opacity-60 mb-1">// projects.sys loaded</p>
        <h2 className="font-vt text-4xl text-[#00ff41] glow tracking-widest">PROJECTS</h2>
      </div>

      <p className="text-[#ffb000] text-xs opacity-60">{'>'} tree projects/ -L 2</p>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* File tree */}
        <div className="border border-[#00ff4120] rounded bg-[#080808] overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-[#00ff4115] text-xs text-[#ffb000] opacity-70 shrink-0">
            projects/
          </div>
          <div className="p-2 max-h-[360px] lg:max-h-[560px] overflow-y-auto">
            {CATEGORIES.map((cat) => (
              <div key={cat.key} className="mb-0.5">
                <button
                  type="button"
                  onClick={() => toggleFolder(cat.key)}
                  aria-expanded={openFolders[cat.key]}
                  className="w-full flex items-center gap-1.5 px-2 min-h-[36px] text-xs text-[#00ff41] hover:bg-[#001800] rounded transition-colors"
                >
                  <span className="opacity-50 w-3 shrink-0">{openFolders[cat.key] ? '▾' : '▸'}</span>
                  <span className="opacity-90">{cat.key}/</span>
                  <span className="ml-auto opacity-30">{cat.items.length}</span>
                </button>

                {openFolders[cat.key] && (
                  cat.items.length === 0 ? (
                    <p className="ml-6 pl-2 py-1 text-xs text-[#00ff41] opacity-25 border-l border-[#00ff4115]">
                      // empty
                    </p>
                  ) : (
                    <div className="ml-3 border-l border-[#00ff4115] pl-1">
                      {cat.items.map((p, i) => {
                        const isSelected = selected.cat === cat.key && selected.index === i
                        return (
                          <button
                            key={p.title}
                            type="button"
                            onClick={() => setSelected({ cat: cat.key, index: i })}
                            aria-current={isSelected}
                            className={[
                              'w-full flex items-center gap-1.5 pl-2 pr-2 min-h-[34px] text-xs rounded transition-colors text-left',
                              isSelected
                                ? 'bg-[#001800] text-[#00ff41] border-l-2 border-[#00ff41] -ml-[1px] pl-[7px] glow-sm'
                                : 'text-[#00cc33] opacity-70 hover:opacity-100 hover:bg-[#0a0f0a]',
                            ].join(' ')}
                          >
                            <span className="opacity-50 shrink-0">▸</span>
                            <span className="truncate">{slug(p.title)}.{extFor(p.stack)}</span>
                          </button>
                        )
                      })}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview pane */}
        <div className="border border-[#00ff4120] rounded bg-[#080808] overflow-hidden flex flex-col min-h-[320px]">
          {selectedProject ? (
            <>
              {/* Tab bar */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[#00ff4115] bg-[#0a0f0a] shrink-0">
                <span className="text-xs text-[#00ff41] opacity-90 glow-sm">
                  {slug(selectedProject.title)}.{extFor(selectedProject.stack)}
                </span>
                <span className="text-xs text-[#00ff41] opacity-30 ml-auto shrink-0">{selectedProject.year}</span>
              </div>

              {selectedProject.img && (
                <div className="w-full h-40 sm:h-48 overflow-hidden border-b border-[#00ff4115] shrink-0">
                  <img
                    src={selectedProject.img}
                    alt={selectedProject.title}
                    onError={(e) => { e.currentTarget.parentElement.style.display = 'none' }}
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <p className="text-[#00ff41] font-bold text-base mb-2 glow-sm">{selectedProject.title}</p>
                <p className="text-[#00cc33] text-sm leading-relaxed opacity-80 mb-4">{selectedProject.desc}</p>

                <p className="text-[#ffb000] text-xs mb-2 opacity-60">{'>'} cat stack.json</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selectedProject.stack.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 bg-[#001800] border border-[#00ff4122] text-[#00ff41] opacity-70 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {selectedProject.link && selectedProject.link !== '#' && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-[#6699ff] opacity-70 hover:opacity-100 hover:underline transition-opacity mt-auto"
                  >
                    {'>'} open {selectedProject.link.replace(/^https?:\/\//, '')} →
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-[#00ff41] opacity-30 text-sm">// select a file to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
