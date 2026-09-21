import type { ReactNode } from "react"
import { motion } from "framer-motion"

type Tone = "cream" | "pink" | "mint" | "night" | "lilac" | "sun" | "sky"

const TONES: Record<Tone, string> = {
  cream: "bg-gradient-to-b from-white to-sand/70 text-ink",
  pink: "bg-gradient-to-b from-blush to-blush-deep text-ink",
  mint: "bg-gradient-to-b from-mint to-mint-deep text-ink",
  lilac: "bg-gradient-to-b from-lilac to-lilac-deep text-ink",
  sun: "bg-gradient-to-b from-butter to-peach text-ink",
  sky: "bg-gradient-to-b from-sky to-sky-deep text-ink",
  night: "bg-gradient-to-b from-night to-night-deep text-cream",
}

export function GameButton({
  children,
  onClick,
  className = "",
  tone = "cream",
  size = "md",
  disabled,
  type = "button",
  testid,
  label,
  block = false,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
}: {
  children: ReactNode
  onClick?: () => void
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerUp?: (e: React.PointerEvent) => void
  onPointerLeave?: (e: React.PointerEvent) => void
  onPointerCancel?: (e: React.PointerEvent) => void
  className?: string
  tone?: Tone
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  type?: "button" | "submit"
  testid?: string
  label?: string
  block?: boolean
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-2xl",
    md: "px-4 py-2.5 text-base rounded-[1.1rem]",
    lg: "px-6 py-3 text-lg rounded-[1.3rem]",
  }
  return (
    <motion.button
      type={type}
      aria-label={label}
      data-testid={testid}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.955, y: 2 }}
      whileHover={disabled ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 520, damping: 26 }}
      className={`hit-area relative inline-flex select-none items-center justify-center gap-2 overflow-hidden border-[1.5px] border-ink/12 font-hand font-bold shadow-[0_4px_0_rgba(91,68,80,0.14),0_12px_22px_-14px_rgba(91,68,80,0.6)] transition-shadow disabled:opacity-45 disabled:shadow-none ${
        sizes[size]
      } ${TONES[tone]} ${block ? "w-full" : ""} ${className}`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
    >
      <span className="pointer-events-none absolute inset-x-1 top-0.5 h-1/3 rounded-full bg-white/45 blur-[2px]" />
      <span className="relative flex items-center gap-2">{children}</span>
    </motion.button>
  )
}

export function Panel({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode
  className?: string
  padded?: boolean
}) {
  return <div className={`soft-card ${padded ? "p-4" : ""} ${className}`}>{children}</div>
}

export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label-sticker mb-3 text-sm ${className}`}>{children}</p>
}

export function Pill({
  children,
  className = "",
  tone,
}: {
  children: ReactNode
  className?: string
  tone?: "blush" | "mint" | "sky" | "butter" | "lilac"
}) {
  const bg = tone
    ? {
        blush: "bg-blush",
        mint: "bg-mint",
        sky: "bg-sky",
        butter: "bg-butter",
        lilac: "bg-lilac",
      }[tone]
    : ""
  return <span className={`pill ${bg} ${className}`}>{children}</span>
}

export function SectionTitle({
  children,
  hint,
  className = "",
}: {
  children: ReactNode
  hint?: ReactNode
  className?: string
}) {
  return (
    <div className={`mb-2 flex flex-wrap items-baseline justify-between gap-2 ${className}`}>
      <h2 className="font-hand text-lg">{children}</h2>
      {hint && <span className="font-hand text-xs opacity-70">{hint}</span>}
    </div>
  )
}

export function ProgressBar({
  value,
  tone = "rose",
  className = "",
  label,
}: {
  value: number
  tone?: "rose" | "mint" | "sky" | "butter"
  className?: string
  label?: string
}) {
  const fills = {
    rose: "from-blush-deep to-rose",
    mint: "from-mint-deep to-mint",
    sky: "from-sky-deep to-sky",
    butter: "from-butter to-peach",
  }
  return (
    <div className={className}>
      <div
        className="relative h-3.5 w-full overflow-hidden rounded-full border-[1.5px] border-ink/10 bg-white/85 shadow-inner"
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.span
          className={`block h-full rounded-full bg-gradient-to-r ${fills[tone]}`}
          initial={false}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
        />
        <span className="shimmer-line" />
      </div>
    </div>
  )
}

export function DoneChip({ className = "" }: { className?: string }) {
  return (
    <span
      data-testid="done-chip"
      className={`pill border-mint-deep/60 bg-mint text-ink ${className}`}
    >
      <CheckIcon /> done · play again
    </span>
  )
}

export function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <path
        d="M3 8.6l3.2 3.2L13 5"
        fill="none"
        stroke="#3c8159"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <rect x="3" y="7" width="10" height="7" rx="2.2" fill="#8a7183" />
      <path d="M5.4 7V5.4a2.6 2.6 0 0 1 5.2 0V7" fill="none" stroke="#8a7183" strokeWidth="1.8" />
    </svg>
  )
}
