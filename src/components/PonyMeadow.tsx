import { useState } from "react"
import { useWorld } from "../hooks/WorldContext"
import { MrAlien } from "./characters/MrAlien"
import { Pony } from "./characters/Pony"
import { EasterEgg } from "./ui/EasterEgg"
import { Scene, Wave } from "./ui/Floating"
import { Star } from "./ui/SparkleBurst"

export function PonyMeadow() {
  const { addFun, notify } = useWorld()
  const [flowers, setFlowers] = useState<{ id: number; x: number; y: number }[]>([])
  return (
    <Scene className="bg-linear-to-b from-mint to-[#d7f5c8] pb-8">
      <Wave fill="#d7f5c8" />
      <div
        className="relative mx-auto max-w-6xl px-3 pt-2"
        onClick={(e) => {
          const t = e.target as HTMLElement
          if (t.closest("button")) return
          const r = e.currentTarget.getBoundingClientRect()
          setFlowers((prev) => [
            ...prev.slice(-24),
            {
              id: Date.now() + Math.random(),
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100,
            },
          ])
          addFun(1)
          notify("flower planted")
        }}
      >
        <p className="label-sticker mb-3 text-sm">pony meadow · tap empty grass to plant flowers</p>
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-sm"
              style={{ left: `${(i * 8 + 5) % 94}%`, top: `${20 + (i % 5) * 14}%` }}
            >
              {i % 3 === 0 ? "✿" : i % 3 === 1 ? "✦" : "·"}
            </span>
          ))}
        </div>
          {flowers.map((f) => (
            <span
              key={f.id}
              className="pointer-events-none absolute text-lg"
              style={{ left: `${f.x}%`, top: `${f.y}%` }}
            >
              ✿
            </span>
          ))}
        <Butterfly className="absolute top-8 right-[20%]" />
        <Butterfly className="absolute top-24 left-[12%]" delay="1.2s" />
        <Star className="absolute top-6 left-1/2" />

        <div className="relative z-10 flex flex-wrap items-end justify-center gap-x-2 gap-y-6">
          <Pony name="nurse" look={{ body: "#ffd6e0", mane: "#ff8fab", accessory: "nurse" }} />
          <Pony name="driver" look={{ body: "#c5e8f7", mane: "#8fd9b0", accessory: "sign" }} />
          <Pony
            name="burger-stare"
            look={{ body: "#fff3c4", mane: "#e8c39e", accessory: "burger" }}
            dramatic
          />
          <Pony name="coins" look={{ body: "#c8f0d8", mane: "#f4d35e", accessory: "coins" }} />
          <Pony name="artist" look={{ body: "#e0d4f7", mane: "#ffb3c6", accessory: "stylus" }} />
          <Pony
            name="sleepy"
            look={{ body: "#f2d0c4", mane: "#c4b0ea", accessory: "sleep" }}
            sleeping
          />
        </div>

        <p className="absolute right-6 bottom-8 rotate-[-8deg] font-hand text-[11px] text-ink-soft/70">
          pony council headquarters
        </p>
        <MrAlien mode="peek" size={64} className="absolute bottom-0 left-[8%]" interactive />
        <EasterEgg label="tiny pony icon" className="top-4 right-8">
          <span className="text-lg">🐴</span>
        </EasterEgg>
      </div>
      <div className="pointer-events-none mt-6 h-16 bg-[repeating-linear-gradient(90deg,#8fd9b0_0_18px,#7ccc9f_18px_22px)] opacity-40" />
    </Scene>
  )
}

function Butterfly({ className, delay = "0s" }: { className: string; delay?: string }) {
  return (
    <svg
      width="28"
      height="22"
      viewBox="0 0 28 22"
      className={`anim-float ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <ellipse cx="8" cy="10" rx="7" ry="8" fill="#e0d4f7" />
      <ellipse cx="20" cy="10" rx="7" ry="8" fill="#ffd6e0" />
      <rect x="13" y="4" width="2" height="14" rx="1" fill="#4a3f55" />
    </svg>
  )
}
