export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T
}

export function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function pickFresh<T>(items: readonly T[], recent: readonly T[]): T {
  const pool = items.filter((item) => !recent.includes(item))
  return pick(pool.length > 0 ? pool : items)
}

export function chance(p: number) {
  return Math.random() < p
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}
