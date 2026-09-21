import type { AchievementId } from "../game/types"
import { LINE, PALETTE, STROKE } from "./tokens"
import { MrAlien } from "./Alien"
import { KawaiiBlob } from "./Blob"
import { Fish } from "./Fish"
import { Nikki } from "./Nikki"
import { SantaArt } from "./Santa"
import { Burger, FruitBasket, Licence, NailPolish, NurseBadge, Trophy } from "./Props"

/** one little vector medal per achievement — no emoji anywhere */
export function AchIcon({ id, size = 34 }: { id: AchievementId; size?: number }) {
  switch (id) {
    case "nini-approved":
      return <Nikki pose="sit" size={size} animated={false} harness={false} />
    case "fish-inspector":
      return <Fish size={size} color={PALETTE.sky} fin={PALETTE.blush} />
    case "alien-investor":
      return <MrAlien size={size * 0.92} mode="banker" />
    case "maximum-sparkle":
      return <NailPolish size={size * 0.8} />
    case "future-nurse":
      return <NurseBadge size={size * 0.86} />
    case "driving-aura":
      return <Licence size={size} />
    case "fruit-goblin":
      return <FruitBasket size={size * 0.92} />
    case "burger-architect":
      return <Burger size={size * 0.94} />
    case "shelf-defeated":
      return <Trophy size={size * 0.86} />
    case "economically-impossible":
      return <SantaArt size={size} />
    case "comedy-stat":
      return <KawaiiBlob mood="yay" size={size * 0.86} />
    case "tiny-artist":
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
          <path
            d="M16 3a13 13 0 0 0 0 26c3 0 2.2-3 4-4.4 1.8-1.4 6.4-.6 6.4-7.6A13 13 0 0 0 16 3z"
            fill="#fffaf2"
            stroke={LINE}
            strokeWidth={STROKE.base}
          />
          <circle cx="11" cy="11" r="2.6" fill={PALETTE.rose} />
          <circle cx="18.6" cy="9" r="2.6" fill={PALETTE.sky} />
          <circle cx="10" cy="19.4" r="2.6" fill={PALETTE.butter} />
          <circle cx="21.6" cy="16.6" r="2.6" fill={PALETTE.mint} />
        </svg>
      )
    case "pool-menace":
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
          <circle cx="16" cy="16" r="12.6" fill="#332b3a" stroke={LINE} strokeWidth={STROKE.base} />
          <circle cx="16" cy="16" r="6" fill="#fffaf2" />
          <text x="16" y="20.4" textAnchor="middle" fontSize="9" fontWeight="700" fill={LINE} fontFamily="Baloo 2, sans-serif">
            8
          </text>
          <ellipse cx="11.4" cy="10.6" rx="3.4" ry="2" fill="#fff" opacity="0.35" transform="rotate(-24 11.4 10.6)" />
        </svg>
      )
    case "professional-sleeper":
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
          <path
            d="M20 5a11 11 0 1 0 6.4 19.4A12 12 0 0 1 20 5z"
            fill={PALETTE.lilac}
            stroke={LINE}
            strokeWidth={STROKE.base}
            strokeLinejoin="round"
          />
          <circle cx="13" cy="15" r="1.4" fill={LINE} opacity="0.5" />
          <circle cx="17.6" cy="21" r="1" fill={LINE} opacity="0.35" />
          <text x="25" y="11" fontSize="8" fontWeight="700" fill={PALETTE.lilacDeep} fontFamily="Baloo 2, sans-serif">
            z
          </text>
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden>
          <path
            d="M16 3l3.6 8.6 9.4.8-7.2 6.2 2.2 9.2L16 22.8 7.9 27.8l2.2-9.2L3 12.4l9.4-.8z"
            fill={PALETTE.butter}
            stroke={LINE}
            strokeWidth={STROKE.base}
            strokeLinejoin="round"
          />
          <circle cx="16" cy="14.6" r="2.4" fill="#fff" opacity="0.8" />
        </svg>
      )
  }
}
