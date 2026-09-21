import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Nikki } from "../art/Nikki"
import { SantaArt } from "../art/Santa"
import { MrAlien } from "../components/characters/MrAlien"
import { Fish } from "../components/characters/Fish"
import { Coin } from "../components/characters/MrAlien"
import { CHAIR_LINES, NIKKI_LINES } from "../game/messages"
import { MEMORY_EGG } from "../game/memoryEgg"
import { SHELF_ITEMS } from "../game/progress"
import { useGame } from "../hooks/GameContext"
import { pick } from "../lib/random"
import { playNote } from "../audio/sound"
import { GameButton } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const RGB = ["#7cff9a", "#ff8fab", "#8ecae6", "#c4b0ea", "#fff3c4", "#ff9f43"]
const KEY_NOTES = [523, 587, 659, 698, 784, 880, 988]

export function Room() {
  const { save, patch, notify, play, sweetNote, discoverSecret, petNikki, completeLevel } = useGame()
  const nav = useNavigate()
  const [boot, setBoot] = useState(false)
  const [keys, setKeys] = useState<number[]>([])
  const night = save.finaleReady
  const sparkles = Math.floor(save.happiness / 12)
  const shelf = SHELF_ITEMS.filter((i) => i.need(save))

  const wallpaper = useMemo(() => (night ? "#2c2a4a" : "#f7cfe3"), [night])

  const startPc = () => {
    if (save.bootDone) {
      notify("already on. obviously.")
      play("click")
      return
    }
    setBoot(true)
    play("chime")
    window.setTimeout(() => {
      patch((s) => ({ ...s, bootDone: true, pcStarted: true }))
      setBoot(false)
      notify("hello :)")
    }, 1600)
  }

  return (
    <PageShell title="her little setup" area="room" tint={night ? "#1c1a33" : "#f4e4d4"} night={night}>
      <p className="mb-3 font-hand text-sm text-ink-soft" style={{ color: night ? "#e0d4f7" : undefined }}>
        tap the monitors, the tower, the chair, the tiny suspicious objects. this is HQ.
      </p>

      <div
        className={`room-stage ${night ? "room-night" : ""}`}
        data-testid="room-stage"
        style={{ ["--wall" as string]: night ? "#3a3660" : "#f3e6d4", ["--desk" as string]: "#efe4d2" }}
      >
        {Array.from({ length: sparkles }).map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute text-[10px] anim-twinkle"
            style={{ left: `${8 + (i * 13) % 84}%`, top: `${6 + (i % 5) * 8}%` }}
          >
            ✦
          </span>
        ))}

        <button
          type="button"
          className="absolute top-[6%] left-[6%] z-10 w-[18%] min-w-11 border-0 bg-transparent p-0"
          aria-label="cute poster"
          onClick={() => {
            play("click")
            notify(sweetNote())
          }}
        >
          <svg viewBox="0 0 80 120" className="w-full drop-shadow-md">
            <rect x="2" y="2" width="76" height="116" rx="4" fill="#ffd6e0" stroke="#4a3f55" strokeWidth="2" />
            <circle cx="40" cy="48" r="18" fill="#fff8e7" />
            <circle cx="34" cy="46" r="3" fill="#2a2430" />
            <circle cx="46" cy="46" r="3" fill="#2a2430" />
            <path d="M32 56 q8 8 16 0" stroke="#4a3f55" fill="none" />
            <text x="40" y="96" textAnchor="middle" fontSize="8" fill="#4a3f55" fontFamily="Patrick Hand">
              tiny world
            </text>
          </svg>
        </button>

        <div className="absolute top-[7%] right-[8%] left-[32%] h-[22%]">
          <svg viewBox="0 0 260 70" className="h-full w-full">
            <rect x="4" y="18" width="252" height="10" rx="2" fill="#fff" stroke="#d7c8b6" />
            <rect x="8" y="4" width="244" height="18" rx="2" fill="#fff" />
          </svg>
          <div className="absolute inset-x-2 top-0 flex h-[70%] items-end justify-around">
            {shelf.map((item) => (
              <button
                key={item.id}
                type="button"
                className="hit-area border-0 bg-transparent p-0"
                aria-label={item.label}
                onClick={() => {
                  play("sparkle")
                  notify(item.label)
                }}
              >
                <ShelfBit id={item.id} />
              </button>
            ))}
            {shelf.length === 0 && <p className="font-hand text-[10px] text-ink-soft/70">empty shelf. go adventuring.</p>}
          </div>
        </div>

        <Hotspot x="8%" y="38%" w="28%" label="left monitor, world map" testid="monitor-map" onClick={() => nav("/world")}>
          <Monitor slant wallpaper={wallpaper} caption="WORLD" night={night} on={save.bootDone} />
        </Hotspot>
        <Hotspot x="36%" y="34%" w="34%" label="right monitor, digital art" testid="monitor-art" onClick={() => nav("/art")}>
          <Monitor wallpaper={night ? "#35305c" : "#f6d9ef"} caption="ART" night={night} on={save.bootDone} />
        </Hotspot>

        <Hotspot
          x="70%"
          y="36%"
          w="26%"
          label="RGB PC tower"
          testid="pc-tower"
          onClick={() => {
            patch((s) => ({ ...s, rgbMode: (s.rgbMode + 1) % RGB.length }))
            play("click")
            notify("rgb aura: upgraded")
          }}
        >
          <PcTower glow={RGB[save.rgbMode] ?? RGB[0]} />
        </Hotspot>

        <Hotspot
          x="74%"
          y="28%"
          w="18%"
          label="headphones, toggle ambience"
          testid="headphones"
          onClick={() => {
            patch((s) => ({ ...s, headphonesOn: !s.headphonesOn }))
            notify(save.headphonesOn ? "quiet mode" : "soft ambience on")
          }}
        >
          <Headphones on={save.headphonesOn} />
        </Hotspot>

        <Hotspot
          x="72%"
          y="58%"
          w="12%"
          label="PC power button"
          testid="power-btn"
          onClick={startPc}
        >
          <span className={`inline-block h-7 w-7 rounded-full border-2 border-ink/30 ${save.bootDone ? "bg-mint-deep" : "bg-blush"}`} />
        </Hotspot>

        <Hotspot
          x="18%"
          y="68%"
          w="46%"
          label="pink keyboard"
          testid="keyboard"
          onClick={() => {
            const i = keys.length % KEY_NOTES.length
            playNote(KEY_NOTES[i] ?? 523)
            setKeys((k) => [...k.slice(-8), i])
            notify("clicky clack")
          }}
        >
          <Keyboard lit={keys.length} />
        </Hotspot>

        <Hotspot
          x="58%"
          y="70%"
          w="12%"
          label="sparkly mouse"
          testid="mouse"
          onClick={() => {
            play("sparkle")
            discoverSecret("desk-mouse", "the mouse knows things")
          }}
        >
          <Mouse />
        </Hotspot>

        <Hotspot
          x="2%"
          y="62%"
          w="16%"
          label="gaming chair"
          testid="chair"
          onClick={() => {
            play("pop")
            notify(pick(CHAIR_LINES))
          }}
        >
          <Chair />
        </Hotspot>

        <Hotspot
          x="40%"
          y="62%"
          w="14%"
          label="hidden desk drawer"
          onClick={() => {
            notify(sweetNote())
            discoverSecret("desk-drawer")
          }}
        >
          <span className="block h-3 w-10 rounded-sm bg-[#d9c4a8]" />
        </Hotspot>

        {MEMORY_EGG.enabled && (
          <Hotspot
            x="28%"
            y="58%"
            w="10%"
            label={MEMORY_EGG.label}
            testid="memory-egg"
            onClick={() => discoverSecret(MEMORY_EGG.id, MEMORY_EGG.text)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22">
              <path fill="#fff3c4" stroke="#e8d48a" d="M11 1 13 8h7l-5.5 4 2 8L11 16l-5.5 4 2-8L2 8h7z" />
            </svg>
          </Hotspot>
        )}

        <div className="absolute right-[6%] bottom-[4%] z-20">
          <button
            type="button"
            aria-label="pet Nikki"
            className="hit-area border-0 bg-transparent p-0"
            data-testid="room-nini"
            onClick={() => {
              const line = pick(NIKKI_LINES)
              petNikki(line)
              notify(line)
            }}
          >
            <Nikki pose={night ? "sleep" : save.happiness > 50 ? "sit" : "stand"} size={92} />
          </button>
        </div>

        {save.happiness > 35 && (
          <div className="absolute top-[48%] left-[4%] opacity-90">
            <Fish color="#8ecae6" fin="#ffd6e0" size={48} extra="none" message="why am I in the PC room" />
          </div>
        )}

        {night && (
          <>
            <MrAlien size={54} className="absolute top-[12%] right-[30%] anim-float" />
            {save.nailDesign && <span className="absolute bottom-[18%] left-[22%] text-[10px] font-hand">nails polaroid 💅</span>}
          </>
        )}

        {boot && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-night/50">
            <p className="rounded-full bg-white px-4 py-2 font-hand text-lg">starting up… hello :)</p>
          </div>
        )}
        {!save.bootDone && !boot && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1c1a33]/45 px-4 text-center">
            <p className="font-hand text-2xl text-cream">I made you a tiny world ✨</p>
            <p className="mt-1 font-hand text-sm text-lilac">tap everything. especially the suspicious corners.</p>
            <GameButton className="mt-4" tone="pink" testid="power-start" onClick={startPc}>
              power on
            </GameButton>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <GameButton tone="pink" testid="open-map" onClick={() => nav("/world")}>
          world map
        </GameButton>
        <GameButton onClick={() => nav("/achievements")}>trophies</GameButton>
        <GameButton tone="mint" onClick={() => notify(sweetNote())}>
          fortune cookie
        </GameButton>
        <GameButton
          tone="lilac"
          onClick={() => {
            if (!save.completedLevels.includes("nini") && save.niniComfy) completeLevel("nini")
            nav("/nini")
          }}
        >
          visit Nini
        </GameButton>
      </div>
    </PageShell>
  )
}

function Hotspot({
  x,
  y,
  w,
  label,
  onClick,
  children,
  testid,
}: {
  x: string
  y: string
  w: string
  label: string
  onClick: () => void
  children: React.ReactNode
  testid?: string
}) {
  return (
    <button
      type="button"
      data-testid={testid}
      aria-label={label}
      className="absolute z-10 min-h-11 border-0 bg-transparent p-0"
      style={{ left: x, top: y, width: w }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function Monitor({
  slant,
  wallpaper,
  caption,
  night,
  on,
}: {
  slant?: boolean
  wallpaper: string
  caption: string
  night: boolean
  on: boolean
}) {
  return (
    <svg viewBox="0 0 160 110" className="w-full drop-shadow-lg" style={{ transform: slant ? "perspective(400px) rotateY(18deg)" : undefined }}>
      <rect x="8" y="6" width="144" height="88" rx="8" fill="#1c1a20" />
      <rect x="14" y="12" width="132" height="74" rx="4" fill={on ? wallpaper : "#111"} />
      {on && (
        <>
          <circle cx="48" cy="48" r="14" fill="#fff8e7" opacity="0.9" />
          <circle cx="86" cy="50" r="14" fill="#e0d4f7" opacity="0.9" />
          <text x="80" y="78" textAnchor="middle" fontSize="11" fill={night ? "#fff" : "#4a3f55"} fontFamily="Patrick Hand">
            {caption}
          </text>
        </>
      )}
      <rect x="70" y="94" width="20" height="10" fill="#2a2430" />
      <rect x="50" y="104" width="60" height="5" rx="2" fill="#2a2430" />
    </svg>
  )
}

function PcTower({ glow }: { glow: string }) {
  return (
    <svg viewBox="0 0 90 130" className="w-full">
      <rect x="12" y="8" width="66" height="114" rx="8" fill="#f3c1c7" stroke="#d9a8b0" strokeWidth="2" />
      <rect x="20" y="18" width="50" height="70" rx="4" fill="#1c1a20" />
      <circle cx="45" cy="50" r="18" fill={glow} opacity="0.85">
        <animate attributeName="opacity" values="0.55;1;0.55" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <rect x="24" y="96" width="42" height="6" rx="2" fill="#8fd9b0" />
      <rect x="24" y="106" width="18" height="6" rx="2" fill="#fff" />
    </svg>
  )
}

function Headphones({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 80 50" className="w-full">
      <path d="M12 28 q28 -28 56 0" stroke="#7bb8b0" strokeWidth="8" fill="none" />
      <rect x="4" y="24" width="16" height="20" rx="6" fill="#8fd4cc" />
      <rect x="60" y="24" width="16" height="20" rx="6" fill="#8fd4cc" />
      {on && <circle cx="40" cy="18" r="4" fill="#fff3c4" />}
    </svg>
  )
}

function Keyboard({ lit }: { lit: number }) {
  return (
    <svg viewBox="0 0 220 56" className="w-full">
      <rect x="4" y="8" width="212" height="40" rx="8" fill="#f4c2d0" stroke="#e8a0b4" strokeWidth="2" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect
          key={i}
          x={12 + i * 14}
          y={16}
          width="11"
          height="10"
          rx="2"
          fill={i === lit % 14 ? "#fff" : "#ffd6e0"}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={`b${i}`} x={20 + i * 14} y={30} width="11" height="10" rx="2" fill="#ffe4ec" />
      ))}
    </svg>
  )
}

function Mouse() {
  return (
    <svg viewBox="0 0 40 52" className="w-16">
      <rect x="8" y="4" width="24" height="42" rx="12" fill="#e8d5f2" stroke="#c4b0ea" strokeWidth="1.6" />
      <path d="M20 8 v16" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}

function Chair() {
  return (
    <svg viewBox="0 0 70 90" className="w-full">
      <rect x="14" y="8" width="42" height="36" rx="10" fill="#d7c4e8" stroke="#4a3f55" strokeWidth="1.4" />
      <rect x="10" y="40" width="50" height="12" rx="4" fill="#c4b0ea" />
      <rect x="32" y="52" width="8" height="28" fill="#6b5d78" />
    </svg>
  )
}

function ShelfBit({ id }: { id: string }) {
  if (id === "alien") return <MrAlien size={36} />
  if (id === "santa") return <SantaArt size={36} />
  if (id === "nikki") return <Nikki pose="sit" size={40} />
  if (id === "pool-trophy")
    return (
      <svg width="24" height="28" viewBox="0 0 24 28">
        <path d="M6 8 h12 v8 h-12z" fill="#f4d35e" />
        <rect x="10" y="16" width="4" height="8" fill="#c4b0ea" />
      </svg>
    )
  if (id === "fruit") return <span className="text-lg">🍓</span>
  if (id === "cactus") return <span className="text-lg">🌵</span>
  if (id === "burger") return <span className="text-lg">🍔</span>
  if (id === "nails") return <span className="text-lg">💅</span>
  if (id === "pudding") return <span className="text-lg">🍮</span>
  if (id === "licence") return <span className="text-lg">🪪</span>
  if (id === "nurse-badge") return <span className="text-lg">🩺</span>
  if (id === "meal") return <span className="text-lg">🥔</span>
  return <Coin size={18} />
}
