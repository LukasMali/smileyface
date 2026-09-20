import { useRef, useState, type ReactNode } from "react"
import { useWorld } from "../hooks/WorldContext"
import { Fish } from "./characters/Fish"
import { Coin, MrAlien } from "./characters/MrAlien"
import { EasterEgg } from "./ui/EasterEgg"
import { Scene, Wave } from "./ui/Floating"

type Flake = { id: number; x: number; y: number }

export function Aquarium() {
  const { addFun } = useWorld()
  const box = useRef<HTMLDivElement>(null)
  const [pointer, setPointer] = useState({ x: 50, y: 45 })
  const [flakes, setFlakes] = useState<Flake[]>([])
  const flakeId = useRef(0)

  const local = (e: { clientX: number; clientY: number }) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return { x: 50, y: 45 }
    return {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    }
  }

  return (
    <Scene className="bg-[#7ec8e3] pb-4">
      <Wave fill="#7ec8e3" />
      <div
        ref={box}
        className="relative mx-auto min-h-[420px] max-w-6xl overflow-hidden px-3 pt-2"
        onPointerMove={(e) => setPointer(local(e))}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("button")) return
          const p = local(e)
          const id = ++flakeId.current
          setFlakes((prev) => [...prev.slice(-12), { id, x: p.x, y: p.y }])
          addFun(1)
          window.setTimeout(() => {
            setFlakes((prev) => prev.filter((f) => f.id !== id))
          }, 1600)
        }}
      >
        <p className="label-sticker relative z-10 mb-2 bg-white/80 text-sm">move around · tap to feed</p>
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="bubble absolute h-3 w-3 rounded-full border border-white/70 bg-white/30"
              style={{
                left: `${8 + i * 9}%`,
                bottom: `${10 + (i % 4) * 8}%`,
                animation: `bubble-up ${4 + (i % 3)}s linear infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
          {flakes.map((f) => (
            <span
              key={f.id}
              className="absolute h-2 w-2 rounded-full bg-butter"
              style={{ left: `${f.x}%`, top: `${f.y}%`, animation: "coin-drop 1.6s ease-in forwards" }}
            />
          ))}
        </div>
        <Seaweed className="absolute bottom-8 left-[6%]" />
        <Seaweed className="absolute bottom-8 left-[22%]" delay="0.5s" />
        <Seaweed className="absolute bottom-8 right-[18%]" delay="1s" />
        <Seaweed className="absolute bottom-8 right-[6%]" delay="0.2s" />

        <div className="relative z-10 min-h-80 py-8">
          <ChasingFish x={pointer.x * 0.9} y={pointer.y * 0.7} delay={0}>
            <Fish color="#ff8fab" fin="#fff3c4" extra="nurse" message="future nurse spotted" />
          </ChasingFish>
          <ChasingFish x={pointer.x * 0.7 + 10} y={pointer.y * 0.5 + 10} delay={0.15}>
            <Fish color="#ffe066" fin="#ffb3c6" extra="car" message="driving exam boss fight" />
          </ChasingFish>
          <ChasingFish x={100 - pointer.x * 0.8} y={pointer.y * 0.6} delay={0.2}>
            <Fish color="#8ecae6" fin="#c4b0ea" extra="coin" message="where money" />
          </ChasingFish>
          <ChasingFish x={pointer.x * 0.5 + 20} y={70 - pointer.y * 0.2} delay={0.1}>
            <Fish color="#ffb3c6" fin="#8fd9b0" extra="burger" flip message="burger?" />
          </ChasingFish>
          <ChasingFish x={30 + pointer.x * 0.2} y={20 + pointer.y * 0.3} delay={0.25}>
            <Fish color="#b8f0d8" fin="#fff3c4" extra="confused" message="blub" />
          </ChasingFish>
          <ChasingFish x={pointer.x * 0.85} y={pointer.y * 0.85} delay={0.05}>
            <div className="relative">
              <Fish color="#c4b0ea" fin="#ffd6e0" size={120} extra="none" message="hello" />
              <Fish
                color="#fff3c4"
                fin="#8ecae6"
                extra="tiny"
                size={48}
                className="absolute -right-4 bottom-0"
                message="hello"
              />
            </div>
          </ChasingFish>
        </div>
        <MrAlien mode="peek" size={72} className="absolute top-10 right-[12%] opacity-80" interactive />
        <EasterEgg label="coin in the aquarium" className="bottom-10 left-10">
          <Coin size={20} />
        </EasterEgg>
      </div>
    </Scene>
  )
}

function ChasingFish({
  x,
  y,
  delay,
  children,
}: {
  x: number
  y: number
  delay: number
  children: ReactNode
}) {
  return (
    <div
      className="absolute transition-transform duration-700 ease-out"
      style={{
        left: `${Math.min(86, Math.max(2, x))}%`,
        top: `${Math.min(70, Math.max(8, y))}%`,
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

function Seaweed({ className, delay = "0s" }: { className: string; delay?: string }) {
  return (
    <svg
      width="28"
      height="90"
      viewBox="0 0 28 90"
      className={`anim-sway ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <path d="M14 90 C4 70 24 50 10 30 C0 18 20 10 14 0" stroke="#3d8f6a" strokeWidth="6" fill="none" />
      <path d="M18 90 C28 64 8 48 20 28" stroke="#5cbc88" strokeWidth="5" fill="none" />
    </svg>
  )
}
