import { MotionValue, useMotionValue } from 'framer-motion'
import { RefObject, useEffect } from 'react'

// TODO handle x/y option

/**
 * Returns the scroll progress as a 0-1 value based on how far it's scrolled
 * Where 0 is the beginning and 1 is the end.
 */
export function useScrollProgress({
  ref,
  motionValue,
}: {
  ref: RefObject<HTMLElement>
  motionValue?: MotionValue<number>
}) {
  const scrollXProgress = motionValue || useMotionValue(0)

  useEffect(() => {
    function updateCallback(e) {
      const endX = e.target.scrollLeft
      const leftProgress = endX / e.target.scrollWidth
      const right = e.target.clientWidth / e.target.scrollWidth
      const progress = leftProgress / (1 - right)
      scrollXProgress.set(progress)
    }
    ref.current && ref.current.addEventListener('scroll', updateCallback, { passive: true })
    return () => {
      ref.current && ref.current.removeEventListener('scroll', updateCallback)
    }
  }, [ref.current])

  return scrollXProgress
}

/**
 * Returns a value from 0-(more than 1) based on scroll position
 * Useful for passing in an index and finding offset, easier for some animations.
 */
export function useScrollOffset({ ref }) {
  const scrollXProgress = useMotionValue(0)

  useEffect(() => {
    function updateCallback(e) {
      scrollXProgress.set(e.target.scrollLeft / e.target.clientWidth)
    }
    ref.current && ref.current.addEventListener('scroll', updateCallback, { passive: true })
    return () => {
      ref.current && ref.current.removeEventListener('scroll', updateCallback)
    }
  }, [ref.current])

  return scrollXProgress
}
