import { useState } from "react"
import { useWorld } from "../hooks/WorldContext"
import { Fish } from "./characters/Fish"
import { LegendaryPlate } from "./characters/Props"
import { MrAlien } from "./characters/MrAlien"
import { Pony } from "./characters/Pony"
import { EasterEgg } from "./ui/EasterEgg"
import { Scene, Wave } from "./ui/Floating"
import { Star } from "./ui/SparkleBurst"

const bites = [
  "nom",
  "legendary bite",
  "spinach power",
  "egg critical hit",
  "YOU ATE THE ARTIFACT",
]

export function LegendaryMeal() {
  const { addFun, notify } = useWorld()
  const [n, setN] = useState(0)

  return (
    <Scene className="bg-linear-to-b from-[#fff1c9] to-lilac pb-10">
      <Wave fill="#fff1c9" />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <p className="label-sticker mb-2 text-sm">LEGENDARY ITEM FOUND</p>
        <p className="mb-6 font-hand text-sm text-ink-soft">{n >= 4 ? "item consumed. +100 happiness" : "tap the plate to eat it"}</p>
        <button
          type="button"
          aria-label="eat legendary mashed potatoes"
          className="relative mx-auto block w-64 border-0 bg-transparent p-0"
          onClick={() => {
            const next = Math.min(4, n + 1)
            setN(next)
            addFun(4)
            notify(bites[next] as string)
          }}
        >
          <div className="absolute inset-x-8 top-0 h-40 rounded-full bg-butter/80 blur-2xl" />
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className="pointer-events-none absolute top-8 left-1/2 h-24 w-1 origin-bottom bg-white/50"
              style={{ transform: `translateX(-50%) rotate(${i * 25 - 75}deg)` }}
            />
          ))}
          <Star className="absolute top-2 left-8" />
          <Star className="absolute top-4 right-6" size={18} />
          <svg viewBox="0 0 200 80" className="relative mx-auto mt-24 w-48" aria-hidden>
            <polygon points="40,10 160,10 180,70 20,70" fill="#c4b0ea" stroke="#4a3f55" strokeWidth="2" />
            <rect x="24" y="70" width="152" height="10" fill="#8b7bb8" />
          </svg>
          <div className="relative -mt-16 flex justify-center" style={{ transform: `scale(${1 - n * 0.12})` }}>
            <LegendaryPlate className="anim-bob" />
          </div>
        </button>
        <p className="mt-2 font-hand text-xs text-ink-soft">
          mashed potatoes with spinach and eggs
        </p>
        <div className="mt-4 flex items-end justify-center gap-6">
          <Fish color="#8ecae6" fin="#fff3c4" extra="confused" message="blub" />
          <Pony name="loot pony" look={{ body: "#e0d4f7", mane: "#fff3c4" }} />
          <MrAlien mode="steal" size={88} interactive />
        </div>
        <EasterEgg label="sparkle near legendary food" className="top-8 right-8">
          <Star size={16} />
        </EasterEgg>
      </div>
    </Scene>
  )
}
