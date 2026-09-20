import { ChevronDown } from "lucide-react"
import { useWorld } from "../hooks/WorldContext"
import { Fish } from "./characters/Fish"
import { EasterEgg } from "./ui/EasterEgg"
import { Floating, Scene } from "./ui/Floating"
import { Star } from "./ui/SparkleBurst"

export function Hero() {
  return (
    <Scene className="min-h-[92svh] bg-linear-to-b from-sky via-cream to-mint pt-8">
      <ClickCloud className="top-8 left-[8%] w-28 opacity-90" />
      <ClickCloud className="top-16 right-[12%] w-36 opacity-80" />
      <ClickCloud className="top-40 left-[40%] w-24 opacity-70" />
      <div className="pointer-events-none absolute inset-0">
        <Star className="absolute top-24 left-[22%]" />
        <Star className="absolute top-16 right-[28%]" size={18} />
        <Star className="absolute top-36 right-[8%]" size={12} />
        <Star className="absolute bottom-40 left-[14%]" size={16} />
      </div>

      <EasterEgg label="tiny star easter egg" className="top-10 left-6">
        <Star size={20} />
      </EasterEgg>
      <EasterEgg label="sparkle easter egg" className="top-12 right-8">
        <Star size={18} />
      </EasterEgg>

      <Floating className="absolute top-28 right-[18%]" delay={0.4}>
        <Fish color="#ffb3c6" fin="#fff3c4" size={64} extra="none" />
      </Floating>
      <Floating className="absolute bottom-36 left-[10%]" delay={1.2} slow>
        <Fish color="#c4b0ea" fin="#c5e8f7" size={54} flip extra="none" />
      </Floating>

      <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-3xl flex-col items-center justify-center px-5 text-center">
        <p className="label-sticker mb-5 rotate-2 text-sm text-ink-soft">
          made for one very sweet human
        </p>
        <h1 className="max-w-xl font-hand text-3xl leading-tight text-ink sm:text-4xl">
          a tiny world made of things that remind me of you ✨
        </h1>
        <div className="mt-10 flex items-center gap-3">
          <DoodleStar />
          <DoodleHeart />
          <DoodleFish />
        </div>
        <p className="mt-4 font-hand text-sm text-ink-soft">tap the clouds. tap the fish. tap everything.</p>
        <a
          href="#ice-cream"
          className="mt-16 flex flex-col items-center gap-1 text-ink-soft no-underline"
          aria-label="scroll down to explore"
        >
          <span className="font-hand text-sm">come explore</span>
          <ChevronDown className="anim-bob h-8 w-8" />
        </a>
      </div>
    </Scene>
  )
}

function ClickCloud({ className }: { className: string }) {
  const { notify, addFun } = useWorld()
  return (
    <button
      type="button"
      aria-label="bouncy cloud"
      className={`absolute z-10 border-0 bg-transparent p-0 ${className}`}
      onClick={() => {
        addFun(1)
        notify("cloud: boing")
      }}
    >
      <svg viewBox="0 0 120 50" className="anim-float-slow w-full" aria-hidden>
        <ellipse cx="38" cy="30" rx="28" ry="16" fill="#fff" />
        <ellipse cx="62" cy="24" rx="24" ry="18" fill="#fff" />
        <ellipse cx="86" cy="32" rx="22" ry="14" fill="#fff" />
      </svg>
    </button>
  )
}

function DoodleStar() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="anim-bob" aria-hidden>
      <path fill="#fff3c4" stroke="#4a3f55" strokeWidth="1.4" d="M18 3 22 14h12L24 21l4 12-10-7-10 7 4-12L2 14h12z" />
    </svg>
  )
}

function DoodleHeart() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="anim-bob" style={{ animationDelay: "0.4s" }} aria-hidden>
      <path
        fill="#ffd6e0"
        stroke="#4a3f55"
        strokeWidth="1.4"
        d="M16 28s-12-8-12-16a7 7 0 0 1 12-5 7 7 0 0 1 12 5c0 8-12 16-12 16z"
      />
    </svg>
  )
}

function DoodleFish() {
  return (
    <svg width="40" height="28" viewBox="0 0 40 28" className="anim-bob" style={{ animationDelay: "0.8s" }} aria-hidden>
      <ellipse cx="22" cy="14" rx="12" ry="8" fill="#c5e8f7" stroke="#4a3f55" strokeWidth="1.3" />
      <polygon points="8,14 0,6 0,22" fill="#e0d4f7" stroke="#4a3f55" strokeWidth="1.2" />
      <circle cx="28" cy="12" r="2" fill="#2a2430" />
    </svg>
  )
}
