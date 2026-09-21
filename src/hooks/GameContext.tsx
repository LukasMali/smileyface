import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { playSound, setSoundEnabled, unlockAudio, startAmbient, stopAmbient } from "../audio/sound"
import { ACHIEVEMENTS } from "../game/areas"
import { SWEET_MESSAGES } from "../game/messages"
import { defaultSave, withProgress } from "../game/progress"
import { clearSave, loadSave, persistSave } from "../game/save"
import type {
  AchievementId,
  AreaId,
  NailDesign,
  Pop,
  PopKind,
  SaveData,
  SoundName,
  Toast,
} from "../game/types"
import { pick, pickFresh } from "../lib/random"

type GameValue = {
  save: SaveData
  happiness: number
  toasts: Toast[]
  pops: Pop[]
  justSaved: boolean
  justAchievements: AchievementId[]
  reducedMotion: boolean
  notify: (text: string, kind?: Toast["kind"]) => void
  sweetNote: () => string
  play: (name: SoundName) => void
  poke: (x: number, y: number, kind?: PopKind) => void
  patch: (fn: (s: SaveData) => SaveData) => void
  addStars: (n: number) => void
  addCoins: (n: number) => void
  addAlienSavings: (n: number) => void
  completeLevel: (id: AreaId) => void
  discoverSecret: (id: string, message?: string) => void
  unlockAchievement: (id: AchievementId) => void
  visit: (area: string) => void
  petNikki: (line: string) => void
  setSetting: <K extends keyof SaveData["settings"]>(key: K, value: SaveData["settings"][K]) => void
  setNailDesign: (d: NailDesign) => void
  resetProgress: () => void
  highScore: (key: string, value: number) => void
}

const GameContext = createContext<GameValue | null>(null)

let toastId = 0
let popId = 0
const popKinds: PopKind[] = ["star", "heart", "coin", "spark"]

export function GameProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<SaveData>(() => loadSave())
  const [toasts, setToasts] = useState<Toast[]>([])
  const [pops, setPops] = useState<Pop[]>([])
  const [justSaved, setJustSaved] = useState(false)
  const [justAchievements, setJustAchievements] = useState<AchievementId[]>([])
  const saveTimer = useRef<number | null>(null)
  const toastTimers = useRef<number[]>([])
  const skipFirstPersist = useRef(true)
  const saveRef = useRef(save)

  useEffect(() => {
    saveRef.current = save
  }, [save])

  const reducedMotion =
    save.settings.reducedMotion ||
    save.settings.animations === false ||
    (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)

  useEffect(() => {
    setSoundEnabled(save.settings.sound)
  }, [save.settings.sound])

  useEffect(() => {
    if (save.headphonesOn && save.settings.sound) startAmbient()
    else stopAmbient()
    return () => stopAmbient()
  }, [save.headphonesOn, save.settings.sound])

  useEffect(() => {
    if (skipFirstPersist.current) {
      skipFirstPersist.current = false
      return
    }
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      persistSave(save)
      setJustSaved(true)
      window.setTimeout(() => setJustSaved(false), 1100)
    }, 220)
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [save])

  useEffect(() => {
    const flush = () => persistSave(saveRef.current)
    window.addEventListener("pagehide", flush)
    document.addEventListener("visibilitychange", flush)
    const timers = toastTimers
    return () => {
      window.removeEventListener("pagehide", flush)
      document.removeEventListener("visibilitychange", flush)
      timers.current.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  const notify = useCallback((text: string, kind: Toast["kind"] = "plain") => {
    const id = ++toastId
    setToasts((prev) => [...prev.slice(-3), { id, text, kind }])
    const t = window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, kind === "achieve" ? 3200 : 2400)
    toastTimers.current.push(t)
  }, [])

  const play = useCallback(
    (name: SoundName) => {
      if (!saveRef.current.settings.sound) return
      playSound(name)
    },
    [],
  )

  const poke = useCallback((x: number, y: number, kind?: PopKind) => {
    const id = ++popId
    const item: Pop = { id, x, y, kind: kind ?? pick(popKinds) }
    setPops((prev) => [...prev.slice(-14), item])
    window.setTimeout(() => setPops((prev) => prev.filter((p) => p.id !== id)), 680)
  }, [])

  const patch = useCallback(
    (fn: (s: SaveData) => SaveData) => {
      setSave((prev) => {
        const { save: next, unlocked } = withProgress(fn(prev))
        if (unlocked.length > 0) {
          queueMicrotask(() => {
            setJustAchievements(unlocked)
            unlocked.forEach((id) => {
              const def = ACHIEVEMENTS.find((a) => a.id === id)
              notify(`${def?.icon ?? "✨"} ${def?.title ?? id}`, "achieve")
            })
            playSound("achieve")
            window.setTimeout(() => setJustAchievements([]), 4200)
          })
        }
        return next
      })
    },
    [notify],
  )

  const sweetNote = useCallback(() => {
    const text = pickFresh(SWEET_MESSAGES, saveRef.current.seenMessages)
    patch((s) => ({
      ...s,
      seenMessages: [...s.seenMessages, text].slice(-16),
      unlockedMessages: s.unlockedMessages.includes(text) ? s.unlockedMessages : [...s.unlockedMessages, text],
    }))
    return text
  }, [patch])

  const addStars = useCallback(
    (n: number) => {
      patch((s) => ({ ...s, stars: s.stars + n }))
      play("sparkle")
    },
    [patch, play],
  )

  const addCoins = useCallback(
    (n: number) => {
      patch((s) => ({ ...s, coins: s.coins + n }))
      play("coin")
    },
    [patch, play],
  )

  const addAlienSavings = useCallback(
    (n: number) => {
      patch((s) => ({ ...s, alienSavings: s.alienSavings + n, coins: s.coins + Math.max(0, Math.floor(n / 2)) }))
      play("coin")
    },
    [patch, play],
  )

  const completeLevel = useCallback(
    (id: AreaId) => {
      patch((s) => {
        if (s.completedLevels.includes(id)) return s
        const already = s.completedMinigames.includes(id)
        return {
          ...s,
          completedLevels: [...s.completedLevels, id],
          completedMinigames: already ? s.completedMinigames : [...s.completedMinigames, id],
          stars: s.stars + 3,
          coins: s.coins + 4,
        }
      })
      play("chime")
    },
    [patch, play],
  )

  const discoverSecret = useCallback(
    (id: string, message?: string) => {
      const already = saveRef.current.discoveredSecrets.includes(id)
      if (already) {
        if (message) notify(message)
        return
      }
      patch((s) => ({
        ...s,
        discoveredSecrets: [...s.discoveredSecrets, id],
        stars: s.stars + 1,
        santaUnlocked: s.santaUnlocked || id === "santa-key",
      }))
      play("sparkle")
      notify(message ?? "secret found ✨", "secret")
    },
    [notify, patch, play],
  )

  const unlockAchievement = useCallback(
    (id: AchievementId) => {
      patch((s) => (s.achievements.includes(id) ? s : { ...s, achievements: [...s.achievements, id], stars: s.stars + 2 }))
    },
    [patch],
  )

  const visit = useCallback(
    (area: string) => {
      patch((s) => ({ ...s, lastVisitedArea: area }))
    },
    [patch],
  )

  const petNikki = useCallback(
    (line: string) => {
      patch((s) => ({
        ...s,
        nikkiInteractions: s.nikkiInteractions + 1,
        nikkiDiscovered: s.nikkiDiscovered.includes(line) ? s.nikkiDiscovered : [...s.nikkiDiscovered, line],
      }))
      play("bark")
    },
    [patch, play],
  )

  const setSetting = useCallback(
    <K extends keyof SaveData["settings"]>(key: K, value: SaveData["settings"][K]) => {
      patch((s) => ({ ...s, settings: { ...s.settings, [key]: value } }))
    },
    [patch],
  )

  const setNailDesign = useCallback(
    (d: NailDesign) => {
      patch((s) => ({ ...s, nailDesign: d }))
    },
    [patch],
  )

  const resetProgress = useCallback(() => {
    const settings = saveRef.current.settings
    clearSave()
    const next = withProgress({ ...defaultSave(), settings }).save
    setSave(next)
    persistSave(next)
    notify("progress tucked away. a new tiny world begins")
  }, [notify])

  const highScore = useCallback(
    (key: string, value: number) => {
      patch((s) => ({ ...s, highScores: { ...s.highScores, [key]: Math.max(s.highScores[key] ?? 0, value) } }))
    },
    [patch],
  )

  const value = useMemo<GameValue>(
    () => ({
      save,
      happiness: save.happiness,
      toasts,
      pops,
      justSaved,
      justAchievements,
      reducedMotion,
      notify,
      sweetNote,
      play,
      poke,
      patch,
      addStars,
      addCoins,
      addAlienSavings,
      completeLevel,
      discoverSecret,
      unlockAchievement,
      visit,
      petNikki,
      setSetting,
      setNailDesign,
      resetProgress,
      highScore,
    }),
    [
      save,
      toasts,
      pops,
      justSaved,
      justAchievements,
      reducedMotion,
      notify,
      sweetNote,
      play,
      poke,
      patch,
      addStars,
      addCoins,
      addAlienSavings,
      completeLevel,
      discoverSecret,
      unlockAchievement,
      visit,
      petNikki,
      setSetting,
      setNailDesign,
      resetProgress,
      highScore,
    ],
  )

  useEffect(() => {
    const onFirst = () => unlockAudio()
    window.addEventListener("pointerdown", onFirst, { once: true })
    return () => window.removeEventListener("pointerdown", onFirst)
  }, [])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error("useGame must be used within GameProvider")
  return ctx
}
