import { AnimatePresence, motion } from "framer-motion"
import { useGame } from "../hooks/GameContext"

export function ToastLayer() {
  const { toasts } = useGame()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[4.6rem] z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.p
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className={`max-w-[90vw] rounded-full border-2 px-4 py-2 text-center font-hand text-base shadow-[4px_6px_0_rgba(74,63,85,0.1)] ${
              t.kind === "achieve"
                ? "border-butter bg-night text-cream"
                : t.kind === "secret"
                  ? "border-lilac-deep/30 bg-lilac text-ink"
                  : "border-ink/10 bg-white/95 text-ink"
            }`}
          >
            {t.text}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function SaveIndicator() {
  const { justSaved } = useGame()
  return (
    <AnimatePresence>
      {justSaved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="pointer-events-none fixed top-3 right-3 z-[90] rounded-full bg-white/95 px-3 py-1 font-hand text-sm text-ink shadow-[3px_4px_0_rgba(74,63,85,0.1)]"
          data-testid="save-indicator"
        >
          saved ✨
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SparkPops() {
  const { pops } = useGame()
  return (
    <div className="pointer-events-none fixed inset-0 z-[75]">
      {pops.map((p) => (
        <span
          key={p.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-lg"
          style={{ left: p.x, top: p.y, animation: "popfade 0.7s ease-out forwards" }}
        >
          {p.kind === "heart" ? "♡" : p.kind === "coin" ? "€" : p.kind === "spark" ? "✦" : "★"}
        </span>
      ))}
    </div>
  )
}
