// Add your real work experience entries here
const ENTRIES = [
  {
    title: 'Fullstack Web Developer - Volunteer',
    company: 'ArterionPH',
    period: 'January 2026 - Present',
    desc: 'Contributed to the development of a web application for ArterionPH, called Orion. It is a internal tooling for operations and task management system.',
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL']
  },

  {
    title: 'Freelance Web Developer',
    company: 'Self-Employed',
    period: 'July 2025 - November 2025',
    desc: 'Worked on 1 project each for Glam and Adtalk, developing responsive websites and landing pages to enhance their online presence and drive user engagement.',
    stack: ['HTML', 'CSS', 'JavaScript', 'React']
  }
]

function Entry({ job, index }) {
  return (
    <div className="pl-10 relative">
      <div className="absolute left-[14px] top-4 w-3 h-3 rounded-full border-2 border-[#00ff41] bg-[#050505] shadow-[0_0_6px_#00ff41]" />
      <div className="border border-[#00ff4120] rounded bg-[#080808] p-4 hover:border-[#00ff4135] transition-colors">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-[#00ff41] font-bold glow-sm">{job.title}</p>
            <p className="text-[#ffb000] text-sm opacity-75">@ {job.company}</p>
          </div>
          <span className="text-xs text-[#00cc33] opacity-55 border border-[#00cc3325] px-2 py-0.5 rounded">
            {job.period}
          </span>
        </div>
        <p className="text-[#00cc33] text-sm opacity-75 leading-relaxed mb-3">{job.desc}</p>
        <div className="flex flex-wrap gap-2">
          {job.stack.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 bg-[#001a00] border border-[#00ff4128] text-[#00ff41] rounded"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <p className="text-xs text-[#ffb000] opacity-60 mb-1">// experience.log loaded</p>
        <h2 className="font-vt text-4xl text-[#00ff41] glow tracking-widest">EXPERIENCE</h2>
      </div>

      <p className="text-[#ffb000] text-xs opacity-60">{'>'} cat experience.log</p>

      {ENTRIES.length === 0 ? (
        <div className="border border-[#00ff4118] rounded bg-[#080808] p-8 text-center space-y-2">
          <p className="text-[#00ff41] opacity-35 text-sm">// No entries yet — building experience…</p>
          <p className="text-[#00cc33] opacity-25 text-xs">[STATUS: actively seeking opportunities]</p>
        </div>
      ) : (
        <div className="relative space-y-4">
          {/* Timeline spine */}
          <div className="absolute left-[20px] top-0 bottom-0 w-px bg-[#00ff4118]" />
          {ENTRIES.map((job, i) => (
            <Entry key={i} job={job} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
