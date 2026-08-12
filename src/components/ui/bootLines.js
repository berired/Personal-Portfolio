// Boot text and its timing, shared by the master timeline (which decides *when*
// each line is revealed) and BootSequence (which decides how it looks).
//
// Cadence accelerates through the POST checks (280 → 240 → 200ms) rather than
// running at a flat step. It reads faster than the clock says it is.

export const TOTAL_BLOCKS = 36
export const BAR_START = 1400
export const BAR_MS = 600 // 1400 + 600 = 2000, so the bar lands before 'ready' at 2150
export const BOOT_MS = 2780

export const LINES = [
  { text: '─────────────────────────────────────────────────', t: 0,    dim: true },
  { text: '  PORTFOLIO BIOS  v2.0    Copyright (C) 2024 DW ', t: 70,   amber: true },
  { text: '─────────────────────────────────────────────────', t: 140,  dim: true },
  { text: '',                                                   t: 200 },
  { text: 'CPU Check  ........... Intel Creative Core™  OK',   t: 280 },
  { text: 'RAM Test   ........... 8192 KB Extended      OK',   t: 560 },
  { text: 'HDD Scan   ........... Projects Found        OK',   t: 800 },
  { text: 'Skills     ........... Loaded Successfully   OK',   t: 1000 },
  { text: '',                                                   t: 1120 },
  { text: 'Initialising  PORTFOLIO.SYS ...',                   t: 1200, amber: true },
  { text: '',                                                   t: 1320 },
  { progress: true,                                             t: BAR_START },
  { text: '',                                                   t: 2050 },
  { text: ' PORTFOLIO OS  ready.',                              t: 2150, bright: true },
  { text: '',                                                   t: 2280 },
  { text: ' Press any key or wait…',                           t: 2380, blink: true },
]

/** How many lines have been revealed by `ms` into the boot. */
export function visibleCount(ms) {
  let n = 0
  for (const line of LINES) {
    if (line.t <= ms) n++
    else break
  }
  return n
}

/** Filled blocks of the progress bar at `ms` into the boot. */
export function barBlocks(ms) {
  const p = (ms - BAR_START) / BAR_MS
  return Math.max(0, Math.min(TOTAL_BLOCKS, Math.round(p * TOTAL_BLOCKS)))
}
