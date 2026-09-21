export function SantaArt({ size = 140, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 120 132" className={`sticker ${className}`} aria-hidden>
      <ellipse cx="60" cy="124" rx="28" ry="6" fill="#4a3f55" opacity="0.14" />
      <path d="M28 118 h64 l-6 -28 h-52z" fill="#c23b3b" stroke="#4a3f55" strokeWidth="1.5" />
      <circle cx="44" cy="118" r="8" fill="#2a2430" />
      <circle cx="76" cy="118" r="8" fill="#2a2430" />
      <ellipse cx="60" cy="70" rx="32" ry="28" fill="#ffe4d1" stroke="#4a3f55" strokeWidth="1.5" />
      <path d="M30 62 q30 -38 60 0 v8 q-30 18 -60 0z" fill="#fff" stroke="#4a3f55" strokeWidth="1.3" />
      <path d="M22 40 q38 -36 76 8 q-18 6 -28 -4 q-10 22 -30 8 q-10 10 -18 -12z" fill="#c23b3b" stroke="#4a3f55" strokeWidth="1.5" />
      <circle cx="96" cy="28" r="8" fill="#fff" stroke="#4a3f55" strokeWidth="1.3" />
      <rect x="28" y="86" width="64" height="14" rx="7" fill="#fff" />
      <circle cx="60" cy="94" r="5" fill="#f4d35e" stroke="#4a3f55" strokeWidth="1.1" />
      <ellipse cx="48" cy="68" rx="6" ry="7" fill="#2a2430" />
      <ellipse cx="72" cy="68" rx="6" ry="7" fill="#2a2430" />
      <circle cx="50" cy="66" r="1.8" fill="#fff" />
      <circle cx="74" cy="66" r="1.8" fill="#fff" />
      <path d="M48 82 q12 10 24 0" stroke="#4a3f55" strokeWidth="1.6" fill="none" />
      <circle cx="42" cy="78" r="5" fill="#ff8fab" opacity="0.7" />
      <circle cx="78" cy="78" r="5" fill="#ff8fab" opacity="0.7" />
      <path d="M44 58 q8 8 16 2" fill="#fff" opacity="0.9" />
      <path d="M62 56 q10 8 16 0" fill="#fff" opacity="0.9" />
    </svg>
  )
}

export function RobuxInfinity({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 90" className={className} aria-hidden>
      <text x="110" y="58" textAnchor="middle" fontFamily="Nunito" fontWeight="800" fontSize="44" fill="#fff3c4" stroke="#4a3f55" strokeWidth="2">
        ∞ ROBUX
      </text>
    </svg>
  )
}
