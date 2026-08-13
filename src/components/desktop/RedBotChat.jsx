import { useEffect, useRef, useState } from 'react'

// Note this route only exists on Vercel — plain `vite dev` does not run
// functions, so use `vercel dev` to exercise the chatbot locally. See
// api/chat.js.
const ENDPOINT = '/api/chat'

const GREETING =
  'Hello! I am RedBot how can I help you? You may ask me questions about the portfolio, ' +
  "David's works, and related stuff."

const inputCls =
  'flex-1 bg-transparent border border-[#00ff4130] rounded px-3 py-2 text-[#00ff41] text-sm ' +
  'placeholder-[#00ff4160] focus:outline-none focus:border-[#00ff41] ' +
  'focus-visible:ring-1 focus-visible:ring-[#00ff41] disabled:opacity-40 transition-colors'

async function askRedBot(messages) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error ?? `HTTP ${res.status}`)
  }
  const data = await res.json()
  return data.reply
}

function Bubble({ role, text }) {
  const mine = role === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[85%] rounded px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words',
          mine
            ? 'bg-[#1a1200] border border-[#ffb00030] text-[#ffb000]'
            : 'bg-[#080808] border border-[#00ff4120] text-[#00ff41]',
        ].join(' ')}
      >
        {text}
      </div>
    </div>
  )
}

export default function RedBotChat() {
  const [messages, setMessages] = useState([{ role: 'model', text: GREETING }])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, pending])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || pending) return

    const next = [...messages, { role: 'user', text }]
    setMessages(next)
    setInput('')
    setError('')
    setPending(true)

    try {
      // Gemini requires the conversation to open on a 'user' turn, so the
      // greeting bubble (always first, always 'model') is dropped before send.
      const history = next.slice(next.findIndex((m) => m.role === 'user'))
      const reply = await askRedBot(history)
      setMessages((m) => [...m, { role: 'model', text: reply }])
    } catch (err) {
      setError(err.message || 'RedBot lost connection. Try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex flex-col h-full min-h-[360px] py-4">
      <div>
        <p className="text-xs text-[#ffb000] opacity-60 mb-1" aria-hidden="true">// redbot.ai loaded</p>
        <h2 className="font-vt text-2xl text-[#00ff41] glow tracking-widest mb-3">REDBOT</h2>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto scrollbar-none space-y-2 border border-[#00ff4120] rounded bg-[#050505] p-3"
      >
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} text={m.text} />
        ))}
        {pending && (
          <div className="flex justify-start">
            <div className="rounded px-3 py-2 text-sm bg-[#080808] border border-[#00ff4120] text-[#00ff41] opacity-60">
              <span className="animate-pulse">RedBot is thinking…</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-[#ff6b6b] text-xs mt-2">
          {'>'} error: {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 mt-3 shrink-0">
        <label htmlFor="redbot-input" className="sr-only">
          Ask RedBot a question
        </label>
        <input
          id="redbot-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ask about David's projects, skills..."
          disabled={pending}
          autoComplete="off"
          className={inputCls}
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="border border-[#00ff4140] rounded min-h-[38px] px-4 text-sm text-[#00ff41]
                     hover:border-[#00ff41] hover:glow-sm transition-all
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff41]
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          send
        </button>
      </form>
    </div>
  )
}
