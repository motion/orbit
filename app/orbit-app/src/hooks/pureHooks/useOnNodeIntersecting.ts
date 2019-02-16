import { useEffect } from 'react'

export function useOnNodeIntersecting(ref: React.RefObject<HTMLDivElement>, onIntersection) {
  const node = ref.current

  useEffect(
    () => {
      if (!node) return
      const observer = new IntersectionObserver(onIntersection)

      observer.observe(node)

      return () => {
        observer.disconnect()
      }
    },
    [node],
  )
}
