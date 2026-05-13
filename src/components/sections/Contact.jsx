import { useState } from 'react'

// ── Update your links ──────────────────────────────────────────────
const LINKS = [
  { label: 'email',    val: 'david.wagan@ciit.edu.ph',  href: 'mailto:david.wagan@ciit.edu.ph' },
  { label: 'github',   val: 'github.com/davidwagan',     href: '#' },
  { label: 'linkedin', val: 'linkedin.com/in/davidwagan', href: '#' },
]
// ──────────────────────────────────────────────────────────────────

export default function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState(null)
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => setFields((p) => ({ ...p, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // TODO: wire up your preferred form handler (Formspree, EmailJS, etc.)
    setSent(true)
  }

  const inputCls = (id) =>
    [
      'w-full bg-[#080808] border rounded px-3 py-2 text-sm text-[#00ff41] outline-none',
      'placeholder:text-[#00ff4128] transition-all duration-150',
      focused === id
        ? 'border-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.18)]'
        : 'border-[#00ff4125]',
    ].join(' ')

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

      {/* Message form */}
      <div>
        <p className="text-[#ffb000] text-xs mb-3 opacity-60">{'>'} ./send_message.sh</p>

        {sent ? (
          <div className="border border-[#00ff41] rounded bg-[#001800] p-6 text-center space-y-2">
            <p className="text-[#00ff41] glow font-vt text-2xl tracking-widest">TRANSMITTED</p>
            <p className="text-[#00cc33] text-xs opacity-65">
              // Message sent. I'll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {[
              { id: 'contact-name',  label: 'name',  type: 'text',  ph: 'your name',      field: 'name'  },
              { id: 'contact-email', label: 'email', type: 'email', ph: 'your@email.com', field: 'email' },
            ].map(({ id, label, type, ph, field }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-[#ffb000] text-xs mb-1.5 opacity-60">
                  {'>'} {label}:
                </label>
                <input
                  id={id}
                  type={type}
                  value={fields[field]}
                  onChange={set(field)}
                  onFocus={() => setFocused(id)}
                  onBlur={() => setFocused(null)}
                  placeholder={ph}
                  required
                  className={inputCls(id)}
                />
              </div>
            ))}

            <div>
              <label htmlFor="contact-message" className="block text-[#ffb000] text-xs mb-1.5 opacity-60">
                {'>'} message:
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={fields.message}
                onChange={set('message')}
                onFocus={() => setFocused('contact-message')}
                onBlur={() => setFocused(null)}
                placeholder="your message here…"
                required
                className={`${inputCls('contact-message')} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 border border-[#00ff41] text-[#00ff41] text-sm rounded
                hover:bg-[#001800] hover:shadow-[0_0_14px_rgba(0,255,65,0.25)]
                active:scale-95 transition-all duration-150"
            >
              {'>'} ./transmit.sh
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
