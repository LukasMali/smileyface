import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react"
import { ART_KEY } from "../game/types"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Pill } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const CW = 1000
const CH = 820
const PAPER = "#fffaf3"

const COLORS = [
  "#ff8fae",
  "#ef6b92",
  "#ffd45e",
  "#ff9f6b",
  "#8fddb4",
  "#8fcbec",
  "#bfa9f0",
  "#5b4450",
  "#ffffff",
]

type Tool = "brush" | "soft" | "eraser" | "stamp"
type StampKind = "star" | "heart" | "flower" | "cloud" | "fish" | "paw" | "sparkle" | "bow"

const STAMPS: { id: StampKind; label: string }[] = [
  { id: "star", label: "star" },
  { id: "heart", label: "heart" },
  { id: "flower", label: "flower" },
  { id: "cloud", label: "cloud" },
  { id: "fish", label: "fish" },
  { id: "paw", label: "paw" },
  { id: "sparkle", label: "sparkle" },
  { id: "bow", label: "bow" },
]

export function ArtStudio() {
  const { notify, play, patch, completeLevel, save, addStars } = useGame()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const drawing = useRef(false)
  const points = useRef<{ x: number; y: number }[]>([])
  const history = useRef<ImageData[]>([])
  const strokeCount = useRef(0)

  const [color, setColor] = useState("#ff8fae")
  const [width, setWidth] = useState(14)
  const [tool, setTool] = useState<Tool>("brush")
  const [stamp, setStamp] = useState<StampKind>("star")
  const [canUndo, setCanUndo] = useState(false)

  /* set up the canvas once, then never resize the backing store (that is what used to wipe drawings) */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = CW
    canvas.height = CH
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = PAPER
    ctx.fillRect(0, 0, CW, CH)
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctxRef.current = ctx
  }, [])

  const pos = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const r = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - r.left) / r.width) * CW,
      y: ((e.clientY - r.top) / r.height) * CH,
    }
  }

  const snapshot = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    // full-frame snapshots are heavy, so only a few steps of undo are kept
    history.current = [...history.current.slice(-3), ctx.getImageData(0, 0, CW, CH)]
    setCanUndo(true)
  }, [])

  const persistArt = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      sessionStorage.setItem(ART_KEY, canvas.toDataURL("image/jpeg", 0.68))
    } catch {
      /* the room just won't show a preview */
    }
    if (!save.artDrawn) {
      patch((s) => ({ ...s, artDrawn: true }))
      completeLevel("art")
      addStars(1)
    }
  }, [addStars, completeLevel, patch, save.artDrawn])

  /** draw the whole buffered stroke with smooth midpoint curves */
  const renderStroke = useCallback(() => {
    const ctx = ctxRef.current
    const pts = points.current
    if (!ctx || pts.length === 0) return

    ctx.save()
    if (tool === "eraser") {
      ctx.strokeStyle = PAPER
      ctx.lineWidth = width * 1.7
    } else {
      ctx.strokeStyle = color
      ctx.lineWidth = width
      if (tool === "soft") {
        ctx.globalAlpha = 0.32
        ctx.lineWidth = width * 2.1
      }
    }

    if (pts.length === 1) {
      const p = pts[0]!
      ctx.beginPath()
      ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2)
      ctx.fillStyle = ctx.strokeStyle
      ctx.fill()
      ctx.restore()
      return
    }

    ctx.beginPath()
    ctx.moveTo(pts[0]!.x, pts[0]!.y)
    for (let i = 1; i < pts.length - 1; i++) {
      const a = pts[i]!
      const b = pts[i + 1]!
      ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2)
    }
    const last = pts[pts.length - 1]!
    ctx.lineTo(last.x, last.y)
    ctx.stroke()
    ctx.restore()
  }, [color, tool, width])

  const placeStamp = (x: number, y: number) => {
    const ctx = ctxRef.current
    if (!ctx) return
    snapshot()
    drawStamp(ctx, stamp, x, y, 46 + width * 1.6, color)
    play("pop")
    persistArt()
  }

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const p = pos(e)
    if (tool === "stamp") {
      placeStamp(p.x, p.y)
      return
    }
    snapshot()
    drawing.current = true
    points.current = [p]
    e.currentTarget.setPointerCapture(e.pointerId)
    renderStroke()
  }

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const p = pos(e)
    const pts = points.current
    const prev = pts[pts.length - 1]
    if (prev && Math.hypot(p.x - prev.x, p.y - prev.y) < 1.2) return
    pts.push(p)
    const ctx = ctxRef.current
    if (!ctx || pts.length < 2) return

    ctx.save()
    if (tool === "eraser") {
      ctx.strokeStyle = PAPER
      ctx.lineWidth = width * 1.7
    } else {
      ctx.strokeStyle = color
      ctx.lineWidth = tool === "soft" ? width * 2.1 : width
      if (tool === "soft") ctx.globalAlpha = 0.18
    }
    ctx.beginPath()
    if (pts.length === 2) {
      ctx.moveTo(pts[0]!.x, pts[0]!.y)
      ctx.lineTo(p.x, p.y)
    } else {
      // curve through the midpoints, which keeps fast strokes smooth instead of angular
      const p0 = pts[pts.length - 3]!
      const p1 = pts[pts.length - 2]!
      ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2)
      ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p.x) / 2, (p1.y + p.y) / 2)
    }
    ctx.stroke()
    ctx.restore()
  }

  const onUp = () => {
    if (!drawing.current) return
    drawing.current = false
    // close the line off so the very last flick is not left as a gap
    const pts = points.current
    const ctx = ctxRef.current
    if (ctx && pts.length > 2) {
      const p1 = pts[pts.length - 2]!
      const p2 = pts[pts.length - 1]!
      ctx.save()
      if (tool === "eraser") {
        ctx.strokeStyle = PAPER
        ctx.lineWidth = width * 1.7
      } else {
        ctx.strokeStyle = color
        ctx.lineWidth = tool === "soft" ? width * 2.1 : width
        if (tool === "soft") ctx.globalAlpha = 0.18
      }
      ctx.beginPath()
      ctx.moveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
      ctx.restore()
    }
    points.current = []
    strokeCount.current += 1
    persistArt()
    if (strokeCount.current === 6) notify("this is going somewhere. keep going")
  }

  const undo = () => {
    const ctx = ctxRef.current
    const prev = history.current.pop()
    if (ctx && prev) {
      ctx.putImageData(prev, 0, 0)
      persistArt()
      play("click")
    } else {
      notify("nothing left to undo. bold choices only")
    }
    setCanUndo(history.current.length > 0)
  }

  const clear = () => {
    const ctx = ctxRef.current
    if (!ctx) return
    snapshot()
    ctx.fillStyle = PAPER
    ctx.fillRect(0, 0, CW, CH)
    notify("blank paper. slightly threatening")
    persistArt()
  }

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement("a")
    a.href = canvas.toDataURL("image/png")
    a.download = "tiny-art.png"
    a.click()
    notify("saved to your device. museum pending")
    play("chime")
  }

  return (
    <PageShell
      title="Digital Art Studio"
      area="art"
      tint="linear-gradient(180deg,#fff6ea 0%,#ffeede 55%,#fde7ef 100%)"
      aside={<Pill className="bg-lilac">{tool}</Pill>}
    >
      <Panel className="mx-auto max-w-3xl">
        <div className="relative rounded-[1.4rem] border-[3px] border-ink/15 bg-white shadow-[inset_0_2px_14px_rgba(91,68,80,0.12)]">
          {/* washi tape corners, so the paper feels taped to a desk */}
          <span className="pointer-events-none absolute -top-2 -left-3 z-10 h-5 w-14 -rotate-12 rounded-sm bg-blush/80 shadow-sm" />
          <span className="pointer-events-none absolute -top-2 -right-3 z-10 h-5 w-14 rotate-12 rounded-sm bg-mint/80 shadow-sm" />
          <canvas
            ref={canvasRef}
            data-testid="art-canvas"
            className="block w-full touch-none cursor-crosshair rounded-[1.15rem] select-none"
            style={{ aspectRatio: `${CW} / ${CH}` }}
            aria-label="drawing canvas"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          />
          <span className="pointer-events-none absolute inset-0 rounded-[1.2rem] shadow-[inset_0_0_40px_rgba(91,68,80,0.08)]" />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`color ${c}`}
              aria-pressed={color === c}
              className={`h-9 w-9 rounded-full border-[2.5px] transition-transform ${
                color === c ? "scale-110 border-ink shadow-[0_0_0_3px_rgba(255,255,255,0.9)]" : "border-ink/12"
              }`}
              style={{ background: c }}
              onClick={() => {
                setColor(c)
                if (tool === "eraser") setTool("brush")
                play("click")
              }}
            />
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block font-hand text-sm">
            brush size · {width}
            <input
              type="range"
              min={3}
              max={54}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="mt-1 block w-full"
              aria-label="brush size"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {(["brush", "soft", "eraser", "stamp"] as Tool[]).map((t) => (
              <GameButton
                key={t}
                size="sm"
                tone={tool === t ? "pink" : "cream"}
                onClick={() => {
                  setTool(t)
                  play("click")
                }}
              >
                {t}
              </GameButton>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className="mb-1 font-hand text-sm">stamps · pick one, then tap the paper</p>
          <div className="flex flex-wrap gap-2">
            {STAMPS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-label={`${s.label} stamp`}
                aria-pressed={stamp === s.id && tool === "stamp"}
                className={`hit-area flex flex-col items-center gap-0.5 rounded-2xl border-[1.5px] px-2.5 py-1.5 font-hand text-[0.7rem] transition-transform active:scale-95 ${
                  stamp === s.id ? "border-ink/25 bg-blush" : "border-ink/10 bg-white"
                }`}
                onClick={() => {
                  setStamp(s.id)
                  setTool("stamp")
                  play("click")
                }}
              >
                <StampPreview kind={s.id} color={color} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <GameButton size="sm" disabled={!canUndo} onClick={undo}>
            undo
          </GameButton>
          <GameButton size="sm" tone="lilac" onClick={clear}>
            clear
          </GameButton>
          <GameButton size="sm" tone="mint" onClick={download}>
            save to device
          </GameButton>
          <GameButton
            size="sm"
            tone="sun"
            onClick={() => {
              persistArt()
              notify("pinned to the second monitor in your room")
              play("chime")
            }}
          >
            hang in my room
          </GameButton>
        </div>
      </Panel>
    </PageShell>
  )
}

function StampPreview({ kind, color }: { kind: StampKind; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    canvas.width = 56
    canvas.height = 56
    ctx.clearRect(0, 0, 56, 56)
    drawStamp(ctx, kind, 28, 28, 40, color)
  }, [color, kind])
  return <canvas ref={ref} className="h-7 w-7" aria-hidden />
}

/* ---------- vector stamps, drawn on canvas so they match the world's art ---------- */

function drawStamp(
  ctx: CanvasRenderingContext2D,
  kind: StampKind,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  const s = size / 2
  ctx.save()
  ctx.translate(x, y)
  ctx.lineJoin = "round"
  ctx.lineCap = "round"
  ctx.strokeStyle = "#5b4450"
  ctx.lineWidth = Math.max(1.4, size * 0.055)
  ctx.fillStyle = color

  const stroke = () => {
    ctx.fill()
    ctx.stroke()
  }

  switch (kind) {
    case "star": {
      ctx.beginPath()
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? s : s * 0.46
        const a = (Math.PI / 5) * i - Math.PI / 2
        const px = Math.cos(a) * r
        const py = Math.sin(a) * r
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      stroke()
      break
    }
    case "heart": {
      ctx.beginPath()
      ctx.moveTo(0, s * 0.85)
      ctx.bezierCurveTo(-s * 1.35, -s * 0.15, -s * 0.55, -s * 1.05, 0, -s * 0.4)
      ctx.bezierCurveTo(s * 0.55, -s * 1.05, s * 1.35, -s * 0.15, 0, s * 0.85)
      ctx.closePath()
      stroke()
      break
    }
    case "flower": {
      for (let i = 0; i < 5; i++) {
        ctx.save()
        ctx.rotate((Math.PI * 2 * i) / 5)
        ctx.beginPath()
        ctx.ellipse(0, -s * 0.55, s * 0.34, s * 0.55, 0, 0, Math.PI * 2)
        stroke()
        ctx.restore()
      }
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = "#ffd45e"
      stroke()
      break
    }
    case "cloud": {
      ctx.beginPath()
      ctx.arc(-s * 0.45, s * 0.1, s * 0.45, 0, Math.PI * 2)
      ctx.arc(0, -s * 0.2, s * 0.58, 0, Math.PI * 2)
      ctx.arc(s * 0.5, s * 0.08, s * 0.42, 0, Math.PI * 2)
      ctx.closePath()
      stroke()
      break
    }
    case "fish": {
      ctx.beginPath()
      ctx.moveTo(-s, 0)
      ctx.quadraticCurveTo(-s * 0.2, -s * 0.8, s * 0.55, -s * 0.12)
      ctx.quadraticCurveTo(-s * 0.2, s * 0.8, -s, 0)
      ctx.closePath()
      stroke()
      ctx.beginPath()
      ctx.moveTo(s * 0.5, -s * 0.12)
      ctx.lineTo(s, -s * 0.5)
      ctx.lineTo(s, s * 0.3)
      ctx.closePath()
      stroke()
      ctx.beginPath()
      ctx.arc(-s * 0.45, -s * 0.1, s * 0.12, 0, Math.PI * 2)
      ctx.fillStyle = "#3d3040"
      ctx.fill()
      break
    }
    case "paw": {
      ctx.beginPath()
      ctx.ellipse(0, s * 0.3, s * 0.55, s * 0.45, 0, 0, Math.PI * 2)
      stroke()
      for (const [dx, dy] of [
        [-s * 0.6, -s * 0.35],
        [-s * 0.2, -s * 0.62],
        [s * 0.2, -s * 0.62],
        [s * 0.6, -s * 0.35],
      ] as [number, number][]) {
        ctx.beginPath()
        ctx.ellipse(dx, dy, s * 0.2, s * 0.26, 0, 0, Math.PI * 2)
        stroke()
      }
      break
    }
    case "sparkle": {
      ctx.beginPath()
      ctx.moveTo(0, -s)
      ctx.quadraticCurveTo(s * 0.16, -s * 0.16, s, 0)
      ctx.quadraticCurveTo(s * 0.16, s * 0.16, 0, s)
      ctx.quadraticCurveTo(-s * 0.16, s * 0.16, -s, 0)
      ctx.quadraticCurveTo(-s * 0.16, -s * 0.16, 0, -s)
      ctx.closePath()
      stroke()
      break
    }
    case "bow": {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(-s, -s * 0.8, -s * 0.9, s * 0.1)
      ctx.quadraticCurveTo(-s * 0.8, s * 0.7, 0, 0)
      ctx.closePath()
      stroke()
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(s, -s * 0.8, s * 0.9, s * 0.1)
      ctx.quadraticCurveTo(s * 0.8, s * 0.7, 0, 0)
      ctx.closePath()
      stroke()
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2)
      stroke()
      break
    }
  }
  ctx.restore()
}
