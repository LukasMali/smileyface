import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Nikki } from "../art/Nikki"
import { SantaArt } from "../art/Santa"
import { MrAlien, Coin } from "../art/Alien"
import { Fish } from "../art/Fish"
import {
  CactusIceCream,
  FruitBasket,
  GiftBox,
  Licence,
  NailPolish,
  NurseBadge,
  PuddingCup,
  Trophy,
  Burger as BurgerArt,
  LegendaryPlate,
} from "../art/Props"
import { CHAIR_LINES, NIKKI_LINES } from "../game/messages"
import { MEMORY_EGG } from "../game/memoryEgg"
import { SHELF_ITEMS } from "../game/progress"
import { ART_KEY } from "../game/types"
import { useGame } from "../hooks/GameContext"
import { pick } from "../lib/random"
import { playNote } from "../audio/sound"
import { GameButton, Pill } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const RGB = ["#7cff9a", "#ff8fae", "#8fcbec", "#bfa9f0", "#ffd45e", "#ff9f6b"]
const KEY_NOTES = [523, 587, 659, 698, 784, 880, 988]

function readSavedArt() {
  try {
    return sessionStorage.getItem(ART_KEY)
  } catch {
    return null
  }
}

export function Room() {
  const { save, patch, notify, play, sweetNote, discoverSecret, petNikki, completeLevel, reducedMotion } = useGame()
  const nav = useNavigate()
  const [boot, setBoot] = useState(false)
  const [keys, setKeys] = useState(0)
  const night = save.finaleReady
  const sparkles = Math.floor(save.happiness / 12)
  const shelf = SHELF_ITEMS.filter((i) => i.need(save))

  // the monitor shows whatever was last painted in the art studio, re-read when artDrawn flips
  const art = useMemo(
    () => readSavedArt(),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- artDrawn is the signal that sessionStorage changed
    [save.artDrawn],
  )

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
    }, 1500)
  }

  return (
    <PageShell
      title="her little setup"
      area="room"
      subtitle="tap the monitors, the tower, the chair, the suspicious little objects"
      tint={night ? "linear-gradient(180deg,#24204a 0%,#191634 100%)" : "linear-gradient(180deg,#fff3ea 0%,#ffe9e0 60%,#f7e0ec 100%)"}
      night={night}
      aside={<Pill className={night ? "bg-night text-cream" : "bg-butter"}>{night ? "night mode" : "day mode"}</Pill>}
    >
      <div
        className="stage aspect-[4/3] w-full"
        data-testid="room-stage"
        style={{
          background: night
            ? "linear-gradient(180deg,#3a3566 0%,#2b2750 55%,#221e42 100%)"
            : "linear-gradient(180deg,#ffe7d8 0%,#ffd9cf 48%,#f7c9d8 100%)",
        }}
      >
        {/* wall, desk and floor — same 400x300 grid the hotspots are placed on */}
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="room-desk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={night ? "#7a68a0" : "#fbeed8"} />
              <stop offset="55%" stopColor={night ? "#6a5a86" : "#f3ddbe"} />
              <stop offset="100%" stopColor={night ? "#574a76" : "#e9cca6"} />
            </linearGradient>
            <linearGradient id="room-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={night ? "#2c2750" : "#f6cdd6"} />
              <stop offset="100%" stopColor={night ? "#231f42" : "#eebac9"} />
            </linearGradient>
            <radialGradient id="room-lamp" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#fff3c4" stopOpacity={night ? 0.5 : 0.35} />
              <stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* floor + soft baseboard */}
          <rect x="0" y="208" width="400" height="92" fill="url(#room-floor)" />
          <rect x="0" y="204" width="400" height="6" fill={night ? "#453b72" : "#f7dfd2"} />
          <ellipse cx="200" cy="268" rx="152" ry="28" fill={night ? "#4a3f75" : "#ffd6e0"} opacity="0.8" />
          <ellipse cx="200" cy="268" rx="112" ry="18" fill={night ? "#5a4d8a" : "#fff0f5"} opacity="0.65" />

          {/* fairy lights */}
          <path d="M-10 18C60 46 140 8 210 32s130-8 200 12" fill="none" stroke={night ? "#6f6296" : "#e9c7b6"} strokeWidth="2" />
          {Array.from({ length: 12 }).map((_, i) => (
            <circle
              key={i}
              cx={4 + i * 34}
              cy={i % 2 === 0 ? 26 : 20}
              r="4.4"
              fill={["#ffd45e", "#ff8fae", "#8fcbec", "#8fddb4"][i % 4]}
              className="anim-twinkle"
              style={{ animationDelay: `${i * 0.24}s` }}
              opacity={night ? 1 : 0.85}
            />
          ))}

          {/* desk: chunky top, front lip, two legs */}
          <rect x="30" y="210" width="16" height="62" rx="7" fill={night ? "#4a3f75" : "#dfba92" } />
          <rect x="354" y="210" width="16" height="62" rx="7" fill={night ? "#4a3f75" : "#dfba92"} />
          <rect x="8" y="168" width="384" height="36" rx="13" fill="url(#room-desk)" stroke={night ? "#3a3160" : "#d9b894"} strokeWidth="2.4" />
          <rect x="18" y="174" width="364" height="9" rx="4.5" fill="#fff" opacity={night ? 0.12 : 0.5} />
          <rect x="8" y="200" width="384" height="12" rx="6" fill={night ? "#4a3f75" : "#dfba92"} />

          <ellipse cx="200" cy="140" rx="190" ry="120" fill="url(#room-lamp)" />
        </svg>

        {/* window */}
        <div className="pointer-events-none absolute top-[6%] right-[3%] w-[21%]">
          <svg viewBox="0 0 86 72" className="w-full" aria-hidden>
            <rect x="1.5" y="1.5" width="83" height="69" rx="10" fill={night ? "#2a2a52" : "#cfeeff"} stroke={night ? "#7b6ca6" : "#e7c9b4"} strokeWidth="3" />
            <path d="M43 1.5v69M1.5 36h83" stroke={night ? "#7b6ca6" : "#fff"} strokeWidth="3" opacity="0.8" />
            {night ? (
              <>
                <circle cx="24" cy="20" r="9" fill="#fff6d6" />
                <circle cx="62" cy="48" r="1.8" fill="#fff" />
                <circle cx="30" cy="54" r="1.4" fill="#fff" />
              </>
            ) : (
              <>
                <circle cx="62" cy="20" r="10" fill="#ffe89a" />
                <ellipse cx="26" cy="46" rx="16" ry="7" fill="#fff" opacity="0.85" />
              </>
            )}
            <rect x="-2" y="68" width="90" height="6" rx="3" fill={night ? "#6b5c96" : "#e7c9b4"} />
          </svg>
        </div>

        {Array.from({ length: sparkles }).map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute anim-twinkle text-[11px]"
            style={{ left: `${8 + ((i * 13) % 84)}%`, top: `${8 + (i % 5) * 7}%`, color: night ? "#fff3c4" : "#ffffff" }}
          >
            ✦
          </span>
        ))}

        {/* poster */}
        <Hotspot x="3%" y="7%" w="14%" label="cute poster" onClick={() => { play("click"); notify(sweetNote()) }}>
          <svg viewBox="0 0 80 110" className="w-full drop-shadow-md">
            <rect x="2" y="2" width="76" height="106" rx="7" fill={night ? "#4b4479" : "#ffdbe6"} stroke="#5b4450" strokeWidth="2.4" />
            <circle cx="40" cy="44" r="20" fill="#fffaf2" stroke="#5b4450" strokeWidth="1.6" />
            <circle cx="33" cy="41" r="2.8" fill="#3c3038" />
            <circle cx="47" cy="41" r="2.8" fill="#3c3038" />
            <path d="M33 52c4 4 10 4 14 0" stroke="#5b4450" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="28" cy="48" r="4" fill="#ff8fae" opacity="0.4" />
            <circle cx="52" cy="48" r="4" fill="#ff8fae" opacity="0.4" />
            <text x="40" y="90" textAnchor="middle" fontSize="10" fontWeight="700" fill={night ? "#ffe6f1" : "#5b4450"} fontFamily="Baloo 2, sans-serif">
              tiny world
            </text>
          </svg>
        </Hotspot>

        {/* wall shelf with everything she has collected */}
        <div className="absolute top-[18%] right-[27%] left-[20%] h-[12%]">
          <div className="absolute inset-x-0 bottom-0 h-[5px] rounded-full bg-[#d9b894] shadow-[0_4px_8px_-3px_rgba(91,68,80,0.7)]" />
          <div
            className="absolute inset-x-1 bottom-[5px] flex origin-bottom items-end justify-center gap-0.5"
            style={{ transform: `translateY(12%) scale(${shelf.length > 8 ? 0.6 : shelf.length > 6 ? 0.76 : 1})` }}
          >
            {shelf.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                className="hit-area border-0 bg-transparent p-0"
                aria-label={item.label}
                whileHover={{ y: -4, rotate: 3 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  play("sparkle")
                  notify(item.label)
                }}
              >
                <ShelfBit id={item.id} />
              </motion.button>
            ))}
            {shelf.length === 0 && (
              <p className={`font-hand text-[0.7rem] ${night ? "text-cream/70" : "text-ink-soft"}`}>
                empty shelf. go collect things.
              </p>
            )}
          </div>
        </div>

        {/* monitors resting on the desk */}
        <Hotspot x="9%" b="42%" w="24%" label="left monitor, world map" testid="monitor-map" onClick={() => nav("/world")}>
          <Monitor slant caption="WORLD" night={night} on={save.bootDone} kind="map" />
        </Hotspot>
        <Hotspot x="35%" b="41%" w="28%" label="right monitor, digital art" testid="monitor-art" onClick={() => nav("/art")}>
          <Monitor caption="ART" night={night} on={save.bootDone} kind="art" art={art} />
        </Hotspot>

        {/* tower on the floor beside the desk */}
        <Hotspot
          x="84%"
          b="9%"
          w="13%"
          label="RGB PC tower"
          testid="pc-tower"
          onClick={() => {
            patch((s) => ({ ...s, rgbMode: (s.rgbMode + 1) % RGB.length }))
            play("click")
            notify("rgb aura: upgraded")
          }}
        >
          <PcTower glow={RGB[save.rgbMode] ?? RGB[0]!} on={save.bootDone} />
        </Hotspot>

        <Hotspot
          x="77%"
          b="33%"
          w="12%"
          label="headphones, toggle ambience"
          testid="headphones"
          onClick={() => {
            patch((s) => ({ ...s, headphonesOn: !s.headphonesOn }))
            notify(save.headphonesOn ? "quiet mode" : "soft ambience on")
          }}
        >
          <HeadphonesArt on={save.headphonesOn} />
        </Hotspot>

        <Hotspot x="83%" b="13%" w="8%" label="PC power button" testid="power-btn" onClick={startPc}>
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 ${
              save.bootDone ? "border-mint-deep bg-mint" : "border-blush-deep bg-blush"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
              <path d="M8 2v5" stroke="#5b4450" strokeWidth="2" strokeLinecap="round" />
              <path d="M4.6 4.6a4.8 4.8 0 1 0 6.8 0" fill="none" stroke="#5b4450" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </Hotspot>

        <Hotspot
          x="16%"
          b="33%"
          w="40%"
          label="pink keyboard"
          testid="keyboard"
          onClick={() => {
            const i = keys % KEY_NOTES.length
            playNote(KEY_NOTES[i] ?? 523)
            setKeys((k) => k + 1)
            notify("clicky clack")
          }}
        >
          <Keyboard lit={keys} />
        </Hotspot>

        <Hotspot
          x="59%"
          b="33%"
          w="8%"
          label="sparkly mouse"
          testid="mouse"
          onClick={() => {
            play("sparkle")
            discoverSecret("desk-mouse", "the mouse knows things")
          }}
        >
          <MouseArt />
        </Hotspot>

        <Hotspot
          x="4%"
          b="2%"
          w="19%"
          label="gaming chair"
          testid="chair"
          onClick={() => {
            play("pop")
            notify(pick(CHAIR_LINES))
          }}
        >
          <Chair night={night} />
        </Hotspot>

        <Hotspot x="69%" b="34%" w="7%" label="warm drink" onClick={() => { play("pop"); notify(sweetNote()) }}>
          <Mug />
        </Hotspot>

        <Hotspot x="42%" b="30%" w="10%" label="hidden desk drawer" onClick={() => { notify(sweetNote()); discoverSecret("desk-drawer") }}>
          <span className="block h-2.5 w-full rounded-full bg-[#c9a173]/70 shadow-inner" />
        </Hotspot>

        {MEMORY_EGG.enabled && (
          <Hotspot
            x="8%"
            b="36%"
            w="4%"
            label={MEMORY_EGG.label}
            testid="memory-egg"
            onClick={() => discoverSecret(MEMORY_EGG.id, MEMORY_EGG.text)}
          >
            <svg viewBox="0 0 22 22" className="anim-twinkle mx-auto h-5 w-5" aria-hidden>
              <path fill="#fff3c4" stroke="#e8c96a" strokeWidth="1.4" d="M11 1.6l2.6 6.2 6.8.6-5.2 4.4 1.6 6.6L11 15.8l-5.8 3.6L6.8 12.8 1.6 8.4l6.8-.6z" />
            </svg>
          </Hotspot>
        )}

        <div className="absolute right-[26%] bottom-[4%] z-20">
          <motion.button
            type="button"
            aria-label="pet Nikki"
            className="hit-area border-0 bg-transparent p-0"
            data-testid="room-nini"
            whileTap={{ scale: 0.94 }}
            whileHover={reducedMotion ? undefined : { y: -4 }}
            onClick={() => {
              const line = pick(NIKKI_LINES)
              petNikki(line)
              notify(line)
            }}
          >
            <Nikki pose={night ? "sleep" : save.happiness > 50 ? "sit" : "stand"} size={104} />
          </motion.button>
        </div>

        {save.happiness > 35 && (
          <div className="anim-swim pointer-events-none absolute bottom-[3%] left-[30%] opacity-95">
            <Fish color="#8fcbec" fin="#ffdbe6" size={52} message="why am I in the PC room" />
          </div>
        )}

        {night && <MrAlien size={52} className="anim-float pointer-events-none absolute top-[5%] right-[24%]" />}

        {boot && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-night/55 backdrop-blur-[2px]">
            <motion.p
              className="rounded-full bg-white px-5 py-2.5 font-hand text-lg shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              starting up… hello :)
            </motion.p>
          </div>
        )}
        {!save.bootDone && !boot && (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-3 pt-16 pb-3 text-center"
            style={{ background: "linear-gradient(180deg,transparent 0%,rgba(43,32,46,0.06) 40%,rgba(43,32,46,0.42) 100%)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="soft-card flex items-center gap-3 bg-white/94 px-3 py-2 text-left">
              <div>
                <p className="font-hand text-base leading-tight">I made you a tiny world</p>
                <p className="font-hand text-[0.68rem] text-ink-soft">tap everything, especially odd corners</p>
              </div>
              <GameButton tone="pink" size="sm" testid="power-start" onClick={startPc}>
                power on
              </GameButton>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <GameButton tone="pink" testid="open-map" onClick={() => nav("/world")}>
          world map
        </GameButton>
        <GameButton tone="sun" onClick={() => nav("/achievements")}>
          trophies
        </GameButton>
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
  b,
  w,
  label,
  onClick,
  children,
  testid,
}: {
  x: string
  /** distance from the top of the stage */
  y?: string
  /** distance from the bottom — use it for anything resting on the desk or floor */
  b?: string
  w: string
  label: string
  onClick: () => void
  children: React.ReactNode
  testid?: string
}) {
  return (
    <motion.button
      type="button"
      data-testid={testid}
      aria-label={label}
      className="hit-area absolute z-10 flex items-end border-0 bg-transparent p-0"
      style={{ left: x, top: y, bottom: b, width: w }}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}

function Monitor({
  slant,
  caption,
  night,
  on,
  kind,
  art,
}: {
  slant?: boolean
  caption: string
  night: boolean
  on: boolean
  kind: "map" | "art"
  art?: string | null
}) {
  return (
    <svg
      viewBox="0 0 170 122"
      className="w-full drop-shadow-xl"
      style={{ transform: slant ? "perspective(520px) rotateY(16deg)" : undefined }}
      aria-hidden
    >
      <rect x="6" y="4" width="158" height="96" rx="10" fill="#2b2533" />
      <rect x="9" y="7" width="152" height="90" rx="8" fill="#151221" />
      <clipPath id={`screen-${kind}`}>
        <rect x="14" y="12" width="142" height="80" rx="6" />
      </clipPath>
      <g clipPath={`url(#screen-${kind})`}>
        {!on ? (
          <rect x="14" y="12" width="142" height="80" fill="#141220" />
        ) : kind === "art" && art ? (
          <image href={art} x="14" y="12" width="142" height="80" preserveAspectRatio="xMidYMid slice" />
        ) : kind === "art" ? (
          <>
            <rect x="14" y="12" width="142" height="80" fill={night ? "#3b3268" : "#fff3f8"} />
            <circle cx="52" cy="46" r="15" fill="#ffdbe6" />
            <circle cx="92" cy="54" r="12" fill="#d3ecfb" />
            <path d="M28 78c20-14 50-16 76-4" stroke="#ff8fae" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <rect x="14" y="12" width="142" height="80" fill={night ? "#27305c" : "#dff1ff"} />
            <ellipse cx="86" cy="70" rx="64" ry="22" fill="#a9e4c0" />
            <circle cx="126" cy="30" r="10" fill="#ffe89a" />
            <ellipse cx="46" cy="34" rx="18" ry="7" fill="#fff" opacity="0.9" />
            <path d="M28 66c26-10 66-12 100 2" stroke="#fff3df" strokeWidth="5" fill="none" strokeLinecap="round" />
          </>
        )}
        <rect x="14" y="12" width="142" height="80" fill="url(#screen-shine)" opacity="0.18" />
      </g>
      <defs>
        <linearGradient id="screen-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {on && (
        <text x="85" y="88" textAnchor="middle" fontSize="11" fontWeight="700" fill={night ? "#ffe6f1" : "#5b4450"} fontFamily="Baloo 2, sans-serif">
          {caption}
        </text>
      )}
      <rect x="74" y="100" width="22" height="11" rx="3" fill="#2b2533" />
      <rect x="54" y="110" width="62" height="7" rx="3.5" fill="#2b2533" />
    </svg>
  )
}

function PcTower({ glow, on }: { glow: string; on: boolean }) {
  return (
    <svg viewBox="0 0 96 140" className="w-full drop-shadow-lg" aria-hidden>
      <rect x="10" y="6" width="76" height="128" rx="12" fill="#f6ccd4" stroke="#5b4450" strokeWidth="2.4" />
      <rect x="17" y="14" width="62" height="86" rx="8" fill="#1b1826" />
      <rect x="20" y="17" width="56" height="80" rx="6" fill="#241f33" />
      {on && (
        <>
          <circle cx="48" cy="52" r="20" fill={glow} opacity="0.85">
            <animate attributeName="opacity" values="0.5;0.95;0.5" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="48" cy="52" r="11" fill="#fff" opacity="0.5" />
          <rect x="24" y="86" width="48" height="4" rx="2" fill={glow} opacity="0.8" />
        </>
      )}
      <rect x="22" y="108" width="52" height="7" rx="3.5" fill="#8fddb4" />
      <rect x="22" y="120" width="22" height="7" rx="3.5" fill="#fff" opacity="0.9" />
      <path d="M16 12c4-3 10-4 16-4" stroke="#fff" strokeWidth="2.4" opacity="0.7" fill="none" />
    </svg>
  )
}

function HeadphonesArt({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 70 62" className="w-full" aria-hidden>
      <path d="M12 36V30a23 23 0 0 1 46 0v6" fill="none" stroke="#5b4450" strokeWidth="4" strokeLinecap="round" />
      <rect x="4" y="32" width="16" height="24" rx="8" fill="#ff8fae" stroke="#5b4450" strokeWidth="2" />
      <rect x="50" y="32" width="16" height="24" rx="8" fill="#ff8fae" stroke="#5b4450" strokeWidth="2" />
      <path d="M8 38c1 6 1 11 0 14" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7" />
      {on && (
        <g className="anim-float">
          <circle cx="35" cy="12" r="4" fill="#ffd45e" stroke="#5b4450" strokeWidth="1.4" />
          <path d="M44 8c2 3 2 7 0 10" stroke="#8fddb4" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  )
}

function Keyboard({ lit }: { lit: number }) {
  return (
    <svg viewBox="0 0 230 62" className="w-full drop-shadow-md" aria-hidden>
      <rect x="4" y="10" width="222" height="44" rx="10" fill="#f6b9cb" stroke="#5b4450" strokeWidth="2.4" />
      <rect x="8" y="13" width="214" height="16" rx="7" fill="#fff" opacity="0.35" />
      {Array.from({ length: 15 }).map((_, i) => (
        <rect
          key={i}
          x={12 + i * 14}
          y={18}
          width="11"
          height="11"
          rx="3"
          fill={i === lit % 15 ? "#fff" : "#ffe4ec"}
          stroke="#e39ab4"
          strokeWidth="0.8"
        />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={`b${i}`} x={20 + i * 14} y={33} width="11" height="11" rx="3" fill="#fff0f5" stroke="#e39ab4" strokeWidth="0.8" />
      ))}
      <rect x="76" y="46" width="76" height="6" rx="3" fill="#ffe4ec" stroke="#e39ab4" strokeWidth="0.8" />
    </svg>
  )
}

function MouseArt() {
  return (
    <svg viewBox="0 0 44 60" className="w-full" aria-hidden>
      <rect x="7" y="4" width="30" height="50" rx="15" fill="#efe0fb" stroke="#5b4450" strokeWidth="2.2" />
      <path d="M22 8v18" stroke="#bfa9f0" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="22" cy="30" rx="4" ry="6" fill="#bfa9f0" opacity="0.5" />
      <circle cx="14" cy="14" r="2.4" fill="#fff" opacity="0.9" />
    </svg>
  )
}

function Chair({ night }: { night: boolean }) {
  return (
    <svg viewBox="0 0 84 108" className="w-full drop-shadow-md" aria-hidden>
      <rect x="14" y="4" width="54" height="54" rx="16" fill={night ? "#6b5b9c" : "#dcc9f2"} stroke="#5b4450" strokeWidth="2.4" />
      <rect x="22" y="12" width="38" height="16" rx="8" fill="#fff" opacity="0.4" />
      <rect x="10" y="56" width="62" height="14" rx="7" fill={night ? "#7c6bb0" : "#c8b2ec"} stroke="#5b4450" strokeWidth="2" />
      <rect x="37" y="70" width="10" height="24" rx="5" fill="#6b5d78" />
      <path d="M20 100h44" stroke="#6b5d78" strokeWidth="5" strokeLinecap="round" />
      <circle cx="20" cy="102" r="4" fill="#5b4450" />
      <circle cx="64" cy="102" r="4" fill="#5b4450" />
    </svg>
  )
}

function Mug() {
  return (
    <svg viewBox="0 0 48 48" className="w-full" aria-hidden>
      <path d="M8 14h26v20a8 8 0 0 1-8 8h-10a8 8 0 0 1-8-8z" fill="#fff" stroke="#5b4450" strokeWidth="2.2" />
      <path d="M34 20h5a5 5 0 0 1 0 10h-5" fill="none" stroke="#5b4450" strokeWidth="2.2" />
      <ellipse cx="21" cy="15" rx="13" ry="3.4" fill="#c98a5c" />
      <path d="M16 8c2-3 0-5 0-5M24 8c2-4 0-6 0-6" stroke="#e0cfe0" strokeWidth="2" fill="none" strokeLinecap="round" className="anim-float" />
    </svg>
  )
}

function ShelfBit({ id }: { id: string }) {
  switch (id) {
    case "alien":
      return <MrAlien size={42} mode="peek" />
    case "santa":
      return <SantaArt size={40} />
    case "nikki":
      return <Nikki pose="sit" size={44} animated={false} />
    case "pool-trophy":
      return <Trophy size={32} />
    case "fruit":
      return <FruitBasket size={36} />
    case "cactus":
      return <CactusIceCream size={34} body="#ff8fae" spots="#fff" />
    case "burger":
      return <BurgerArt size={38} />
    case "nails":
      return <NailPolish size={26} />
    case "pudding":
      return <PuddingCup size={30} />
    case "licence":
      return <Licence size={38} />
    case "nurse-badge":
      return <NurseBadge size={30} />
    case "meal":
      return <LegendaryPlate size={50} />
    case "gift":
      return <GiftBox size={32} />
    default:
      return <Coin size={22} />
  }
}
