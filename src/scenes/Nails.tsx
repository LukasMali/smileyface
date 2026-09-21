import { useState } from "react"
import { useGame } from "../hooks/GameContext"
import type { CharmType, NailDesign, NailShape } from "../game/types"
import { GameButton, Panel, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const COLORS = ["#ff8fab", "#c4b0ea", "#8ecae6", "#fff3c4", "#2a2430", "#fff", "#f4d35e", "#8fd9b0"]
const SHAPES: NailShape[] = ["almond", "coffin", "square", "stiletto"]
const CHARMS: CharmType[] = ["gem", "bow", "star", "heart", "pearl", "chain", "flower", "fruit", "fish", "ufo"]
const GLYPH: Record<CharmType, string> = {
  gem: "💎",
  bow: "🎀",
  star: "⭐",
  heart: "♡",
  pearl: "•",
  chain: "⛓",
  flower: "✿",
  fruit: "🍓",
  fish: "🐟",
  ufo: "👽",
}

export function Nails() {
  const { save, setNailDesign, notify, play, completeLevel } = useGame()
  const [design, setDesign] = useState<NailDesign>(
    save.nailDesign ?? {
      length: 3,
      shape: "almond",
      baseColor: "#ff8fab",
      gradient: "#c4b0ea",
      glitter: true,
      chrome: false,
      charms: [],
    },
  )
  const [active, setActive] = useState(2)
  const [history, setHistory] = useState<NailDesign[]>([])

  const apply = (next: NailDesign) => {
    setHistory((h) => [...h.slice(-20), design])
    setDesign(next)
  }

  const addCharm = (type: CharmType) => {
    play("nail")
    const n = design.charms.length
    apply({
      ...design,
      charms: [
        ...design.charms,
        {
          id: `ch-${n}-${active}-${type}`,
          nailIndex: active,
          x: 16 + (n % 4) * 18,
          y: 14 + (n % 5) * 12,
          type,
        },
      ],
    })
  }

  const rating = () => {
    const n = design.charms.length + (design.glitter ? 2 : 0) + (design.chrome ? 1 : 0)
    if (n >= 14) return "maximum charm density"
    if (n >= 10) return "airport security concern"
    if (n >= 6) return "dangerously sparkly"
    if (n >= 2) return "sparkly"
    return "sparkly" // subtle is impossible
  }

  return (
    <PageShell title="Nail Salon" area="nails" tint="#ffe4f0">
      <Tag>more charms = better · subtle is a myth</Tag>
      <Panel className="mx-auto max-w-lg">
        <div className="flex items-end justify-center gap-1 py-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`nail ${i + 1}`}
              className={`relative h-28 w-10 rounded-b-md rounded-t-[1.2rem] border-2 ${active === i ? "border-ink" : "border-ink/20"}`}
              style={{
                height: `${72 + design.length * 10}px`,
                background: design.chrome
                  ? `linear-gradient(180deg,#fff,${design.baseColor})`
                  : design.gradient
                    ? `linear-gradient(180deg,${design.baseColor},${design.gradient})`
                    : design.baseColor,
                borderRadius: design.shape === "square" ? "6px 6px 4px 4px" : design.shape === "coffin" ? "8px 8px 2px 2px" : "18px 18px 6px 6px",
              }}
              onClick={() => setActive(i)}
            >
              {design.glitter && <span className="absolute inset-0 opacity-70">✨</span>}
              {design.charms
                .filter((c) => c.nailIndex === i)
                .map((c) => (
                  <span key={c.id} className="absolute text-[10px]" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                    {GLYPH[c.type]}
                  </span>
                ))}
            </button>
          ))}
        </div>
        <p className="text-center font-hand">{rating()}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c} type="button" className="h-8 w-8 rounded-full border border-ink/10" style={{ background: c }} onClick={() => apply({ ...design, baseColor: c })} aria-label={c} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {SHAPES.map((s) => (
            <GameButton key={s} tone={design.shape === s ? "mint" : "cream"} onClick={() => apply({ ...design, shape: s })}>
              {s}
            </GameButton>
          ))}
        </div>
        <label className="mt-2 block font-hand text-sm">
          length
          <input type="range" min={1} max={6} value={design.length} onChange={(e) => apply({ ...design, length: Number(e.target.value) })} className="block w-full" />
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <GameButton onClick={() => apply({ ...design, glitter: !design.glitter })}>glitter</GameButton>
          <GameButton onClick={() => apply({ ...design, chrome: !design.chrome })}>chrome</GameButton>
          {CHARMS.map((c) => (
            <GameButton key={c} onClick={() => addCharm(c)}>
              {GLYPH[c]}
            </GameButton>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <GameButton
            onClick={() => {
              const prev = history[history.length - 1]
              if (prev) {
                setDesign(prev)
                setHistory((h) => h.slice(0, -1))
              }
            }}
          >
            undo
          </GameButton>
          <GameButton
            onClick={() => {
              apply({
                ...design,
                baseColor: COLORS[design.charms.length % COLORS.length] as string,
                glitter: true,
                charms: CHARMS.slice(0, 6).map((type, i) => ({
                  id: `r-${i}-${type}`,
                  nailIndex: i % 5,
                  x: 30,
                  y: 20 + i * 8,
                  type,
                })),
              })
            }}
          >
            randomize
          </GameButton>
          <GameButton tone="pink" onClick={() => apply({ ...design, charms: [] })}>
            clear charms
          </GameButton>
          <GameButton
            tone="mint"
            testid="save-nails"
            onClick={() => {
              setNailDesign(design)
              play("chime")
              notify("nail design saved forever (on this tiny planet)")
              if (design.charms.length >= 5) completeLevel("nails")
            }}
          >
            save design
          </GameButton>
        </div>
      </Panel>
    </PageShell>
  )
}
