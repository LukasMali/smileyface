import { useId } from "react"
import { LINE, PALETTE, STROKE } from "./tokens"

export type AlienMode = "ufo" | "peek" | "nurse" | "drive" | "steal" | "banker"

export function MrAlien({
  size = 96,
  mode = "ufo",
  className = "",
  animated = true,
}: {
  size?: number
  mode?: AlienMode
  className?: string
  animated?: boolean
}) {
  const id = useId().replace(/[:]/g, "")
  const inUfo = mode === "ufo" || mode === "drive"

  return (
    <svg
      width={size}
      height={size * (inUfo ? 0.92 : 1.02)}
      viewBox={inUfo ? "0 0 160 148" : "0 0 140 142"}
      className={`art-soft overflow-visible ${className}`}
      role="img"
      aria-label="Mr Alien, financial department"
    >
      <defs>
        <linearGradient id={`${id}-skin`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#c8f0a6" />
          <stop offset="55%" stopColor={PALETTE.alien} />
          <stop offset="100%" stopColor={PALETTE.alienDeep} />
        </linearGradient>
        <linearGradient id={`${id}-hull`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3ecff" />
          <stop offset="55%" stopColor={PALETTE.lilac} />
          <stop offset="100%" stopColor="#a892dd" />
        </linearGradient>
        <radialGradient id={`${id}-dome`} cx="0.35" cy="0.25" r="0.85">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#cdeffb" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#9fd8f2" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id={`${id}-beam`} cx="0.5" cy="0" r="1">
          <stop offset="0%" stopColor={PALETTE.butter} stopOpacity="0.75" />
          <stop offset="100%" stopColor={PALETTE.butter} stopOpacity="0" />
        </radialGradient>
      </defs>

      {inUfo ? (
        <g className={animated ? "anim-float" : undefined}>
          <path d="M52 92h56l18 48H34z" fill={`url(#${id}-beam)`} opacity="0.7" />
          <ellipse cx="80" cy="132" rx="34" ry="6" fill="#5b4450" opacity="0.1" />

          {/* dome */}
          <path d="M80 18c20 0 34 16 34 34 0 6-1 11-3 16H49c-2-5-3-10-3-16 0-18 14-34 34-34z" fill={`url(#${id}-dome)`} stroke="#bfe6f6" strokeWidth={STROKE.fine} />
          <AlienBody id={id} x={80} y={56} scale={0.78} mode={mode} animated={animated} />
          <path d="M60 30c6-8 16-12 24-11" stroke="#fff" strokeWidth="3" opacity="0.8" fill="none" strokeLinecap="round" />

          {/* hull */}
          <ellipse cx="80" cy="74" rx="66" ry="17" fill={`url(#${id}-hull)`} stroke={LINE} strokeWidth={STROKE.thick} />
          <ellipse cx="80" cy="69" rx="52" ry="10" fill="#f7f1ff" opacity="0.85" />
          <ellipse cx="80" cy="84" rx="40" ry="8" fill="#8f79c9" opacity="0.5" />
          {[-44, -22, 0, 22, 44].map((dx, i) => (
            <circle
              key={dx}
              cx={80 + dx}
              cy="80"
              r="4.4"
              fill={i % 2 ? PALETTE.blushDeep : PALETTE.butter}
              stroke={LINE}
              strokeWidth={STROKE.hair}
              className={animated ? "anim-twinkle" : undefined}
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
          {mode === "drive" && (
            <text x="80" y="146" textAnchor="middle" fontSize="13" fontWeight="700" fill={LINE} fontFamily="Baloo 2, sans-serif">
              wrong way??
            </text>
          )}
        </g>
      ) : (
        <g className={animated ? "anim-bob" : undefined}>
          <ellipse cx="70" cy="128" rx="30" ry="6" fill="#5b4450" opacity="0.12" />
          <AlienBody id={id} x={70} y={70} scale={1} mode={mode} animated={animated} />
        </g>
      )}
    </svg>
  )
}

function AlienBody({
  id,
  x,
  y,
  scale,
  mode,
  animated,
}: {
  id: string
  x: number
  y: number
  scale: number
  mode: AlienMode
  animated: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* antennae */}
      <g className={animated ? "anim-sway" : undefined} style={{ transformOrigin: "0px 0px" }}>
        <path d="M-14-38c-4-14-14-20-22-18" stroke={PALETTE.alienDeep} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <circle cx="-37" cy="-56" r="5.6" fill={PALETTE.blush} stroke={LINE} strokeWidth={STROKE.hair} />
        <path d="M14-38c4-14 14-20 22-18" stroke={PALETTE.alienDeep} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <circle cx="37" cy="-56" r="5.6" fill={PALETTE.butter} stroke={LINE} strokeWidth={STROKE.hair} />
      </g>

      {/* torso (small, most of him is head) */}
      <path d="M-22 12c0-10 10-16 22-16s22 6 22 16c0 14-8 24-22 24s-22-10-22-24z" fill={`url(#${id}-skin)`} stroke={LINE} strokeWidth={STROKE.base} />
      {/* tiny tie */}
      <path d="M0 6l7 6-7 22-7-22z" fill={PALETTE.roseDeep} stroke={LINE} strokeWidth={STROKE.hair} />
      <path d="M-6 2h12l-6 5z" fill="#fff" stroke={LINE} strokeWidth={STROKE.hair} />
      {/* arms */}
      <path d="M-22 14c-10 2-16 8-17 16" stroke={PALETTE.alienDeep} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M22 14c10 2 16 8 17 16" stroke={PALETTE.alienDeep} strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* head */}
      <path d="M0-42c22 0 36 14 36 30 0 15-16 24-36 24s-36-9-36-24c0-16 14-30 36-30z" fill={`url(#${id}-skin)`} stroke={LINE} strokeWidth={STROKE.thick} />
      <path d="M-22-30c8-7 18-9 26-7" stroke="#fff" strokeWidth="3" opacity="0.55" fill="none" strokeLinecap="round" />

      {/* eyes */}
      <ellipse cx="-13" cy="-12" rx="8.4" ry="11.4" fill="#2a2333" />
      <ellipse cx="13" cy="-12" rx="8.4" ry="11.4" fill="#2a2333" />
      <ellipse cx="-15.6" cy="-16.6" rx="2.8" ry="3.6" fill="#fff" />
      <ellipse cx="10.4" cy="-16.6" rx="2.8" ry="3.6" fill="#fff" />
      {animated && (
        <>
          <ellipse className="anim-blink" cx="-13" cy="-12" rx="9.4" ry="12.4" fill={PALETTE.alien} style={{ transformOrigin: "-13px -24px" }} />
          <ellipse className="anim-blink" cx="13" cy="-12" rx="9.4" ry="12.4" fill={PALETTE.alien} style={{ transformOrigin: "13px -24px" }} />
        </>
      )}
      <ellipse cx="-24" cy="-2" rx="6" ry="4" fill={PALETTE.rose} opacity="0.3" />
      <ellipse cx="24" cy="-2" rx="6" ry="4" fill={PALETTE.rose} opacity="0.3" />
      <path d="M-5 2c3 3 7 3 10 0" stroke="#3e6b2a" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* monocle: he is serious about money */}
      <g>
        <circle cx="13" cy="-12" r="14" fill="none" stroke="#e5c15c" strokeWidth="2.2" opacity="0.9" />
        <path d="M27-8l9 8" stroke="#e5c15c" strokeWidth="2" strokeLinecap="round" />
      </g>

      {mode === "nurse" && (
        <g transform="translate(0 -46)">
          <path d="M-22 0h44a5 5 0 0 1 5 5v7h-54V5a5 5 0 0 1 5-5z" fill="#fff" stroke={LINE} strokeWidth={STROKE.fine} />
          <rect x="-5" y="-1" width="10" height="13" rx="2.5" fill={PALETTE.rose} />
          <rect x="-9" y="3" width="18" height="4" rx="2" fill={PALETTE.rose} />
        </g>
      )}
      {mode === "steal" && (
        <g transform="translate(34 26)">
          <rect x="-16" y="-10" width="32" height="22" rx="5" fill="#d9a877" stroke={LINE} strokeWidth={STROKE.fine} />
          <path d="M-6-10v-4a6 6 0 0 1 12 0v4" fill="none" stroke={LINE} strokeWidth={STROKE.fine} />
          <circle cx="0" cy="1" r="3.4" fill={PALETTE.butter} stroke={LINE} strokeWidth={STROKE.hair} />
        </g>
      )}
      {mode === "banker" && (
        <g transform="translate(-36 22)">
          <rect x="-14" y="-8" width="28" height="20" rx="4" fill={PALETTE.mint} stroke={LINE} strokeWidth={STROKE.fine} />
          <text x="0" y="6" textAnchor="middle" fontSize="12" fontWeight="700" fill={LINE} fontFamily="Baloo 2, sans-serif">
            €
          </text>
        </g>
      )}
    </g>
  )
}

export function Coin({ size = 24, className = "" }: { size?: number; className?: string }) {
  const id = useId().replace(/[:]/g, "")
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" className={`sticker ${className}`} aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#fff0b8" />
          <stop offset="50%" stopColor="#f7d774" />
          <stop offset="100%" stopColor="#e0ab2f" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="15" fill={`url(#${id}-g)`} stroke="#c8921f" strokeWidth="1.8" />
      <circle cx="18" cy="18" r="10.5" fill="none" stroke="#fff5cf" strokeWidth="1.8" opacity="0.85" />
      <path d="M11 11c2-2 5-3 8-3" stroke="#fff" strokeWidth="2" opacity="0.7" fill="none" strokeLinecap="round" />
      <text x="18" y="23" textAnchor="middle" fontSize="13" fontWeight="800" fill="#96681a" fontFamily="Baloo 2, sans-serif">
        €
      </text>
    </svg>
  )
}
