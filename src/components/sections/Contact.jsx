import { useState } from 'react'

const LINKS = [
  { label: 'email',    val: 'davidxanderwagan@gmail.com',                href: 'mailto:davidxanderwagan@gmail.com' },
  { label: 'github',   val: 'github.com/berired',                        href: 'https://github.com/berired' },
  { label: 'linkedin', val: 'linkedin.com/in/david-xander-wagan-b78624389', href: 'https://www.linkedin.com/in/david-xander-wagan-b78624389/' },
]

// Posts to our own serverless function rather than to the email provider:
// a transactional-email API key can send mail as you to anyone, so it stays
// server-side. See api/send-email.js.
//
// Note this route only exists on Vercel — plain `vite dev` does not run
// functions, so use `vercel dev` to exercise the form locally.
const ENDPOINT = '/api/send-email'

const INITIAL = { name: '', email: '', message: '' }
const STATUS = { idle: 'idle', sending: 'sending', ok: 'ok', err: 'err' }

const FIELDS = [
  { name: 'name',  label: 'name',  type: 'text',  placeholder: 'your name' },
  { name: 'email', label: 'email', type: 'email', placeholder: 'your@email.com' },
]

const inputCls =
  'bg-transparent border border-[#00ff4130] rounded px-3 py-2 text-[#00ff41] text-sm ' +
  'placeholder-[#00ff4160] focus:outline-none focus:border-[#00ff41] ' +
  'focus-visible:ring-1 focus-visible:ring-[#00ff41] disabled:opacity-40 transition-colors'

async function sendMail({ name, email, message }) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `HTTP ${res.status}`)
  }
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState(STATUS.idle)
  const [errMsg, setErrMsg] = useState('')

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    // Bots that fill every field trip this; real submissions leave it empty.
    if (e.target.botcheck?.checked) return

    setStatus(STATUS.sending)
    setErrMsg('')
    try {
      await sendMail(form)
      setStatus(STATUS.ok)
      setForm(INITIAL)
    } catch (err) {
      setStatus(STATUS.err)
      setErrMsg(err.message)
    }
  }

  const sending = status === STATUS.sending
  const incomplete = !form.name || !form.email || !form.message

  return (
    <div className="space-y-6 py-6 max-w-xl">
      <div>
        <p className="text-xs text-[#ffb000] opacity-60 mb-1" aria-hidden="true">// contact.sys loaded</p>
        <h2 className="font-vt text-4xl text-[#00ff41] glow tracking-widest">CONTACT</h2>
      </div>

      {/* Links */}
      <div className="border border-[#00ff4120] rounded bg-[#080808] p-4">
        <p className="text-[#ffb000] text-xs mb-3 opacity-70" aria-hidden="true">{'>'} cat links.txt</p>
        <div className="space-y-2">
          {LINKS.map(({ label, val, href }) => {
            const external = href.startsWith('http')
            return (
              <div key={label} className="flex gap-4 items-center text-sm">
                <span className="text-[#ffb000] opacity-75 w-16 shrink-0">{label}:</span>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="text-[#00ff41] opacity-85 hover:opacity-100 hover:glow-sm transition-all break-all"
                >
                  {val}
                </a>
              </div>
            )
          })}
        </div>
      </div>

      {/* Email form */}
      <div className="border border-[#00ff4120] rounded bg-[#080808] p-4">
        <p className="text-[#ffb000] text-xs mb-4 opacity-70" aria-hidden="true">
          {'>'} send_message --to davidxanderwagan@gmail.com
        </p>

        {/* Status is announced rather than only shown, since the send result is
            the one thing a visitor must not miss. */}
        <div aria-live="polite" className="sr-only">
          {sending ? 'Sending message…' : ''}
          {status === STATUS.ok ? 'Message sent successfully.' : ''}
        </div>

        {status === STATUS.ok ? (
          <div className="text-center py-6">
            <p className="text-[#00ff41] glow text-sm mb-1">{'>'} message sent successfully</p>
            <p className="text-[#00ff41] opacity-70 text-xs">
              transmission complete. i&apos;ll get back to you soon.
            </p>
            <button
              type="button"
              onClick={() => setStatus(STATUS.idle)}
              className="mt-4 min-h-[44px] px-3 text-xs text-[#ffb000] opacity-80 hover:opacity-100 transition-all underline"
            >
              send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3" aria-busy={sending}>
            {FIELDS.map(({ name, label, type, placeholder }) => (
              <div key={name} className="flex flex-col gap-1">
                <label htmlFor={`contact-${name}`} className="text-[#ffb000] opacity-80 text-xs">
                  {label}:
                </label>
                <input
                  id={`contact-${name}`}
                  type={type}
                  name={name}
                  autoComplete={name === 'email' ? 'email' : 'name'}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  disabled={sending}
                  className={inputCls}
                />
              </div>
            ))}

            <div className="flex flex-col gap-1">
              <label htmlFor="contact-message" className="text-[#ffb000] opacity-80 text-xs">
                message:
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="write your message here..."
                required
                rows={5}
                disabled={sending}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Honeypot — hidden from sight and from assistive tech, so only a
                bot walking the DOM will ever tick it. */}
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* A failed send must not be a dead end — the direct address is
                offered inline rather than leaving the visitor to hunt for it. */}
            {status === STATUS.err && (
              <p role="alert" className="text-[#ff6b6b] text-xs leading-relaxed">
                {'>'} error: {errMsg || 'transmission failed. try again.'}
                <br />
                {'>'} or email me directly at{' '}
                <a href="mailto:davidxanderwagan@gmail.com" className="underline">
                  davidxanderwagan@gmail.com
                </a>
              </p>
            )}

            <button
              type="submit"
              disabled={sending || incomplete}
              className="w-full border border-[#00ff4140] rounded min-h-[44px] py-2 text-sm text-[#00ff41]
                         hover:border-[#00ff41] hover:glow-sm transition-all
                         focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff41]
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {sending ? '> transmitting...' : '> send_message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
