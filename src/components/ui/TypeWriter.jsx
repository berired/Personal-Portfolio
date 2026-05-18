import { useState, useEffect, useRef } from 'react'

// Persists across SPA navigations; cleared on page refresh (module re-evaluates).
const typed = new Set()

export default function TypeWriter({ text, speed = 6, className = '', sound, once, id }) {
  const skip = once && id && typed.has(id)

  const [out,  setOut]  = useState(skip ? text : '')
  const [done, setDone] = useState(skip)

  // Track current text so the effect doesn't stale-close over it
  const textRef = useRef(text)
  textRef.current = text

  useEffect(() => {
    if (skip) return

    setOut('')
    setDone(false)
    let i = 0

    const id_ = setInterval(() => {
      i++
      const char = textRef.current[i - 1]
      setOut(textRef.current.slice(0, i))
      if (sound && char && char !== ' ' && char !== '\n') sound()
      if (i >= textRef.current.length) {
        setDone(true)
        if (once && id) typed.add(id)
        clearInterval(id_)
      }
    }, speed)

    return () => clearInterval(id_)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed])

  const parts = (done ? text : out).split('\n')

  return (
    <span role="status" aria-live="polite" aria-atomic="false" className={className}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <br />}
        </span>
      ))}
      {!done && <span aria-hidden="true" className="animate-pulse opacity-70">▋</span>}
    </span>
  )
}
