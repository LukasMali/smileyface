import { useId } from "react"
import { LINE, STROKE } from "./tokens"

export type NikkiPose = "sit" | "stand" | "walk" | "sleep" | "stretch" | "spin" | "nurse"

const COAT_LIGHT = "#5a4652"
const COAT = "#3a2c37"
const COAT_DARK = "#241a24"
const CREAM = "#fff4e6"
const CREAM_DEEP = "#e8cdae"
const TAN = "#d9a86f"
const EYE = "#2a2029"

/** deterministic 0..1 jitter so the fur looks hand-drawn instead of perfectly repeating */
function jitter(i: number, seed: number) {
  const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return v - Math.floor(v)
}

/**
 * One continuous scalloped outline: an ellipse whose edge bulges into soft fur lobes.
 * Single path, so there are no seams or inner strokes to give away how it is built.
 */
function furPath(cx: number, cy: number, rx: number, ry: number, lobes: number, bulge: number, seed: number) {
  const pt = (a: number, k = 1) => [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] as const
  let d = ""
  for (let i = 0; i < lobes; i++) {
    const a0 = (i / lobes) * Math.PI * 2
    const a1 = ((i + 1) / lobes) * Math.PI * 2
    const mid = (a0 + a1) / 2
    const out = 1 + bulge * (0.55 + jitter(i, seed) * 0.9)
    const [x0, y0] = pt(a0)
    const [cxp, cyp] = pt(mid, out + 0.06)
    const [x1, y1] = pt(a1)
    d += i === 0 ? `M${x0.toFixed(1)} ${y0.toFixed(1)}` : ""
    d += `Q${cxp.toFixed(1)} ${cyp.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`
  }
  return `${d}Z`
}

function FurBlob({
  cx,
  cy,
  rx,
  ry,
  lobes = 13,
  bulge = 0.14,
  seed = 1,
  fill,
  stroke = true,
}: {
  cx: number
  cy: number
  rx: number
  ry: number
  lobes?: number
  bulge?: number
  seed?: number
  fill: string
  stroke?: boolean
}) {
  return (
    <path
      d={furPath(cx, cy, rx, ry, lobes, bulge, seed)}
      fill={fill}
      stroke={stroke ? LINE : "none"}
      strokeWidth={STROKE.thick}
      strokeLinejoin="round"
    />
  )
}

export function Nikki({
  pose = "sit",
  size = 140,
  className = "",
  harness = true,
  animated = true,
}: {
  pose?: NikkiPose
  size?: number
  className?: string
  harness?: boolean
  animated?: boolean
}) {
  const id = useId().replace(/[:]/g, "")
  const sleeping = pose === "sleep"

  return (
    <svg
      width={sleeping ? size * 1.3 : size}
      height={sleeping ? size * 0.86 : size}
      viewBox={sleeping ? "0 0 260 172" : "0 0 200 200"}
      className={`art-soft ${className}`}
      role="img"
      aria-label="Nikki, a very small fluffy dog"
    >
      <defs>
        <linearGradient id={`${id}-coat`} x1="0.25" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor={COAT_LIGHT} />
          <stop offset="52%" stopColor={COAT} />
          <stop offset="100%" stopColor={COAT_DARK} />
        </linearGradient>
        <linearGradient id={`${id}-cream`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#fffaf3" />
          <stop offset="65%" stopColor={CREAM} />
          <stop offset="100%" stopColor={CREAM_DEEP} />
        </linearGradient>
        <linearGradient id={`${id}-harness`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb3c8" />
          <stop offset="100%" stopColor="#f4849f" />
        </linearGradient>
        <radialGradient id={`${id}-eye`} cx="0.34" cy="0.28" r="0.85">
          <stop offset="0%" stopColor="#6d5462" />
          <stop offset="55%" stopColor={EYE} />
          <stop offset="100%" stopColor="#140f14" />
        </radialGradient>
      </defs>
      {sleeping ? (
        <SleepingNikki id={id} harness={harness} animated={animated} />
      ) : (
        <AwakeNikki id={id} pose={pose} harness={harness} animated={animated} />
      )}
    </svg>
  )
}

function AwakeNikki({
  id,
  pose,
  harness,
  animated,
}: {
  id: string
  pose: NikkiPose
  harness: boolean
  animated: boolean
}) {
  const coat = `url(#${id}-coat)`
  const cream = `url(#${id}-cream)`
  const stretching = pose === "stretch"
  const wag = animated && !stretching
  const lean = stretching ? "rotate(-11 100 150)" : pose === "spin" ? "rotate(7 100 120)" : undefined

  return (
    <g>
      <ellipse cx="100" cy="188" rx="58" ry="8" fill="#5b4450" opacity="0.15" />

      {/* fluffy plume tail, sweeping up behind her */}
      <g className={wag ? "anim-tail" : undefined} style={{ transformOrigin: "68px 152px" }}>
        <path
          d="M68 152c-16-2-30-12-36-26-5-13 1-26 10-25 10 1 13 15 14 26 1 10 7 19 12 25z"
          fill={coat}
          stroke={LINE}
          strokeWidth={STROKE.thick}
          strokeLinejoin="round"
        />
        <path d="M40 106c1 11 4 22 10 31" stroke={COAT_LIGHT} strokeWidth="2.2" fill="none" opacity="0.5" strokeLinecap="round" />
      </g>

      <g className={animated ? "anim-breathe" : undefined} transform={lean} style={{ transformOrigin: "100px 150px" }}>
        {/* body */}
        <FurBlob
          cx={100}
          cy={stretching ? 154 : 148}
          rx={stretching ? 40 : 38}
          ry={stretching ? 26 : 30}
          lobes={13}
          bulge={0.11}
          seed={3}
          fill={coat}
        />
        {/* cream chest bib */}
        <path d="M100 122c14 0 23 11 23 24 0 12-10 20-23 20s-23-8-23-20c0-13 9-24 23-24z" fill={cream} />
        <path d="M84 133c8-6 24-6 32 0" stroke="#fff" strokeWidth="2" opacity="0.6" fill="none" />

        {/* little cream front paws — stretch reaches them a bit farther forward */}
        <g className={pose === "walk" && animated ? "anim-bob" : undefined}>
          <ellipse
            cx={stretching ? 76 : 85}
            cy={stretching ? 182 : 176}
            rx={stretching ? 15 : 12}
            ry={stretching ? 8 : 9}
            fill={cream}
            stroke={LINE}
            strokeWidth={STROKE.base}
          />
          <ellipse
            cx={stretching ? 122 : 115}
            cy={stretching ? 182 : 176}
            rx={stretching ? 15 : 12}
            ry={stretching ? 8 : 9}
            fill={cream}
            stroke={LINE}
            strokeWidth={STROKE.base}
          />
          <path
            d={stretching ? "M70 182h12M116 182h12" : "M80 176h10M110 176h10"}
            stroke={CREAM_DEEP}
            strokeWidth={STROKE.hair}
          />
        </g>

        {harness && (
          <g>
            <path d="M76 136c15 11 33 11 48 0" stroke={`url(#${id}-harness)`} strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M78 134c14 10 31 10 44 0" stroke="#fff" strokeWidth="1.3" fill="none" opacity="0.6" />
            <circle cx="100" cy="146" r="5.6" fill="#fff" stroke="#f4849f" strokeWidth={STROKE.fine} />
            <path d="M100 143.4v5.2M97.4 146h5.2" stroke="#f4849f" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}

        {/* head */}
        <g transform={stretching ? "translate(0 8)" : undefined}>
          {/* ears, fluffy and slightly back like the real dog */}
          <g className={animated ? "anim-ear" : undefined} style={{ transformOrigin: "66px 52px" }}>
            <path d="M72 58C60 42 52 22 58 16c7-6 22 6 30 26z" fill={coat} stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
            <path d="M71 50c-6-11-9-20-6-23 4-3 11 5 15 16z" fill="#8f6f78" opacity="0.5" />
            <path d="M60 22c2 8 6 16 10 21" stroke={COAT_LIGHT} strokeWidth={STROKE.hair} fill="none" opacity="0.6" />
          </g>
          <g className={animated ? "anim-ear" : undefined} style={{ transformOrigin: "134px 52px", animationDelay: "0.55s" }}>
            <path d="M128 58c12-16 20-36 14-42-7-6-22 6-30 26z" fill={coat} stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
            <path d="M129 50c6-11 9-20 6-23-4-3-11 5-15 16z" fill="#8f6f78" opacity="0.5" />
          </g>

          <FurBlob cx={100} cy={84} rx={40} ry={36} lobes={15} bulge={0.1} seed={7} fill={coat} />
          <path d="M68 66c8-12 22-18 32-18" stroke={COAT_LIGHT} strokeWidth="3.4" fill="none" opacity="0.45" strokeLinecap="round" />

          {/* cream muzzle + cheek patches */}
          <path
            d="M100 74c17 0 29 10 29 23 0 15-13 24-29 24s-29-9-29-24c0-13 12-23 29-23z"
            fill={cream}
          />
          <path d="M74 88c8-6 18-9 26-9s18 3 26 9" stroke="#fff" strokeWidth="1.6" opacity="0.5" fill="none" />

          {/* tan eyebrow dots — her signature */}
          <ellipse cx="81" cy="66" rx="8" ry="5.2" fill={TAN} opacity="0.9" />
          <ellipse cx="119" cy="66" rx="8" ry="5.2" fill={TAN} opacity="0.9" />

          {/* big eyes */}
          <ellipse cx="82" cy="82" rx="10.6" ry="11.2" fill={`url(#${id}-eye)`} />
          <ellipse cx="118" cy="82" rx="10.6" ry="11.2" fill={`url(#${id}-eye)`} />
          <ellipse cx="78.4" cy="77.8" rx="3.6" ry="4" fill="#fff" opacity="0.95" />
          <ellipse cx="114.4" cy="77.8" rx="3.6" ry="4" fill="#fff" opacity="0.95" />
          <circle cx="86.4" cy="87" r="1.7" fill="#fff" opacity="0.55" />
          <circle cx="122.4" cy="87" r="1.7" fill="#fff" opacity="0.55" />
          {animated && (
            <>
              <ellipse className="anim-blink" cx="82" cy="82" rx="11.6" ry="12" fill={coat} style={{ transformOrigin: "82px 75px" }} />
              <ellipse className="anim-blink" cx="118" cy="82" rx="11.6" ry="12" fill={coat} style={{ transformOrigin: "118px 75px" }} />
            </>
          )}

          {/* nose, mouth, freckles */}
          <path d="M100 94c5.4 0 8.6 3 8.6 6.2 0 3.4-4 5.4-8.6 5.4s-8.6-2-8.6-5.4c0-3.2 3.2-6.2 8.6-6.2z" fill="#241c26" />
          <ellipse cx="96.6" cy="97.4" rx="2.1" ry="1.3" fill="#fff" opacity="0.45" />
          <path d="M100 106.5v3.5" stroke="#241c26" strokeWidth={STROKE.fine} strokeLinecap="round" />
          <path
            d={stretching ? "M100 110c-4 5-10 5-13 1M100 110c4 5 10 5 13 1" : "M100 110c-3 4-8 4-11 1M100 110c3 4 8 4 11 1"}
            stroke="#241c26"
            strokeWidth={STROKE.fine}
            fill="none"
            strokeLinecap="round"
          />
          <g fill="#c8a184" opacity="0.55">
            <circle cx="88" cy="103" r="1.1" />
            <circle cx="92" cy="108" r="1" />
            <circle cx="112" cy="103" r="1.1" />
            <circle cx="108" cy="108" r="1" />
          </g>
          <circle cx="72" cy="98" r="7.5" fill="#ff9db5" opacity="0.32" />
          <circle cx="128" cy="98" r="7.5" fill="#ff9db5" opacity="0.32" />
          <g stroke={CREAM_DEEP} strokeWidth={STROKE.hair} opacity="0.85" fill="none">
            <path d="M74 100c-5 2-9 1-12-2" />
            <path d="M126 100c5 2 9 1 12-2" />
          </g>

          {pose === "nurse" && (
            <g>
              <path d="M74 40h52a6 6 0 0 1 6 6v8H68v-8a6 6 0 0 1 6-6z" fill="#fff" stroke={LINE} strokeWidth={STROKE.fine} />
              <rect x="94" y="40" width="12" height="14" rx="3" fill="#ff8fae" />
              <rect x="89" y="45" width="22" height="4" rx="2" fill="#ff8fae" />
            </g>
          )}
        </g>
      </g>

      {pose === "spin" && (
        <path d="M42 170c22 10 94 10 116 0" stroke="#ff9db5" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5" />
      )}
    </g>
  )
}

function SleepingNikki({ id, harness, animated }: { id: string; harness: boolean; animated: boolean }) {
  const coat = `url(#${id}-coat)`
  const cream = `url(#${id}-cream)`
  return (
    <g>
      <ellipse cx="134" cy="152" rx="92" ry="11" fill="#5b4450" opacity="0.14" />
      <g className={animated ? "anim-breathe" : undefined} style={{ transformOrigin: "134px 120px" }}>
        {/* curled fluffy body */}
        <FurBlob cx={140} cy={104} rx={62} ry={38} lobes={16} bulge={0.09} seed={4} fill={coat} />
        <path d="M96 84c26-16 66-18 96-6" stroke={COAT_LIGHT} strokeWidth="3.4" fill="none" opacity="0.45" strokeLinecap="round" />
        {harness && <path d="M128 82c22 11 46 11 66 1" stroke={`url(#${id}-harness)`} strokeWidth="8" fill="none" strokeLinecap="round" />}

        {/* tucked tail */}
        <FurBlob cx={200} cy={122} rx={18} ry={13} lobes={9} bulge={0.14} seed={9} fill={coat} />

        {/* head resting on paws */}
        <g>
          <path d="M66 64C56 48 54 30 60 26c7-4 20 8 26 24z" fill={coat} stroke={LINE} strokeWidth={STROKE.base} strokeLinejoin="round" />
          <path d="M66 58c-6-10-8-17-5-20 4-2 10 6 14 16z" fill="#8f6f78" opacity="0.5" />
          <FurBlob cx={68} cy={98} rx={33} ry={29} lobes={14} bulge={0.11} seed={6} fill={coat} />
          <path d="M62 90c15 0 26 8 26 20s-11 19-26 19c-13 0-22-7-22-19s9-20 22-20z" fill={cream} />
          <ellipse cx="54" cy="84" rx="6.4" ry="4.2" fill={TAN} opacity="0.85" />
          <ellipse cx="80" cy="84" rx="6.4" ry="4.2" fill={TAN} opacity="0.85" />
          <path d="M45 96c5 5 12 5 17 0" stroke="#241c26" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M73 95c4 4 10 4 14 0" stroke="#241c26" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M50 110c4.6 0 7.4 2.6 7.4 5.2 0 2.8-3.4 4.4-7.4 4.4s-7-1.6-7-4.4c0-2.6 2.6-5.2 7-5.2z" fill="#241c26" />
          <circle cx="36" cy="106" r="6.4" fill="#ff9db5" opacity="0.3" />
          <circle cx="80" cy="106" r="6.4" fill="#ff9db5" opacity="0.3" />
          {/* front paw pillow */}
          <ellipse cx="92" cy="130" rx="15" ry="9" fill={cream} stroke={LINE} strokeWidth={STROKE.base} />
        </g>
      </g>
      <g className={animated ? "anim-float" : undefined} fill="#a48ed6">
        <text x="112" y="44" fontFamily="Baloo 2, Nunito, sans-serif" fontSize="22" fontWeight="700">
          z
        </text>
        <text x="136" y="24" fontFamily="Baloo 2, Nunito, sans-serif" fontSize="15" fontWeight="700" opacity="0.8">
          z
        </text>
      </g>
    </g>
  )
}

export function NikkiButton({
  pose,
  size,
  label,
  onPet,
  className = "",
}: {
  pose?: NikkiPose
  size?: number
  label: string
  onPet: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      className={`hit-area border-0 bg-transparent p-0 transition-transform active:scale-95 ${className}`}
      aria-label={label}
      onClick={onPet}
    >
      <Nikki pose={pose} size={size} />
    </button>
  )
}
