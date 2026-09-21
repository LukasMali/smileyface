import { defaultSave, withProgress } from "./progress"
import { SAVE_KEY, SAVE_VERSION, type SaveData } from "./types"

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null
}

export function loadSave(): SaveData {
  const base = defaultSave()
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return base
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return base
    const merged: SaveData = {
      ...base,
      ...parsed,
      version: SAVE_VERSION,
      settings: { ...base.settings, ...(isRecord(parsed.settings) ? parsed.settings : {}) },
      unlockedAreas: Array.isArray(parsed.unlockedAreas) ? (parsed.unlockedAreas as SaveData["unlockedAreas"]) : base.unlockedAreas,
      completedLevels: Array.isArray(parsed.completedLevels) ? (parsed.completedLevels as SaveData["completedLevels"]) : [],
      achievements: Array.isArray(parsed.achievements) ? (parsed.achievements as SaveData["achievements"]) : [],
      discoveredSecrets: Array.isArray(parsed.discoveredSecrets) ? (parsed.discoveredSecrets as string[]) : [],
      highScores: isRecord(parsed.highScores) ? (parsed.highScores as Record<string, number>) : {},
      unlockedMessages: Array.isArray(parsed.unlockedMessages) ? (parsed.unlockedMessages as string[]) : [],
      seenMessages: Array.isArray(parsed.seenMessages) ? (parsed.seenMessages as string[]) : [],
      nikkiDiscovered: Array.isArray(parsed.nikkiDiscovered) ? (parsed.nikkiDiscovered as string[]) : [],
      collectedFruit: Array.isArray(parsed.collectedFruit) ? (parsed.collectedFruit as string[]) : [],
      fruitStickers: Array.isArray(parsed.fruitStickers) ? (parsed.fruitStickers as string[]) : [],
      ponyAccessories: Array.isArray(parsed.ponyAccessories) ? (parsed.ponyAccessories as string[]) : [],
      collectedFish: Array.isArray(parsed.collectedFish) ? (parsed.collectedFish as string[]) : [],
      completedMinigames: Array.isArray(parsed.completedMinigames) ? (parsed.completedMinigames as string[]) : [],
      nailDesign: parsed.nailDesign && isRecord(parsed.nailDesign) ? (parsed.nailDesign as SaveData["nailDesign"]) : null,
    }
    return withProgress(merged).save
  } catch {
    return base
  }
}

export function persistSave(save: SaveData) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save))
  } catch {
    // quota / private mode — game still runs
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    /* ignore */
  }
}
