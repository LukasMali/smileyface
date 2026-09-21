import { useCallback } from "react"
import { happinessMessages } from "../data/messages"
import { pick } from "../lib/random"
import { useGame } from "./GameContext"
import type { Pop, PopKind, Toast } from "../game/types"

type WorldValue = {
  savings: number
  addSavings: (amount?: number) => void
  toasts: Toast[]
  notify: (text: string) => void
  celebrate: boolean
  deployHappiness: () => void
  flyby: boolean
  fun: number
  addFun: (amount?: number) => void
  pops: Pop[]
  poke: (x: number, y: number, kind?: PopKind) => void
  summonAlien: () => void
}

export { GameProvider as WorldProvider } from "./GameContext"

export function useWorld(): WorldValue {
  const g = useGame()
  const addSavings = useCallback((amount = 1) => g.addAlienSavings(amount), [g])
  const addFun = useCallback(
    (amount = 1) => {
      if (amount >= 3) g.addCoins(1)
    },
    [g],
  )
  const deployHappiness = useCallback(() => {
    g.notify(pick(happinessMessages))
    g.addCoins(4)
    g.play("chime")
  }, [g])
  const summonAlien = useCallback(() => g.play("ufo"), [g])
  return {
    savings: g.save.alienSavings,
    addSavings,
    toasts: g.toasts,
    notify: g.notify,
    celebrate: g.save.happiness >= 70,
    deployHappiness,
    flyby: false,
    fun: g.save.stars,
    addFun,
    pops: g.pops,
    poke: g.poke,
    summonAlien,
  }
}

