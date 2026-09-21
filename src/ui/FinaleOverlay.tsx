import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Nikki } from "../art/Nikki"
import { StarSticker, Heart } from "../art/Props"
import { useGame } from "../hooks/GameContext"
import { GameButton } from "./Button"

export function FinaleOverlay() {
  const { save, patch, play, reducedMotion } = useGame()
  const [step, setStep] = useState(0)
  const nav = useNavigate()
  const show = save.finaleReady && !save.finaleSeen

  useEffect(() => {
    if (!show) return
    play("achieve")
    const timers = [
      window.setTimeout(() => setStep(1), 1200),
      window.setTimeout(() => setStep(2), 2700),
      window.setTimeout(() => setStep(3), 4400),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [play, show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[92] flex items-center justify-center bg-night/75 p-4 backdrop-blur-[3px]"
          role="dialog"
          aria-label="the very good day"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* gentle confetti of stars and hearts */}
          {!reducedMotion &&
            Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="pointer-events-none absolute top-0"
                style={{
                  left: `${(i * 11 + 5) % 96}%`,
                  animation: `rain-coin ${3.6 + (i % 5) * 0.4}s linear infinite`,
                  animationDelay: `${i * 0.22}s`,
                }}
              >
                {i % 3 === 0 ? <Heart size={18} /> : <StarSticker size={16} />}
              </span>
            ))}

          <motion.div
            className="soft-card relative max-w-md bg-cream p-6 text-center text-ink"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <p className="font-hand text-xs tracking-[0.22em] text-ink-soft uppercase">100% happiness</p>
            <motion.p
              className="font-hand text-[2rem] leading-tight"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 12, delay: 0.2 }}
            >
              THE VERY GOOD DAY
            </motion.p>
            <div className="mt-1 flex justify-center gap-1">
              <StarSticker size={20} className="anim-twinkle" />
              <StarSticker size={26} className="anim-twinkle" />
              <StarSticker size={20} className="anim-twinkle" />
            </div>

            {step >= 1 && (
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 font-hand text-lg">
                you found basically everything
              </motion.p>
            )}
            {step >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 font-hand text-sm text-ink-soft"
              >
                which is impressive, because there was an unreasonable amount of nonsense in here
              </motion.p>
            )}
            {step >= 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="mt-4 font-hand text-base leading-relaxed">
                  you're genuinely one of the kindest and funniest people around, and this whole tiny world was just an
                  excuse to say so. hope it made you smile.
                </p>
                <div className="mt-3 flex items-end justify-center gap-2">
                  <Nikki pose="sleep" size={104} />
                  <Heart size={24} className="anim-float" />
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
                  go home
                </GameButton>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
