import { useEffect, useRef, useState, type RefObject } from "react"
import { createPortal } from "react-dom"

function hsvToHex(h: number, s: number, v: number) {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  }
  const to = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${to(f(5))}${to(f(3))}${to(f(1))}`
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const n = hex.replace("#", "")
  if (n.length !== 6) return { h: 340, s: 0.45, v: 1 }
  const r = parseInt(n.slice(0, 2), 16) / 255
  const g = parseInt(n.slice(2, 4), 16) / 255
  const b = parseInt(n.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s: max === 0 ? 0 : d / max, v: max }
}

function useDesktop() {
  const [desktop, setDesktop] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(min-width: 640px)").matches,
  )
  useEffect(() => {
    const m = window.matchMedia("(min-width: 640px)")
    const on = () => setDesktop(m.matches)
    on()
    m.addEventListener("change", on)
    return () => m.removeEventListener("change", on)
  }, [])
  return desktop
}

export function ColorWheel({
  color,
  onPick,
}: {
  color: string
  onPick: (hex: string) => void
}) {
  const [open, setOpen] = useState(false)
  const hsv = hexToHsv(color)
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const desktop = useDesktop()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: PointerEvent) => {
      const t = e.target as Node
      if (wrapRef.current?.contains(t) || panelRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener("pointerdown", onDoc)
    return () => document.removeEventListener("pointerdown", onDoc)
  }, [open])

  const applyFromPointer = (clientX: number, clientY: number) => {
    const el = wheelRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = clientX - cx
    const dy = clientY - cy
    const radius = r.width / 2
    const dist = Math.hypot(dx, dy)
    const sat = Math.min(1, dist / radius)
    // CSS conic-gradient starts at 12 o'clock; atan2 is 0 at 3 o'clock
    const hue = (Math.atan2(dy, dx) * (180 / Math.PI) + 90 + 360) % 360
    onPick(hsvToHex(hue, sat, hsv.v))
  }

  const body = (
    <WheelBody
      color={color}
      hsv={hsv}
      wheelRef={wheelRef}
      large={!desktop}
      dragging={dragging}
      applyFromPointer={applyFromPointer}
      onPick={onPick}
    />
  )

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        data-testid="custom-color"
        aria-label="choose your own color"
        aria-expanded={open}
        className={`relative h-9 w-9 rounded-full border-[2.5px] transition-transform ${
          open ? "scale-110 border-ink shadow-[0_0_0_3px_rgba(255,255,255,0.9)]" : "border-ink/12"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="pointer-events-none absolute inset-[3px] rounded-full"
          style={{
            background: "conic-gradient(#ff5c7a, #ffd45e, #7ee0a8, #6ec7ff, #b89cff, #ff5c7a)",
          }}
        />
      </button>
      {open && desktop && (
        <div
          ref={panelRef}
          className="absolute bottom-[calc(100%+0.55rem)] left-0 z-[70] w-[11.5rem] rounded-[1.2rem] border-[1.5px] border-ink/10 bg-white p-3 shadow-[0_18px_30px_-16px_rgba(91,68,80,0.85)]"
        >
          {body}
        </div>
      )}
      {open &&
        !desktop &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-night/45 p-4 backdrop-blur-[2px]"
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-label="color wheel"
              className="w-[min(18rem,calc(100vw-2rem))] rounded-[1.4rem] border-[1.5px] border-ink/10 bg-white p-4 shadow-[0_22px_40px_-18px_rgba(91,68,80,0.9)]"
            >
              {body}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

function WheelBody({
  color,
  hsv,
  wheelRef,
  large,
  dragging,
  applyFromPointer,
  onPick,
}: {
  color: string
  hsv: { h: number; s: number; v: number }
  wheelRef: RefObject<HTMLDivElement | null>
  large: boolean
  dragging: RefObject<boolean>
  applyFromPointer: (x: number, y: number) => void
  onPick: (hex: string) => void
}) {
  return (
    <>
      <p className="mb-2 font-hand text-sm">color wheel</p>
      <div
        ref={wheelRef}
        role="slider"
        aria-label="hue and saturation"
        className={`relative mx-auto cursor-crosshair touch-none rounded-full ${large ? "h-[11.5rem] w-[11.5rem]" : "h-[8.2rem] w-[8.2rem]"}`}
        style={{
          background: `
            radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 68%),
            conic-gradient(#ff3b5c, #ffd45e, #4ade80, #38bdf8, #818cf8, #e879f9, #ff3b5c)
          `,
          boxShadow: "inset 0 0 0 2px rgba(91,68,80,0.18)",
        }}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          applyFromPointer(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return
          applyFromPointer(e.clientX, e.clientY)
        }}
        onPointerUp={() => {
          dragging.current = false
        }}
        onPointerCancel={() => {
          dragging.current = false
        }}
      >
        <span
          className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1.5px_#5b4450]"
          style={{
            left: `${50 + Math.sin((hsv.h * Math.PI) / 180) * hsv.s * 42}%`,
            top: `${50 - Math.cos((hsv.h * Math.PI) / 180) * hsv.s * 42}%`,
            background: color,
          }}
        />
      </div>
      <label className="mt-2 block font-hand text-xs text-ink-soft">
        brightness
        <input
          type="range"
          min={18}
          max={100}
          value={Math.round(hsv.v * 100)}
          aria-label="brightness"
          className="mt-1 block w-full"
          onChange={(e) => onPick(hsvToHex(hsv.h, hsv.s, Number(e.target.value) / 100))}
        />
      </label>
      <div className="mt-2 flex items-center gap-2">
        <span className="h-6 w-6 rounded-full border-[1.5px] border-ink/15" style={{ background: color }} />
        <span className="font-hand text-xs text-ink-soft">{color.toLowerCase()}</span>
      </div>
    </>
  )
}
