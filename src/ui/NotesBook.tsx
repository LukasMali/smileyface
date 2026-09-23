import { AnimatePresence, motion } from "framer-motion"
import { SWEET_MESSAGES } from "../game/messages"
import { GameButton } from "./Button"

export function NotesBook({
  open,
  onClose,
  notes,
}: {
  open: boolean
  onClose: () => void
  notes: string[]
}) {
  const total = SWEET_MESSAGES.length
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center bg-night/45 p-3 backdrop-blur-[3px] sm:items-center"
          role="dialog"
          aria-modal
          aria-label="found notes"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            className="soft-card max-h-[88svh] w-full max-w-md overflow-y-auto bg-cream p-4"
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-hand text-2xl">found notes</h2>
                <p className="font-hand text-sm text-ink-soft">
                  {notes.length}/{total} collected
                </p>
              </div>
              <GameButton size="sm" onClick={onClose} label="close notes">
                close
              </GameButton>
            </div>
            {notes.length === 0 ? (
              <p className="font-hand text-sm text-ink-soft">none yet · tap things, notes appear</p>
            ) : (
              <ol className="m-0 flex list-none flex-col gap-2 p-0">
                {notes.map((m, i) => (
                  <li key={`${i}-${m}`} className="rounded-2xl border-[1.5px] border-ink/8 bg-white px-3 py-2 font-hand text-sm">
                    <span className="mr-2 font-hand text-[0.7rem] text-ink-soft">{i + 1}.</span>
                    {m}
                  </li>
                ))}
              </ol>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
