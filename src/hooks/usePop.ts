import { useCallback, useEffect, useRef, useState } from "react"

export function usePop(ms = 850) {
  const [on, setOn] = useState(false)
  const t = useRef<number | null>(null)
  const trigger = useCallback(() => {
    setOn(true)
    if (t.current) window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setOn(false), ms)
  }, [ms])
  useEffect(() => () => {
    if (t.current) window.clearTimeout(t.current)
  }, [])
  return [on, trigger] as const
}
