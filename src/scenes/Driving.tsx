import { useEffect, useRef, useState } from "react"
import { useGame } from "../hooks/GameContext"
import { GameButton, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"
import { clamp } from "../lib/random"

type Level = {
  id: number
  name: string
  goal: string
}

const LEVELS: Level[] = [
  { id: 1, name: "Traffic signs", goal: "roll over every sign" },
  { id: 2, name: "Parking", goal: "stop inside the dashed box" },
  { id: 3, name: "Roundabout", goal: "complete a full loop" },
  { id: 4, name: "Parallel parking boss", goal: "slide into the tiny space" },
  { id: 5, name: "Driving Test", goal: "survive with style" },
]

type Car = { x: number; y: number; a: number; v: number }

export function Driving() {
  const { notify, play, patch, save, completeLevel, addStars } = useGame()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const car = useRef<Car>({ x: 80, y: 220, a: -Math.PI / 2, v: 0 })
  const keys = useRef({ l: false, r: false, u: false, d: false })
  const [level, setLevel] = useState(save.drivingLevel)
  const [signs, setSigns] = useState([0, 1, 2])
  const [msg, setMsg] = useState(LEVELS[Math.max(0, save.drivingLevel - 1)]?.goal ?? "")

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.l = true
      if (e.key === "ArrowRight" || e.key === "d") keys.current.r = true
      if (e.key === "ArrowUp" || e.key === "w") keys.current.u = true
      if (e.key === "ArrowDown" || e.key === "s") keys.current.d = true
      if (e.key === " " || e.key === "h") {
        play("horn")
        notify("HONK")
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keys.current.l = false
      if (e.key === "ArrowRight" || e.key === "d") keys.current.r = false
      if (e.key === "ArrowUp" || e.key === "w") keys.current.u = false
      if (e.key === "ArrowDown" || e.key === "s") keys.current.d = false
    }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    let raf = 0
    const tick = () => {
      const c = car.current
      if (keys.current.l) c.a -= 0.05
      if (keys.current.r) c.a += 0.05
      if (keys.current.u) c.v = clamp(c.v + 0.12, -2.2, 3.2)
      else if (keys.current.d) c.v = clamp(c.v - 0.16, -2.2, 3.2)
      else c.v *= 0.96
      c.x = clamp(c.x + Math.cos(c.a) * c.v, 20, 340)
      c.y = clamp(c.y + Math.sin(c.a) * c.v, 20, 300)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (canvas && ctx) draw(ctx, canvas, c, level, signs)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [level, notify, play, signs])

  const pass = () => {
    play("chime")
    notify(level === 4 ? "parallel parking has entered the arena" : "driving aura increased")
    const next = Math.min(5, level + 1)
    setLevel(next)
    patch((s) => ({ ...s, drivingLevel: Math.max(s.drivingLevel, next) }))
    if (next >= 5 && !save.licenceAcquired) {
      patch((s) => ({ ...s, licenceAcquired: true }))
      completeLevel("driving")
      addStars(2)
      notify("LICENCE ACQUIRED")
    }
    setMsg(LEVELS[next - 1]?.goal ?? "done")
    car.current = { x: 80, y: 220, a: -Math.PI / 2, v: 0 }
    setSigns([0, 1, 2])
  }

  return (
    <PageShell title="Driving Licence Quest" area="driving" tint="#d9efe4">
      <Tag>level {level}/5 · {LEVELS[level - 1]?.name} · student driver pls survive</Tag>
      <p className="mb-2 font-hand text-sm">{msg}</p>
      <canvas
        ref={canvasRef}
        width={360}
        height={320}
        data-testid="driving-canvas"
        className="mx-auto block w-full max-w-md touch-none rounded-[1.4rem] border-2 border-ink/10 bg-[#9ec9a8]"
      />
      <div className="mx-auto mt-3 grid max-w-md grid-cols-3 gap-2">
        <GameButton onClick={() => { keys.current.l = true; window.setTimeout(() => (keys.current.l = false), 180) }}>←</GameButton>
        <GameButton
          tone="mint"
          onClick={() => {
            keys.current.u = true
            window.setTimeout(() => (keys.current.u = false), 240)
          }}
        >
          accel
        </GameButton>
        <GameButton onClick={() => { keys.current.r = true; window.setTimeout(() => (keys.current.r = false), 180) }}>→</GameButton>
        <GameButton
          onClick={() => {
            play("horn")
            notify("mirror check +100")
          }}
        >
          horn
        </GameButton>
        <GameButton
          onClick={() => {
            keys.current.d = true
            window.setTimeout(() => (keys.current.d = false), 240)
          }}
        >
          brake
        </GameButton>
        <GameButton tone="pink" testid="driving-pass" onClick={pass}>
          I did the thing
        </GameButton>
      </div>
      {save.licenceAcquired && (
        <div className="mx-auto mt-4 max-w-xs rounded-2xl bg-white p-4 text-center shadow">
          <p className="font-hand text-lg">🏁 LICENCE ACQUIRED</p>
          <p className="font-hand text-sm">tiny fictional licence · cones: traumatized</p>
        </div>
      )}
    </PageShell>
  )
}

function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, c: Car, level: number, signs: number[]) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#7d8b99"
  ctx.fillRect(40, 40, 280, 240)
  ctx.strokeStyle = "#fff3c4"
  ctx.setLineDash([10, 10])
  ctx.beginPath()
  ctx.moveTo(180, 40)
  ctx.lineTo(180, 280)
  ctx.stroke()
  ctx.setLineDash([])
  if (level === 3) {
    ctx.beginPath()
    ctx.arc(180, 160, 56, 0, Math.PI * 2)
    ctx.strokeStyle = "#fff"
    ctx.stroke()
  }
  if (level === 2 || level === 4 || level === 5) {
    ctx.strokeStyle = "#fff"
    ctx.setLineDash([6, 4])
    ctx.strokeRect(level === 4 ? 210 : 130, 200, 70, 40)
    ctx.setLineDash([])
  }
  signs.forEach((s) => {
    ctx.fillStyle = "#fff3c4"
    ctx.fillRect(70 + s * 80, 70, 22, 22)
    ctx.fillStyle = "#4a3f55"
    ctx.font = "12px Nunito"
    ctx.fillText("!", 78 + s * 80, 86)
  })
  ctx.save()
  ctx.translate(c.x, c.y)
  ctx.rotate(c.a)
  ctx.fillStyle = "#ffb3c6"
  ctx.strokeStyle = "#4a3f55"
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(-16, -10, 32, 20, 6)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = "#a8d8ea"
  ctx.fillRect(2, -7, 10, 14)
  ctx.restore()
}
