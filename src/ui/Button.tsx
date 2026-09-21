import type { ReactNode } from "react"
import { motion } from "framer-motion"

export function GameButton({
  children,
  onClick,
  className = "",
  tone = "cream",
  disabled,
  type = "button",
  testid,
  label,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  tone?: "cream" | "pink" | "mint" | "night" | "lilac"
  disabled?: boolean
  type?: "button" | "submit"
  testid?: string
  label?: string
}) {
  const tones: Record<string, string> = {
    cream: "bg-white text-ink",
    pink: "bg-blush text-ink",
    mint: "bg-mint text-ink",
    night: "bg-night text-cream",
    lilac: "bg-lilac text-ink",
  }
  return (
    <motion.button
      type={type}
      aria-label={label}
      data-testid={testid}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.94, y: 2 }}
      whileHover={disabled ? undefined : { y: -2 }}
      className={`hit-area inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/10 px-4 py-2.5 font-hand text-base shadow-[3px_4px_0_rgba(74,63,85,0.12)] disabled:opacity-50 ${tones[tone]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-[1.6rem] border-2 border-ink/10 bg-white/80 p-4 shadow-[6px_8px_0_rgba(74,63,85,0.07)] backdrop-blur-sm ${className}`}>
      {children}
    </div>
  )
}

export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label-sticker mb-3 text-sm ${className}`}>{children}</p>
}
