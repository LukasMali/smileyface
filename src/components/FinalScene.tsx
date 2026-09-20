import { Sparkles } from "lucide-react"
import { useWorld } from "../hooks/WorldContext"
import { CactusIceCream } from "./characters/CactusIceCream"
import { Fish } from "./characters/Fish"
import { Coin, MrAlien } from "./characters/MrAlien"
import { Pony } from "./characters/Pony"
import { Burger, LegendaryPlate, TinyCar } from "./characters/Props"
import { Scene, Wave } from "./ui/Floating"
import { Star } from "./ui/SparkleBurst"

export function FinalScene() {
  const { deployHappiness, celebrate, notify } = useWorld()

  return (
    <Scene className="bg-linear-to-b from-[#3d3a68] via-night to-night-deep pb-24 pt-4 text-cream">
      <Wave fill="#3d3a68" />
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <Moon />
        <Star className="absolute top-10 left-[12%]" />
        <Star className="absolute top-16 right-[18%]" size={18} />
        <Star className="absolute top-28 left-[30%]" size={12} />
        <CloudNight className="absolute top-20 left-[8%] w-28 opacity-40" />
        <CloudNight className="absolute top-12 right-[10%] w-32 opacity-30" />

        <h2 className="relative z-10 mt-16 font-hand text-2xl text-cream sm:text-3xl">
          anyway, this tiny corner of the internet is yours :)
        </h2>
        <p className="relative z-10 mt-3 font-hand text-sm text-lilac">hope it made you smile at least a little</p>

        <div className="relative mt-10 flex flex-wrap items-end justify-center gap-3">
          <Pony
            name="night sleepy"
            look={{ body: "#e0d4f7", mane: "#c4b0ea", accessory: "sleep" }}
            sleeping
            className="brightness-90"
          />
          <Fish color="#8ecae6" fin="#c4b0ea" extra="none" />
          <div className="relative">
            <MrAlien size={80} className="anim-float" />
            <Coin className="absolute -right-2 top-10" size={16} />
          </div>
          <TinyCar />
          <NurseCap />
          <CactusIceCream body="#ff8fab" spots="#fff" className="scale-75" />
          <Burger size={70} />
          <LegendaryPlate className="h-24 w-32" />
        </div>

        <button
          type="button"
          className="relative z-10 mt-12 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-cream/30 bg-blush px-6 py-3 font-hand text-lg text-ink shadow-[0_8px_0_rgba(0,0,0,0.15)]"
          onClick={deployHappiness}
          aria-label="deploy emergency happiness"
        >
          <Sparkles className="h-5 w-5" aria-hidden />
          deploy emergency happiness
        </button>
        {celebrate && (
          <p className="mt-3 font-hand text-sm text-butter">happiness engines: GO</p>
        )}

        <button
          type="button"
          className="absolute right-4 bottom-2 max-w-[46%] text-right font-hand text-[10px] leading-tight text-lilac/25 hover:text-lilac/80"
          aria-label="tiny hidden note"
          onClick={() => notify("even when I mess up, I still care a lot")}
        >
          p.s. sorry again for being dumb today😭
        </button>
      </div>
    </Scene>
  )
}

function NurseCap() {
  return (
    <svg
      width="72"
      height="64"
      viewBox="0 0 72 64"
      className="sticker mb-2"
      role="img"
      aria-label="nurse cap"
    >
      <ellipse cx="36" cy="56" rx="22" ry="5" fill="#1c1a33" opacity="0.25" />
      <path
        d="M10 36 Q12 16 36 12 Q60 16 62 36 L58 44 Q36 50 14 44 Z"
        fill="#fff"
        stroke="#4a3f55"
        strokeWidth="1.7"
      />
      <path d="M16 34 Q36 22 56 34" fill="none" stroke="#ffd6e0" strokeWidth="3" />
      <rect x="32" y="26" width="8" height="20" rx="2" fill="#ff8fab" />
      <rect x="26" y="32" width="20" height="8" rx="2" fill="#ff8fab" />
    </svg>
  )
}

function Moon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="absolute top-5 right-[14%]" aria-hidden>
      <circle cx="32" cy="32" r="18" fill="#fff3c4" />
      <circle cx="26" cy="28" r="4" fill="#f0e0a0" opacity="0.5" />
      <circle cx="36" cy="38" r="3" fill="#f0e0a0" opacity="0.4" />
    </svg>
  )
}

function CloudNight({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 120 50" className={`anim-float-slow ${className}`} aria-hidden>
      <ellipse cx="38" cy="30" rx="28" ry="16" fill="#5c5890" />
      <ellipse cx="62" cy="24" rx="24" ry="18" fill="#5c5890" />
      <ellipse cx="86" cy="32" rx="22" ry="14" fill="#5c5890" />
    </svg>
  )
}
