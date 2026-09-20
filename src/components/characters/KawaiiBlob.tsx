export type BlobMood =
  | "cry"
  | "shock"
  | "stare"
  | "yay"
  | "hide"
  | "confused"
  | "thumb"
  | "scream"

export function KawaiiBlob({
  mood,
  size = 72,
  className = "",
}: {
  mood: BlobMood
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={`sticker ${className}`}
      aria-hidden
    >
      <ellipse cx="40" cy="46" rx="26" ry="22" fill="#fffdf8" stroke="#4a3f55" strokeWidth="1.7" />
      {mood !== "hide" && (
        <>
          <path d="M22 38 Q18 22 28 28" stroke="#4a3f55" strokeWidth="1.6" fill="none" />
          <path d="M58 38 Q62 22 52 28" stroke="#4a3f55" strokeWidth="1.6" fill="none" />
        </>
      )}
      {mood === "cry" && (
        <>
          <path d="M28 42 Q32 38 36 42" stroke="#4a3f55" strokeWidth="2" fill="none" />
          <path d="M44 42 Q48 38 52 42" stroke="#4a3f55" strokeWidth="2" fill="none" />
          <path d="M32 48 v10" stroke="#8ecae6" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 48 v12" stroke="#8ecae6" strokeWidth="3" strokeLinecap="round" />
          <path d="M34 58 Q40 64 46 58" stroke="#4a3f55" strokeWidth="1.6" fill="none" />
        </>
      )}
      {mood === "shock" && (
        <>
          <ellipse cx="30" cy="44" rx="6" ry="8" fill="#2a2430" />
          <ellipse cx="50" cy="44" rx="6" ry="8" fill="#2a2430" />
          <ellipse cx="40" cy="58" rx="5" ry="7" fill="#2a2430" />
        </>
      )}
      {mood === "stare" && (
        <>
          <circle cx="30" cy="44" r="4.5" fill="#2a2430" />
          <circle cx="50" cy="44" r="4.5" fill="#2a2430" />
          <line x1="32" y1="58" x2="48" y2="58" stroke="#4a3f55" strokeWidth="1.6" />
        </>
      )}
      {mood === "yay" && (
        <>
          <path d="M26 46 Q30 40 34 46" stroke="#4a3f55" strokeWidth="2" fill="none" />
          <path d="M46 46 Q50 40 54 46" stroke="#4a3f55" strokeWidth="2" fill="none" />
          <path d="M32 54 Q40 64 48 54" fill="#ffd6e0" stroke="#4a3f55" strokeWidth="1.3" />
          <circle cx="18" cy="30" r="4" fill="#ffd6e0" />
          <circle cx="62" cy="30" r="4" fill="#ffd6e0" />
        </>
      )}
      {mood === "hide" && (
        <>
          <ellipse cx="40" cy="52" rx="22" ry="16" fill="#fffdf8" stroke="#4a3f55" strokeWidth="1.6" />
          <circle cx="32" cy="46" r="3" fill="#2a2430" />
          <circle cx="48" cy="46" r="3" fill="#2a2430" />
        </>
      )}
      {mood === "confused" && (
        <>
          <circle cx="30" cy="44" r="3.5" fill="#2a2430" />
          <circle cx="50" cy="46" r="3.5" fill="#2a2430" />
          <path d="M34 58 Q42 54 48 60" stroke="#4a3f55" strokeWidth="1.6" fill="none" />
          <text x="58" y="24" fontSize="14" fill="#4a3f55">
            ?
          </text>
        </>
      )}
      {mood === "thumb" && (
        <>
          <path d="M28 44 Q32 38 36 44" stroke="#4a3f55" strokeWidth="2" fill="none" />
          <path d="M44 44 Q48 38 52 44" stroke="#4a3f55" strokeWidth="2" fill="none" />
          <path d="M34 54 Q40 58 46 54" stroke="#4a3f55" strokeWidth="1.6" fill="none" />
          <path d="M58 34 h8 v-8 h8 v20 h-16 z" fill="#fffdf8" stroke="#4a3f55" strokeWidth="1.5" />
        </>
      )}
      {mood === "scream" && (
        <>
          <ellipse cx="30" cy="42" rx="5" ry="7" fill="#2a2430" />
          <ellipse cx="50" cy="42" rx="5" ry="7" fill="#2a2430" />
          <ellipse cx="40" cy="58" rx="8" ry="10" fill="#2a2430" />
          <circle cx="38" cy="56" r="2" fill="#fff" />
        </>
      )}
    </svg>
  )
}
