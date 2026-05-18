const LINKS = [
  { label: 'email',    val: 'davidxanderwagan@gmail.com',        href: 'mailto:davidxanderwagan@gmail.com' },
  { label: 'github',   val: 'github.com/berired',                href: 'https://github.com/berired' },
  { label: 'linkedin', val: 'linkedin.com/in/davidxanderwagan',  href: 'https://www.linkedin.com/in/david-xander-wagan-b78624389/' },
]

export default function Contact() {
  return (
    <div className="space-y-6 py-6 max-w-xl">
      <div>
        <p className="text-xs text-[#ffb000] opacity-60 mb-1">// contact.sys loaded</p>
        <h2 className="font-vt text-4xl text-[#00ff41] glow tracking-widest">CONTACT</h2>
      </div>

      <div className="border border-[#00ff4120] rounded bg-[#080808] p-4">
        <p className="text-[#ffb000] text-xs mb-3 opacity-60">{'>'} cat links.txt</p>
        <div className="space-y-2">
          {LINKS.map(({ label, val, href }) => (
            <div key={label} className="flex gap-4 items-center text-sm">
              <span className="text-[#ffb000] opacity-65 w-16">{label}:</span>
              <a
                href={href}
                className="text-[#00ff41] opacity-75 hover:opacity-100 hover:glow-sm transition-all"
              >
                {val}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
