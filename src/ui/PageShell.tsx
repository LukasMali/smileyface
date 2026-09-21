import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { useGame } from "../hooks/GameContext"
import { LOADING_LINES } from "../game/messages"
import { pick } from "../lib/random"

export function PageShell({
  title,
  area,
  children,
  tint,
  night,
}: {
  title: string
  area: string
  children: ReactNode
  tint?: string
  night?: boolean
}) {
  const { visit, reducedMotion } = useGame()
  useEffect(() => {
    visit(area)
  }, [area, visit])

  return (
    <motion.div
      className={`scene-page text-ink ${night ? "night-scene" : ""}`}
      style={{ background: tint }}
      initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: -12, scale: 0.99 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="scene-inner">
        <h1 className={`mb-3 font-hand text-2xl leading-tight sm:text-3xl ${night ? "text-cream" : ""}`}>{title}</h1>
        {children}
      </div>
    </motion.div>
  )
}

export function Loader() {
  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-hand text-lg">{pick(LOADING_LINES)}</p>
      <div className="h-3 w-40 overflow-hidden rounded-full bg-white/70">
        <span className="block h-full w-2/3 animate-pulse rounded-full bg-blush-deep" />
      </div>
    </div>
  )
}
