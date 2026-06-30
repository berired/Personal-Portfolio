const TABS = [
  { id: 'about',      cmd: './about'      },
  { id: 'experience', cmd: './experience' },
  { id: 'projects',   cmd: './projects'   },
  { id: 'contact',    cmd: './contact'    },
]

export default function Navbar({ active, onNav }) {
  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center bg-[#0a0a0a] border-b border-[#00ff4118] overflow-x-auto scrollbar-none"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNav(tab.id)}
          aria-current={active === tab.id ? 'page' : undefined}
          className={[
            'relative flex-shrink-0 px-4 sm:px-5 py-2.5 min-h-[44px] text-sm font-mono transition-all duration-150',
            'border-r border-[#00ff4118]',
            active === tab.id
              ? 'text-[#00ff41] bg-[#0d1a0d] glow-sm'
              : 'text-[#00ff41] opacity-60 hover:opacity-85 hover:bg-[#0d0d0d]',
          ].join(' ')}
        >
          {tab.cmd}
          {active === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ff41] shadow-[0_0_8px_#00ff41]" />
          )}
        </button>
      ))}
    </nav>
  )
}
