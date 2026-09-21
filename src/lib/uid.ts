let n = 0

export function uid(prefix = "id") {
  n += 1
  return `${prefix}-${n}-${Math.floor(Math.random() * 1e6).toString(36)}`
}
