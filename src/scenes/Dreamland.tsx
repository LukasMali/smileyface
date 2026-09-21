import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Nikki } from "../art/Nikki"
import { useGame } from "../hooks/GameContext"
import { PageShell } from "../ui/PageShell"
import { Panel, Pill, ProgressBar } from "../ui/Button"
import { GiftBox, StarSticker } from "../art/Props"
import { pick } from "../lib/random"

const DREAMS = [
  "sleep level: expert",
  "five more minutes…",
  "professional nap enthusiast",
  "currently unavailable: eepy",
  "maximum cozy achieved",
  "important sleeping business",
]

type StarBit = { id: number; x: number; y: number; size: number }

const TOTAL = 10

export function Dreamland() {
  const { notify, play, completeLevel, patch, save, addStars, discoverSecret, reducedMotion } = useGame()
  const [stars, setStars] = useState<StarBit[]>(() =>
    Array.from({ length: TOTAL }).map((_, i) => ({
      id: i,
      x: 8 + ((i * 19) % 78),
      y: 10 + ((i * 13) % 62),
      size: 22 + (i % 3) * 8,
    })),
  )
  const [got, setGot] = useState(save.dreamStars)
  const drift = useRef(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    let raf = 0
    const loop = () => {
      drift.current += 0.005
      setY(Math.sin(drift.current) * 8)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  const catchStar = (id: number) => {
    setStars((s) => s.filter((x) => x.id !== id))
    const next = got + 1
    setGot(next)
    patch((s) => ({ ...s, dreamStars: Math.max(s.dreamStars, next) }))
    play("sparkle")
    notify(pick(DREAMS))
    if (next >= 8 && !save.completedLevels.includes("dreamland")) {
      completeLevel("dreamland")
      addStars(1)
    }
  }

  return (
    <PageShell
      title="Dreamland"
      area="dreamland"
      night
      subtitle="collect dream stars · no rush, ever"
      tint="linear-gradient(180deg,#221d45 0%,#1b1736 100%)"
      aside={<Pill className="bg-night text-cream">{got} stars</Pill>}
    >
      <div
        className="stage mx-auto min-h-[24rem] max-w-lg"
        style={{
          background: "linear-gradient(180deg,#2c2758 0%,#3a3272 45%,#4a3d7c 100%)",
          transform: `translateY(${y}px)`,
          transition: "transform 120ms linear",
        }}
      >
        <svg viewBox="0 0 400 340" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <radialGradient id="moon-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#fff6d6" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#fff6d6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="310" cy="64" r="70" fill="url(#moon-glow)" />
          <circle cx="310" cy="64" r="34" fill="#fff6d6" />
          <circle cx="298" cy="54" r="6" fill="#efe0b8" opacity="0.8" />
          <circle cx="320" cy="76" r="4.6" fill="#efe0b8" opacity="0.7" />
          {Array.from({ length: 34 }).map((_, i) => (
            <circle
              key={i}
              cx={(i * 61) % 396}
              cy={(i * 37) % 320}
              r={i % 5 === 0 ? 2 : 1.2}
              fill="#fff"
              className="anim-twinkle"
              style={{ animationDelay: `${(i % 9) * 0.35}s` }}
            />
          ))}
          {/* clouds */}
          <g fill="#ffffff" opacity="0.18">
            <g className="anim-float-slow">
              <ellipse cx="90" cy="230" rx="70" ry="26" />
              <ellipse cx="140" cy="222" rx="46" ry="20" />
            </g>
            <g className="anim-float">
              <ellipse cx="300" cy="270" rx="62" ry="22" />
              <ellipse cx="256" cy="264" rx="40" ry="18" />
            </g>
            <ellipse cx="200" cy="316" rx="150" ry="30" />
          </g>
          {/* shooting star */}
          <g opacity="0.85">
            <path d="M40 90l46-22" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <circle cx="88" cy="67" r="2.6" fill="#fff" />
          </g>
        </svg>

        <AnimatePresence>
          {stars.map((s) => (
            <motion.button
              key={s.id}
              type="button"
              className="hit-area absolute flex items-center justify-center border-0 bg-transparent p-0"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              aria-label="dream star"
              initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0, rotate: 40 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              whileHover={{ scale: 1.14, rotate: 8 }}
              onClick={() => catchStar(s.id)}
            >
              <span className="anim-float" style={{ animationDelay: `${(s.id % 5) * 0.4}s` }}>
                <StarSticker size={s.size} />
              </span>
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Nikki asleep on a cloud */}
        <div className="absolute right-[6%] bottom-[8%]">
          <div className="relative">
            <svg viewBox="0 0 200 70" className="w-44" aria-hidden>
              <ellipse cx="60" cy="46" rx="56" ry="22" fill="#fff" opacity="0.92" />
              <ellipse cx="120" cy="40" rx="44" ry="20" fill="#fff" opacity="0.92" />
              <ellipse cx="96" cy="52" rx="70" ry="16" fill="#f3ecff" opacity="0.9" />
            </svg>
            <div className="absolute -top-8 left-2 anim-float-slow">
              <Nikki pose="sleep" size={128} />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="hit-area absolute bottom-3 left-3 border-0 bg-transparent p-0 opacity-85 transition-transform active:scale-90"
          aria-label="tiny hidden gift"
          onClick={() => {
            play("chime")
            discoverSecret("santa-key", "a ridiculous gift. do not open near Mr Alien.")
          }}
        >
          <span className="anim-bob inline-block">
            <GiftBox size={42} />
          </span>
        </button>
      </div>

      <Panel className="mt-3 bg-white/12">
        <div className="mb-2 flex items-center justify-between font-hand text-sm text-cream">
          <span>dream stars</span>
          <span>
            {got}/{TOTAL}
          </span>
        </div>
        <ProgressBar value={(got / TOTAL) * 100} tone="butter" label="dream stars" />
        {got >= 8 && (
          <p className="mt-2 text-center font-hand text-cream">Professional Sleeper energy unlocked ✨</p>
        )}
        {stars.length === 0 && (
          <p className="mt-2 text-center font-hand text-sm text-cream/80">
            sky cleared. Nini says you may nap now.
          </p>
        )}
      </Panel>
    </PageShell>
  )
}
