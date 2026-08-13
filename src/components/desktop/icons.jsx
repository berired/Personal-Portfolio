// Hand-rolled SVG icon set for the desktop UI — app icons and window chrome.
// Decorative taskbar glyphs are real icon assets from /asset/app-icons.

import vscodeUrl from '@asset/app-icons/vscode.svg'
import valorantUrl from '@asset/app-icons/icons8-valorant.svg'
import steamUrl from '@asset/app-icons/icons8-steam.svg'
import spotifyUrl from '@asset/app-icons/icons8-spotify.svg'
import discordUrl from '@asset/app-icons/icons8-discord.svg'
import chromeUrl from '@asset/app-icons/icons8-chrome.svg'

const line = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

/* ── App icons (desktop + taskbar entries) ───────────────────────────── */

export function PersonIcon(props) {
  return (
    <svg {...line} {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.4-4 4-6 7.5-6s6.1 2 7.5 6" />
    </svg>
  )
}

export function PaperIcon(props) {
  return (
    <svg {...line} {...props}>
      <path d="M6 2.5h9l3.5 3.5V21a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5Z" />
      <path d="M15 2.5V6a.5.5 0 0 0 .5.5H19" />
      <path d="M8.2 11h7.2M8.2 14.2h7.2M8.2 17.4h4.6" />
    </svg>
  )
}

export function ComputerIcon(props) {
  return (
    <svg {...line} {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <path d="M8 20h8M12 16v4" />
      <path d="M7.5 8.2 5.8 10l1.7 1.8M16.5 8.2 18.2 10l-1.7 1.8" strokeWidth="1.3" />
    </svg>
  )
}

export function MailIcon(props) {
  return (
    <svg {...line} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
      <path d="m3.2 6 8.8 7 8.8-7" />
    </svg>
  )
}

export function CopyrightIcon(props) {
  return (
    <svg {...line} {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M14.8 9.3a3.6 3.6 0 1 0 0 5.4" strokeWidth="1.5" />
    </svg>
  )
}

export function RobotIcon(props) {
  return (
    <svg {...line} {...props}>
      <rect x="5" y="9" width="14" height="10" rx="2" />
      <circle cx="9.5" cy="14" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="14" r="1.3" fill="currentColor" stroke="none" />
      <path d="M12 9V5.5" />
      <circle cx="12" cy="4" r="1.2" />
      <path d="M3.5 12v3M20.5 12v3" />
    </svg>
  )
}

/* ── Window chrome icons ─────────────────────────────────────────────── */

export function MinimizeGlyph(props) {
  return (
    <svg {...line} strokeWidth={2} width={12} height={12} {...props}>
      <path d="M5 19h14" />
    </svg>
  )
}

export function MaximizeGlyph(props) {
  return (
    <svg {...line} strokeWidth={2} width={11} height={11} {...props}>
      <rect x="5" y="5" width="14" height="14" rx="1" />
    </svg>
  )
}

export function RestoreGlyph(props) {
  return (
    <svg {...line} strokeWidth={2} width={11} height={11} {...props}>
      <rect x="7" y="3" width="11" height="11" rx="1" />
      <path d="M6 8H4.5A1.5 1.5 0 0 0 3 9.5V19a1.5 1.5 0 0 0 1.5 1.5H14a1.5 1.5 0 0 0 1.5-1.5V17" />
    </svg>
  )
}

export function CloseGlyph(props) {
  return (
    <svg {...line} strokeWidth={2} width={12} height={12} {...props}>
      <path d="M5 5 19 19M19 5 5 19" />
    </svg>
  )
}

/* ── Decorative taskbar icons (real assets from /asset/app-icons) ──────
   Masked to a solid currentColor silhouette instead of their source brand
   colors, so they read as one CRT-green icon set rather than a clashing
   row of blue/red/black brand marks. */

function MaskIcon({ src }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 20,
        height: 20,
        backgroundColor: 'currentColor',
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

export function VSCodeGlyph() {
  return <MaskIcon src={vscodeUrl} />
}

export function ValorantGlyph() {
  return <MaskIcon src={valorantUrl} />
}

export function SteamGlyph() {
  return <MaskIcon src={steamUrl} />
}

export function SpotifyGlyph() {
  return <MaskIcon src={spotifyUrl} />
}

export function DiscordGlyph() {
  return <MaskIcon src={discordUrl} />
}

export function ChromeGlyph() {
  return <MaskIcon src={chromeUrl} />
}
