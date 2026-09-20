import { Burger } from "./characters/Props"
import { Fish } from "./characters/Fish"
import { MrAlien } from "./characters/MrAlien"
import { Pony } from "./characters/Pony"
import { EasterEgg } from "./ui/EasterEgg"
import { Scene, Wave } from "./ui/Floating"

export function BurgerZone() {
  return (
    <Scene className="bg-linear-to-b from-[#ffe8c8] to-blush pb-10">
      <Wave fill="#ffe8c8" />
      <div className="relative mx-auto max-w-4xl px-4">
        <p className="label-sticker mb-2 text-sm">important burger business</p>
        <p className="mb-4 font-hand text-xs text-ink-soft">top tier snack technology</p>

        <div className="relative mx-auto max-w-lg rounded-[2rem] border-2 border-ink/10 bg-cream p-6 shadow-[6px_8px_0_rgba(74,63,85,0.08)]">
          <svg viewBox="0 0 260 90" className="mb-2 w-40" aria-hidden>
            <rect x="8" y="8" width="240" height="74" rx="10" fill="#4a3f55" />
            <text x="130" y="36" textAnchor="middle" fill="#fff3c4" fontFamily="Patrick Hand" fontSize="16">
              MENU
            </text>
            <text x="130" y="58" textAnchor="middle" fill="#fff" fontFamily="Patrick Hand" fontSize="12">
              burger • fries • tiny drink
            </text>
          </svg>
          <div className="flex flex-wrap items-end justify-center gap-4">
            <Fries />
            <Burger legendary size={140} />
            <Drink />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <Pony
              name="secret burger fan"
              look={{ body: "#fff3c4", mane: "#c97c5d", accessory: "burger" }}
              className="scale-75"
            />
            <Fish color="#8ecae6" fin="#ffd6e0" extra="burger" message="burger?" />
          </div>
        </div>
        <MrAlien mode="steal" size={80} className="absolute right-4 bottom-0" />
        <EasterEgg label="hidden burger" className="top-6 right-8">
          <span className="text-lg" aria-hidden>
            🍔
          </span>
        </EasterEgg>
      </div>
    </Scene>
  )
}

function Fries() {
  return (
    <svg width="70" height="80" viewBox="0 0 70 80" className="sticker" aria-hidden>
      <rect x="12" y="38" width="46" height="36" rx="6" fill="#ff8fab" stroke="#4a3f55" strokeWidth="1.4" />
      <rect x="18" y="10" width="8" height="36" rx="3" fill="#ffe066" />
      <rect x="30" y="6" width="8" height="40" rx="3" fill="#fff3c4" />
      <rect x="42" y="12" width="8" height="34" rx="3" fill="#f4d35e" />
    </svg>
  )
}

function Drink() {
  return (
    <svg width="44" height="80" viewBox="0 0 44 80" className="sticker" aria-hidden>
      <path d="M10 20 h24 l-4 48 h-16 z" fill="#c5e8f7" stroke="#4a3f55" strokeWidth="1.4" />
      <rect x="8" y="16" width="28" height="8" rx="2" fill="#ffd6e0" />
      <rect x="20" y="4" width="3" height="14" fill="#4a3f55" />
      <ellipse cx="22" cy="4" rx="5" ry="3" fill="#ff8fab" />
    </svg>
  )
}
