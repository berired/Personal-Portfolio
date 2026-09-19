// ── Add your certificates here ──────────────────────────────────────
const CERTIFICATES = [
  {
    title: 'Introduction to Model Context Protocol',
    issuer: 'Anthropic Education',
    date: 'Sep 2026',
    link: 'https://verify.skilljar.com/c/i2862543h9ks',
  },
  {
    title: 'Introduction to Agent Skills',
    issuer: 'Anthropic Education',
    date: 'Sep 2026',
    link: 'https://verify.skilljar.com/c/bq6roqpxxe6g',
  },
  {
    title: 'Claude Code in Action',
    issuer: 'Anthropic Education',
    date: 'Sep 2026',
    link: 'https://verify.skilljar.com/c/5pa8qj3whqx8',
  },
  {
    title: 'Building with the Claude API',
    issuer: 'Anthropic Education',
    date: 'Sep 2026',
    link: 'https://verify.skilljar.com/c/jbt28bseep27',
  },
]
// ───────────────────────────────────────────────────────────────────

export default function Certificates() {
  return (
    <div className="space-y-5 py-6">
      <div>
        <p className="text-xs text-[#ffb000] opacity-60 mb-1">// certs.log loaded</p>
        <h2 className="font-vt text-4xl text-[#00ff41] glow tracking-widest">CERTIFICATES</h2>
      </div>

      <p className="text-[#ffb000] text-xs opacity-60">{'>'} ls -la certs/</p>

      {CERTIFICATES.length === 0 ? (
        <p className="text-[#00ff41] opacity-30 text-sm">// no certificates yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.title}
              className="border border-[#00ff4120] rounded bg-[#080808] p-4 flex flex-col hover:border-[#00ff4150] transition-colors"
            >
              <p className="text-[#ffb000] text-xs mb-2 opacity-60">[cert]</p>
              <p className="text-[#00ff41] font-bold text-sm mb-1 glow-sm leading-snug">{cert.title}</p>
              <p className="text-[#00cc33] text-xs opacity-80">{cert.issuer}</p>
              <p className="text-[#00cc33] text-xs opacity-50 mb-3">{cert.date}</p>

              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs text-[#6699ff] opacity-70 hover:opacity-100 hover:underline transition-opacity mt-auto"
                >
                  {'>'} verify credential →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
