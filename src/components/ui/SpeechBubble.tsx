import { motion } from "framer-motion"
import type { ReactNode } from "react"

export function SpeechBubble({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.86 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.9 }}
      className={`pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-2xl border-2 border-ink/10 bg-white px-2.5 py-1 text-center font-hand text-sm text-ink shadow-[3px_4px_0_rgba(74,63,85,0.08)] ${className}`}
    >
      {children}
      <span className="absolute top-full left-1/2 -mt-px -translate-x-1/2 border-[6px] border-transparent border-t-white" />
    </motion.div>
  )
}
