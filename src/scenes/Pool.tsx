import { useCallback, useEffect, useRef, useState } from "react"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Pill, ProgressBar } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

type Ball = {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
  stripe: boolean
  num: number
  pocketed: boolean
  sink: number
}

const W = 340
const H = 560
const RAIL = 22
const R = 11
const POCKET_R = 18

/** speed kept per second, so physics is frame-rate independent */
const ROLL_KEEP = 0.45
const CUSHION_E = 0.72
const BALL_E = 0.96
const STOP = 10
const MAX_SPEED = 1700
const MIN_SPEED = 220

const BOUND = {
  left: RAIL + R,
  right: W - RAIL - R,
  top: RAIL + R,
  bottom: H - RAIL - R,
}

const POCKETS: [number, number][] = [
  [RAIL + 2, RAIL + 2],
  [W - RAIL - 2, RAIL + 2],
  [RAIL - 2, H / 2],
  [W - RAIL + 2, H / 2],
  [RAIL + 2, H - RAIL - 2],
  [W - RAIL - 2, H - RAIL - 2],
]

const RACK = [
  { color: "#ffd45e", num: 1, stripe: false },
  { color: "#ff8fae", num: 2, stripe: false },
  { color: "#8fcbec", num: 3, stripe: false },
  { color: "#8fddb4", num: 4, stripe: true },
  { color: "#bfa9f0", num: 5, stripe: true },
  { color: "#ff9f6b", num: 6, stripe: true },
]

const CUE_HOME = { x: W / 2, y: H * 0.74 }
const MOUTH = POCKET_R * 1.45

/** true inside a pocket mouth, where the cushion is interrupted */
function nearPocket(x: number, y: number) {
  return POCKETS.some(([px, py]) => Math.hypot(x - px, y - py) < MOUTH)
}

function makeBalls(): Ball[] {
  const balls: Ball[] = [
    { id: "cue", x: CUE_HOME.x, y: CUE_HOME.y, vx: 0, vy: 0, r: R, color: "#fffdf8", stripe: false, num: 0, pocketed: false, sink: 0 },
  ]
  const gap = R * 2 + 2.5
  let n = 0
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i <= row; i++) {
      const def = RACK[n]
      if (!def) continue
      balls.push({
        id: `b${n}`,
        x: W / 2 + (i - row / 2) * gap,
        y: 150 + row * (gap * 0.88),
        vx: 0,
        vy: 0,
        r: R,
        color: def.color,
        stripe: def.stripe,
        num: def.num,
        pocketed: false,
        sink: 0,
      })
      n += 1
    }
  }
  return balls
}

export function Pool() {
  const { notify, play, patch, save, completeLevel, highScore, addCoins, poke } = useGame()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const balls = useRef<Ball[]>(makeBalls())
  const aimRef = useRef({ angle: -Math.PI / 2, power: 0.55, dragging: false })
  const movingRef = useRef(false)
  const clearedRef = useRef(false)

  const [aim, setAim] = useState({ angle: -Math.PI / 2, power: 0.55 })
  const [moving, setMoving] = useState(false)
  const [score, setScore] = useState(0)
  const [shots, setShots] = useState(0)
  const [msg, setMsg] = useState("drag from the white ball, let go to shoot")

  const syncAim = useCallback((angle: number, power: number) => {
    aimRef.current.angle = angle
    aimRef.current.power = power
    setAim({ angle, power })
  }, [])

  const rack = useCallback(
    (message: string) => {
      balls.current = makeBalls()
      clearedRef.current = false
      setScore(0)
      setShots(0)
      setMsg(message)
      syncAim(-Math.PI / 2, 0.55)
    },
    [syncAim],
  )

  const shoot = useCallback(() => {
    const cue = balls.current.find((b) => b.id === "cue")
    if (!cue || movingRef.current) return
    const speed = MIN_SPEED + (MAX_SPEED - MIN_SPEED) * aimRef.current.power
    cue.vx = Math.cos(aimRef.current.angle) * speed
    cue.vy = Math.sin(aimRef.current.angle) * speed
    setShots((s) => s + 1)
    play("pool")
  }, [play])

  /* ---------- simulation + render loop ---------- */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(3, window.devicePixelRatio || 1)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let raf = 0
    let last = performance.now()
    let acc = 0
    const FIXED = 1 / 240

    const integrate = (dt: number) => {
      const list = balls.current
      const keep = Math.pow(ROLL_KEEP, dt)

      for (const b of list) {
        if (b.pocketed) {
          if (b.sink < 1) b.sink = Math.min(1, b.sink + dt * 4)
          continue
        }
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.vx *= keep
        b.vy *= keep
        if (Math.hypot(b.vx, b.vy) < STOP) {
          b.vx = 0
          b.vy = 0
        }

        // near a pocket mouth the cushions stop existing, so balls can actually roll in
        if (nearPocket(b.x, b.y)) {
          // …but the wooden frame still contains them
          const pad = 6
          if (b.x < pad) {
            b.x = pad
            b.vx = Math.abs(b.vx) * 0.4
          } else if (b.x > W - pad) {
            b.x = W - pad
            b.vx = -Math.abs(b.vx) * 0.4
          }
          if (b.y < pad) {
            b.y = pad
            b.vy = Math.abs(b.vy) * 0.4
          } else if (b.y > H - pad) {
            b.y = H - pad
            b.vy = -Math.abs(b.vy) * 0.4
          }
          continue
        }

        if (b.x < BOUND.left) {
          b.x = BOUND.left
          b.vx = Math.abs(b.vx) * CUSHION_E
        } else if (b.x > BOUND.right) {
          b.x = BOUND.right
          b.vx = -Math.abs(b.vx) * CUSHION_E
        }
        if (b.y < BOUND.top) {
          b.y = BOUND.top
          b.vy = Math.abs(b.vy) * CUSHION_E
        } else if (b.y > BOUND.bottom) {
          b.y = BOUND.bottom
          b.vy = -Math.abs(b.vy) * CUSHION_E
        }
      }

      for (let i = 0; i < list.length; i++) {
        const a = list[i]
        if (!a || a.pocketed) continue
        for (let j = i + 1; j < list.length; j++) {
          const b = list[j]
          if (!b || b.pocketed) continue
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy)
          const min = a.r + b.r
          if (dist === 0 || dist >= min) continue
          const nx = dx / dist
          const ny = dy / dist
          const push = (min - dist) / 2 + 0.01
          a.x -= nx * push
          a.y -= ny * push
          b.x += nx * push
          b.y += ny * push
          const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny
          if (rel <= 0) continue
          const j2 = (rel * (1 + BALL_E)) / 2
          a.vx -= j2 * nx
          a.vy -= j2 * ny
          b.vx += j2 * nx
          b.vy += j2 * ny
        }
      }
    }

    const checkPockets = () => {
      for (const b of balls.current) {
        if (b.pocketed) continue
        for (const [px, py] of POCKETS) {
          if (Math.hypot(b.x - px, b.y - py) > POCKET_R * 0.8) continue
          if (b.id === "cue") {
            b.x = CUE_HOME.x
            b.y = CUE_HOME.y
            b.vx = 0
            b.vy = 0
            notify("the white ball needed a break. it is back.")
          } else {
            b.pocketed = true
            b.vx = 0
            b.vy = 0
            play("pool")
            addCoins(1)
            setScore((s) => {
              const next = s + 1
              patch((sv) => ({ ...sv, poolScore: Math.max(sv.poolScore, next) }))
              highScore("pool", next)
              return next
            })
            setMsg(pickLine(b.num))
          }
          break
        }
      }
    }

    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      const frame = Math.min(0.05, (now - last) / 1000)
      last = now
      acc += frame
      let guard = 0
      while (acc >= FIXED && guard < 400) {
        integrate(FIXED)
        acc -= FIXED
        guard += 1
      }
      checkPockets()

      const isMoving = balls.current.some((b) => !b.pocketed && (b.vx !== 0 || b.vy !== 0))
      if (isMoving !== movingRef.current) {
        movingRef.current = isMoving
        setMoving(isMoving)
      }

      const left = balls.current.filter((b) => b.id !== "cue" && !b.pocketed).length
      if (left === 0 && !clearedRef.current) {
        clearedRef.current = true
        setMsg("rack cleared. still suspiciously good at pool.")
        patch((s) => ({ ...s, poolWins: s.poolWins + 1 }))
        completeLevel("pool")
        play("achieve")
      }

      draw(ctx, balls.current, aimRef.current, movingRef.current)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [addCoins, completeLevel, highScore, notify, patch, play])

  /* ---------- keyboard for accessibility ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = aimRef.current
      if (e.key === "ArrowLeft") syncAim(a.angle - 0.06, a.power)
      else if (e.key === "ArrowRight") syncAim(a.angle + 0.06, a.power)
      else if (e.key === "ArrowUp") syncAim(a.angle, Math.min(1, a.power + 0.06))
      else if (e.key === "ArrowDown") syncAim(a.angle, Math.max(0.05, a.power - 0.06))
      else if (e.key === " " || e.key === "Enter") shoot()
      else return
      e.preventDefault()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [shoot, syncAim])

  const pointerTo = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    }
  }

  const trackDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cue = balls.current.find((b) => b.id === "cue")
    if (!cue) return
    const p = pointerTo(e)
    const dx = p.x - cue.x
    const dy = p.y - cue.y
    const dist = Math.hypot(dx, dy)
    if (dist < 6) return
    const power = Math.max(0.06, Math.min(1, (dist - 14) / 180))
    syncAim(Math.atan2(dy, dx), power)
  }

  return (
    <PageShell
      title="The Pool Rematch"
      area="pool"
      night
      tint="linear-gradient(180deg,#2b4a3f 0%,#1d3931 55%,#16292a 100%)"
      subtitle="apparently somebody is still undefeated"
      aside={<Pill className="bg-butter">wins {save.poolWins}</Pill>}
    >
      <Panel className="mb-3 bg-white/85">
        <p className="font-hand text-sm text-ink">{msg}</p>
      </Panel>

      <div className="mx-auto w-full max-w-[22rem]">
        <canvas
          ref={canvasRef}
          data-testid="pool-canvas"
          aria-label="pool table, drag to aim and release to shoot"
          className="mx-auto block touch-none select-none rounded-[1.4rem]"
          style={{
            aspectRatio: `${W} / ${H}`,
            // keep the whole table plus its controls on one mobile screen
            maxHeight: "min(46svh, 27rem)",
            width: "auto",
            maxWidth: "100%",
          }}
          onPointerDown={(e) => {
            if (movingRef.current) return
            aimRef.current.dragging = true
            e.currentTarget.setPointerCapture(e.pointerId)
            trackDrag(e)
          }}
          onPointerMove={(e) => {
            if (!aimRef.current.dragging) return
            trackDrag(e)
          }}
          onPointerUp={(e) => {
            if (!aimRef.current.dragging) return
            aimRef.current.dragging = false
            poke(e.clientX, e.clientY, "spark")
            shoot()
          }}
          onPointerCancel={() => {
            aimRef.current.dragging = false
          }}
        />
      </div>

      <div className="mx-auto mt-3 w-full max-w-[22rem]">
        <div className="soft-card bg-white/88 p-3">
          <div className="mb-1 flex items-center justify-between font-hand text-xs text-ink">
            <span>power</span>
            <span>{Math.round(aim.power * 100)}%</span>
          </div>
          <ProgressBar value={aim.power * 100} tone="butter" label="shot power" className="mb-2" />
          <input
            type="range"
            min={5}
            max={100}
            value={Math.round(aim.power * 100)}
            aria-label="shot power"
            className="w-full"
            onChange={(e) => syncAim(aimRef.current.angle, Number(e.target.value) / 100)}
          />
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <GameButton size="sm" tone="sky" label="aim left" onClick={() => syncAim(aimRef.current.angle - 0.08, aimRef.current.power)}>
              ◀ aim
            </GameButton>
            <GameButton size="sm" tone="pink" disabled={moving} testid="pool-shoot" onClick={shoot}>
              shoot!
            </GameButton>
            <GameButton size="sm" tone="sky" label="aim right" onClick={() => syncAim(aimRef.current.angle + 0.08, aimRef.current.power)}>
              aim ▶
            </GameButton>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <Pill className="bg-mint">pocketed {score}/6</Pill>
          <Pill className="bg-lilac">shots {shots}</Pill>
          <GameButton size="sm" onClick={() => rack("fresh rack. the table forgives nothing.")}>
            rack again
          </GameButton>
        </div>
        <p className="mt-2 text-center font-hand text-xs text-cream/70">
          arrow keys aim, space shoots. gentle taps are allowed.
        </p>
      </div>
    </PageShell>
  )
}

function pickLine(num: number) {
  const lines = [
    "in. obviously.",
    "that was on purpose, you saw it",
    "the ball agreed with your plan",
    "clean. slightly illegal. accepted.",
    "pocket says thank you",
    "the table respects you now",
  ]
  return lines[num % lines.length] as string
}

/* ---------- rendering ---------- */

function draw(
  ctx: CanvasRenderingContext2D,
  list: Ball[],
  aim: { angle: number; power: number; dragging: boolean },
  moving: boolean,
) {
  ctx.clearRect(0, 0, W, H)

  // wooden frame
  const wood = ctx.createLinearGradient(0, 0, W, H)
  wood.addColorStop(0, "#9c6a4a")
  wood.addColorStop(0.5, "#7d4f36")
  wood.addColorStop(1, "#5e3927")
  roundRect(ctx, 0, 0, W, H, 26)
  ctx.fillStyle = wood
  ctx.fill()
  ctx.strokeStyle = "rgba(255,255,255,0.18)"
  ctx.lineWidth = 2
  roundRect(ctx, 2, 2, W - 4, H - 4, 24)
  ctx.stroke()

  // felt
  const felt = ctx.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H / 2, H * 0.72)
  felt.addColorStop(0, "#43a678")
  felt.addColorStop(0.55, "#2f8b61")
  felt.addColorStop(1, "#1f6a4a")
  roundRect(ctx, RAIL - 6, RAIL - 6, W - (RAIL - 6) * 2, H - (RAIL - 6) * 2, 14)
  ctx.fillStyle = felt
  ctx.fill()
  ctx.strokeStyle = "rgba(0,0,0,0.25)"
  ctx.lineWidth = 3
  ctx.stroke()

  // rail diamonds
  ctx.fillStyle = "rgba(255,245,225,0.7)"
  for (let i = 1; i < 4; i++) {
    diamond(ctx, (W / 4) * i, RAIL / 2 - 1, 3)
    diamond(ctx, (W / 4) * i, H - RAIL / 2 + 1, 3)
  }
  for (let i = 1; i < 6; i++) {
    diamond(ctx, RAIL / 2 - 1, (H / 6) * i, 3)
    diamond(ctx, W - RAIL / 2 + 1, (H / 6) * i, 3)
  }

  // pockets
  for (const [px, py] of POCKETS) {
    const g = ctx.createRadialGradient(px, py, 2, px, py, POCKET_R)
    g.addColorStop(0, "#120f14")
    g.addColorStop(0.75, "#231c26")
    g.addColorStop(1, "rgba(35,28,38,0.2)")
    ctx.beginPath()
    ctx.arc(px, py, POCKET_R, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()
    ctx.strokeStyle = "rgba(255,255,255,0.22)"
    ctx.lineWidth = 1.4
    ctx.stroke()
  }

  const cue = list.find((b) => b.id === "cue" && !b.pocketed)

  // aim guide + cue stick
  if (cue && !moving) {
    const dirX = Math.cos(aim.angle)
    const dirY = Math.sin(aim.angle)
    const hit = predict(list, cue, dirX, dirY)

    ctx.save()
    ctx.setLineDash([7, 8])
    ctx.lineWidth = 2
    ctx.strokeStyle = "rgba(255,255,255,0.75)"
    ctx.beginPath()
    ctx.moveTo(cue.x + dirX * (R + 2), cue.y + dirY * (R + 2))
    ctx.lineTo(hit.x, hit.y)
    ctx.stroke()
    ctx.restore()

    // ghost ball at contact point
    ctx.beginPath()
    ctx.arc(hit.x, hit.y, R, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(255,255,255,0.65)"
    ctx.lineWidth = 1.6
    ctx.stroke()

    // cue stick pulled back with power
    const pull = 20 + aim.power * 46
    const tipX = cue.x - dirX * pull
    const tipY = cue.y - dirY * pull
    const endX = cue.x - dirX * (pull + 150)
    const endY = cue.y - dirY * (pull + 150)
    const stick = ctx.createLinearGradient(tipX, tipY, endX, endY)
    stick.addColorStop(0, "#f4ead6")
    stick.addColorStop(0.12, "#d9a86a")
    stick.addColorStop(1, "#8a5a33")
    ctx.strokeStyle = stick
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(tipX, tipY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    ctx.strokeStyle = "rgba(255,255,255,0.35)"
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.moveTo(tipX, tipY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }

  for (const b of list) {
    if (b.pocketed && b.sink >= 1) continue
    const scale = b.pocketed ? 1 - b.sink : 1
    if (scale <= 0.02) continue
    const r = b.r * scale

    ctx.beginPath()
    ctx.ellipse(b.x + 2, b.y + 4, r * 0.95, r * 0.55, 0, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(0,0,0,0.25)"
    ctx.fill()

    const g = ctx.createRadialGradient(b.x - r * 0.35, b.y - r * 0.4, r * 0.15, b.x, b.y, r)
    g.addColorStop(0, "#ffffff")
    g.addColorStop(0.35, b.color)
    g.addColorStop(1, shade(b.color, -34))
    ctx.beginPath()
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()

    if (b.stripe) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2)
      ctx.clip()
      ctx.fillStyle = "rgba(255,255,255,0.92)"
      ctx.fillRect(b.x - r, b.y - r * 0.34, r * 2, r * 0.68)
      ctx.restore()
    }

    if (b.num > 0) {
      ctx.beginPath()
      ctx.arc(b.x, b.y, r * 0.42, 0, Math.PI * 2)
      ctx.fillStyle = "#fffdf8"
      ctx.fill()
      ctx.fillStyle = "#4a3a44"
      ctx.font = `700 ${Math.round(r * 0.72)}px "Baloo 2", Nunito, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(String(b.num), b.x, b.y + 0.5)
    }

    ctx.beginPath()
    ctx.ellipse(b.x - r * 0.34, b.y - r * 0.42, r * 0.3, r * 0.2, -0.6, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255,255,255,0.85)"
    ctx.fill()

    ctx.beginPath()
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2)
    ctx.strokeStyle = "rgba(60,40,50,0.35)"
    ctx.lineWidth = 1
    ctx.stroke()
  }
}

/** first thing the cue ball would touch: a ball, or a cushion */
function predict(list: Ball[], cue: Ball, dx: number, dy: number) {
  let best = Infinity
  for (const b of list) {
    if (b.pocketed || b.id === cue.id) continue
    const ox = b.x - cue.x
    const oy = b.y - cue.y
    const proj = ox * dx + oy * dy
    if (proj <= 0) continue
    const perp = Math.abs(ox * dy - oy * dx)
    const sum = cue.r + b.r
    if (perp > sum) continue
    const t = proj - Math.sqrt(sum * sum - perp * perp)
    if (t > 0 && t < best) best = t
  }
  const walls = [
    dx > 0 ? (BOUND.right - cue.x) / dx : dx < 0 ? (BOUND.left - cue.x) / dx : Infinity,
    dy > 0 ? (BOUND.bottom - cue.y) / dy : dy < 0 ? (BOUND.top - cue.y) / dy : Infinity,
  ].filter((t) => t > 0)
  const wall = Math.min(...walls, 900)
  const t = Math.min(best, wall)
  return { x: cue.x + dx * t, y: cue.y + dy * t }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath()
  ctx.moveTo(x, y - s)
  ctx.lineTo(x + s, y)
  ctx.lineTo(x, y + s)
  ctx.lineTo(x - s, y)
  ctx.closePath()
  ctx.fill()
}

function shade(hex: string, amount: number) {
  const m = hex.replace("#", "")
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m
  const num = parseInt(full, 16)
  const clamp = (v: number) => Math.max(0, Math.min(255, v))
  const r = clamp(((num >> 16) & 255) + amount)
  const g = clamp(((num >> 8) & 255) + amount)
  const b = clamp((num & 255) + amount)
  return `rgb(${r},${g},${b})`
}
