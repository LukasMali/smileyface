import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel } from "./Button"

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { save, setSetting, resetProgress, play } = useGame()
  const [confirm, setConfirm] = useState(false)
  const [credits, setCredits] = useState(false)
  const nav = useNavigate()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-night/40 p-3 sm:items-center" role="dialog" aria-modal aria-label="settings">
      <Panel className="max-h-[88svh] w-full max-w-md overflow-y-auto bg-cream">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-hand text-2xl">settings</h2>
          <GameButton onClick={onClose} label="close settings">
            close
          </GameButton>
        </div>
        {!credits ? (
          <div className="flex flex-col gap-2">
            <GameButton
              tone="mint"
              testid="continue-btn"
              onClick={() => {
                play("click")
                onClose()
                nav(save.lastVisitedArea === "world" ? "/world" : save.lastVisitedArea === "room" ? "/room" : `/${save.lastVisitedArea}`)
              }}
            >
              Continue
            </GameButton>
            <Toggle
              label="Sound"
              on={save.settings.sound}
              onToggle={() => setSetting("sound", !save.settings.sound)}
              testid="sound-toggle"
            />
            <Toggle
              label="Animations"
              on={save.settings.animations}
              onToggle={() => setSetting("animations", !save.settings.animations)}
            />
            <Toggle
              label="Accessibility · reduced motion"
              on={save.settings.reducedMotion}
              onToggle={() => setSetting("reducedMotion", !save.settings.reducedMotion)}
            />
            <GameButton tone="lilac" onClick={() => setCredits(true)}>
              Credits
            </GameButton>
            {!confirm ? (
              <GameButton
                tone="pink"
                testid="reset-btn"
                onClick={() => {
                  play("click")
                  setConfirm(true)
                }}
              >
                Reset progress
              </GameButton>
            ) : (
              <div className="rounded-2xl bg-blush p-3">
                <p className="mb-2 font-hand text-sm">really start over? this cannot be undone.</p>
                <div className="flex gap-2">
                  <GameButton
                    tone="night"
                    testid="reset-confirm"
                    onClick={() => {
                      resetProgress()
                      setConfirm(false)
                      onClose()
                      nav("/room")
                    }}
                  >
                    yes, reset
                  </GameButton>
                  <GameButton onClick={() => setConfirm(false)}>wait no</GameButton>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="font-hand text-sm leading-relaxed text-ink-soft">
            <p>a tiny handmade world.</p>
            <p className="mt-2">characters, maps and mini-games drawn as original kawaii stickers.</p>
            <p className="mt-2">Nini is a very small dog with a very large job: supervising naps.</p>
            <p className="mt-2">Mr Alien handles finance. Santa handles nonsense. The shelf had it coming.</p>
            <GameButton className="mt-4" onClick={() => setCredits(false)}>
              back
            </GameButton>
          </div>
        )}
      </Panel>
    </div>
  )
}

function Toggle({
  label,
  on,
  onToggle,
  testid,
}: {
  label: string
  on: boolean
  onToggle: () => void
  testid?: string
}) {
  return (
    <button
      type="button"
      data-testid={testid}
      className="flex min-h-11 items-center justify-between rounded-2xl bg-white px-4 py-2 font-hand text-base"
      onClick={onToggle}
      aria-pressed={on}
    >
      <span>{label}</span>
      <span className={`rounded-full px-3 py-0.5 text-sm ${on ? "bg-mint" : "bg-blush"}`}>{on ? "on" : "off"}</span>
    </button>
  )
}
