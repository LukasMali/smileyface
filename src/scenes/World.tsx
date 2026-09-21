import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AREAS } from "../game/areas"
import { isAreaOpen } from "../game/progress"
import type { AreaId } from "../game/types"
import { useGame } from "../hooks/GameContext"
import { PageShell } from "../ui/PageShell"
import { GameButton, Pill, ProgressBar } from "../ui/Button"
import { Nikki } from "../art/Nikki"
import { MrAlien } from "../art/Alien"
import { Fish } from "../art/Fish"

const SHORT: Record<string, string> = {
  nini: "Nini",
  dreamland: "dreams",
  art: "art",
  aquarium: "fish",
  ponies: "ponies",
  "alien-bank": "bank",
  fruit: "fruit",
  nurse: "nurse",
  driving: "driving",
  nails: "nails",
  pool: "pool",
  burger: "burger",
  "shelf-revenge": "revenge",
  "food-shrine": "shrine",
  santa: "santa",
}

export function World() {
  const { save, play, notify, reducedMotion } = useGame()
  const nav = useNavigate()
  const open = AREAS.filter((a) => isAreaOpen(save, a.id)).length
  const done = AREAS.filter((a) => save.completedLevels.includes(a.id)).length

  return (
    <PageShell
      title="world map"
      area="world"
      subtitle="tap a place. finished ones keep a little green tick — you can always go back."
      tint="linear-gradient(180deg,#e7f5ff 0%,#dff2ea 45%,#fff4e2 100%)"
      aside={<Pill className="bg-mint">{done} finished</Pill>}
    >
      <div className="mx-auto mb-3 max-w-lg">
        <ProgressBar value={(done / AREAS.length) * 100} tone="mint" label="places finished" />
        <p className="mt-1 text-center font-hand text-xs text-ink-soft">
          {open}/{AREAS.length} places open · {done} finished · happiness {save.happiness}%
        </p>
      </div>

      <div className="stage mx-auto max-w-lg bg-gradient-to-b from-sky via-mint to-butter">
        <MapBackdrop />

        <div className="anim-float pointer-events-none absolute top-[78%] left-[36%] -translate-x-1/2">
          <Nikki pose="walk" size={50} />
        </div>
        <div className="anim-float-slow pointer-events-none absolute top-[42%] right-[7%]">
          <MrAlien size={48} />
        </div>
        <div className="anim-swim pointer-events-none absolute top-[63%] left-[18%] opacity-95">
          <Fish size={40} color="#8fcbec" fin="#ffdbe6" />
        </div>

        {AREAS.map((a, i) => {
          const unlocked = isAreaOpen(save, a.id)
          const finished = save.completedLevels.includes(a.id)
          return (
            <motion.button
              key={a.id}
              type="button"
              data-testid={`map-${a.id}`}
              aria-label={
                unlocked
                  ? `${a.name}${finished ? ", finished, play again" : ""}`
                  : `${a.name} locked, ${a.hint}`
              }
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-[1.1rem] border-[1.5px] px-2 py-1.5 font-hand text-[0.72rem] leading-none shadow-[0_6px_14px_-8px_rgba(91,68,80,0.85)] sm:text-[0.8rem] ${
                unlocked
                  ? finished
                    ? "border-mint-deep/70 bg-white text-ink"
                    : "border-ink/12 bg-white text-ink"
                  : "border-ink/10 bg-white/60 text-ink-soft saturate-50"
              }`}
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reducedMotion ? 0 : 0.03 * i, type: "spring", stiffness: 340, damping: 20 }}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                play("click")
                if (!unlocked) {
                  notify(`locked · ${a.hint}`)
                  return
                }
                nav(a.route)
              }}
            >
              <span className="flex items-center gap-1">
                <AreaGlyph id={a.id} muted={!unlocked} />
                {SHORT[a.id] ?? a.name}
                {!unlocked && <LockGlyph />}
              </span>
              {finished && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-mint-deep/70 bg-mint">
                  <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden>
                    <path d="M3 8.6l3.2 3.2L13 5" fill="none" stroke="#3c8159" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <Pill className="bg-white">
          <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 8.6l3.2 3.2L13 5" fill="none" stroke="#3c8159" strokeWidth="3" strokeLinecap="round" />
          </svg>
          finished · replayable
        </Pill>
        <GameButton size="sm" tone="pink" onClick={() => nav("/room")}>
          back to the room
        </GameButton>
      </div>
    </PageShell>
  )
}

function MapBackdrop() {
  return (
    <svg viewBox="0 0 400 640" className="block w-full" aria-hidden>
      <defs>
        <linearGradient id="map-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dff1ff" />
          <stop offset="100%" stopColor="#eaf7ef" />
        </linearGradient>
        <linearGradient id="map-land" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#c7efd3" />
          <stop offset="60%" stopColor="#a9e4c0" />
          <stop offset="100%" stopColor="#8ddcb0" />
        </linearGradient>
        <radialGradient id="map-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="640" fill="url(#map-sky)" />
      {/* gentle water rings around the island */}
      <g fill="none" stroke="#bfe6f7" strokeWidth="2" opacity="0.7">
        <path d="M6 46q104-26 198-6T396 46" />
        <path d="M6 606q104 32 198 12T396 606" />
      </g>
      <circle cx="336" cy="38" r="52" fill="url(#map-sun)" />
      <circle cx="336" cy="38" r="18" fill="#ffe89a" />

      {/* beach + island, sized so every pin sits on land */}
      <path
        d="M10 62Q110 28 202 52T392 62Q404 332 392 578Q202 630 10 578Q-2 332 10 62Z"
        fill="#fdf0d5"
        stroke="#f0ddba"
        strokeWidth="2"
      />
      <path
        d="M24 76Q114 44 202 66T378 76Q390 334 378 562Q202 612 24 562Q12 334 24 76Z"
        fill="url(#map-land)"
        stroke="#7cc79f"
        strokeWidth="3"
      />

      {/* grass tufts for a little texture */}
      <g stroke="#7ccb9e" strokeWidth="2" strokeLinecap="round" opacity="0.55" fill="none">
        {[
          [60, 140],
          [230, 170],
          [320, 300],
          [120, 250],
          [180, 330],
          [90, 480],
          [250, 560],
          [330, 430],
          [46, 340],
          [300, 120],
        ].map(([x, y]) => (
          <g key={`g-${x}-${y}`} transform={`translate(${x} ${y})`}>
            <path d="M-5 0c1-5 2-7 2-9" />
            <path d="M0 0c0-6 1-8 2-11" />
            <path d="M5 0c-1-5-1-7 0-9" />
          </g>
        ))}
      </g>

      {/* lagoon */}
      <ellipse cx="96" cy="410" rx="50" ry="25" fill="#a5dcf5" stroke="#7cc0e0" strokeWidth="2.5" />
      <path d="M64 404c14 6 42 6 60-4" stroke="#fff" strokeWidth="2.4" fill="none" opacity="0.6" />

      {/* path winding between the places */}
      {["#fff3df", "#e7cfae"].map((stroke, i) => (
        <path
          key={stroke}
          d="M84 118C150 148 250 96 320 140c56 36-22 78 12 126 40 34-36 64-16 110 20 44-58 62-28 106 18 30 56 34 78 4"
          fill="none"
          stroke={stroke}
          strokeWidth={i === 0 ? 13 : 2}
          strokeDasharray={i === 0 ? undefined : "9 12"}
          strokeLinecap="round"
          opacity={i === 0 ? 0.9 : 0.75}
        />
      ))}

      {/* scenery tucked between the pins */}
      {[
        [44, 200],
        [352, 220],
        [200, 470],
        [64, 520],
        [340, 540],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <ellipse cx="0" cy="16" rx="14" ry="4" fill="#6fbd93" opacity="0.5" />
          <rect x="-3" y="0" width="6" height="16" rx="3" fill="#b98b63" />
          <circle cx="0" cy="-8" r="16" fill="#83d5a5" stroke="#5fb083" strokeWidth="2" />
          <circle cx="-6" cy="-12" r="9" fill="#9ce2b8" opacity="0.8" />
        </g>
      ))}
      {[
        [150, 214],
        [268, 356],
        [72, 300],
        [300, 468],
        [128, 604],
      ].map(([x, y]) => (
        <g key={`f-${x}-${y}`} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-5" rx="3" ry="4.5" fill="#fff" transform={`rotate(${a})`} />
          ))}
          <circle cx="0" cy="0" r="2.6" fill="#ffd45e" />
        </g>
      ))}

      {/* soft clouds drifting over the island */}
      <g fill="#fff" opacity="0.62">
        <g className="anim-float">
          <ellipse cx="104" cy="150" rx="28" ry="12" />
          <ellipse cx="126" cy="145" rx="19" ry="10" />
        </g>
        <g className="anim-float-slow">
          <ellipse cx="262" cy="256" rx="24" ry="10" />
          <ellipse cx="280" cy="252" rx="16" ry="9" />
        </g>
      </g>
    </svg>
  )
}

function LockGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden>
      <rect x="3.2" y="7" width="9.6" height="6.6" rx="2" fill="#a08fa0" />
      <path d="M5.4 7V5.6a2.6 2.6 0 0 1 5.2 0V7" fill="none" stroke="#a08fa0" strokeWidth="1.7" />
    </svg>
  )
}

function AreaGlyph({ id, muted }: { id: AreaId; muted?: boolean }) {
  const o = muted ? 0.55 : 1
  const common = { opacity: o }
  switch (id) {
    case "nini":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <circle cx="8" cy="9" r="5" fill="#3c3038" />
          <path d="M3.4 5.4L2 1.6l3.6 2zM12.6 5.4L14 1.6l-3.6 2z" fill="#3c3038" />
          <circle cx="6.2" cy="8.4" r="1" fill="#fff" />
          <circle cx="9.8" cy="8.4" r="1" fill="#fff" />
        </svg>
      )
    case "dreamland":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <path d="M10.5 2a6 6 0 1 0 3.5 10.6A6.6 6.6 0 0 1 10.5 2z" fill="#bfa9f0" stroke="#8a72c0" strokeWidth="1" />
        </svg>
      )
    case "art":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <path d="M8 2a6 6 0 0 0 0 12c1.6 0 1-1.6 2-2s3-.4 3-3.6A6 6 0 0 0 8 2z" fill="#fff" stroke="#5b4450" strokeWidth="1" />
          <circle cx="5.6" cy="6" r="1.2" fill="#ff8fae" />
          <circle cx="9" cy="5" r="1.2" fill="#8fcbec" />
          <circle cx="5.4" cy="9.6" r="1.2" fill="#ffd45e" />
        </svg>
      )
    case "aquarium":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <path d="M2 8c0-2.4 2.4-4 5-4s4.6 1.6 4.6 4S9.6 12 7 12 2 10.4 2 8z" fill="#8fcbec" />
          <path d="M11.4 6L15 4v8l-3.6-2z" fill="#ffdbe6" />
          <circle cx="5" cy="7.2" r="0.9" fill="#3c3038" />
        </svg>
      )
    case "ponies":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <path d="M4 13V7c0-3 2-5 5-5 2.4 0 4 1.4 4 3.4 0 2-2 2.6-3 4.2-.6 1-.6 2-.6 3.4z" fill="#ffdbe6" stroke="#5b4450" strokeWidth="1" />
          <circle cx="9.6" cy="5.6" r="1" fill="#3c3038" />
        </svg>
      )
    case "alien-bank":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <ellipse cx="8" cy="10" rx="6.5" ry="2.6" fill="#bfa9f0" />
          <circle cx="8" cy="6.4" r="3.4" fill="#a8dd82" stroke="#5b4450" strokeWidth="0.9" />
          <circle cx="6.8" cy="6.2" r="0.8" fill="#2a2333" />
          <circle cx="9.2" cy="6.2" r="0.8" fill="#2a2333" />
        </svg>
      )
    case "fruit":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <path d="M8 14c-3 0-5-2.4-5-5s2-4 5-4 5 1.4 5 4-2 5-5 5z" fill="#ef6b92" />
          <path d="M8 5c0-2 1.6-3.4 3.4-3.4" stroke="#68bb87" strokeWidth="1.4" fill="none" />
        </svg>
      )
    case "nurse":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <circle cx="8" cy="8" r="6" fill="#fff" stroke="#5b4450" strokeWidth="1" />
          <rect x="6.6" y="4" width="2.8" height="8" rx="1" fill="#ff8fae" />
          <rect x="4" y="6.6" width="8" height="2.8" rx="1" fill="#ff8fae" />
        </svg>
      )
    case "driving":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <rect x="1.6" y="7" width="12.8" height="4.4" rx="2" fill="#8fcbec" stroke="#5b4450" strokeWidth="0.9" />
          <path d="M4 7l1.6-2.6h5L12 7z" fill="#e7f5ff" stroke="#5b4450" strokeWidth="0.9" />
          <circle cx="4.6" cy="12" r="1.6" fill="#4b3f52" />
          <circle cx="11.4" cy="12" r="1.6" fill="#4b3f52" />
        </svg>
      )
    case "nails":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <path d="M5 14V6a3 3 0 0 1 6 0v8z" fill="#ffdbe6" stroke="#5b4450" strokeWidth="1" />
          <path d="M5 6.4a3 3 0 0 1 6 0z" fill="#ff8fae" />
        </svg>
      )
    case "pool":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <circle cx="8" cy="8" r="6" fill="#fffdf8" stroke="#5b4450" strokeWidth="1" />
          <circle cx="8" cy="8" r="2.6" fill="#ffd45e" />
        </svg>
      )
    case "burger":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <path d="M2.6 7C2.6 4.4 5 3 8 3s5.4 1.4 5.4 4z" fill="#e8bb84" stroke="#5b4450" strokeWidth="0.9" />
          <rect x="2.6" y="7.4" width="10.8" height="2" rx="1" fill="#7fd3a1" />
          <path d="M2.6 10.4h10.8c0 2-2.4 3-5.4 3s-5.4-1-5.4-3z" fill="#e8bb84" stroke="#5b4450" strokeWidth="0.9" />
        </svg>
      )
    case "shelf-revenge":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <rect x="2" y="3" width="12" height="2" rx="1" fill="#c2996f" />
          <rect x="2" y="8" width="12" height="2" rx="1" fill="#c2996f" />
          <rect x="4.4" y="10" width="3.6" height="3.4" rx="1" fill="#f6dcb8" stroke="#5b4450" strokeWidth="0.8" />
        </svg>
      )
    case "food-shrine":
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <ellipse cx="8" cy="10.6" rx="6.4" ry="2.4" fill="#fff" stroke="#5b4450" strokeWidth="0.9" />
          <ellipse cx="7" cy="8.6" rx="3.4" ry="2.2" fill="#fff2ce" />
          <circle cx="11" cy="9" r="2" fill="#68bb87" />
        </svg>
      )
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 16 16" style={common} aria-hidden>
          <path d="M2.6 12c1.4-6 5-9 8.6-9.6 1.6-.2 2.8 1 2.4 2.4-1 3.6-4.6 6.4-11 7.2z" fill="#ef6b92" stroke="#5b4450" strokeWidth="0.9" />
          <circle cx="13.4" cy="3.4" r="1.6" fill="#fff" />
        </svg>
      )
  }
}

export function LockedGate({ id, hint }: { id: AreaId; hint: string }) {
  const nav = useNavigate()
  return (
    <PageShell title="not yet" area="world" subtitle="this door is doing a dramatic pause" tint="#f1eaff">
      <div className="soft-card mx-auto max-w-md p-5 text-center">
        <p className="font-hand text-lg">{hint}</p>
        <GameButton className="mt-4" tone="pink" onClick={() => nav("/world")}>
          back to map
        </GameButton>
      </div>
      <span className="sr-only">{id}</span>
    </PageShell>
  )
}
