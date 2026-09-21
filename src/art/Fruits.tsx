import { LINE, STROKE } from "./tokens"

export type FruitKind = "strawberry" | "watermelon" | "grape" | "peach" | "cherry" | "blueberry" | "orange" | "apple" | "kiwi"

export const FRUIT_KINDS: FruitKind[] = [
  "strawberry",
  "watermelon",
  "grape",
  "peach",
  "cherry",
  "blueberry",
  "orange",
  "apple",
  "kiwi",
]

export const FRUIT_LABEL: Record<FruitKind, string> = {
  strawberry: "strawberry",
  watermelon: "watermelon",
  grape: "grapes",
  peach: "peach",
  cherry: "cherries",
  blueberry: "blueberry",
  orange: "orange",
  apple: "apple",
  kiwi: "kiwi",
}

export function FruitArt({ kind, size = 44, className = "" }: { kind: FruitKind; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={`sticker ${className}`} role="img" aria-label={FRUIT_LABEL[kind]}>
      {shape(kind)}
    </svg>
  )
}

function shape(kind: FruitKind) {
  switch (kind) {
    case "strawberry":
      return (
        <g>
          <path d="M24 44c-9 0-15-7-15-15 0-8 6-14 15-14s15 6 15 14c0 8-6 15-15 15z" fill="#ef6b92" stroke={LINE} strokeWidth={STROKE.base} />
          <path d="M14 14c4-3 6-1 10-1s6-2 10 1c-2 4-6 6-10 6s-8-2-10-6z" fill="#68bb87" stroke={LINE} strokeWidth={STROKE.fine} />
          <path d="M24 13V6" stroke="#68bb87" strokeWidth="2.6" strokeLinecap="round" />
          <g fill="#fff8e7">
            <circle cx="18" cy="26" r="1.5" />
            <circle cx="28" cy="24" r="1.5" />
            <circle cx="23" cy="32" r="1.5" />
            <circle cx="32" cy="32" r="1.5" />
            <circle cx="16" cy="34" r="1.5" />
          </g>
          <ellipse cx="17" cy="22" rx="3" ry="2" fill="#fff" opacity="0.45" transform="rotate(-25 17 22)" />
        </g>
      )
    case "watermelon":
      return (
        <g>
          <path d="M4 34a20 20 0 0 1 40 0z" fill="#ef6b92" stroke={LINE} strokeWidth={STROKE.base} />
          <path d="M4 34h40l-2 6H6z" fill="#8fddb4" stroke={LINE} strokeWidth={STROKE.base} />
          <g fill="#3c3038">
            <ellipse cx="16" cy="26" rx="1.4" ry="2" />
            <ellipse cx="24" cy="22" rx="1.4" ry="2" />
            <ellipse cx="32" cy="26" rx="1.4" ry="2" />
          </g>
        </g>
      )
    case "grape":
      return (
        <g>
          <path d="M24 10v6" stroke="#8a6b52" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M22 12c-4-4-8-4-10-2" stroke="#68bb87" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {[
            [24, 20],
            [17, 25],
            [31, 25],
            [21, 31],
            [27, 31],
            [24, 38],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="5.6" fill="#a78bd9" stroke={LINE} strokeWidth={STROKE.fine} />
          ))}
          <circle cx="22" cy="18" r="1.6" fill="#fff" opacity="0.6" />
        </g>
      )
    case "peach":
      return (
        <g>
          <circle cx="24" cy="28" r="15" fill="#ffb48a" stroke={LINE} strokeWidth={STROKE.base} />
          <path d="M24 14c-3 8-3 18 0 27" stroke="#f09668" strokeWidth="1.8" fill="none" opacity="0.7" />
          <path d="M26 13c4-4 9-4 12-1-3 5-8 6-12 4z" fill="#68bb87" stroke={LINE} strokeWidth={STROKE.fine} />
          <ellipse cx="17" cy="22" rx="4" ry="3" fill="#fff" opacity="0.4" transform="rotate(-25 17 22)" />
        </g>
      )
    case "cherry":
      return (
        <g>
          <path d="M24 10c-6 6-10 8-10 14M24 10c4 6 8 8 8 12" stroke="#68bb87" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="15" cy="32" r="8" fill="#e0526f" stroke={LINE} strokeWidth={STROKE.base} />
          <circle cx="32" cy="34" r="8" fill="#e0526f" stroke={LINE} strokeWidth={STROKE.base} />
          <circle cx="12.6" cy="29" r="2" fill="#fff" opacity="0.6" />
        </g>
      )
    case "blueberry":
      return (
        <g>
          <circle cx="24" cy="28" r="13" fill="#7b8fd6" stroke={LINE} strokeWidth={STROKE.base} />
          <path d="M18 22l6 4 6-4-2 6h-8z" fill="#5f71b5" opacity="0.8" />
          <circle cx="18" cy="22" r="2.4" fill="#fff" opacity="0.5" />
        </g>
      )
    case "orange":
      return (
        <g>
          <circle cx="24" cy="27" r="15" fill="#ffa552" stroke={LINE} strokeWidth={STROKE.base} />
          <circle cx="24" cy="27" r="9" fill="#ffbe7a" opacity="0.6" />
          <path d="M24 12c0-3 3-5 6-5-1 4-3 6-6 5z" fill="#68bb87" stroke={LINE} strokeWidth={STROKE.fine} />
          <circle cx="17" cy="21" r="3" fill="#fff" opacity="0.4" />
        </g>
      )
    case "apple":
      return (
        <g>
          <path d="M24 14c8-4 16 2 16 12 0 10-8 18-16 18S8 36 8 26c0-10 8-16 16-12z" fill="#e05f6f" stroke={LINE} strokeWidth={STROKE.base} />
          <path d="M24 14V7" stroke="#8a6b52" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M25 9c4-4 9-3 11 0-3 4-8 4-11 0z" fill="#68bb87" stroke={LINE} strokeWidth={STROKE.fine} />
          <ellipse cx="16" cy="22" rx="4" ry="3" fill="#fff" opacity="0.4" transform="rotate(-25 16 22)" />
        </g>
      )
    default:
      return (
        <g>
          <circle cx="24" cy="26" r="15" fill="#8a6b52" stroke={LINE} strokeWidth={STROKE.base} />
          <circle cx="24" cy="26" r="12" fill="#a8d86a" />
          <circle cx="24" cy="26" r="4.4" fill="#fdf8e4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse key={a} cx="24" cy="18.5" rx="0.9" ry="2.4" fill="#3c3038" transform={`rotate(${a} 24 26)`} />
          ))}
        </g>
      )
  }
}
