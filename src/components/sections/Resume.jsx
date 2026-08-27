import resumeUrl from '@asset/David Xander Wagan Resume.pdf'
import { trackEvent } from '../../lib/analytics'

const FILENAME = 'David Xander Wagan Resume.pdf'

export default function Resume() {
  return (
    <div className="flex flex-col h-full py-6 gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-[#ffb000] opacity-60 mb-1" aria-hidden="true">// resume.pdf loaded</p>
          <h2 className="font-vt text-4xl text-[#00ff41] glow tracking-widest">RESUME</h2>
        </div>
        <a
          href={resumeUrl}
          download={FILENAME}
          onClick={() => trackEvent('resume_download')}
          className="inline-flex items-center gap-2 border border-[#00ff4140] rounded min-h-[44px] px-4 text-sm text-[#00ff41]
                     hover:border-[#00ff41] hover:glow-sm transition-all
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff41]"
        >
          {'>'} download_pdf
        </a>
      </div>

      <div className="flex-1 min-h-0 border border-[#00ff4120] rounded bg-[#080808] overflow-hidden">
        <iframe
          src={resumeUrl}
          title="Resume preview"
          className="w-full h-full min-h-[420px] bg-[#0a0a0a]"
        />
      </div>
    </div>
  )
}
