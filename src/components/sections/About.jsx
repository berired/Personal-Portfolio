import TypeWriter from '../ui/TypeWriter'

const SKILLS = [
  { cat: 'Frontend',  items: ['React', 'JavaScript', 'HTML / CSS', 'Three.js', 'GSAP', 'Next.js'] },
  { cat: 'Backend',   items: ['Node.js', 'Express', 'Python', 'REST APIs'] },
  { cat: 'Database',  items: ['MySQL', 'MongoDB', 'Firebase', 'PostgreSQL', 'Supabase'] },
  { cat: 'Tools',     items: ['Git', 'VS Code', 'Figma', 'Claude Code', 'Gemini'] },
  { cat: 'Learning',  items: ['Three.js', 'WebGL', 'GSAP'] },
]

const INFO = [
  ['location',   'Philippines'],
  ['education',  'CIIT College of Arts and Technology'],
  ['email',      'davidxanderwagan@gmail.com'],
  ['status',     'Open to opportunities'],
  ['interests',  'Web Dev · Movies · Gaming · Sports · Music']
]

export default function About() {
  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-[#ffb000] opacity-60 mb-1">// about.md loaded</p>
        <h1 className="font-vt text-3xl sm:text-5xl text-[#00ff41] glow tracking-widest leading-none">
          DAVID XANDER WAGAN
        </h1>
        <p className="text-[#00cc33] text-sm mt-1 opacity-75">
          Full Stack Developer &amp; CS Student
        </p>
      </div>

      {/* whoami */}
      <div className="border border-[#00ff4120] rounded bg-[#080808] p-4">
        <p className="text-[#ffb000] text-xs mb-3 opacity-60">{'>'} whoami</p>
        <TypeWriter
          className="text-sm text-[#00ff41] opacity-85 leading-relaxed"
          text={"I'm a Bachelor of Science in Computer Science student with a strong interest in web development, machine learning, and python automation. I enjoy working on the logic behind applications—building systems that are efficient, scalable, and meaningful.\n\nOutside of technical work, I enjoy taking on leadership roles in school and student organizations, collaborating with others, and helping projects move forward as a team.\n\nI'm also deeply curious by nature and genuinely enjoy learning new technologies and tech stacks."}
        />
      </div>

      {/* Skills grid */}
      <div>
        <p className="text-[#ffb000] text-xs mb-3 opacity-60">{'>'} ls -la skills/</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SKILLS.map(({ cat, items }) => (
            <div key={cat} className="border border-[#00ff4118] rounded bg-[#080808] p-3">
              <p className="text-[#ffb000] text-xs mb-2 opacity-75">[{cat}]</p>
              {items.map((s) => (
                <p key={s} className="text-[#00cc33] text-xs leading-relaxed">
                  ├─ {s}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Info card */}
      <div className="border border-[#00ff4120] rounded bg-[#080808] p-4">
        <p className="text-[#ffb000] text-xs mb-3 opacity-60">{'>'} cat info.txt</p>
        <div className="space-y-1.5 text-sm">
          {INFO.map(([k, v]) => (
            <div key={k} className="flex gap-4">
              <span className="text-[#ffb000] opacity-65 w-24 shrink-0">{k}:</span>
              <span className="text-[#00ff41] opacity-85">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
