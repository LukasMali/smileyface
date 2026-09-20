import { AlienSavings } from "./components/AlienSavings"
import { Aquarium } from "./components/Aquarium"
import { ArtDesk } from "./components/ArtDesk"
import { BurgerZone } from "./components/BurgerZone"
import { DrivingQuest } from "./components/DrivingQuest"
import { EmergencyHappiness } from "./components/EmergencyHappiness"
import { FinalScene } from "./components/FinalScene"
import { Hero } from "./components/Hero"
import { IceCreamScene } from "./components/IceCreamScene"
import { LegendaryMeal } from "./components/LegendaryMeal"
import { NurseScene } from "./components/NurseScene"
import { PersonalityBadges } from "./components/PersonalityBadges"
import { PonyMeadow } from "./components/PonyMeadow"
import { StickerChat } from "./components/StickerChat"
import { PlayLayer } from "./components/ui/PlayLayer"
import { ToastLayer } from "./components/ui/ToastLayer"
import { WorldProvider } from "./hooks/WorldContext"

export default function App() {
  return (
    <WorldProvider>
      <a
        href="#ice-cream"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[90] focus:rounded-full focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to the tiny world
      </a>
      <div className="grain" aria-hidden />
      <main className="overflow-x-hidden">
        <Hero />
        <IceCreamScene />
        <PonyMeadow />
        <ArtDesk />
        <Aquarium />
        <BurgerZone />
        <AlienSavings />
        <NurseScene />
        <DrivingQuest />
        <LegendaryMeal />
        <StickerChat />
        <PersonalityBadges />
        <FinalScene />
      </main>
      <PlayLayer />
      <EmergencyHappiness />
      <ToastLayer />
    </WorldProvider>
  )
}
