import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

import { useVisibility } from '../Visibility'
import { useDebounce } from './useDebounce'
import { useGet } from './useGet'
import { useIntersectionObserver } from './useIntersectionObserver'
import { useResizeObserver } from './useResizeObserver'

export type Rect = {
  width: number
  height: number
  top: number
  left: number
}

export function getRect(o: any) {
  return { width: o.width, height: o.height, left: o.left, top: o.top }
}

type UseScreenPositionProps = {
  ref: RefObject<HTMLElement>
  onChange?: ((change: { rect: Rect | undefined; visible: boolean }) => any) | null
  preventMeasure?: boolean
  debounce?: number
}

export function useScreenPosition(props: UseScreenPositionProps, mountArgs: any[] = []) {
  const [pos, setPos] = useState(null)
  const { ref, preventMeasure, debounce = 100 } = props
  const onChange = useGet(props.onChange || setPos)
  const disable = useVisibility() === false
  const intersected = useRef(false)
  const getState = useGet({ disable, preventMeasure })

  const measureRaw = useCallback(
    (nodeRect?) => {
      const state = getState()
      if (state.preventMeasure) return
      const callback = onChange()
      if (!callback) return
      if (nodeRect === false) {
        callback({ visible: false, rect: null })
        return
      }
      const node = ref.current
      if (!node) return
      if (!intersected.current) return
      const visible = state.disable === false || !isVisible(node)
      if (!visible) {
        return
      }
      const rect = getRect(nodeRect || node.getBoundingClientRect())
      callback({ visible, rect })
    },
    [ref],
  )
  const measure = useDebounce(measureRaw, debounce)

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
  })

  // useMutationObserver({
  //   disable,
  //   ref,
  //   options: { attributes: true },
  //   onChange: measure,
  // })

  useIntersectionObserver({
    disable,
    ref,
    onChange: entries => {
      if (!entries) return
      const [entry] = entries
      if (entry.isIntersecting) {
        intersected.current = true
        measure(entry.boundingClientRect)
      } else {
        intersected.current = false
        measure(false)
      }
    },
  })

  useEffect(measure, [ref, ...mountArgs])

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
