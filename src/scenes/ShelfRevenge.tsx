import { useState } from "react"
import { MrAlien } from "../components/characters/MrAlien"
import { useGame } from "../hooks/GameContext"
import { GameButton, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const WEAPONS = [
  { id: "sponge", name: "Super Sponge", dmg: 420, icon: "🧽" },
  { id: "bubbles", name: "Soap Bubble Cannon", dmg: 310, icon: "🫧" },
  { id: "mop", name: "Legendary Mop", dmg: 510, icon: "🧹" },
  { id: "beam", name: "Cleaning Beam", dmg: 640, icon: "✨" },
  { id: "alien", name: "Mr Alien Assistance", dmg: 1800, icon: "👽" },
] as const

export function ShelfRevenge() {
  const { notify, play, patch, save, completeLevel } = useGame()
  const [hp, setHp] = useState(9999)
  const [intro, setIntro] = useState(true)
  const [line, setLine] = useState("I AM BOLTED BY DESTINY")
  const [down, setDown] = useState(save.completedLevels.includes("shelf-revenge"))

  const hit = (dmg: number, name: string) => {
    if (down) return
    play("whoosh")
    const next = Math.max(0, hp - dmg)
    setHp(next)
    patch((s) => ({ ...s, puddingRevengeScore: Math.max(s.puddingRevengeScore, 9999 - next) }))
    if (name.includes("Sponge")) setLine("NOOO NOT THE SPONGE")
    else if (name.includes("Alien")) {
      setLine("FINANCIALLY SANCTIONED")
      notify("Mr Alien has financially sanctioned the shelf")
    } else setLine("YOU CANNOT MOVE ME")
    if (next <= 0) {
      setDown(true)
      setLine("30 MINUTES OF REVENGE")
      completeLevel("shelf-revenge")
      notify("justice has been served")
      play("achieve")
    }
  }

  return (
    <PageShell title="THE SHELF STRIKES BACK" area="shelf-revenge" tint="#3d2a33">
      <Tag className="bg-white text-ink">THE PUDDING INCIDENT · revenge allowed</Tag>
      {intro ? (
        <div className="mx-auto max-w-md rounded-[1.6rem] bg-night p-6 text-center text-cream">
          <p className="font-hand text-4xl">THE SHELF</p>
          <p className="mt-2 font-hand text-xl">HP: 9999</p>
          <p className="mt-4 font-hand">it cannot be moved. it knows this. it is insufferable about it.</p>
          <GameButton className="mt-4" tone="pink" onClick={() => setIntro(false)}>
            begin revenge
          </GameButton>
        </div>
      ) : (
        <div className="mx-auto max-w-lg text-center">
          <p className="font-hand text-cream">HP {hp} / 9999</p>
          <div className="mx-auto my-2 h-4 max-w-sm overflow-hidden rounded-full bg-white/20">
            <span className="block h-full bg-blush-deep" style={{ width: `${(hp / 9999) * 100}%` }} />
          </div>
          <div className={`mx-auto mt-4 w-56 ${down ? "anim-wiggle" : ""}`}>
            <svg viewBox="0 0 200 180">
              <rect x="20" y="30" width="160" height="18" fill="#c4a882" stroke="#4a3f55" strokeWidth="2" />
              <rect x="20" y="70" width="160" height="18" fill="#c4a882" stroke="#4a3f55" strokeWidth="2" />
              <rect x="20" y="110" width="160" height="18" fill="#c4a882" stroke="#4a3f55" strokeWidth="2" />
              <rect x="16" y="20" width="14" height="140" fill="#a88860" />
              <rect x="170" y="20" width="14" height="140" fill="#a88860" />
              {!down && (
                <>
                  <path d="M70 44 q8 -10 16 0" stroke="#2a2430" strokeWidth="3" fill="none" />
                  <path d="M114 44 q8 -10 16 0" stroke="#2a2430" strokeWidth="3" fill="none" />
                  <ellipse cx="78" cy="58" rx="6" ry="8" fill="#2a2430" />
                  <ellipse cx="122" cy="58" rx="6" ry="8" fill="#2a2430" />
                </>
              )}
              {down && <text x="100" y="90" textAnchor="middle" fill="#fff3c4" fontSize="16">✨</text>}
            </svg>
          </div>
          <p className="font-hand text-lg text-butter">{line}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {WEAPONS.map((w) => (
              <GameButton key={w.id} onClick={() => hit(w.dmg, w.name)}>
                {w.icon} {w.name}
              </GameButton>
            ))}
          </div>
          {hp < 5000 && hp > 0 && (
            <div className="mt-3 flex justify-center">
              <MrAlien size={80} />
            </div>
          )}
          {down && (
            <div className="mt-4">
              <p className="font-hand text-cream">a tiny pudding cup looking terrified</p>
              <span className="text-4xl">🍮</span>
              <p className="font-hand text-blush">🏆 Shelf Defeated</p>
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}
