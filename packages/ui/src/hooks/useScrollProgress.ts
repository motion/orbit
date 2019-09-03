import { useMotionValue } from 'framer-motion'
import { useEffect } from 'react'

/**
 * TODO handle x/y option
 */

export function useScrollProgress({ ref }) {
  const scrollXProgress = useMotionValue(0)

  useEffect(() => {
    function updateCallback(e) {
      scrollXProgress.set(e.target.scrollLeft / e.target.clientWidth)
    }
    ref.current.addEventListener('scroll', updateCallback, { passive: true })
  }, [])

  return scrollXProgress
}
