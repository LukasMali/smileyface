import { useId } from "react"
import { LINE, PALETTE, STROKE } from "./tokens"

export type FishExtra = "none" | "nurse" | "car" | "coin" | "burger" | "confused" | "star"

export function Fish({
  color = PALETTE.blushDeep,
  fin = PALETTE.butter,
  size = 96,
  extra = "none",
  flip = false,
  message,
  className = "",
  animated = true,
}: {
  color?: string
  fin?: string
  size?: number
  extra?: FishExtra
  flip?: boolean
  message?: string
  className?: string
  animated?: boolean
}) {
  const id = useId().replace(/[:]/g, "")
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 150 108"
      className={`sticker overflow-visible ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      role="img"
      aria-label={message ?? "a small fish"}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="40%" stopColor={color} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <linearGradient id={`${id}-fin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={fin} stopOpacity="0.95" />
          <stop offset="100%" stopColor={fin} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* tail */}
      <g className={animated ? "anim-sway" : undefined} style={{ transformOrigin: "40px 56px" }}>
        <path d="M42 54c-14-16-28-22-32-16-4 6 0 18 6 26-8 4-12 12-8 18 5 7 20 0 34-14z" fill={`url(#${id}-fin)`} stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
        <path d="M18 44c2 6 6 12 12 16" stroke={LINE} strokeWidth={STROKE.hair} opacity="0.4" fill="none" />
      </g>

      {/* dorsal + belly fins */}
      <path d="M78 22c4-14 14-20 22-16 6 4 4 14-4 22z" fill={`url(#${id}-fin)`} stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
      <path d="M74 84c2 10 10 14 16 10 4-3 3-10-3-15z" fill={`url(#${id}-fin)`} stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />

      {/* body */}
      <path
        d="M40 56c0-24 22-40 52-40 28 0 50 16 50 38 0 22-22 38-50 38-30 0-52-14-52-36z"
        fill={`url(#${id}-body)`}
        stroke={LINE}
        strokeWidth={STROKE.thick}
      />
      <path d="M62 34c12-10 32-12 46-6" stroke="#fff" strokeWidth="3.4" opacity="0.55" fill="none" strokeLinecap="round" />
      <path d="M92 92c-16-2-28-10-32-22 14 6 30 8 46 4-4 10-8 16-14 18z" fill="#fff" opacity="0.22" />

      {/* side fin */}
      <path d="M88 58c10-4 18 0 18 8 0 7-8 11-16 8z" fill={`url(#${id}-fin)`} stroke={LINE} strokeWidth={STROKE.fine} opacity="0.95" />

      {/* gills + spots */}
      <path d="M68 40c-6 10-6 22 0 32" stroke={LINE} strokeWidth={STROKE.fine} opacity="0.3" fill="none" />
      <circle cx="104" cy="44" r="4" fill="#fff" opacity="0.4" />
      <circle cx="116" cy="62" r="3" fill="#fff" opacity="0.35" />

      {/* face */}
      {extra === "confused" ? (
        <>
          <circle cx="122" cy="46" r="5.4" fill="#2a2333" />
          <circle cx="124" cy="44" r="1.8" fill="#fff" />
          <path d="M124 68c6-4 12-2 14 3" stroke={LINE} strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* symmetric confusion swirl so the sprite can be mirrored freely */}
          <path
            d="M132 26c-5 0-7-4-4-6 3-2 7 1 6 5-1 5-8 7-12 4"
            stroke={LINE}
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="140" cy="14" r="2.2" fill={LINE} opacity="0.7" />
        </>
      ) : (
        <>
          <ellipse cx="120" cy="48" rx="8" ry="9" fill="#2a2333" />
          <ellipse cx="117.6" cy="44.8" rx="2.8" ry="3.4" fill="#fff" />
          <circle cx="123" cy="52" r="1.6" fill="#fff" opacity="0.7" />
          {animated && (
            <ellipse className="anim-blink" cx="120" cy="48" rx="9" ry="10" fill={color} style={{ transformOrigin: "120px 40px" }} />
          )}
          <path d="M128 66c4 0 7 2 8 5-4 2-8 1-10-2z" fill="#f4a0ba" stroke={LINE} strokeWidth={STROKE.hair} />
        </>
      )}
      <ellipse cx="106" cy="64" rx="7" ry="5" fill={PALETTE.rose} opacity="0.28" />

      {extra === "nurse" && (
        <g transform="translate(96 8)">
          <path d="M0 8h34a4 4 0 0 1 4 4v6H-4v-6a4 4 0 0 1 4-4z" fill="#fff" stroke={LINE} strokeWidth={STROKE.fine} />
          <rect x="13" y="7" width="8" height="11" rx="2" fill={PALETTE.rose} />
          <rect x="9.5" y="10.5" width="15" height="3.6" rx="1.8" fill={PALETTE.rose} />
        </g>
      )}
      {extra === "coin" && (
        <g transform="translate(126 80)">
          <circle cx="0" cy="0" r="9" fill="#f7d774" stroke="#c8921f" strokeWidth={STROKE.fine} />
          <circle cx="0" cy="0" r="5.6" fill="none" stroke="#c8921f" strokeWidth="1.1" opacity="0.7" />
          <path d="M-3.4-1.6h6.8M-3.4 1.6h6.8" stroke="#96681a" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}
      {extra === "car" && (
        <g transform="translate(96 4) scale(0.5)">
          <rect x="-24" y="0" width="48" height="14" rx="6" fill={PALETTE.skyDeep} stroke={LINE} strokeWidth="2" />
          <path d="M-14 0l8-10h14l10 10z" fill="#e6f5ff" stroke={LINE} strokeWidth="2" />
          <circle cx="-10" cy="16" r="6" fill={LINE} />
          <circle cx="12" cy="16" r="6" fill={LINE} />
        </g>
      )}
      {extra === "burger" && (
        <g transform="translate(112 86) scale(0.55)">
          <ellipse cx="0" cy="0" rx="22" ry="14" fill="#e8c39e" stroke={LINE} strokeWidth="2" />
          <path d="M-20-2C-14-16 14-16 20-2z" fill="#efc793" stroke={LINE} strokeWidth="2" />
          <path d="M-18 2c10-6 26-6 36 0" stroke={PALETTE.mintDeep} strokeWidth="5" fill="none" />
        </g>
      )}
      {extra === "star" && (
        <path
          className={animated ? "anim-twinkle" : undefined}
          d="M132 14l3.4 7 7.6 1-5.6 5.4 1.4 7.6-6.8-3.8-6.8 3.8 1.4-7.6-5.6-5.4 7.6-1z"
          fill={PALETTE.butter}
          stroke={LINE}
          strokeWidth={STROKE.hair}
        />
      )}
    </svg>
  )
}
