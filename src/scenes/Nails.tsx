import { useId, useMemo, useState } from "react"
import { useGame } from "../hooks/GameContext"
import type { CharmType, NailDesign, NailShape } from "../game/types"
import { GameButton, Panel, Pill } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const BASE_COLORS = ["#ff8fae", "#ef6b92", "#ffd45e", "#ffb48a", "#8fddb4", "#8fcbec", "#bfa9f0", "#fff6ee", "#5b4450"]
const TIP_COLORS = ["#ffffff", "#ffd45e", "#ff8fae", "#bfa9f0", "#8fcbec", "#8fddb4", null]
const SHAPES: NailShape[] = ["almond", "coffin", "square", "stiletto"]
const CHARMS: CharmType[] = ["gem", "bow", "star", "heart", "pearl", "chain", "flower", "fruit", "fish", "ufo"]

const GLITTER = [
  [26, 18],
  [62, 26],
  [40, 44],
  [72, 58],
  [22, 66],
  [54, 78],
  [80, 36],
  [34, 88],
] as const

type Finger = {
  i: number
  x: number
  y: number
  len: number
  w0: number
  w1: number
  rot: number
  nailW: number
}

/** flesh-only length to the fingertip; nails sit on top and stick out past it */
const FINGERS: Finger[] = [
  { i: 0, x: 142, y: 252, len: 74, w0: 26, w1: 19, rot: -36, nailW: 16 },
  { i: 1, x: 154, y: 198, len: 90, w0: 22, w1: 17, rot: -6, nailW: 15 },
  { i: 2, x: 178, y: 192, len: 102, w0: 24, w1: 18, rot: 0, nailW: 16 },
  { i: 3, x: 202, y: 198, len: 92, w0: 22, w1: 17, rot: 6, nailW: 15 },
  { i: 4, x: 224, y: 210, len: 70, w0: 19, w1: 15, rot: 14, nailW: 13 },
]

/** nail base sits this far back on the fingertip pad */
const NAIL_PAD = 10

function fingerCapsule(len: number, w0: number, w1: number) {
  const b = w0 / 2
  const t = w1 / 2
  const yTip = -len + w1 * 0.42
  const f = (v: number) => v.toFixed(1)
  return [
    `M ${f(-b)} 20`,
    `C ${f(-b)} ${f(-len * 0.28)} ${f(-t)} ${f(-len * 0.68)} ${f(-t)} ${f(yTip)}`,
    `A ${f(t)} ${f(t)} 0 0 1 ${f(t)} ${f(yTip)}`,
    `C ${f(t)} ${f(-len * 0.68)} ${f(b)} ${f(-len * 0.28)} ${f(b)} 20`,
    "Z",
  ].join(" ")
}

function thumbWorld(lx: number, ly: number) {
  const th = FINGERS[0]!
  const r = (th.rot * Math.PI) / 180
  const c = Math.cos(r)
  const s = Math.sin(r)
  return [th.x + lx * c - ly * s, th.y + lx * s + ly * c] as const
}

function pt(lx: number, ly: number) {
  const [x, y] = thumbWorld(lx, ly)
  return `${x.toFixed(1)} ${y.toFixed(1)}`
}

/** palm + thumb as one silhouette so the left edge cannot grow extra lumps */
function palmAndThumbPath() {
  const th = FINGERS[0]!
  const b = th.w0 / 2
  const t = th.w1 / 2
  const yTip = -th.len + th.w1 * 0.42
  const k = t * 0.55
  return [
    "M 156 304",
    "C 174 313 204 313 222 304",
    "C 234 296 242 274 243 250",
    "C 242 226 234 208 222 200",
    "C 210 193 198 187 184 185",
    "C 170 183 158 189 150 200",
    `C 143 214 139 226 ${pt(b * 0.75, -th.len * 0.22)}`,
    `C ${pt(t + 0.4, -th.len * 0.58)} ${pt(t, -th.len * 0.82)} ${pt(t, yTip)}`,
    `C ${pt(t, yTip - k)} ${pt(k, yTip - t)} ${pt(0, yTip - t)}`,
    `C ${pt(-k, yTip - t)} ${pt(-t, yTip - k)} ${pt(-t, yTip)}`,
    `C ${pt(-t - 0.4, -th.len * 0.58)} ${pt(-b, -th.len * 0.2)} ${pt(-b, 0)}`,
    "C 137 268 146 288 156 304",
    "Z",
  ].join(" ")
}

const DEFAULT_DESIGN: NailDesign = {
  length: 3,
  shape: "almond",
  baseColor: "#ff8fae",
  gradient: "#ffffff",
  glitter: true,
  chrome: false,
  charms: [],
}

export function Nails() {
  const { save, setNailDesign, notify, play, completeLevel, addStars } = useGame()
  const [design, setDesign] = useState<NailDesign>(save.nailDesign ?? DEFAULT_DESIGN)
  const [charm, setCharm] = useState<CharmType>("gem")
  const [history, setHistory] = useState<NailDesign[]>([])
  const [verdict, setVerdict] = useState<string | null>(null)

  const apply = (next: NailDesign) => {
    setHistory((h) => [...h.slice(-24), design])
    setDesign(next)
  }

  const placeCharm = (nailIndex: number, x: number, y: number) => {
    play("nail")
    apply({
      ...design,
      charms: [
        ...design.charms,
        { id: `c${design.charms.length}-${nailIndex}-${charm}-${Math.round(x)}-${Math.round(y)}`, nailIndex, x, y, type: charm },
      ],
    })
  }

  const removeCharm = (id: string) => {
    play("pop")
    apply({ ...design, charms: design.charms.filter((c) => c.id !== id) })
  }

  const density = design.charms.length + (design.glitter ? 2 : 0) + (design.chrome ? 2 : 0) + design.length
  const rating = useMemo(() => {
    if (density >= 22) return { stars: 5, text: "airport security has questions. correct answer: yes." }
    if (density >= 16) return { stars: 5, text: "maximum charm density achieved" }
    if (density >= 11) return { stars: 4, text: "dangerously sparkly. proceed." }
    if (density >= 7) return { stars: 3, text: "very sparkly, still room for crimes" }
    return { stars: 2, text: "sparkly (subtle is not available here)" }
  }, [density])

  return (
    <PageShell
      title="Nail Salon"
      area="nails"
      tint="linear-gradient(180deg,#fff2f7 0%,#ffe6f1 50%,#f7e8ff 100%)"
      subtitle="more charms = better · subtle is a myth"
      aside={<Pill className="bg-blush">{design.charms.length} charms</Pill>}
    >
      <div className="grid gap-3 lg:grid-cols-[1.05fr_1fr]">
        <Panel className="bg-white/90">
          <HandArt design={design} onPlace={placeCharm} onRemove={removeCharm} />
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Pill className="bg-butter">
              {"★".repeat(rating.stars)}
              {"☆".repeat(5 - rating.stars)}
            </Pill>
            <p className="font-hand text-sm text-ink-soft">{rating.text}</p>
          </div>
          <p className="mt-1 text-center font-hand text-xs text-ink-soft">
            tap a nail to drop a charm · tap a charm to take it off
          </p>
        </Panel>

        <Panel className="bg-white/90">
          <p className="mb-1 font-hand text-sm">base colour</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {BASE_COLORS.map((c) => (
              <Swatch key={c} color={c} active={design.baseColor === c} onClick={() => apply({ ...design, baseColor: c })} />
            ))}
          </div>

          <p className="mb-1 font-hand text-sm">tip / fade</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {TIP_COLORS.map((c, i) => (
              <Swatch
                key={c ?? `none-${i}`}
                color={c ?? "transparent"}
                active={design.gradient === c}
                label={c ? `tip ${c}` : "no fade"}
                onClick={() => apply({ ...design, gradient: c })}
              />
            ))}
          </div>

          <p className="mb-1 font-hand text-sm">shape</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {SHAPES.map((s) => (
              <GameButton key={s} size="sm" tone={design.shape === s ? "pink" : "cream"} onClick={() => apply({ ...design, shape: s })}>
                {s}
              </GameButton>
            ))}
          </div>

          <label className="mb-3 block font-hand text-sm">
            length · {design.length}
            <input
              type="range"
              min={1}
              max={6}
              value={design.length}
              aria-label="nail length"
              onChange={(e) => apply({ ...design, length: Number(e.target.value) })}
              className="mt-1 block w-full"
            />
          </label>

          <div className="mb-3 flex flex-wrap gap-2">
            <GameButton size="sm" tone={design.glitter ? "sun" : "cream"} onClick={() => apply({ ...design, glitter: !design.glitter })}>
              glitter {design.glitter ? "on" : "off"}
            </GameButton>
            <GameButton size="sm" tone={design.chrome ? "lilac" : "cream"} onClick={() => apply({ ...design, chrome: !design.chrome })}>
              chrome {design.chrome ? "on" : "off"}
            </GameButton>
          </div>

          <p className="mb-1 font-hand text-sm">charm to place</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {CHARMS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`${c} charm`}
                aria-pressed={charm === c}
                className={`hit-area flex flex-col items-center gap-0.5 rounded-2xl border-[1.5px] px-2.5 py-1.5 font-hand text-[0.68rem] transition-transform active:scale-95 ${
                  charm === c ? "border-ink/25 bg-blush" : "border-ink/10 bg-white"
                }`}
                onClick={() => {
                  setCharm(c)
                  play("click")
                }}
              >
                <svg width="20" height="20" viewBox="-10 -10 20 20" aria-hidden>
                  <CharmArt type={c} />
                </svg>
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <GameButton
              size="sm"
              disabled={history.length === 0}
              onClick={() => {
                const prev = history[history.length - 1]
                if (!prev) return
                setDesign(prev)
                setHistory((h) => h.slice(0, -1))
                play("click")
              }}
            >
              undo
            </GameButton>
            <GameButton
              size="sm"
              tone="sky"
              onClick={() => {
                const pickFrom = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)] as T
                apply({
                  length: 2 + Math.floor(Math.random() * 5),
                  shape: pickFrom(SHAPES),
                  baseColor: pickFrom(BASE_COLORS),
                  gradient: pickFrom(TIP_COLORS),
                  glitter: Math.random() > 0.2,
                  chrome: Math.random() > 0.6,
                  charms: Array.from({ length: 8 }, (_, i) => ({
                    id: `r${i}-${Date.now()}`,
                    nailIndex: i % 5,
                    x: 24 + Math.random() * 52,
                    y: 16 + Math.random() * 62,
                    type: pickFrom(CHARMS),
                  })),
                })
                play("sparkle")
              }}
            >
              surprise me
            </GameButton>
            <GameButton size="sm" tone="lilac" onClick={() => apply({ ...design, charms: [] })}>
              clear charms
            </GameButton>
            <GameButton
              size="sm"
              tone="mint"
              testid="save-nails"
              onClick={() => {
                setNailDesign(design)
                play("chime")
                setVerdict(rating.text)
                notify("nail design saved. it lives in your room now")
                if (design.charms.length >= 5) {
                  completeLevel("nails")
                  addStars(1)
                }
              }}
            >
              save design
            </GameButton>
          </div>

          {verdict && (
            <p className="mt-3 rounded-2xl border-[1.5px] border-mint-deep/50 bg-mint/60 p-2 text-center font-hand text-sm">
              salon verdict: {verdict}
            </p>
          )}
        </Panel>
      </div>
    </PageShell>
  )
}

function Swatch({
  color,
  active,
  onClick,
  label,
}: {
  color: string
  active: boolean
  onClick: () => void
  label?: string
}) {
  return (
    <button
      type="button"
      aria-label={label ?? `colour ${color}`}
      aria-pressed={active}
      className={`h-9 w-9 rounded-full border-[2.5px] transition-transform ${
        active ? "scale-110 border-ink shadow-[0_0_0_3px_rgba(255,255,255,0.9)]" : "border-ink/12"
      }`}
      style={{
        background: color === "transparent" ? "repeating-conic-gradient(#fff 0% 25%, #e8dce4 0% 50%) 50%/10px 10px" : color,
      }}
      onClick={onClick}
    />
  )
}

/* ---------- the hand ---------- */

function HandArt({
  design,
  onPlace,
  onRemove,
}: {
  design: NailDesign
  onPlace: (nail: number, x: number, y: number) => void
  onRemove: (id: string) => void
}) {
  const id = useId().replace(/[:]/g, "")
  const nailH = 30 + design.length * 7
  const skin = "#f0c8ae"

  return (
    <svg viewBox="0 0 320 340" className="mx-auto block w-full max-w-sm select-none" role="img" aria-label="hand with five nails">
      <defs>
        <linearGradient id={`${id}-polish`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={design.baseColor} />
          <stop offset={design.gradient ? "55%" : "100%"} stopColor={design.baseColor} />
          {design.gradient && <stop offset="100%" stopColor={design.gradient} />}
        </linearGradient>
        <linearGradient id={`${id}-chrome`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#d9c7ff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
        <filter id={`${id}-outline`} x="-20" y="-20" width="360" height="380" filterUnits="userSpaceOnUse">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1.85" result="dil" />
          <feFlood floodColor="#d4a38a" result="col" />
          <feComposite in="col" in2="dil" operator="in" result="line" />
          <feMerge>
            <feMergeNode in="line" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="186" cy="322" rx="48" ry="6" fill="#5b4450" opacity="0.1" />

      <g filter={`url(#${id}-outline)`} fill={skin}>
        {FINGERS.filter((f) => f.i !== 0)
          .slice()
          .reverse()
          .map((f) => (
            <g key={f.i} transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}>
              <path d={fingerCapsule(f.len, f.w0, f.w1)} />
            </g>
          ))}
        <path d={palmAndThumbPath()} />
      </g>

      {FINGERS.map((f) => renderFinger(f))}
    </svg>
  )

  function renderFinger(f: Finger) {
    const nailW = f.nailW
    const yPip = -f.len * 0.42
    const yDip = -f.len * 0.72
    const isThumb = f.i === 0
    const creaseW = f.w0 * 0.28
    return (
      <g key={f.i} transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}>
        <path
          d={`M${-creaseW} ${yPip} Q 0 ${yPip + 2.4} ${creaseW} ${yPip}`}
          stroke="#e0b39a"
          strokeWidth="1.2"
          fill="none"
          opacity="0.4"
        />
        {!isThumb && (
          <path
            d={`M${-creaseW * 0.75} ${yDip} Q 0 ${yDip + 1.8} ${creaseW * 0.75} ${yDip}`}
            stroke="#e0b39a"
            strokeWidth="1"
            fill="none"
            opacity="0.32"
          />
        )}
        <g transform={`translate(0 ${-f.len + NAIL_PAD})`}>
          <clipPath id={`${id}-clip-${f.i}`}>
            <path d={nailPath(design.shape, nailW, nailH)} />
          </clipPath>
          <path d={nailPath(design.shape, nailW + 1.8, nailH + 1.4)} fill="#e7b9a0" opacity="0.7" />
          <path
            d={nailPath(design.shape, nailW, nailH)}
            fill={`url(#${id}-polish)`}
            stroke="#b8867a"
            strokeWidth="1.15"
            className="cursor-pointer"
            onClick={(e) => {
              const ctm = e.currentTarget.getScreenCTM()
              if (!ctm) return
              const local = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
              const px = Math.max(12, Math.min(88, 50 + (local.x / nailW) * 100))
              const py = Math.max(10, Math.min(90, (-local.y / nailH) * 100))
              onPlace(f.i, px, py)
            }}
          />
          <g clipPath={`url(#${id}-clip-${f.i})`}>
            {design.chrome && <path d={nailPath(design.shape, nailW, nailH)} fill={`url(#${id}-chrome)`} />}
            {design.glitter &&
              GLITTER.map(([gx, gy], gi) => (
                <circle
                  key={`${gx}-${gy}`}
                  cx={(gx / 100 - 0.5) * nailW}
                  cy={-(gy / 100) * nailH}
                  r={gi % 3 === 0 ? 1.7 : 1.1}
                  fill="#fff"
                  opacity={gi % 2 ? 0.9 : 0.65}
                  className="anim-twinkle"
                  style={{ animationDelay: `${gi * 0.22}s` }}
                />
              ))}
            <ellipse cx={-nailW * 0.2} cy={-nailH * 0.7} rx={nailW * 0.16} ry={nailH * 0.16} fill="#fff" opacity="0.5" />
            <ellipse cx="0" cy={-1.5} rx={nailW * 0.26} ry={2.6} fill="#fff" opacity="0.32" />
          </g>
          {design.charms
            .filter((c) => c.nailIndex === f.i)
            .map((c) => (
              <g
                key={c.id}
                transform={`translate(${(c.x / 100 - 0.5) * nailW} ${-(c.y / 100) * nailH}) scale(${Math.min(1, nailW / 26)})`}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(c.id)
                }}
              >
                <CharmArt type={c.type} />
              </g>
            ))}
        </g>
      </g>
    )
  }
}

function nailPath(shape: NailShape, w: number, h: number) {
  const half = w / 2
  switch (shape) {
    case "square":
      return `M${-half} 0 L${-half} ${-h + 7} Q${-half} ${-h} ${-half + 7} ${-h} L${half - 7} ${-h} Q${half} ${-h} ${half} ${-h + 7} L${half} 0 Z`
    case "coffin":
      return `M${-half} 0 L${-w * 0.3} ${-h + 6} Q${-w * 0.3} ${-h} ${-w * 0.24} ${-h} L${w * 0.24} ${-h} Q${w * 0.3} ${-h} ${w * 0.3} ${-h + 6} L${half} 0 Z`
    case "stiletto":
      return `M${-half} 0 C${-half * 0.9} ${-h * 0.5} ${-w * 0.16} ${-h * 0.86} 0 ${-h} C${w * 0.16} ${-h * 0.86} ${half * 0.9} ${-h * 0.5} ${half} 0 Z`
    default:
      return `M${-half} 0 C${-half} ${-h * 0.56} ${-w * 0.36} ${-h} 0 ${-h} C${w * 0.36} ${-h} ${half} ${-h * 0.56} ${half} 0 Z`
  }
}

function CharmArt({ type }: { type: CharmType }) {
  const line = "#5b4450"
  switch (type) {
    case "gem":
      return (
        <g>
          <path d="M-5-3l3-3h4l3 3-5 7z" fill="#a8e4ff" stroke={line} strokeWidth="0.8" />
          <path d="M-5-3h10M-2-6l2 10M2-6l-2 10" stroke="#fff" strokeWidth="0.6" opacity="0.8" />
        </g>
      )
    case "bow":
      return (
        <g>
          <path d="M0 0c-4-4-8-2-7 2 1 3 5 3 7 0z" fill="#ff8fae" stroke={line} strokeWidth="0.7" />
          <path d="M0 0c4-4 8-2 7 2-1 3-5 3-7 0z" fill="#ff8fae" stroke={line} strokeWidth="0.7" />
          <circle cx="0" cy="1" r="1.6" fill="#ef6b92" stroke={line} strokeWidth="0.5" />
        </g>
      )
    case "star":
      return (
        <path
          d="M0-6l1.8 3.7 4 .6-2.9 2.8.7 4L0 3.2l-3.6 1.9.7-4L-5.8-1.7l4-.6z"
          fill="#ffd45e"
          stroke={line}
          strokeWidth="0.7"
        />
      )
    case "heart":
      return (
        <path d="M0 5C-4 2-6 0-6-2.2A2.7 2.7 0 0 1 0-3.4a2.7 2.7 0 0 1 6 1.2C6 0 4 2 0 5z" fill="#ff8fae" stroke={line} strokeWidth="0.7" />
      )
    case "pearl":
      return (
        <g>
          <circle cx="0" cy="0" r="3.4" fill="#fff6f8" stroke={line} strokeWidth="0.7" />
          <circle cx="-1.1" cy="-1.1" r="1" fill="#fff" />
        </g>
      )
    case "chain":
      return (
        <g fill="none" stroke="#e0ab2f" strokeWidth="1.2">
          <circle cx="-3.4" cy="0" r="2.4" />
          <circle cx="1" cy="0" r="2.4" />
          <circle cx="5.4" cy="0" r="2.4" />
        </g>
      )
    case "flower":
      return (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-3" rx="1.9" ry="2.8" fill="#fff" stroke={line} strokeWidth="0.6" transform={`rotate(${a})`} />
          ))}
          <circle cx="0" cy="0" r="1.6" fill="#ffd45e" />
        </g>
      )
    case "fruit":
      return (
        <g>
          <path d="M0 5c-3.4 0-5-2.6-5-5S-3 -4 0-4s5 1.6 5 4S3.4 5 0 5z" fill="#ef6b92" stroke={line} strokeWidth="0.7" />
          <path d="M0-4c0-2 1.6-3 3-3" stroke="#68bb87" strokeWidth="1.2" fill="none" />
          <circle cx="-1.6" cy="0" r="0.5" fill="#fff" />
          <circle cx="1.6" cy="1.6" r="0.5" fill="#fff" />
        </g>
      )
    case "fish":
      return (
        <g>
          <path d="M-5 0c0-2.6 2.4-4.4 5-4.4s4.6 1.8 4.6 4.4S2.6 4.4 0 4.4-5 2.6-5 0z" fill="#8fcbec" stroke={line} strokeWidth="0.7" />
          <path d="M4.6-2.6L8-4v8l-3.4-1.6z" fill="#8fcbec" stroke={line} strokeWidth="0.6" />
          <circle cx="-1.6" cy="-0.6" r="0.8" fill={line} />
        </g>
      )
    default:
      return (
        <g>
          <ellipse cx="0" cy="1" rx="6" ry="2.2" fill="#bfa9f0" stroke={line} strokeWidth="0.7" />
          <path d="M-3.4-0.6a3.4 3.4 0 0 1 6.8 0z" fill="#d7ecff" stroke={line} strokeWidth="0.6" />
          <circle cx="-4.4" cy="1.6" r="0.8" fill="#ffd45e" />
          <circle cx="4.4" cy="1.6" r="0.8" fill="#ff8fae" />
        </g>
      )
  }
}
