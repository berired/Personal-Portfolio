// Vercel serverless function: relays the contact form to Resend.
//
// This exists because a transactional-email API key is a real secret — unlike
// a form-relay access key, it can send mail as you to anyone, so it must never
// reach the browser. RESEND_API_KEY is a server-only env var (no VITE_ prefix,
// so Vite cannot inline it into the bundle).
//
// Sender defaults to Resend's shared onboarding@resend.dev, which is allowed to
// deliver only to the address that owns the Resend account. That is exactly the
// contact-form case, so no custom domain is needed. Once a domain is verified,
// set CONTACT_FROM to an address on it.

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const DEFAULT_FROM = 'Portfolio Contact <onboarding@resend.dev>'
const DEFAULT_TO = 'davidxanderwagan@gmail.com'

const LIMITS = { name: 100, email: 200, message: 5000 }

// Deliberately loose: real addresses vary far more than most patterns allow,
// and the authoritative check is whether the reply lands. This only rejects
// input that cannot be an address at all.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c])

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    return res.status(500).json({ error: 'Email is not configured' })
  }

  const { name, email, message, botcheck } = req.body ?? {}

  // Honeypot: a hidden field no human ever fills. Answer 200 so bots get no
  // signal that they were caught.
  if (botcheck) return res.status(200).json({ ok: true })

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid field types' })
  }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    message.length > LIMITS.message
  ) {
    return res.status(400).json({ error: 'One or more fields are too long' })
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  // Header injection guard: a newline in the subject could otherwise smuggle
  // extra headers into the outgoing message.
  const safeName = name.replace(/[\r\n]+/g, ' ').trim()

  let response
  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO || DEFAULT_TO],
        subject: `[Portfolio] Message from ${safeName}`,
        // Replying in the mail client goes to the visitor, not to Resend.
        reply_to: email,
        text: `Name: ${safeName}\nEmail: ${email}\n\n${message}`,
        html:
          `<p><strong>Name:</strong> ${escapeHtml(safeName)}</p>` +
          `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
          `<hr/><p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
      }),
    })
  } catch (err) {
    console.error('Resend request failed:', err)
    return res.status(502).json({ error: 'Could not reach the email service' })
  }

  if (!response.ok) {
    // Logged in full server-side; the client gets a generic message so upstream
    // details and key state are never echoed back to the browser.
    const body = await response.text().catch(() => '')
    console.error(`Resend responded ${response.status}: ${body}`)
    return res.status(502).json({ error: 'Failed to send email' })
  }

  return res.status(200).json({ ok: true })
}
