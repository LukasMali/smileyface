import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useWorld } from "../../hooks/WorldContext"
import { usePop } from "../../hooks/usePop"
import { SparkleBurst } from "../ui/SparkleBurst"
import { SpeechBubble } from "../ui/SpeechBubble"

export function Burger({
  legendary = false,
  className = "",
  size = 110,
}: {
  legendary?: boolean
  className?: string
  size?: number
}) {
  const { notify, celebrate, addFun } = useWorld()
  const [pop, trigger] = usePop()
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!msg) return
    const t = window.setTimeout(() => setMsg(null), 1400)
    return () => window.clearTimeout(t)
  }, [msg])

  return (
    <motion.button
      type="button"
      aria-label={legendary ? "legendary burger" : "tiny burger"}
      className={`hit-area relative border-0 bg-transparent p-0 ${className}`}
      whileHover={{ rotate: 4 }}
      animate={pop || celebrate ? { y: [0, -14, 0], scale: [1, 1.08, 1] } : {}}
      onClick={() => {
        trigger()
        addFun(3)
        setMsg("burger acquired")
        notify("burger acquired")
      }}
    >
      <SparkleBurst active={pop} />
      <AnimatePresence>
        {msg && <SpeechBubble className="-top-6">{msg}</SpeechBubble>}
      </AnimatePresence>
      <svg width={size} height={size * 0.85} viewBox="0 0 120 100" className="sticker" aria-hidden>
        {legendary && (
          <ellipse cx="60" cy="50" rx="54" ry="44" fill="#fff3c4" opacity="0.55" />
        )}
        <path d="M18 44 Q60 8 102 44 Z" fill="#e8c39e" stroke="#4a3f55" strokeWidth="1.6" />
        <circle cx="40" cy="30" r="3" fill="#fff" />
        <circle cx="62" cy="24" r="2.6" fill="#fff" />
        <circle cx="78" cy="32" r="2.4" fill="#fff" />
        <path d="M20 46 Q60 36 100 46 L100 52 Q60 44 20 52 Z" fill="#8fd9b0" />
        <rect x="20" y="50" width="80" height="10" rx="4" fill="#c97c5d" />
        <rect x="22" y="60" width="76" height="8" rx="3" fill="#fff3c4" />
        <path d="M18 70 Q60 58 102 70 Q60 92 18 70" fill="#d4a574" stroke="#4a3f55" strokeWidth="1.5" />
      </svg>
    </motion.button>
  )
}

export function LegendaryPlate({ className = "" }: { className?: string }) {
  return (
    <svg
      width="200"
      height="150"
      viewBox="0 0 200 150"
      className={`sticker ${className}`}
      aria-hidden
    >
      <ellipse cx="100" cy="118" rx="70" ry="14" fill="#e8dcff" />
      <ellipse cx="100" cy="108" rx="72" ry="18" fill="#fff" stroke="#4a3f55" strokeWidth="1.7" />
      <ellipse cx="100" cy="104" rx="58" ry="12" fill="#f4eee0" />
      <ellipse cx="96" cy="78" rx="34" ry="26" fill="#fff8e7" stroke="#e8d9b0" strokeWidth="1.4" />
      <ellipse cx="92" cy="70" rx="22" ry="14" fill="#fffdf5" />
      <path
        d="M118 86 c12-18 28-10 34 4 4 10-2 18-14 20-16 2-24-8-20-24z"
        fill="#6bbf8a"
        stroke="#3d7a54"
        strokeWidth="1.2"
      />
      <path d="M128 78 c8-10 18-4 16 6" fill="#8fd9b0" />
      <ellipse cx="78" cy="92" rx="16" ry="10" fill="#ffeaa7" stroke="#e0c35a" strokeWidth="1.3" />
      <ellipse cx="108" cy="96" rx="14" ry="9" fill="#fff3c4" stroke="#e0c35a" strokeWidth="1.3" />
      <circle cx="74" cy="90" r="1.4" fill="#4a3f55" opacity="0.35" />
      <circle cx="112" cy="94" r="1.4" fill="#4a3f55" opacity="0.35" />
    </svg>
  )
}

export function TinyCar({
  className = "",
  onHonk,
}: {
  className?: string
  onHonk?: () => void
}) {
  return (
    <button
      type="button"
      aria-label="tiny car, honk"
      className={`hit-area border-0 bg-transparent p-0 ${className}`}
      onClick={onHonk}
    >
      <svg width="120" height="70" viewBox="0 0 120 70" className="sticker" aria-hidden>
        <path d="M18 40 L34 22 H78 L102 40 Z" fill="#a8d8ea" stroke="#4a3f55" strokeWidth="1.6" />
        <rect x="12" y="38" width="96" height="18" rx="7" fill="#ffb3c6" stroke="#4a3f55" strokeWidth="1.6" />
        <rect x="40" y="24" width="22" height="14" rx="3" fill="#e0f4ff" />
        <circle cx="36" cy="56" r="9" fill="#4a3f55" />
        <circle cx="36" cy="56" r="4" fill="#c5e8f7" />
        <circle cx="86" cy="56" r="9" fill="#4a3f55" />
        <circle cx="86" cy="56" r="4" fill="#c5e8f7" />
      </svg>
    </button>
  )
}
