import { useId } from "react"
import { LINE, PALETTE, STROKE } from "./tokens"

export type PonyAccessory =
  | "nurse"
  | "sign"
  | "burger"
  | "coins"
  | "stylus"
  | "sleep"
  | "bow"
  | "flowers"
  | "star"
  | "scarf"

export type PonyLook = {
  body: string
  mane: string
  accessory?: PonyAccessory
}

export function Pony({
  look,
  name,
  size = 170,
  className = "",
  sleeping = false,
  dramatic = false,
  animated = true,
  onClick,
}: {
  look: PonyLook
  name: string
  size?: number
  className?: string
  sleeping?: boolean
  dramatic?: boolean
  animated?: boolean
  onClick?: () => void
}) {
  const id = useId().replace(/[:]/g, "")
  const art = (
    <svg
      width={size}
      height={size * 0.92}
      viewBox="0 0 220 202"
      className={`art-soft overflow-visible ${className}`}
      role="img"
      aria-label={`${name} pony`}
    >
      <defs>
        <linearGradient id={`${id}-coat`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="38%" stopColor={look.body} />
          <stop offset="100%" stopColor={look.body} />
        </linearGradient>
        <linearGradient id={`${id}-mane`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="45%" stopColor={look.mane} />
          <stop offset="100%" stopColor={look.mane} />
        </linearGradient>
        <radialGradient id={`${id}-cheek`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={PALETTE.rose} stopOpacity="0.5" />
          <stop offset="100%" stopColor={PALETTE.rose} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="104" cy="188" rx="62" ry="9" fill="#5b4450" opacity="0.13" />

      {/* fluffy tail */}
      <g className={animated ? "anim-sway" : undefined} style={{ transformOrigin: "62px 112px" }}>
        <path
          d="M64 108c-16-4-30 6-36 22-5 13-3 26 4 34 4 5 10 3 9-4-3-13 1-24 11-31 9-6 15-12 12-21z"
          fill={`url(#${id}-mane)`}
          stroke={LINE}
          strokeWidth={STROKE.base}
          strokeLinejoin="round"
        />
        <path d="M44 126c-8 9-10 24-5 34" stroke="#fff" strokeWidth="2.2" opacity="0.45" fill="none" strokeLinecap="round" />
      </g>

      <g className={animated ? "anim-breathe" : undefined} style={{ transformOrigin: "104px 182px" }}>
        {/* back legs */}
        <Leg x={62} body={look.body} />
        <Leg x={84} body={look.body} />

        {/* round little body */}
        <path
          d="M50 126c0-24 21-38 52-38 28 0 46 13 48 33 2 23-16 39-46 39-32 0-54-11-54-34z"
          fill={`url(#${id}-coat)`}
          stroke={LINE}
          strokeWidth={STROKE.thick}
          strokeLinejoin="round"
        />
        <path d="M64 104c18-11 46-13 66-5" stroke="#fff" strokeWidth="3.6" opacity="0.5" fill="none" strokeLinecap="round" />

        {/* front legs */}
        <Leg x={112} body={look.body} />
        <Leg x={134} body={look.body} />

        <g>
          {/* mane behind the head, flowing down the neck */}
          <path
            d="M146 54c-16 6-26 22-30 42-3 15-8 26-16 33 11 5 22 1 29-9 5 8 14 10 22 5-8-11-10-23-6-35 4-13 5-25 1-36z"
            fill={`url(#${id}-mane)`}
            stroke={LINE}
            strokeWidth={STROKE.base}
            strokeLinejoin="round"
          />

          {/* ears */}
          <g className={animated ? "anim-ear" : undefined} style={{ transformOrigin: "146px 56px" }}>
            <path d="M150 54c-8-11-10-20-4-22 6-2 12 6 13 18z" fill={look.body} stroke={LINE} strokeWidth={STROKE.fine} strokeLinejoin="round" />
            <path d="M150 50c-5-7-6-12-3-13 3-1 6 4 7 10z" fill={look.mane} opacity="0.75" />
          </g>
          <g>
            <path d="M178 50c0-13 4-21 10-20 6 1 8 10 4 21z" fill={look.body} stroke={LINE} strokeWidth={STROKE.fine} strokeLinejoin="round" />
            <path d="M181 48c0-8 2-13 5-12 3 1 3 6 1 11z" fill={look.mane} opacity="0.75" />
          </g>

          {/* big soft head */}
          <circle cx="166" cy="82" r="35" fill={`url(#${id}-coat)`} stroke={LINE} strokeWidth={STROKE.thick} />
          {/* muzzle */}
          <ellipse cx="190" cy="96" rx="18" ry="14.5" fill={`url(#${id}-coat)`} stroke={LINE} strokeWidth={STROKE.base} />
          <ellipse cx="190" cy="94" rx="12" ry="8" fill="#fff" opacity="0.32" />
          <ellipse cx="197" cy="90" rx="2" ry="1.5" fill={LINE} opacity="0.6" />
          <path d="M186 100c3 3 8 3 11 0" stroke={LINE} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />

          {/* forelock */}
          <path
            d="M148 58c2-16 14-26 30-25 9 1 15 7 13 13-9-4-17 0-21 7-4 8-13 10-22 5z"
            fill={`url(#${id}-mane)`}
            stroke={LINE}
            strokeWidth={STROKE.base}
            strokeLinejoin="round"
          />
          <path d="M160 44c8-3 15-1 19 4" stroke="#fff" strokeWidth="2" opacity="0.5" fill="none" strokeLinecap="round" />

          {/* eye */}
          {sleeping ? (
            <path d="M164 80c5 6 13 6 18 0" stroke={LINE} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          ) : (
            <g>
              <ellipse cx="173" cy="79" rx="8.6" ry="10" fill="#2d2431" />
              <ellipse cx="170.4" cy="75.2" rx="3.1" ry="3.6" fill="#fff" />
              <circle cx="176" cy="83.4" r="1.8" fill="#fff" opacity="0.75" />
              <path d="M164 68c3-3 9-4 13-2" stroke={LINE} strokeWidth="2" fill="none" strokeLinecap="round" />
              {animated && (
                <ellipse className="anim-blink" cx="173" cy="79" rx="9.6" ry="10.8" fill={look.body} style={{ transformOrigin: "173px 70px" }} />
              )}
            </g>
          )}
          <ellipse cx="152" cy="92" rx="11" ry="7.5" fill={`url(#${id}-cheek)`} />
        </g>

        {look.accessory === "nurse" && (
          <g transform="translate(144 22)">
            <path d="M0 10h40a5 5 0 0 1 5 5v6H-5v-6a5 5 0 0 1 5-5z" fill="#fff" stroke={LINE} strokeWidth={STROKE.fine} />
            <rect x="15" y="9" width="10" height="12" rx="2.5" fill={PALETTE.rose} />
            <rect x="11" y="13" width="18" height="4" rx="2" fill={PALETTE.rose} />
          </g>
        )}
        {look.accessory === "bow" && (
          <g transform="translate(150 30)">
            <path d="M0 8c-10-8-18-4-16 6 2 8 12 8 16 2z" fill={PALETTE.rose} stroke={LINE} strokeWidth={STROKE.fine} />
            <path d="M4 8c10-8 18-4 16 6-2 8-12 8-16 2z" fill={PALETTE.rose} stroke={LINE} strokeWidth={STROKE.fine} />
            <circle cx="2" cy="12" r="4" fill={PALETTE.roseDeep} stroke={LINE} strokeWidth={STROKE.hair} />
          </g>
        )}
        {look.accessory === "flowers" && (
          <g transform="translate(150 34)">
            {[0, 14, 28].map((dx, i) => (
              <g key={dx} transform={`translate(${dx} ${i === 1 ? -5 : 0})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx="0" cy="-5" rx="3.2" ry="4.6" fill={i === 1 ? PALETTE.blush : "#fff"} transform={`rotate(${a})`} stroke={LINE} strokeWidth={STROKE.hair} />
                ))}
                <circle cx="0" cy="0" r="2.6" fill={PALETTE.butter} />
              </g>
            ))}
          </g>
        )}
        {look.accessory === "sign" && (
          <g transform="translate(24 96)">
            <rect x="12" y="-64" width="58" height="34" rx="8" fill={PALETTE.butter} stroke={LINE} strokeWidth={STROKE.base} />
            <text x="41" y="-42" textAnchor="middle" fontSize="13" fill={LINE} fontFamily="Baloo 2, sans-serif" fontWeight="700">
              DRIVE
            </text>
            <rect x="38" y="-30" width="6" height="30" rx="3" fill="#c2996f" stroke={LINE} strokeWidth={STROKE.hair} />
          </g>
        )}
        {look.accessory === "burger" && (
          <g transform="translate(30 112)">
            <ellipse cx="0" cy="8" rx="20" ry="14" fill="#e8c39e" stroke={LINE} strokeWidth={STROKE.fine} />
            <path d="M-18 6C-12-8 12-8 18 6z" fill="#efc793" stroke={LINE} strokeWidth={STROKE.fine} />
            <path d="M-17 8c10-6 24-6 34 0" stroke={PALETTE.mintDeep} strokeWidth="4" fill="none" />
            <ellipse cx="0" cy="14" rx="17" ry="6" fill="#c97c5d" stroke={LINE} strokeWidth={STROKE.hair} />
          </g>
        )}
        {look.accessory === "coins" && (
          <g transform="translate(34 104)">
            <circle cx="0" cy="0" r="11" fill="#f7d774" stroke="#d7a52a" strokeWidth={STROKE.fine} />
            <circle cx="14" cy="10" r="9" fill="#ffe6a0" stroke="#d7a52a" strokeWidth={STROKE.fine} />
            <circle cx="-8" cy="14" r="8" fill="#f7d774" stroke="#d7a52a" strokeWidth={STROKE.fine} />
          </g>
        )}
        {look.accessory === "stylus" && (
          <g transform="translate(26 92) rotate(-18)">
            <rect x="0" y="0" width="8" height="42" rx="4" fill="#6c5570" stroke={LINE} strokeWidth={STROKE.hair} />
            <rect x="0" y="0" width="8" height="12" rx="4" fill={PALETTE.blush} />
            <polygon points="0,42 8,42 4,52" fill={PALETTE.sky} stroke={LINE} strokeWidth={STROKE.hair} />
          </g>
        )}
        {look.accessory === "star" && (
          <g transform="translate(158 16)">
            <path
              d="M12 0l4 8 9 1-6.5 6.5L20 24l-8-4-8 4 1.5-8.5L-1 9l9-1z"
              fill={PALETTE.butter}
              stroke={LINE}
              strokeWidth={STROKE.fine}
              className={animated ? "anim-twinkle" : undefined}
            />
          </g>
        )}
        {look.accessory === "scarf" && (
          <g>
            <path
              d="M136 108c14 10 32 10 46-1l5 11c-17 12-39 12-55-1z"
              fill={PALETTE.lilacDeep}
              stroke={LINE}
              strokeWidth={STROKE.fine}
              strokeLinejoin="round"
            />
            <path d="M140 118c-4 8-4 16 0 22l10-3c-3-6-3-12 0-17z" fill={PALETTE.lilac} stroke={LINE} strokeWidth={STROKE.hair} strokeLinejoin="round" />
          </g>
        )}
        {(look.accessory === "sleep" || sleeping) && (
          <g fill={PALETTE.lilacDeep} className={animated ? "anim-float" : undefined}>
            <text x="198" y="46" fontSize="18" fontWeight="700" fontFamily="Baloo 2, sans-serif">
              z
            </text>
          </g>
        )}
      </g>

      {dramatic && (
        <g opacity="0.8" className={animated ? "anim-twinkle" : undefined}>
          <path d="M40 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill={PALETTE.butter} stroke={LINE} strokeWidth={STROKE.hair} />
        </g>
      )}
    </svg>
  )

  if (!onClick) return art
  return (
    <button
      type="button"
      aria-label={`${name} pony`}
      className="hit-area border-0 bg-transparent p-0 transition-transform duration-200 hover:-translate-y-1 active:scale-95"
      onClick={onClick}
    >
      {art}
    </button>
  )
}

function Leg({ x, body }: { x: number; body: string }) {
  return (
    <g>
      {/* stubby little leg with a soft hoof */}
      <path
        d={`M${x} 150c0-6 4-9 10-9s10 3 10 9v20c0 7-4 11-10 11s-10-4-10-11z`}
        fill={body}
        stroke={LINE}
        strokeWidth={STROKE.base}
        strokeLinejoin="round"
      />
      <path
        d={`M${x} 172c0 6 4 9 10 9s10-3 10-9z`}
        fill="#f0ddc9"
        stroke={LINE}
        strokeWidth={STROKE.hair}
        strokeLinejoin="round"
      />
    </g>
  )
}
