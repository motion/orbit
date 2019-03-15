import { RefObject, useEffect, useRef } from 'react'

export function useIntersectionObserver(
  props: {
    ref: RefObject<HTMLElement>
    onChange: IntersectionObserverCallback
    options?: IntersectionObserverInit
    disable?: boolean
  },
  mountArgs?: any[],
) {
  const { ref, onChange, options, disable } = props
  const dispose = useRef<any>(null)

  useEffect(
    () => {
      if (disable) return
      const node = ref.current
      if (!node) return
      const observer = new IntersectionObserver(onChange, options)
      observer.observe(node)
      dispose.current = () => {
        observer.disconnect()
      }
      return dispose.current
    },
    [ref, disable, ...(mountArgs || [])],
  )

  return () => dispose.current && dispose.current()
}
