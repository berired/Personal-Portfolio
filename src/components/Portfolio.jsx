import { useCallback, useEffect, useMemo, useState } from 'react'
import Window from './desktop/Window'
import DesktopIcon from './desktop/DesktopIcon'
import Taskbar from './desktop/Taskbar'
import RobotBot from './desktop/RobotBot'
import RedBotChat from './desktop/RedBotChat'
import { PersonIcon, PaperIcon, ComputerIcon, MailIcon, CopyrightIcon, RobotIcon } from './desktop/icons'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Credits from './sections/Credits'
import { useMuted, startCrtHum, stopCrtHum } from '../hooks/useBootSound'

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const SpeakerOn = () => (
  <svg {...iconProps}>
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
)

const SpeakerOff = () => (
  <svg {...iconProps}>
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="m22 9-6 6" />
    <path d="m16 9 6 6" />
  </svg>
)

const ReplayIcon = () => (
  <svg {...iconProps}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
)

const BackIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="13" rx="1.5" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
)

// Mirrors Window.jsx's own TASKBAR_H — kept in sync there since that's the
// component that actually renders against it during drag/resize.
const TASKBAR_H = 56

// Windows track focus order starting from z=1, which used to land well
// under RobotBot's own z-40 — on a small screen where an open window fills
// most of the corner it floats in, the widget would render on top of (and
// steal clicks from) whatever content was underneath it. This offset keeps
// every window above the widget regardless of focus order, so it only ever
// covers bare desktop, never something the user is actually reading.
const WINDOW_Z_BASE = 100

const trayBtnCls =
  'inline-flex items-center justify-center min-h-[36px] min-w-[36px] px-1.5 text-[#00ff41] ' +
  'opacity-70 hover:opacity-100 hover:bg-[#0d1a0d] transition-opacity duration-150 rounded-sm'

const APPS = [
  { id: 'about', label: 'About', cmd: './about', Icon: PersonIcon, Component: About },
  { id: 'experience', label: 'Experience', cmd: './experience', Icon: PaperIcon, Component: Experience },
  { id: 'projects', label: 'Projects', cmd: './projects', Icon: ComputerIcon, Component: Projects },
  { id: 'contact', label: 'Contact', cmd: './contact', Icon: MailIcon, Component: Contact },
  { id: 'credits', label: 'Credits', cmd: './credits', Icon: CopyrightIcon, Component: Credits },
]

const CLOSED_WINDOW = {
  open: false,
  minimized: false,
  maximized: false,
  active: false,
  z: 0,
  x: null,
  y: null,
  width: null,
  height: null,
}

const initialWindows = {
  ...Object.fromEntries(APPS.map((app) => [app.id, { ...CLOSED_WINDOW }])),
  // RedBot has no desktop icon — it's opened from the RobotBot widget in the
  // taskbar corner instead — but it's still a window managed the same way.
  redbot: { ...CLOSED_WINDOW },
}

export default function Portfolio({ onReplay, onBack }) {
  const [windows, setWindows] = useState(initialWindows)
  const [topZ, setTopZ] = useState(1)
  const [muted, toggleMuted] = useMuted()

  useEffect(() => {
    startCrtHum()
    return stopCrtHum
  }, [])

  const focus = useCallback((id, nextZ) => {
    setWindows((prev) => {
      const next = {}
      for (const key of Object.keys(prev)) {
        next[key] = { ...prev[key], active: key === id }
      }
      next[id] = { ...next[id], z: nextZ }
      return next
    })
  }, [])

  const openApp = useCallback(
    (id) => {
      const nextZ = topZ + 1
      setTopZ(nextZ)
      setWindows((prev) => {
        const w = prev[id]
        let { x, y, width, height } = w
        // First open: pick a default size and a position cascaded off the
        // app's index, so a batch of first-opens don't stack exactly on
        // top of one another. Later opens keep wherever it was last left.
        if (x == null) {
          const vw = window.innerWidth
          const vh = window.innerHeight
          width = Math.min(880, vw * 0.92)
          height = Math.min(640, vh * 0.72)
          const cascade = APPS.findIndex((a) => a.id === id)
          // Clamped so the cascade offset can never push a later app (or a
          // narrow viewport) far enough right/down to carry the title bar's
          // own close/minimize buttons off-screen.
          x = Math.min((vw - width) / 2 + cascade * 28, vw - width)
          y = Math.min(vh * 0.09 + cascade * 28, vh - TASKBAR_H - height)
        }
        return {
          ...prev,
          [id]: { ...w, open: true, minimized: false, z: nextZ, x, y, width, height },
        }
      })
      focus(id, nextZ)
    },
    [topZ, focus]
  )

  const moveWindow = useCallback((id, x, y) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], x, y } }))
  }, [])

  const resizeWindow = useCallback((id, width, height) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], width, height } }))
  }, [])

  const closeApp = useCallback((id) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], open: false, minimized: false, maximized: false, active: false },
    }))
  }, [])

  const minimizeApp = useCallback((id) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: true, active: false },
    }))
  }, [])

  const toggleMaximize = useCallback((id) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], maximized: !prev[id].maximized },
    }))
  }, [])

  const focusApp = useCallback(
    (id) => {
      const nextZ = topZ + 1
      setTopZ(nextZ)
      focus(id, nextZ)
    },
    [topZ, focus]
  )

  const openRedBot = useCallback(() => {
    const nextZ = topZ + 1
    setTopZ(nextZ)
    setWindows((prev) => {
      const w = prev.redbot
      let { x, y, width, height } = w
      if (x == null) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        width = Math.min(380, vw * 0.92)
        height = Math.min(560, vh * 0.78)
        // Anchored near the RobotBot widget it was opened from, clear of
        // both the taskbar and the widget itself.
        x = Math.max(0, vw - width - 16)
        y = Math.max(16, vh - height - 88)
      }
      return {
        ...prev,
        redbot: { ...w, open: true, minimized: false, z: nextZ, x, y, width, height },
      }
    })
    focus('redbot', nextZ)
  }, [topZ, focus])

  const toggleRedBot = useCallback(() => {
    const w = windows.redbot
    if (!w.open || w.minimized) return openRedBot()
    return focusApp('redbot')
  }, [windows, openRedBot, focusApp])

  const handleTaskbarToggle = useCallback(
    (id) => {
      const w = windows[id]
      if (!w.open) return openApp(id)
      if (w.minimized) return openApp(id)
      if (w.active) return minimizeApp(id)
      return focusApp(id)
    },
    [windows, openApp, minimizeApp, focusApp]
  )

  const taskbarApps = useMemo(
    () => APPS.map(({ id, label, Icon }) => ({ id, label, Icon })),
    []
  )

  return (
    <div className="fixed inset-0 flex flex-col text-[#00ff41] font-mono bg-[#050505]">
      {/* ── Desktop surface ── */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-1 p-3 sm:p-5 w-fit max-w-full">
          {APPS.map((app) => (
            <DesktopIcon key={app.id} icon={app.Icon} label={app.label} onOpen={() => openApp(app.id)} />
          ))}
        </div>

        {APPS.map((app) => {
          const w = windows[app.id]
          const Section = app.Component
          return (
            <Window
              key={app.id}
              id={app.id}
              title={app.label}
              cmd={app.cmd}
              icon={app.Icon}
              open={w.open}
              minimized={w.minimized}
              maximized={w.maximized}
              active={w.active}
              zIndex={WINDOW_Z_BASE + w.z}
              x={w.x}
              y={w.y}
              width={w.width}
              height={w.height}
              onClose={() => closeApp(app.id)}
              onMinimize={() => minimizeApp(app.id)}
              onToggleMaximize={() => toggleMaximize(app.id)}
              onFocus={() => !w.active && focusApp(app.id)}
              onMove={(x, y) => moveWindow(app.id, x, y)}
              onResize={(width, height) => resizeWindow(app.id, width, height)}
            >
              <Section />
            </Window>
          )
        })}

        <Window
          id="redbot"
          title="RedBot"
          cmd="./redbot"
          icon={RobotIcon}
          open={windows.redbot.open}
          minimized={windows.redbot.minimized}
          maximized={windows.redbot.maximized}
          active={windows.redbot.active}
          zIndex={WINDOW_Z_BASE + windows.redbot.z}
          x={windows.redbot.x}
          y={windows.redbot.y}
          width={windows.redbot.width}
          height={windows.redbot.height}
          onClose={() => closeApp('redbot')}
          onMinimize={() => minimizeApp('redbot')}
          onToggleMaximize={() => toggleMaximize('redbot')}
          onFocus={() => !windows.redbot.active && focusApp('redbot')}
          onMove={(x, y) => moveWindow('redbot', x, y)}
          onResize={(width, height) => resizeWindow('redbot', width, height)}
        >
          <RedBotChat />
        </Window>
      </div>

      {/* ── Taskbar ── */}
      <Taskbar
        apps={taskbarApps}
        windows={windows}
        onToggleApp={handleTaskbarToggle}
        trayControls={
          <>
            <button
              type="button"
              onClick={onBack}
              aria-label="Back — explore the machine in 3D"
              title="Back"
              className={trayBtnCls}
            >
              <BackIcon />
            </button>
            <button
              type="button"
              onClick={toggleMuted}
              aria-pressed={muted}
              aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
              title={muted ? 'Sound off' : 'Sound on'}
              className={trayBtnCls}
            >
              {muted ? <SpeakerOff /> : <SpeakerOn />}
            </button>
            <button
              type="button"
              onClick={onReplay}
              aria-label="Replay the intro sequence"
              title="Replay intro"
              className={trayBtnCls}
            >
              <ReplayIcon />
            </button>
          </>
        }
      />

      {/* ── RedBot widget — perched over the taskbar clock, bottom-right ── */}
      <RobotBot onOpen={toggleRedBot} chatOpen={windows.redbot.open && !windows.redbot.minimized} />
    </div>
  )
}
