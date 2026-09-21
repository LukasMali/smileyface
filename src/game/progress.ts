import { ACHIEVEMENTS, START_AREAS } from "./areas"
import type { AchievementId, AreaId, SaveData } from "./types"
import { SAVE_VERSION } from "./types"

export function defaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    happiness: 4,
    stars: 0,
    coins: 8,
    unlockedAreas: [...START_AREAS],
    completedLevels: [],
    achievements: [],
    discoveredSecrets: [],
    highScores: {},
    nailDesign: null,
    alienSavings: 1247,
    unlockedMessages: [],
    settings: {
      sound: true,
      animations: true,
      reducedMotion: false,
    },
    lastVisitedArea: "room",
    completedMinigames: [],
    poolScore: 0,
    poolWins: 0,
    puddingRevengeScore: 0,
    santaUnlocked: false,
    nikkiInteractions: 0,
    nikkiDiscovered: [],
    collectedFruit: [],
    fruitStickers: [],
    ponyAccessories: [],
    collectedFish: [],
    artDrawn: false,
    burgerHeight: 0,
    nurseProgress: 85,
    drivingLevel: 1,
    licenceAcquired: false,
    dreamStars: 0,
    niniComfy: false,
    pcStarted: false,
    rgbMode: 0,
    finaleReady: false,
    finaleSeen: false,
    seenMessages: [],
    comedyCount: 0,
    bootDone: false,
    headphonesOn: false,
  }
}

export function computeHappiness(s: SaveData): number {
  const levelPart = (s.completedLevels.length / 15) * 56
  const achPart = (s.achievements.length / Math.max(1, ACHIEVEMENTS.length)) * 22
  const secretPart = Math.min(10, s.discoveredSecrets.length * 0.7)
  const extra =
    (s.nailDesign ? 1.4 : 0) +
    (s.licenceAcquired ? 1.6 : 0) +
    (s.niniComfy ? 1.2 : 0) +
    Math.min(3, s.collectedFruit.length * 0.25) +
    Math.min(3, s.collectedFish.length * 0.25) +
    (s.artDrawn ? 1.2 : 0) +
    (s.santaUnlocked ? 2 : 0) +
    Math.min(2, s.nikkiDiscovered.length * 0.2) +
    (s.pcStarted ? 0.6 : 0)
  return Math.min(100, Math.round(levelPart + achPart + secretPart + extra + 4))
}

export function applyUnlocks(s: SaveData): SaveData {
  const u = new Set<AreaId>(s.unlockedAreas)
  const done = new Set(s.completedLevels)
  START_AREAS.forEach((id) => u.add(id))
  if (done.has("nini") || s.niniComfy) {
    u.add("dreamland")
    u.add("nurse")
  }
  if (done.has("nurse")) u.add("driving")
  if (done.has("alien-bank")) u.add("burger")
  if (s.completedLevels.length >= 5) {
    u.add("nails")
    u.add("pool")
  }
  if (s.completedLevels.length >= 8) {
    u.add("shelf-revenge")
    u.add("food-shrine")
  }
  if (s.santaUnlocked || s.discoveredSecrets.includes("santa-key")) {
    u.add("santa")
  }
  return { ...s, unlockedAreas: [...u] }
}

export function applyAchievements(s: SaveData): { save: SaveData; unlocked: AchievementId[] } {
  const have = new Set(s.achievements)
  const freshly: AchievementId[] = []
  const grant = (id: AchievementId, ok: boolean) => {
    if (ok && !have.has(id)) {
      have.add(id)
      freshly.push(id)
    }
  }
  grant("nini-approved", s.niniComfy || s.nikkiInteractions >= 8)
  grant("tiny-artist", s.artDrawn)
  grant("fish-inspector", s.collectedFish.length >= 7)
  grant("alien-investor", s.alienSavings >= 1280 || s.completedLevels.includes("alien-bank"))
  grant("maximum-sparkle", (s.nailDesign?.charms.length ?? 0) >= 8)
  grant("pool-menace", s.poolWins >= 1)
  grant("future-nurse", s.completedLevels.includes("nurse") || s.nurseProgress >= 95)
  grant("driving-aura", s.licenceAcquired)
  grant("professional-sleeper", s.dreamStars >= 12 || s.completedLevels.includes("dreamland"))
  grant("fruit-goblin", s.collectedFruit.length >= 8 || (s.highScores.fruit ?? 0) >= 40)
  grant("burger-architect", s.burgerHeight >= 9)
  grant("shelf-defeated", s.completedLevels.includes("shelf-revenge"))
  grant("economically-impossible", s.santaUnlocked)
  grant("comedy-stat", s.comedyCount >= 6)
  grant("secret-finder", s.discoveredSecrets.length >= 8)
  if (freshly.length === 0) return { save: s, unlocked: [] }
  return { save: { ...s, achievements: [...have] }, unlocked: freshly }
}

export function withProgress(s: SaveData): { save: SaveData; unlocked: AchievementId[] } {
  const unlockedSave = applyUnlocks(s)
  const { save, unlocked } = applyAchievements(unlockedSave)
  const happiness = computeHappiness(save)
  const finaleReady = happiness >= 100 || save.finaleReady
  return {
    save: { ...save, happiness, finaleReady, santaUnlocked: save.santaUnlocked || save.discoveredSecrets.includes("santa-key") },
    unlocked,
  }
}

export function isAreaOpen(s: SaveData, id: AreaId) {
  if (id === "santa") return s.santaUnlocked || s.unlockedAreas.includes("santa")
  return s.unlockedAreas.includes(id)
}

export const SHELF_ITEMS: { id: string; label: string; need: (s: SaveData) => boolean }[] = [
  { id: "nurse-badge", label: "tiny nurse badge", need: (s) => s.completedLevels.includes("nurse") },
  { id: "licence", label: "miniature driving licence", need: (s) => s.licenceAcquired },
  { id: "alien", label: "Mr Alien figurine", need: (s) => s.completedLevels.includes("alien-bank") || s.alienSavings >= 1260 },
  { id: "pool-trophy", label: "pool trophy", need: (s) => s.poolWins >= 1 },
  { id: "pudding", label: "pudding container", need: (s) => s.completedLevels.includes("shelf-revenge") },
  { id: "nails", label: "glitter nail bottle", need: (s) => Boolean(s.nailDesign) },
  { id: "fruit", label: "fruit basket", need: (s) => s.collectedFruit.length >= 3 },
  { id: "santa", label: "tiny Santa", need: (s) => s.santaUnlocked },
  { id: "nikki", label: "Nikki photo", need: (s) => s.nikkiInteractions >= 3 },
  { id: "cactus", label: "cactus ice cream", need: (s) => s.discoveredSecrets.includes("cactus-pop") || s.completedLevels.includes("fruit") },
  { id: "burger", label: "tiny burger", need: (s) => s.burgerHeight >= 4 },
  { id: "meal", label: "legendary meal", need: (s) => s.completedLevels.includes("food-shrine") },
]
