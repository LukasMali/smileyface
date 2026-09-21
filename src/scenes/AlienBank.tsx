import { useState } from "react"
import { motion } from "framer-motion"
import { Coin, MrAlien } from "../art/Alien"
import { ALIEN_LINES } from "../game/messages"
import { useGame } from "../hooks/GameContext"
import { pick } from "../lib/random"
import { GameButton, Panel, Pill, ProgressBar } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const GOAL = 1400

export function AlienBank() {
  const { save, addAlienSavings, notify, play, completeLevel, discoverSecret, poke } = useGame()
  const [shake, setShake] = useState(false)
  const fill = Math.max(6, Math.min(88, ((save.alienSavings - 1200) / (GOAL - 1200)) * 88))

  const grant = (n: number, rare = false) => {
    addAlienSavings(n)
    setShake(true)
    notify(pick(ALIEN_LINES))
    if (rare) discoverSecret("ufo-grant", "rare UFO grant approved")
    if (save.alienSavings + n >= 1260 && !save.completedLevels.includes("alien-bank")) completeLevel("alien-bank")
    window.setTimeout(() => setShake(false), 420)
  }

  return (
    <PageShell
      title="Mr Alien's Intergalactic Bank"
      area="alien-bank"
      subtitle="tap the jar · bribe the universe · numbers are emotional, not financial"
      tint="linear-gradient(180deg,#f0eaff 0%,#e7ddff 55%,#f7ecff 100%)"
      aside={<Pill className="bg-lilac">€{save.alienSavings}</Pill>}
    >
      <div
        className="stage mx-auto max-w-md"
        style={{ background: "linear-gradient(180deg,#2c2558 0%,#3f3277 55%,#59418a 100%)" }}
      >
        <svg viewBox="0 0 360 260" className="absolute inset-0 h-full w-full" aria-hidden>
          {Array.from({ length: 26 }).map((_, i) => (
            <circle
              key={i}
              cx={(i * 71) % 356}
              cy={(i * 43) % 250}
              r={i % 4 === 0 ? 2 : 1.2}
              fill="#fff"
              className="anim-twinkle"
              style={{ animationDelay: `${(i % 7) * 0.32}s` }}
            />
          ))}
          <ellipse cx="180" cy="238" rx="150" ry="20" fill="#241d48" opacity="0.6" />
          {/* counter */}
          <rect x="24" y="200" width="312" height="18" rx="9" fill="#6d5aa6" />
          <rect x="30" y="204" width="300" height="6" rx="3" fill="#8f79c9" />
        </svg>

        <div className="relative z-10 flex flex-col items-center pt-4">
          <button type="button" className="border-0 bg-transparent p-0" aria-label="Mr Alien" onClick={(e) => { poke(e.clientX, e.clientY, "coin"); grant(3) }}>
            <MrAlien size={150} mode="banker" className="anim-float" />
          </button>

          <motion.button
            type="button"
            data-testid="savings-jar"
            aria-label="savings jar"
            className="relative -mt-2 w-40 border-0 bg-transparent p-0"
            animate={shake ? { rotate: [0, -5, 4, -2, 0], scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 0.42 }}
            onClick={(e) => {
              poke(e.clientX, e.clientY, "coin")
              grant(1)
            }}
          >
            <svg viewBox="0 0 130 150" className="w-full" aria-hidden>
              <defs>
                <linearGradient id="jar-glass" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                  <stop offset="45%" stopColor="#d6ecff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#a8cbe8" stopOpacity="0.45" />
                </linearGradient>
                <clipPath id="jar-clip">
                  <path d="M22 36h86l-9 96a8 8 0 0 1-8 7H39a8 8 0 0 1-8-7z" />
                </clipPath>
              </defs>
              <rect x="18" y="18" width="94" height="17" rx="8" fill="#8fcbec" stroke="#5b4450" strokeWidth="2.4" />
              <rect x="24" y="22" width="82" height="5" rx="2.5" fill="#fff" opacity="0.6" />
              <path d="M22 36h86l-9 96a8 8 0 0 1-8 7H39a8 8 0 0 1-8-7z" fill="url(#jar-glass)" stroke="#5b4450" strokeWidth="2.6" />
              <g clipPath="url(#jar-clip)">
                <rect x="22" y={139 - fill} width="86" height={fill + 6} fill="#f7d774" opacity="0.85" />
                {[
                  [40, 128],
                  [62, 132],
                  [84, 128],
                  [50, 116],
                  [74, 114],
                ].map(([cx, cy]) => (
                  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" fill="#ffe6a0" stroke="#d7a52a" strokeWidth="1.4" />
                ))}
              </g>
              <path d="M34 54c0 26-2 52 2 74" stroke="#fff" strokeWidth="5" opacity="0.4" strokeLinecap="round" fill="none" />
            </svg>
            <p className="absolute inset-x-0 top-[46%] font-hand text-xl text-ink" data-testid="savings-amount">
              €{save.alienSavings}
            </p>
          </motion.button>

          <div className="pointer-events-none relative h-8 w-full">
            {[18, 42, 68].map((left, i) => (
              <span
                key={left}
                className="absolute"
                style={{ left: `${left}%`, animation: `coin-drop 2.4s ${i * 0.5}s ease-in infinite` }}
              >
                <Coin size={20} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <Panel className="mx-auto mt-3 max-w-md bg-white/88">
        <div className="mb-1 flex items-center justify-between font-hand text-sm">
          <span>savings aura</span>
          <span>
            €{save.alienSavings} / €{GOAL}
          </span>
        </div>
        <ProgressBar value={((save.alienSavings - 1200) / (GOAL - 1200)) * 100} tone="butter" label="savings" className="mb-3" />
        <div className="flex flex-wrap justify-center gap-2">
          <GameButton size="sm" tone="mint" onClick={() => grant(5)}>
            alien grant
          </GameButton>
          <GameButton
            size="sm"
            tone="lilac"
            onClick={() => {
              play("ufo")
              grant(12, true)
            }}
          >
            rare UFO transfer
          </GameButton>
          <GameButton size="sm" tone="sun" onClick={() => grant(2)}>
            found a coin under the desk
          </GameButton>
        </div>
        <p className="mt-2 text-center font-hand text-xs text-ink-soft">
          Mr Alien is extremely serious about this. he has a monocle for it.
        </p>
      </Panel>
    </PageShell>
  )
}
