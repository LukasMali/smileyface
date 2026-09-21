import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useGame } from "../hooks/GameContext"
import { GameButton, SectionTitle } from "./Button"

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { save, setSetting, resetProgress, play } = useGame()
  const [confirm, setConfirm] = useState(false)
  const [credits, setCredits] = useState(false)
  const nav = useNavigate()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-night/45 p-3 backdrop-blur-[3px] sm:items-center"
          role="dialog"
          aria-modal
          aria-label="settings"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            className="soft-card max-h-[88svh] w-full max-w-md overflow-y-auto bg-cream p-4"
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-hand text-2xl">settings</h2>
              <GameButton size="sm" onClick={onClose} label="close settings">
                close
              </GameButton>
            </div>

            {!credits ? (
              <div className="flex flex-col gap-2">
                <GameButton
                  tone="mint"
                  block
                  testid="continue-btn"
                  onClick={() => {
                    play("click")
                    onClose()
                    nav(
                      save.lastVisitedArea === "world"
                        ? "/world"
                        : save.lastVisitedArea === "room"
                          ? "/room"
                          : `/${save.lastVisitedArea}`,
                    )
                  }}
                >
                  continue where I was
                </GameButton>

                <SectionTitle className="mt-2 mb-0">comfort</SectionTitle>
                <Toggle
                  label="sound"
                  hint="tiny clicks, coins and one bark"
                  on={save.settings.sound}
                  onToggle={() => setSetting("sound", !save.settings.sound)}
                  testid="sound-toggle"
                />
                <Toggle
                  label="animations"
                  hint="floating, bobbing, sparkling"
                  on={save.settings.animations}
                  onToggle={() => setSetting("animations", !save.settings.animations)}
                />
                <Toggle
                  label="reduced motion"
                  hint="calmer screen, same story"
                  on={save.settings.reducedMotion}
                  onToggle={() => setSetting("reducedMotion", !save.settings.reducedMotion)}
                />

                <div className="mt-2 flex flex-wrap gap-2">
                  <GameButton size="sm" tone="lilac" onClick={() => setCredits(true)}>
                    credits
                  </GameButton>
                  {!confirm && (
                    <GameButton
                      size="sm"
                      tone="pink"
                      testid="reset-btn"
                      onClick={() => {
                        play("click")
                        setConfirm(true)
                      }}
                    >
                      reset progress
                    </GameButton>
                  )}
                </div>

                <AnimatePresence>
                  {confirm && (
                    <motion.div
                      className="rounded-2xl border-[1.5px] border-blush-deep/50 bg-blush p-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p className="mb-2 font-hand text-sm">really start over? the whole tiny world resets.</p>
                      <div className="flex gap-2">
                        <GameButton
                          size="sm"
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
                        <GameButton size="sm" onClick={() => setConfirm(false)}>
                          wait no
                        </GameButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-2 font-hand text-xs text-ink-soft">
                  progress saves itself constantly. you can close the tab mid-nap.
                </p>
              </div>
            ) : (
              <div className="font-hand text-sm leading-relaxed text-ink-soft">
                <p>a tiny handmade world.</p>
                <p className="mt-2">every character, map and prop drawn as original vector stickers.</p>
                <p className="mt-2">Nini is a very small dog with a very large job: supervising naps.</p>
                <p className="mt-2">Mr Alien handles finance. Santa handles nonsense. The shelf had it coming.</p>
                <GameButton className="mt-4" size="sm" onClick={() => setCredits(false)}>
                  back
                </GameButton>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Toggle({
  label,
  hint,
  on,
  onToggle,
  testid,
}: {
  label: string
  hint?: string
  on: boolean
  onToggle: () => void
  testid?: string
}) {
  return (
    <button
      type="button"
      data-testid={testid}
      className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border-[1.5px] border-ink/8 bg-white px-4 py-2 text-left font-hand"
      onClick={onToggle}
      aria-pressed={on}
    >
      <span>
        <span className="block text-base">{label}</span>
        {hint && <span className="block text-[0.7rem] text-ink-soft">{hint}</span>}
      </span>
      <span
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-[1.5px] transition-colors ${
          on ? "border-mint-deep/60 bg-mint" : "border-ink/12 bg-sand"
        }`}
      >
        <motion.span
          className="absolute h-5 w-5 rounded-full bg-white shadow"
          animate={{ left: on ? 24 : 3 }}
          transition={{ type: "spring", stiffness: 520, damping: 30 }}
        />
      </span>
    </button>
  )
}
