import { RefObject, useEffect, useRef } from 'react'
import { useRefGetter } from './useRefGetter'

export function useIntersectionObserver(
  props: {
    ref: RefObject<HTMLElement>
    onChange: IntersectionObserverCallback
    options?: IntersectionObserverInit
    disable?: boolean
  },
  mountArgs?: any[],
) {
  const { ref, options, disable } = props
  const onChange = useRefGetter(props.onChange)
  const dispose = useRef<any>(null)

  useEffect(
    () => {
      if (disable) return
      const node = ref.current
      if (!node) return
      const observer = new IntersectionObserver((...args) => {
        onChange()(...args)
      }, options)
      observer.observe(node)
      dispose.current = () => {
        observer.disconnect()
      }
      return dispose.current
    },
    [ref, disable, JSON.stringify(options), ...(mountArgs || [])],
  )

  return () => dispose.current && dispose.current()
}
