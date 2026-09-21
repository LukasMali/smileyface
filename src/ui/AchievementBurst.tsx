import { AnimatePresence, motion } from "framer-motion"
import { ACHIEVEMENTS } from "../game/areas"
import { useGame } from "../hooks/GameContext"
import { KawaiiBlob } from "../components/characters/KawaiiBlob"

export function AchievementBurst() {
  const { justAchievements } = useGame()
  const id = justAchievements[0]
  const def = ACHIEVEMENTS.find((a) => a.id === id)
  return (
    <AnimatePresence>
      {def && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 left-1/2 z-[88] w-[min(92vw,20rem)] -translate-x-1/2 rounded-[1.4rem] border-2 border-ink/10 bg-white p-4 text-center shadow-[6px_10px_0_rgba(74,63,85,0.12)]"
        >
          <div className="flex justify-center gap-2">
            <KawaiiBlob mood="yay" size={48} />
            <span className="text-3xl">{def.icon}</span>
          </div>
          <p className="mt-2 font-hand text-lg">achievement unlocked</p>
          <p className="font-hand text-xl">{def.title}</p>
          <p className="text-sm text-ink-soft">{def.description}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
