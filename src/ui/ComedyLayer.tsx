import { useEffect, useRef, useState } from "react"
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

type Kind = (typeof EVENTS)[number]
type Tick = { id: number; kind: Kind }

const LINES: Record<Kind, string> = {
  "fish-what": "a fish somewhere just said: what",
  "pony-backwards": "a pony walked backwards somewhere",
  "alien-tax": "",
  "nini-blanket": "Nini has stolen a blanket. again.",
  "fruit-escape": "one strawberry escaped. we let it go.",
  "burger-fall": "a burger fell over dramatically",
  "mystery-fish": "a mystery fish is judging you. silently.",
}

export function ComedyLayer() {
  const { patch, notify, play, reducedMotion, save } = useGame()
  const [tick, setTick] = useState<Tick | null>(null)
  const counted = useRef(new Set<number>())
  const comedyRef = useRef(save.comedyCount)
  const seq = useRef(0)

  useEffect(() => {
    comedyRef.current = save.comedyCount
  }, [save.comedyCount])

  // comedy is a game system, not decoration — it must still fire even if
  // Windows / the browser has prefers-reduced-motion turned on
  useEffect(() => {
    const spawn = () => setTick({ id: ++seq.current, kind: pick(EVENTS) })
    const first = window.setTimeout(spawn, 5000)
    const t = window.setInterval(() => {
      if (comedyRef.current < 6 || chance(0.55)) spawn()
    }, 12000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(t)
    }
  }, [])

  useEffect(() => {
    if (!tick) return
    if (counted.current.has(tick.id)) return
    counted.current.add(tick.id)
    patch((s) => ({ ...s, comedyCount: s.comedyCount + 1 }))
    play("pop")
    const line = tick.kind === "alien-tax" ? pick(ALIEN_LINES) : LINES[tick.kind]
    if (line) notify(line)
    const hide = window.setTimeout(() => setTick(null), 4800)
    return () => window.clearTimeout(hide)
  }, [tick, notify, patch, play])

  const event = tick?.kind

  return (
    <div className="pointer-events-none fixed bottom-[6.2rem] left-3 z-[70] sm:left-6" aria-live="polite">
      <AnimatePresence>
        {event && (
          <motion.div
            key={tick?.id}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
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
            {event === "burger-fall" && <Quip>a burger fell over dramatically</Quip>}
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
