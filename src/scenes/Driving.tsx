import { useCallback, useEffect, useRef, useState } from "react"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Pill } from "../ui/Button"
import { PageShell } from "../ui/PageShell"
import { Licence } from "../art/Props"
import { clamp } from "../lib/random"

const W = 360
const H = 340

type Level = { id: number; name: string; goal: string }

const LEVELS: Level[] = [
  { id: 1, name: "Traffic signs", goal: "drive over all three signs" },
  { id: 2, name: "Parking", goal: "stop inside the dashed box" },
  { id: 3, name: "Roundabout", goal: "drive one full loop around the circle" },
  { id: 4, name: "Parallel parking boss", goal: "slide into the tiny space and stop" },
  { id: 5, name: "Driving test", goal: "park once more, with style" },
]

type Car = { x: number; y: number; a: number; v: number }
type Sign = { x: number; y: number; taken: boolean }

const CONES: [number, number][] = [
  [110, 120],
  [250, 120],
  [110, 250],
  [250, 250],
]

function startCar(): Car {
  return { x: 70, y: 290, a: -Math.PI / 2, v: 0 }
}

function startSigns(level: number): Sign[] {
  if (level !== 1) return []
  return [
    { x: 110, y: 80, taken: false },
    { x: 200, y: 160, taken: false },
    { x: 290, y: 90, taken: false },
  ]
}

function parkingBox(level: number) {
  if (level === 2) return { x: 130, y: 210, w: 90, h: 54 }
  if (level === 4) return { x: 232, y: 214, w: 64, h: 44 }
  if (level === 5) return { x: 150, y: 60, w: 70, h: 48 }
  return null
}

export function Driving() {
  const { notify, play, patch, save, completeLevel, addStars } = useGame()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const car = useRef<Car>(startCar())
  const keys = useRef({ l: false, r: false, u: false, d: false })
  const signs = useRef<Sign[]>(startSigns(save.drivingLevel || 1))
  const parkHold = useRef(0)
  const loopAngle = useRef(0)
  const lastAngle = useRef<number | null>(null)
  const startLevel = Math.max(1, save.drivingLevel || 1)
  const levelRef = useRef(startLevel)
  const passedRef = useRef(false)

  const [level, setLevel] = useState(startLevel)
  const [msg, setMsg] = useState(LEVELS[startLevel - 1]?.goal ?? "")
  const [progress, setProgress] = useState("")

  const resetLevel = useCallback((next: number) => {
    levelRef.current = next
    car.current = startCar()
    signs.current = startSigns(next)
    parkHold.current = 0
    loopAngle.current = 0
    lastAngle.current = null
    passedRef.current = false
    setLevel(next)
    setMsg(LEVELS[next - 1]?.goal ?? "the examiner has no more ideas")
    setProgress("")
  }, [])

  const pass = useCallback(
    (auto: boolean) => {
      if (passedRef.current) return
      passedRef.current = true
      play("chime")
      notify(auto ? "examiner: acceptable. suspiciously acceptable." : "the examiner nods. moving on.")
      const next = Math.min(5, levelRef.current + 1)
      patch((s) => ({ ...s, drivingLevel: Math.max(s.drivingLevel, next) }))
      if (levelRef.current >= 5) {
        patch((s) => ({ ...s, licenceAcquired: true }))
        completeLevel("driving")
        addStars(2)
        notify("LICENCE ACQUIRED")
      }
      window.setTimeout(() => resetLevel(next), 700)
    },
    [addStars, completeLevel, notify, patch, play, resetLevel],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = Math.min(3, window.devicePixelRatio || 1)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === "arrowleft" || k === "a") keys.current.l = true
      else if (k === "arrowright" || k === "d") keys.current.r = true
      else if (k === "arrowup" || k === "w") keys.current.u = true
      else if (k === "arrowdown" || k === "s") keys.current.d = true
      else if (k === "h") {
        play("horn")
        notify("HONK")
      } else return
      e.preventDefault()
    }
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === "arrowleft" || k === "a") keys.current.l = false
      if (k === "arrowright" || k === "d") keys.current.r = false
      if (k === "arrowup" || k === "w") keys.current.u = false
      if (k === "arrowdown" || k === "s") keys.current.d = false
    }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const c = car.current
      const lvl = levelRef.current

      if (keys.current.u) c.v = clamp(c.v + 260 * dt, -110, 210)
      else if (keys.current.d) c.v = clamp(c.v - 300 * dt, -110, 210)
      else c.v *= Math.pow(0.22, dt)
      if (Math.abs(c.v) < 2) c.v = 0

      const grip = clamp(Math.abs(c.v) / 70, 0, 1) * Math.sign(c.v || 1)
      if (keys.current.l) c.a -= 2.6 * dt * grip
      if (keys.current.r) c.a += 2.6 * dt * grip

      c.x = clamp(c.x + Math.cos(c.a) * c.v * dt, 22, W - 22)
      c.y = clamp(c.y + Math.sin(c.a) * c.v * dt, 22, H - 22)

      // level goals
      if (lvl === 1) {
        let left = 0
        for (const s of signs.current) {
          if (!s.taken && Math.hypot(s.x - c.x, s.y - c.y) < 22) {
            s.taken = true
            play("pop")
          }
          if (!s.taken) left += 1
        }
        setProgress(`signs left: ${left}`)
        if (left === 0) pass(true)
      } else if (lvl === 3) {
        const ang = Math.atan2(c.y - H / 2, c.x - W / 2)
        const dist = Math.hypot(c.x - W / 2, c.y - H / 2)
        if (dist > 40 && dist < 130) {
          if (lastAngle.current !== null) {
            let d = ang - lastAngle.current
            if (d > Math.PI) d -= Math.PI * 2
            if (d < -Math.PI) d += Math.PI * 2
            loopAngle.current += d
          }
          lastAngle.current = ang
        } else {
          lastAngle.current = null
        }
        const pct = Math.min(100, Math.round((Math.abs(loopAngle.current) / (Math.PI * 2)) * 100))
        setProgress(`loop: ${pct}%`)
        if (pct >= 100) pass(true)
      } else {
        const box = parkingBox(lvl)
        if (box) {
          const inside = c.x > box.x + 6 && c.x < box.x + box.w - 6 && c.y > box.y + 6 && c.y < box.y + box.h - 6
          if (inside && Math.abs(c.v) < 12) {
            parkHold.current += dt
            setProgress(`holding still… ${parkHold.current.toFixed(1)}s / 0.8s`)
            if (parkHold.current > 0.8) pass(true)
          } else {
            parkHold.current = 0
            setProgress(inside ? "inside the box — now stop" : "find the dashed box")
          }
        }
      }

      draw(ctx, c, lvl, signs.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [notify, pass, play])

  const hold = (key: "l" | "r" | "u" | "d") => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      keys.current[key] = true
    },
    onPointerUp: () => {
      keys.current[key] = false
    },
    onPointerLeave: () => {
      keys.current[key] = false
    },
    onPointerCancel: () => {
      keys.current[key] = false
    },
  })

  return (
    <PageShell
      title="Driving Licence Quest"
      area="driving"
      subtitle={`level ${level}/5 · ${LEVELS[level - 1]?.name ?? "free driving"}`}
      tint="linear-gradient(180deg,#eaf7f0 0%,#e2f1ea 55%,#f4f7e6 100%)"
      aside={<Pill className="bg-mint">{save.licenceAcquired ? "licensed" : "student driver"}</Pill>}
    >
      <Panel className="mx-auto mb-3 max-w-md bg-white/88">
        <p className="font-hand text-sm">{msg}</p>
        {progress && <p className="font-hand text-xs text-ink-soft">{progress}</p>}
      </Panel>

      <canvas
        ref={canvasRef}
        data-testid="driving-canvas"
        aria-label="top down driving practice area"
        className="mx-auto block w-full max-w-md touch-none rounded-[1.4rem] border-[3px] border-ink/12 shadow-[0_18px_34px_-24px_rgba(91,68,80,0.8)]"
        style={{ aspectRatio: `${W} / ${H}` }}
      />

      <div className="mx-auto mt-3 grid max-w-md grid-cols-3 gap-2">
        <GameButton tone="sky" label="steer left" {...hold("l")}>
          ◀ left
        </GameButton>
        <GameButton tone="mint" label="accelerate" {...hold("u")}>
          gas
        </GameButton>
        <GameButton tone="sky" label="steer right" {...hold("r")}>
          right ▶
        </GameButton>
        <GameButton tone="sun" label="brake" {...hold("d")}>
          brake
        </GameButton>
        <GameButton
          onClick={() => {
            play("horn")
            notify("mirror check +100")
          }}
        >
          horn
        </GameButton>
        <GameButton tone="pink" testid="driving-pass" onClick={() => pass(false)}>
          skip level
        </GameButton>
      </div>
      <p className="mt-2 text-center font-hand text-xs text-ink-soft">
        arrows or WASD also work · h honks · cones are decorative but emotional
      </p>

      {save.licenceAcquired && (
        <div className="soft-card mx-auto mt-4 flex max-w-xs items-center gap-3 p-4">
          <Licence size={64} />
          <div>
            <p className="font-hand text-lg">LICENCE ACQUIRED</p>
            <p className="font-hand text-xs text-ink-soft">tiny fictional licence · cones: traumatised</p>
          </div>
        </div>
      )}
    </PageShell>
  )
}

function draw(ctx: CanvasRenderingContext2D, c: Car, level: number, signs: Sign[]) {
  // grass
  const grass = ctx.createLinearGradient(0, 0, 0, H)
  grass.addColorStop(0, "#a9dd8b")
  grass.addColorStop(1, "#8ecd6d")
  ctx.fillStyle = grass
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = "rgba(255,255,255,0.18)"
  for (let i = 0; i < 60; i++) {
    const x = (i * 71) % W
    const y = (i * 53) % H
    ctx.fillRect(x, y, 3, 1.6)
  }

  // asphalt
  ctx.fillStyle = "#8a8d99"
  round(ctx, 30, 30, W - 60, H - 60, 26)
  ctx.fill()
  ctx.fillStyle = "#7e818d"
  round(ctx, 34, 34, W - 68, H - 68, 22)
  ctx.fill()

  // curb
  ctx.strokeStyle = "#f6f0e4"
  ctx.lineWidth = 3
  round(ctx, 30, 30, W - 60, H - 60, 26)
  ctx.stroke()

  // lane dashes
  ctx.save()
  ctx.setLineDash([12, 12])
  ctx.strokeStyle = "rgba(255,244,214,0.85)"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(W / 2, 40)
  ctx.lineTo(W / 2, H - 40)
  ctx.stroke()
  ctx.restore()

  if (level === 3) {
    ctx.fillStyle = "#9ed683"
    ctx.beginPath()
    ctx.arc(W / 2, H / 2, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = "#f6f0e4"
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.save()
    ctx.setLineDash([10, 10])
    ctx.strokeStyle = "rgba(255,255,255,0.6)"
    ctx.beginPath()
    ctx.arc(W / 2, H / 2, 86, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  const box = parkingBox(level)
  if (box) {
    ctx.save()
    ctx.setLineDash([8, 6])
    ctx.strokeStyle = "#fffaf0"
    ctx.lineWidth = 3
    ctx.strokeRect(box.x, box.y, box.w, box.h)
    ctx.restore()
    ctx.fillStyle = "rgba(255,240,180,0.25)"
    ctx.fillRect(box.x, box.y, box.w, box.h)
    ctx.fillStyle = "#fffaf0"
    ctx.font = '700 11px "Baloo 2", Nunito, sans-serif'
    ctx.textAlign = "center"
    ctx.fillText("park here", box.x + box.w / 2, box.y + box.h / 2 + 4)
  }

  // cones
  for (const [x, y] of CONES) {
    ctx.beginPath()
    ctx.ellipse(x, y + 7, 8, 3.4, 0, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(0,0,0,0.18)"
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(x, y - 11)
    ctx.lineTo(x + 8, y + 7)
    ctx.lineTo(x - 8, y + 7)
    ctx.closePath()
    ctx.fillStyle = "#ff8f4d"
    ctx.fill()
    ctx.strokeStyle = "#5b4450"
    ctx.lineWidth = 1.2
    ctx.stroke()
    ctx.fillStyle = "#fff"
    ctx.fillRect(x - 4.4, y - 2, 8.8, 3.2)
  }

  // signs
  for (const s of signs) {
    if (s.taken) continue
    ctx.beginPath()
    ctx.ellipse(s.x, s.y + 12, 9, 3.6, 0, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(0,0,0,0.16)"
    ctx.fill()
    ctx.fillStyle = "#b98b63"
    ctx.fillRect(s.x - 1.8, s.y, 3.6, 12)
    ctx.beginPath()
    ctx.moveTo(s.x, s.y - 16)
    ctx.lineTo(s.x + 12, s.y + 2)
    ctx.lineTo(s.x - 12, s.y + 2)
    ctx.closePath()
    ctx.fillStyle = "#ffd45e"
    ctx.fill()
    ctx.strokeStyle = "#5b4450"
    ctx.lineWidth = 1.4
    ctx.stroke()
    ctx.fillStyle = "#5b4450"
    ctx.font = '700 11px "Baloo 2", Nunito, sans-serif'
    ctx.textAlign = "center"
    ctx.fillText("!", s.x, s.y + 0.5)
  }

  // car
  ctx.save()
  ctx.translate(c.x, c.y)
  ctx.rotate(c.a)
  ctx.beginPath()
  ctx.ellipse(1, 4, 20, 11, 0, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(0,0,0,0.2)"
  ctx.fill()
  // wheels
  ctx.fillStyle = "#3b3340"
  round(ctx, -13, -13, 9, 6, 3)
  ctx.fill()
  round(ctx, -13, 7, 9, 6, 3)
  ctx.fill()
  round(ctx, 6, -13, 9, 6, 3)
  ctx.fill()
  round(ctx, 6, 7, 9, 6, 3)
  ctx.fill()
  // body
  const body = ctx.createLinearGradient(-18, -10, 18, 10)
  body.addColorStop(0, "#ffd3e0")
  body.addColorStop(0.5, "#ff9fbb")
  body.addColorStop(1, "#ef6b92")
  round(ctx, -18, -11, 36, 22, 8)
  ctx.fillStyle = body
  ctx.fill()
  ctx.strokeStyle = "#5b4450"
  ctx.lineWidth = 1.6
  ctx.stroke()
  // windows
  ctx.fillStyle = "#dff1ff"
  round(ctx, -2, -8, 12, 16, 4)
  ctx.fill()
  ctx.strokeStyle = "rgba(91,68,80,0.5)"
  ctx.lineWidth = 1
  ctx.stroke()
  round(ctx, -11, -7, 7, 14, 3)
  ctx.fillStyle = "#eaf7ff"
  ctx.fill()
  // headlights + brake light
  ctx.fillStyle = "#fff6d0"
  ctx.beginPath()
  ctx.arc(17, -6, 2.4, 0, Math.PI * 2)
  ctx.arc(17, 6, 2.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = c.v < -1 ? "#ff5d5d" : "#c4576b"
  ctx.beginPath()
  ctx.arc(-17, -6, 2, 0, Math.PI * 2)
  ctx.arc(-17, 6, 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function round(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
