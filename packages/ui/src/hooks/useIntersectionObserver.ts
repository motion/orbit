import { RefObject, useEffect, useRef } from 'react'

export function useIntersectionObserver(
  ref: RefObject<HTMLElement>,
  onIntersection: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) {
  const dispose = useRef<any>(null)

  useEffect(
    () => {
      const node = ref.current
      console.log('observing', node)
      if (!node) return
      const observer = new IntersectionObserver(onIntersection, options)
      observer.observe(node)
      dispose.current = () => {
        observer.disconnect()
      }
      return dispose.current
    },
    [ref.current],
  )

  return () => dispose.current && dispose.current()
}
