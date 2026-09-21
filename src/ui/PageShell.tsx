import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { useGame } from "../hooks/GameContext"
import { LOADING_LINES } from "../game/messages"
import { pick } from "../lib/random"
import { areaById } from "../game/areas"
import type { AreaId } from "../game/types"
import { CheckIcon } from "./Button"

export function PageShell({
  title,
  area,
  children,
  tint,
  night,
  subtitle,
  aside,
}: {
  title: string
  area: string
  children: ReactNode
  tint?: string
  night?: boolean
  subtitle?: ReactNode
  aside?: ReactNode
}) {
  const { visit, reducedMotion, save } = useGame()
  useEffect(() => {
    visit(area)
  }, [area, visit])

  const def = areaById(area)
  const done = save.completedLevels.includes(area as AreaId)

  return (
    <motion.div
      className={`scene-page ${night ? "night-scene" : "text-ink"}`}
      style={{ background: tint }}
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="scene-inner">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div className="min-w-0">
            <h1 className="font-hand text-2xl leading-tight sm:text-[2rem]">{title}</h1>
            <p className={`font-hand text-sm ${night ? "text-cream/75" : "text-ink-soft"}`}>
              {subtitle ?? def?.blurb}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {aside}
            {done && (
              <motion.span
                className="pill bg-mint"
                data-testid="level-done"
                initial={reducedMotion ? false : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                <CheckIcon /> done · replay anytime
              </motion.span>
            )}
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  )
}

export function Loader() {
  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="anim-bob">
        <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden>
          <circle cx="36" cy="36" r="26" fill="#fff" stroke="#5b4450" strokeWidth="2" opacity="0.9" />
          <circle cx="28" cy="31" r="3.4" fill="#5b4450" />
          <circle cx="44" cy="31" r="3.4" fill="#5b4450" />
          <circle cx="29" cy="30" r="1.1" fill="#fff" />
          <circle cx="45" cy="30" r="1.1" fill="#fff" />
          <path d="M26 43c5 8 15 8 20 0" stroke="#5b4450" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <circle cx="22" cy="40" r="4.4" fill="#ff8fae" opacity="0.4" />
          <circle cx="50" cy="40" r="4.4" fill="#ff8fae" opacity="0.4" />
        </svg>
      </div>
      <p className="font-hand text-lg">{pick(LOADING_LINES)}</p>
      <div className="h-3 w-40 overflow-hidden rounded-full border-[1.5px] border-ink/10 bg-white/80">
        <span className="block h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-blush-deep to-rose" />
      </div>
    </div>
  )
}
