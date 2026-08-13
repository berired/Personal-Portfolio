import { useCallback } from 'react'
import { MinimizeGlyph, MaximizeGlyph, RestoreGlyph, CloseGlyph } from './icons'

const btnCls =
  'inline-flex items-center justify-center w-9 h-8 sm:w-8 sm:h-7 text-[#00ff41] ' +
  'opacity-70 hover:opacity-100 hover:bg-[#0d1a0d] transition-opacity duration-150'

// Taskbar is h-14 (56px) — windows are kept clear of it so a dragged/resized
// window can never end up hidden behind it.
const TASKBAR_H = 56
const MIN_W = 340
const MIN_H = 260

export default function Window({
  id,
  title,
  icon: Icon,
  cmd,
  open,
  minimized,
  maximized,
  active,
  zIndex,
  x,
  y,
  width,
  height,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onMove,
  onResize,
  children,
}) {
  // Drag-to-move from the title bar. Closes over the pointer/window state at
  // drag start rather than reading refs on every move, so there's nothing to
  // keep in sync — the listeners just remove themselves on pointerup.
  const startDrag = useCallback(
    (e) => {
      if (maximized || e.button !== 0 || e.target.closest('button')) return
      onFocus?.()
      const startX = e.clientX
      const startY = e.clientY
      const origX = x
      const origY = y
      const w = width
      const vw = window.innerWidth
      const vh = window.innerHeight
      document.body.style.userSelect = 'none'

      const onPointerMove = (ev) => {
        let nx = origX + (ev.clientX - startX)
        let ny = origY + (ev.clientY - startY)
        nx = Math.max(-w + 160, Math.min(nx, vw - 160))
        ny = Math.max(0, Math.min(ny, vh - TASKBAR_H - 40))
        onMove?.(nx, ny)
      }
      const onPointerUp = () => {
        document.body.style.userSelect = ''
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      }
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    },
    [maximized, x, y, width, onFocus, onMove]
  )

  // Resize from the bottom-right corner handle. Same closure pattern as drag.
  const startResize = useCallback(
    (e) => {
      if (maximized) return
      e.stopPropagation()
      onFocus?.()
      const startX = e.clientX
      const startY = e.clientY
      const origW = width
      const origH = height
      const vw = window.innerWidth
      const vh = window.innerHeight
      document.body.style.userSelect = 'none'

      const onPointerMove = (ev) => {
        let nw = origW + (ev.clientX - startX)
        let nh = origH + (ev.clientY - startY)
        nw = Math.max(MIN_W, Math.min(nw, vw - x))
        nh = Math.max(MIN_H, Math.min(nh, vh - TASKBAR_H - y))
        onResize?.(nw, nh)
      }
      const onPointerUp = () => {
        document.body.style.userSelect = ''
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      }
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    },
    [maximized, x, y, width, height, onFocus, onResize]
  )

  if (!open) return null

  const style = maximized ? { inset: 0, zIndex } : { top: y, left: x, width, height, zIndex }

  return (
    <div
      role="dialog"
      aria-label={title}
      onMouseDown={onFocus}
      className={[
        'fixed flex flex-col bg-[#050505] border font-mono text-[#00ff41]',
        'shadow-[0_20px_60px_rgba(0,0,0,0.6)]',
        active ? 'border-[#00ff4145]' : 'border-[#00ff4118]',
        minimized ? 'hidden' : 'flex',
      ].join(' ')}
      style={style}
    >
      {/* ── Title bar ── */}
      <div
        className={[
          'flex items-center justify-between pl-3 pr-1 h-10 shrink-0 border-b select-none',
          maximized ? 'cursor-default' : 'cursor-move',
          active ? 'bg-[#0d1a0d] border-[#00ff4130]' : 'bg-[#0a0a0a] border-[#00ff4118]',
        ].join(' ')}
        style={{ touchAction: 'none' }}
        onPointerDown={startDrag}
        onDoubleClick={onToggleMaximize}
      >
        <div className="flex items-center gap-2 min-w-0">
          {Icon && <Icon width={15} height={15} className="opacity-80 shrink-0" />}
          <span className={`text-xs tracking-wide truncate ${active ? 'glow-sm' : 'opacity-70'}`}>
            {cmd ?? title}
          </span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize"
            title="Minimize"
            className={btnCls}
          >
            <MinimizeGlyph />
          </button>
          <button
            type="button"
            onClick={onToggleMaximize}
            aria-label={maximized ? 'Restore' : 'Maximize'}
            title={maximized ? 'Restore' : 'Maximize'}
            className={btnCls}
          >
            {maximized ? <RestoreGlyph /> : <MaximizeGlyph />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            title="Close"
            className={btnCls + ' hover:bg-[#3a0d0d] hover:text-[#ff6b6b]'}
          >
            <CloseGlyph />
          </button>
        </div>
      </div>

      {/* ── Prompt line ── */}
      <div className="px-4 sm:px-6 py-1.5 bg-[#070707] border-b border-[#00ff4110] text-xs opacity-50 shrink-0 overflow-hidden whitespace-nowrap">
        <span className="text-[#ffb000]">user@portfolio</span>
        <span className="text-white">:</span>
        <span className="text-[#6699ff]">~/{id}</span>
        <span className="text-white">$ </span>
        <span className="hidden sm:inline">cat README.md</span>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden animate-fade-in">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-2">{children}</div>
      </div>

      {/* ── Resize handle ── */}
      {!maximized && (
        <div
          onPointerDown={startResize}
          role="presentation"
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize group"
          style={{ touchAction: 'none' }}
        >
          <svg viewBox="0 0 16 16" width="12" height="12" className="absolute bottom-0.5 right-0.5 opacity-40 group-hover:opacity-90 transition-opacity">
            <path d="M13 3 3 13M13 8 8 13" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  )
}
