import { useEffect, useState } from "react"
import { Nikki } from "../art/Nikki"
import { MrAlien } from "../components/characters/MrAlien"
import { Pony } from "../components/characters/Pony"
import { LegendaryPlate } from "../components/characters/Props"
import { useGame } from "../hooks/GameContext"
import { GameButton, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

export function FoodShrine() {
  const { notify, play, completeLevel, save, addStars } = useGame()
  const [glow, setGlow] = useState(0)
  const [stolen, setStolen] = useState(false)

  useEffect(() => {
    const t = window.setInterval(() => setGlow((n) => (n + 1) % 8), 400)
    return () => window.clearInterval(t)
  }, [])

  return (
    <PageShell title="Legendary Food Shrine" area="food-shrine" tint="#fff1c9">
      <Tag>LEGENDARY ITEM FOUND</Tag>
      <div className="relative mx-auto max-w-md text-center">
        <div className="absolute inset-x-10 top-0 h-40 rounded-full bg-butter/80 blur-2xl" />
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute top-8 left-1/2 h-28 w-1 origin-bottom bg-white/60"
            style={{ transform: `translateX(-50%) rotate(${i * 20 - 80 + glow}deg)` }}
          />
        ))}
        <p className="relative font-hand text-xl">mashed potatoes + spinach + eggs</p>
        <button
          type="button"
          className="relative mx-auto mt-8 block border-0 bg-transparent p-0"
          aria-label="legendary meal"
          onClick={() => {
            play("chime")
            notify("+100 HAPPINESS (spiritually)")
            if (!save.completedLevels.includes("food-shrine")) {
              completeLevel("food-shrine")
              addStars(2)
            }
          }}
        >
          <div className="anim-bob">
            <LegendaryPlate />
          </div>
        </button>
        <p className="mt-2 font-hand text-sm">choir (visual) · rotating pedestal · do not tell the grocery store</p>
        <div className="mt-6 flex items-end justify-center gap-4">
          <button
            type="button"
            className="border-0 bg-transparent p-0"
            aria-label="Mr Alien tries a bite"
            onClick={() => {
              setStolen(true)
              notify("Mr Alien attempted theft. morally complicated.")
            }}
          >
            <MrAlien mode="steal" size={90} />
          </button>
          <Nikki pose="sit" size={90} />
          <Pony name="background pony" look={{ body: "#e0d4f7", mane: "#fff3c4" }} />
        </div>
        {stolen && <p className="mt-2 font-hand">he did not succeed. the artifact is protected by spinach magic.</p>}
        <GameButton className="mt-4" tone="mint" onClick={() => notify("Nini inspects it. approved.")}>
          let Nini inspect
        </GameButton>
      </div>
    </PageShell>
  )
}
