import { useRef, useState, type PointerEvent } from "react"
import { ART_KEY } from "../game/types"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const COLORS = ["#ff8fab", "#8fd9b0", "#fff3c4", "#8ecae6", "#c4b0ea", "#ffffff", "#4a3f55", "#f4d35e"]
const STAMPS = ["fish", "nini", "pony", "burger", "star", "ufo", "fruit", "ice"] as const

export function ArtStudio() {
  const { notify, play, patch, completeLevel, save, addStars } = useGame()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const undo = useRef<ImageData[]>([])
  const [color, setColor] = useState("#ff8fab")
  const [size, setSize] = useState(8)
  const [layer, setLayer] = useState<"draw" | "stamp">("draw")

  const pos = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const r = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / r.width) * canvas.width,
      y: ((e.clientY - r.top) / r.height) * canvas.height,
    }
  }

  const snapshot = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    undo.current = [...undo.current.slice(-24), ctx.getImageData(0, 0, canvas.width, canvas.height)]
  }

  const persistArt = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      sessionStorage.setItem(ART_KEY, canvas.toDataURL("image/jpeg", 0.7))
    } catch {
      /* ignore */
    }
    if (!save.artDrawn) {
      patch((s) => ({ ...s, artDrawn: true }))
      completeLevel("art")
      addStars(1)
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

  const stampAt = (x: number, y: number, kind: (typeof STAMPS)[number]) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    snapshot()
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = color
    ctx.font = "28px Patrick Hand"
    const glyph: Record<string, string> = {
      fish: "🐟",
      nini: "🐕",
      pony: "🐴",
      burger: "🍔",
      star: "⭐",
      ufo: "👽",
      fruit: "🍓",
      ice: "🍦",
    }
    ctx.fillText(glyph[kind] ?? "★", -12, 10)
    ctx.restore()
    play("pop")
    persistArt()
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement("a")
    a.href = canvas.toDataURL("image/png")
    a.download = "tiny-art.png"
    a.click()
    notify("artwork exported. museum pending")
  }

  return (
    <PageShell title="Digital Art Studio" area="art" tint="#fff4dc">
      <Tag>tablet · layers · stamps · undo</Tag>
      <Panel className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-3xl border-2 border-ink/15 bg-[#1c2430]">
          <canvas
            ref={canvasRef}
            width={400}
            height={260}
            data-testid="art-canvas"
            className="block h-52 w-full touch-none cursor-crosshair sm:h-64"
            aria-label="drawing canvas"
            onPointerDown={(e) => {
              if (layer === "stamp") {
                const p = pos(e)
                stampAt(p.x, p.y, "star")
                return
              }
              snapshot()
              drawing.current = true
              last.current = pos(e)
              e.currentTarget.setPointerCapture(e.pointerId)
              paint(e)
            }}
            onPointerMove={paint}
            onPointerUp={() => {
              drawing.current = false
              last.current = null
              persistArt()
            }}
            onPointerCancel={() => {
              drawing.current = false
              last.current = null
            }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {COLORS.map((c) => (
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
        <label className="mt-2 block font-hand text-sm">
          brush
          <input type="range" min={3} max={22} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-1 block w-full" />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {STAMPS.map((s) => (
            <GameButton key={s} onClick={() => { setLayer("stamp"); stampAt(60 + Math.random() * 260, 50 + Math.random() * 140, s) }}>
              {s}
            </GameButton>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <GameButton
            onClick={() => {
              const canvas = canvasRef.current
              const ctx = canvas?.getContext("2d")
              const prev = undo.current.pop()
              if (canvas && ctx && prev) ctx.putImageData(prev, 0, 0)
              else notify("nothing to undo. artist moment")
              setLayer("draw")
            }}
          >
            undo
          </GameButton>
          <GameButton
            tone="pink"
            onClick={() => {
              const canvas = canvasRef.current
              const ctx = canvas?.getContext("2d")
              if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
              notify("blank canvas. dangerous")
            }}
          >
            clear
          </GameButton>
          <GameButton tone="mint" onClick={download}>
            download
          </GameButton>
          <GameButton onClick={() => setLayer("draw")}>draw mode</GameButton>
        </div>
      </Panel>
    </PageShell>
  )
}
