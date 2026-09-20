import { AnimatePresence, motion } from "framer-motion"
import { useWorld } from "../../hooks/WorldContext"

export function ToastLayer() {
  const { toasts } = useWorld()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.p
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-[90vw] rounded-full border-2 border-ink/10 bg-white/95 px-4 py-2 text-center font-hand text-base text-ink shadow-[4px_6px_0_rgba(74,63,85,0.1)]"
          >
            {t.text}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  )
}
