import { AnimatePresence, motion } from "framer-motion"
import { useGame } from "../hooks/GameContext"

export function ToastLayer() {
  const { toasts } = useGame()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[5.4rem] z-[80] flex flex-col items-center gap-1.5 px-4 sm:bottom-24">
      <AnimatePresence>
        {toasts.slice(-3).map((t) => (
          <motion.p
            key={t.id}
            initial={{ opacity: 0, y: 18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className={`m-0 flex max-w-[92vw] items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-center font-hand text-[0.95rem] shadow-[0_14px_26px_-16px_rgba(91,68,80,0.9)] ${
              t.kind === "achieve"
                ? "border-butter/60 bg-night text-cream"
                : t.kind === "secret"
                  ? "border-lilac-deep/40 bg-lilac text-ink"
                  : "border-ink/10 bg-white/96 text-ink"
            }`}
          >
            <ToastGlyph kind={t.kind} />
            {t.text}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastGlyph({ kind }: { kind?: "plain" | "achieve" | "secret" }) {
  if (kind === "achieve")
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden className="shrink-0">
        <path d="M6 3h8v5a4 4 0 0 1-8 0z" fill="#ffd85e" stroke="#fff" strokeWidth="1.2" />
        <path d="M7 17h6l-1-3H8z" fill="#ffd85e" />
      </svg>
    )
  if (kind === "secret")
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden className="shrink-0">
        <path d="M10 2l1.6 5.4L17 9l-5.4 1.6L10 16l-1.6-5.4L3 9l5.4-1.6z" fill="#fff" stroke="#8a72c0" strokeWidth="1.2" />
      </svg>
    )
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden className="shrink-0">
      <circle cx="10" cy="10" r="7.4" fill="#ffdbe6" stroke="#5b4450" strokeWidth="1.3" />
      <circle cx="7.6" cy="8.6" r="1" fill="#5b4450" />
      <circle cx="12.4" cy="8.6" r="1" fill="#5b4450" />
      <path d="M7.4 12.4c1.6 1.6 3.6 1.6 5.2 0" stroke="#5b4450" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function SaveIndicator() {
  const { justSaved } = useGame()
  return (
    <AnimatePresence>
      {justSaved && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className="pointer-events-none fixed top-[3.9rem] right-3 z-[90] flex items-center gap-1.5 rounded-full border-[1.5px] border-ink/10 bg-white/96 px-3 py-1 font-hand text-sm text-ink shadow-[0_10px_18px_-12px_rgba(91,68,80,0.9)]"
          data-testid="save-indicator"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
            <path d="M3 8.6l3.2 3.2L13 5" fill="none" stroke="#3c8159" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          saved
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
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: p.x, top: p.y, animation: "popfade 0.7s ease-out forwards" }}
        >
          <PopGlyph kind={p.kind} />
        </span>
      ))}
    </div>
  )
}

function PopGlyph({ kind }: { kind: "star" | "heart" | "coin" | "spark" }) {
  if (kind === "heart")
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
        <path d="M10 17C4 12.6 2 10.4 2 7.8A4.4 4.4 0 0 1 10 5.4 4.4 4.4 0 0 1 18 7.8c0 2.6-2 4.8-8 9.2z" fill="#ff8fae" />
      </svg>
    )
  if (kind === "coin")
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
        <circle cx="10" cy="10" r="8" fill="#f7d774" stroke="#e0ab2f" strokeWidth="1.3" />
      </svg>
    )
  if (kind === "spark")
    return (
      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
        <path d="M10 1l1.8 6.2L18 10l-6.2 1.8L10 19l-1.8-7.2L2 10l6.2-2.8z" fill="#fff5cf" stroke="#ffd85e" strokeWidth="1" />
      </svg>
    )
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
      <path d="M10 2l2.5 5.2 5.5.8-4 3.9 1 5.6L10 14.8 4.9 17.5l1-5.6-4-3.9 5.5-.8z" fill="#ffd85e" stroke="#e0ab2f" strokeWidth="1" />
    </svg>
  )
}
