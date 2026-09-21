import { useState } from "react"
import { MrAlien } from "../components/characters/MrAlien"
import { Pony } from "../components/characters/Pony"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

export function Ponies() {
  const { notify, play, patch, save, completeLevel, discoverSecret, addStars } = useGame()
  const [mane, setMane] = useState("#ff8fab")
  const [acc, setAcc] = useState<string[]>(save.ponyAccessories)
  const [brushed, setBrushed] = useState(0)

  const unlock = (id: string) => {
    if (acc.includes(id)) return
    const next = [...acc, id]
    setAcc(next)
    patch((s) => ({ ...s, ponyAccessories: next }))
    play("sparkle")
    notify(`${id} unlocked`)
    if (next.length >= 3 && !save.completedLevels.includes("ponies")) {
      completeLevel("ponies")
      addStars(1)
    }
  }

  return (
    <PageShell title="Pony Meadow" area="ponies" tint="#d7f5c8">
      <Tag>brush · decorate · photograph · give fruit</Tag>
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.8rem] bg-linear-to-b from-sky to-[#b7e39a] p-4 pt-10">
        <div className="pointer-events-none absolute inset-x-0 top-6 h-16 opacity-70">☁️ ☁️ ☁️</div>
        <svg className="absolute bottom-8 left-4 w-40 opacity-70" viewBox="0 0 120 20" aria-hidden>
          <path d="M0 10 q20 -10 40 0 t40 0 t40 0" stroke="#8ecae6" fill="none" strokeWidth="4" />
        </svg>
        <div className="relative z-10 flex flex-wrap items-end justify-center gap-2">
          <Pony name="blush" look={{ body: "#ffd6e0", mane, accessory: "nurse" }} />
          <Pony name="sky" look={{ body: "#c5e8f7", mane: "#8fd9b0", accessory: "sign" }} />
          <Pony name="snack" look={{ body: "#fff3c4", mane: "#e8c39e", accessory: "burger" }} dramatic />
          <Pony name="eepy" look={{ body: "#e0d4f7", mane: "#c4b0ea", accessory: "sleep" }} sleeping />
        </div>
        <button
          type="button"
          className="absolute bottom-2 left-6 border-0 bg-transparent p-0 opacity-50"
          aria-label="hidden Mr Alien"
          onClick={() => discoverSecret("pony-alien", "Mr Alien was tax-evading in the meadow")}
        >
          <MrAlien size={48} mode="peek" />
        </button>
      </div>
      <Panel className="mx-auto mt-4 max-w-lg">
        <p className="mb-2 font-hand text-sm">mane dye</p>
        <div className="mb-3 flex gap-2">
          {["#ff8fab", "#c4b0ea", "#fff3c4", "#8fd9b0"].map((c) => (
            <button key={c} type="button" className="h-9 w-9 rounded-full border-2 border-ink/10" style={{ background: c }} onClick={() => setMane(c)} aria-label={`mane ${c}`} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <GameButton
            onClick={() => {
              setBrushed((n) => n + 1)
              play("pop")
              notify("brush accepted")
              if (brushed + 1 >= 3) unlock("bow")
            }}
          >
            brush pony
          </GameButton>
          <GameButton onClick={() => unlock("fruit")}>give fruit</GameButton>
          <GameButton onClick={() => unlock("stars")}>add bows / stars</GameButton>
          <GameButton
            tone="mint"
            onClick={() => {
              play("chime")
              notify("photograph taken. the pony did a pose.")
              unlock("flower")
            }}
          >
            photograph
          </GameButton>
        </div>
        <p className="mt-2 font-hand text-xs text-ink-soft">accessories: {acc.join(", ") || "none yet"}</p>
      </Panel>
    </PageShell>
  )
}
