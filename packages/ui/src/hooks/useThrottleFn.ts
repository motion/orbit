import { useCallback, useRef } from 'react'

export function useThrottleFn(fn: any, amount = 0, mountArgs?: any[]) {
  const last = useRef(null)
  const tm = useRef(null)
  return useCallback((...args) => {
    clearTimeout(tm.current)
    const now = Date.now()
    const since = now - last.current
    last.current = now
    if (since > amount) {
      console.log('now')
      fn(...args)
    } else {
      console.log('throttle')
      tm.current = setTimeout(() => fn(...args), since)
    }
  }, mountArgs || [fn])
}
