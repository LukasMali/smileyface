export type NikkiPose = "sit" | "sleep" | "walk" | "stretch" | "stand" | "spin" | "nurse"

export function Nikki({
  pose = "sit",
  size = 120,
  className = "",
  harness = true,
}: {
  pose?: NikkiPose
  size?: number
  className?: string
  harness?: boolean
}) {
  const w = pose === "sleep" ? size * 1.15 : size
  const h = pose === "sleep" ? size * 0.72 : size * 0.92
  return (
    <svg
      width={w}
      height={h}
      viewBox={pose === "sleep" ? "0 0 160 100" : "0 0 140 130"}
      className={`nini-art ${className}`}
      aria-hidden
    >
      {pose === "sleep" ? <Sleeping harness={harness} /> : <Standing pose={pose} harness={harness} />}
    </svg>
  )
}

function Standing({ pose, harness }: { pose: NikkiPose; harness: boolean }) {
  const walk = pose === "walk"
  return (
    <g>
      <ellipse cx="70" cy="118" rx="32" ry="7" fill="#4a3f55" opacity="0.14" />
      <g className={walk ? "nini-walk" : undefined}>
        <path d="M48 96 q-4 16 -2 22" stroke="#f4efe6" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M62 98 q0 16 2 22" stroke="#f4efe6" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M78 98 q2 16 0 22" stroke="#2b2424" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M90 96 q6 16 4 22" stroke="#2b2424" strokeWidth="7" strokeLinecap="round" fill="none" />
        <ellipse cx="46" cy="118" rx="5" ry="3.2" fill="#f4efe6" />
        <ellipse cx="64" cy="120" rx="5" ry="3.2" fill="#f4efe6" />
        <ellipse cx="80" cy="120" rx="5" ry="3.2" fill="#1d1717" />
        <ellipse cx="96" cy="118" rx="5" ry="3.2" fill="#1d1717" />
      </g>
      <g className="nini-tail">
        <path d="M38 78 q-18 -10 -16 8 q6 10 16 4" fill="#1b1515" stroke="#3a2c2c" strokeWidth="1.2" />
      </g>
      <ellipse cx="72" cy="82" rx="34" ry="26" fill="#1b1515" stroke="#3a2c2c" strokeWidth="1.5" />
      <ellipse cx="72" cy="88" rx="28" ry="18" fill="#2a2222" />
      {harness && (
        <g>
          <path d="M46 78 q26 16 52 0" stroke="#ff8fab" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="72" cy="90" r="3.5" fill="#fff" stroke="#e56b8a" strokeWidth="1.2" />
        </g>
      )}
      {pose === "nurse" && (
        <g transform="translate(52 40)">
          <rect x="0" y="0" width="36" height="12" rx="3" fill="#fff" stroke="#4a3f55" strokeWidth="1.2" />
          <rect x="14" y="-6" width="8" height="10" fill="#fff" stroke="#4a3f55" strokeWidth="1.2" />
          <rect x="16.5" y="2" width="3" height="8" fill="#ff8fab" />
          <rect x="13" y="4.5" width="10" height="3" fill="#ff8fab" />
        </g>
      )}
      <g transform={pose === "stretch" ? "translate(0 -6) rotate(-8 70 58)" : undefined}>
        <Head />
      </g>
      {pose === "spin" && <ellipse cx="70" cy="70" rx="50" ry="8" fill="#ffd6e0" opacity="0.25" />}
    </g>
  )
}

function Sleeping({ harness }: { harness: boolean }) {
  return (
    <g>
      <ellipse cx="84" cy="86" rx="48" ry="12" fill="#4a3f55" opacity="0.1" />
      <ellipse cx="86" cy="72" rx="46" ry="22" fill="#1b1515" stroke="#3a2c2c" strokeWidth="1.5" />
      <ellipse cx="48" cy="74" rx="16" ry="12" fill="#f3eee8" />
      <path d="M34 70 q8 10 22 8" fill="#efe8df" />
      <ellipse cx="118" cy="70" rx="14" ry="16" fill="#1b1515" stroke="#3a2c2c" strokeWidth="1.3" />
      <path d="M118 56 q8 -16 16 -8 q-4 14 -16 18" fill="#1b1515" stroke="#3a2c2c" strokeWidth="1.2" />
      <path d="M112 54 q4 -14 14 -8" fill="#c9b8a8" />
      <ellipse cx="44" cy="62" rx="7" ry="12" fill="#1b1515" />
      <ellipse cx="44" cy="62" rx="3" ry="6" fill="#c9b8a8" />
      <path d="M52 68 q10 6 20 2" stroke="#2a2430" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <ellipse cx="58" cy="76" rx="4.2" ry="3.2" fill="#2a2430" />
      <ellipse cx="59" cy="75" rx="1.4" ry="0.8" fill="#fff" opacity="0.5" />
      <circle cx="72" cy="82" r="1.4" fill="#ffb3c6" opacity="0.7" />
      {harness && <path d="M70 62 q20 10 40 2" stroke="#ff8fab" strokeWidth="4" fill="none" strokeLinecap="round" />}
      <text x="128" y="40" fill="#6b5d78" fontFamily="Patrick Hand" fontSize="14">
        z
      </text>
      <text x="138" y="28" fill="#6b5d78" fontFamily="Patrick Hand" fontSize="10">
        z
      </text>
    </g>
  )
}

function Head() {
  return (
    <g>
      <ellipse cx="52" cy="42" rx="10" ry="18" fill="#1b1515" stroke="#3a2c2c" strokeWidth="1.3" />
      <ellipse cx="52" cy="42" rx="4.5" ry="9" fill="#c9b8a8" />
      <ellipse cx="90" cy="40" rx="10" ry="18" fill="#1b1515" stroke="#3a2c2c" strokeWidth="1.3" />
      <ellipse cx="90" cy="40" rx="4.5" ry="9" fill="#c9b8a8" />
      <ellipse cx="71" cy="58" rx="28" ry="24" fill="#1b1515" stroke="#3a2c2c" strokeWidth="1.5" />
      <ellipse cx="71" cy="68" rx="20" ry="14" fill="#efe8df" />
      <path d="M54 62 q17 14 34 0" fill="#f7f1ea" />
      <ellipse cx="60" cy="58" rx="6.5" ry="7.5" fill="#1a1410" />
      <ellipse cx="82" cy="58" rx="6.5" ry="7.5" fill="#1a1410" />
      <ellipse cx="61.6" cy="56.2" rx="2.2" ry="2.6" fill="#fff" />
      <ellipse cx="83.6" cy="56.2" rx="2.2" ry="2.6" fill="#fff" />
      <ellipse cx="58.8" cy="60.5" rx="1.4" ry="1" fill="#fff" opacity="0.55" />
      <ellipse cx="71" cy="74" rx="6.5" ry="4.8" fill="#2a2430" />
      <ellipse cx="71" cy="73" rx="3.2" ry="2.2" fill="#4a3f55" />
      <ellipse cx="69" cy="72" rx="1.1" ry="0.7" fill="#fff" opacity="0.4" />
      <path d="M71 78 q0 4 0 5" stroke="#2a2430" strokeWidth="1.2" />
      <path d="M71 83 q-6 4 -10 2" stroke="#2a2430" strokeWidth="1.1" fill="none" />
      <path d="M71 83 q6 4 10 2" stroke="#2a2430" strokeWidth="1.1" fill="none" />
      <circle cx="58" cy="72" r="3.2" fill="#f5b8c8" opacity="0.55" />
      <circle cx="84" cy="72" r="3.2" fill="#f5b8c8" opacity="0.55" />
      <path d="M48 50 q6 -4 10 2" stroke="#cfc3b6" strokeWidth="1" fill="none" opacity="0.7" />
      <path d="M84 50 q6 -4 10 2" stroke="#cfc3b6" strokeWidth="1" fill="none" opacity="0.7" />
    </g>
  )
}

export function NikkiButton({
  pose,
  size,
  label,
  onPet,
  className = "",
}: {
  pose?: NikkiPose
  size?: number
  label: string
  onPet: () => void
  className?: string
}) {
  return (
    <button type="button" className={`hit-area nini-hot ${className}`} aria-label={label} onClick={onPet}>
      <Nikki pose={pose} size={size} />
    </button>
  )
}
