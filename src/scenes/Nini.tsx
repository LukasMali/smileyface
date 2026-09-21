import { useState } from "react"
import { Nikki, NikkiButton } from "../art/Nikki"
import { NIKKI_LINES } from "../game/messages"
import { useGame } from "../hooks/GameContext"
import { pick } from "../lib/random"
import { GameButton, Panel, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

type Spot = { blanket: boolean; pillow: boolean; plush: boolean; night: boolean; pose: "sleep" | "sit" | "stretch" }

export function Nini() {
  const { notify, play, petNikki, completeLevel, save, patch, addStars } = useGame()
  const [spot, setSpot] = useState<Spot>({
    blanket: false,
    pillow: false,
    plush: false,
    night: false,
    pose: "sit",
  })
  const [won, setWon] = useState(save.niniComfy)

  const pet = () => {
    const line = pick(NIKKI_LINES)
    petNikki(line)
    notify(line)
  }

  const tryWin = (next: Spot) => {
    const ok = next.blanket && next.pillow && next.plush && next.night && next.pose === "sleep"
    if (ok && !won) {
      setWon(true)
      patch((s) => ({ ...s, niniComfy: true }))
      completeLevel("nini")
      addStars(2)
      notify("Nini has achieved maximum comfy")
      play("chime")
    }
  }

  return (
    <PageShell title="Nikki's Cozy Corner" area="nini" tint="#2c2a4a" night>
      <Tag className="bg-white/90 text-ink">get Nini comfy</Tag>
      <div className="relative mx-auto min-h-[340px] max-w-lg overflow-hidden rounded-[1.8rem] bg-linear-to-b from-[#1c1a33] via-[#3d3a68] to-[#4a3f55]">
        <span className="absolute top-6 right-8 h-16 w-16 rounded-full bg-butter/80 blur-[2px]" />
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="absolute anim-twinkle text-cream" style={{ left: `${10 + (i * 7) % 80}%`, top: `${8 + (i % 5) * 10}%` }}>
            ·
          </span>
        ))}
        {spot.night && <div className="absolute left-6 top-24 h-10 w-10 rounded-full bg-butter shadow-[0_0_24px_#fff3c4]" />}
        <div className="absolute inset-x-6 bottom-8 rounded-[2rem] bg-[#6b4a5a] p-4">
          {spot.pillow && <div className="mb-2 h-10 w-24 rounded-full bg-[#ffd6e0]" />}
          {spot.blanket && <div className="h-16 rounded-[1.2rem] bg-[#c4b0ea]" />}
          {spot.plush && <span className="absolute right-8 bottom-10 text-3xl">🧸</span>}
          <div className="relative z-10 -mt-6 flex justify-center">
            <NikkiButton pose={spot.pose} size={140} label="pet Nikki" onPet={pet} />
          </div>
        </div>
      </div>
      <Panel className="mt-4">
        <p className="mb-2 font-hand text-sm">arrange the nap. Nini is very professional about this.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <GameButton tone={spot.blanket ? "mint" : "cream"} onClick={() => { const n = { ...spot, blanket: !spot.blanket }; setSpot(n); play("pop"); tryWin(n) }}>blanket</GameButton>
          <GameButton tone={spot.pillow ? "mint" : "cream"} onClick={() => { const n = { ...spot, pillow: !spot.pillow }; setSpot(n); play("pop"); tryWin(n) }}>pillow</GameButton>
          <GameButton tone={spot.plush ? "mint" : "cream"} onClick={() => { const n = { ...spot, plush: !spot.plush }; setSpot(n); play("pop"); tryWin(n) }}>plushie</GameButton>
          <GameButton tone={spot.night ? "mint" : "cream"} onClick={() => { const n = { ...spot, night: !spot.night }; setSpot(n); play("sparkle"); tryWin(n) }}>night light</GameButton>
          <GameButton onClick={() => { const n = { ...spot, pose: "sleep" as const }; setSpot(n); tryWin(n) }}>sleeping pose</GameButton>
          <GameButton onClick={() => setSpot({ ...spot, pose: "stretch" })}>stretch</GameButton>
        </div>
        {won && <p className="mt-3 text-center font-hand text-lg">Nini has achieved maximum comfy ✨</p>}
      </Panel>
      <div className="mt-4 flex justify-center">
        <Nikki pose="sleep" size={80} className="opacity-80" />
      </div>
    </PageShell>
  )
}
