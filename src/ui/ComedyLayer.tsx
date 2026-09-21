import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ALIEN_LINES } from "../game/messages"
import { useGame } from "../hooks/GameContext"
import { chance, pick } from "../lib/random"
import { MrAlien } from "../art/Alien"
import { Nikki } from "../art/Nikki"
import { KawaiiBlob } from "../art/Blob"
import { Fish } from "../art/Fish"

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

  return (
    <div className="pointer-events-none fixed bottom-[5.6rem] left-3 z-[70] sm:left-6" aria-hidden>
      <AnimatePresence>
        {event && (
          <motion.div
            key={event}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 24 }}
          >
            {event === "mystery-fish" && <Fish size={82} extra="confused" color="#9fd4ea" />}
            {event === "alien-tax" && <MrAlien size={78} mode="banker" />}
            {event === "nini-blanket" && (
              <div className="relative">
                <Nikki pose="walk" size={96} />
                <svg viewBox="0 0 60 40" className="absolute -top-3 right-0 w-14" aria-hidden>
                  <path d="M6 24c8-12 40-14 50-4-4 10-40 16-50 4z" fill="#ffd3e0" stroke="#5b4450" strokeWidth="1.8" />
                  <path d="M14 20c8 4 22 6 34 4" stroke="#f0a8bf" strokeWidth="1.6" fill="none" />
                </svg>
              </div>
            )}
            {event === "fish-what" && <KawaiiBlob mood="confused" size={62} />}
            {event === "pony-backwards" && <Quip>a pony walked backwards somewhere</Quip>}
            {event === "fruit-escape" && <Quip>one strawberry escaped. we let it go.</Quip>}
            {event === "burger-fall" && save.happiness > 40 && <Quip>a burger fell over dramatically</Quip>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Quip({ children }: { children: string }) {
  return (
    <p className="max-w-[70vw] rounded-full border-[1.5px] border-ink/10 bg-white/96 px-3.5 py-1.5 font-hand text-sm shadow-[0_12px_22px_-16px_rgba(91,68,80,0.9)]">
      {children}
    </p>
  )
}
