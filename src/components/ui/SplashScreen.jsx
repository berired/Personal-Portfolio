import { useEffect } from 'react'
import { useBootSound } from '../../hooks/useBootSound'

export default function SplashScreen({ onStart }) {
  const { playPost, unlock } = useBootSound()

  useEffect(() => {
    const trigger = () => {
      unlock()
      playPost()
      onStart?.()
    }
    window.addEventListener('keydown', trigger, { once: true })
    window.addEventListener('click', trigger, { once: true })
    return () => {
      window.removeEventListener('keydown', trigger)
      window.removeEventListener('click', trigger)
    }
  }, [onStart, unlock, playPost])

  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-50 cursor-pointer select-none">
      <p className="font-vt text-4xl sm:text-5xl text-[#00ff41] glow tracking-[0.3em] mb-2">TERMINAL</p>
      <p className="font-vt text-base sm:text-xl text-[#ffb000] glow-amber tracking-[0.6em] mb-16">OS v1.0</p>

      <p className="font-mono text-sm text-[#00ff41] animate-pulse tracking-widest">
        ▮ PRESS ANY KEY TO BOOT ▮
      </p>
    </div>
  )
}
