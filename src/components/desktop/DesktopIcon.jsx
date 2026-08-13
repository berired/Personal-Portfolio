export default function DesktopIcon({ icon: Icon, label, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col items-center gap-1.5 w-20 sm:w-24 py-2 rounded-sm focus:outline-none"
    >
      <span
        className={[
          'flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 border border-[#00ff4130]',
          'bg-[#0a0a0a]/70 text-[#00ff41] transition-all duration-150',
          'group-hover:border-[#00ff4180] group-hover:bg-[#0d1a0d] group-hover:shadow-[0_0_14px_rgba(0,255,65,0.25)]',
          'group-focus-visible:border-[#00ff4180] group-focus-visible:bg-[#0d1a0d]',
        ].join(' ')}
      >
        <Icon width={22} height={22} />
      </span>
      <span className="text-[11px] sm:text-xs font-mono text-[#00ff41] tracking-wide glow-sm text-center leading-tight">
        {label}
      </span>
    </button>
  )
}
