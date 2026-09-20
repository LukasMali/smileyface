import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { iceCreamMessages } from "../../data/messages"
import { useWorld } from "../../hooks/WorldContext"
import { usePop } from "../../hooks/usePop"
import { pick } from "../../lib/random"
import { SparkleBurst } from "../ui/SparkleBurst"
import { SpeechBubble } from "../ui/SpeechBubble"

export function CactusIceCream({
  body,
  spots,
  stick = "#e8c39e",
  className = "",
}: {
  body: string
  spots: string
  stick?: string
  className?: string
}) {
  const { notify, celebrate, addFun } = useWorld()
  const [pop, trigger] = usePop()
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!msg) return
    const t = window.setTimeout(() => setMsg(null), 1600)
    return () => window.clearTimeout(t)
  }, [msg])

  return (
    <motion.button
      type="button"
      aria-label="cactus ice cream"
      className={`hit-area relative border-0 bg-transparent p-0 ${className}`}
      whileHover={{ rotate: -8, y: -4 }}
      whileTap={{ scale: 0.94 }}
      animate={pop ? { y: [0, -18, 0] } : { y: 0 }}
      onClick={() => {
        trigger()
        addFun(3)
        const text = pick(iceCreamMessages)
        setMsg(text)
        notify(text)
      }}
    >
      <SparkleBurst active={pop} />
      <AnimatePresence>
        {msg && <SpeechBubble className="-top-8 w-max max-w-44">{msg}</SpeechBubble>}
      </AnimatePresence>
      <svg
        width="86"
        height="130"
        viewBox="0 0 86 130"
        className={`sticker overflow-visible ${celebrate ? "anim-wiggle" : ""}`}
        aria-hidden
      >
        <rect x="36" y="88" width="14" height="36" rx="4" fill={stick} stroke="#4a3f55" strokeWidth="1.4" />
        <rect x="38" y="94" width="4" height="24" rx="2" fill="#fff" opacity="0.25" />
        <path
          d="M43 20 c-16 0-28 14-28 32 0 10 4 18 10 24 v18 c0 6 8 10 18 10 s18-4 18-10 v-18 c6-6 10-14 10-24 0-18-12-32-28-32z"
          fill={body}
          stroke="#4a3f55"
          strokeWidth="1.7"
        />
        <path
          d="M18 46 c-10-2-16 8-12 16 4 8 14 8 18 2"
          fill={body}
          stroke="#4a3f55"
          strokeWidth="1.5"
        />
        <path
          d="M68 46 c10-2 16 8 12 16-4 8-14 8-18 2"
          fill={body}
          stroke="#4a3f55"
          strokeWidth="1.5"
        />
        <circle cx="34" cy="44" r="6" fill="#fff" />
        <circle cx="52" cy="44" r="6" fill="#fff" />
        <circle cx="35" cy="45" r="3.2" fill="#2a2430" />
        <circle cx="53" cy="45" r="3.2" fill="#2a2430" />
        <circle cx="36" cy="44" r="1.1" fill="#fff" />
        <circle cx="54" cy="44" r="1.1" fill="#fff" />
        <path d="M38 58 Q43 64 48 58" stroke="#4a3f55" strokeWidth="1.6" fill="none" />
        <circle cx="28" cy="36" r="3.4" fill={spots} />
        <circle cx="56" cy="32" r="3" fill={spots} />
        <circle cx="43" cy="72" r="3.2" fill={spots} />
        <circle cx="32" cy="66" r="2.4" fill={spots} />
        <circle cx="54" cy="62" r="2.6" fill={spots} />
        <ellipse className="anim-drip" cx="30" cy="88" rx="3" ry="5" fill={body} />
        <ellipse className="anim-drip" cx="54" cy="90" rx="2.6" ry="4.4" fill={body} style={{ animationDelay: "0.6s" }} />
      </svg>
    </motion.button>
  )
}
