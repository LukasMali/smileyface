import { AnimatePresence } from "framer-motion"
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { areaById } from "./game/areas"
import { isAreaOpen } from "./game/progress"
import type { AreaId } from "./game/types"
import { GameProvider, useGame } from "./hooks/GameContext"
import { AchievementBurst } from "./ui/AchievementBurst"
import { ComedyLayer } from "./ui/ComedyLayer"
import { FinaleOverlay } from "./ui/FinaleOverlay"
import { BottomNav, HUD } from "./ui/HUD"
import { Loader } from "./ui/PageShell"
import { SettingsModal } from "./ui/SettingsModal"
import { SaveIndicator, SparkPops, ToastLayer } from "./ui/ToastLayer"
import { UfoFlyby } from "./ui/UfoFlyby"
import { LockedGate, World } from "./scenes/World"
import { Room } from "./scenes/Room"

const Nini = lazy(() => import("./scenes/Nini").then((m) => ({ default: m.Nini })))
const Dreamland = lazy(() => import("./scenes/Dreamland").then((m) => ({ default: m.Dreamland })))
const ArtStudio = lazy(() => import("./scenes/ArtStudio").then((m) => ({ default: m.ArtStudio })))
const Aquarium = lazy(() => import("./scenes/Aquarium").then((m) => ({ default: m.Aquarium })))
const Ponies = lazy(() => import("./scenes/Ponies").then((m) => ({ default: m.Ponies })))
const AlienBank = lazy(() => import("./scenes/AlienBank").then((m) => ({ default: m.AlienBank })))
const Nurse = lazy(() => import("./scenes/Nurse").then((m) => ({ default: m.Nurse })))
const Driving = lazy(() => import("./scenes/Driving").then((m) => ({ default: m.Driving })))
const Nails = lazy(() => import("./scenes/Nails").then((m) => ({ default: m.Nails })))
const Fruit = lazy(() => import("./scenes/Fruit").then((m) => ({ default: m.Fruit })))
const Pool = lazy(() => import("./scenes/Pool").then((m) => ({ default: m.Pool })))
const ShelfRevenge = lazy(() => import("./scenes/ShelfRevenge").then((m) => ({ default: m.ShelfRevenge })))
const Burger = lazy(() => import("./scenes/Burger").then((m) => ({ default: m.Burger })))
const FoodShrine = lazy(() => import("./scenes/FoodShrine").then((m) => ({ default: m.FoodShrine })))
const Santa = lazy(() => import("./scenes/Santa").then((m) => ({ default: m.Santa })))
const Achievements = lazy(() => import("./scenes/Achievements").then((m) => ({ default: m.Achievements })))

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Shell />
      </GameProvider>
    </BrowserRouter>
  )
}

function Shell() {
  const [settings, setSettings] = useState(false)
  const loc = useLocation()
  const { poke, reducedMotion } = useGame()

  useEffect(() => {
    const on = (e: PointerEvent) => {
      poke(e.clientX, e.clientY)
    }
    window.addEventListener("pointerdown", on)
    return () => window.removeEventListener("pointerdown", on)
  }, [poke])

  return (
    <div className={`app-root ${reducedMotion ? "reduce-motion" : ""}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-white focus:px-3 focus:py-2">
        skip to world
      </a>
      <div className="grain" aria-hidden />
      <HUD onOpenSettings={() => setSettings(true)} />
      <main id="main">
        <AnimatePresence mode="wait">
          <Suspense fallback={<Loader />} key={loc.pathname}>
            <Routes location={loc}>
              <Route path="/" element={<Navigate to="/room" replace />} />
              <Route path="/room" element={<Room />} />
              <Route path="/world" element={<World />} />
              <Route path="/nini" element={<Guard id="nini"><Nini /></Guard>} />
              <Route path="/dreamland" element={<Guard id="dreamland"><Dreamland /></Guard>} />
              <Route path="/art" element={<Guard id="art"><ArtStudio /></Guard>} />
              <Route path="/aquarium" element={<Guard id="aquarium"><Aquarium /></Guard>} />
              <Route path="/ponies" element={<Guard id="ponies"><Ponies /></Guard>} />
              <Route path="/alien-bank" element={<Guard id="alien-bank"><AlienBank /></Guard>} />
              <Route path="/nurse" element={<Guard id="nurse"><Nurse /></Guard>} />
              <Route path="/driving" element={<Guard id="driving"><Driving /></Guard>} />
              <Route path="/nails" element={<Guard id="nails"><Nails /></Guard>} />
              <Route path="/fruit" element={<Guard id="fruit"><Fruit /></Guard>} />
              <Route path="/pool" element={<Guard id="pool"><Pool /></Guard>} />
              <Route path="/shelf-revenge" element={<Guard id="shelf-revenge"><ShelfRevenge /></Guard>} />
              <Route path="/burger" element={<Guard id="burger"><Burger /></Guard>} />
              <Route path="/food-shrine" element={<Guard id="food-shrine"><FoodShrine /></Guard>} />
              <Route path="/santa" element={<Santa />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="*" element={<Navigate to="/room" replace />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <BottomNav />
      <ToastLayer />
      <SaveIndicator />
      <SparkPops />
      <AchievementBurst />
      <ComedyLayer />
      <UfoFlyby />
      <FinaleOverlay />
      <SettingsModal open={settings} onClose={() => setSettings(false)} />
    </div>
  )
}

function Guard({ id, children }: { id: AreaId; children: ReactNode }) {
  const { save } = useGame()
  if (!isAreaOpen(save, id)) {
    return <LockedGate id={id} hint={areaById(id)?.hint ?? "keep exploring"} />
  }
  return children
}
