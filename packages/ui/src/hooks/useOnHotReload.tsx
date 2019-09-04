import { useEffect, useRef } from 'react'

/**
 * Called only on hot reloads, not on initial mount
 */
export function useOnHotReload(fn: Function) {
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    fn()
  }, ['hot'])
}
