import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Nikki } from "../art/Nikki"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Pill } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

type Ing = "patty" | "cheese" | "lettuce" | "tomato" | "pickles" | "sauce" | "egg" | "onion"

const MENU: { id: Ing; label: string }[] = [
  { id: "patty", label: "patty" },
  { id: "cheese", label: "cheese" },
  { id: "lettuce", label: "lettuce" },
  { id: "tomato", label: "tomato" },
  { id: "pickles", label: "pickles" },
  { id: "sauce", label: "sauce" },
  { id: "egg", label: "fried egg" },
  { id: "onion", label: "onion rings" },
]

export function Burger() {
  const { notify, play, patch, save, completeLevel, addStars, reducedMotion } = useGame()
  const [stack, setStack] = useState<Ing[]>([])
  const [collapsed, setCollapsed] = useState(false)
  const height = stack.length + 2
  const lean = Math.min(11, Math.max(0, stack.length - 2) * 1.4)

  const add = (id: Ing) => {
    if (collapsed) return
    const next = [...stack, id]
    setStack(next)
    play("pop")
    patch((s) => ({ ...s, burgerHeight: Math.max(s.burgerHeight, next.length + 2) }))
    if (next.length === 6) notify("structural integrity: questionable")
    if (next.length >= 7 && !save.completedLevels.includes("burger")) {
      completeLevel("burger")
      addStars(1)
    }
    if (next.length >= 11) {
      setCollapsed(true)
      play("whoosh")
      notify("the burger fell over dramatically. everyone clapped.")
    }
  }

  return (
    <PageShell
      title="Burger Stop"
      area="burger"
      subtitle="assemble a ridiculous burger · physics is a suggestion"
      tint="linear-gradient(180deg,#fff6e6 0%,#ffeed6 55%,#ffe2e8 100%)"
      aside={<Pill className="bg-butter">tallest {save.burgerHeight}</Pill>}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
        <Panel className="relative min-h-[22rem] overflow-hidden bg-white/88">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-peach/50 to-transparent" />
          <motion.div
            className="relative z-10 flex h-full flex-col items-center justify-end pb-6"
            animate={{ rotate: collapsed ? 74 : lean, y: collapsed ? 40 : 0, x: collapsed ? 30 : 0 }}
            transition={{ type: "spring", stiffness: collapsed ? 120 : 220, damping: collapsed ? 12 : 18 }}
            style={{ transformOrigin: "bottom center" }}
          >
            <TopBun />
            <AnimatePresence>
              {[...stack].reverse().map((id, i) => (
                <motion.div
                  key={`${id}-${stack.length - i}`}
                  initial={reducedMotion ? false : { y: -60, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 420, damping: 16 }}
                  style={{ marginTop: -6, zIndex: 20 - i }}
                >
                  <Layer id={id} />
                </motion.div>
              ))}
            </AnimatePresence>
            <div style={{ marginTop: -6 }}>
              <BottomBun />
            </div>
          </motion.div>

          {stack.length >= 6 && (
            <div className="absolute right-2 bottom-2 z-20 text-right">
              <Nikki pose="sit" size={86} />
              <p className="font-hand text-xs text-ink-soft">very invested</p>
            </div>
          )}
        </Panel>

        <Panel className="bg-white/88">
          <p className="mb-2 font-hand text-sm">
            height {height} layers {collapsed ? "· currently on the floor" : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {MENU.map((m) => (
              <GameButton key={m.id} size="sm" tone="sun" onClick={() => add(m.id)} disabled={collapsed}>
                {m.label}
              </GameButton>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <GameButton
              tone="pink"
              onClick={() => {
                setStack([])
                setCollapsed(false)
                notify(collapsed ? "new burger. lessons unlearned." : "eaten. respectfully.")
                play("chime")
              }}
            >
              {collapsed ? "rebuild" : "eat it"}
            </GameButton>
            <GameButton
              tone="mint"
              onClick={() => {
                notify("Nini has inspected the burger. approved. extra pats recommended.")
                play("bark")
              }}
            >
              ask Nini for approval
            </GameButton>
          </div>
          <p className="mt-3 font-hand text-xs text-ink-soft">
            11 layers is the known limit of this universe. it will fall. that is the fun part.
          </p>
        </Panel>
      </div>
    </PageShell>
  )
}

function TopBun() {
  return (
    <svg width="190" height="70" viewBox="0 0 190 70" aria-hidden className="drop-shadow-sm">
      <defs>
        <linearGradient id="bun-top" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#f8d9ac" />
          <stop offset="60%" stopColor="#e8bb84" />
          <stop offset="100%" stopColor="#d49f66" />
        </linearGradient>
      </defs>
      <path d="M8 60C8 26 42 8 95 8s87 18 87 52z" fill="url(#bun-top)" stroke="#5b4450" strokeWidth="2.4" strokeLinejoin="round" />
      <g fill="#fff8ec">
        <ellipse cx="58" cy="34" rx="5" ry="3" transform="rotate(-18 58 34)" />
        <ellipse cx="96" cy="24" rx="4.4" ry="2.8" />
        <ellipse cx="132" cy="34" rx="4.6" ry="2.8" transform="rotate(20 132 34)" />
        <ellipse cx="78" cy="46" rx="4" ry="2.4" transform="rotate(-8 78 46)" />
        <ellipse cx="118" cy="48" rx="4" ry="2.4" transform="rotate(12 118 48)" />
      </g>
    </svg>
  )
}

function BottomBun() {
  return (
    <svg width="186" height="44" viewBox="0 0 186 44" aria-hidden className="drop-shadow-md">
      <path d="M6 6c18-8 156-8 174 0 0 24-26 34-87 34S6 30 6 6z" fill="#e0ae74" stroke="#5b4450" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M12 10c22 8 140 8 162 0" stroke="#f6d9ac" strokeWidth="4" fill="none" opacity="0.7" />
    </svg>
  )
}

function Layer({ id }: { id: Ing }) {
  switch (id) {
    case "patty":
      return (
        <svg width="180" height="30" viewBox="0 0 180 30" aria-hidden>
          <rect x="4" y="4" width="172" height="22" rx="11" fill="#8a4a2c" stroke="#5b4450" strokeWidth="2.2" />
          <path d="M18 12c26-6 120-6 146 0" stroke="#a45c37" strokeWidth="3" fill="none" />
        </svg>
      )
    case "cheese":
      return (
        <svg width="188" height="30" viewBox="0 0 188 30" aria-hidden>
          <path d="M8 6h172l-10 12c-6 8-14 4-22 8s-18 2-26-2-16 4-26 2-16-8-26-6-16 2-24-4z" fill="#ffd45e" stroke="#e0aa33" strokeWidth="2" strokeLinejoin="round" />
          <path d="M40 12h20M100 14h18" stroke="#fff3c4" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case "lettuce":
      return (
        <svg width="192" height="26" viewBox="0 0 192 26" aria-hidden>
          <path
            d="M6 14c6-10 18-4 24-10 6 8 18 2 24 8 6-10 18-4 24-8 6 8 18 0 24 6 6-8 18-2 24-6 6 8 18 4 24 10-8 10-20 4-28 6-8 2-18-4-26 0s-18 2-26-2-18 6-26 2-20 0-28-6z"
            fill="#7fd3a1"
            stroke="#3c8159"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "tomato":
      return (
        <svg width="178" height="26" viewBox="0 0 178 26" aria-hidden>
          <g>
            {[24, 74, 124].map((x) => (
              <g key={x}>
                <circle cx={x} cy="13" r="12" fill="#ef6b92" stroke="#c94f74" strokeWidth="2" />
                <circle cx={x} cy="13" r="6.4" fill="#ff9bb5" />
              </g>
            ))}
            <circle cx="154" cy="13" r="10" fill="#ef6b92" stroke="#c94f74" strokeWidth="2" />
          </g>
        </svg>
      )
    case "pickles":
      return (
        <svg width="172" height="22" viewBox="0 0 172 22" aria-hidden>
          {[20, 60, 100, 140].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="11" rx="14" ry="8" fill="#8fc96a" stroke="#5f9a43" strokeWidth="2" />
              <circle cx={x - 4} cy="10" r="1.6" fill="#d6ecbf" />
              <circle cx={x + 4} cy="13" r="1.6" fill="#d6ecbf" />
            </g>
          ))}
        </svg>
      )
    case "sauce":
      return (
        <svg width="184" height="20" viewBox="0 0 184 20" aria-hidden>
          <path
            d="M10 12c14-10 26 6 38-2s24 10 36 0 26 8 38-2 24 8 52 4"
            fill="none"
            stroke="#ffb0c4"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      )
    case "egg":
      return (
        <svg width="180" height="34" viewBox="0 0 180 34" aria-hidden>
          <path d="M18 18c0-10 16-14 36-12s34-4 54 0 40 2 46 12c4 8-12 14-44 14-42 0-92 2-92-14z" fill="#fffaf0" stroke="#e5d3b4" strokeWidth="2" />
          <ellipse cx="76" cy="17" rx="13" ry="9" fill="#ffc94d" stroke="#e3a92c" strokeWidth="1.6" />
          <ellipse cx="72" cy="14" rx="4" ry="2.6" fill="#fff" opacity="0.7" />
        </svg>
      )
    default:
      return (
        <svg width="176" height="26" viewBox="0 0 176 26" aria-hidden>
          {[28, 74, 120, 158].map((x) => (
            <g key={x}>
              <circle cx={x} cy="13" r="12" fill="#f0c98a" stroke="#c89257" strokeWidth="2" />
              <circle cx={x} cy="13" r="5.4" fill="#fff6e8" stroke="#c89257" strokeWidth="1.4" />
            </g>
          ))}
        </svg>
      )
  }
}
