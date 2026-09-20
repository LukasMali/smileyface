import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { happinessMessages } from "../data/messages"
import { pick } from "../lib/random"

type Toast = { id: number; text: string }
export type PopKind = "star" | "heart" | "coin" | "spark"
export type Pop = { id: number; x: number; y: number; kind: PopKind }

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

const WorldContext = createContext<WorldValue | null>(null)

let toastId = 0
let popId = 0
const kinds: PopKind[] = ["star", "heart", "coin", "spark"]

export function WorldProvider({ children }: { children: ReactNode }) {
  const [savings, setSavings] = useState(1247)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [celebrate, setCelebrate] = useState(false)
  const [flyby, setFlyby] = useState(false)
  const [fun, setFun] = useState(0)
  const [pops, setPops] = useState<Pop[]>([])

  const notify = useCallback((text: string) => {
    const id = ++toastId
    setToasts((prev) => [...prev.slice(-4), { id, text }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2400)
  }, [])

  const addSavings = useCallback((amount = 1) => {
    setSavings((n) => n + amount)
  }, [])

  const addFun = useCallback((amount = 1) => {
    setFun((n) => n + amount)
  }, [])

  const poke = useCallback((x: number, y: number, kind?: PopKind) => {
    const id = ++popId
    const item: Pop = { id, x, y, kind: kind ?? pick(kinds) }
    setPops((prev) => [...prev.slice(-18), item])
    window.setTimeout(() => {
      setPops((prev) => prev.filter((p) => p.id !== id))
    }, 700)
  }, [])

  const summonAlien = useCallback(() => {
    setFlyby(true)
    window.setTimeout(() => setFlyby(false), 4800)
  }, [])

  const deployHappiness = useCallback(() => {
    if (celebrate) return
    setCelebrate(true)
    setFlyby(true)
    addSavings(12)
    addFun(20)
    notify(pick(happinessMessages))
    window.setTimeout(() => setCelebrate(false), 5200)
    window.setTimeout(() => setFlyby(false), 4800)
  }, [addFun, addSavings, celebrate, notify])

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (Math.random() > 0.45) setSavings((n) => n + 1)
    }, 4200)
    return () => window.clearInterval(tick)
  }, [])

  useEffect(() => {
    const tick = window.setInterval(() => {
      if (Math.random() < 0.22) {
        setFlyby(true)
        window.setTimeout(() => setFlyby(false), 5200)
      }
    }, 18000)
    return () => window.clearInterval(tick)
  }, [])

  const value = useMemo(
    () => ({
      savings,
      addSavings,
      toasts,
      notify,
      celebrate,
      deployHappiness,
      flyby,
      fun,
      addFun,
      pops,
      poke,
      summonAlien,
    }),
    [
      savings,
      addSavings,
      toasts,
      notify,
      celebrate,
      deployHappiness,
      flyby,
      fun,
      addFun,
      pops,
      poke,
      summonAlien,
    ],
  )

  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>
}

export function useWorld() {
  const ctx = useContext(WorldContext)
  if (!ctx) throw new Error("useWorld must be used within WorldProvider")
  return ctx
}
