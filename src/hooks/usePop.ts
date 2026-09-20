import { useCallback, useState } from "react"

export function usePop(ms = 850) {
  const [on, setOn] = useState(false)
  const trigger = useCallback(() => {
    setOn(true)
    window.setTimeout(() => setOn(false), ms)
  }, [ms])
  return [on, trigger] as const
}
