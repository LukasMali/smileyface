import { useEffect, useRef, useState } from "react"
import { useGame } from "../hooks/GameContext"
import { GameButton, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

type Ball = { x: number; y: number; vx: number; vy: number; r: number; color: string; id: string; pocketed: boolean }

const COLORS = ["#f4d35e", "#ff8fab", "#8ecae6", "#8fd9b0", "#c4b0ea", "#fff"]
const W = 360
const H = 520
const FRICTION = 0.985
const POCKETS = [
  [18, 18],
  [W / 2, 14],
  [W - 18, 18],
  [18, H - 18],
  [W / 2, H - 14],
  [W - 18, H - 18],
]

function makeBalls(): Ball[] {
  const balls: Ball[] = [{ id: "cue", x: W / 2, y: H * 0.72, vx: 0, vy: 0, r: 11, color: "#fff", pocketed: false }]
  let n = 0
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i <= row; i++) {
      balls.push({
        id: `b${n}`,
        x: W / 2 + (i - row / 2) * 24,
        y: 140 + row * 22,
        vx: 0,
        vy: 0,
        r: 11,
        color: COLORS[n % COLORS.length] as string,
        pocketed: false,
      })
      n += 1
    }
  }
  return balls
}

export function Pool() {
  const { notify, play, patch, save, completeLevel, highScore } = useGame()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const balls = useRef<Ball[]>(makeBalls())
  const aim = useRef({ x: W / 2, y: 80, dragging: false, power: 0 })
  const [score, setScore] = useState(save.poolScore)
  const [msg, setMsg] = useState("apparently somebody is still undefeated")
  const moving = useRef(false)
  const won = useRef(false)

  useEffect(() => {
    let raf = 0
    const step = () => {
      const list = balls.current
      moving.current = false
      for (const b of list) {
        if (b.pocketed) continue
        b.x += b.vx
        b.y += b.vy
        b.vx *= FRICTION
        b.vy *= FRICTION
        if (Math.hypot(b.vx, b.vy) > 0.04) moving.current = true
        if (b.x < 22 + b.r) { b.x = 22 + b.r; b.vx *= -0.9 }
        if (b.x > W - 22 - b.r) { b.x = W - 22 - b.r; b.vx *= -0.9 }
        if (b.y < 22 + b.r) { b.y = 22 + b.r; b.vy *= -0.9 }
        if (b.y > H - 22 - b.r) { b.y = H - 22 - b.r; b.vy *= -0.9 }
        for (const [px, py] of POCKETS) {
          if (Math.hypot(b.x - px, b.y - py) < 16) {
            b.pocketed = true
            b.vx = 0
            b.vy = 0
            if (b.id === "cue") {
              b.pocketed = false
              b.x = W / 2
              b.y = H * 0.72
              notify("cue ball had a moment")
            } else {
              play("pool")
              setScore((s) => {
                const n = s + 1
                patch((sv) => ({ ...sv, poolScore: Math.max(sv.poolScore, n) }))
                highScore("pool", n)
                return n
              })
            }
          }
        }
      }
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i]
          const b = list[j]
          if (!a || !b || a.pocketed || b.pocketed) continue
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy)
          const min = a.r + b.r
          if (dist === 0 || dist >= min) continue
          const nx = dx / dist
          const ny = dy / dist
          const overlap = min - dist
          a.x -= nx * overlap / 2
          b.x += nx * overlap / 2
          a.y -= ny * overlap / 2
          b.y += ny * overlap / 2
          const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny
          if (rel > 0) continue
          a.vx -= rel * nx
          a.vy -= rel * ny
          b.vx += rel * nx
          b.vy += rel * ny
        }
      }
      const left = list.filter((b) => b.id !== "cue" && !b.pocketed).length
      if (left === 0 && !won.current) {
        won.current = true
        setMsg("still suspiciously good at pool")
        patch((s) => ({ ...s, poolWins: s.poolWins + 1 }))
        completeLevel("pool")
        play("achieve")
      }
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (canvas && ctx) drawTable(ctx, list, aim.current)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [completeLevel, highScore, notify, patch, play])

  const shoot = (x: number, y: number, p: number) => {
    const cue = balls.current.find((b) => b.id === "cue")
    if (!cue || moving.current) return
    const dx = x - cue.x
    const dy = y - cue.y
    const d = Math.hypot(dx, dy) || 1
    const power = Math.min(8.5, 2 + p / 12)
    cue.vx = (dx / d) * power
    cue.vy = (dy / d) * power
    play("pool")
  }

  return (
    <PageShell title="The Pool Rematch" area="pool" tint="#1b4d3e">
      <Tag className="bg-white/90 text-ink">{msg}</Tag>
      <p className="mb-2 font-hand text-sm text-cream">score {score} · wins {save.poolWins} · drag to aim, release to shoot</p>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        data-testid="pool-canvas"
        className="mx-auto block w-full max-w-sm touch-none rounded-[1.2rem] border-4 border-[#6b3a2a]"
        onPointerDown={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          aim.current.dragging = true
          aim.current.x = ((e.clientX - r.left) / r.width) * W
          aim.current.y = ((e.clientY - r.top) / r.height) * H
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!aim.current.dragging) return
          const r = e.currentTarget.getBoundingClientRect()
          aim.current.x = ((e.clientX - r.left) / r.width) * W
          aim.current.y = ((e.clientY - r.top) / r.height) * H
          const cue = balls.current.find((b) => b.id === "cue")
          if (cue) aim.current.power = Math.hypot(aim.current.x - cue.x, aim.current.y - cue.y)
        }}
        onPointerUp={() => {
          if (aim.current.dragging) shoot(aim.current.x, aim.current.y, aim.current.power)
          aim.current.dragging = false
          aim.current.power = 0
        }}
      />
      <div className="mt-3 flex justify-center gap-2">
        <GameButton
          onClick={() => {
            balls.current = makeBalls()
            setMsg("historically accurate result")
          }}
        >
          reset table
        </GameButton>
      </div>
    </PageShell>
  )
}

function drawTable(ctx: CanvasRenderingContext2D, list: Ball[], aim: { x: number; y: number; dragging: boolean }) {
  ctx.fillStyle = "#1f6b4a"
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = "#0e3d2a"
  ctx.lineWidth = 18
  ctx.strokeRect(9, 9, W - 18, H - 18)
  ctx.fillStyle = "#111"
  POCKETS.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, 14, 0, Math.PI * 2)
    ctx.fill()
  })
  const cue = list.find((b) => b.id === "cue" && !b.pocketed)
  if (cue && aim.dragging) {
    ctx.strokeStyle = "rgba(255,255,255,0.7)"
    ctx.beginPath()
    ctx.moveTo(cue.x, cue.y)
    ctx.lineTo(aim.x, aim.y)
    ctx.stroke()
  }
  for (const b of list) {
    if (b.pocketed) continue
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
    ctx.fillStyle = b.color
    ctx.fill()
    ctx.strokeStyle = "#4a3f55"
    ctx.lineWidth = 1.2
    ctx.stroke()
  }
}
