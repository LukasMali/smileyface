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
  curve: number
}

/** knuckle origin; 0 is the thumb, sitting on the side of the palm rather than as a sixth finger */
const FINGERS: Finger[] = [
  { i: 0, x: 126, y: 250, len: 100, w0: 30, w1: 24, rot: -34, nailW: 21, curve: -2 },
  { i: 1, x: 154, y: 198, len: 118, w0: 38, w1: 24, rot: -3, nailW: 22, curve: -1 },
  { i: 2, x: 184, y: 192, len: 130, w0: 40, w1: 25, rot: 1, nailW: 24, curve: 0 },
  { i: 3, x: 214, y: 198, len: 120, w0: 38, w1: 24, rot: 5, nailW: 22, curve: 2 },
  { i: 4, x: 240, y: 210, len: 94, w0: 32, w1: 19, rot: 12, nailW: 17, curve: 3 },
]

/** how far the nail bed sits back from the fingertip */
const NAIL_PAD = 17

function fingerPath(len: number, w0: number, w1: number, curve: number) {
  const b = w0 / 2
  const t = w1 / 2
  const pip = w0 * 0.46
  const dip = w0 * 0.28 + w1 * 0.22
  const c = curve
  const yPip = -len * 0.4
  const yDip = -len * 0.69
  const yTip = -len
  const n = (v: number) => v.toFixed(1)
  return [
    `M ${n(-b)} 22`,
    `C ${n(-b)} ${n(-len * 0.12)} ${n(-pip + c * 0.2)} ${n(yPip + 10)} ${n(-pip + c * 0.28)} ${n(yPip)}`,
    `C ${n(-dip + c * 0.5)} ${n(yDip + 8)} ${n(-t + c * 0.82)} ${n(yTip + t + 10)} ${n(-t + c)} ${n(yTip + t * 0.88)}`,
    `A ${n(t)} ${n(t * 0.96)} 0 0 1 ${n(t + c)} ${n(yTip + t * 0.88)}`,
    `C ${n(t + c * 0.82)} ${n(yTip + t + 10)} ${n(dip + c * 0.5)} ${n(yDip + 8)} ${n(pip + c * 0.28)} ${n(yPip)}`,
    `C ${n(pip + c * 0.2)} ${n(yPip + 10)} ${n(b)} ${n(-len * 0.12)} ${n(b)} 22`,
    "Z",
  ].join(" ")
}

function palmPath() {
  return [
    "M 142 194",
    "C 134 182 158 174 182 172",
    "C 208 170 234 176 254 190",
    "C 270 202 278 222 276 246",
    "C 274 272 262 300 236 314",
    "C 216 324 176 326 156 314",
    "C 134 300 114 276 110 250",
    "C 108 226 120 202 142 194",
    "Z",
  ].join(" ")
}

/** two-segment thumb that flares into the thenar instead of sitting on as a stick */
function thumbPath(len: number, w0: number, w1: number) {
  const t = w1 / 2
  const n = (v: number) => v.toFixed(1)
  return [
    `M ${n(-w0 * 0.55)} 36`,
    `C ${n(-w0 * 0.58)} ${n(-len * 0.12)} ${n(-t - 1)} ${n(-len * 0.52)} ${n(-t)} ${n(-len + t)}`,
    `A ${n(t)} ${n(t * 0.95)} 0 0 1 ${n(t)} ${n(-len + t * 0.9)}`,
    `C ${n(t + 2)} ${n(-len * 0.55)} ${n(w0 * 0.35)} ${n(-len * 0.2)} ${n(w0 * 0.95)} 12`,
    `C ${n(w0 * 0.45)} 34 ${n(4)} 42 ${n(-w0 * 0.2)} 38`,
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
  const skin = `url(#${id}-skin)`

  return (
    <svg viewBox="0 0 320 348" className="mx-auto block w-full max-w-sm select-none" role="img" aria-label="hand with five nails">
      <defs>
        <radialGradient id={`${id}-skin`} cx="0.38" cy="0.3" r="0.78">
          <stop offset="0%" stopColor="#ffe9da" />
          <stop offset="52%" stopColor="#f6d0b8" />
          <stop offset="100%" stopColor="#e2b395" />
        </radialGradient>
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
        <filter id={`${id}-outline`} x="-24" y="-24" width="368" height="396" filterUnits="userSpaceOnUse">
          <feMorphology in="SourceAlpha" operator="dilate" radius="2.05" result="dil" />
          <feFlood floodColor="#d4a38a" result="col" />
          <feComposite in="col" in2="dil" operator="in" result="line" />
          <feMerge>
            <feMergeNode in="line" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="176" cy="332" rx="70" ry="8" fill="#5b4450" opacity="0.12" />

      <g filter={`url(#${id}-outline)`}>
        {FINGERS.filter((f) => f.i !== 0)
          .slice()
          .reverse()
          .map((f) => (
            <g key={f.i} transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}>
              <path d={fingerPath(f.len, f.w0, f.w1, f.curve)} fill={skin} />
            </g>
          ))}
        <path d={palmPath()} fill={skin} />
        <path
          d="M136 208
             C122 224 114 240 118 256
             C136 248 154 226 160 204
             C150 198 142 202 136 208Z"
          fill={skin}
        />
        <g transform={`translate(${FINGERS[0]!.x} ${FINGERS[0]!.y}) rotate(${FINGERS[0]!.rot})`}>
          <path d={thumbPath(FINGERS[0]!.len, FINGERS[0]!.w0, FINGERS[0]!.w1)} fill={skin} />
        </g>
      </g>

      <ellipse cx="160" cy="230" rx="18" ry="11" fill="#fff" opacity="0.22" />
      {[152, 180, 208, 232].map((x, i) => (
        <ellipse key={x} cx={x} cy={204} rx={7.5 - i * 0.35} ry={4.8} fill="#fff" opacity="0.18" />
      ))}

      {FINGERS.map((f) => renderFinger(f))}
    </svg>
  )

  function renderFinger(f: Finger) {
    const nailW = f.nailW
    const yPip = -f.len * 0.4
    const yDip = -f.len * 0.69
    const wPip = f.w0 * 0.82
    const wDip = f.w0 * 0.42 + f.w1 * 0.4
    const isThumb = f.i === 0
    return (
      <g key={f.i} transform={`translate(${f.x} ${f.y}) rotate(${f.rot})`}>
        <path
          d={`M${-wPip * 0.42} ${yPip} Q0 ${yPip + 3.4} ${wPip * 0.42} ${yPip}`}
          stroke="#e0b39a"
          strokeWidth="1.55"
          fill="none"
          opacity="0.5"
        />
        <path
          d={`M${-wPip * 0.3} ${yPip + 4.6} Q0 ${yPip + 6.8} ${wPip * 0.3} ${yPip + 4.6}`}
          stroke="#e0b39a"
          strokeWidth="1.15"
          fill="none"
          opacity="0.28"
        />
        {!isThumb && (
          <path
            d={`M${-wDip * 0.38} ${yDip} Q0 ${yDip + 2.8} ${wDip * 0.38} ${yDip}`}
            stroke="#e0b39a"
            strokeWidth="1.35"
            fill="none"
            opacity="0.42"
          />
        )}
        <path
          d={`M${-f.w0 * 0.28} 2 C ${-f.w1 * 0.2} ${-f.len * 0.42} ${-f.w1 * 0.16} ${-f.len * 0.82} ${-f.w1 * 0.08} ${-f.len + 12}`}
          stroke="#fff"
          strokeWidth="2.8"
          opacity="0.24"
          fill="none"
          strokeLinecap="round"
        />
        <g transform={`translate(${f.curve * 0.4} ${-f.len + NAIL_PAD})`}>
          <clipPath id={`${id}-clip-${f.i}`}>
            <path d={nailPath(design.shape, nailW, nailH)} />
          </clipPath>
          <path d={nailPath(design.shape, nailW + 3.2, nailH + 2.4)} fill="#e7b9a0" opacity="0.8" />
          <path
            d={nailPath(design.shape, nailW, nailH)}
            fill={`url(#${id}-polish)`}
            stroke="#b8867a"
            strokeWidth="1.2"
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
            <ellipse cx="0" cy={-2} rx={nailW * 0.28} ry={3.2} fill="#fff" opacity="0.35" />
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
