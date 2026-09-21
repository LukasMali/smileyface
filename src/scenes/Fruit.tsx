import { useEffect, useRef, useState } from "react"
import { CactusIceCream } from "../components/characters/CactusIceCream"
import { useGame } from "../hooks/GameContext"
import { rand } from "../lib/random"
import { GameButton, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const KINDS = ["🍓", "🍉", "🍇", "🍑", "🍒", "🫐", "🍊", "🍎", "🥝"] as const

type Drop = { id: number; x: number; y: number; kind: (typeof KINDS)[number]; vy: number }

export function Fruit() {
  const { notify, play, patch, save, completeLevel, highScore, discoverSecret, addCoins } = useGame()
  const [drops, setDrops] = useState<Drop[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [on, setOn] = useState(true)
  const id = useRef(0)
  const comboRef = useRef(0)

  useEffect(() => {
    if (!on) return
    const spawn = window.setInterval(() => {
      setDrops((d) => [
        ...d.slice(-18),
        { id: ++id.current, x: rand(8, 86), y: -8, kind: KINDS[Math.floor(Math.random() * KINDS.length)] as (typeof KINDS)[number], vy: rand(0.45, 1.1) },
      ])
    }, 700)
    let raf = 0
    const tick = () => {
      setDrops((d) => d.map((f) => ({ ...f, y: f.y + f.vy })).filter((f) => f.y < 110))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      window.clearInterval(spawn)
      cancelAnimationFrame(raf)
    }
  }, [on])

  const catchOne = (f: Drop) => {
    play("sparkle")
    setDrops((d) => d.filter((x) => x.id !== f.id))
    comboRef.current += 1
    setCombo(comboRef.current)
    const next = score + 1 + Math.floor(comboRef.current / 5)
    setScore(next)
    patch((s) => ({
      ...s,
      collectedFruit: s.collectedFruit.includes(f.kind) ? s.collectedFruit : [...s.collectedFruit, f.kind],
      fruitStickers: s.fruitStickers.includes(f.kind) ? s.fruitStickers : [...s.fruitStickers, f.kind],
    }))
    if (comboRef.current >= 8) notify("FRUIT FRENZY")
    if (next >= 20 && !save.completedLevels.includes("fruit")) completeLevel("fruit")
    highScore("fruit", next)
    addCoins(1)
    window.setTimeout(() => {
      comboRef.current = Math.max(0, comboRef.current - 1)
      setCombo(comboRef.current)
    }, 1200)
  }

  return (
    <PageShell title="Fruit Garden" area="fruit" tint="#ffe8c8">
      <Tag>tap falling fruit · combos make juice sparkles</Tag>
      <p className="mb-2 font-hand text-sm">
        score {score} · combo {combo} {combo >= 8 ? "· FRUIT FRENZY" : ""}
      </p>
      <div className="relative mx-auto min-h-[380px] max-w-md overflow-hidden rounded-[1.8rem] bg-linear-to-b from-sky to-[#b7e39a]" data-testid="fruit-garden">
        {drops.map((f) => (
          <button
            key={f.id}
            type="button"
            className="absolute min-h-11 min-w-11 -translate-x-1/2 border-0 bg-transparent text-2xl"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            aria-label={`catch ${f.kind}`}
            onClick={() => catchOne(f)}
          >
            {f.kind}
          </button>
        ))}
        <button
          type="button"
          className="absolute bottom-2 right-3 border-0 bg-transparent p-0"
          aria-label="cactus ice cream secret"
          onClick={() => discoverSecret("cactus-pop", "cactus pops · friends 4 ever")}
        >
          <CactusIceCream body="#ff8fab" spots="#fff" className="scale-75" />
        </button>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        <GameButton onClick={() => setOn((v) => !v)}>{on ? "pause fruit" : "resume"}</GameButton>
      </div>
      <p className="mt-2 text-center font-hand text-xs">stickers: {save.fruitStickers.join(" ") || "none yet"}</p>
    </PageShell>
  )
}
