import { useState } from "react"
import { motion } from "framer-motion"
import { MrAlien } from "../art/Alien"
import { Pony, type PonyAccessory } from "../art/Pony"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Pill } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const MANES = ["#ff8fae", "#bfa9f0", "#ffd45e", "#8fddb4", "#8fcbec", "#ffffff"]
const BODIES = ["#ffdbe6", "#d3ecfb", "#ffeec2", "#e6dbff", "#fff6ee", "#d3f4e0"]

type PonyState = {
  id: string
  name: string
  body: string
  mane: string
  accessory?: PonyAccessory
  sleeping?: boolean
  dramatic?: boolean
  line: string
}

const START: PonyState[] = [
  { id: "blush", name: "Blush", body: "#ffdbe6", mane: "#ff8fae", accessory: "nurse", line: "reporting for cuddle duty" },
  { id: "sky", name: "Sky", body: "#d3ecfb", mane: "#8fddb4", accessory: "sign", line: "I passed my exam first try" },
  { id: "snack", name: "Snack", body: "#ffeec2", mane: "#ffb48a", accessory: "burger", dramatic: true, line: "OKAY I GET IT 😭" },
  { id: "eepy", name: "Eepy", body: "#e6dbff", mane: "#bfa9f0", accessory: "sleep", sleeping: true, line: "five more minutes" },
]

export function Ponies() {
  const { notify, play, patch, save, completeLevel, discoverSecret, addStars, poke } = useGame()
  const [ponies, setPonies] = useState<PonyState[]>(START)
  const [active, setActive] = useState(0)
  const [acc, setAcc] = useState<string[]>(save.ponyAccessories)
  const [brushed, setBrushed] = useState(0)
  const current = ponies[active]!

  const setCurrent = (patchPony: Partial<PonyState>) => {
    setPonies((list) => list.map((p, i) => (i === active ? { ...p, ...patchPony } : p)))
  }

  const unlock = (id: string, message: string) => {
    if (!acc.includes(id)) {
      const next = [...acc, id]
      setAcc(next)
      patch((s) => ({ ...s, ponyAccessories: next }))
      play("sparkle")
      notify(message)
      if (next.length >= 3 && !save.completedLevels.includes("ponies")) {
        completeLevel("ponies")
        addStars(1)
      }
    } else {
      notify(message)
    }
  }

  return (
    <PageShell
      title="Pony Meadow"
      area="ponies"
      subtitle="pick a pony · brush · decorate · take a photo"
      tint="linear-gradient(180deg,#e2f4ff 0%,#dff5e3 55%,#f3fbdf 100%)"
      aside={<Pill className="bg-mint">{acc.length} accessories</Pill>}
    >
      <div
        className="stage mx-auto max-w-3xl"
        style={{ background: "linear-gradient(180deg,#cfeeff 0%,#e4f7e7 48%,#b8e59a 100%)" }}
      >
        {/* soft sun, kept out of the stretched backdrop so it stays round */}
        <div
          className="anim-float-slow pointer-events-none absolute top-2 right-4 h-12 w-12 rounded-full"
          style={{ background: "radial-gradient(circle,#ffe89a 40%,rgba(255,232,154,0) 72%)" }}
        />
        <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="none">
          <g fill="#fff" opacity="0.85">
            <g className="anim-float">
              <ellipse cx="80" cy="24" rx="30" ry="12" />
              <ellipse cx="102" cy="19" rx="20" ry="10" />
            </g>
            <g className="anim-float-slow">
              <ellipse cx="228" cy="30" rx="24" ry="10" />
            </g>
          </g>
          {/* rolling meadow so every pony stands on grass */}
          <path d="M0 62c56-22 118-20 176 0s150 16 224-8v210H0z" fill="#bfe8a4" />
          <path d="M0 132c62-20 132-12 198 4s136 8 202-14v142H0z" fill="#a8dd82" />
          <path d="M0 198c64-16 140-6 202 6s138 4 198-14v72H0z" fill="#8fcf6a" opacity="0.9" />
          {[24, 96, 186, 268, 352, 60, 300].map((x, i) => (
            <g
              key={x}
              transform={`translate(${x} ${i < 5 ? 210 + (i % 2) * 12 : 120 + (i % 2) * 8})`}
              className="anim-sway"
              style={{ transformOrigin: "0 10px" }}
            >
              <path d="M0 10V0" stroke="#5aa246" strokeWidth="2.4" />
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="0" cy="-5" rx="3.2" ry="4.8" fill="#fff" stroke="#e2d7cd" strokeWidth="0.6" transform={`rotate(${a})`} />
              ))}
              <circle cx="0" cy="0" r="2.6" fill="#ffd45e" />
            </g>
          ))}
        </svg>

        <div className="relative z-10 grid grid-cols-2 items-end justify-items-center gap-x-1 gap-y-0 px-2 pt-3 pb-4 sm:grid-cols-4">
          {ponies.map((p, i) => (
            <motion.div
              key={p.id}
              animate={{ scale: active === i ? 1 : 0.9, y: active === i ? -4 : 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <Pony
                name={p.name}
                look={{ body: p.body, mane: p.mane, accessory: p.accessory }}
                sleeping={p.sleeping}
                dramatic={p.dramatic}
                size={active === i ? 160 : 136}
                onClick={() => {
                  setActive(i)
                  play("pop")
                  notify(p.line)
                }}
              />
            </motion.div>
          ))}
        </div>

        <button
          type="button"
          className="absolute bottom-2 left-3 border-0 bg-transparent p-0 opacity-60 transition-opacity hover:opacity-100"
          aria-label="hidden Mr Alien"
          onClick={(e) => {
            poke(e.clientX, e.clientY, "coin")
            discoverSecret("pony-alien", "Mr Alien was tax-evading in the meadow")
          }}
        >
          <MrAlien size={54} mode="peek" />
        </button>
      </div>

      <Panel className="mx-auto mt-3 max-w-2xl bg-white/90">
        <p className="mb-1 font-hand text-sm">
          selected: <strong>{current.name}</strong>
        </p>
        <p className="mb-1 font-hand text-xs text-ink-soft">mane colour</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {MANES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`mane ${c}`}
              className={`h-9 w-9 rounded-full border-[2.5px] transition-transform ${
                current.mane === c ? "scale-110 border-ink" : "border-ink/12"
              }`}
              style={{ background: c }}
              onClick={() => {
                setCurrent({ mane: c })
                play("click")
              }}
            />
          ))}
        </div>
        <p className="mb-1 font-hand text-xs text-ink-soft">coat colour</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {BODIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`coat ${c}`}
              className={`h-9 w-9 rounded-full border-[2.5px] transition-transform ${
                current.body === c ? "scale-110 border-ink" : "border-ink/12"
              }`}
              style={{ background: c }}
              onClick={() => {
                setCurrent({ body: c })
                play("click")
              }}
            />
          ))}
        </div>

        <p className="mb-1 font-hand text-xs text-ink-soft">accessories</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {(["bow", "flowers", "star", "scarf", "nurse", "coins", "stylus", "sign", "burger", "sleep"] as PonyAccessory[]).map((a) => (
            <GameButton
              key={a}
              size="sm"
              tone={current.accessory === a ? "pink" : "cream"}
              onClick={() => {
                setCurrent({ accessory: a })
                unlock(a, `${a} looks correct on ${current.name}`)
              }}
            >
              {a}
            </GameButton>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <GameButton
            size="sm"
            tone="sun"
            onClick={() => {
              setBrushed((n) => n + 1)
              play("pop")
              notify(brushed >= 2 ? "the mane is now aerodynamic" : "brush accepted")
              if (brushed + 1 >= 3) unlock("bow", "brushing mastery: a bow appears")
            }}
          >
            brush · {brushed}
          </GameButton>
          <GameButton size="sm" tone="mint" onClick={() => unlock("fruit", "fruit delivered. pony council pleased")}>
            give fruit
          </GameButton>
          <GameButton
            size="sm"
            tone="lilac"
            onClick={() => {
              play("chime")
              notify(`photo of ${current.name} taken. she did a pose.`)
              unlock("flowers", "flower crown unlocked")
            }}
          >
            photograph
          </GameButton>
        </div>
        <p className="mt-2 font-hand text-xs text-ink-soft">unlocked: {acc.join(" · ") || "nothing yet"}</p>
      </Panel>
    </PageShell>
  )
}
