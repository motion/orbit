import { useMotionValue } from 'framer-motion'
import { useEffect } from 'react'

/**
 * TODO handle x/y option
 */

export function useScrollProgress({ ref }) {
  const scrollXProgress = useMotionValue(0)

  useEffect(() => {
    function updateCallback(e) {
      const endX = e.target.scrollLeft
      const leftProgress = endX / e.target.scrollWidth

      const right = e.target.clientWidth / e.target.scrollWidth
      const rightExtra = leftProgress / (1 - right)
      // progress = progress * (e.target.clientWidth / e.target.scrollWidth)
      // console.log(rightExtra, leftProgress)
      scrollXProgress.set(rightExtra)
    }
    ref.current.addEventListener('scroll', updateCallback, { passive: true })
  }, [])

  return scrollXProgress
}
