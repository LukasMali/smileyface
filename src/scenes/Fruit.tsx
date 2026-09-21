import { useEffect, useRef, useState } from "react"
import { CactusIceCream } from "../art/Props"
import { FRUIT_KINDS, FruitArt, type FruitKind } from "../art/Fruits"
import { useGame } from "../hooks/GameContext"
import { rand } from "../lib/random"
import { GameButton, Panel, Pill, ProgressBar } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

type Drop = { id: number; x: number; y: number; kind: FruitKind; vy: number; spin: number }

export function Fruit() {
  const { notify, play, patch, save, completeLevel, highScore, discoverSecret, addCoins, poke } = useGame()
  const [drops, setDrops] = useState<Drop[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [on, setOn] = useState(true)
  const id = useRef(0)
  const comboRef = useRef(0)
  const dropsRef = useRef<Drop[]>([])
  const nodes = useRef(new Map<number, HTMLButtonElement>())

  useEffect(() => {
    if (!on) return
    const spawn = window.setInterval(() => {
      const drop: Drop = {
        id: ++id.current,
        x: rand(8, 84),
        y: -10,
        kind: FRUIT_KINDS[Math.floor(Math.random() * FRUIT_KINDS.length)] as FruitKind,
        vy: rand(14, 30),
        spin: rand(-40, 40),
      }
      dropsRef.current = [...dropsRef.current.slice(-16), drop]
      setDrops(dropsRef.current)
    }, 720)
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      let lost = false
      for (const f of dropsRef.current) {
        f.y += f.vy * dt
        f.spin += 50 * dt
        if (f.y >= 108) lost = true
        const el = nodes.current.get(f.id)
        if (!el) continue
        el.style.left = `${f.x}%`
        el.style.top = `${f.y}%`
        el.style.transform = `translateX(-50%) rotate(${f.spin}deg)`
      }
      if (lost) {
        dropsRef.current = dropsRef.current.filter((f) => f.y < 108)
        setDrops(dropsRef.current)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      window.clearInterval(spawn)
      cancelAnimationFrame(raf)
    }
  }, [on])

  const catchOne = (f: Drop, e: React.MouseEvent) => {
    play("sparkle")
    poke(e.clientX, e.clientY, "star")
    dropsRef.current = dropsRef.current.filter((x) => x.id !== f.id)
    setDrops(dropsRef.current)
    comboRef.current += 1
    setCombo(comboRef.current)
    const next = score + 1 + Math.floor(comboRef.current / 5)
    setScore(next)
    patch((s) => ({
      ...s,
      collectedFruit: s.collectedFruit.includes(f.kind) ? s.collectedFruit : [...s.collectedFruit, f.kind],
      fruitStickers: s.fruitStickers.includes(f.kind) ? s.fruitStickers : [...s.fruitStickers, f.kind],
    }))
    if (comboRef.current === 8) notify("FRUIT FRENZY")
    if (next >= 20 && !save.completedLevels.includes("fruit")) completeLevel("fruit")
    highScore("fruit", next)
    addCoins(1)
    window.setTimeout(() => {
      comboRef.current = Math.max(0, comboRef.current - 1)
      setCombo(comboRef.current)
    }, 1200)
  }

  const stickers = save.fruitStickers.filter((s): s is FruitKind => (FRUIT_KINDS as string[]).includes(s))

  return (
    <PageShell
      title="Fruit Garden"
      area="fruit"
      subtitle="tap falling fruit · combos make juice sparkles"
      tint="linear-gradient(180deg,#eaf6ff 0%,#eef8e4 55%,#fff3dd 100%)"
      aside={<Pill className="bg-butter">best {save.highScores.fruit ?? 0}</Pill>}
    >
      <div className="mx-auto mb-2 flex max-w-md flex-wrap items-center justify-between gap-2">
        <Pill className="bg-white">score {score}</Pill>
        <Pill className={combo >= 8 ? "bg-blush-deep" : "bg-mint"}>
          combo x{combo} {combo >= 8 ? "· FRENZY" : ""}
        </Pill>
        <GameButton size="sm" onClick={() => setOn((v) => !v)}>
          {on ? "pause" : "resume"}
        </GameButton>
      </div>

      <div
        className="stage mx-auto min-h-[24rem] max-w-md"
        data-testid="fruit-garden"
        style={{ background: "linear-gradient(180deg,#cfeeff 0%,#e2f5e6 55%,#a8dd82 100%)" }}
      >
        <svg viewBox="0 0 360 400" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <circle cx="300" cy="50" r="28" fill="#ffe89a" />
          <g fill="#fff" opacity="0.9" className="anim-float">
            <ellipse cx="80" cy="48" rx="34" ry="15" />
            <ellipse cx="106" cy="42" rx="22" ry="12" />
          </g>
          {/* trees */}
          {[
            [36, 250],
            [326, 262],
          ].map(([x, y]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <rect x="-7" y="0" width="14" height="70" rx="7" fill="#b98b63" />
              <circle cx="0" cy="-18" r="40" fill="#7dcc93" stroke="#5fb083" strokeWidth="3" />
              <circle cx="-16" cy="-30" r="20" fill="#9ce2b8" opacity="0.7" />
              <circle cx="14" cy="-8" r="6" fill="#ef6b92" />
              <circle cx="-8" cy="-2" r="5" fill="#ef6b92" />
            </g>
          ))}
          {/* fence + grass */}
          <path d="M0 348h360v52H0z" fill="#8fcf6a" />
          {Array.from({ length: 9 }).map((_, i) => (
            <g key={i} transform={`translate(${12 + i * 42} 318)`}>
              <rect x="0" y="0" width="10" height="34" rx="4" fill="#e8d2b0" stroke="#c9ad8a" strokeWidth="2" />
            </g>
          ))}
          <path d="M0 330h360" stroke="#e8d2b0" strokeWidth="7" />
          {Array.from({ length: 16 }).map((_, i) => (
            <path key={`g${i}`} d={`M${8 + i * 23} 372c4-12 8-16 10-20`} stroke="#6fbd53" strokeWidth="3" fill="none" strokeLinecap="round" />
          ))}
        </svg>

        {drops.map((f) => (
          <button
            key={f.id}
            type="button"
            ref={(el) => {
              if (el) nodes.current.set(f.id, el)
              else nodes.current.delete(f.id)
            }}
            className="hit-area absolute border-0 bg-transparent p-0 active:scale-110"
            style={{ left: `${f.x}%`, top: `${f.y}%`, transform: "translateX(-50%)", willChange: "top, transform" }}
            aria-label={`catch ${f.kind}`}
            onClick={(e) => catchOne(f, e)}
          >
            <FruitArt kind={f.kind} size={46} />
          </button>
        ))}

        <button
          type="button"
          className="hit-area absolute right-2 bottom-2 border-0 bg-transparent p-0"
          aria-label="cactus ice cream secret"
          onClick={() => discoverSecret("cactus-pop", "cactus pops · friends 4 ever")}
        >
          <CactusIceCream body="#ff8fae" spots="#fff" size={74} />
        </button>
      </div>

      <Panel className="mx-auto mt-3 max-w-md bg-white/88">
        <div className="mb-2 flex items-center justify-between font-hand text-sm">
          <span>fruit sticker book</span>
          <span>
            {stickers.length}/{FRUIT_KINDS.length}
          </span>
        </div>
        <ProgressBar value={(stickers.length / FRUIT_KINDS.length) * 100} tone="mint" label="fruit collected" className="mb-3" />
        <div className="flex flex-wrap gap-1.5">
          {FRUIT_KINDS.map((k) => (
            <span
              key={k}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border-[1.5px] ${
                stickers.includes(k) ? "border-ink/12 bg-white" : "border-dashed border-ink/15 bg-white/40 opacity-40 grayscale"
              }`}
            >
              <FruitArt kind={k} size={30} />
            </span>
          ))}
        </div>
      </Panel>
    </PageShell>
  )
}
