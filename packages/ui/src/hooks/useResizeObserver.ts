import { EffectCallback, RefObject, useEffect, useRef } from 'react'
import { ResizeObserver, ResizeObserverCallback } from '../ResizeObserver'

export function useResizeObserver(
  props: {
    ref: RefObject<HTMLElement>
    onChange: ResizeObserverCallback
    disable?: boolean
  },
  mountArgs?: any[],
): Function {
  const { ref, onChange, disable } = props
  const dispose = useRef<EffectCallback | null>(null)

  useEffect(
    () => {
      if (disable) return
      if (!ref || !ref.current) return
      let resizeObserver = new ResizeObserver(onChange)
      resizeObserver.observe(ref.current)
      dispose.current = () => {
        resizeObserver.disconnect()
      }
      return dispose.current
    },
    [ref, ...(mountArgs || [])],
  )

  return () => dispose.current && dispose.current()
}
