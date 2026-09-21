import { ACHIEVEMENTS } from "../game/areas"
import { SWEET_MESSAGES } from "../game/messages"
import { useGame } from "../hooks/GameContext"
import { PageShell } from "../ui/PageShell"
import { Tag } from "../ui/Button"

export function Achievements() {
  const { save, notify, sweetNote } = useGame()
  return (
    <PageShell title="trophy shelf" area="achievements" tint="#e0d4f7">
      <Tag>stickers of things you did on purpose</Tag>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const on = save.achievements.includes(a.id)
          return (
            <button
              key={a.id}
              type="button"
              data-testid={`ach-${a.id}`}
              className={`rounded-[1.2rem] border-2 p-3 text-left font-hand ${on ? "border-ink/10 bg-white" : "border-ink/5 bg-white/40 opacity-60"}`}
              onClick={() => notify(on ? a.description : "not yet. the shelf is patient.")}
            >
              <span className="text-2xl">{on ? a.icon : "•"}</span>
              <p className="mt-1 text-sm">{a.title}</p>
              <p className="text-[11px] text-ink-soft">{on ? a.description : "???"}</p>
            </button>
          )
        })}
      </div>
      <div className="mt-6">
        <p className="mb-2 font-hand text-sm">found notes</p>
        <ul className="flex flex-col gap-2">
          {save.unlockedMessages.slice(-8).map((m) => (
            <li key={m} className="rounded-2xl bg-white/80 px-3 py-2 font-hand text-sm">
              {m}
            </li>
          ))}
        </ul>
        <button type="button" className="mt-3 rounded-full bg-white px-4 py-2 font-hand" onClick={() => notify(sweetNote())}>
          another fortune cookie
        </button>
        <p className="mt-2 font-hand text-[11px] text-ink-soft">{SWEET_MESSAGES.length} notes exist in the universe. some are hiding.</p>
      </div>
    </PageShell>
  )
}
