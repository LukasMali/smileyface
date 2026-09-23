import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Nikki, NikkiButton } from "../art/Nikki"
import { NIKKI_LINES } from "../game/messages"
import { useGame } from "../hooks/GameContext"
import { pick } from "../lib/random"
import { GameButton, Panel, Pill, ProgressBar } from "../ui/Button"
import { PageShell } from "../ui/PageShell"
import { Heart } from "../art/Props"

type Spot = {
  blanket: boolean
  pillow: boolean
  plush: boolean
  night: boolean
  pose: "sleep" | "sit" | "stretch"
}

export function Nini() {
  const { notify, play, petNikki, completeLevel, save, patch, addStars, reducedMotion } = useGame()
  const [spot, setSpot] = useState<Spot>({ blanket: false, pillow: false, plush: false, night: false, pose: "sit" })
  const [won, setWon] = useState(save.niniComfy)
  const [hearts, setHearts] = useState<number[]>([])

  const comfy = [spot.blanket, spot.pillow, spot.plush, spot.night, spot.pose === "sleep"].filter(Boolean).length

  const pet = () => {
    const line = pick(NIKKI_LINES)
    petNikki(line)
    notify(line)
    const id = Date.now()
    setHearts((h) => [...h.slice(-4), id])
    window.setTimeout(() => setHearts((h) => h.filter((x) => x !== id)), 1200)
  }

  const update = (next: Spot, sound: "pop" | "sparkle" = "pop") => {
    setSpot(next)
    play(sound)
    const ok = next.blanket && next.pillow && next.plush && next.night && next.pose === "sleep"
    if (ok && !won) {
      setWon(true)
      patch((s) => ({ ...s, niniComfy: true }))
      completeLevel("nini")
      addStars(2)
      notify("Nini has achieved maximum comfy")
      play("chime")
    }
  }

  return (
    <PageShell
      title="Nikki's Cozy Corner"
      area="nini"
      night
      subtitle="get Nini comfy · she will supervise"
      tint="linear-gradient(180deg,#2b2750 0%,#241f45 55%,#1c1836 100%)"
      aside={<Pill className="bg-night text-cream">{comfy}/5 cozy</Pill>}
    >
      <div
        className="stage mx-auto aspect-[5/4] max-w-lg sm:aspect-[16/11]"
        style={{ background: "linear-gradient(180deg,#3a3568 0%,#2c2752 55%,#413355 100%)" }}
      >
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden>
          {/* window + moon */}
          <g transform="translate(250 30)">
            <rect x="0" y="0" width="110" height="88" rx="12" fill="#1f1d42" stroke="#6b5f9c" strokeWidth="3" />
            <path d="M55 0v88M0 44h110" stroke="#6b5f9c" strokeWidth="3" />
            <circle cx="34" cy="28" r="14" fill="#fff5d6" />
            <circle cx="29" cy="24" r="3.4" fill="#f0e2bb" opacity="0.8" />
            {[...Array(7)].map((_, i) => (
              <circle
                key={i}
                cx={12 + ((i * 17) % 90)}
                cy={16 + ((i * 23) % 62)}
                r="1.5"
                fill="#fff"
                className="anim-twinkle"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </g>

          {/* fairy light garland */}
          <path d="M0 18c60 26 130 26 190 6s140-18 210 8" stroke="#6b5f9c" strokeWidth="2" fill="none" />
          {[24, 62, 100, 138, 176, 214, 252, 290, 328, 366].map((x, i) => (
            <g key={x}>
              <path d={`M${x} ${20 + Math.sin(i) * 6}v6`} stroke="#6b5f9c" strokeWidth="1.4" />
              <circle
                cx={x}
                cy={30 + Math.sin(i) * 6}
                r="3.6"
                fill={["#ffd9e6", "#ffeec2", "#cdeaff", "#d9ffe6"][i % 4]}
                className="anim-twinkle"
                style={{ animationDelay: `${i * 0.28}s` }}
              />
            </g>
          ))}

          {/* framed photo + wall shelf with tiny things */}
          <g transform="translate(44 62)">
            <rect x="0" y="0" width="46" height="38" rx="5" fill="#4a3f74" stroke="#8677b8" strokeWidth="2.4" />
            <rect x="5" y="5" width="36" height="28" rx="3" fill="#6e5f9e" />
            <circle cx="17" cy="20" r="7" fill="#3a2c37" />
            <circle cx="15" cy="18" r="1.6" fill="#fff" opacity="0.8" />
            <path d="M26 28c4-8 12-8 14 0z" fill="#ffdbe6" opacity="0.8" />
          </g>
          <rect x="112" y="76" width="104" height="6" rx="3" fill="#7c6a9c" />
          <g>
            <ellipse cx="130" cy="68" rx="9" ry="8" fill="#ffdbe6" stroke="#c99bb3" strokeWidth="1.4" />
            <path d="M130 60c4-6 10-3 8 3" fill="#8fddb4" />
            <rect x="152" y="58" width="16" height="18" rx="3" fill="#8fddb4" stroke="#63b58c" strokeWidth="1.4" />
            <path d="M152 64h16" stroke="#63b58c" strokeWidth="1.4" />
            <path d="M188 76c0-10 14-10 14 0z" fill="#ffd45e" stroke="#e0ab2f" strokeWidth="1.4" />
          </g>

          {/* floor + rug */}
          <path d="M0 210h400v90H0z" fill="#332c55" />
          <ellipse cx="200" cy="262" rx="160" ry="40" fill="#5a4b7a" />
          <ellipse cx="200" cy="262" rx="120" ry="28" fill="#6b5a8e" opacity="0.7" />

          {/* squishy cushion bed */}
          <ellipse cx="200" cy="272" rx="112" ry="26" fill="#2a2446" opacity="0.35" />
          <path
            d="M98 250c0-26 24-38 102-38s102 12 102 38c0 20-42 30-102 30s-102-10-102-30z"
            fill="#e59ab6"
            stroke="#b9718f"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <ellipse cx="200" cy="246" rx="88" ry="21" fill="#f6c3d6" />
          <ellipse cx="200" cy="244" rx="78" ry="17" fill="#fbdce8" />
          {/* little tufts so the cushion reads as fabric */}
          <g fill="#e59ab6" opacity="0.7">
            {[-52, -26, 0, 26, 52].map((dx) => (
              <circle key={dx} cx={200 + dx} cy={246 + Math.abs(dx) * 0.06} r="2.4" />
            ))}
          </g>
          <path d="M120 252c26 12 134 12 160 0" stroke="#fff" strokeWidth="3" fill="none" opacity="0.35" />
        </svg>

        {spot.night && (
          <motion.div
            className="absolute top-[38%] left-[8%] h-12 w-12 rounded-full bg-butter"
            style={{ boxShadow: "0 0 46px 18px rgba(255,238,194,0.55)" }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          />
        )}

        <div className="absolute inset-x-[16%] bottom-[19%] flex items-end justify-center">
          <AnimatePresence>
            {spot.blanket && (
              <motion.svg
                key="blanket"
                viewBox="0 0 220 90"
                className="absolute bottom-[-6%] w-[86%]"
                initial={reducedMotion ? false : { y: -40, opacity: 0, rotate: -6 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 20 }}
                aria-hidden
              >
                <path d="M8 40c40-22 164-22 204 0 6 24-10 44-102 44S2 64 8 40z" fill="#bfa9f0" stroke="#8a72c0" strokeWidth="3" />
                <path d="M20 46c40 12 140 12 180 0" stroke="#e6dbff" strokeWidth="5" fill="none" />
                <path d="M40 62c30 8 110 8 140 0" stroke="#d8cbff" strokeWidth="4" fill="none" opacity="0.8" />
              </motion.svg>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {spot.pillow && (
              <motion.svg
                key="pillow"
                viewBox="0 0 100 60"
                className="absolute bottom-[14%] left-[-4%] w-[34%]"
                initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                aria-hidden
              >
                <path d="M8 20c0-12 12-16 42-16s42 4 42 16-12 24-42 24S8 32 8 20z" fill="#ffdbe6" stroke="#e39ab4" strokeWidth="3" />
                <path d="M22 18c14-6 42-6 56 0" stroke="#fff" strokeWidth="4" fill="none" />
              </motion.svg>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {spot.plush && (
              <motion.svg
                key="plush"
                viewBox="0 0 80 90"
                className="absolute right-[-6%] bottom-[16%] w-[26%]"
                initial={reducedMotion ? false : { y: -30, opacity: 0, rotate: 12 }}
                animate={{ y: 0, opacity: 1, rotate: -6 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                aria-hidden
              >
                <circle cx="20" cy="22" r="10" fill="#d9a36f" stroke="#5b4450" strokeWidth="2.4" />
                <circle cx="60" cy="22" r="10" fill="#d9a36f" stroke="#5b4450" strokeWidth="2.4" />
                <circle cx="40" cy="32" r="24" fill="#e8bb84" stroke="#5b4450" strokeWidth="2.6" />
                <ellipse cx="40" cy="70" rx="26" ry="20" fill="#e8bb84" stroke="#5b4450" strokeWidth="2.6" />
                <ellipse cx="40" cy="74" rx="15" ry="12" fill="#f6dcb8" />
                <circle cx="32" cy="30" r="3" fill="#3c3038" />
                <circle cx="48" cy="30" r="3" fill="#3c3038" />
                <ellipse cx="40" cy="38" rx="6" ry="4.6" fill="#f6dcb8" />
                <circle cx="40" cy="37" r="2" fill="#3c3038" />
              </motion.svg>
            )}
          </AnimatePresence>

          <div className="relative z-10">
            <NikkiButton pose={spot.pose} size={150} label="pet Nikki" onPet={pet} />
            <AnimatePresence>
              {hearts.map((id, i) => (
                <motion.span
                  key={id}
                  className="pointer-events-none absolute left-1/2 top-2"
                  initial={{ y: 0, opacity: 0.9, scale: 0.6, x: (i - 2) * 14 }}
                  animate={{ y: -70, opacity: 0, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                >
                  <Heart size={22} />
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {won && (
          <motion.p
            className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 font-hand text-sm text-ink"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            maximum comfy achieved ✨
          </motion.p>
        )}
      </div>

      <Panel className="mt-3 bg-white/12">
        <p className="mb-2 font-hand text-sm text-cream">
          arrange the nap. Nini is very professional about this.
        </p>
        <ProgressBar value={(comfy / 5) * 100} tone="rose" label="comfy level" className="mb-3" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <GameButton tone={spot.blanket ? "mint" : "cream"} onClick={() => update({ ...spot, blanket: !spot.blanket })}>
            blanket
          </GameButton>
          <GameButton tone={spot.pillow ? "mint" : "cream"} onClick={() => update({ ...spot, pillow: !spot.pillow })}>
            pillow
          </GameButton>
          <GameButton tone={spot.plush ? "mint" : "cream"} onClick={() => update({ ...spot, plush: !spot.plush })}>
            plushie
          </GameButton>
          <GameButton tone={spot.night ? "mint" : "cream"} onClick={() => update({ ...spot, night: !spot.night }, "sparkle")}>
            night light
          </GameButton>
          <GameButton tone={spot.pose === "sleep" ? "mint" : "cream"} onClick={() => update({ ...spot, pose: "sleep" })}>
            sleeping pose
          </GameButton>
          <GameButton
            tone={spot.pose === "stretch" ? "mint" : "cream"}
            onClick={() => {
              const next = spot.pose === "stretch" ? "sit" : "stretch"
              update({ ...spot, pose: next }, "sparkle")
              notify(next === "stretch" ? "front paws: deployed. spine: spaghetti." : "stretch complete. core: unlocked.")
            }}
          >
            stretch
          </GameButton>
        </div>
        {won && (
          <p className="mt-3 text-center font-hand text-lg text-cream">
            Nini has achieved maximum comfy ✨ (you can rearrange forever)
          </p>
        )}
      </Panel>

      <div className="mt-3 flex items-center justify-center gap-3 opacity-90">
        <Nikki pose="sleep" size={90} />
        <p className="font-hand text-sm text-cream/80">she sleeps like this even when the nap is not scheduled</p>
      </div>
    </PageShell>
  )
}
