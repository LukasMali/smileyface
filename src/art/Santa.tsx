import { useId } from "react"
import { LINE, PALETTE, STROKE } from "./tokens"

export function SantaArt({ size = 150, className = "" }: { size?: number; className?: string }) {
  const id = useId().replace(/[:]/g, "")
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 130 146" className={`art-soft ${className}`} role="img" aria-label="a small cheerful Santa">
      <defs>
        <linearGradient id={`${id}-suit`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#e4585d" />
          <stop offset="60%" stopColor="#cc4347" />
          <stop offset="100%" stopColor="#a8333a" />
        </linearGradient>
        <linearGradient id={`${id}-skin`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffe8d6" />
          <stop offset="100%" stopColor="#f6cdb2" />
        </linearGradient>
      </defs>

      <ellipse cx="65" cy="140" rx="34" ry="6" fill="#5b4450" opacity="0.14" />

      {/* boots + body */}
      <path d="M30 130h70l-6-34H36z" fill={`url(#${id}-suit)`} stroke={LINE} strokeWidth={STROKE.thick} strokeLinejoin="round" />
      <rect x="28" y="120" width="74" height="12" rx="6" fill="#3c3340" stroke={LINE} strokeWidth={STROKE.base} />
      <rect x="56" y="118" width="18" height="16" rx="4" fill={PALETTE.butter} stroke={LINE} strokeWidth={STROKE.fine} />
      <circle cx="65" cy="126" r="3.4" fill="#e0ab2f" />

      {/* arms with mittens */}
      <path d="M32 104c-10 4-14 12-12 20" stroke="#cc4347" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M98 104c10 4 14 12 12 20" stroke="#cc4347" strokeWidth="9" fill="none" strokeLinecap="round" />
      <circle cx="19" cy="126" r="7" fill="#fff" stroke={LINE} strokeWidth={STROKE.fine} />
      <circle cx="111" cy="126" r="7" fill="#fff" stroke={LINE} strokeWidth={STROKE.fine} />

      {/* head */}
      <ellipse cx="65" cy="70" rx="34" ry="30" fill={`url(#${id}-skin)`} stroke={LINE} strokeWidth={STROKE.thick} />
      <ellipse cx="46" cy="76" rx="7" ry="5" fill={PALETTE.rose} opacity="0.4" />
      <ellipse cx="84" cy="76" rx="7" ry="5" fill={PALETTE.rose} opacity="0.4" />
      <ellipse cx="53" cy="68" rx="5" ry="6" fill="#2f2733" />
      <ellipse cx="77" cy="68" rx="5" ry="6" fill="#2f2733" />
      <circle cx="51.4" cy="65.6" r="1.8" fill="#fff" />
      <circle cx="75.4" cy="65.6" r="1.8" fill="#fff" />
      <ellipse cx="65" cy="78" rx="6" ry="5" fill="#f2a7a0" stroke={LINE} strokeWidth={STROKE.hair} />

      {/* beard + moustache */}
      <path d="M34 72c0 26 14 38 31 38s31-12 31-38c-8 12-20 16-31 16s-23-4-31-16z" fill="#fffdf8" stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
      <path d="M52 84c4 4 22 4 26 0" stroke="#e6e0e6" strokeWidth="2" fill="none" />
      <path d="M55 80c-6 0-9 4-6 7 3 2 9 0 10-4M75 80c6 0 9 4 6 7-3 2-9 0-10-4" fill="#fffdf8" stroke={LINE} strokeWidth={STROKE.hair} />

      {/* hat */}
      <path d="M30 52c6-26 30-38 52-28 12 6 16 18 12 28-10-6-18-2-24 6-8 10-28 6-40-6z" fill={`url(#${id}-suit)`} stroke={LINE} strokeWidth={STROKE.thick} strokeLinejoin="round" />
      <path d="M28 46c14 12 52 16 68 6l4 8c-18 10-58 6-74-6z" fill="#fffdf8" stroke={LINE} strokeWidth={STROKE.base} />
      <circle cx="96" cy="24" r="9" fill="#fffdf8" stroke={LINE} strokeWidth={STROKE.base} />
      <path d="M44 28c10-8 22-10 32-6" stroke="#fff" strokeWidth="2.4" opacity="0.45" fill="none" />
    </svg>
  )
}

export function RobuxInfinity({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 92" className={className} role="img" aria-label="infinite robux, fictional">
      <defs>
        <linearGradient id="robux-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6d0" />
          <stop offset="60%" stopColor="#ffd45e" />
          <stop offset="100%" stopColor="#e0ab2f" />
        </linearGradient>
      </defs>
      <text
        x="120"
        y="62"
        textAnchor="middle"
        fontFamily="Baloo 2, Nunito, sans-serif"
        fontWeight="800"
        fontSize="44"
        fill="url(#robux-fill)"
        stroke="#5b4450"
        strokeWidth="2.4"
        paintOrder="stroke"
      >
        ∞ ROBUX
      </text>
      <path d="M22 76c40 8 156 8 196 0" stroke="#ffd45e" strokeWidth="3" fill="none" opacity="0.6" />
    </svg>
  )
}
