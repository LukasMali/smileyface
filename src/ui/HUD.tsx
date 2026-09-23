import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { pick } from "../lib/random"
import { useGame } from "../hooks/GameContext"

type TipId = "stars" | "coins" | "happy"

export function HUD({ onOpenSettings }: { onOpenSettings: () => void }) {
  const { save, happiness, play, notify } = useGame()
  const loc = useLocation()
  const nav = useNavigate()
  const atRoom = loc.pathname === "/room" || loc.pathname === "/"
  const [tip, setTip] = useState<{ id: TipId; text: string } | null>(null)

  useEffect(() => {
    if (!tip) return
    const t = window.setTimeout(() => setTip(null), 4500)
    return () => window.clearTimeout(t)
  }, [tip])

  return (
    <header className="hud-bar">
      <div className="flex min-w-0 items-center gap-1.5">
        {!atRoom && (
          <button
            type="button"
            className="hud-round"
            onClick={() => {
              play("click")
              nav("/room")
            }}
            aria-label="back to room"
          >
            <ArrowIcon />
            <span className="max-[459px]:hidden">room</span>
          </button>
        )}
        <Link
          to="/world"
          aria-label="map"
          className="hud-round no-underline"
          onClick={(e) => {
            play("click")
            if (!save.bootDone) {
              e.preventDefault()
              notify("power the PC first. the map is still dreaming.")
            }
          }}
        >
          <MapIcon />
          <span className="max-[459px]:hidden">map</span>
        </Link>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 max-[459px]:gap-1">
        <Chip
          testid="stars"
          label={`${save.stars} stars`}
          tone="bg-butter"
          open={tip?.id === "stars"}
          tip={tip?.id === "stars" ? tip.text : null}
          onClick={() => {
            play("sparkle")
            setTip({ id: "stars", text: pick(STAR_LINES) })
          }}
        >
          <StarIcon /> {save.stars}
        </Chip>
        <Chip
          testid="coins"
          label={`${save.coins} coins`}
          tone="bg-mint"
          open={tip?.id === "coins"}
          tip={tip?.id === "coins" ? tip.text : null}
          onClick={() => {
            play("coin")
            setTip({ id: "coins", text: pick(COIN_LINES) })
          }}
        >
          <CoinIcon /> {save.coins}
        </Chip>
        <HappinessChip
          value={happiness}
          open={tip?.id === "happy"}
          tip={tip?.id === "happy" ? tip.text : null}
          onClick={() => {
            play("chime")
            setTip({ id: "happy", text: pick(HAPPY_LINES) })
          }}
        />
        <button
          type="button"
          className="hit-area flex items-center justify-center rounded-full border-[1.5px] border-ink/10 bg-white px-2.5 py-2 shadow-[0_6px_12px_-10px_rgba(91,68,80,0.9)] transition-transform active:scale-95"
          onClick={() => {
            play("click")
            onOpenSettings()
          }}
          aria-label="settings"
          data-testid="settings-btn"
        >
          <GearIcon />
        </button>
      </div>
    </header>
  )
}

const STAR_LINES = [
  "stars. legally distinct from snacks, unfortunately",
  "tiny sparkly currency. do not eat. we checked",
  "you earned these by being unreasonably charming",
  "star inventory: cute and non-refundable",
] as const

const COIN_LINES = [
  "coins. Mr Alien would like a word",
  "this is the official shiny round food",
  "gold, but make it emotionally supportive",
  "wallet status: a little jingle, a lot of pride",
] as const

const HAPPY_LINES = [
  "the official vibe meter. currently doing its best",
  "happiness, but as a pie chart. very scientific",
  "this bar fills when you do silly kind things",
  "progress: being alive and slightly sparkly",
] as const

function Chip({
  children,
  testid,
  label,
  tone,
  open,
  tip,
  onClick,
}: {
  children: ReactNode
  testid: string
  label: string
  tone: string
  open: boolean
  tip: string | null
  onClick: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  return (
    <span className="relative inline-flex" data-hud-tip>
      <button
        ref={ref}
        type="button"
        data-testid={testid}
        aria-label={label}
        aria-expanded={open}
        className={`pill ${tone} cursor-pointer px-2 text-[0.82rem]`}
        onClick={onClick}
      >
        {children}
      </button>
      <HudTip open={open} text={tip} anchor={ref} />
    </span>
  )
}

function HappinessChip({
  value,
  open,
  tip,
  onClick,
}: {
  value: number
  open: boolean
  tip: string | null
  onClick: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const r = 9
  const c = 2 * Math.PI * r
  return (
    <span className="relative inline-flex" data-hud-tip>
      <button
        ref={ref}
        type="button"
        data-testid="happiness"
        aria-label={`happiness ${value} percent`}
        aria-expanded={open}
        className="pill cursor-pointer bg-blush gap-1.5 px-2 text-[0.82rem]"
        onClick={onClick}
      >
        <span className="relative inline-flex h-[22px] w-[22px] items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r={r} fill="none" stroke="#fff" strokeWidth="4" />
            <motion.circle
              cx="12"
              cy="12"
              r={r}
              fill="none"
              stroke="#ef6b92"
              strokeWidth="4"
              strokeLinecap="round"
              transform="rotate(-90 12 12)"
              strokeDasharray={c}
              initial={false}
              animate={{ strokeDashoffset: c * (1 - Math.max(0, Math.min(100, value)) / 100) }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </svg>
        </span>
        <span className="max-[359px]:hidden">{value}%</span>
      </button>
      <HudTip open={open} text={tip} anchor={ref} />
    </span>
  )
}

function HudTip({
  open,
  text,
  anchor,
}: {
  open: boolean
  text: string | null
  anchor: RefObject<HTMLElement | null>
}) {
  const [pos, setPos] = useState({ top: 52, left: 0 })

  useLayoutEffect(() => {
    if (!open) return
    const el = anchor.current
    if (!el) return
    const r = el.getBoundingClientRect()
    let left = r.left
    const room = Math.min(220, window.innerWidth - 16)
    if (left + room > window.innerWidth - 8) left = Math.max(8, window.innerWidth - 8 - room)
    if (left < 8) left = 8
    setPos({ top: r.bottom + 8, left })
  }, [open, text, anchor])

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {open && text && (
        <motion.p
          role="status"
          data-testid="hud-tip"
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 200 }}
          className="m-0 w-max max-w-[min(13.5rem,calc(100vw-1.4rem))] rounded-2xl border-[1.5px] border-ink/10 bg-white px-2.5 py-1.5 text-left font-hand text-[0.72rem] leading-snug text-ink shadow-[0_12px_22px_-14px_rgba(91,68,80,0.95)] sm:text-sm"
        >
          {text}
        </motion.p>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function BottomNav() {
  const loc = useLocation()
  const { play, save, notify } = useGame()
  const hidden = useHideOnScroll()
  const items = [
    { to: "/room", label: "room", icon: <HomeIcon /> },
    { to: "/world", label: "map", icon: <MapIcon /> },
    { to: "/achievements", label: "trophies", icon: <TrophyIcon /> },
  ]
  return (
    <motion.nav
      className="bottom-nav"
      aria-label="main"
      animate={{ y: hidden ? 90 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      style={{ pointerEvents: hidden ? "none" : "auto" }}
    >
      {items.map((it) => {
        const active = loc.pathname === it.to
        return (
          <Link
            key={it.to}
            to={it.to}
            onClick={(e) => {
              play("click")
              if (!save.bootDone && it.to !== "/room") {
                e.preventDefault()
                notify("power the PC first. everything else is still stretching.")
              }
            }}
            aria-current={active ? "page" : undefined}
            className={`hit-area relative flex min-w-[3.8rem] flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-1.5 font-hand text-[0.78rem] no-underline transition-colors ${
              active ? "text-ink" : "text-ink-soft"
            }`}
          >
            {active && (
              <motion.span
                layoutId="nav-bubble"
                className="absolute inset-0 rounded-full bg-gradient-to-b from-blush to-blush-deep"
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              />
            )}
            <span className="relative">{it.icon}</span>
            <span className="relative">{it.label}</span>
          </Link>
        )
      })}
    </motion.nav>
  )
}

/** the floating nav tucks itself away while you scroll down, so it never sits on top of a mini-game */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    let idle = 0
    const onScroll = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      const nearBottom = max - y < 40
      if (!nearBottom && y > last + 6 && y > 60) setHidden(true)
      else if (nearBottom || y < last - 6) setHidden(false)
      last = y
      window.clearTimeout(idle)
      idle = window.setTimeout(() => setHidden(false), 900)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.clearTimeout(idle)
    }
  }, [])
  return hidden
}

/* ---------- tiny icon set, all one visual family ---------- */

function StarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path
        d="M10 2l2.5 5.2 5.5.8-4 3.9 1 5.6L10 14.8 4.9 17.5l1-5.6-4-3.9 5.5-.8z"
        fill="#ffd85e"
        stroke="#5b4450"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CoinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10" r="8" fill="#f7d774" stroke="#5b4450" strokeWidth="1.3" />
      <circle cx="10" cy="10" r="4.6" fill="none" stroke="#fff6d6" strokeWidth="1.5" />
    </svg>
  )
}

function MapIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className="block" aria-hidden>
      <path d="M2.5 5.5l5-2 5 2 5-2v13l-5 2-5-2-5 2z" fill="#d3f4e0" stroke="#5b4450" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M7.5 3.5v13M12.5 5.5v13" stroke="#5b4450" strokeWidth="1.1" opacity="0.6" />
    </svg>
  )
}

function HomeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path d="M3 9.5L10 3l7 6.5V17H3z" fill="#ffe6c4" stroke="#5b4450" strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="8" y="12" width="4" height="5" rx="1" fill="#ff8fae" stroke="#5b4450" strokeWidth="1" />
    </svg>
  )
}

function TrophyIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path d="M6 3h8v5a4 4 0 0 1-8 0z" fill="#ffd85e" stroke="#5b4450" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6 4H3.5A3 3 0 0 0 6 7.5M14 4h2.5A3 3 0 0 1 14 7.5" fill="none" stroke="#5b4450" strokeWidth="1.2" />
      <path d="M7 17h6l-1-3H8z" fill="#ffd85e" stroke="#5b4450" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function GearIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10" r="3.2" fill="#ffdbe6" stroke="#5b4450" strokeWidth="1.3" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <rect key={a} x="9" y="1.6" width="2" height="3.4" rx="1" fill="#5b4450" transform={`rotate(${a} 10 10)`} />
      ))}
    </svg>
  )
}

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="block" aria-hidden>
      <path d="M9.8 3.2 4.8 8l5 4.8" fill="none" stroke="#5b4450" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
