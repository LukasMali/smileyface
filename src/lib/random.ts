export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T
}

export function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}
