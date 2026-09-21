import { useState } from "react"
import { Nikki } from "../art/Nikki"
import { useGame } from "../hooks/GameContext"
import { GameButton, Tag } from "../ui/Button"
import { PageShell } from "../ui/PageShell"

const ING = [
  { id: "bun", label: "bun", color: "#e8c39e" },
  { id: "patty", label: "patty", color: "#7a3e22" },
  { id: "cheese", label: "cheese", color: "#f4d35e" },
  { id: "lettuce", label: "lettuce", color: "#8fd9b0" },
  { id: "tomato", label: "tomato", color: "#ff8fab" },
  { id: "pickles", label: "pickles", color: "#7ccc9f" },
  { id: "sauce", label: "sauce", color: "#fff3c4" },
  { id: "extra-cheese", label: "extra cheese", color: "#ffe066" },
  { id: "another-patty", label: "another patty", color: "#5c2e18" },
  { id: "even-more-cheese", label: "even more cheese", color: "#f7e27a" },
]

export function Burger() {
  const { notify, play, patch, save, completeLevel } = useGame()
  const [stack, setStack] = useState<string[]>(["bun"])
  const tall = stack.length >= 8
  const lean = Math.min(18, (stack.length - 3) * 3)

  const add = (id: string) => {
    const next = [...stack, id]
    setStack(next)
    play("pop")
    patch((s) => ({ ...s, burgerHeight: Math.max(s.burgerHeight, next.length) }))
    if (next.length >= 8) notify("structural integrity questionable")
    if (next.length >= 9) completeLevel("burger")
    if (next.length >= 12) notify("a burger fell over dramatically")
  }

  return (
    <PageShell title="Burger Stop" area="burger" tint="#ffe8c8">
      <Tag>assemble a ridiculous burger. physics is a suggestion.</Tag>
      <div className="relative mx-auto min-h-[360px] max-w-md rounded-[1.8rem] bg-[#fff8e7] p-4">
        <div className="flex min-h-[240px] flex-col-reverse items-center justify-start" style={{ transform: `rotate(${lean}deg)` }}>
          {stack.map((id, i) => {
            const ing = ING.find((x) => x.id === id)
            return (
              <div
                key={`${id}-${i}`}
                className="h-7 w-40 rounded-full border border-ink/15"
                style={{ background: ing?.color, marginBottom: -6, width: `${9.5 - (i % 3) * 0.3}rem` }}
              />
            )
          })}
        </div>
        {tall && (
          <div className="absolute right-3 bottom-4">
            <Nikki pose="sit" size={80} />
            <p className="font-hand text-xs">…staring</p>
          </div>
        )}
      </div>
      <div className="mx-auto mt-3 flex max-w-lg flex-wrap justify-center gap-2">
        {ING.map((i) => (
          <GameButton key={i.id} onClick={() => add(i.id)}>
            {i.label}
          </GameButton>
        ))}
        <GameButton tone="pink" onClick={() => setStack(["bun"])}>
          eat / reset
        </GameButton>
      </div>
      <p className="mt-2 text-center font-hand text-sm">height {stack.length} · best {save.burgerHeight}</p>
    </PageShell>
  )
}
