import { useState } from 'react'

const LINKS = [
  { label: 'email',    val: 'davidxanderwagan@gmail.com',        href: 'mailto:davidxanderwagan@gmail.com' },
  { label: 'github',   val: 'github.com/berired',                href: 'https://github.com/berired' },
  { label: 'linkedin', val: 'linkedin.com/in/davidxanderwagan',  href: 'https://www.linkedin.com/in/david-xander-wagan-b78624389/' },
]

const INITIAL = { name: '', email: '', message: '' }
const STATUS  = { idle: 'idle', sending: 'sending', ok: 'ok', err: 'err' }

async function sendMail({ name, email, message }) {
  const res = await fetch('https://send.api.mailtrap.io/api/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_MAILTRAP_TOKEN}`,
    },
    body: JSON.stringify({
      from:    { email: 'portfolio@demomailtrap.co', name: 'Portfolio Contact' },
      to:      [{ email: 'davidxanderwagan@gmail.com' }],
      subject: `[Portfolio] Message from ${name}`,
      text:    `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html:    `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
    }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.message ?? `HTTP ${res.status}`)
  }
}

export default function Contact() {
  const [form,   setForm]   = useState(INITIAL)
  const [status, setStatus] = useState(STATUS.idle)
  const [errMsg, setErrMsg] = useState('')

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
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

  return (
    <div className="space-y-6 py-6 max-w-xl">
      <div>
        <p className="text-xs text-[#ffb000] opacity-60 mb-1">// contact.sys loaded</p>
        <h2 className="font-vt text-4xl text-[#00ff41] glow tracking-widest">CONTACT</h2>
      </div>

      {/* Links */}
      <div className="border border-[#00ff4120] rounded bg-[#080808] p-4">
        <p className="text-[#ffb000] text-xs mb-3 opacity-60">{'>'} cat links.txt</p>
        <div className="space-y-2">
          {LINKS.map(({ label, val, href }) => (
            <div key={label} className="flex gap-4 items-center text-sm">
              <span className="text-[#ffb000] opacity-65 w-16">{label}:</span>
              <a
                href={href}
                className="text-[#00ff41] opacity-75 hover:opacity-100 hover:glow-sm transition-all"
              >
                {val}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Email form */}
      <div className="border border-[#00ff4120] rounded bg-[#080808] p-4">
        <p className="text-[#ffb000] text-xs mb-4 opacity-60">{'>'} send_message --to davidxanderwagan@gmail.com</p>

        {status === STATUS.ok ? (
          <div className="text-center py-6">
            <p className="text-[#00ff41] glow text-sm mb-1">{'>'} message sent successfully</p>
            <p className="text-[#00ff41] opacity-50 text-xs">transmission complete. i&apos;ll get back to you soon.</p>
            <button
              onClick={() => setStatus(STATUS.idle)}
              className="mt-4 text-xs text-[#ffb000] opacity-60 hover:opacity-100 transition-all underline"
            >
              send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { name: 'name',    label: 'name',    type: 'text',  placeholder: 'your name' },
              { name: 'email',   label: 'email',   type: 'email', placeholder: 'your@email.com' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name} className="flex flex-col gap-1">
                <label className="text-[#ffb000] opacity-65 text-xs">{label}:</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  disabled={sending}
                  className="bg-transparent border border-[#00ff4130] rounded px-3 py-2 text-[#00ff41] text-sm
                             placeholder-[#00ff4130] focus:outline-none focus:border-[#00ff4180]
                             disabled:opacity-40 transition-colors"
                />
              </div>
            ))}

            <div className="flex flex-col gap-1">
              <label className="text-[#ffb000] opacity-65 text-xs">message:</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="write your message here..."
                required
                rows={5}
                disabled={sending}
                className="bg-transparent border border-[#00ff4130] rounded px-3 py-2 text-[#00ff41] text-sm
                           placeholder-[#00ff4130] focus:outline-none focus:border-[#00ff4180]
                           disabled:opacity-40 resize-none transition-colors"
              />
            </div>

            {status === STATUS.err && (
              <p className="text-red-400 text-xs opacity-80">
                {'>'} error: {errMsg || 'transmission failed. try again.'}
              </p>
            )}

            <button
              type="submit"
              disabled={sending || !form.name || !form.email || !form.message}
              className="w-full border border-[#00ff4140] rounded py-2 text-sm text-[#00ff41]
                         hover:border-[#00ff41] hover:glow-sm transition-all
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {sending ? '> transmitting...' : '> send_message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
