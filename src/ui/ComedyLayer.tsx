import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useGame } from "../hooks/GameContext"
import { chance, pick } from "../lib/random"
import { MrAlien } from "../art/Alien"
import { Nikki } from "../art/Nikki"
import { KawaiiBlob } from "../art/Blob"
import { Fish } from "../art/Fish"
import { Pony } from "../art/Pony"
import { Burger } from "../art/Props"
import { FruitArt } from "../art/Fruits"

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
  "fish-what": "local blob invents a joke. punchline: snacks",
  "pony-backwards": "a pony reverse-parked into a compliment",
  "alien-tax": "Mr Alien refunded the concept of stress. allow 3–5 business naps",
  "nini-blanket": "Nini unionized the blankets. they won immediately",
  "fruit-escape": "a strawberry packed a tiny lunch and made a break for it",
  "burger-fall": "the burger fainted from how good it looked. get well soon",
  "mystery-fish": "rare fish spotted. it knows your wifi password and will not tell",
}

export function ComedyLayer() {
  const { patch, play, reducedMotion, save } = useGame()
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
    const first = window.setTimeout(spawn, 22000)
    const t = window.setInterval(() => {
      if (comedyRef.current < 3 || chance(0.32)) spawn()
    }, 36000)
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
    const hide = window.setTimeout(() => setTick(null), 4200)
    return () => window.clearTimeout(hide)
  }, [tick, patch, play])

  const event = tick?.kind

  return (
    <div
      className="pointer-events-none fixed top-[10.25rem] right-2 z-[55] max-w-[10.8rem] sm:right-5 sm:max-w-[13rem]"
      aria-live="polite"
    >
      <AnimatePresence>
        {event && tick && (
          <motion.div
            key={tick.id}
            className="flex flex-col items-start gap-1"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 24 }}
          >
            <div className="drop-shadow-md">{artFor(event)}</div>
            <p className="rounded-2xl border-[1.5px] border-ink/10 bg-white/94 px-2.5 py-1 font-hand text-[0.72rem] leading-snug text-ink shadow-[0_10px_18px_-14px_rgba(91,68,80,0.9)] sm:text-sm">
              {LINES[event]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function artFor(event: Kind) {
  switch (event) {
    case "mystery-fish":
      return <Fish size={64} extra="star" color="#9fd4ea" />
    case "alien-tax":
      return <MrAlien size={62} mode="banker" />
    case "nini-blanket":
      return (
        <div className="relative">
          <Nikki pose="walk" size={72} />
          <svg viewBox="0 0 60 40" className="absolute -top-2 right-0 w-11" aria-hidden>
            <path d="M6 24c8-12 40-14 50-4-4 10-40 16-50 4z" fill="#ffd3e0" stroke="#5b4450" strokeWidth="1.8" />
            <path d="M14 20c8 4 22 6 34 4" stroke="#f0a8bf" strokeWidth="1.6" fill="none" />
          </svg>
        </div>
      )
    case "fish-what":
      return <KawaiiBlob mood="yay" size={56} />
    case "pony-backwards":
      return (
        <div className="-scale-x-100">
          <Pony look={{ body: "#ffdbe6", mane: "#ff8fae", accessory: "star" }} name="Blush" size={78} />
        </div>
      )
    case "fruit-escape":
      return <FruitArt kind="strawberry" size={52} className="anim-float" />
    case "burger-fall":
      return (
        <div className="origin-bottom -rotate-12">
          <Burger size={58} />
        </div>
      )
  }
}
