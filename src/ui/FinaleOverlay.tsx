import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Nikki } from "../art/Nikki"
import { StarSticker, Heart } from "../art/Props"
import { useGame } from "../hooks/GameContext"
import { GameButton } from "./Button"

const TITLE = ["THE", "VERY", "GOOD", "DAY"] as const
const EASE = [0.22, 1, 0.36, 1] as const

export function FinaleOverlay() {
  const { save, patch, play, reducedMotion } = useGame()
  const [step, setStep] = useState(0)
  const nav = useNavigate()
  const show = save.finaleReady && !save.finaleSeen

  useEffect(() => {
    if (!show) {
      setStep(0)
      return
    }
    play("achieve")
    const timers = [
      window.setTimeout(() => setStep(1), 1100),
      window.setTimeout(() => setStep(2), 2500),
      window.setTimeout(() => setStep(3), 4100),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [play, show])

  return (
    <motion.div
      className="fixed inset-0 z-[92] flex items-center justify-center bg-night/75 p-4 opacity-0 backdrop-blur-[3px]"
      role={show ? "dialog" : undefined}
      aria-label={show ? "the very good day" : undefined}
      aria-modal={show ? true : undefined}
      aria-hidden={!show}
      data-testid="finale-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.48, ease: EASE }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      inert={!show}
    >
      {show &&
        !reducedMotion &&
        Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute top-0"
            style={{
              left: `${(i * 11 + 5) % 96}%`,
              animation: `rain-coin ${3.6 + (i % 5) * 0.4}s linear infinite`,
              animationDelay: `${0.12 + i * 0.18}s`,
            }}
          >
            {i % 3 === 0 ? <Heart size={18} /> : <StarSticker size={16} />}
          </span>
        ))}

      <motion.div
        className="soft-card relative max-w-md bg-cream p-6 text-center text-ink"
        initial={{ scale: 0.9, y: 24, opacity: 0 }}
        animate={show ? { scale: 1, y: 0, opacity: 1 } : { scale: 0.9, y: 24, opacity: 0 }}
        transition={
          reducedMotion
            ? { duration: 0.2 }
            : { type: "spring", stiffness: 280, damping: 22, delay: show ? 0.06 : 0 }
        }
      >
        <motion.p
          className="font-hand text-xs tracking-[0.22em] text-ink-soft uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.35, delay: show ? 0.12 : 0, ease: EASE }}
        >
          100% happiness
        </motion.p>
        <p className="font-hand text-[2rem] leading-tight">
          {TITLE.map((word, i) => (
            <motion.span
              key={word}
              className="inline-block opacity-0"
              initial={{ opacity: 0, y: 16, scale: 0.84 }}
              animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.84 }}
              transition={
                reducedMotion
                  ? { duration: 0.2, delay: show ? 0.06 * i : 0 }
                  : { type: "spring", stiffness: 320, damping: 18, delay: show ? 0.2 + i * 0.11 : 0 }
              }
            >
              {word}
              {i < TITLE.length - 1 ? "\u00a0" : ""}
            </motion.span>
          ))}
        </p>
        <motion.div
          className="mt-1 flex justify-center gap-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.35, delay: show ? 0.62 : 0, ease: EASE }}
        >
          <StarSticker size={20} className="anim-twinkle" />
          <StarSticker size={26} className="anim-twinkle" />
          <StarSticker size={20} className="anim-twinkle" />
        </motion.div>

        {step >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-3 font-hand text-lg"
          >
            you found basically everything
          </motion.p>
        )}
        {step >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-2 font-hand text-sm text-ink-soft"
          >
            which is impressive, because there was an unreasonable amount of nonsense in here
          </motion.p>
        )}
        {step >= 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
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
  )
}
