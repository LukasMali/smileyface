export function SparkleBurst({ active }: { active: boolean }) {
  if (!active) return null
  const bits = [0, 1, 2, 3, 4, 5, 6, 7]
  return (
    <span className="pointer-events-none absolute inset-0 z-10 overflow-visible" aria-hidden>
      {bits.map((i) => (
        <span
          key={i}
          className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-butter"
          style={{
            boxShadow: "0 0 6px #fff3c4",
            animation: `spark-out-${i} 0.7s ease-out forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes spark-out-0 { to { transform: translate(28px, -6px) scale(0); opacity: 0; } }
        @keyframes spark-out-1 { to { transform: translate(18px, 24px) scale(0); opacity: 0; } }
        @keyframes spark-out-2 { to { transform: translate(-22px, 18px) scale(0); opacity: 0; } }
        @keyframes spark-out-3 { to { transform: translate(-30px, -10px) scale(0); opacity: 0; } }
        @keyframes spark-out-4 { to { transform: translate(4px, -32px) scale(0); opacity: 0; } }
        @keyframes spark-out-5 { to { transform: translate(32px, 16px) scale(0); opacity: 0; } }
        @keyframes spark-out-6 { to { transform: translate(-8px, 30px) scale(0); opacity: 0; } }
        @keyframes spark-out-7 { to { transform: translate(-16px, -28px) scale(0); opacity: 0; } }
      `}</style>
    </span>
  )
}

export function Star({
  className = "",
  size = 14,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`anim-twinkle ${className}`}
      aria-hidden
    >
      <path
        fill="#fff3c4"
        stroke="#e8d48a"
        strokeWidth="1"
        d="M12 2.4l2.1 6.4h6.7l-5.4 3.9 2.1 6.4L12 15.2 6.5 19.1l2.1-6.4L3.2 8.8h6.7z"
      />
    </svg>
  )
}
