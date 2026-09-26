import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { MrAlien } from "../art/Alien"
import { PuddingCup, StarSticker, Trophy } from "../art/Props"
import { useGame } from "../hooks/GameContext"
import { GameButton, Panel, Pill, ProgressBar } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const MAX_HP = 9999

const WEAPONS = [
  { id: "sponge", name: "Super Sponge", dmg: 420, taunt: "NOOO NOT THE SPONGE" },
  { id: "bubbles", name: "Bubble Cannon", dmg: 310, taunt: "I AM STILL BOLTED" },
  { id: "mop", name: "Legendary Mop", dmg: 510, taunt: "YOU CANNOT MOVE ME" },
  { id: "beam", name: "Cleaning Beam", dmg: 640, taunt: "THAT ONE STUNG" },
  { id: "alien", name: "Mr Alien Assistance", dmg: 1800, taunt: "FINANCIALLY SANCTIONED" },
] as const

type Hit = { id: number; dmg: number }

export function ShelfRevenge() {
  const { notify, play, patch, save, completeLevel, addStars, reducedMotion } = useGame()
  const [hp, setHp] = useState(MAX_HP)
  const [intro, setIntro] = useState(true)
  const [line, setLine] = useState("I AM BOLTED BY DESTINY")
  const [down, setDown] = useState(save.completedLevels.includes("shelf-revenge"))
  const [hits, setHits] = useState<Hit[]>([])
  const [shake, setShake] = useState(0)
  const hitId = useRef(0)

  const hit = (dmg: number, taunt: string, isAlien: boolean) => {
    if (down) return
    play("whoosh")
    const next = Math.max(0, hp - dmg)
    setHp(next)
    setShake((n) => n + 1)
    const id = ++hitId.current
    setHits((h) => [...h.slice(-4), { id, dmg }])
    window.setTimeout(() => setHits((h) => h.filter((x) => x.id !== id)), 900)
    patch((s) => ({ ...s, puddingRevengeScore: Math.max(s.puddingRevengeScore, MAX_HP - next) }))
    setLine(taunt)
    if (isAlien) notify("Mr Alien has financially sanctioned the shelf")
    if (next <= 0) {
      setDown(true)
      setLine("30 MINUTES OF REVENGE: COMPLETE")
      if (!save.completedLevels.includes("shelf-revenge")) {
        completeLevel("shelf-revenge")
        addStars(2)
      }
      notify("justice has been served")
      play("achieve")
    }
  }

  return (
    <PageShell
      title="THE SHELF STRIKES BACK"
      area="shelf-revenge"
      night
      subtitle="the pudding incident · revenge officially allowed"
      tint="linear-gradient(180deg,#3b2b3c 0%,#2c2030 55%,#1f1824 100%)"
      aside={<Pill className="bg-night text-cream">{down ? "defeated" : `HP ${hp}`}</Pill>}
    >
      {intro ? (
        <div className="soft-card mx-auto max-w-md bg-white/10 p-6 text-center text-cream">
          <motion.p className="font-hand text-4xl" animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2.4, repeat: Infinity }}>
            THE SHELF
          </motion.p>
          <p className="mt-1 font-hand text-xl">HP: {MAX_HP}</p>
          <p className="mt-3 font-hand">it cannot be moved. it knows this. it is insufferable about it.</p>
          <GameButton className="mt-4" tone="pink" size="lg" onClick={() => setIntro(false)}>
            begin revenge
          </GameButton>
        </div>
      ) : (
        <div className="mx-auto max-w-lg text-center">
          <ProgressBar value={(hp / MAX_HP) * 100} tone="rose" label="shelf health" className="mx-auto mb-3 max-w-sm" />

          <div className="relative mx-auto w-60">
            <motion.div
              key={shake}
              initial={reducedMotion ? false : { x: 0 }}
              animate={{ x: [0, -7, 6, -3, 0], rotate: down ? [0, 3, -2, 0] : 0 }}
              transition={{ duration: 0.38 }}
            >
              <svg viewBox="0 0 200 190" aria-hidden>
                <rect x="14" y="16" width="16" height="158" rx="5" fill="#a07a55" stroke="#5b4450" strokeWidth="2.4" />
                <rect x="170" y="16" width="16" height="158" rx="5" fill="#a07a55" stroke="#5b4450" strokeWidth="2.4" />
                {[34, 78, 122].map((y) => (
                  <g key={y}>
                    <rect x="18" y={y} width="164" height="16" rx="5" fill="#c9a274" stroke="#5b4450" strokeWidth="2.2" />
                    <rect x="22" y={y + 3} width="156" height="4" rx="2" fill="#e0bd91" />
                  </g>
                ))}
                {!down ? (
                  <g>
                    <path d="M66 52c5-8 13-8 18 0" stroke="#3c3038" strokeWidth="3.4" fill="none" strokeLinecap="round" />
                    <path d="M116 52c5-8 13-8 18 0" stroke="#3c3038" strokeWidth="3.4" fill="none" strokeLinecap="round" />
                    <ellipse cx="75" cy="64" rx="7" ry="9" fill="#3c3038" />
                    <ellipse cx="125" cy="64" rx="7" ry="9" fill="#3c3038" />
                    <path d="M86 100c8 6 20 6 28 0" stroke="#3c3038" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </g>
                ) : (
                  <g>
                    <path d="M68 60l14 14M82 60l-14 14M118 60l14 14M132 60l-14 14" stroke="#3c3038" strokeWidth="3.4" strokeLinecap="round" />
                    <path d="M86 104c8-6 20-6 28 0" stroke="#3c3038" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </g>
                )}
                <g transform="translate(88 138)">
                  <PuddingShape />
                </g>
              </svg>
            </motion.div>

            <AnimatePresence>
              {hits.map((h, i) => (
                <motion.span
                  key={h.id}
                  className="pointer-events-none absolute left-1/2 top-10 font-hand text-lg text-butter"
                  initial={{ y: 0, opacity: 1, x: (i - 2) * 22 }}
                  animate={{ y: -50, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 }}
                >
                  -{h.dmg}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          <p className="mt-2 font-hand text-lg text-butter">{line}</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {WEAPONS.map((w) => (
              <GameButton
                key={w.id}
                size="sm"
                tone={w.id === "alien" ? "lilac" : "cream"}
                disabled={down}
                onClick={() => hit(w.dmg, w.taunt, w.id === "alien")}
              >
                {w.name}
              </GameButton>
            ))}
          </div>

          {hp < 5000 && hp > 0 && (
            <div className="mt-3 flex justify-center anim-float">
              <MrAlien size={84} mode="steal" />
            </div>
          )}

          {down && (
            <Panel className="mt-4 bg-white/12">
              <div className="flex items-center justify-center gap-3">
                <Trophy size={48} />
                <div className="text-left">
                  <p className="font-hand text-lg text-cream">Shelf Defeated</p>
                  <p className="font-hand text-sm text-cream/80">a tiny pudding cup looking terrified nearby</p>
                </div>
                <PuddingCup size={42} />
                <StarSticker size={26} className="anim-twinkle" />
              </div>
              <GameButton
                className="mt-3"
                size="sm"
                tone="pink"
                onClick={() => {
                  setHp(MAX_HP)
                  setDown(false)
                  setLine("I HAVE RETURNED. STILL BOLTED.")
                  notify("the shelf requested a rematch")
                }}
              >
                rematch (it asked for it)
              </GameButton>
            </Panel>
          )}
        </div>
      )}
    </PageShell>
  )
}

function PuddingShape() {
  return (
    <g>
      <path d="M0 6h24l-3 20a4 4 0 0 1-4 3H7a4 4 0 0 1-4-3z" fill="#f6dcb8" stroke="#5b4450" strokeWidth="2" strokeLinejoin="round" />
      <path d="M0 6h24l-1 7H1z" fill="#c98a5c" />
      <ellipse cx="12" cy="6" rx="12" ry="3.4" fill="#fff6e8" stroke="#5b4450" strokeWidth="1.6" />
    </g>
  )
}
