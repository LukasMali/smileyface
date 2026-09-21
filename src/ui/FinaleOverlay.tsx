import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Nikki } from "../art/Nikki"
import { useGame } from "../hooks/GameContext"
import { GameButton } from "./Button"

export function FinaleOverlay() {
  const { save, patch, play } = useGame()
  const [step, setStep] = useState(0)
  const nav = useNavigate()
  const show = save.finaleReady && !save.finaleSeen
  useEffect(() => {
    if (!show) return
    play("achieve")
    const t = window.setTimeout(() => setStep(1), 1400)
    const t2 = window.setTimeout(() => setStep(2), 3200)
    const t3 = window.setTimeout(() => setStep(3), 5200)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [play, show])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[92] flex items-center justify-center bg-night/70 p-4" role="dialog" aria-label="world complete">
      <div className="max-w-md rounded-[1.8rem] bg-cream p-6 text-center text-ink shadow-[8px_12px_0_rgba(0,0,0,0.2)]">
        <p className="font-hand text-3xl">WORLD COMPLETE ✨</p>
        {step >= 1 && <p className="mt-3 font-hand text-lg">you found basically everything</p>}
        {step >= 2 && (
          <p className="mt-3 font-hand text-sm text-ink-soft">
            which is impressive because there was an unreasonable amount of nonsense in here
          </p>
        )}
        {step >= 3 && (
          <>
            <p className="mt-4 font-hand text-base leading-relaxed">
              you're genuinely the sweetest person I've met, and also one of the funniest. I hope this little world made you smile.
            </p>
            <div className="mt-3 flex justify-center">
              <Nikki pose="sleep" size={100} />
            </div>
            <GameButton
              className="mt-4"
              tone="pink"
              testid="finale-close"
              onClick={() => {
                patch((s) => ({ ...s, finaleSeen: true }))
                nav("/room")
              }}
            >
              go home ✨
            </GameButton>
          </>
        )}
      </div>
    </div>
  )
}
