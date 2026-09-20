import { useEffect, useRef, useState } from "react"
import { useWorld } from "../hooks/WorldContext"
import { MrAlien } from "./characters/MrAlien"
import { TinyCar } from "./characters/Props"
import { EasterEgg } from "./ui/EasterEgg"
import { Scene, Wave } from "./ui/Floating"
import { SpeechBubble } from "./ui/SpeechBubble"

const checkpoints = [
  { at: 8, text: "survive theory" },
  { at: 28, text: "defeat parallel parking" },
  { at: 48, text: "remember mirrors" },
  { at: 68, text: "driving test boss fight" },
  { at: 86, text: "licence acquired" },
]

export function DrivingQuest() {
  const { addFun, notify } = useWorld()
  const track = useRef<HTMLDivElement>(null)
  const [x, setX] = useState(8)
  const [honk, setHonk] = useState(false)
  const [light, setLight] = useState(0)
  const [cones, setCones] = useState([true, true])
  const keys = useRef({ l: false, r: false })

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.l = true
      if (e.key === "ArrowRight" || e.key === "d") keys.current.r = true
      if (e.key === " " || e.key === "h") {
        setHonk(true)
        addFun(1)
        notify("HONK")
        window.setTimeout(() => setHonk(false), 700)
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.l = false
      if (e.key === "ArrowRight" || e.key === "d") keys.current.r = false
    }
    const tick = window.setInterval(() => {
      setX((v) => {
        let n = v
        if (keys.current.l) n -= 1.6
        if (keys.current.r) n += 1.6
        return Math.min(86, Math.max(2, n))
      })
    }, 32)
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.clearInterval(tick)
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [addFun, notify])

  const moveTo = (clientX: number) => {
    const r = track.current?.getBoundingClientRect()
    if (!r) return
    setX(Math.min(86, Math.max(2, ((clientX - r.left) / r.width) * 100 - 8)))
  }

  const currentSign = checkpoints.reduce((acc, c) => (x >= c.at ? c.text : acc), checkpoints[0].text)

  return (
    <Scene className="bg-[#d9efe4] pb-8">
      <Wave fill="#d9efe4" />
      <div className="relative mx-auto max-w-6xl px-3 pt-2">
        <p className="label-sticker mb-2 text-sm">driving licence quest</p>
        <p className="mb-3 font-hand text-xs text-ink-soft">
          drag the road · arrows / A D · tap car to honk · now: {currentSign}
        </p>
        <div
          ref={track}
          className="relative h-64 cursor-ew-resize overflow-hidden rounded-[2rem] border-2 border-ink/10 bg-[#b7d8c4] touch-none sm:h-72"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            moveTo(e.clientX)
            addFun(1)
          }}
          onPointerMove={(e) => {
            if (e.buttons) moveTo(e.clientX)
          }}
        >
          <div className="absolute inset-x-0 top-24 h-28 bg-[#7d8b99]" />
          <div className="absolute inset-x-8 top-36 h-1 bg-butter" />
          <Lights
            className="absolute top-6 left-[18%]"
            phase={light}
            onClick={() => {
              setLight((n) => (n + 1) % 3)
              notify(light === 2 ? "GREEN GO GO" : light === 0 ? "wait wait wait" : "almost…")
            }}
          />
          <button
            type="button"
            className="absolute top-40 left-[40%] border-0 bg-transparent p-0"
            aria-label="knock over cone"
            onClick={(e) => {
              e.stopPropagation()
              setCones(([a, b]) => [!a, b])
              addFun(1)
            }}
          >
            <Cone fallen={!cones[0]} />
          </button>
          <button
            type="button"
            className="absolute top-44 left-[46%] border-0 bg-transparent p-0"
            aria-label="knock over other cone"
            onClick={(e) => {
              e.stopPropagation()
              setCones(([a, b]) => [a, !b])
            }}
          >
            <Cone fallen={!cones[1]} />
          </button>
          <Flag className="absolute top-10 right-10" />
          <div className="absolute right-16 bottom-10 h-16 w-24 rounded-md border-2 border-dashed border-white/70" />

          {checkpoints.map((c) => (
            <p
              key={c.text}
              className={`absolute top-3 max-w-24 truncate rounded-full px-2 py-0.5 font-hand text-[10px] sm:max-w-none sm:text-[11px] ${x >= c.at ? "bg-mint text-ink" : "bg-white/90 text-ink"}`}
              style={{ left: `${c.at}%` }}
            >
              {c.text}
            </p>
          ))}

          <div className="absolute top-28 transition-[left] duration-75" style={{ left: `${x}%` }}>
            <div className="relative">
              {honk && <SpeechBubble className="-top-8">HONK</SpeechBubble>}
              <TinyCar
                onHonk={() => {
                  setHonk(true)
                  addFun(2)
                  notify("HONK")
                  window.setTimeout(() => setHonk(false), 900)
                }}
              />
            </div>
          </div>

          <div className="absolute top-8 right-[30%] rotate-[-12deg]">
            <MrAlien mode="drive" size={74} interactive />
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-3">
          <button
            type="button"
            className="hit-area rounded-full bg-white px-5 py-2 font-hand text-lg"
            aria-label="drive left"
            onClick={() => setX((v) => Math.max(2, v - 8))}
          >
            ←
          </button>
          <button
            type="button"
            className="hit-area rounded-full bg-white px-5 py-2 font-hand text-lg"
            aria-label="drive right"
            onClick={() => setX((v) => Math.min(86, v + 8))}
          >
            →
          </button>
        </div>
        <EasterEgg label="traffic cone" className="bottom-2 left-4">
          <Cone />
        </EasterEgg>
      </div>
    </Scene>
  )
}

function Lights({
  className = "",
  phase,
  onClick,
}: {
  className?: string
  phase: number
  onClick: () => void
}) {
  return (
    <button type="button" aria-label="traffic light" className={`border-0 bg-transparent p-0 ${className}`} onClick={onClick}>
      <svg width="22" height="56" viewBox="0 0 22 56" aria-hidden>
        <rect x="7" y="0" width="8" height="56" fill="#4a3f55" />
        <circle cx="11" cy="12" r="6" fill={phase === 0 ? "#ff8fab" : "#5c4450"} />
        <circle cx="11" cy="28" r="6" fill={phase === 1 ? "#fff3c4" : "#5c5340"} />
        <circle cx="11" cy="44" r="6" fill={phase === 2 ? "#8fd9b0" : "#355246"} />
      </svg>
    </button>
  )
}

function Cone({ className = "", fallen = false }: { className?: string; fallen?: boolean }) {
  return (
    <svg
      width="28"
      height="32"
      viewBox="0 0 28 32"
      className={className}
      style={{ transform: fallen ? "rotate(78deg)" : undefined }}
      aria-hidden
    >
      <polygon points="14,2 26,30 2,30" fill="#ff9f43" stroke="#4a3f55" strokeWidth="1.3" />
      <rect x="4" y="18" width="20" height="5" fill="#fff" />
    </svg>
  )
}

function Flag({ className = "" }: { className?: string }) {
  return (
    <svg width="40" height="44" viewBox="0 0 40 44" className={className} aria-hidden>
      <rect x="6" y="2" width="4" height="40" fill="#4a3f55" />
      <path d="M10 4 h24 v16 h-24 z" fill="#fff" />
      <path d="M10 4 h8 v8 h8 v8 h-8 v-8 h-8 z" fill="#4a3f55" />
    </svg>
  )
}
