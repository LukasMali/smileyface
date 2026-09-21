export const SAVE_VERSION = 1
export const SAVE_KEY = "tiny-world-save-v1"
export const ART_KEY = "tiny-world-art-v1"

export type SoundName =
  | "click"
  | "sparkle"
  | "coin"
  | "bubble"
  | "bark"
  | "pool"
  | "horn"
  | "ufo"
  | "achieve"
  | "nail"
  | "pop"
  | "whoosh"
  | "chime"

export type AreaId =
  | "nini"
  | "art"
  | "aquarium"
  | "ponies"
  | "alien-bank"
  | "nurse"
  | "driving"
  | "nails"
  | "fruit"
  | "pool"
  | "shelf-revenge"
  | "dreamland"
  | "burger"
  | "food-shrine"
  | "santa"

export type AchievementId =
  | "nini-approved"
  | "tiny-artist"
  | "fish-inspector"
  | "alien-investor"
  | "maximum-sparkle"
  | "pool-menace"
  | "future-nurse"
  | "driving-aura"
  | "professional-sleeper"
  | "fruit-goblin"
  | "burger-architect"
  | "shelf-defeated"
  | "economically-impossible"
  | "comedy-stat"
  | "secret-finder"

export type CharmType =
  | "gem"
  | "bow"
  | "star"
  | "heart"
  | "pearl"
  | "chain"
  | "flower"
  | "fruit"
  | "fish"
  | "ufo"

export type NailShape = "almond" | "coffin" | "square" | "stiletto"

export type NailCharm = {
  id: string
  nailIndex: number
  x: number
  y: number
  type: CharmType
}

export type NailDesign = {
  length: number
  shape: NailShape
  baseColor: string
  gradient: string | null
  glitter: boolean
  chrome: boolean
  charms: NailCharm[]
}

export type Settings = {
  sound: boolean
  animations: boolean
  reducedMotion: boolean
}

export type SaveData = {
  version: number
  happiness: number
  stars: number
  coins: number
  unlockedAreas: AreaId[]
  completedLevels: AreaId[]
  achievements: AchievementId[]
  discoveredSecrets: string[]
  highScores: Record<string, number>
  nailDesign: NailDesign | null
  alienSavings: number
  unlockedMessages: string[]
  settings: Settings
  lastVisitedArea: string
  completedMinigames: string[]
  poolScore: number
  poolWins: number
  puddingRevengeScore: number
  santaUnlocked: boolean
  nikkiInteractions: number
  nikkiDiscovered: string[]
  collectedFruit: string[]
  fruitStickers: string[]
  ponyAccessories: string[]
  collectedFish: string[]
  artDrawn: boolean
  burgerHeight: number
  nurseProgress: number
  drivingLevel: number
  licenceAcquired: boolean
  dreamStars: number
  niniComfy: boolean
  pcStarted: boolean
  rgbMode: number
  finaleReady: boolean
  finaleSeen: boolean
  seenMessages: string[]
  comedyCount: number
  bootDone: boolean
  headphonesOn: boolean
}

export type Toast = {
  id: number
  text: string
  kind?: "plain" | "achieve" | "secret"
}

export type PopKind = "star" | "heart" | "coin" | "spark"
export type Pop = { id: number; x: number; y: number; kind: PopKind }
