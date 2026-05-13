import { useState, useEffect } from 'react'

export default function TypeWriter({ text, speed = 18, className = '', sound }) {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setOut('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      const char = text[i - 1]
      setOut(text.slice(0, i))
      if (sound && char && char !== ' ' && char !== '\n') sound()
      if (i >= text.length) { setDone(true); clearInterval(id) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, sound])

  const parts = out.split('\n')

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
