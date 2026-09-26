import { useEffect, useMemo, useRef } from "react"
import { FISH_LINES } from "../game/messages"
import { useGame } from "../hooks/GameContext"
import { clamp, pick, rand } from "../lib/random"
import { PageShell } from "../ui/PageShell"
import { Panel, Pill } from "../ui/Button"
import { Fish, type FishExtra } from "../art/Fish"

type FishDef = {
  id: string
  name: string
  color: string
  fin: string
  extra: FishExtra
  size: number
  x: number
  y: number
  z: number
  hidden?: boolean
  heading: number
  target: number
  speed: number
  cruise: number
  turn: number
  wander: number
  vertical: number
  nextSteer: number
  facing: 1 | -1
  phase: number
}

const HABITS: Record<string, { cruise: number; turn: number; wander: number; vertical: number }> = {
  nurse: { cruise: 11, turn: 1.15, wander: 2.8, vertical: 0.42 },
  drive: { cruise: 17, turn: 0.95, wander: 3.4, vertical: 0.26 },
  money: { cruise: 13, turn: 1.2, wander: 2.5, vertical: 0.38 },
  burger: { cruise: 8.5, turn: 0.8, wander: 3.1, vertical: 0.48 },
  sleep: { cruise: 5.2, turn: 0.5, wander: 4.6, vertical: 0.32 },
  artist: { cruise: 12, turn: 1.05, wander: 2.7, vertical: 0.4 },
  confused: { cruise: 9.5, turn: 2.2, wander: 1.15, vertical: 0.68 },
  secret: { cruise: 7.8, turn: 1.35, wander: 2.1, vertical: 0.52 },
}

function wrapPi(a: number) {
  const t = Math.PI * 2
  return ((((a + Math.PI) % t) + t) % t) - Math.PI
}

function lerpAngle(from: number, to: number, t: number) {
  return from + wrapPi(to - from) * t
}

type FishSeed = Pick<FishDef, "id" | "name" | "color" | "fin" | "extra" | "size" | "z"> & { hidden?: boolean }

const START: FishSeed[] = [
  { id: "nurse", name: "Nurse Fish", color: "#ff8fae", fin: "#ffffff", extra: "nurse", size: 96, z: 1 },
  { id: "drive", name: "Driving Fish", color: "#ffd45e", fin: "#ffdbe6", extra: "car", size: 92, z: 2 },
  { id: "money", name: "Money Fish", color: "#8fcbec", fin: "#bfa9f0", extra: "coin", size: 100, z: 1 },
  { id: "burger", name: "Burger Fish", color: "#ffb48a", fin: "#8fddb4", extra: "burger", size: 88, z: 2 },
  { id: "sleep", name: "Sleepy Fish", color: "#bfa9f0", fin: "#ffeec2", extra: "star", size: 84, z: 3 },
  { id: "artist", name: "Artist Fish", color: "#8fddb4", fin: "#ffdbe6", extra: "none", size: 92, z: 2 },
  { id: "confused", name: "Confused Fish", color: "#ffeec2", fin: "#8fcbec", extra: "confused", size: 86, z: 1 },
  { id: "secret", name: "Hidden Fish", color: "#5b4450", fin: "#ffeec2", extra: "star", size: 70, z: 3, hidden: true },
]

export function Aquarium() {
  const { notify, play, patch, save, completeLevel, discoverSecret, poke, reducedMotion } = useGame()
  const fish = useMemo<FishDef[]>(
    () =>
      START.map((f, i) => {
        const habit = HABITS[f.id] ?? { cruise: 12, turn: 1, wander: 2.8, vertical: 0.4 }
        const heading = Math.random() < 0.5 ? rand(-0.28, 0.28) : Math.PI + rand(-0.28, 0.28)
        return {
          ...f,
          ...habit,
          x: 10 + (i % 4) * 20 + rand(-3, 3),
          y: 16 + Math.floor(i / 4) * 22 + rand(-4, 4),
          heading,
          target: heading,
          speed: habit.cruise,
          nextSteer: rand(0.6, 2.2),
          facing: Math.cos(heading) >= 0 ? 1 : -1,
          phase: rand(0, Math.PI * 2),
        }
      }),
    [],
  )
  const nodes = useRef(new Map<string, HTMLButtonElement>())
  const tankRef = useRef<HTMLDivElement>(null)
  const seen = useRef(new Set(save.collectedFish))

  // swim loop writes transforms straight to the DOM, so React never re-renders per frame
  useEffect(() => {
    if (reducedMotion) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      const tank = tankRef.current
      const tw = tank?.clientWidth ?? 0
      const th = tank?.clientHeight ?? 0
      for (const f of fish) {
        f.nextSteer -= dt
        if (f.nextSteer <= 0) {
          f.target = wrapPi(f.heading + rand(-0.9, 0.9) * (0.45 + f.wander * 0.2))
          f.nextSteer = rand(f.wander * 0.7, f.wander * 1.5)
          f.speed = f.cruise * rand(0.82, 1.14)
        }

        // glide away from the glass instead of bouncing, which used to flip them every frame
        if (f.x < 12) f.target = lerpAngle(f.target, rand(-0.35, 0.35), 0.55)
        else if (f.x > 78) f.target = lerpAngle(f.target, Math.PI + rand(-0.35, 0.35), 0.55)
        if (f.y < 10) f.target = lerpAngle(f.target, rand(0.35, Math.PI - 0.35), 0.45)
        else if (f.y > 68) f.target = lerpAngle(f.target, rand(-Math.PI + 0.35, -0.35), 0.45)

        const nearGlass = f.x < 11 || f.x > 79 || f.y < 9 || f.y > 69
        f.heading = lerpAngle(f.heading, f.target, 1 - Math.exp(-f.turn * (nearGlass ? 2.6 : 1) * dt))
        const vx = Math.cos(f.heading) * f.speed
        const vy = Math.sin(f.heading) * f.speed * f.vertical
        f.x = clamp(f.x + vx * dt, 3, 86)
        f.y = clamp(f.y + vy * dt + Math.sin(now / 900 + f.phase) * 0.35 * dt, 6, 72)

        const dir = Math.cos(f.heading)
        if (dir > 0.32) f.facing = 1
        else if (dir < -0.32) f.facing = -1

        const el = nodes.current.get(f.id)
        if (!el || !tw) continue
        const s = 1.05 - f.z * 0.07
        const tilt = clamp((vy / Math.max(4, f.speed)) * 14, -9, 9) * f.facing
        el.style.left = "0px"
        el.style.top = "0px"
        el.style.transform = `translate3d(${(f.x / 100) * tw}px, ${(f.y / 100) * th}px, 0) scale(${s * f.facing}, ${s}) rotate(${tilt}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [fish, reducedMotion])

  const tap = (f: FishDef, e: React.MouseEvent) => {
    play("bubble")
    notify(pick(FISH_LINES))
    poke(e.clientX, e.clientY, "spark")
    if (!seen.current.has(f.id)) {
      seen.current.add(f.id)
      patch((s) => ({ ...s, collectedFish: [...new Set([...s.collectedFish, f.id])] }))
    }
    if (f.hidden) discoverSecret("hidden-fish", "shy little fish found. it was hiding for the bit")
    if (seen.current.size >= 7 && !save.completedLevels.includes("aquarium")) completeLevel("aquarium")
  }

  return (
    <PageShell
      title="Aquarium"
      area="aquarium"
      subtitle="tap fish · they have jobs and feelings"
      tint="linear-gradient(180deg,#d7eefb 0%,#bfe4f5 60%,#a9d8ef 100%)"
      aside={<Pill className="bg-sky">{save.collectedFish.length}/8 inspected</Pill>}
    >
      <div
        ref={tankRef}
        className="stage mx-auto min-h-[24rem] max-w-3xl"
        data-testid="aquarium"
        style={{ background: "linear-gradient(180deg,#5fc0e0 0%,#2f8fb8 55%,#1b6382 100%)" }}
      >
        {/* light rays */}
        <svg viewBox="0 0 400 300" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M60 0l40 0-70 300-30 0z" fill="url(#ray)" opacity="0.5" />
          <path d="M210 0l30 0-40 300-26 0z" fill="url(#ray)" opacity="0.4" />
          <path d="M330 0l26 0 6 300-40 0z" fill="url(#ray)" opacity="0.35" />
          {/* sand */}
          <path d="M0 262c60-16 120 10 200 2s140-18 200-6v42H0z" fill="#f2dfbd" />
          <path d="M0 268c60-14 120 10 200 2s140-16 200-6" stroke="#fff" strokeWidth="2" fill="none" opacity="0.4" />
          {/* plants */}
          {[
            [40, "#4fae7e"],
            [92, "#68c795"],
            [330, "#4fae7e"],
            [366, "#68c795"],
          ].map(([x, c]) => (
            <g key={String(x)} className="anim-sway" style={{ transformOrigin: `${x}px 280px` }}>
              <path d={`M${x} 282c-14-26-6-56 4-74`} stroke={c as string} strokeWidth="9" fill="none" strokeLinecap="round" />
              <path d={`M${x} 282c12-20 8-44 0-58`} stroke={c as string} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
            </g>
          ))}
          {/* rocks + castle */}
          <ellipse cx="150" cy="276" rx="28" ry="12" fill="#a8a2b8" />
          <ellipse cx="176" cy="280" rx="16" ry="8" fill="#bdb6cc" />
          <g transform="translate(240 228)">
            <rect x="0" y="16" width="44" height="34" rx="4" fill="#e8d7c4" stroke="#b79c85" strokeWidth="2" />
            <rect x="-8" y="8" width="14" height="42" rx="3" fill="#f2e3d2" stroke="#b79c85" strokeWidth="2" />
            <rect x="38" y="8" width="14" height="42" rx="3" fill="#f2e3d2" stroke="#b79c85" strokeWidth="2" />
            <path d="M-8 8l7-10 7 10zM38 8l7-10 7 10z" fill="#ff8fae" stroke="#b79c85" strokeWidth="1.4" />
            <rect x="17" y="30" width="10" height="20" rx="5" fill="#8a7183" />
          </g>
        </svg>

        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute h-2.5 w-2.5 rounded-full border border-white/70 bg-white/30"
            style={{
              left: `${6 + i * 9}%`,
              bottom: "6%",
              animation: `bubble-up ${4 + (i % 3)}s linear infinite`,
              animationDelay: `${i * 0.45}s`,
            }}
          />
        ))}

        {fish.map((f) => (
          <button
            key={f.id}
            type="button"
            ref={(el) => {
              if (el) nodes.current.set(f.id, el)
              else nodes.current.delete(f.id)
            }}
            aria-label={f.name}
            className="hit-area absolute border-0 bg-transparent p-0 active:brightness-95"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: `scale(${1.05 - f.z * 0.07})`,
              opacity: f.hidden ? 0.4 : 1,
              zIndex: 10 - f.z,
              transformOrigin: "center center",
              willChange: "transform",
            }}
            onClick={(e) => tap(f, e)}
          >
            <Fish color={f.color} fin={f.fin} size={f.size} extra={f.extra} message={f.name} />
          </button>
        ))}

        {/* glass shine */}
        <span className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-gradient-to-br from-white/25 via-transparent to-white/10" />
      </div>

      <Panel className="mx-auto mt-3 max-w-3xl bg-white/85">
        <p className="font-hand text-sm">
          inspected {save.collectedFish.length}/8 · one of them is barely visible and very shy about it
        </p>
      </Panel>
    </PageShell>
  )
}
