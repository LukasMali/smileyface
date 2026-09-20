import { useEffect, useRef } from "react"
import { useWorld } from "../../hooks/WorldContext"

export function PlayLayer() {
  const { poke, addFun, fun, pops, summonAlien } = useWorld()
  const last = useRef(0)

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      const now = performance.now()
      if (now - last.current < 40) return
      last.current = now
      poke(e.clientX, e.clientY)
    }
    const onClick = (e: MouseEvent) => {
      poke(e.clientX, e.clientY)
      addFun(1)
      if (Math.random() < 0.08) summonAlien()
    }
    window.addEventListener("pointermove", onPointer, { passive: true })
    window.addEventListener("click", onClick)
    return () => {
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("click", onClick)
    }
  }, [addFun, poke, summonAlien])

  return (
    <>
      <div className="pointer-events-none fixed top-3 left-1/2 z-[85] -translate-x-1/2 rounded-full border-2 border-ink/10 bg-white/90 px-3 py-1 font-hand text-sm text-ink shadow-[3px_4px_0_rgba(74,63,85,0.08)]">
        fun energy: {fun} · tap / drag / doodle / honk
      </div>
      <div className="pointer-events-none fixed inset-0 z-[75]">
        {pops.map((p) => (
          <span
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-lg"
            style={{ left: p.x, top: p.y, animation: "popfade 0.7s ease-out forwards" }}
          >
            {p.kind === "heart" ? "♡" : p.kind === "coin" ? "€" : p.kind === "spark" ? "✦" : "★"}
          </span>
        ))}
      </div>
    </>
  )
}
