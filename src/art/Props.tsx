import { useId } from "react"
import { LINE, PALETTE, STROKE } from "./tokens"

type Base = { size?: number; className?: string }

export function StarSticker({ size = 28, className = "", filled = true }: Base & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" className={`sticker ${className}`} aria-hidden>
      <path
        d="M18 3l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L18 26.7 8.7 31.5l1.8-10.3L3 13.9l10.4-1.5z"
        fill={filled ? PALETTE.butter : "#fff"}
        stroke={LINE}
        strokeWidth={STROKE.base}
        strokeLinejoin="round"
      />
      <path d="M14 10l3-4 3 4" stroke="#fff" strokeWidth="1.8" fill="none" opacity="0.8" />
    </svg>
  )
}

export function Heart({ size = 26, className = "", tone = PALETTE.rose }: Base & { tone?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={`sticker ${className}`} aria-hidden>
      <path
        d="M16 28C6 21 2 16 2 11.5A7.5 7.5 0 0 1 16 8a7.5 7.5 0 0 1 14 3.5C30 16 26 21 16 28z"
        fill={tone}
        stroke={LINE}
        strokeWidth={STROKE.base}
        strokeLinejoin="round"
      />
      <ellipse cx="10" cy="13" rx="3" ry="2.2" fill="#fff" opacity="0.6" transform="rotate(-20 10 13)" />
    </svg>
  )
}

export function LegendaryPlate({ size = 200, className = "" }: Base) {
  const id = useId().replace(/[:]/g, "")
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 210 164" className={`art-soft ${className}`} role="img" aria-label="the legendary meal">
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0%" stopColor={PALETTE.butter} stopOpacity="0.85" />
          <stop offset="100%" stopColor={PALETTE.butter} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-mash`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="70%" stopColor="#fff2ce" />
          <stop offset="100%" stopColor="#f0dba6" />
        </linearGradient>
      </defs>
      <ellipse cx="105" cy="96" rx="96" ry="66" fill={`url(#${id}-glow)`} />
      <ellipse cx="105" cy="140" rx="74" ry="12" fill="#5b4450" opacity="0.13" />
      <ellipse cx="105" cy="122" rx="82" ry="24" fill="#f3e9f7" stroke={LINE} strokeWidth={STROKE.thick} />
      <ellipse cx="105" cy="116" rx="82" ry="22" fill="#fff" stroke={LINE} strokeWidth={STROKE.base} />
      <ellipse cx="105" cy="113" rx="62" ry="15" fill="#f8f1e6" />

      {/* mashed potatoes */}
      <path
        d="M78 108c-16 0-26-8-24-18 2-12 14-16 22-22 8-6 20-6 28 0 8 5 20 8 22 18 2 12-10 22-26 22z"
        fill={`url(#${id}-mash)`}
        stroke="#e3cd9d"
        strokeWidth={STROKE.fine}
      />
      <ellipse cx="94" cy="78" rx="18" ry="10" fill="#fffdf6" opacity="0.9" />
      <ellipse cx="96" cy="88" rx="9" ry="5" fill="#f5cf6e" opacity="0.6" />

      {/* spinach */}
      <path
        d="M132 104c-6-16 4-30 18-32 12-2 22 8 20 20-2 14-14 20-26 18-6-1-10-3-12-6z"
        fill="#68bb87"
        stroke="#3c8159"
        strokeWidth={STROKE.fine}
      />
      <path d="M140 98c6-10 14-12 20-8" stroke="#a7e0bc" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M136 104c8-6 16-16 20-24" stroke="#3c8159" strokeWidth={STROKE.hair} fill="none" opacity="0.7" />

      {/* fried eggs */}
      <g>
        <ellipse cx="62" cy="112" rx="22" ry="12" fill="#fffaf0" stroke="#efdfc0" strokeWidth={STROKE.fine} />
        <ellipse cx="60" cy="110" rx="8" ry="6" fill="#ffc94d" stroke="#e3a92c" strokeWidth={STROKE.hair} />
        <ellipse cx="57" cy="108" rx="2.6" ry="1.8" fill="#fff" opacity="0.7" />
      </g>
      <g>
        <ellipse cx="148" cy="118" rx="20" ry="11" fill="#fffaf0" stroke="#efdfc0" strokeWidth={STROKE.fine} />
        <ellipse cx="150" cy="117" rx="7.4" ry="5.4" fill="#ffc94d" stroke="#e3a92c" strokeWidth={STROKE.hair} />
      </g>

      <g className="anim-twinkle" fill={PALETTE.butter} stroke={LINE} strokeWidth={STROKE.hair}>
        <path d="M30 44l2.4 5 5.2.8-3.8 3.6 1 5.2-4.8-2.6-4.8 2.6 1-5.2-3.8-3.6 5.2-.8z" />
        <path d="M176 36l2.4 5 5.2.8-3.8 3.6 1 5.2-4.8-2.6-4.8 2.6 1-5.2-3.8-3.6 5.2-.8z" />
      </g>
    </svg>
  )
}

export function Burger({ size = 120, className = "", legendary = false }: Base & { legendary?: boolean }) {
  const id = useId().replace(/[:]/g, "")
  return (
    <svg width={size} height={size * 0.88} viewBox="0 0 130 114" className={`art-soft ${className}`} role="img" aria-label="a burger">
      <defs>
        <linearGradient id={`${id}-bun`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#f6d6a8" />
          <stop offset="60%" stopColor="#e8bb84" />
          <stop offset="100%" stopColor="#d3a066" />
        </linearGradient>
      </defs>
      {legendary && <ellipse cx="65" cy="58" rx="62" ry="50" fill={PALETTE.butter} opacity="0.45" />}
      <ellipse cx="65" cy="104" rx="42" ry="7" fill="#5b4450" opacity="0.13" />
      <path d="M18 52C18 26 40 12 65 12s47 14 47 40z" fill={`url(#${id}-bun)`} stroke={LINE} strokeWidth={STROKE.thick} strokeLinejoin="round" />
      <g fill="#fff8ec">
        <ellipse cx="45" cy="34" rx="3.4" ry="2.2" transform="rotate(-18 45 34)" />
        <ellipse cx="66" cy="26" rx="3" ry="2" transform="rotate(8 66 26)" />
        <ellipse cx="86" cy="36" rx="3.2" ry="2.1" transform="rotate(22 86 36)" />
      </g>
      <path d="M20 54c14-8 76-8 90 0l-2 8c-16-6-70-6-86 0z" fill="#7fd3a1" stroke="#3c8159" strokeWidth={STROKE.hair} />
      <rect x="20" y="60" width="90" height="13" rx="6" fill="#c07551" stroke={LINE} strokeWidth={STROKE.fine} />
      <rect x="23" y="72" width="84" height="10" rx="5" fill="#ffd96b" stroke="#e0aa33" strokeWidth={STROKE.hair} />
      <path d="M18 84c14-10 80-10 94 0 0 14-18 20-47 20s-47-6-47-20z" fill={`url(#${id}-bun)`} stroke={LINE} strokeWidth={STROKE.thick} strokeLinejoin="round" />
    </svg>
  )
}

export function CactusIceCream({
  body = PALETTE.rose,
  spots = "#fff",
  size = 110,
  className = "",
}: Base & { body?: string; spots?: string }) {
  const id = useId().replace(/[:]/g, "")
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 110 126" className={`art-soft ${className}`} role="img" aria-label="cactus ice cream friend">
      <defs>
        <linearGradient id={`${id}-c`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="40%" stopColor={body} />
          <stop offset="100%" stopColor={body} />
        </linearGradient>
      </defs>
      <ellipse cx="55" cy="118" rx="26" ry="6" fill="#5b4450" opacity="0.12" />
      {/* cone */}
      <path d="M34 78h42l-12 38a9 9 0 0 1-18 0z" fill="#e8bb84" stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
      <path d="M38 88l34 0M42 100l26 0" stroke="#c89257" strokeWidth={STROKE.hair} />
      {/* arms */}
      <path d="M26 56c-10 2-14 10-10 18 3 6 10 6 14 2" fill={`url(#${id}-c)`} stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
      <path d="M84 52c10 2 14 10 10 18-3 6-10 6-14 2" fill={`url(#${id}-c)`} stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
      {/* scoop body */}
      <path d="M55 8c18 0 30 14 30 32 0 22-12 40-30 40S25 62 25 40C25 22 37 8 55 8z" fill={`url(#${id}-c)`} stroke={LINE} strokeWidth={STROKE.thick} />
      <path d="M38 26c6-8 14-11 22-10" stroke="#fff" strokeWidth="3" opacity="0.6" fill="none" strokeLinecap="round" />
      <g fill={spots} opacity="0.85">
        <circle cx="42" cy="46" r="2.4" />
        <circle cx="66" cy="38" r="2" />
        <circle cx="58" cy="58" r="2.2" />
      </g>
      <ellipse cx="45" cy="42" rx="4.6" ry="5.6" fill="#2a2333" />
      <ellipse cx="65" cy="42" rx="4.6" ry="5.6" fill="#2a2333" />
      <circle cx="43.4" cy="39.6" r="1.6" fill="#fff" />
      <circle cx="63.4" cy="39.6" r="1.6" fill="#fff" />
      <path d="M50 54c3 3 7 3 10 0" stroke={LINE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="36" cy="52" rx="5" ry="3.4" fill={PALETTE.rose} opacity="0.35" />
      <ellipse cx="74" cy="52" rx="5" ry="3.4" fill={PALETTE.rose} opacity="0.35" />
    </svg>
  )
}

export function TinyCar({ size = 130, className = "", color = PALETTE.blushDeep }: Base & { color?: string }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 130 78" className={`art-soft ${className}`} role="img" aria-label="a small car">
      <ellipse cx="65" cy="70" rx="46" ry="6" fill="#5b4450" opacity="0.12" />
      <path d="M22 42l14-18h44l20 18z" fill="#e7f5ff" stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
      <path d="M44 24h16v18H44z" fill="#cfe9f8" />
      <rect x="10" y="40" width="110" height="22" rx="10" fill={color} stroke={LINE} strokeWidth={STROKE.thick} />
      <path d="M14 46c16-4 86-4 102 0" stroke="#fff" strokeWidth="2.6" opacity="0.5" fill="none" />
      <circle cx="36" cy="62" r="11" fill="#4b3f52" stroke={LINE} strokeWidth={STROKE.fine} />
      <circle cx="36" cy="62" r="4.6" fill="#e7f5ff" />
      <circle cx="94" cy="62" r="11" fill="#4b3f52" stroke={LINE} strokeWidth={STROKE.fine} />
      <circle cx="94" cy="62" r="4.6" fill="#e7f5ff" />
      <circle cx="118" cy="48" r="4" fill={PALETTE.butter} stroke={LINE} strokeWidth={STROKE.hair} />
    </svg>
  )
}

export function Trophy({ size = 56, className = "" }: Base) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className={`sticker ${className}`} aria-hidden>
      <path d="M16 8h24v14a12 12 0 0 1-24 0z" fill={PALETTE.butter} stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
      <path d="M16 12H9a8 8 0 0 0 8 10M40 12h7a8 8 0 0 1-8 10" fill="none" stroke={LINE} strokeWidth={STROKE.base} />
      <rect x="24" y="33" width="8" height="8" fill="#f0cf72" stroke={LINE} strokeWidth={STROKE.hair} />
      <path d="M16 48h24l-3-7H19z" fill="#f0cf72" stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
      <path d="M21 14c1 6 3 9 6 10" stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" />
    </svg>
  )
}

export function NurseBadge({ size = 52, className = "" }: Base) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" className={`sticker ${className}`} aria-hidden>
      <circle cx="26" cy="26" r="20" fill="#fff" stroke={LINE} strokeWidth={STROKE.base} />
      <circle cx="26" cy="26" r="15" fill={PALETTE.blush} opacity="0.6" />
      <rect x="22" y="15" width="8" height="22" rx="3" fill={PALETTE.rose} />
      <rect x="15" y="22" width="22" height="8" rx="3" fill={PALETTE.rose} />
      <path d="M13 16c3-4 7-6 11-7" stroke="#fff" strokeWidth="2.4" fill="none" opacity="0.9" />
    </svg>
  )
}

export function PaintPalette({ size = 60, className = "" }: Base) {
  return (
    <svg width={size} height={size * 0.86} viewBox="0 0 60 52" className={`sticker ${className}`} aria-hidden>
      <path
        d="M28 3c15 0 27 9 27 21 0 9-8 12-13 12-4 0-6 3-5 6 1 4-2 7-8 7C13 49 1 39 1 25 1 12 13 3 28 3z"
        fill="#fffaf2"
        stroke={LINE}
        strokeWidth={STROKE.base}
      />
      <circle cx="16" cy="16" r="4.2" fill={PALETTE.rose} />
      <circle cx="29" cy="12" r="4.2" fill={PALETTE.skyDeep} />
      <circle cx="41" cy="18" r="4.2" fill={PALETTE.butter} />
      <circle cx="16" cy="31" r="4.2" fill={PALETTE.mintDeep} />
      <circle cx="28" cy="34" r="4.2" fill={PALETTE.lilacDeep} />
    </svg>
  )
}

export function NailPolish({ size = 46, className = "" }: Base) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 46 56" className={`sticker ${className}`} aria-hidden>
      <rect x="18" y="4" width="10" height="12" rx="3" fill="#6c5570" stroke={LINE} strokeWidth={STROKE.hair} />
      <path d="M12 20h22a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6z" fill={PALETTE.rose} stroke={LINE} strokeWidth={STROKE.base} />
      <path d="M10 30c2 10 2 14 0 18" stroke="#fff" strokeWidth="2.4" opacity="0.5" fill="none" />
      <rect x="10" y="20" width="26" height="5" rx="2.5" fill="#fff" opacity="0.6" />
    </svg>
  )
}

export function PuddingCup({ size = 52, className = "" }: Base) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" className={`sticker ${className}`} aria-hidden>
      <path d="M12 16h28l-4 28a6 6 0 0 1-6 5h-8a6 6 0 0 1-6-5z" fill="#f6dcb8" stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
      <path d="M12 16h28l-1.5 10H13.5z" fill="#c98a5c" />
      <ellipse cx="26" cy="16" rx="14" ry="4.4" fill="#fff6e8" stroke={LINE} strokeWidth={STROKE.hair} />
      <path d="M17 24c2 10 2 16 1 20" stroke="#fff" strokeWidth="2" opacity="0.45" fill="none" />
    </svg>
  )
}

export function Licence({ size = 62, className = "" }: Base) {
  return (
    <svg width={size} height={size * 0.68} viewBox="0 0 62 42" className={`sticker ${className}`} aria-hidden>
      <rect x="2" y="3" width="58" height="36" rx="6" fill="#fff" stroke={LINE} strokeWidth={STROKE.base} />
      <rect x="7" y="9" width="16" height="20" rx="4" fill={PALETTE.sky} />
      <circle cx="15" cy="16" r="4" fill={PALETTE.ink} opacity="0.55" />
      <path d="M9 27c2-4 10-4 12 0z" fill={PALETTE.ink} opacity="0.55" />
      <path d="M28 12h26M28 19h22M28 26h18" stroke={PALETTE.ink} strokeWidth="2.4" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

export function Headphones({ size = 56, className = "" }: Base) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className={`sticker ${className}`} aria-hidden>
      <path d="M10 34V28a18 18 0 0 1 36 0v6" fill="none" stroke="#246e59" strokeWidth="3.4" strokeLinecap="round" />
      <rect x="4" y="30" width="12" height="20" rx="6" fill="#2e8b71" stroke={LINE} strokeWidth={STROKE.base} />
      <rect x="40" y="30" width="12" height="20" rx="6" fill="#2e8b71" stroke={LINE} strokeWidth={STROKE.base} />
      <path d="M7 34c1 6 1 10 0 13" stroke="#fff" strokeWidth="2" fill="none" opacity="0.6" />
    </svg>
  )
}

export function GiftBox({ size = 56, className = "" }: Base) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className={`sticker ${className}`} aria-hidden>
      <rect x="6" y="20" width="44" height="30" rx="5" fill={PALETTE.mint} stroke={LINE} strokeWidth={STROKE.base} />
      <rect x="3" y="13" width="50" height="10" rx="4" fill={PALETTE.mintDeep} stroke={LINE} strokeWidth={STROKE.base} />
      <rect x="24" y="13" width="8" height="37" fill={PALETTE.rose} />
      <path d="M28 13c-8-10-18-4-12 2 3 3 8 2 12-2zM28 13c8-10 18-4 12 2-3 3-8 2-12-2z" fill={PALETTE.rose} stroke={LINE} strokeWidth={STROKE.hair} />
    </svg>
  )
}

export function FruitBasket({ size = 64, className = "" }: Base) {
  return (
    <svg width={size} height={size * 0.82} viewBox="0 0 64 52" className={`sticker ${className}`} aria-hidden>
      <circle cx="22" cy="20" r="10" fill={PALETTE.rose} stroke={LINE} strokeWidth={STROKE.fine} />
      <circle cx="38" cy="17" r="9" fill={PALETTE.butter} stroke={LINE} strokeWidth={STROKE.fine} />
      <circle cx="31" cy="26" r="8" fill={PALETTE.mintDeep} stroke={LINE} strokeWidth={STROKE.fine} />
      <path d="M6 28h52l-6 18a4 4 0 0 1-4 3H16a4 4 0 0 1-4-3z" fill="#e0b184" stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
      <path d="M16 32l4 16M32 32v16M48 32l-4 16" stroke="#c08f5e" strokeWidth={STROKE.hair} />
    </svg>
  )
}

export function Bubble({ size = 16, className = "" }: Base) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="8" r="7" fill="#fff" opacity="0.35" stroke="#fff" strokeWidth="1" />
      <circle cx="5.6" cy="5.6" r="1.8" fill="#fff" opacity="0.7" />
    </svg>
  )
}
