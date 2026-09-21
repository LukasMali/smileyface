import { useEffect, useState } from "react"
import { useGame } from "../hooks/GameContext"
import { MrAlien } from "../components/characters/MrAlien"

export function UfoFlyby() {
  const { save, play, reducedMotion } = useGame()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (reducedMotion) return
    const t = window.setInterval(() => {
      if (Math.random() < 0.18) {
        setShow(true)
        play("ufo")
      }
    }, 22000)
    return () => window.clearInterval(t)
  }, [play, reducedMotion])

  useEffect(() => {
    if (!show) return
    const t = window.setTimeout(() => setShow(false), 4800)
    return () => window.clearTimeout(t)
  }, [show])

  if (!show) return null
  const busy = save.happiness > 55
  return (
    <div className="pointer-events-none fixed top-[16%] left-0 z-[60]" style={{ animation: "fly-across 4.8s ease-in-out both" }}>
      <MrAlien size={busy ? 96 : 72} />
    </div>
  )
}
