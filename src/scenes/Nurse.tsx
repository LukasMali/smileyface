import { useState } from "react"
import { motion } from "framer-motion"
import { Nikki } from "../art/Nikki"
import { Pony } from "../art/Pony"
import { NurseBadge, Heart } from "../art/Props"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Pill, ProgressBar, SectionTitle } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const SUPPLIES = ["bandage", "heart sticker", "star cream", "tiny thermometer", "snack"]
const MATCH: [string, string][] = [
  ["plushie", "bandage"],
  ["fish", "water"],
  ["pony", "apple"],
]

export function Nurse() {
  const { save, patch, notify, play, completeLevel, addStars } = useGame()
  const [tray, setTray] = useState<string[]>([])
  const [bandaged, setBandaged] = useState(false)
  const [beat, setBeat] = useState(false)
  const [pairs, setPairs] = useState<string[]>([])
  const [caring, setCaring] = useState(999)

  const train = (amount = 2) => {
    const next = Math.min(99, save.nurseProgress + amount)
    patch((s) => ({ ...s, nurseProgress: next }))
    play("pop")
    notify(next >= 95 ? "almost a nurse. emotionally already there." : "future nurse loading…")
    if (next >= 92 && bandaged && pairs.length >= 2 && !save.completedLevels.includes("nurse")) {
      completeLevel("nurse")
      addStars(1)
    }
  }

  return (
    <PageShell
      title="Nurse Academy"
      area="nurse"
      subtitle="cute medicine only · no exams · kindness stat: illegal"
      tint="linear-gradient(180deg,#fff2f6 0%,#ffe8f0 55%,#f4f6ff 100%)"
      aside={<Pill className="bg-blush">{save.nurseProgress}%</Pill>}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Panel className="bg-white/90">
          <div className="mb-2 flex items-center gap-3">
            <NurseBadge size={44} />
            <div>
              <p className="font-hand">future nurse loading… {save.nurseProgress}%</p>
              <p className="font-hand text-xs text-ink-soft">tap the bar, it counts as studying</p>
            </div>
          </div>
          <button type="button" className="block w-full border-0 bg-transparent p-0" aria-label="training bar" data-testid="nurse-bar" onClick={() => train()}>
            <ProgressBar value={save.nurseProgress} tone="mint" label="nurse training" />
          </button>

          <div className="mt-3 grid grid-cols-2 gap-2 font-hand text-sm">
            <Stat label="Kindness" value="MAX" />
            <Stat label="Caring" value={`${caring}+`} />
            <Stat label="Patience" value="suspicious" />
            <Stat label="Sweetness" value="OVERFLOW" />
          </div>
          <GameButton
            className="mt-3"
            size="sm"
            tone="pink"
            onClick={() => {
              setCaring((n) => n + 1)
              notify("caring++")
              play("sparkle")
            }}
          >
            extra care
          </GameButton>

          <div className="mt-4 flex items-end gap-2">
            <Nikki pose="nurse" size={104} />
            <Pony name="nurse" look={{ body: "#ffffff", mane: "#ff8fae", accessory: "nurse" }} size={132} />
          </div>
        </Panel>

        <div className="flex flex-col gap-3">
          <Panel className="bg-white/90">
            <SectionTitle hint={`${tray.length}/5`}>tray duty</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {SUPPLIES.map((s) => (
                <GameButton
                  key={s}
                  size="sm"
                  tone={tray.includes(s) ? "mint" : "cream"}
                  onClick={() => {
                    if (tray.includes(s)) return
                    const next = [...tray, s]
                    setTray(next)
                    play("click")
                    if (next.length >= 4) train()
                  }}
                >
                  {s}
                </GameButton>
              ))}
            </div>
            <p className="mt-2 font-hand text-xs text-ink-soft">tray: {tray.join(" · ") || "empty and judgmental"}</p>
          </Panel>

          <Panel className="bg-white/90">
            <SectionTitle>patient care</SectionTitle>
            <div className="flex flex-wrap gap-2">
              <GameButton
                size="sm"
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
                size="sm"
                tone="sky"
                onClick={() => {
                  setBeat(true)
                  notify("heartbeat: silly thump thump")
                  play("pop")
                }}
              >
                cartoon heartbeat
              </GameButton>
            </div>
            {beat && (
              <div className="mt-2 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
                  >
                    <Heart size={18} />
                  </motion.span>
                ))}
                <span className="font-hand text-xs text-ink-soft">thump thump</span>
              </div>
            )}
          </Panel>

          <Panel className="bg-white/90">
            <SectionTitle hint={`${pairs.length}/3 matched`}>match the little things</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {MATCH.map(([a, b]) => (
                <GameButton
                  key={a}
                  size="sm"
                  tone={pairs.includes(a) ? "mint" : "cream"}
                  onClick={() => {
                    if (pairs.includes(a)) return
                    setPairs((p) => [...p, a])
                    notify(`${a} + ${b} = friends`)
                    play("sparkle")
                    train(1)
                  }}
                >
                  {a} ↔ {b}
                </GameButton>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-[1.5px] border-ink/8 bg-cream px-3 py-2">
      <p className="text-[0.7rem] text-ink-soft">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}
