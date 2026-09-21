import type { AchievementId, AreaId } from "./types"

export type AreaDef = {
  id: AreaId
  name: string
  route: string
  blurb: string
  hint: string
  stars: number
  coins: number
  x: number
  y: number
  startUnlocked?: boolean
}

export const AREAS: AreaDef[] = [
  {
    id: "nini",
    name: "Nikki's Cozy Corner",
    route: "/nini",
    blurb: "blanket thief headquarters",
    hint: "always open. Nini lives here.",
    stars: 4,
    coins: 4,
    x: 18,
    y: 14,
    startUnlocked: true,
  },
  {
    id: "dreamland",
    name: "Dreamland",
    route: "/dreamland",
    blurb: "important sleeping business",
    hint: "unlock by getting Nini comfy",
    stars: 4,
    coins: 3,
    x: 48,
    y: 10,
  },
  {
    id: "art",
    name: "Digital Art Studio",
    route: "/art",
    blurb: "professional silly doodle department",
    hint: "the second monitor already knows you",
    stars: 3,
    coins: 4,
    x: 78,
    y: 16,
    startUnlocked: true,
  },
  {
    id: "aquarium",
    name: "Aquarium",
    route: "/aquarium",
    blurb: "fish judgement zone",
    hint: "the water has always been here",
    stars: 3,
    coins: 4,
    x: 22,
    y: 32,
    startUnlocked: true,
  },
  {
    id: "ponies",
    name: "Pony Meadow",
    route: "/ponies",
    blurb: "pony council headquarters",
    hint: "the meadow does not believe in locks",
    stars: 3,
    coins: 4,
    x: 55,
    y: 30,
    startUnlocked: true,
  },
  {
    id: "alien-bank",
    name: "Mr Alien's Bank",
    route: "/alien-bank",
    blurb: "intergalactic financial department",
    hint: "Mr Alien opened this himself",
    stars: 3,
    coins: 8,
    x: 82,
    y: 36,
    startUnlocked: true,
  },
  {
    id: "fruit",
    name: "Fruit Garden",
    route: "/fruit",
    blurb: "juice sparkle orchard",
    hint: "fruit does not wait for permission",
    stars: 3,
    coins: 5,
    x: 16,
    y: 52,
    startUnlocked: true,
  },
  {
    id: "nurse",
    name: "Nurse Academy",
    route: "/nurse",
    blurb: "future nurse loading…",
    hint: "complete Nikki's Cozy Corner",
    stars: 4,
    coins: 4,
    x: 48,
    y: 50,
  },
  {
    id: "driving",
    name: "Driving Licence Quest",
    route: "/driving",
    blurb: "parallel parking has entered the arena",
    hint: "complete Nurse Academy",
    stars: 5,
    coins: 5,
    x: 80,
    y: 54,
  },
  {
    id: "nails",
    name: "Nail Salon",
    route: "/nails",
    blurb: "more charms = better",
    hint: "finish 5 places",
    stars: 4,
    coins: 6,
    x: 24,
    y: 70,
  },
  {
    id: "pool",
    name: "Pool Hall",
    route: "/pool",
    blurb: "the rematch nobody asked for",
    hint: "finish 5 places",
    stars: 4,
    coins: 6,
    x: 56,
    y: 68,
  },
  {
    id: "burger",
    name: "Burger Stop",
    route: "/burger",
    blurb: "structural integrity questionable",
    hint: "visit Mr Alien's Bank",
    stars: 3,
    coins: 5,
    x: 84,
    y: 72,
  },
  {
    id: "shelf-revenge",
    name: "The Pudding Incident",
    route: "/shelf-revenge",
    blurb: "THE SHELF STRIKES BACK",
    hint: "finish 8 places",
    stars: 5,
    coins: 8,
    x: 20,
    y: 88,
  },
  {
    id: "food-shrine",
    name: "Legendary Food Shrine",
    route: "/food-shrine",
    blurb: "the rarest artifact in the universe",
    hint: "finish 8 places",
    stars: 5,
    coins: 4,
    x: 52,
    y: 86,
  },
  {
    id: "santa",
    name: "Santa's Secret Room",
    route: "/santa",
    blurb: "financial consequences: unknown",
    hint: "find the tiny hidden gift",
    stars: 6,
    coins: 20,
    x: 82,
    y: 88,
  },
]

export const START_AREAS: AreaId[] = AREAS.filter((a) => a.startUnlocked).map((a) => a.id)

export function areaById(id: string) {
  return AREAS.find((a) => a.id === id)
}

export type AchievementDef = {
  id: AchievementId
  title: string
  description: string
  icon: string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "nini-approved", title: "Nini Approved", description: "Nini has reviewed your application.", icon: "🐕" },
  { id: "tiny-artist", title: "Tiny Artist", description: "You made something on purpose.", icon: "🎨" },
  { id: "fish-inspector", title: "Fish Inspector", description: "You interviewed the entire tank.", icon: "🐟" },
  { id: "alien-investor", title: "Alien Investor", description: "Your financial aura has increased.", icon: "👽" },
  { id: "maximum-sparkle", title: "Maximum Sparkle", description: "Airport security is concerned, proudly.", icon: "💅" },
  { id: "pool-menace", title: "Pool Menace", description: "Still suspiciously good at pool.", icon: "🎱" },
  { id: "future-nurse", title: "Future Nurse", description: "Kindness stat: completely illegal.", icon: "🩺" },
  { id: "driving-aura", title: "Driving Aura", description: "The cones have accepted their fate.", icon: "🚗" },
  { id: "professional-sleeper", title: "Professional Sleeper", description: "Currently unavailable: eepy.", icon: "😴" },
  { id: "fruit-goblin", title: "Fruit Goblin", description: "FRUIT FRENZY was not a suggestion.", icon: "🍓" },
  { id: "burger-architect", title: "Burger Architect", description: "Structural integrity: theatrical.", icon: "🍔" },
  { id: "shelf-defeated", title: "Shelf Defeated", description: "Justice has been served.", icon: "🏆" },
  { id: "economically-impossible", title: "Economically Impossible", description: "∞ ROBUX. Mr Alien is concerned.", icon: "🎅" },
  { id: "comedy-stat", title: "Comedy Stat: MAX", description: "Your humor should probably require a licence.", icon: "😂" },
  { id: "secret-finder", title: "Secret Finder", description: "You keep tapping suspicious corners. Correct.", icon: "✨" },
]
