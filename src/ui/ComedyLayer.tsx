import { useEffect, useState } from "react"
import { ALIEN_LINES } from "../game/messages"
import { useGame } from "../hooks/GameContext"
import { chance, pick } from "../lib/random"
import { MrAlien } from "../components/characters/MrAlien"
import { Nikki } from "../art/Nikki"
import { KawaiiBlob } from "../components/characters/KawaiiBlob"

const EVENTS = [
  "fish-what",
  "pony-backwards",
  "alien-tax",
  "nini-blanket",
  "fruit-escape",
  "burger-fall",
  "mystery-fish",
] as const

export function ComedyLayer() {
  const { patch, notify, play, reducedMotion, save } = useGame()
  const [event, setEvent] = useState<string | null>(null)

  useEffect(() => {
    if (reducedMotion) return
    const t = window.setInterval(() => {
      if (chance(0.28)) setEvent(pick(EVENTS))
    }, 24000)
    return () => window.clearInterval(t)
  }, [reducedMotion])

  useEffect(() => {
    if (!event) return
    patch((s) => ({ ...s, comedyCount: s.comedyCount + 1 }))
    play("pop")
    if (event === "alien-tax") notify(pick(ALIEN_LINES))
    if (event === "fish-what") notify("a fish somewhere just said: what")
    if (event === "nini-blanket") notify("Nini has stolen a blanket. again.")
    const hide = window.setTimeout(() => setEvent(null), 4200)
    return () => window.clearTimeout(hide)
  }, [event, notify, patch, play])

  if (!event) return null

  return (
    <div className="pointer-events-none fixed bottom-24 left-3 z-[70] sm:left-6" aria-hidden>
      {event === "mystery-fish" && (
        <svg width="70" height="40" viewBox="0 0 70 40">
          <ellipse cx="38" cy="20" rx="20" ry="12" fill="#8ecae6" stroke="#4a3f55" strokeWidth="1.4" />
          <polygon points="16,20 2,10 2,30" fill="#e0d4f7" />
          <circle cx="48" cy="18" r="3" fill="#2a2430" />
        </svg>
      )}
      {event === "alien-tax" && <MrAlien size={70} />}
      {event === "nini-blanket" && (
        <div className="relative">
          <Nikki pose="walk" size={90} />
          <span className="absolute -top-2 right-0 text-2xl">🛏️</span>
        </div>
      )}
      {event === "fish-what" && <KawaiiBlob mood="confused" size={58} />}
      {event === "pony-backwards" && (
        <p className="rounded-full bg-white px-3 py-1 font-hand text-sm shadow">a pony walked backwards somewhere</p>
      )}
      {save.happiness > 40 && event === "burger-fall" && (
        <p className="rounded-full bg-white px-3 py-1 font-hand text-sm shadow">a burger fell over dramatically</p>
      )}
    </div>
  )
}
