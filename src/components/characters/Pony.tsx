import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useWorld } from "../../hooks/WorldContext"
import { usePop } from "../../hooks/usePop"
import { SparkleBurst } from "../ui/SparkleBurst"
import { SpeechBubble } from "../ui/SpeechBubble"

export type PonyLook = {
  body: string
  mane: string
  accessory?: "nurse" | "sign" | "burger" | "coins" | "stylus" | "sleep"
}

export function Pony({
  look,
  name,
  className = "",
  dramatic = false,
  sleeping = false,
}: {
  look: PonyLook
  name: string
  className?: string
  dramatic?: boolean
  sleeping?: boolean
}) {
  const { notify, celebrate, addFun } = useWorld()
  const [pop, trigger] = usePop()
  const [clicks, setClicks] = useState(0)
  const [bubble, setBubble] = useState<string | null>(null)

  useEffect(() => {
    if (!bubble) return
    const t = window.setTimeout(() => setBubble(null), 1600)
    return () => window.clearTimeout(t)
  }, [bubble])

  return (
    <button
      type="button"
      aria-label={`${name} pony`}
      className={`hit-area relative border-0 bg-transparent p-0 ${className} ${celebrate ? "anim-bob" : ""}`}
      onClick={() => {
        trigger()
        addFun(2)
        const next = clicks + 1
        setClicks(next)
        if (dramatic && next >= 5) {
          setBubble("OKAY I GET IT 😭")
          notify("dramatic pony moment unlocked")
        } else {
          const lines = sleeping
            ? ["zzz… five more minutes", "boop. still sleeping", "ok FINE i'm up"]
            : ["hop!", "pet accepted", "pony council noted that", "again. do it again"]
          setBubble(lines[next % lines.length] as string)
        }
      }}
    >
      <SparkleBurst active={pop} />
      <AnimatePresence>
        {bubble && (
          <SpeechBubble className="-top-7 w-max max-w-40">{bubble}</SpeechBubble>
        )}
      </AnimatePresence>
      <svg
        width="150"
        height="128"
        viewBox="0 0 150 128"
        className={`sticker overflow-visible ${pop ? "anim-bob" : ""}`}
        aria-hidden
      >
        <g className="anim-tail">
          <path
            d="M28 78 Q8 58 22 42 Q34 62 40 78"
            fill={look.mane}
            stroke="#4a3f55"
            strokeWidth="1.4"
          />
        </g>
        <ellipse cx="68" cy="78" rx="40" ry="24" fill={look.body} stroke="#4a3f55" strokeWidth="1.6" />
        <ellipse cx="98" cy="58" rx="13" ry="18" fill={look.body} stroke="#4a3f55" strokeWidth="1.4" />
        <ellipse cx="114" cy="42" rx="20" ry="17" fill={look.body} stroke="#4a3f55" strokeWidth="1.6" />
        <ellipse cx="130" cy="48" rx="11" ry="8" fill={look.body} stroke="#4a3f55" strokeWidth="1.4" />
        <circle cx="134" cy="46" r="1.6" fill="#4a3f55" />
        <g className="anim-ear" style={{ transformOrigin: "108px 28px" }}>
          <ellipse cx="108" cy="24" rx="6" ry="12" fill={look.body} stroke="#4a3f55" strokeWidth="1.3" />
          <ellipse cx="108" cy="24" rx="3" ry="7" fill={look.mane} />
        </g>
        <path
          d="M96 34 Q104 8 124 22 Q116 34 108 36"
          fill={look.mane}
          stroke="#4a3f55"
          strokeWidth="1.3"
        />
        <circle cx="118" cy="40" r="5" fill="#fff" />
        <circle cx="119" cy="41" r="3" fill="#2a2430" />
        <circle cx="120" cy="40" r="1.1" fill="#fff" />
        <rect
          className="anim-blink"
          x="113"
          y="36"
          width="12"
          height="10"
          rx="3"
          fill={look.body}
        />
        {sleeping && (
          <path d="M118 38 Q122 40 118 42" stroke="#4a3f55" strokeWidth="1.6" fill="none" />
        )}
        <rect x="46" y="96" width="8" height="24" rx="4" fill={look.body} stroke="#4a3f55" strokeWidth="1.3" />
        <rect x="62" y="98" width="8" height="22" rx="4" fill={look.body} stroke="#4a3f55" strokeWidth="1.3" />
        <rect x="78" y="97" width="8" height="23" rx="4" fill={look.body} stroke="#4a3f55" strokeWidth="1.3" />
        <rect x="90" y="96" width="8" height="24" rx="4" fill={look.body} stroke="#4a3f55" strokeWidth="1.3" />
        {look.accessory === "nurse" && (
          <g>
            <rect x="100" y="18" width="32" height="12" rx="3" fill="#fff" stroke="#4a3f55" strokeWidth="1.2" />
            <rect x="112" y="14" width="8" height="10" fill="#fff" stroke="#4a3f55" strokeWidth="1.2" />
            <rect x="114.5" y="20" width="3" height="8" fill="#ff8fab" />
            <rect x="112" y="22.5" width="8" height="3" fill="#ff8fab" />
          </g>
        )}
        {look.accessory === "sign" && (
          <g>
            <rect x="8" y="18" width="44" height="28" rx="6" fill="#fff3c4" stroke="#4a3f55" strokeWidth="1.4" />
            <text x="30" y="36" textAnchor="middle" fontSize="8" fill="#4a3f55" fontFamily="Patrick Hand">
              DRIVE
            </text>
            <rect x="28" y="46" width="4" height="22" fill="#8d6e4c" />
          </g>
        )}
        {look.accessory === "burger" && (
          <g>
            <ellipse cx="28" cy="70" rx="16" ry="12" fill="#e8c39e" stroke="#4a3f55" strokeWidth="1.2" />
            <path d="M14 70 Q28 58 42 70" fill="#8fd9b0" />
            <ellipse cx="28" cy="74" rx="14" ry="5" fill="#c97c5d" />
          </g>
        )}
        {look.accessory === "coins" && (
          <g>
            <circle cx="22" cy="62" r="8" fill="#f4d35e" stroke="#d4a017" strokeWidth="1.2" />
            <circle cx="32" cy="70" r="7" fill="#f4d35e" stroke="#d4a017" strokeWidth="1.2" />
            <circle cx="18" cy="74" r="6" fill="#ffeaa7" stroke="#d4a017" strokeWidth="1.2" />
          </g>
        )}
        {look.accessory === "stylus" && (
          <g transform="translate(8 52) rotate(-20)">
            <rect x="0" y="0" width="6" height="36" rx="3" fill="#4a3f55" />
            <rect x="0" y="0" width="6" height="10" rx="3" fill="#ffd6e0" />
            <polygon points="0,36 6,36 3,44" fill="#c5e8f7" />
          </g>
        )}
        {look.accessory === "sleep" && (
          <text x="132" y="22" fontSize="12" fill="#6b5d78" fontFamily="Patrick Hand">
            z
          </text>
        )}
      </svg>
    </button>
  )
}
