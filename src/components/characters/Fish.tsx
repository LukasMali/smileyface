import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { fishMessages } from "../../data/messages"
import { useWorld } from "../../hooks/WorldContext"
import { pick } from "../../lib/random"
import { SpeechBubble } from "../ui/SpeechBubble"

export type FishExtra = "nurse" | "car" | "coin" | "burger" | "confused" | "tiny" | "none"

export function Fish({
  color,
  fin,
  extra = "none",
  size = 86,
  delay = 0,
  flip = false,
  className = "",
  message,
}: {
  color: string
  fin: string
  extra?: FishExtra
  size?: number
  delay?: number
  flip?: boolean
  className?: string
  message?: string
}) {
  const { notify, celebrate, addFun } = useWorld()
  const [bubble, setBubble] = useState<string | null>(null)

  useEffect(() => {
    if (!bubble) return
    const t = window.setTimeout(() => setBubble(null), 1500)
    return () => window.clearTimeout(t)
  }, [bubble])

  return (
    <button
      type="button"
      aria-label="friendly fish"
      className={`hit-area relative border-0 bg-transparent p-0 ${className}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={() => {
        const text = message ?? pick(fishMessages)
        setBubble(text)
        addFun(2)
        notify(text)
      }}
    >
      <AnimatePresence>
        {bubble && <SpeechBubble className="-top-6 w-max">{bubble}</SpeechBubble>}
      </AnimatePresence>
      <svg
        width={size}
        height={size * 0.7}
        viewBox="0 0 120 80"
        className={`sticker anim-swim overflow-visible ${celebrate ? "celebrate-fast" : ""} ${flip ? "-scale-x-100" : ""}`}
        style={{ animationDelay: `${delay}s` }}
        aria-hidden
      >
        <polygon points="18,40 0,18 4,40 0,62" fill={fin} stroke="#4a3f55" strokeWidth="1.3" />
        <ellipse cx="62" cy="40" rx="38" ry="22" fill={color} stroke="#4a3f55" strokeWidth="1.6" />
        <path d="M48 28 Q62 18 86 28" fill={fin} opacity="0.55" />
        <polygon points="70,22 82,8 90,24" fill={fin} stroke="#4a3f55" strokeWidth="1.2" />
        <polygon points="70,58 84,74 90,56" fill={fin} stroke="#4a3f55" strokeWidth="1.2" />
        <circle cx="88" cy="36" r="6" fill="#fff" />
        <circle cx="90" cy="37" r="3.2" fill="#2a2430" />
        <circle cx="91" cy="36" r="1.1" fill="#fff" />
        {extra === "confused" && (
          <text x="96" y="18" fontSize="12" fill="#4a3f55">
            ?
          </text>
        )}
        {extra === "nurse" && (
          <g>
            <rect x="72" y="14" width="28" height="10" rx="2" fill="#fff" stroke="#4a3f55" strokeWidth="1.1" />
            <rect x="83" y="18" width="6" height="6" fill="#ff8fab" />
            <rect x="81" y="20" width="10" height="2" fill="#ff8fab" />
          </g>
        )}
        {extra === "car" && (
          <g>
            <rect x="40" y="52" width="44" height="16" rx="6" fill="#ffd6e0" stroke="#4a3f55" strokeWidth="1.2" />
            <circle cx="52" cy="70" r="5" fill="#4a3f55" />
            <circle cx="74" cy="70" r="5" fill="#4a3f55" />
          </g>
        )}
        {extra === "coin" && (
          <g>
            <circle cx="108" cy="22" r="10" fill="#f4d35e" stroke="#d4a017" strokeWidth="1.3" />
            <text x="108" y="26" textAnchor="middle" fontSize="10" fill="#8a6a12">
              €
            </text>
          </g>
        )}
        {extra === "burger" && (
          <g>
            <ellipse cx="28" cy="22" rx="16" ry="10" fill="#e8c39e" stroke="#4a3f55" strokeWidth="1.1" />
            <path d="M14 22 Q28 12 42 22" fill="#8fd9b0" />
          </g>
        )}
      </svg>
    </button>
  )
}
