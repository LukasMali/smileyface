import { useState } from "react"
import { SantaArt, RobuxInfinity } from "../art/Santa"
import { Coin, MrAlien } from "../art/Alien"
import { KawaiiBlob } from "../art/Blob"
import { GiftBox } from "../art/Props"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

export function Santa() {
  const { save, notify, play, completeLevel, discoverSecret } = useGame()
  const [step, setStep] = useState(save.completedLevels.includes("santa") ? 3 : 0)

  if (!save.santaUnlocked && !save.discoveredSecrets.includes("santa-key")) {
    return (
      <PageShell
        title="Santa's Secret Room"
        area="santa"
        night
        subtitle="the door is humming christmas-in-july energy"
        tint="linear-gradient(180deg,#2a2450 0%,#1e1a3c 100%)"
      >
        <Panel className="mx-auto max-w-md bg-white/10 text-center">
          <div className="mx-auto mb-2 w-fit anim-bob">
            <GiftBox size={72} />
          </div>
          <p className="font-hand text-lg text-cream">this door only opens for people who found the tiny gift.</p>
          <p className="mt-2 font-hand text-sm text-lilac">
            it is hiding in Dreamland, in the meadow, or inside a suspicious UFO grant.
          </p>
          <GameButton
            className="mt-4"
            tone="pink"
            onClick={() => {
              discoverSecret("santa-key", "the gift was in your pocket the whole time. classic.")
              play("chime")
            }}
          >
            knock in a silly way
          </GameButton>
        </Panel>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Santa's Secret Room"
      area="santa"
      night
      subtitle="it is not december. he does not care."
      tint="linear-gradient(180deg,#4a2129 0%,#2a1a2c 100%)"
      aside={<Tag className="bg-white">HO HO HO</Tag>}
    >
      {step === 0 && (
        <div className="text-center">
          <SantaArt size={180} className="mx-auto anim-bob" />
          <p className="mt-3 font-hand text-3xl text-cream">HO HO HO</p>
          <GameButton className="mt-4" tone="pink" onClick={() => { setStep(1); play("achieve") }}>
            continue
          </GameButton>
        </div>
      )}
      {step === 1 && (
        <div className="text-center text-cream">
          <p className="font-hand text-2xl">you have been exceptionally silly this year</p>
          <GameButton className="mt-4" onClick={() => setStep(2)}>ok??</GameButton>
        </div>
      )}
      {step >= 2 && (
        <div className="relative overflow-hidden rounded-[1.6rem] bg-night p-6 text-center">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${(i * 6 + 4) % 92}%`,
                animation: `rain-coin ${2.4 + (i % 4) * 0.2}s linear infinite`,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              {i % 3 === 0 ? <GiftBox size={26} /> : <Coin size={20} />}
            </span>
          ))}
          <RobuxInfinity className="relative mx-auto w-64" />
          <p className="relative font-hand text-2xl text-butter">INFINITE ROBUX ACQUIRED</p>
          <p className="relative font-hand text-sm text-lilac">financial consequences: unknown</p>
          <p className="relative mt-2 font-hand text-[11px] text-lilac/80">purely fictional. no accounts. no roblox. just a bit.</p>
          <div className="relative mt-4 flex items-end justify-center gap-4">
            <SantaArt size={100} />
            <MrAlien size={90} />
            <KawaiiBlob mood="shock" />
          </div>
          <p className="relative mt-2 font-hand text-cream">Mr Alien is concerned. Santa is not.</p>
          {step === 2 && (
            <GameButton
              className="relative mt-4"
              tone="mint"
              testid="santa-claim"
              onClick={() => {
                completeLevel("santa")
                notify("Economically Impossible")
                setStep(3)
              }}
            >
              accept the nonsense
            </GameButton>
          )}
        </div>
      )}
    </PageShell>
  )
}
