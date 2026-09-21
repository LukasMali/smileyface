import type { ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useGame } from "../hooks/GameContext"

export function HUD({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { save, happiness, play } = useGame()
  const loc = useLocation()
  const nav = useNavigate()
  const hideBack = loc.pathname === "/room" || loc.pathname === "/"

  return (
    <header className="hud-bar">
      <div className="flex items-center gap-2">
        {!hideBack && (
          <button
            type="button"
            className="hit-area rounded-full bg-white/90 px-3 py-1.5 font-hand text-sm"
            onClick={() => {
              play("click")
              nav("/room")
            }}
            aria-label="back to room"
          >
            ← room
          </button>
        )}
        <Link
          to="/world"
          className="hit-area rounded-full bg-white/90 px-3 py-1.5 font-hand text-sm text-ink no-underline"
          onClick={() => play("click")}
        >
          map
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <Chip testid="stars" label={`${save.stars} stars`}>
          ⭐ {save.stars}
        </Chip>
        <Chip testid="coins" label={`${save.coins} coins`}>
          💰 {save.coins}
        </Chip>
        <Chip testid="happiness" label={`happiness ${happiness} percent`}>
          💗 {happiness}%
        </Chip>
        <button
          type="button"
          className="hit-area rounded-full bg-white/90 px-3 py-1.5 font-hand text-sm"
          onClick={() => {
            play("click")
            onOpenSettings()
          }}
          aria-label="settings"
          data-testid="settings-btn"
        >
          ☰
        </button>
      </div>
    </header>
  )
}

function Chip({
  children,
  testid,
  label,
}: {
  children: ReactNode
  testid: string
  label: string
}) {
  return (
    <span
      data-testid={testid}
      aria-label={label}
      className="rounded-full border border-ink/10 bg-white/90 px-2.5 py-1 font-hand text-sm text-ink"
    >
      {children}
    </span>
  )
}

export function BottomNav() {
  const loc = useLocation()
  const { play } = useGame()
  const items = [
    { to: "/room", label: "room" },
    { to: "/world", label: "map" },
    { to: "/achievements", label: "trophies" },
  ]
  return (
    <nav className="bottom-nav" aria-label="main">
      {items.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          onClick={() => play("click")}
          className={`hit-area min-w-[4.5rem] rounded-full px-3 py-2 text-center font-hand text-sm no-underline ${
            loc.pathname === it.to ? "bg-blush text-ink" : "bg-white/80 text-ink"
          }`}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  )
}
