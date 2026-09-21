import { useState } from "react"
import { Coin, MrAlien } from "../components/characters/MrAlien"
import { ALIEN_LINES } from "../game/messages"
import { useGame } from "../hooks/GameContext"
import { pick } from "../lib/random"
import { GameButton, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

export function AlienBank() {
  const { save, addAlienSavings, notify, play, completeLevel, discoverSecret } = useGame()
  const [shake, setShake] = useState(false)
  const fill = Math.min(86, 28 + (save.alienSavings - 1240) * 0.8)

  const grant = (n: number, rare = false) => {
    addAlienSavings(n)
    setShake(true)
    notify(pick(ALIEN_LINES))
    if (rare) discoverSecret("ufo-grant", "rare UFO grant approved")
    if (save.alienSavings + n >= 1260 && !save.completedLevels.includes("alien-bank")) completeLevel("alien-bank")
    window.setTimeout(() => setShake(false), 400)
  }

  return (
    <PageShell title="Mr Alien's Intergalactic Bank" area="alien-bank" tint="#e0d4f7">
      <Tag>tap the jar · bribe the universe</Tag>
      <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
        <button
          type="button"
          className="border-0 bg-transparent p-0"
          aria-label="Mr Alien"
          onClick={() => grant(3)}
        >
          <MrAlien size={140} className="anim-float" />
        </button>
        <button
          type="button"
          data-testid="savings-jar"
          aria-label="savings jar"
          className={`relative mt-2 w-44 border-0 bg-transparent p-0 ${shake ? "anim-wiggle" : ""}`}
          onClick={() => grant(1)}
        >
          <svg viewBox="0 0 120 130" className="w-full">
            <rect x="18" y="18" width="84" height="14" rx="6" fill="#8ecae6" stroke="#4a3f55" strokeWidth="1.6" />
            <path d="M22 32 h76 l-8 86 h-60z" fill="#c5e8f7" stroke="#4a3f55" strokeWidth="2" />
            <clipPath id="jar">
              <path d="M22 32 h76 l-8 86 h-60z" />
            </clipPath>
            <rect x="22" y={118 - fill} width="76" height={fill} fill="#f4d35e" opacity="0.55" clipPath="url(#jar)" />
            <path d="M36 48 h48" stroke="#fff" strokeWidth="3" opacity="0.5" />
          </svg>
          <p className="absolute inset-x-0 top-14 font-hand text-2xl text-ink" data-testid="savings-amount">
            €{save.alienSavings}
          </p>
        </button>
        <p className="mt-2 font-hand text-xs text-ink-soft">playful numbers only. aura, not accounting.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <GameButton tone="mint" onClick={() => grant(5)}>alien grant</GameButton>
          <GameButton
            onClick={() => {
              play("ufo")
              grant(12, true)
            }}
          >
            rare UFO
          </GameButton>
        </div>
        <div className="pointer-events-none mt-3 flex gap-2">
          <Coin /> <Coin /> <Coin />
        </div>
      </div>
    </PageShell>
  )
}
