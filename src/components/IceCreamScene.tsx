import { CactusIceCream } from "./characters/CactusIceCream"
import { MrAlien } from "./characters/MrAlien"
import { EasterEgg } from "./ui/EasterEgg"
import { Scene, Wave } from "./ui/Floating"
import { Star } from "./ui/SparkleBurst"

export function IceCreamScene() {
  return (
    <Scene id="ice-cream" className="-mt-8 bg-mint pb-10">
      <Wave fill="#c8f0d8" className="-mt-1" />
      <div className="relative mx-auto max-w-5xl px-4 pt-4">
        <p className="label-sticker mb-6 text-sm">kaktus ice cream world</p>
        <div className="relative mx-auto max-w-xl">
          <svg viewBox="0 0 420 120" className="w-full" aria-hidden>
            <rect x="40" y="58" width="340" height="50" rx="14" fill="#fff8e7" stroke="#4a3f55" strokeWidth="2.2" />
            <rect x="70" y="16" width="280" height="52" rx="16" fill="#a8d8ea" stroke="#4a3f55" strokeWidth="2" />
            <text x="210" y="48" textAnchor="middle" fontSize="18" fill="#4a3f55" fontFamily="Patrick Hand">
              cactus pops • friends 4 ever
            </text>
          </svg>
          <div className="relative z-10 -mt-6 flex flex-wrap items-end justify-center gap-1 sm:gap-3">
            <CactusIceCream body="#ff8fab" spots="#fff" />
            <CactusIceCream body="#8fd9b0" spots="#fff3c4" />
            <CactusIceCream body="#ffe066" spots="#ff8fab" />
            <CactusIceCream body="#8ecae6" spots="#fff" />
            <CactusIceCream body="#c4b0ea" spots="#ffd6e0" />
          </div>
        </div>
        <Star className="absolute top-8 right-10" />
        <Star className="absolute top-20 left-8" size={12} />
        <MrAlien mode="peek" size={70} className="absolute right-4 bottom-2 opacity-90" />
        <EasterEgg label="hidden ice cream" className="bottom-2 left-6">
          <span className="text-lg" aria-hidden>
            🍦
          </span>
        </EasterEgg>
      </div>
    </Scene>
  )
}
