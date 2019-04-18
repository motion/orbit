import ixo from 'intersection-observer'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useGet } from './useGet'

// dont side effect it away
ixo

export function useIntersectionObserver(
  props: {
    ref: RefObject<HTMLElement>
    onChange?: IntersectionObserverCallback
    options?: IntersectionObserverInit
    disable?: boolean
  },
  mountArgs?: any[],
) {
  const { ref, options, disable } = props
  const getOnChange = useGet(props.onChange)
  const dispose = useRef<any>(null)
  const [state, setState] = useState(null)

  useEffect(() => {
    if (disable) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver((...args) => {
      if (getOnChange()) {
        getOnChange()(...args)
      } else {
        const [entries] = args
        setState(entries)
      }
    }, options)
    observer.observe(node)
    dispose.current = () => {
      observer.disconnect()
    }
    return dispose.current
  }, [ref, disable, JSON.stringify(options), ...(mountArgs || [])])

  if (!props.onChange) {
    return state
  }
}
