import { isEqual } from '@o/fast-compare'
import { useEffect, useRef, useState } from 'react'
import { ResizeObserver } from '../ResizeObserver'

export function useComponentSize() {
  const [state, setState] = useState({ width: 0, height: 0 })
  const measureRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = measureRef.current
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      const next = { width, height }
      if (!isEqual(next, state)) {
        setState(next)
      }
    })
    observer.observe(node)
    return () => {
      observer.disconnect()
    }
  })

  return {
    ...state,
    measureRef,
  }
}
