import { useEffect, useRef, useState } from "react"
import { FISH_LINES } from "../game/messages"
import { useGame } from "../hooks/GameContext"
import { pick, rand } from "../lib/random"
import { PageShell } from "../ui/PageShell"
import { Tag } from "../ui/Button"

type FishDef = {
  id: string
  name: string
  color: string
  fin: string
  x: number
  y: number
  vx: number
  vy: number
  z: number
  hidden?: boolean
}

const START: Omit<FishDef, "x" | "y" | "vx" | "vy">[] = [
  { id: "nurse", name: "Nurse Fish", color: "#ff8fab", fin: "#fff", z: 1 },
  { id: "drive", name: "Driving Fish", color: "#ffe066", fin: "#ffb3c6", z: 2 },
  { id: "money", name: "Money Fish", color: "#8ecae6", fin: "#c4b0ea", z: 1 },
  { id: "burger", name: "Burger Fish", color: "#ffb3c6", fin: "#8fd9b0", z: 2 },
  { id: "sleep", name: "Sleepy Fish", color: "#c4b0ea", fin: "#fff3c4", z: 3 },
  { id: "artist", name: "Artist Fish", color: "#b8f0d8", fin: "#ffd6e0", z: 2 },
  { id: "confused", name: "Confused Fish", color: "#fff3c4", fin: "#8ecae6", z: 1 },
  { id: "secret", name: "Hidden Fish", color: "#4a3f55", fin: "#fff3c4", z: 3, hidden: true },
]

export function Aquarium() {
  const { notify, play, patch, save, completeLevel, discoverSecret } = useGame()
  const box = useRef<HTMLDivElement>(null)
  const [fish, setFish] = useState<FishDef[]>(() =>
    START.map((f, i) => ({
      ...f,
      x: 10 + i * 10,
      y: 20 + (i % 4) * 16,
      vx: rand(-0.35, 0.35),
      vy: rand(-0.2, 0.2),
    })),
  )
  const seen = useRef(new Set(save.collectedFish))

  useEffect(() => {
    let raf = 0
    const tick = () => {
      setFish((prev) =>
        prev.map((f) => {
          let vx = f.vx + rand(-0.02, 0.02)
          let vy = f.vy + rand(-0.015, 0.015)
          vx = Math.max(-0.55, Math.min(0.55, vx))
          vy = Math.max(-0.3, Math.min(0.3, vy))
          let x = f.x + vx
          let y = f.y + vy + Math.sin(Date.now() / 600 + f.z) * 0.08
          if (x < 2 || x > 88) vx *= -1
          if (y < 8 || y > 78) vy *= -1
          x = Math.max(2, Math.min(88, x))
          y = Math.max(8, Math.min(78, y))
          return { ...f, x, y, vx, vy }
        }),
      )
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const tap = (f: FishDef) => {
    play("bubble")
    notify(pick(FISH_LINES))
    if (!seen.current.has(f.id)) {
      seen.current.add(f.id)
      patch((s) => ({ ...s, collectedFish: [...new Set([...s.collectedFish, f.id])] }))
    }
    if (f.hidden) discoverSecret("hidden-fish", "tiny void fish located")
    if (seen.current.size >= 7 && !save.completedLevels.includes("aquarium")) completeLevel("aquarium")
  }

  return (
    <PageShell title="Aquarium" area="aquarium" tint="#7ec8e3">
      <Tag>tap fish · they have jobs and feelings</Tag>
      <div ref={box} className="relative mx-auto min-h-[420px] max-w-3xl overflow-hidden rounded-[1.8rem] bg-linear-to-b from-[#7ec8e3] to-[#1b6b88]" data-testid="aquarium">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-3 w-3 rounded-full border border-white/70 bg-white/30"
            style={{
              left: `${8 + i * 11}%`,
              bottom: "8%",
              animation: `bubble-up ${4 + (i % 3)}s linear infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
        {fish.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-label={f.name}
            className="absolute min-h-11 min-w-11 border-0 bg-transparent p-0"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: `scale(${1.1 - f.z * 0.08}) scaleX(${f.vx < 0 ? -1 : 1})`,
              opacity: f.hidden ? 0.35 : 1,
            }}
            onClick={() => tap(f)}
          >
            <svg width="72" height="44" viewBox="0 0 72 44">
              <polygon points="10,22 0,10 0,34" fill={f.fin} />
              <ellipse cx="40" cy="22" rx="24" ry="14" fill={f.color} stroke="#4a3f55" strokeWidth="1.4" />
              <circle cx="54" cy="20" r="4" fill="#fff" />
              <circle cx="55" cy="21" r="2" fill="#2a2430" />
              <path d="M28 16 q10 -8 22 0" fill={f.fin} opacity="0.5" />
            </svg>
          </button>
        ))}
      </div>
      <p className="mt-2 text-center font-hand text-sm">inspected {save.collectedFish.length}/8 fish</p>
    </PageShell>
  )
}
