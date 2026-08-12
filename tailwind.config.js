/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crt: {
          green: '#00ff41',
          'green-dim': '#00cc33',
          amber: '#ffb000',
          bg: '#050505',
          'bg-panel': '#0d0d0d',
        },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        vt: ['"VT323"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'screen-wash': 'screenWash 0.52s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        // Fires as the camera reaches the screen and resolves to fully clear.
        // The old `flicker` ran 0.12s with no fill-mode while App held the
        // element for 500ms, so it snapped back to a solid full-screen green
        // and sat there for ~380ms.
        // One flare that decays to clear — deliberately a single peak, not a
        // strobe, to stay well under the WCAG three-flashes-per-second threshold.
        screenWash: {
          '0%': { opacity: '0' },
          '10%': { opacity: '0.75' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      })
    },
  ],
}
