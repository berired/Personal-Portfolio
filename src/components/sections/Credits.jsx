const YEAR = new Date().getFullYear()

const STACK = [
  ['React', 'UI library'],
  ['Vite', 'Build tool'],
  ['Tailwind CSS', 'Styling'],
  ['three.js / React Three Fiber', '3D office scene'],
  ['GSAP', 'Camera + intro animation'],
]

const ASSETS = [
  {
    name: '"Low-poly office"',
    nameUrl: 'https://skfb.ly/pKvFU',
    author: 'DarianDS',
    license: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
  },
  {
    name: '"Robot Playground"',
    nameUrl: 'https://skfb.ly/6QXFq',
    author: 'Hadrien59',
    license: 'CC BY 4.0',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
  },
  { name: 'VS Code, Valorant, Steam, Spotify, Discord, Chrome icons', note: 'Icons8 (icons8.com)' },
  { name: 'Share Tech Mono / VT323', note: 'Google Fonts' },
]

export default function Credits() {
  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div>
        <p className="text-xs text-[#ffb000] opacity-60 mb-1">// credits.txt loaded</p>
        <h1 className="font-vt text-3xl sm:text-5xl text-[#00ff41] glow tracking-widest leading-none">
          CREDITS
        </h1>
        <p className="text-[#00cc33] text-sm mt-1 opacity-75">
          All rights reserved
        </p>
      </div>

      {/* Rights notice */}
      <div className="border border-[#00ff4120] rounded bg-[#080808] p-4">
        <p className="text-[#ffb000] text-xs mb-3 opacity-60">{'>'} cat LICENSE</p>
        <p className="text-sm text-[#00ff41] opacity-85 leading-relaxed">
          &copy; {YEAR} David Xander Wagan. All rights reserved.
        </p>
        <p className="text-sm text-[#00cc33] opacity-70 leading-relaxed mt-2">
          This site, its design, and its original content may not be reproduced,
          distributed, or used without prior written permission.
        </p>
      </div>

      {/* Built with */}
      <div>
        <p className="text-[#ffb000] text-xs mb-3 opacity-60">{'>'} cat stack.log</p>
        <div className="border border-[#00ff4118] rounded bg-[#080808] p-4 space-y-1.5">
          {STACK.map(([name, note]) => (
            <div key={name} className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs">
              <span className="text-[#00ff41] opacity-85">├─ {name}</span>
              <span className="text-[#00cc33] opacity-55">{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Asset credits */}
      <div>
        <p className="text-[#ffb000] text-xs mb-3 opacity-60">{'>'} cat assets.log</p>
        <div className="border border-[#00ff4118] rounded bg-[#080808] p-4 space-y-2.5">
          {ASSETS.map((asset) => (
            <div key={asset.name} className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs leading-relaxed">
              <span className="text-[#00ff41] opacity-85">
                ├─{' '}
                {asset.nameUrl ? (
                  <a
                    href={asset.nameUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[#00ff4140] hover:decoration-[#00ff41] hover:opacity-100"
                  >
                    {asset.name}
                  </a>
                ) : (
                  asset.name
                )}
                {asset.author && <span className="text-[#00cc33] opacity-70"> by {asset.author}</span>}
              </span>
              <span className="text-[#00cc33] opacity-55">
                {asset.license ? (
                  <>
                    licensed under{' '}
                    <a
                      href={asset.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-[#00cc3340] hover:decoration-[#00cc33] hover:opacity-100"
                    >
                      {asset.license}
                    </a>
                  </>
                ) : (
                  asset.note
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
