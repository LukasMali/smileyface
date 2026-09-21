import { useId } from "react"
import { LINE, PALETTE, STROKE } from "./tokens"

export type BlobMood =
  | "cry"
  | "shock"
  | "stare"
  | "yay"
  | "hide"
  | "confused"
  | "thumb"
  | "scream"
  | "sleepy"
  | "panic"
  | "victory"

/** A tiny original sticker creature. Deeply supportive, mildly unhinged. */
export function KawaiiBlob({
  mood,
  size = 80,
  className = "",
  animated = true,
}: {
  mood: BlobMood
  size?: number
  className?: string
  animated?: boolean
}) {
  const id = useId().replace(/[:]/g, "")
  const hiding = mood === "hide"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`sticker overflow-visible ${className}`}
      role="img"
      aria-label={`tiny friend feeling ${mood}`}
    >
      <defs>
        <linearGradient id={`${id}-b`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#fffdf9" />
          <stop offset="65%" stopColor="#fff4e8" />
          <stop offset="100%" stopColor="#f6e2d2" />
        </linearGradient>
      </defs>

      <ellipse cx="50" cy="90" rx="24" ry="5" fill="#5b4450" opacity="0.12" />

      {/* ears */}
      {!hiding && (
        <>
          <ellipse cx="30" cy="34" rx="8" ry="10" fill={`url(#${id}-b)`} stroke={LINE} strokeWidth={STROKE.base} transform="rotate(-18 30 34)" />
          <ellipse cx="70" cy="34" rx="8" ry="10" fill={`url(#${id}-b)`} stroke={LINE} strokeWidth={STROKE.base} transform="rotate(18 70 34)" />
        </>
      )}

      {/* body */}
      <g className={animated ? "anim-breathe" : undefined} style={{ transformOrigin: "50px 86px" }}>
        <ellipse cx="50" cy={hiding ? 66 : 58} rx={hiding ? 26 : 29} ry={hiding ? 20 : 27} fill={`url(#${id}-b)`} stroke={LINE} strokeWidth={STROKE.thick} />
        <path d="M32 44c6-7 14-10 22-9" stroke="#fff" strokeWidth="3" opacity="0.8" fill="none" strokeLinecap="round" />

        {/* arms + feet */}
        {!hiding && (
          <>
            <path d="M22 62c-6 2-9 7-8 12" stroke={LINE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <path d="M78 62c6 2 9 7 8 12" stroke={LINE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <ellipse cx="41" cy="85" rx="8" ry="5" fill={`url(#${id}-b)`} stroke={LINE} strokeWidth={STROKE.fine} />
            <ellipse cx="59" cy="85" rx="8" ry="5" fill={`url(#${id}-b)`} stroke={LINE} strokeWidth={STROKE.fine} />
          </>
        )}

        <ellipse cx="33" cy="64" rx="6.5" ry="4.5" fill={PALETTE.rose} opacity="0.3" />
        <ellipse cx="67" cy="64" rx="6.5" ry="4.5" fill={PALETTE.rose} opacity="0.3" />

        <Face mood={mood} animated={animated} />
      </g>

      {mood === "yay" && (
        <g className={animated ? "anim-twinkle" : undefined} fill={PALETTE.butter} stroke={LINE} strokeWidth={STROKE.hair}>
          <path d="M14 26l2.6 5 5.4.8-4 3.8 1 5.4-5-2.6-5 2.6 1-5.4-4-3.8 5.4-.8z" />
          <path d="M84 24l2.6 5 5.4.8-4 3.8 1 5.4-5-2.6-5 2.6 1-5.4-4-3.8 5.4-.8z" />
        </g>
      )}
      {mood === "panic" && (
        <g stroke={PALETTE.roseDeep} strokeWidth="2.6" strokeLinecap="round">
          <path d="M14 30l-8-8M86 30l8-8M50 18v-10" />
        </g>
      )}
      {mood === "victory" && (
        <g transform="translate(78 26)">
          <rect x="-4" y="-4" width="20" height="14" rx="2" fill={PALETTE.mint} stroke={LINE} strokeWidth={STROKE.hair} />
          <rect x="-6" y="-6" width="3" height="28" rx="1.5" fill="#c2996f" stroke={LINE} strokeWidth={STROKE.hair} />
        </g>
      )}
      {mood === "sleepy" && (
        <text x="78" y="28" fontSize="16" fontWeight="700" fill={PALETTE.lilacDeep} fontFamily="Baloo 2, sans-serif" className={animated ? "anim-float" : undefined}>
          z
        </text>
      )}
      {mood === "confused" && (
        <text x="78" y="30" fontSize="20" fontWeight="700" fill={PALETTE.lilacDeep} fontFamily="Baloo 2, sans-serif" className={animated ? "anim-float" : undefined}>
          ?
        </text>
      )}
      {mood === "thumb" && (
        <g transform="translate(76 56)">
          <path d="M0 6h6V-2a5 5 0 0 1 10 0v8h4a3 3 0 0 1 3 3v8a4 4 0 0 1-4 4H2a2 2 0 0 1-2-2z" fill={`url(#${id}-b)`} stroke={LINE} strokeWidth={STROKE.fine} />
        </g>
      )}
    </svg>
  )
}

function Face({ mood, animated }: { mood: BlobMood; animated: boolean }) {
  const smile = (
    <path d="M42 66c4 5 12 5 16 0" stroke={LINE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
  )

  switch (mood) {
    case "cry":
      return (
        <g>
          <path d="M34 50c3-4 8-4 11 0" stroke={LINE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M55 50c3-4 8-4 11 0" stroke={LINE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M40 56c0 8 2 14 4 16" stroke={PALETTE.skyDeep} strokeWidth="3.4" strokeLinecap="round" className={animated ? "anim-drip" : undefined} />
          <path d="M60 56c0 9-2 15-4 18" stroke={PALETTE.skyDeep} strokeWidth="3.4" strokeLinecap="round" className={animated ? "anim-drip" : undefined} />
          <path d="M43 70c4-5 10-5 14 0" stroke={LINE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
      )
    case "shock":
    case "panic":
      return (
        <g>
          <ellipse cx="39" cy="54" rx="6" ry="8.4" fill="#2a2333" />
          <ellipse cx="61" cy="54" rx="6" ry="8.4" fill="#2a2333" />
          <circle cx="37" cy="51" r="1.8" fill="#fff" />
          <circle cx="59" cy="51" r="1.8" fill="#fff" />
          <ellipse cx="50" cy="70" rx="5" ry="6.4" fill="#2a2333" />
        </g>
      )
    case "scream":
      return (
        <g>
          <ellipse cx="38" cy="52" rx="5.4" ry="7.4" fill="#2a2333" />
          <ellipse cx="62" cy="52" rx="5.4" ry="7.4" fill="#2a2333" />
          <ellipse cx="50" cy="71" rx="9" ry="11" fill="#2a2333" />
          <ellipse cx="50" cy="78" rx="5" ry="4" fill={PALETTE.rose} />
        </g>
      )
    case "stare":
      return (
        <g>
          <circle cx="39" cy="54" r="4.6" fill="#2a2333" />
          <circle cx="61" cy="54" r="4.6" fill="#2a2333" />
          <path d="M42 70h16" stroke={LINE} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )
    case "hide":
      return (
        <g>
          <circle cx="42" cy="62" r="3.4" fill="#2a2333" />
          <circle cx="58" cy="62" r="3.4" fill="#2a2333" />
        </g>
      )
    case "sleepy":
      return (
        <g>
          <path d="M34 54c3 4 8 4 11 0" stroke={LINE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M55 54c3 4 8 4 11 0" stroke={LINE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          {smile}
        </g>
      )
    case "confused":
      return (
        <g>
          <circle cx="39" cy="53" r="4" fill="#2a2333" />
          <circle cx="61" cy="56" r="4" fill="#2a2333" />
          <path d="M42 70c5-3 11-1 15 3" stroke={LINE} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
      )
    default:
      return (
        <g>
          <path d="M33 52c3.5-5 9-5 12.5 0" stroke={LINE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M54.5 52c3.5-5 9-5 12.5 0" stroke={LINE} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M40 64c3 8 17 8 20 0z" fill={PALETTE.blush} stroke={LINE} strokeWidth={STROKE.fine} strokeLinejoin="round" />
        </g>
      )
  }
}
