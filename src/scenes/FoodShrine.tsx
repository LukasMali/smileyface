import { useState } from "react"
import { motion } from "framer-motion"
import { Nikki } from "../art/Nikki"
import { MrAlien } from "../art/Alien"
import { Pony } from "../art/Pony"
import { LegendaryPlate, StarSticker } from "../art/Props"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Pill } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

export function FoodShrine() {
  const { notify, play, completeLevel, save, addStars, reducedMotion, poke } = useGame()
  const [stolen, setStolen] = useState(false)
  const [blessings, setBlessings] = useState(0)

  return (
    <PageShell
      title="Legendary Food Shrine"
      area="food-shrine"
      subtitle="mashed potatoes + spinach + eggs · rarity: mythical"
      tint="linear-gradient(180deg,#fff7e0 0%,#ffeec9 55%,#ffe3ea 100%)"
      aside={<Pill className="bg-butter">blessings {blessings}</Pill>}
    >
      <div
        className="stage mx-auto max-w-md"
        style={{ background: "linear-gradient(180deg,#fff3d0 0%,#ffe5b8 55%,#f6d7c2 100%)" }}
      >
        {/* rotating light rays */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-start justify-center"
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50% 62%" }}
        >
          <svg viewBox="0 0 300 300" className="h-full w-full" aria-hidden>
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={i}
                d="M150 186L142 18h16z"
                fill="#fff"
                opacity="0.35"
                transform={`rotate(${i * 30} 150 186)`}
              />
            ))}
          </svg>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center px-4 pt-6 pb-4">
          <p className="label-sticker mb-2 text-sm">LEGENDARY ITEM FOUND</p>
          <motion.button
            type="button"
            className="border-0 bg-transparent p-0"
            aria-label="legendary meal"
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              play("chime")
              poke(e.clientX, e.clientY, "star")
              setBlessings((n) => n + 1)
              notify("+100 HAPPINESS (spiritually)")
              if (!save.completedLevels.includes("food-shrine")) {
                completeLevel("food-shrine")
                addStars(2)
              }
            }}
          >
            <motion.div animate={reducedMotion ? undefined : { y: [0, -8, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}>
              <LegendaryPlate size={230} />
            </motion.div>
          </motion.button>

          {/* pedestal */}
          <svg viewBox="0 0 220 70" className="-mt-3 w-64" aria-hidden>
            <ellipse cx="110" cy="58" rx="94" ry="12" fill="#d9b894" />
            <path d="M40 18h140l-10 34H50z" fill="#e8cba8" stroke="#b7997a" strokeWidth="2.4" />
            <rect x="34" y="8" width="152" height="12" rx="6" fill="#f2ddc0" stroke="#b7997a" strokeWidth="2.2" />
            <path d="M60 30h100" stroke="#c9a884" strokeWidth="2.4" />
          </svg>

          <div className="flex gap-1">
            <StarSticker size={22} className="anim-twinkle" />
            <StarSticker size={18} className="anim-twinkle" />
            <StarSticker size={24} className="anim-twinkle" />
          </div>
        </div>
      </div>

      <Panel className="mx-auto mt-3 max-w-md bg-white/88">
        <p className="font-hand text-sm">choir (visual only) · rotating pedestal · do not tell the grocery store</p>
        <div className="mt-3 flex flex-wrap items-end justify-center gap-3">
          <button
            type="button"
            className="border-0 bg-transparent p-0"
            aria-label="Mr Alien tries a bite"
            onClick={() => {
              setStolen(true)
              play("ufo")
              notify("Mr Alien attempted theft. morally complicated.")
            }}
          >
            <MrAlien mode="steal" size={92} />
          </button>
          <Nikki pose="sit" size={92} />
          <Pony name="background pony" look={{ body: "#e6dbff", mane: "#ffeec2", accessory: "star" }} size={132} />
        </div>
        {stolen && (
          <p className="mt-2 text-center font-hand text-sm">
            he did not succeed. the artifact is protected by spinach magic.
          </p>
        )}
        <div className="mt-3 flex justify-center gap-2">
          <GameButton size="sm" tone="mint" onClick={() => { play("bark"); notify("Nini inspects it. approved.") }}>
            let Nini inspect
          </GameButton>
          <GameButton size="sm" tone="sun" onClick={() => { play("sparkle"); notify("the shrine hums politely") }}>
            bow respectfully
          </GameButton>
        </div>
      </Panel>
    </PageShell>
  )
}
