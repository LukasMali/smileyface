import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { easterMessages } from "../../data/messages"
import { useWorld } from "../../hooks/WorldContext"
import { pick } from "../../lib/random"

export function EasterEgg({
  label,
  message,
  className = "",
  children,
}: {
  label: string
  message?: string
  className?: string
  children: ReactNode
}) {
  const { notify, addFun } = useWorld()
  return (
    <motion.button
      type="button"
      aria-label={label}
      className={`hit-area absolute z-10 cursor-pointer border-0 bg-transparent p-0 ${className}`}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.08, rotate: -6 }}
      onClick={() => {
        addFun(2)
        notify(message ?? pick(easterMessages))
      }}
    >
      {children}
    </motion.button>
  )
}
