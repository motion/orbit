import { RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useVisibility } from '../Visibility'
import { useDebounce } from './useDebounce'
import { useGet } from './useGet'
import { useIntersectionObserver } from './useIntersectionObserver'
import { useMutationObserver } from './useMutationObserver'
import { useResizeObserver } from './useResizeObserver'

export type Rect = {
  width: number
  height: number
  top: number
  left: number
}

export function getRect(o: any): Rect {
  return { width: +o.width, height: +o.height, left: +o.left, top: +o.top }
}

type UsePositionProps = {
  ref: RefObject<HTMLElement>
  measureKey?: any
  onChange?: ((change: Rect | null) => any) | null
  preventMeasure?: boolean
  debounce?: number
}

export function usePosition(props: UsePositionProps, mountArgs: any[] = []) {
  const { measureKey, ref, preventMeasure, debounce = 100 } = props
  const [pos, setPos] = useState<Rect | null>(null)
  const onChange = useGet(props.onChange || setPos)
  const disable = useVisibility() === false
  const intersected = useRef(false)
  const getState = useGet({ disable, preventMeasure })
  const measureImmediate = useCallback(
    (nodeRect?) => {
      const state = getState()
      if (state.preventMeasure) return
      const set = onChange()
      if (!set) return
      const node = ref.current
      if (!nodeRect) {
        if (node) {
          if (node.offsetWidth === 0 && node.offsetHeight === 0) {
            // not visible in dom yet
            return
          }
          const { top, left, width, height } = node.getBoundingClientRect()
          if (isNaN(top)) {
            debugger
          }
          set({ top, left, width, height })
        } else {
          set(null)
        }
        return
      }
      if (!node) return
      if (!intersected.current) return
      const visible = state.disable === false || !isVisible(node)
      if (!visible) {
        return
      }
      const rect = getRect(nodeRect || node.getBoundingClientRect())
      if (isNaN(rect.top)) {
        debugger
      }
      set(rect)
    },
    [ref],
  )

  useLayoutEffect(measureImmediate, [
    ref.current ? ref.current.offsetWidth : 0,
    ref.current ? ref.current.offsetHeight : 0,
  ])

  const measure = useDebounce(measureImmediate, debounce)

  useResizeObserver({
    ref,
    onChange: entries => measure(entries[0].contentRect),
    disable,
  })

  useEffect(() => {
    window.addEventListener('resize', () => measure())
    return () => {
      window.removeEventListener('resize', () => measure())
    }
  }, [])

  useMutationObserver({
    disable,
    ref,
    options: { attributes: true, childList: true },
    onChange: measure,
  })

  useIntersectionObserver({
    disable,
    ref,
    onChange: entries => {
      if (!entries) return
      const [entry] = entries
      if (entry.isIntersecting) {
        intersected.current = true
        measure(entry.boundingClientRect)
      }
      // disabled this because it doesnt make sense unless under a flag
      // else {
      //   intersected.current = false
      //   measure(false)
      // }
    },
  })

  useEffect(measure, [ref, measureKey, ...mountArgs])

  useEffect(() => {
    if (disable) {
      measure(false)
    }
  }, [disable])

  return pos
}

function isVisible(ele) {
  const style = window.getComputedStyle(ele)
  return (
    style.width !== '0' &&
    style.height !== '0' &&
    style.opacity !== '0' &&
    style.display !== 'none' &&
    style.visibility !== 'hidden'
  )
}
