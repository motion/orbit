import { throttle } from 'lodash'
import { useCallback, useRef } from 'react'
import { useOnUnmount } from './useOnUnmount'

export function useThrottle() {
  const mounted = useRef(true)

  useOnUnmount(() => {
    mounted.current = false
  })

  return useCallback((fn, amount) => {
    return throttle((...args) => {
      if (!mounted.current) return
      return fn(...args)
    }, amount)
  }, [])
}
