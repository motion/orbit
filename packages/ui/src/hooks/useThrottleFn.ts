import { useCallback, useRef } from 'react'

export function useThrottleFn<Args extends any[], Returns extends any>(
  fn: (...args: Args) => Returns,
  props: { amount: number; ignoreFirst?: boolean },
  mountArgs?: any[],
) {
  const last = useRef(null)
  const tm = useRef(null)
  const throttledFn = (...args: Args): Returns => {
    clearTimeout(tm.current)
    const now = Date.now()
    const since = now - last.current
    last.current = now
    if (since > props.amount) {
      if (props.ignoreFirst) return
      fn(...args)
    } else {
      tm.current = setTimeout(() => fn(...args), since)
    }
  }
  return useCallback(throttledFn as any, mountArgs || [fn])
}
