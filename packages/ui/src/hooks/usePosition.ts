import { RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { elementOffset } from '../helpers/elementOffset'
import { useVisibility } from '../Visibility'
import { useDebounce } from './useDebounce'
import { useGet } from './useGet'
import { useMutationObserver } from './useMutationObserver'
import { useResizeObserver } from './useResizeObserver'

export type Rect = {
  width: number
  height: number
  top: number
  left: number
}

export function getRect(o: any): Rect {
  if (!('width' in o)) {
    debugger
  }
  return { width: +o.width, height: +o.height, left: +o.left, top: +o.top }
}

type UsePositionProps = {
  ref: RefObject<HTMLElement>
  measureKey?: any
  onChange?: ((change: Rect | null) => any) | null
  preventMeasure?: boolean
  debounce?: number
  onlyWhenIntersecting?: boolean
}

export function usePosition(props: UsePositionProps, mountArgs: any[] = []) {
  const { measureKey, ref, preventMeasure, debounce = 100 } = props
  const [pos, setPos] = useState<Rect | null>(null)
  const onChange = useGet(props.onChange || setPos)
  const disable = useVisibility() === false
  const state = useRef({
    intersected: false,
    lastPos: null,
  })
  const getStatus = useGet({ disable, preventMeasure })
  const measureImmediate = useCallback(
    (nodeRect?) => {
      const status = getStatus()
      if (status.preventMeasure) return
      const changeFn = onChange()
      const set = next => {
        state.current.lastPos = next
        changeFn(next)
      }
      const node = ref.current
      if (!node) return
      if (props.onlyWhenIntersecting) {
        if (!state.current.intersected) return
      }
      if (status.disable) return

      const measure = node =>
        requestAnimationFrame(() => {
          const { width, height } = node.getBoundingClientRect()
          // we need offset from top of document not relative...
          const { top, left } = elementOffset(node)
          set({ top, left, width, height })
        })

      if (!nodeRect) {
        if (node) {
          if (node.offsetWidth === 0 && node.offsetHeight === 0) {
            // not visible in dom yet
            return
          }
          measure(node)
        }
        return
      }

      if (nodeRect instanceof HTMLElement) measure(node)
      if (!nodeRect) measure(node)
      set(getRect(nodeRect))
    },
    [ref],
  )

  useLayoutEffect(measureImmediate, [ref.current])

  const measure = useDebounce(measureImmediate, debounce, { trailing: true })

  useResizeObserver({
    ref,
    onChange: entries => {
      const rect = getRect(entries[0].contentRect)
      // bugfix stupid thing
      const lastPos = state.current.lastPos
      if (lastPos) {
        if (rect.top === 0) rect.top = lastPos.top || 0
        if (rect.left === 0) rect.left = lastPos.top || 0
      }
      measure(rect)
    },
    disable,
  })

  useMutationObserver({
    disable,
    ref,
    options: { attributes: true, childList: true },
    onChange: () => {
      console.log('via mutationObserver')
      measure()
    },
  })

  // this will return invalid top/left (relative to viewport not relative to document...)
  // useIntersectionObserver({
  //   disable,
  //   ref,
  //   options: {
  //     threshold: 0,
  //   },
  //   onChange: entries => {
  //     if (!entries) return
  //     const [entry] = entries
  //     state.current.intersected = entry.isIntersecting
  //     measure(entry.boundingClientRect)
  //   },
  // })

  useLayoutEffect(measure, [ref, measureKey, ...mountArgs])

  useEffect(() => {
    if (disable) {
      measure(false)
    }
  }, [disable])

  return pos
}
