// Minimal GA4 wrapper — no react-ga4 dependency, just the gtag.js snippet
// Google's own docs recommend, loaded conditionally on the env var being set.
// Both functions are safe to call unconditionally: with no measurement ID
// (e.g. local dev) initAnalytics() never injects the script and trackEvent()
// silently no-ops, so callers never need to branch on whether analytics is
// enabled.
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export function initAnalytics() {
  if (!MEASUREMENT_ID || typeof window === 'undefined') return

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
