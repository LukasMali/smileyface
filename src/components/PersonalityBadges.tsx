import { motion, useReducedMotion } from "framer-motion"
import { badges } from "../data/messages"
import { useWorld } from "../hooks/WorldContext"
import { usePop } from "../hooks/usePop"
import { Scene, Wave } from "./ui/Floating"
import { SparkleBurst } from "./ui/SparkleBurst"

const palette = ["#ffd6e0", "#c8f0d8", "#fff3c4", "#c5e8f7", "#e0d4f7", "#ffe8c8"]

export function PersonalityBadges() {
  return (
    <Scene className="bg-linear-to-b from-lilac to-[#c9d4f6] pb-8">
      <Wave fill="#e0d4f7" />
      <div className="relative mx-auto max-w-3xl px-4">
        <p className="label-sticker mb-8 text-sm">personality constellation</p>
        <div className="relative mx-auto h-[420px] max-w-lg sm:h-[460px]">
          {badges.map((badge, i) => {
            const angle = (i / badges.length) * Math.PI * 2 - Math.PI / 2
            const r = 38 + (i % 3) * 6
            return (
              <Badge
                key={badge}
                text={badge}
                color={palette[i % palette.length] as string}
                style={{
                  left: `${50 + Math.cos(angle) * r}%`,
                  top: `${48 + Math.sin(angle) * r * 0.85}%`,
                }}
                delay={i * 0.12}
              />
            )
          })}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="50%" cy="48%" r="8" fill="#fff3c4" />
          </svg>
        </div>
      </div>
    </Scene>
  )
}

function Badge({
  text,
  color,
  style,
  delay,
}: {
  text: string
  color: string
  style: { left: string; top: string }
  delay: number
}) {
  const { notify, addFun } = useWorld()
  const [pop, trigger] = usePop()
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      aria-label={`${text} badge`}
      className="hit-area absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink/10 px-3 py-2 font-hand text-sm text-ink shadow-[3px_4px_0_rgba(74,63,85,0.1)]"
      style={{ ...style, background: color, animationDelay: `${delay}s` }}
      whileHover={reduce ? undefined : { scale: 1.08, rotate: 6 }}
      whileTap={{ scale: 0.94, rotate: -8 }}
      animate={reduce ? undefined : { y: [0, -6, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
      onClick={() => {
        trigger()
        addFun(2)
        notify(text)
      }}
    >
      <SparkleBurst active={pop} />
      {text}
    </motion.button>
  )
}
