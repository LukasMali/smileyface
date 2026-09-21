import { AnimatePresence, motion } from "framer-motion"
import { ACHIEVEMENTS } from "../game/areas"
import { useGame } from "../hooks/GameContext"
import { KawaiiBlob } from "../art/Blob"
import { AchIcon } from "../art/AchIcon"

export function AchievementBurst() {
  const { justAchievements, reducedMotion } = useGame()
  const id = justAchievements[0]
  const def = ACHIEVEMENTS.find((a) => a.id === id)
  return (
    <AnimatePresence>
      {def && (
        <motion.div
          initial={{ opacity: 0, scale: 0.86, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -14 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="pointer-events-none fixed top-[4.4rem] left-1/2 z-[88] w-[min(92vw,20rem)] -translate-x-1/2 overflow-hidden rounded-[1.5rem] border-[1.5px] border-butter/70 bg-white/97 p-4 text-center shadow-[0_22px_40px_-22px_rgba(91,68,80,0.9)]"
        >
          {/* soft ray burst behind the medal */}
          <motion.svg
            viewBox="0 0 200 200"
            className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2"
            aria-hidden
            animate={reducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <path key={i} d="M100 100L94 4h12z" fill="#ffd85e" opacity="0.28" transform={`rotate(${i * 25.7} 100 100)`} />
            ))}
          </motion.svg>

          <div className="relative flex items-center justify-center gap-3">
            <KawaiiBlob mood="yay" size={52} />
            <motion.span
              className="relative grid h-14 w-14 place-items-center rounded-full border-[1.5px] border-butter-deep/60 bg-butter"
              initial={{ rotate: -14, scale: 0.7 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.08 }}
            >
              <AchIcon id={def.id} size={38} />
            </motion.span>
          </div>
          <p className="relative mt-2 font-hand text-xs tracking-[0.18em] text-ink-soft uppercase">achievement unlocked</p>
          <p className="relative font-hand text-xl leading-tight">{def.title}</p>
          <p className="relative text-sm text-ink-soft">{def.description}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
