import { useState } from "react"
import { Coin, MrAlien } from "./characters/MrAlien"
import { EasterEgg } from "./ui/EasterEgg"
import { Scene, Wave } from "./ui/Floating"
import { useWorld } from "../hooks/WorldContext"

export function AlienSavings() {
  const { savings, celebrate, addSavings, addFun, notify } = useWorld()
  const [shake, setShake] = useState(false)

  const drop = () => {
    addSavings(5)
    addFun(4)
    setShake(true)
    notify("coin yeeted into the jar")
    window.setTimeout(() => setShake(false), 500)
  }

  return (
    <Scene className="bg-linear-to-b from-lilac to-[#dfe7ff] pb-12">
      <Wave fill="#e0d4f7" />
      <div className="relative mx-auto max-w-xl px-4 text-center">
        <p className="label-sticker mb-2 text-sm">Mr Alien’s financial department</p>
        <p className="mb-4 font-hand text-xs text-ink-soft">drag the UFO · tap the jar · rain coins</p>
        <div className="relative mx-auto flex h-56 flex-col items-center">
          <MrAlien interactive size={130} className={celebrate ? "anim-wiggle" : "anim-float"} />
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="pointer-events-none absolute top-24 left-1/2"
              style={{
                animation: "coin-drop 2.4s ease-in infinite",
                animationDelay: `${i * 0.45}s`,
                marginLeft: `${-18 + i * 8}px`,
              }}
            >
              <Coin size={18} />
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-label="savings jar, tap to add coins"
          className={`relative mx-auto mt-2 block w-40 border-0 bg-transparent p-0 ${shake ? "anim-wiggle" : ""}`}
          onClick={drop}
        >
          <svg viewBox="0 0 120 110" className="sticker w-full" aria-hidden>
            <path d="M20 28 h80 l-8 70 h-64 z" fill="#c5e8f7" stroke="#4a3f55" strokeWidth="2" />
            <rect x="18" y="20" width="84" height="14" rx="6" fill="#8ecae6" stroke="#4a3f55" strokeWidth="1.6" />
            <ellipse cx="60" cy="20" rx="18" ry="6" fill="#4a3f55" opacity="0.25" />
            <path d="M36 48 h48" stroke="#fff" strokeWidth="3" opacity="0.5" />
          </svg>
          <p className="absolute inset-x-0 top-12 font-hand text-2xl text-ink" aria-live="polite">
            €{savings}
          </p>
        </button>
        <button
          type="button"
          className="mt-4 rounded-full bg-white px-4 py-2 font-hand text-sm"
          onClick={drop}
        >
          yeet coin
        </button>
        <p className="mt-3 font-hand text-xs text-ink-soft">definitely not real money. aura only.</p>
        <EasterEgg label="miniature UFO" className="top-8 left-8">
          <MrAlien size={44} />
        </EasterEgg>
      </div>
    </Scene>
  )
}
