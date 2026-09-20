import { Heart } from "lucide-react"
import { useWorld } from "../hooks/WorldContext"
import { KawaiiBlob } from "./characters/KawaiiBlob"
import { Coin, MrAlien } from "./characters/MrAlien"
import { TinyCar } from "./characters/Props"
import { Star } from "./ui/SparkleBurst"

export function EmergencyHappiness() {
  const { celebrate, flyby } = useWorld()

  return (
    <>
      {flyby && (
        <div className="pointer-events-none fixed top-[18%] left-0 z-[60]" style={{ animation: "fly-across 4.8s ease-in-out both" }}>
          <div className="flex items-end gap-1">
            <MrAlien size={90} />
            <svg width="54" height="58" viewBox="0 0 54 58" aria-hidden>
              <path d="M12 10 h30 l6 40 h-42 z" fill="#c4b0ea" stroke="#4a3f55" strokeWidth="1.5" />
              <Coin className="absolute" />
            </svg>
          </div>
        </div>
      )}
      {celebrate && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={`c-${i}`}
              className="absolute top-0"
              style={{
                left: `${4 + i * 5.2}%`,
                animation: `rain-coin ${3.2 + (i % 4) * 0.3}s linear both`,
                animationDelay: `${(i % 6) * 0.18}s`,
              }}
            >
              <Coin size={16 + (i % 3) * 4} />
            </span>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <Heart
              key={`h-${i}`}
              className="absolute bottom-10 h-5 w-5 text-blush-deep"
              style={{
                left: `${8 + i * 9}%`,
                animation: `heart-up ${3.5 + (i % 3) * 0.4}s ease-out both`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={`s-${i}`}
              className="absolute top-12"
              style={{ left: `${10 + i * 11}%`, animation: `twinkle 1s ease-in-out ${i * 0.1}s 4` }}
            >
              <Star size={16} />
            </span>
          ))}
          <div className="absolute bottom-24 left-0" style={{ animation: "drive-by 4.6s ease-in-out both" }}>
            <TinyCar />
          </div>
          <div className="absolute top-24 right-8 anim-bob">
            <KawaiiBlob mood="scream" />
          </div>
          <div className="absolute top-40 left-8 anim-bob">
            <KawaiiBlob mood="yay" />
          </div>
          <div className="absolute bottom-32 right-10 anim-bob">
            <KawaiiBlob mood="thumb" />
          </div>
        </div>
      )}
    </>
  )
}
