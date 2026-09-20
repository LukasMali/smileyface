import type { ReactNode } from "react"

export function Floating({
  children,
  className = "",
  delay = 0,
  slow = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  slow?: boolean
}) {
  return (
    <div
      className={`${slow ? "anim-float-slow" : "anim-float"} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

export function Scene({
  id,
  className = "",
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={`relative overflow-hidden ${className}`}>
      {children}
    </section>
  )
}

export function Wave({
  fill,
  className = "",
  flip = false,
}: {
  fill: string
  className?: string
  flip?: boolean
}) {
  return (
    <svg
      viewBox="0 0 1440 80"
      className={`relative z-10 block w-full ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        fill={fill}
        d="M0,40 C180,80 280,0 480,32 C680,64 760,8 980,36 C1180,64 1320,16 1440,40 L1440,80 L0,80 Z"
      />
    </svg>
  )
}
