import { motion } from "framer-motion"
import { alienMessages } from "../../data/messages"
import { useWorld } from "../../hooks/WorldContext"
import { pick } from "../../lib/random"

type AlienMode = "ufo" | "peek" | "nurse" | "drive" | "steal"

export function MrAlien({
  size = 92,
  mode = "ufo",
  className = "",
  interactive = false,
}: {
  size?: number
  mode?: AlienMode
  className?: string
  interactive?: boolean
}) {
  const { addSavings, notify, addFun } = useWorld()

  const inner = (
    <svg
      width={size}
      height={size * 0.9}
      viewBox="0 0 120 110"
      className="sticker overflow-visible"
      aria-hidden={!interactive}
    >
      {mode === "ufo" || mode === "drive" ? (
        <>
          <ellipse cx="60" cy="78" rx="34" ry="8" fill="#4a3f55" opacity="0.12" />
          <ellipse cx="60" cy="62" rx="52" ry="16" fill="#c4b0ea" />
          <ellipse cx="60" cy="56" rx="52" ry="12" fill="#e0d4f7" />
          <ellipse cx="60" cy="52" rx="38" ry="8" fill="#f6f0ff" />
          <ellipse cx="60" cy="36" rx="26" ry="24" fill="#b8f4e0" opacity="0.55" />
          <circle cx="60" cy="34" r="16" fill="#9dce6a" />
          <ellipse cx="53" cy="33" rx="5.5" ry="8" fill="#2a2430" />
          <ellipse cx="67" cy="33" rx="5.5" ry="8" fill="#2a2430" />
          <circle cx="54.5" cy="30.5" r="1.6" fill="#fff" />
          <circle cx="68.5" cy="30.5" r="1.6" fill="#fff" />
          <circle cx="60" cy="42" r="2" fill="#3d5a20" />
          <path d="M48 18 Q60 6 72 18" stroke="#7aa84a" strokeWidth="3" fill="none" />
          <circle cx="72" cy="16" r="3.5" fill="#ffd6e0" />
          {mode === "drive" && (
            <text x="60" y="104" textAnchor="middle" fontSize="10" fill="#4a3f55" fontFamily="Patrick Hand">
              wrong way??
            </text>
          )}
        </>
      ) : (
        <>
          <circle cx="60" cy="52" r="22" fill="#9dce6a" />
          <ellipse cx="51" cy="50" rx="7" ry="10" fill="#2a2430" />
          <ellipse cx="69" cy="50" rx="7" ry="10" fill="#2a2430" />
          <circle cx="53" cy="47" r="2" fill="#fff" />
          <circle cx="71" cy="47" r="2" fill="#fff" />
          <path d="M44 28 Q60 12 76 28" stroke="#7aa84a" strokeWidth="3" fill="none" />
          <circle cx="76" cy="26" r="4" fill="#ffd6e0" />
          {mode === "nurse" && (
            <g>
              <rect x="42" y="26" width="36" height="12" rx="3" fill="#fff" />
              <rect x="56" y="22" width="8" height="10" rx="2" fill="#fff" />
              <rect x="58" y="28" width="4" height="8" fill="#ff8fab" />
              <rect x="54" y="30" width="12" height="4" fill="#ff8fab" />
            </g>
          )}
          {mode === "steal" && (
            <g>
              <ellipse cx="88" cy="70" rx="14" ry="10" fill="#e8c39e" />
              <ellipse cx="88" cy="66" rx="12" ry="6" fill="#8fd9b0" />
              <circle cx="82" cy="62" r="4" fill="#fff3c4" />
            </g>
          )}
          {mode === "peek" && (
            <rect x="0" y="70" width="120" height="40" fill="currentColor" opacity="0" />
          )}
        </>
      )}
    </svg>
  )

  if (!interactive) {
    return <div className={className}>{inner}</div>
  }

  return (
    <motion.button
      type="button"
      aria-label="Mr Alien, financial department"
      className={`hit-area cursor-grab border-0 bg-transparent p-0 active:cursor-grabbing ${className}`}
      drag
      dragMomentum
      dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
      whileTap={{ rotate: [0, -12, 10, -6, 0], scale: 1.06 }}
      onClick={() => {
        addSavings(3)
        addFun(5)
        notify(pick(alienMessages))
      }}
    >
      {inner}
    </motion.button>
  )
}

export function Coin({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14" fill="#f4d35e" stroke="#d4a017" strokeWidth="2" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="#ffeaa7" strokeWidth="2" />
      <text x="16" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="#8a6a12">
        €
      </text>
    </svg>
  )
}
