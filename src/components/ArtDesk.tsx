import { useRef, useState, type PointerEvent } from "react"
import { useWorld } from "../hooks/WorldContext"
import { MrAlien } from "./characters/MrAlien"
import { EasterEgg } from "./ui/EasterEgg"
import { Scene, Wave } from "./ui/Floating"

const colors = ["#ff8fab", "#8fd9b0", "#fff3c4", "#8ecae6", "#c4b0ea", "#ffffff", "#4a3f55"]

export function ArtDesk() {
  const { notify, addFun } = useWorld()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const [color, setColor] = useState("#ff8fab")
  const [size, setSize] = useState(6)

  const pos = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const r = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / r.width) * canvas.width,
      y: ((e.clientY - r.top) / r.height) * canvas.height,
    }
  }

  const paint = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !drawing.current) return
    const p = pos(e)
    const prev = last.current ?? p
    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    notify("undo-ish: blank canvas")
  }

  const stamp = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const x = 40 + Math.random() * 280
    const y = 40 + Math.random() * 140
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = "22px Patrick Hand"
    ctx.fillText(pickStamp(), x + 8, y - 8)
    addFun(2)
    notify("stamped a tiny doodle")
  }

  return (
    <Scene className="bg-linear-to-b from-[#fff4dc] to-cream pb-12">
      <Wave fill="#fff4dc" />
      <div className="relative mx-auto max-w-4xl px-4">
        <p className="label-sticker mb-2 text-sm">professional silly doodle department</p>
        <p className="mb-4 font-hand text-xs text-ink-soft">draw on the tablet. yes, with your finger.</p>

        <div className="relative mx-auto grid max-w-2xl gap-4 rounded-[2rem] border-2 border-ink/10 bg-[#f7efe0] p-4 shadow-[8px_10px_0_rgba(74,63,85,0.08)] sm:grid-cols-[1fr_auto]">
          <div className="relative overflow-hidden rounded-3xl border-2 border-ink/15 bg-[#1c2430]">
            <p className="pointer-events-none absolute top-3 left-3 z-10 font-hand text-xs text-white/50">
              tablet screen · drag to draw
            </p>
            <svg viewBox="0 0 220 140" className="pointer-events-none absolute inset-0 h-full w-full opacity-30" aria-hidden>
              <g fill="none" stroke="#8ecae6" strokeWidth="2">
                <ellipse cx="70" cy="80" rx="28" ry="16" />
                <path d="M42 80 L28 68 M42 80 L28 92" />
              </g>
            </svg>
            <canvas
              ref={canvasRef}
              width={360}
              height={220}
              className="relative z-10 block h-52 w-full touch-none cursor-crosshair"
              aria-label="drawing canvas"
              onPointerDown={(e) => {
                drawing.current = true
                last.current = pos(e)
                e.currentTarget.setPointerCapture(e.pointerId)
                addFun(1)
                paint(e)
              }}
              onPointerMove={paint}
              onPointerUp={() => {
                drawing.current = false
                last.current = null
              }}
              onPointerCancel={() => {
                drawing.current = false
                last.current = null
              }}
            />
          </div>

          <div className="flex flex-row flex-wrap items-center gap-3 sm:flex-col">
            <div className="grid grid-cols-4 gap-1 rounded-2xl bg-white p-2 sm:grid-cols-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`color ${c}`}
                  className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-ink scale-110" : "border-ink/10"}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <label className="font-hand text-xs text-ink-soft">
              brush
              <input
                type="range"
                min={3}
                max={18}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="mt-1 block w-24"
              />
            </label>
            <button
              type="button"
              className="rounded-full bg-white px-3 py-2 font-hand text-sm"
              onClick={stamp}
            >
              stamp
            </button>
            <button
              type="button"
              className="rounded-full bg-blush px-3 py-2 font-hand text-sm"
              onClick={clear}
            >
              wipe
            </button>
          </div>
        </div>
        <MrAlien mode="nurse" size={58} className="absolute top-8 right-6" interactive />
        <EasterEgg label="tiny stylus" className="bottom-4 left-8">
          <span className="font-hand text-sm">✎</span>
        </EasterEgg>
      </div>
    </Scene>
  )
}

function pickStamp() {
  const stamps = ["★", "♡", "🐟", "?", "~"]
  return stamps[Math.floor(Math.random() * stamps.length)] as string
}
