// Best-effort per-IP rate limiter for Vercel serverless functions.
//
// State lives in module memory, so it only holds within a single warm lambda
// instance — a cold start or a request routed to a different instance resets
// it. That's fine here: the goal is capping casual abuse (bots hammering the
// contact form or burning Gemini quota), not withstanding a distributed
// attack. A real DDoS needs Vercel's edge/WAF layer, not app code.

const buckets = new Map()

// Prevent unbounded growth from many distinct IPs hitting a cold instance.
const MAX_TRACKED_IPS = 5000

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

// Returns { ok: true } if the request is allowed, or { ok: false, retryAfter }
// (seconds) if the caller is over the limit for this window.
export function checkRateLimit(req, { windowMs, max }) {
  const ip = getClientIp(req)
  const now = Date.now()
  const key = ip

  let bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    if (!bucket && buckets.size >= MAX_TRACKED_IPS) buckets.clear()
    bucket = { count: 0, resetAt: now + windowMs }
    buckets.set(key, bucket)
  }

  bucket.count += 1

  if (bucket.count > max) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  return { ok: true }
}
