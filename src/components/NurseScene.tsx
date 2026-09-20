import { Activity, Heart, Stethoscope } from "lucide-react"
import { useState } from "react"
import { useWorld } from "../hooks/WorldContext"
import { Fish } from "./characters/Fish"
import { MrAlien } from "./characters/MrAlien"
import { Pony } from "./characters/Pony"
import { EasterEgg } from "./ui/EasterEgg"
import { Scene, Wave } from "./ui/Floating"

export function NurseScene() {
  const { addFun, notify } = useWorld()
  const [load, setLoad] = useState(85)
  const [caring, setCaring] = useState(999)

  return (
    <Scene className="bg-linear-to-b from-blush to-cream pb-10">
      <Wave fill="#ffd6e0" />
      <div className="relative mx-auto max-w-4xl px-4">
        <p className="label-sticker mb-2 text-sm">future nurse area</p>
        <p className="mb-4 font-hand text-xs text-ink-soft">tap the bar to keep training. tap the heart too.</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="relative rounded-[2rem] border-2 border-ink/10 bg-white/80 p-5 shadow-[5px_6px_0_rgba(74,63,85,0.07)]">
            <div className="mb-4 flex items-center gap-3 text-blush-deep">
              <button
                type="button"
                aria-label="stethoscope boop"
                className="border-0 bg-transparent p-0"
                onClick={() => notify("heartbeat: silly")}
              >
                <Stethoscope aria-hidden />
              </button>
              <button
                type="button"
                aria-label="send extra care"
                className="border-0 bg-transparent p-0"
                onClick={() => {
                  setCaring((n) => n + 1)
                  addFun(2)
                  notify("caring++")
                }}
              >
                <Heart aria-hidden className="anim-bob" />
              </button>
              <Activity aria-hidden />
            </div>
            <NurseBadge />
            <div className="mt-4 flex items-end gap-3">
              <Bandages />
              <MedBag />
              <Monitor />
            </div>
            <p className="mt-4 font-hand text-sm">future nurse loading…</p>
            <button
              type="button"
              className="mt-1 block h-4 w-full overflow-hidden rounded-full border-0 bg-lilac p-0"
              aria-valuenow={load}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="future nurse loading, tap to train"
              onClick={() => {
                setLoad((n) => Math.min(99, n + 1))
                addFun(1)
                notify(load >= 98 ? "almost a nurse. emotionally already." : "training +1")
              }}
            >
              <span className="block h-full rounded-full bg-mint-deep" style={{ width: `${load}%` }} />
            </button>
            <p className="mt-2 font-hand text-sm">kindness stat: MAX</p>
            <p className="font-hand text-xs text-ink-soft">caring: {caring}+</p>
          </div>
          <div className="flex flex-col items-center">
            <Pony name="nurse meadow" look={{ body: "#fff", mane: "#ff8fab", accessory: "nurse" }} />
            <Fish color="#ffd6e0" fin="#fff" extra="nurse" message="future nurse spotted" />
          </div>
        </div>
        <MrAlien mode="nurse" size={70} className="absolute top-4 right-8" interactive />
        <EasterEgg label="tiny heart" className="bottom-4 left-6">
          <Heart className="h-5 w-5 text-blush-deep" />
        </EasterEgg>
      </div>
    </Scene>
  )
}

function NurseBadge() {
  return (
    <svg width="90" height="70" viewBox="0 0 90 70" className="sticker" aria-hidden>
      <rect x="8" y="14" width="74" height="48" rx="10" fill="#fff" stroke="#4a3f55" strokeWidth="1.6" />
      <rect x="8" y="14" width="74" height="16" fill="#ff8fab" />
      <text x="45" y="26" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="Patrick Hand">
        NURSE
      </text>
      <text x="45" y="48" textAnchor="middle" fontSize="10" fill="#4a3f55" fontFamily="Patrick Hand">
        soon™
      </text>
    </svg>
  )
}

function Bandages() {
  return (
    <svg width="54" height="36" viewBox="0 0 54 36" aria-hidden>
      <rect x="4" y="12" width="46" height="14" rx="7" fill="#fff3c4" stroke="#4a3f55" strokeWidth="1.3" />
      <circle cx="20" cy="19" r="2" fill="#e8c39e" />
      <circle cx="28" cy="19" r="2" fill="#e8c39e" />
      <circle cx="36" cy="19" r="2" fill="#e8c39e" />
    </svg>
  )
}

function MedBag() {
  return (
    <svg width="50" height="44" viewBox="0 0 50 44" aria-hidden>
      <rect x="6" y="14" width="38" height="26" rx="6" fill="#8fd9b0" stroke="#4a3f55" strokeWidth="1.4" />
      <rect x="18" y="6" width="14" height="12" rx="3" fill="#8fd9b0" stroke="#4a3f55" strokeWidth="1.3" />
      <rect x="22" y="22" width="6" height="14" fill="#fff" />
      <rect x="18" y="26" width="14" height="6" fill="#fff" />
    </svg>
  )
}

function Monitor() {
  return (
    <svg width="70" height="44" viewBox="0 0 70 44" aria-hidden>
      <rect x="4" y="6" width="62" height="32" rx="6" fill="#1c2430" stroke="#4a3f55" strokeWidth="1.4" />
      <path d="M10 24 h10 l4-10 6 20 6-14 4 8 h16" stroke="#8fd9b0" strokeWidth="2" fill="none" />
    </svg>
  )
}
