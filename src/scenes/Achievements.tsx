import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { AchIcon } from "../art/AchIcon"
import { ACHIEVEMENTS, AREAS } from "../game/areas"
import { SWEET_MESSAGES } from "../game/messages"
import { isAreaOpen } from "../game/progress"
import { useGame } from "../hooks/GameContext"
import { PageShell } from "../ui/PageShell"
import { CheckIcon, GameButton, LockIcon, Panel, Pill, ProgressBar, SectionTitle } from "../ui/Button"

export function Achievements() {
  const { save, notify, sweetNote, reducedMotion } = useGame()
  const doneCount = AREAS.filter((a) => save.completedLevels.includes(a.id)).length

  return (
    <PageShell
      title="trophy shelf"
      area="achievements"
      subtitle="stickers for things you did on purpose"
      tint="linear-gradient(180deg,#f6efff 0%,#efe7ff 55%,#ffeef4 100%)"
      aside={<Pill className="bg-lilac">{save.achievements.length}/{ACHIEVEMENTS.length}</Pill>}
    >
      <Panel className="mb-4 bg-white/88">
        <SectionTitle hint={`${doneCount}/${AREAS.length} places finished`}>progress</SectionTitle>
        <ProgressBar value={(doneCount / AREAS.length) * 100} tone="mint" label="places finished" />
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {AREAS.map((a) => {
            const open = isAreaOpen(save, a.id)
            const done = save.completedLevels.includes(a.id)
            const best = save.highScores[a.id]
            return (
              <div
                key={a.id}
                className={`flex items-center justify-between gap-2 rounded-2xl border-[1.5px] px-3 py-2 ${
                  done ? "border-mint-deep/50 bg-mint/45" : open ? "border-ink/10 bg-white" : "border-dashed border-ink/12 bg-white/50"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-hand text-sm">{a.name}</p>
                  <p className="truncate font-hand text-[0.7rem] text-ink-soft">
                    {done
                      ? `finished${best ? ` · best ${best}` : ""} · you can replay it`
                      : open
                        ? a.blurb
                        : `locked · ${a.hint}`}
                  </p>
                </div>
                {open ? (
                  <Link
                    to={a.route}
                    className="pill shrink-0 bg-white text-ink no-underline"
                    aria-label={done ? `play ${a.name} again` : `open ${a.name}`}
                  >
                    {done ? (
                      <>
                        <CheckIcon /> again
                      </>
                    ) : (
                      "open"
                    )}
                  </Link>
                ) : (
                  <span className="pill shrink-0 bg-white/60 text-ink-soft">
                    <LockIcon /> soon
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </Panel>

      <SectionTitle hint="tap one for the full story">achievements</SectionTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACHIEVEMENTS.map((a, i) => {
          const on = save.achievements.includes(a.id)
          return (
            <motion.button
              key={a.id}
              type="button"
              data-testid={`ach-${a.id}`}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reducedMotion ? 0 : i * 0.03 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={`relative overflow-hidden rounded-[1.3rem] border-[1.5px] p-3 text-left font-hand ${
                on
                  ? "border-ink/12 bg-white shadow-[0_10px_22px_-16px_rgba(91,68,80,0.9)]"
                  : "border-dashed border-ink/12 bg-white/45"
              }`}
              onClick={() => notify(on ? a.description : "not yet. the shelf is patient.")}
            >
              {on && <span className="shimmer-line" />}
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] ${
                  on ? "border-butter-deep/50 bg-butter/70" : "border-ink/10 bg-white/60"
                }`}
              >
                {on ? (
                  <AchIcon id={a.id} size={30} />
                ) : (
                  <svg viewBox="0 0 16 16" className="h-4 w-4 opacity-40" aria-hidden>
                    <rect x="3.2" y="7" width="9.6" height="6.6" rx="2" fill="#a08fa0" />
                    <path d="M5.4 7V5.6a2.6 2.6 0 0 1 5.2 0V7" fill="none" stroke="#a08fa0" strokeWidth="1.7" />
                  </svg>
                )}
              </span>
              <p className="mt-1 text-sm">{a.title}</p>
              <p className="text-[0.68rem] text-ink-soft">{on ? a.description : "locked for now"}</p>
            </motion.button>
          )
        })}
      </div>

      <Panel className="mt-4 bg-white/88">
        <SectionTitle hint={`${SWEET_MESSAGES.length} exist somewhere`}>found notes</SectionTitle>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {save.unlockedMessages.slice(-8).map((m) => (
            <li key={m} className="rounded-2xl border-[1.5px] border-ink/8 bg-cream px-3 py-2 font-hand text-sm">
              {m}
            </li>
          ))}
          {save.unlockedMessages.length === 0 && (
            <li className="font-hand text-sm text-ink-soft">none yet · tap things, notes appear</li>
          )}
        </ul>
        <GameButton className="mt-3" tone="pink" size="sm" onClick={() => notify(sweetNote())}>
          another fortune cookie
        </GameButton>
      </Panel>
    </PageShell>
  )
}
