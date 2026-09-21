import { useEffect, useRef, useState } from "react"
import { Nikki } from "../art/Nikki"
import { useGame } from "../hooks/GameContext"
import { PageShell } from "../ui/PageShell"
import { Tag } from "../ui/Button"
import { pick } from "../lib/random"

const DREAMS = [
  "sleep level: expert",
  "five more minutes…",
  "professional nap enthusiast",
  "currently unavailable: eepy",
  "maximum cozy achieved",
  "important sleeping business",
]

type StarBit = { id: number; x: number; y: number }

export function Dreamland() {
  const { notify, play, completeLevel, patch, save, addStars, discoverSecret } = useGame()
  const [stars, setStars] = useState<StarBit[]>(() =>
    Array.from({ length: 10 }).map((_, i) => ({ id: i, x: 10 + (i * 17) % 80, y: 12 + (i * 13) % 70 })),
  )
  const [got, setGot] = useState(save.dreamStars)
  const drift = useRef(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      drift.current += 0.004
      setY(Math.sin(drift.current) * 10)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const catchStar = (id: number) => {
    setStars((s) => s.filter((x) => x.id !== id))
    const next = got + 1
    setGot(next)
    patch((s) => ({ ...s, dreamStars: Math.max(s.dreamStars, next) }))
    play("sparkle")
    notify(pick(DREAMS))
    if (next >= 8 && !save.completedLevels.includes("dreamland")) {
      completeLevel("dreamland")
      addStars(1)
    }
  }

  return (
    <PageShell title="Dreamland" area="dreamland" tint="#1c1a33" night>
      <Tag className="bg-white/90 text-ink">collect dream stars. no rush. ever.</Tag>
      <div className="relative mx-auto min-h-[380px] max-w-lg overflow-hidden rounded-[1.8rem] bg-linear-to-b from-[#1c1a33] to-[#3d3a68]" style={{ transform: `translateY(${y}px)` }}>
        <div className="absolute top-8 right-10 h-20 w-20 rounded-full bg-butter/90" />
        {stars.map((s) => (
          <button
            key={s.id}
            type="button"
            className="absolute min-h-11 min-w-11 border-0 bg-transparent text-2xl"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            aria-label="dream star"
            onClick={() => catchStar(s.id)}
          >
            ⭐
          </button>
        ))}
        <div className="absolute bottom-6 left-[8%] rounded-3xl bg-white/30 px-6 py-4">☁️</div>
        <div className="absolute bottom-10 right-[10%]">
          <Nikki pose="sleep" size={110} />
        </div>
        <button
          type="button"
          className="absolute bottom-4 left-4 min-h-11 border-0 bg-transparent text-lg"
          aria-label="tiny hidden gift"
          onClick={() => {
            play("chime")
            discoverSecret("santa-key", "a ridiculous gift. do not open near Mr Alien.")
          }}
        >
          🎁
        </button>
        <p className="absolute left-4 top-4 font-hand text-cream">stars {got}</p>
      </div>
      {got >= 8 && <p className="mt-3 text-center font-hand text-cream">Professional Sleeper energy unlocked</p>}
    </PageShell>
  )
}
