import { useState } from "react"
import { Nikki } from "../art/Nikki"
import { Pony } from "../components/characters/Pony"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const SUPPLIES = ["bandage", "heart", "star-cream", "tiny thermometer", "snack"]
const MATCH = [
  ["plush", "bandage"],
  ["fish", "water"],
  ["pony", "apple"],
]

export function Nurse() {
  const { save, patch, notify, play, completeLevel, addStars } = useGame()
  const [tray, setTray] = useState<string[]>([])
  const [bandaged, setBandaged] = useState(false)
  const [beat, setBeat] = useState(false)
  const [pairs, setPairs] = useState(0)
  const [caring, setCaring] = useState(999)

  const train = () => {
    const next = Math.min(99, save.nurseProgress + 2)
    patch((s) => ({ ...s, nurseProgress: next }))
    play("pop")
    notify(next >= 95 ? "almost a nurse. emotionally already." : "future nurse loading…")
    if (next >= 92 && bandaged && pairs >= 2 && !save.completedLevels.includes("nurse")) {
      completeLevel("nurse")
      addStars(1)
    }
  }

  return (
    <PageShell title="Nurse Academy" area="nurse" tint="#ffd6e0">
      <Tag>cute medicine only. no exams. kindness: MAX</Tag>
      <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
        <Panel>
          <p className="font-hand text-ink">future nurse loading… {save.nurseProgress}%</p>
          <button
            type="button"
            className="mt-2 block h-4 w-full overflow-hidden rounded-full bg-lilac"
            aria-label="training bar"
            data-testid="nurse-bar"
            onClick={train}
          >
            <span className="block h-full bg-mint-deep" style={{ width: `${save.nurseProgress}%` }} />
          </button>
          <p className="mt-3 font-hand text-sm">Kindness: MAX</p>
          <p className="font-hand text-sm">Caring: {caring}+</p>
          <p className="font-hand text-sm">Patience: suspiciously high</p>
          <p className="font-hand text-sm">Sweetness: OVERFLOW</p>
          <GameButton
            className="mt-2"
            onClick={() => {
              setCaring((n) => n + 1)
              notify("caring++")
            }}
          >
            extra care
          </GameButton>
        </Panel>
        <Panel>
          <p className="mb-2 font-hand">organize supplies onto the tray</p>
          <div className="flex flex-wrap gap-2">
            {SUPPLIES.map((s) => (
              <GameButton
                key={s}
                tone={tray.includes(s) ? "mint" : "cream"}
                onClick={() => {
                  setTray((t) => (t.includes(s) ? t : [...t, s]))
                  play("click")
                  if (tray.length + 1 >= 4) train()
                }}
              >
                {s}
              </GameButton>
            ))}
          </div>
          <p className="mt-2 font-hand text-xs">tray: {tray.join(" · ") || "empty"}</p>
          <GameButton
            className="mt-3"
            tone={bandaged ? "mint" : "pink"}
            onClick={() => {
              setBandaged(true)
              notify("plushie feels dramatically better")
              play("chime")
              train()
            }}
          >
            bandage a plushie
          </GameButton>
          <GameButton
            className="mt-2"
            onClick={() => {
              setBeat(true)
              notify("heartbeat: silly thump thump")
              play("pop")
            }}
          >
            listen to cartoon heartbeat
          </GameButton>
          {beat && <p className="mt-1 font-hand">♥‿♥  ♥‿♥</p>}
          <div className="mt-3">
            <p className="font-hand text-sm">match objects</p>
            {MATCH.map(([a, b]) => (
              <GameButton
                key={a}
                className="mt-1"
                onClick={() => {
                  setPairs((n) => n + 1)
                  notify(`${a} + ${b} = friends`)
                  play("sparkle")
                }}
              >
                {a} ↔ {b}
              </GameButton>
            ))}
          </div>
        </Panel>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-center gap-4">
        <Nikki pose="nurse" size={110} />
        <Pony name="nurse" look={{ body: "#fff", mane: "#ff8fab", accessory: "nurse" }} />
      </div>
    </PageShell>
  )
}
