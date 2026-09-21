import { useNavigate } from "react-router-dom"
import { AREAS } from "../game/areas"
import { isAreaOpen } from "../game/progress"
import type { AreaId } from "../game/types"
import { useGame } from "../hooks/GameContext"
import { PageShell } from "../ui/PageShell"
import { Nikki } from "../art/Nikki"
import { MrAlien } from "../components/characters/MrAlien"

const PINS: Record<string, string> = {
  nini: "Nini",
  dreamland: "Dreams",
  art: "Art",
  aquarium: "Fish",
  ponies: "Ponies",
  "alien-bank": "Bank",
  fruit: "Fruit",
  nurse: "Nurse",
  driving: "Drive",
  nails: "Nails",
  pool: "Pool",
  burger: "Burger",
  "shelf-revenge": "Shelf",
  "food-shrine": "Shrine",
  santa: "Santa",
}

export function World() {
  const { save, play, notify } = useGame()
  const nav = useNavigate()
  const sparkles = Math.floor(save.happiness / 10)

  return (
    <PageShell title="world map" area="world" tint="#c5e8f7">
      <p className="mb-3 font-hand text-sm text-ink-soft">tap a place. locked ones are shy until you explore more.</p>
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-[1.8rem] border-2 border-ink/10 bg-linear-to-b from-sky via-mint to-[#fff3c4] shadow-[8px_10px_0_rgba(74,63,85,0.08)]">
        <svg viewBox="0 0 400 640" className="block w-full" aria-hidden>
          <ellipse cx="200" cy="520" rx="180" ry="70" fill="#8fd9b0" opacity="0.45" />
          <ellipse cx="120" cy="240" rx="90" ry="40" fill="#fff" opacity="0.55" className="map-cloud" />
          <ellipse cx="300" cy="160" rx="70" ry="30" fill="#fff" opacity="0.5" className="map-cloud" />
          <ellipse cx="80" cy="400" rx="50" ry="18" fill="#7ec8e3" opacity="0.5" />
          {Array.from({ length: sparkles }).map((_, i) => (
            <text key={i} x={30 + (i * 47) % 340} y={40 + (i % 9) * 64} fontSize="10" fill="#fff8e7">
              ✦
            </text>
          ))}
        </svg>
        <div className="pointer-events-none absolute left-[8%] top-[18%] anim-float">
          <Nikki pose="walk" size={48} />
        </div>
        <div className="pointer-events-none absolute right-[10%] top-[40%] anim-float-slow">
          <MrAlien size={48} />
        </div>
        <span className="pointer-events-none absolute top-[8%] left-[40%] text-lg anim-float">☁️</span>
        <span className="pointer-events-none absolute top-[46%] left-[6%] text-lg" style={{ animation: "swim 8s ease-in-out infinite" }}>
          🐟
        </span>
        <span className="pointer-events-none absolute top-[58%] right-[12%] text-lg anim-bob">🐴</span>
        <span className="pointer-events-none absolute bottom-[18%] left-[30%] text-sm" style={{ animation: "drive-by 10s linear infinite" }}>
          🚗
        </span>

        {AREAS.map((a) => {
          const open = isAreaOpen(save, a.id)
          const pin = PINS[a.id] ?? a.name
          return (
            <button
              key={a.id}
              type="button"
              data-testid={`map-${a.id}`}
              aria-label={open ? a.name : `${a.name} locked, ${a.hint}`}
              className={`absolute z-10 min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 px-2 py-1 font-hand text-[11px] leading-tight shadow-[3px_4px_0_rgba(74,63,85,0.1)] sm:text-xs ${
                open ? "border-ink/10 bg-white/95 text-ink" : "border-ink/10 bg-white/70 text-ink"
              }`}
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
              onClick={() => {
                play("click")
                if (!open) {
                  notify(`locked · ${a.hint}`)
                  return
                }
                nav(a.route)
              }}
            >
              {open ? pin : `🔒 ${pin}`}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-center font-hand text-xs text-ink-soft">happiness {save.happiness}% · the world gets louder as you go</p>
    </PageShell>
  )
}

export function LockedGate({ id, hint }: { id: AreaId; hint: string }) {
  const nav = useNavigate()
  return (
    <PageShell title="not yet" area="world" tint="#e0d4f7">
      <p className="font-hand text-lg">this door is doing a dramatic pause.</p>
      <p className="mt-2 font-hand text-sm text-ink-soft">{hint}</p>
      <button type="button" className="mt-4 rounded-full bg-white px-4 py-2 font-hand" onClick={() => nav("/world")}>
        back to map
      </button>
      <span className="sr-only">{id}</span>
    </PageShell>
  )
}
